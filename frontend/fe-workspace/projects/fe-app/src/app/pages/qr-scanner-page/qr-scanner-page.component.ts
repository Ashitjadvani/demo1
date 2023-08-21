import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CameraAvailable, CameraType, QrScannerComponent } from 'projects/fe-common/src/lib/components/qr-scanner/qr-scanner.component';
import { QrScanContext } from 'projects/fe-common/src/lib/models/app';
import { GreenPass, GreenPassSettings, GreenPassValidation, GREENPASS_LEVEL } from 'projects/fe-common/src/lib/models/greenpass';
import { ACCESS_CONTROL_LEVEL, Person } from 'projects/fe-common/src/lib/models/person';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { UserActionManagementService } from 'projects/fe-common/src/lib/services/user-action-management.service';
import { UserActionService, USER_ACTIVITY_TYPE } from 'projects/fe-common/src/lib/services/user-action.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { EnvironmentService } from 'projects/fe-touchpoint/src/app/services/environment.service';
import { Subscription } from 'rxjs';
import { BrowserMultiFormatReader } from '@zxing/library';
import { BrowserQRCodeReader, BrowserQRCodeSvgWriter } from '@zxing/browser';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { GreenpassChooseComponent } from '../../components/greenpass-choose/greenpass-choose.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CropImageComponent } from '../../components/crop-image/crop-image.component';
import { GreenpassScannerComponent } from '../../components/greenpass-scanner/greenpass-scanner.component';
import { Company } from 'projects/fe-common/src/lib/models/company';
import { I } from '@angular/cdk/keycodes';
import { ThrowStmt } from '@angular/compiler';
import { BookableAssetsManagementService, ResourceAction, ResourceSearchAvailabilityResponse, UserResourceInteractionResponse } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';
import { QrScannerActionSheetComponent } from './qr-scanner-action-sheet/qr-scanner-action-sheet.component';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { EventManagementActionService } from 'projects/fe-common-v2/src/lib/services/event-management-action.service';

enum ActionType {
    atScanner,
    atImage
}

enum QrActionResource {
    qrRoom,
    qrDesk
}

@Component({
    selector: 'app-qr-scanner-page',
    templateUrl: './qr-scanner-page.component.html',
    styleUrls: ['./qr-scanner-page.component.scss']
})
export class QrScannerPageComponent implements OnInit {
    @ViewChild('scanner') qrScanner: QrScannerComponent;
    @ViewChild('imageInput', { static: false }) file: ElementRef;
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;

    QrScanContext = QrScanContext;

    roomCode: string;
    context: QrScanContext;
    availableDevices: CameraAvailable[] = [
        { name: 'Front Camera', type: CameraType.Front },
        { name: 'Back Camera', type: CameraType.Back }
    ];

    showLoader: boolean = false;

    currAccount: Person;
    currSite: Site;

    userSiteKey: string;
    userAction: USER_ACTIVITY_TYPE;

    _searcing: boolean;

    userQR: string;
    qrLevel: string = 'Q';

    defaultCamera: string;
    currentDeviceId: string;
    currentCamera: CameraType = CameraType.Back;
    showCameraSelection: boolean = false;

    userGreenpasses: GreenPass[] = new Array();
    subscription: Subscription;
    imageUrl: string | ArrayBuffer = "";

    validGreenpassEndDate: string = "";
    validGreenpassName: string = "";
    validGreenpassDateOfBirth: string = "";

    currentCompany: Company;

