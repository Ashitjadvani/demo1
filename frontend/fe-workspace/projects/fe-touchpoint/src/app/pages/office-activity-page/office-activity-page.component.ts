import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CameraAvailable, CameraType, QrScannerComponent } from 'projects/fe-common/src/lib/components/qr-scanner/qr-scanner.component';
import { SITE_STATE, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { UserDailyActivity } from 'projects/fe-common/src/lib/models/admin/user-daily-activity';
import { LOG_LEVEL } from 'projects/fe-common/src/lib/models/log-event';
import { TouchPointSettings } from 'projects/fe-common/src/lib/models/touchpoint';
import { USER_BOOK_TYPE } from 'projects/fe-common/src/lib/models/user-request-book';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { LogManagementService } from 'projects/fe-common/src/lib/services/log-management.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { TouchpointManagementService } from 'projects/fe-common/src/lib/services/touchpoint-management.service';
import { UserActionService, USER_ACTIVITY_TYPE } from 'projects/fe-common/src/lib/services/user-action.service';
import { timer } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-office-activity-page',
    templateUrl: './office-activity-page.component.html',
    styleUrls: ['./office-activity-page.component.scss']
})
export class OfficeActivityPageComponent implements OnInit, AfterViewInit {
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
    deviceId: string;

processingScan: boolean = false;

    constructor(private activatedRoute: ActivatedRoute,
        private notifyManagementService: NotifyManagementService,
        private settingsManagementService: SettingsManagementService,
        private userActionService: UserActionService,
        private logManagement: LogManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private touchPointManagementService: TouchpointManagementService,
        private _settingsManagementService: SettingsManagementService,
        private commonService: CommonService,
        public translate: TranslateService) {
        this.showCameraSelection = false;
    }

    async ngOnInit() {
        try {
            this.siteKey = this.activatedRoute.snapshot.params['site'];
            this.siteQR = window.origin + '/do-office-activity/' + this.siteKey;
            this.deviceId = this.settingsManagementService.getSettingsValue('oa-tp');
            if (!this.deviceId) {
                this.deviceId = uuidv4();
                this.settingsManagementService.setSettingsValue('oa-tp', this.deviceId);
            }
            this.startedAt = new Date();

            console.log('sitekey: ', this.siteKey);

            let res = await this.adminSiteManagementService.getSite(this.siteKey);
            if (res.result) {
                let site = res.site;
                await this.initializeSiteAndColor(site);
                this.initializeDateAndClock();
            } else {
                this.notifyManagementService.displayWarnSnackBar(this.translate.instant('OFFICE ACTIVITY.SITE NOT FOUND'));
            }
            let resSettings = await this.touchPointManagementService.getTouchPointSettings();
            if (resSettings.result) {
                this.touchPointSettings = resSettings.settings;
            }

            let savedCamera = this._settingsManagementService.getSettingsValue('default-camera');
            if ((savedCamera != CameraType.Front) && (savedCamera != CameraType.Back)) {
                this.currentCamera = CameraType.Back;
                this._settingsManagementService.setSettingsValue('default-camera', this.currentCamera);
            } else
                this.currentCamera = savedCamera as CameraType;

            this.trackKeepAlive();
        } catch (ex) {
            this.showStatusBarMessage('STARTUP ERROR: ' + ex.message);
        }
    }

    ngAfterViewInit() {

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
        let today = new Date();
        let res = await this.adminSiteManagementService.getSiteDailyStatus(this.siteKey);

        this.siteStatus = site.globalStatus;

        if (res.result && res.siteDailyStatus && res.siteDailyStatus.siteCap && (res.siteDailyStatus.siteCap.length > 0)) {
            let todayYYYYMMDD = this.commonService.toYYYYMMDD(today);
            for (let ctf of res.siteDailyStatus.siteCap[0].capacityTimeFrames) {
                if ((todayYYYYMMDD >= ctf.dateFrom) && (todayYYYYMMDD <= ctf.dateTo)) {
                    this.siteStatus = SITE_STATE.RESTRICTED_MODE;
                }
            }
        }

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
            let res = await this.touchPointManagementService.keepAlive(this.deviceId, null, this.siteKey, this.startedAt, this.officeInCount, this.officeOutCount, true);
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

        console.log('onCodeResult: ', resultString);

        if (resultString.toLocaleLowerCase().includes('irina-user')) {
            this.doOfficeAction(resultString);
        } else {
            this.showSplashUserAction(null, null);
        }
    }

    reactivateVideoScanner() {
        console.log('reactivate video');
        this.qrScanner.openUserMedia();
        this.processingScan = false;
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
                // this.dateTimeMessage = this.commonService.formatDateTime(today, 'dd/MM/yyyy - HH:mm:ss');

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

        const source = timer(10000);
        const abc = source.subscribe(val => {
            this.showSplash = false;
            this.reactivateVideoScanner();

            console.log('timer end');
        });
    }

    async checkUserOfficeReservation(userId: string) {
        let res = await this.userActionService.getUserDailyRequestPlan(this.siteKey, userId);
        if (res.result) {
            let today = new Date();
            let todayYYYYMMDD = this.commonService.toYYYYMMDD(today);
            let todayUserRequest = res.userRequests.find(s => s.date == todayYYYYMMDD);
            if (todayUserRequest)
                return todayUserRequest.bookType == USER_BOOK_TYPE.OFFICE_WORKING;
        }
        return false;
    }

    async doOfficeAction(qrInfo: string) {
        let qrSplit: string[] = qrInfo.split('/');
        if (qrSplit.length > 1) {
            let userId = qrSplit[1];

            let userHasResevation = await this.checkUserOfficeReservation(userId);
            if (!userHasResevation) {
                this.showSplashUserAction(userId, null);
            } else {
                let res = await this.userActionService.getUserActivity(userId);
                let userActivity: UserDailyActivity = (res.result ? res.userActivity : null);
                let action;

                if (!userActivity || !userActivity.isInOffice)
                    action = USER_ACTIVITY_TYPE.OFFICE_IN;
                else
                    action = USER_ACTIVITY_TYPE.OFFICE_OUT;

                if (userActivity && userActivity.smartWorkingInAt) {
                    this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('OFFICE ACTIVITY.CANNOT ENTER'));
                } else {
                    this.logManagement.logEvent(`TouchPoint User QR scanning ${userId} ${action} ${this.siteKey} ${this.deviceId}`, LOG_LEVEL.INFO);

                    let result = await this.userActionService.trackUserMainActionNoMessage(userId, action, this.siteKey, null);
                    if (result) {
                        this.showSplashUserAction(userId, action);
                    } else {
                        this.logManagement.logEvent(`TouchPoint track user action error ${userId} ${action} ${this.siteKey} ${this.deviceId} ${result.message}`, LOG_LEVEL.ERROR);
                    }
                }
            }
        } else {
            this.notifyManagementService.displayWarnSnackBar(this.translate.instant('OFFICE ACTIVITY.QR CODE READING ERROR'))
        }
    }

    onCameraClick() {
        this.showCameraSelection = !this.showCameraSelection;
    }
}

