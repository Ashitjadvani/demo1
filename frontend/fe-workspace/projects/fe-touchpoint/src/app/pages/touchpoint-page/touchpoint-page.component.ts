import { DatePipe, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CameraAvailable, CameraType, QrScannerComponent } from 'projects/fe-common/src/lib/components/qr-scanner/qr-scanner.component';
import { Site, SITE_STATE } from 'projects/fe-common/src/lib/models/admin/site';
import { UserDailyActivity } from 'projects/fe-common/src/lib/models/admin/user-daily-activity';
import { LOG_LEVEL } from 'projects/fe-common/src/lib/models/log-event';
import { TouchPoint, TouchPointSettings } from 'projects/fe-common/src/lib/models/touchpoint';
import { USER_BOOK_TYPE } from 'projects/fe-common/src/lib/models/user-request-book';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { LogManagementService } from 'projects/fe-common/src/lib/services/log-management.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { ServerSettingsManagementService } from 'projects/fe-common/src/lib/services/server-settings-management.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { TouchpointManagementService } from 'projects/fe-common/src/lib/services/touchpoint-management.service';
import { UserActionService, USER_ACTIVITY_TYPE } from 'projects/fe-common/src/lib/services/user-action.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { v4 as uuidv4 } from 'uuid';
import { timer } from 'rxjs';
import { CoreService } from 'projects/fe-common/src/lib/services/core.service';
import { UserActionManagementService } from 'projects/fe-common/src/lib/services/user-action-management.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
    selector: 'app-touchpoint-page',
    templateUrl: './touchpoint-page.component.html',
    styleUrls: ['./touchpoint-page.component.scss']
})
export class TouchpointPageComponent implements OnInit {
    @ViewChild('scanner') qrScanner: QrScannerComponent;

    KEEP_ALIVE_INTERVAL = 60;   // keep-alive every 5min
    keepAliveCounter: number = 0;
    availableDevices: CameraAvailable[] = [
        { name: 'Front Camera', type: CameraType.Front },
        { name: 'Back Camera', type: CameraType.Back }
    ];

    datePipe: DatePipe;

    siteKey: string;
    siteQR: string;
    qrLevel: string = 'Q';

    currentDevice: MediaDeviceInfo = null;
    preferredDevice: MediaDeviceInfo = null;
    hasPermission: boolean;
    enableScan: boolean = false;

    touchPointId: string = "";
    showSplash: boolean = false;

    welcomeMessage: string;
    dateTimeMessage: string;
    actionMessage: string;
    finalMessage: string;

    backgroundColor: string;
    siteText: string;
    siteClock: string;
    siteDate: string;
    siteStatus: SITE_STATE;

    defaultCamera: string;
    currentDeviceId: string;
    currentCamera: CameraType = CameraType.Back;
    showCameraSelection: boolean = false;

    showStatusBar: boolean = false;
    statusBarMessage: string = '';

    startedAt: Date;
    officeInCount: number = 0;
    officeOutCount: number = 0;
    touchPointSettings: TouchPointSettings;

    showVisitorsQR: boolean = false;
    visitorsQR: string;

    processingScan: boolean = false;

    firstBoot: boolean;
    currentTouchpoint: TouchPoint;

    constructor(@Inject(DOCUMENT) private document: any,
        private userManagementService: UserManagementService,
        private activatedRoute: ActivatedRoute,
        private notifyManagementService: NotifyManagementService,
        private settingsManagementService: SettingsManagementService,
        private userActionService: UserActionService,
        private userActionManagementService: UserActionManagementService,
        private logManagement: LogManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private touchPointManagementService: TouchpointManagementService,
        private _settingsManagementService: SettingsManagementService,
        private commonService: CommonService,
        private coreService: CoreService,
        public translate: TranslateService,
        private _swUpdate: SwUpdate,
        private serverSettingsManagementService: ServerSettingsManagementService) {
        this.showCameraSelection = false;
        this.datePipe = new DatePipe('it-IT');
    }

    async ngOnInit() {
        try {
            this.initializeCamera();
            let deviceId = this.settingsManagementService.getSettingsValue('id-dev');
            let touchPointId = this.settingsManagementService.getSettingsValue('id-tcp');
            this.touchPointId = touchPointId;
            if ((deviceId == null) && (touchPointId == null)) {
                this.firstBoot = true;
            } else {
                this.firstBoot = false;
                await this.initializeTouchpoint(touchPointId, deviceId);
            }
        } catch (ex) {
            this.showStatusBarMessage('STARTUP ERROR: ' + ex.message);
        }
    }