    userGreenpassIsValid: boolean = false;
    userGreenpassInvalidReason: string = "NOT_FOUND";

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _env: EnvironmentService,
        private _notifyManagementService: NotifyManagementService,
        private _common: CommonService,
        private _userManagementService: UserManagementService,
        private _settingsManagementService: SettingsManagementService,
        private _userActionManagementService: UserActionManagementService,
        private _adminUserManagementService: AdminUserManagementService,
        private _adminSiteManagementService: AdminSiteManagementService,
        private bookableAssetsManagementService: BookableAssetsManagementService,
        private eventManagementActionService: EventManagementActionService,
        private bottomSheet: MatBottomSheet,
        public translate: TranslateService,
        private _bottomSheet: MatBottomSheet
    ) {
        this._searcing = false;
        let savedCamera = this._settingsManagementService.getSettingsValue('default-camera');
        if ((savedCamera != CameraType.Front) && (savedCamera != CameraType.Back)) {
            this.currentCamera = CameraType.Back;
            this._settingsManagementService.setSettingsValue('default-camera', this.currentCamera);
        } else
            this.currentCamera = savedCamera as CameraType;
    }

    async ngOnInit() {
        this.currAccount = this._userManagementService.getAccount();
        let result = await this._adminUserManagementService.getPeople(this.currAccount.companyId);
        for (let person of result.people) {
            if (person.id == this.currAccount.id) {
                this.currAccount = person;
                break;
            }
        }
        this.currentCompany = (await this._adminUserManagementService.getCompany(this.currAccount.companyId)).company;
        if (!this.currentCompany.greenpassSettings) {
            this.currentCompany.greenpassSettings = GreenPassSettings.Empty();
            await this._adminUserManagementService.updateCompany(this.currentCompany);
        }
        if (this.currAccount) {
            let res = await this._adminUserManagementService.getPeople(this.currentCompany.id);
            let people = res.people;
            this.currAccount = people.filter(person => person.id == this.currAccount.id)[0];
        }
        let res2 = await this._adminSiteManagementService.getSites(this.currentCompany.id);
        this.currSite = res2.sites.filter(site => site.id == this.currAccount.site)[0];
        /*if(!this.currentCompany.greenpassSettings.ageRangeLevel) {
            this.currentCompany.greenpassSettings.ageRangeLevel = new Array();
            this.currentCompany.greenpassSettings.ageRangeLevel.push({
                lowerBound:0,
                upperBound:49,
                level:GREENPASS_LEVEL.SUPER
            });
            this.currentCompany.greenpassSettings.ageRangeLevel.push({
                lowerBound:50,
                upperBound:100,
                level:GREENPASS_LEVEL.BOOSTER
            });
            await this._adminUserManagementService.updateCompany(this.currentCompany);
        }
        else if(this.currentCompany.greenpassSettings.ageRangeLevel.length==0) {
            this.currentCompany.greenpassSettings.ageRangeLevel = new Array();
            this.currentCompany.greenpassSettings.ageRangeLevel.push({
                lowerBound:0,
                upperBound:49,
                level:GREENPASS_LEVEL.SUPER
            });
            this.currentCompany.greenpassSettings.ageRangeLevel.push({
                lowerBound:50,
                upperBound:100,
                level:GREENPASS_LEVEL.BOOSTER
            });
            await this._adminUserManagementService.updateCompany(this.currentCompany);
        }*/
        this.userQR = this._common.getUserQrString(this.currAccount.id);

        this._route.queryParams.subscribe(params => {
            if (this._env.debugEnabled())
                console.log('QrScannerPageComponent.ngOnInit params: ', params);

            this.context = params['context'];
            this.userSiteKey = params['siteKey'];
            this.userAction = params['userAction'];
        });

        let todayYYYYMMDD = this._common.toYYYYMMDD(new Date());
        let userId = this._userManagementService.getAccount().id;
        let res = await this._adminUserManagementService.getUserActivities(userId, todayYYYYMMDD, todayYYYYMMDD);
        if (this._common.isValidResponse(res)) {
            console.log('user activities: ', res);
        }
        await this.checkValidGreenpass();
        if ((this.currentCompany.greenpassSettings.abilitation && this.currentCompany.greenpassSettings.requestedForCheckIn) ||
            (this.currentCompany.greenpassSettings.abilitation && this.currAccount.enableGreenpass)) {
            if (!this.userGreenpassIsValid) {
                this.tabgroup.selectedIndex = 2;
                await this.getUserAccessQrCode();
                this.qrScanner.closeVideoStream();
            }
        }
        await this.getUserAccessQrCode();
    }

    onSwipe(event) {
        if (Math.abs(event.deltaX) > 40)
            this.showCameraSelection = !this.showCameraSelection;
    }

    onDeviceSelectChange(event: MatSelectChange) {
        console.log('onDeviceSelectChange: ', event);

        this.currentCamera = event.value;
        this._settingsManagementService.setSettingsValue('default-camera', event.value);
    }

    async onCodeResult(resultString: string) {
        // UPD:
        // new format of QR code: https://<host>/roomdetails/<room code>
        if ((resultString == null) || this._searcing)
            return;

        this._searcing = true;

        if (resultString.toLocaleLowerCase().includes('room')) {
            await this.doQrResourceAction(resultString, QrActionResource.qrRoom);
        } else if (resultString.toLocaleLowerCase().includes('office-activity')) {
            await this.doOfficeAction(resultString);
        } else if (resultString.toLocaleLowerCase().includes('event')) {
            await this.doEventAction(resultString);
        } else {
            if ((this.context == QrScanContext.qrDeskCheckIn) || (this.context == QrScanContext.qrDeskCheckOut)) {
                await this.doDeskAction(resultString);
            }
            else if ((this.context == QrScanContext.qrOfficeIn) || (this.context == QrScanContext.qrOfficeOut))
                await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.INFO'), this.translate.instant('QR SCANNER.OFFICEIN OR OFFICEOUT'));
            else
                await this.doQrAction(resultString);
        }

        this._searcing = false;
    }

    async doQrAction(url: string) {
        let urlSplit: string[] = url.split('/');

        if (this._env.debugEnabled())
            console.log('QR code scan result: ', urlSplit[urlSplit.length - 1]);
    }

    async doQrResourceAction(url: string, actionResource: QrActionResource) {
        let urlSplit: string[] = url.split('/');

        if (this._env.debugEnabled())
            console.log('QR code scan result: ', urlSplit[urlSplit.length - 1]);

        if (actionResource == QrActionResource.qrRoom) {
            await this.doRoomAction(urlSplit[urlSplit.length - 1]);
        }
    }

    async doOfficeAction(qrInfo: string) {
        let qrSplit: string[] = qrInfo.split('/');
        if (qrSplit.length > 1) {
            let siteKey = qrSplit[qrSplit.length - 1];
            let overridenAction = this.userAction;

            if ((this.userAction == USER_ACTIVITY_TYPE.DESK_CHECKIN) || (this.userAction == USER_ACTIVITY_TYPE.DESK_CHECKOUT)) {
                // se sono già entrato in ufficio però esco per un qualsiasi motivo
                // devo domandare una office action
                overridenAction = USER_ACTIVITY_TYPE.OFFICE_OUT;
            }
            let result = await this._userActionManagementService.showConfirmMessage(overridenAction, '');
            if (result) {
                let res = await this._userActionManagementService.sendOfficeAction(siteKey);
                if (!res || !res.result) {
                    if (res.reason == "GREENPASS") {
                        this.tabgroup.selectedIndex = 2;
                        await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.UPLOAD GREENPASS FIRST'));
                    }
                    else await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), res.message);
                }
                else this._router.navigate(['home']);
            }
        } else {
            this._notifyManagementService.displayWarnSnackBar(this.translate.instant('QR SCANNER.UNKNOWN QR'));
        }
    }

    async doEventAction(qrInfo: string) {
        let qrSplit: string[] = qrInfo.split('/');
        if (qrSplit.length > 1) {
            let eventId = qrSplit[qrSplit.length - 1];

            console.log('doEventAction: ', eventId);
            let res = await this.eventManagementActionService.eventQRCodeAction(eventId, this.currAccount.email, this.currAccount.id);
            console.log('doEventAction: result ', res);
            if (!this._common.isValidResponse(res)) {
                await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant(res.reason));
            } else {
                let questionMessage = '';
                if (res.type == 'checkin') {
                    questionMessage = this.translate.instant('eventCheckInYesOrNo');
                } else if (res.type == 'checkout') {
                    questionMessage = this.translate.instant('eventCheckOutYesOrNo');
                } else if (res.type == 'check') {
                    questionMessage = this.translate.instant('eventCheckYesOrNo');
                }

                let answer = await this._notifyManagementService.openConfirmDialog(this.translate.instant('GENERAL.PAY ATTENTION'), questionMessage);
                if (answer) {
                    let res = await this.eventManagementActionService.eventQRCodeAction(eventId, this.currAccount.email, this.currAccount.id, 'updateEventStatus');
                    if (this._common.isValidResponse(res)) {
                        await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant(res.message) + res.eventName);
                    } else {
                        await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant(res.reason));
                    }
                }
            }
            this.handleEventActionClose(true);
        } else {
            this._notifyManagementService.displayWarnSnackBar(this.translate.instant('QR SCANNER.UNKNOWN QR'));
            this.handleEventActionClose(false);
        }
    }

    async handleResourceAction(currentResourceInteraction: UserResourceInteractionResponse, resourceAction: ResourceAction) {
        console.log('handleResourceAction: ', currentResourceInteraction);

        if (resourceAction == ResourceAction.InstantBook) {
            let message = this.translate.instant('QR SCANNER.BOOK NOW RESOURCE') + '(' + currentResourceInteraction.resource.description + ") ?";
            let confirm = await this._notifyManagementService.openConfirmDialog(this.translate.instant('BOOK ROOM DETAILS.INSTANT BOOKING'), message);
            if (!confirm) {
                this.handleResourceActionClose();
                return;
            }
        }

        let reservationId = (resourceAction == ResourceAction.InstantBook) ? null : currentResourceInteraction.resourceBook.id;
        let reservationSlotId = (resourceAction == ResourceAction.InstantBook) ? null : currentResourceInteraction.reservationTimeframeId;

        let res = await this.bookableAssetsManagementService.userResourceAction(currentResourceInteraction.resource.code, reservationId, reservationSlotId, resourceAction);
        if (this._common.isValidResponse(res)) {
            this.onBack();
        }
    }

    handleResourceActionClose() {
        this.qrScanner.openUserMedia();
        this._searcing = false;
    }

    handleEventActionClose(navigateHome: boolean) {
        if (navigateHome) {
            this._router.navigate(['home']);
        } else {
            this.qrScanner.openUserMedia();
            this._searcing = false;
        }
    }

    async doRoomAction(resourceId: string) {
        let res = await this.bookableAssetsManagementService.userResourceInteraction(resourceId);
        if (this._common.isValidResponse(res)) {
            this.bottomSheet.open(QrScannerActionSheetComponent, {
                data: {
                    currentResourceInteraction: res,
                    availableActions: res.availableActions, // [ResourceAction.InstantBook, ResourceAction.CheckIn]
                    doneEvent: this.handleResourceAction.bind(this),
                    closeEvent: this.handleResourceActionClose.bind(this),
                },
                panelClass: 'bottom-sheet'
            });
        }
    }

    async doDeskAction(qrInfo: string) {
        let urlSplit: string[] = qrInfo.split('/');
        console.log('doDeskAction: ', urlSplit[urlSplit.length - 1]);

        let deskResourceName = urlSplit[urlSplit.length - 1];
        let result = await this._userActionManagementService.showConfirmMessage(this.userAction, deskResourceName);
        if (result) {
            let res = await this._userActionManagementService.sendDeskAction(deskResourceName);
            if (!res || !res.result) {
                await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), res.message);
            }
        }
        this._router.navigate(['home']);
    }

    onBack() {
        this._router.navigate(['home']);
    }

    async onTabSelected(tabIndex: number) {
        if ((this.currentCompany.greenpassSettings.abilitation && this.currentCompany.greenpassSettings.requestedForCheckIn) ||
            (this.currentCompany.greenpassSettings.abilitation && this.currAccount.enableGreenpass)) {
            if (this.userGreenpassIsValid) {
                if (tabIndex == 0) {
                    this.qrScanner.openUserMedia();
                } else if (tabIndex == 2) {
                    this.currentCompany = (await this._adminUserManagementService.getCompany(this.currAccount.companyId)).company;
                    await this.checkValidGreenpass();
                    try {
                        this.qrScanner.closeVideoStream();
                    } catch (e) { }
                } else {
                    try {
                        this.qrScanner.closeVideoStream();
                    } catch (e) { }
                }
                this.tabgroup.selectedIndex = tabIndex;
            }
            else {
                this.tabgroup.selectedIndex = 2;
                this.qrScanner.closeVideoStream();
            }
        }
        else {
            if (tabIndex == 0) {
                this.qrScanner.openUserMedia();
            } else if (tabIndex == 2) {
                this.currentCompany = (await this._adminUserManagementService.getCompany(this.currAccount.companyId)).company;
                await this.checkValidGreenpass();
                try {
                    this.qrScanner.closeVideoStream();
                } catch (e) { }
            } else {
                try {
                    this.qrScanner.closeVideoStream();
                } catch (e) { }
            }
            this.tabgroup.selectedIndex = tabIndex;
        }
    }

    getScannerView() {
        if ((this.currentCompany.greenpassSettings.abilitation && this.currentCompany.greenpassSettings.requestedForCheckIn) ||
            (this.currentCompany.greenpassSettings.abilitation && this.currAccount.enableGreenpass)) {
            if (this.userGreenpassIsValid) return true;
            return false;
        }
        return true;
    }

    onSaveQR(qrcode) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
        this._common.downloadImageBase64(qrImage, 'qr-code');
    }

    async checkValidGreenpass() {
        let res = await this._adminUserManagementService.getTodayUserGreenpassValidation(this.currAccount.id);
        this.userGreenpassIsValid = res.result;
        this.userGreenpassInvalidReason = res.reason;
    }

    async onUploadAnotherClick() {
        this.userGreenpassIsValid = false;
        this.userGreenpassInvalidReason = "NOT_FOUND";
    }

    onScan() {
        const bottomSheetRefScanner = this._bottomSheet.open(GreenpassScannerComponent, {
            data: { currentCamera: this.currentCamera },
            panelClass: 'bottom-sheet'
        });
        bottomSheetRefScanner.afterDismissed().subscribe(async (data) => {
            if (data) {
                let greenpass = new GreenPass();
                greenpass.userId = this.currAccount.id;
                greenpass.qrCode = data;
                let res = await this._adminUserManagementService.validateGreenpass(greenpass, this.currAccount.companyId);
                if (res.result) {
                    this.validGreenpassName = res.greenpass.name;
                    this.validGreenpassDateOfBirth = res.greenpass.dateOfBirth;
                    this.userGreenpassIsValid = true;
                    let validation = new GreenPassValidation();
                    validation.valid = true;
                    validation.userId = this.currAccount.id;
                    await this._adminUserManagementService.addGreenpassValidation(validation);
                }
                else {
                    if (res.reason == "NO_QR") {
                        await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.ERROR READING'));
                    }
                    else if (res.reason == "NO_GREENPASS") {
                        await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.ERROR READING'));
                    }
                    else if (res.reason == "NO_CONNECTION") {
                        await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.NO CONNECTION'));
                    }
                    else if (res.reason == "OUT_OF_DATE_RANGE") {
                        await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.NO DATE RANGE'));
                    }
                    else if (res.reason == "NOT_VALID") {
                        let validation = new GreenPassValidation();
                        validation.valid = false;
                        validation.userId = this.currAccount.id;
                        await this._adminUserManagementService.addGreenpassValidation(validation);
                        this.userGreenpassIsValid = false;
                        this.userGreenpassInvalidReason = "NOT_VALID";
                        if (this.currentCompany.greenpassSettings.ageRangeLevel[0].level != GREENPASS_LEVEL.NONE)
                            await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.GREENPASS NOT VALID WITH LEVEL') + this.currentCompany.greenpassSettings.ageRangeLevel[0].level);
                        else
                            await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.GREENPASS NOT VALID'));
                    }
                    else if (res.reason == "NAME_DIFFERENT") {
                        let validation = new GreenPassValidation();
                        validation.valid = false;
                        validation.userId = this.currAccount.id;
                        await this._adminUserManagementService.addGreenpassValidation(validation);
                        this.userGreenpassIsValid = false;
                        this.userGreenpassInvalidReason = "NOT_VALID";
                        await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.GREENPASS NAME MISMATCH'));
                    }
                    else if (res.reason == "DATE_DIFFERENT") {
                        let validation = new GreenPassValidation();
                        validation.valid = false;
                        validation.userId = this.currAccount.id;
                        await this._adminUserManagementService.addGreenpassValidation(validation);
                        this.userGreenpassIsValid = false;
                        this.userGreenpassInvalidReason = "NOT_VALID";
                        await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.GREENPASS DATE MISMATCH'));
                    }
                    else {
                        await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('GENERAL.UNKNOWN ERROR'));
                    }
                }
            }
        });
    }

    chooseFile() {
        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }
        this.file.nativeElement.click();
    }

    onFileChosen(file: any) {
        const bottomSheetRef = this._bottomSheet.open(CropImageComponent, {
            data: { file: file },
            panelClass: 'bottom-sheet'
        });
        bottomSheetRef.afterDismissed().subscribe(async (data: File) => {
            this.onUploadFile(data);
        });
        this.file.nativeElement.value = '';
    }

    async onUploadFile(file: File) {
        if (!file)
            return;
        let res = await this._adminUserManagementService.uploadGreenpass(file, this.currAccount.id, this.currAccount.companyId);
        if (res.body.result) {
            this.validGreenpassName = res.body.greenpass.name;
            this.validGreenpassDateOfBirth = res.body.greenpass.dateOfBirth;
            this.userGreenpassIsValid = true;
            let validation = new GreenPassValidation();
            validation.valid = true;
            validation.userId = this.currAccount.id;
            await this._adminUserManagementService.addGreenpassValidation(validation);
        }
        else {
            if (res.body.reason == "NO_QR") {
                await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.ERROR READING'));
            }
            else if (res.body.reason == "NO_GREENPASS") {
                await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.ERROR READING'));
            }
            else if (res.body.reason == "NO_CONNECTION") {
                await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.NO CONNECTION'));
            }
            else if (res.body.reason == "OUT_OF_DATE_RANGE") {
                await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.NO DATE RANGE'));
            }
            else if (res.body.reason == "NOT_VALID") {
                let validation = new GreenPassValidation();
                validation.valid = false;
                validation.userId = this.currAccount.id;
                await this._adminUserManagementService.addGreenpassValidation(validation);
                this.userGreenpassIsValid = false;
                this.userGreenpassInvalidReason = "NOT_VALID";
                if (this.currentCompany.greenpassSettings[0].level != GREENPASS_LEVEL.NONE)
                    await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.GREENPASS NOT VALID WITH LEVEL') + this.currentCompany.greenpassSettings.ageRangeLevel[0].level);
                else
                    await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.GREENPASS NOT VALID'));
            }
            else if (res.body.reason == "NAME_DIFFERENT") {
                let validation = new GreenPassValidation();
                validation.valid = false;
                validation.userId = this.currAccount.id;
                await this._adminUserManagementService.addGreenpassValidation(validation);
                this.userGreenpassIsValid = false;
                this.userGreenpassInvalidReason = "NOT_VALID";
                await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.GREENPASS NAME MISMATCH'));
            }
            else if (res.body.reason == "DATE_DIFFERENT") {
                let validation = new GreenPassValidation();
                validation.valid = false;
                validation.userId = this.currAccount.id;
                await this._adminUserManagementService.addGreenpassValidation(validation);
                this.userGreenpassIsValid = false;
                this.userGreenpassInvalidReason = "NOT_VALID";
                await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('QR SCANNER.GREENPASS DATE MISMATCH'));
            }
            else {
                await this._notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('GENERAL.UNKNOWN ERROR'));
            }
        }
    }

    getGreenpassLevelRequestedTranslated() {
        let translateString = "QR SCANNER." + this.currentCompany.greenpassSettings.ageRangeLevel[0].level;
        return this.translate.instant(translateString);
    }

    async getUserAccessQrCode() {
        if (this.currSite.accessControlEnable && this.currSite.useAccessControlQrCodeForCheckIn && this.currAccount.accessControlLevel && this.currAccount.accessControlLevel != ACCESS_CONTROL_LEVEL.NONE) {
            let res = await this._adminUserManagementService.getAccessControlQrCode(this.currAccount.id);
            if (res && res.qrcode) {
                this.userQR = res.qrcode;
            }
        }
    }


}