    async initializeCamera() {
        let savedCamera = this._settingsManagementService.getSettingsValue('default-camera');
        if ((savedCamera != CameraType.Front) && (savedCamera != CameraType.Back)) {
            this.currentCamera = CameraType.Back;
            this._settingsManagementService.setSettingsValue('default-camera', this.currentCamera);
        } else
            this.currentCamera = savedCamera as CameraType;
    }

    reverseCameraAfterPairing() {
        this.currentCamera = CameraType.Front;
        this._settingsManagementService.setSettingsValue('default-camera', this.currentCamera);
    }

    async initializeTouchpoint(touchPointId: string, deviceId: string) {
        let authRes = await this.userManagementService.touchPointAuth(touchPointId);
        if (!this.commonService.isValidResponse(authRes)) {
            this.showStatusBarMessage('STARTUP ERROR: INVALID DEVICE');
        } else {
            await this.doCheckPairing(touchPointId, deviceId);
        }
    }

    async doPairing(touchPointId) {
        let authRes = await this.userManagementService.touchPointAuth(touchPointId);
        if (!this.commonService.isValidResponse(authRes)) {
            this.showStatusBarMessage('STARTUP ERROR: INVALID DEVICE');
        } else {
            let deviceId = uuidv4();
            let res = await this.touchPointManagementService.touchPointPair(touchPointId, deviceId, window.navigator.userAgent);
            if (res && res.result) {
                this.settingsManagementService.setSettingsValue('id-tcp', touchPointId);
                this.settingsManagementService.setSettingsValue('id-dev', deviceId);

                await this.initializeTouchpointSite(res.touchPoint.companyId, res.touchPoint.name);

                return true;
            } else {
                // TODO SHOW ERROR
                this.showStatusBarMessage(res.reason);
            }
        }
        return false;
    }

    async doCheckPairing(touchPointId, deviceId) {
        let res = await this.touchPointManagementService.touchPointCheckPair(touchPointId, deviceId);
        if (res && res.result) {
            await this.initializeTouchpointSite(res.touchPoint.companyId, res.touchPoint.name);
            return true;
        } else {
            // TODO SHOW ERROR
            this.showStatusBarMessage(res.reason);
        }

        return false;
    }

    async doFirstBoot(qrCode: string) {
        let split = qrCode.split('/');
        let touchPointId = split[split.length - 1];

        let res = await this.doPairing(touchPointId);
        if (res) {
            this.firstBoot = false;
            this.reverseCameraAfterPairing();
        }
    }

    async initializeTouchpointSite(companyId: string, siteId: string) {
        this.siteKey = siteId;
        this.siteQR = window.origin + '/do-office-activity/' + this.siteKey;

        this.startedAt = new Date();

        console.log('sitekey: ', this.siteKey);

        let res = await this.adminSiteManagementService.getSites(companyId);
        if (this.commonService.isValidResponse(res)) {
            let site = res.sites.find(s => s.key == siteId);
            if (site) {
                await this.initializeSiteAndColor(site);
                this.initializeDateAndClock();
            } else {
                this.notifyManagementService.displayWarnSnackBar(this.translate.instant('OFFICE ACTIVITY.SITE NOT FOUND'));
            }
        } else {
            this.notifyManagementService.displayWarnSnackBar(this.translate.instant('OFFICE ACTIVITY.SITE NOT FOUND'));
        }

        let resSettings = await this.touchPointManagementService.getTouchPointSettings();
        if (resSettings.result) {
            this.touchPointSettings = resSettings.settings;
        }

        this.trackKeepAlive();
    }

    ngAfterViewInit() {
        try {
            let elem = document.documentElement;

        } catch (ex) {
            console.log('fullscreen ex: ', ex);
        }
    }

    mapSiteColorStatus(todaySiteStatus: SITE_STATE) {
        switch (todaySiteStatus) {
            case SITE_STATE.FREE:
                return "#14aab9";
            case SITE_STATE.CLOSED:
                return "#DC260A";
            case SITE_STATE.MAINTENANCE:
                return "#B39783";
            case SITE_STATE.RESTRICTED_MODE:
                return "#FF7500";
        }
    }

    async initializeSiteAndColor(site: Site) {
        this.siteStatus = site.globalStatus;

        this.siteText = site.name + " - " + this.commonService.mapSiteStatusString(this.siteStatus);
        this.backgroundColor = this.mapSiteColorStatus(this.siteStatus);
    }

    showStatusBarMessage(message: string) {
        this.showStatusBar = true;
        this.statusBarMessage = message;
    }

    async trackKeepAlive() {
        this.keepAliveCounter = 0;
        this.showStatusBar = false;
        console.log('OfficeActivityPageComponent: send keep alive heart beat');
        try {
            let deviceId = this.settingsManagementService.getSettingsValue('id-dev');
            let touchPointId = this.settingsManagementService.getSettingsValue('id-tcp');

            let res = await this.touchPointManagementService.keepAlive(touchPointId, deviceId, this.siteKey, this.startedAt, this.officeInCount, this.officeOutCount, false);
            if (!res || !res.result) {
                this.showStatusBarMessage("ERROR: " + res.reason);
            }
        } catch (ex) {
            this.showStatusBarMessage("NETWORK ERROR");
        }
    }


    initializeDateAndClock() {
        timer(1000, 1000).subscribe(val => {
            let now = new Date();
            var datePipe = new DatePipe("en-US");
            this.siteClock = datePipe.transform(now, 'HH:mm:ss');
            this.siteDate = datePipe.transform(now, 'EEEE dd LLLL yyyy');

            this.keepAliveCounter++;
            if (this.touchPointSettings && (this.keepAliveCounter >= (this.KEEP_ALIVE_INTERVAL * this.touchPointSettings.keepAliveInterval))) {
                this.trackKeepAlive();
            }
        });
    }

    onDeviceSelectChange(event: MatSelectChange) {
        console.log('onDeviceSelectChange: ', event);

        this.currentCamera = event.value;
        this._settingsManagementService.setSettingsValue('default-camera', event.value);
    }

    async onCodeResult(resultString: string) {
        if (this.processingScan)
            return;
        this.processingScan = true;
        if (resultString.toLocaleLowerCase().includes('irina-user')) {
            await this.doOfficeAction(resultString);
        } else if (resultString.toLocaleLowerCase().includes('touchpoint')) {
            await this.doFirstBoot(resultString);
            this.processingScan = false;
        } else {
            let stringToAction = "";
            let res = await this.touchPointManagementService.getTouchPointList();
            if(res.result) {
                this.currentTouchpoint = res.touchPoints.filter(touch => touch.id == this.touchPointId)[0];
            }
            let res2 = await this.adminUserManagementService.getPeople(this.currentTouchpoint.companyId);
            if(res2.result) {
                let people = res2.people;
                for(let person of people) {
                    if(person.accessControlQrCode == resultString) {
                        stringToAction = "irina-user"+"/"+person.id;
                    }
                }
            }
            if(stringToAction=="") {
                let res = await this.adminUserManagementService.getAccessControlBadge(resultString);
                if(res) {
                    let badge = res.badge;
                    stringToAction = "irina-user"+"/"+badge.codeData.idutente;
                }
            }
            if(stringToAction=="") {
                this.welcomeMessage = "";
                this.showSplashMessage(this.translate.instant('OFFICE ACTIVITY.QR CODE READING ERROR'));
            }
            else await this.doOfficeAction(stringToAction);
        }
    }

    reactivateVideoScanner() {
        console.log('reactivate video');
        this.qrScanner.openUserMedia();
        this.processingScan = false;
    }

    showSplashMessage(message: string) {
        this.showSplash = true;

        this.actionMessage = message;

        timer(4000).subscribe(val => {
            try {
                this.showSplash = false;
                this.reactivateVideoScanner();

                console.log('timer end');
            } catch (ex) {
                console.log('timer end exc: ', ex);
            }
        });
    }

    showSplashUserAction(userId: string, action: USER_ACTIVITY_TYPE) {
        this.showSplash = true;
        let today = new Date();

        if ((this.siteStatus == SITE_STATE.CLOSED) || (this.siteStatus == SITE_STATE.MAINTENANCE)) {
            this.actionMessage = this.translate.instant('OFFICE ACTIVITY.ACCESS NOT ALLOWED');
        } else {
            if (userId == null) {
                this.actionMessage = this.translate.instant('OFFICE ACTIVITY.QR NOT VALID');
            } else {
                this.welcomeMessage = userId;

                let dateStr = this.datePipe.transform(today, 'dd/MM/yyy');
                let hourStr = this.datePipe.transform(today, 'HH:mm:ss');

                if (action == USER_ACTIVITY_TYPE.OFFICE_IN) {
                    this.actionMessage = this.translate.instant('OFFICE ACTIVITY.CHECKIN OF') + ' ' + dateStr + ' ' + this.translate.instant('OFFICE ACTIVITY.AT') + ' ' + hourStr;
                } else if (action == USER_ACTIVITY_TYPE.OFFICE_OUT) {
                    this.actionMessage = this.translate.instant('OFFICE ACTIVITY.CHECKOUT OF') + ' ' + dateStr + ' ' + this.translate.instant('OFFICE ACTIVITY.AT') + ' ' + hourStr;
                } else if (action == USER_ACTIVITY_TYPE.DESK_CHECKIN) {
                    this.actionMessage = this.translate.instant('OFFICE ACTIVITY.CHECKED IN');
                } else {
                    this.actionMessage = this.translate.instant('OFFICE ACTIVITY.NO RESERVATION');
                }
            }
        }

        timer(10000).subscribe(val => {
            try {
                this.showSplash = false;
                this.reactivateVideoScanner();

                console.log('timer end');
            } catch (ex) {
                console.log('timer end exc: ', ex);
            }
        });
    }

    async doOfficeAction(qrInfo: string) {
        let qrSplit: string[] = qrInfo.split('/');

        if (qrSplit.length > 1) {
            try {
                let userId = qrSplit[1];

                console.log(`doOfficeAction: command ${qrSplit[0]} userId ${qrSplit[1]}`);
               

                let res = await this.coreService.userHasOfficeReservation(userId, this.siteKey);
                if (res.person == null) {
                    this.showSplashMessage(this.translate.instant('OFFICE ACTIVITY.QR NOT VALID'));
                    return;
                }
                if(!res.person.enablePlan) {
                    let deviceId = this.settingsManagementService.getSettingsValue('id-dev');
                    let fullName = res.person.name + ' ' + res.person.surname;
                    let result = await this.userActionManagementService.sendTouchpointOfficeAction(this.siteKey, userId);
                    if (this.commonService.isValidResponse(result)) {
                        this.logManagement.logEvent(`TouchPoint User QR scanning ${userId} ${result.action} ${this.siteKey} ${deviceId}`, LOG_LEVEL.INFO);
                        this.showSplashUserAction(fullName, result.action);
                    } else if(result.reason=="GREENPASS") {
                        this.logManagement.logEvent(`TouchPoint track user action error ${userId} ${this.siteKey} ${deviceId} ${result.message}`, LOG_LEVEL.ERROR);
                        this.showSplashMessage(this.translate.instant('OFFICE ACTIVITY.UPLOAD GREENPASS FIRST'));
                        this.reactivateVideoScanner();
                    } else {
                        this.logManagement.logEvent(`TouchPoint track user action error ${userId} ${this.siteKey} ${deviceId} ${result.message}`, LOG_LEVEL.ERROR);
                        this.reactivateVideoScanner();
                    }
                }
                else {
                    let userHasResevation = res.result;
                    let fullName = res.person.name + ' ' + res.person.surname;
                    if (!userHasResevation) {
                        this.showSplashUserAction(fullName, null);
                    } else {
                        let deviceId = this.settingsManagementService.getSettingsValue('id-dev');

                        let result = await this.userActionManagementService.sendTouchpointOfficeAction(this.siteKey, userId);
                        if (this.commonService.isValidResponse(result)) {
                            this.logManagement.logEvent(`TouchPoint User QR scanning ${userId} ${result.action} ${this.siteKey} ${deviceId}`, LOG_LEVEL.INFO);
                            this.showSplashUserAction(fullName, result.action);
                        } else if(result.reason=="GREENPASS") {
                            this.logManagement.logEvent(`TouchPoint track user action error ${userId} ${this.siteKey} ${deviceId} ${result.message}`, LOG_LEVEL.ERROR);
                            this.showSplashMessage(this.translate.instant('OFFICE ACTIVITY.UPLOAD GREENPASS FIRST'));
                            this.reactivateVideoScanner();
                        } else {
                            this.logManagement.logEvent(`TouchPoint track user action error ${userId} ${this.siteKey} ${deviceId} ${result.message}`, LOG_LEVEL.ERROR);
                            this.reactivateVideoScanner();
                        }
                    }
                }
            } catch (ex) {
                this.showSplashMessage('Error reading data from server ' + ex.message);
                this.reactivateVideoScanner();
            }
        } else {
            console.log('Error QR not valid')
            this.showSplashMessage(this.translate.instant('OFFICE ACTIVITY.QR CODE READING ERROR'))
            this.reactivateVideoScanner();
        }
    }

    onCameraClick() {
        this.showCameraSelection = !this.showCameraSelection;
    }
}
