import {AfterContentInit, AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import {MCPHelperService} from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import Swal from 'sweetalert2';
import * as FileSaver from "file-saver";
import {HttpResponse} from '@angular/common/http';
import * as moment from 'moment';
import {EventHelper} from 'projects/fe-common-v2/src/lib';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmPopupComponent} from "../../../../popup/confirm-popup/confirm-popup.component";
import swal from "sweetalert2";
import {SettingsManagementService} from "../../../../../../../fe-common-v2/src/lib/services/settings-management.service";
import {DateAdapter} from "@angular/material/core";
import {ActivePagePopupComponent} from "../../../../popup/active-page-popup/active-page-popup.component";
import {EventManagementSettingService} from "../../../../../../../fe-common-v2/src/lib/services/event-management-setting.service";
import {EventStatus} from 'projects/fe-common-v2/src/lib/enums/event-status.enum';

declare var gapi: any;

@Component({
    selector: 'app-event-confirmation',
    templateUrl: './event-confirmation.component.html',
    styleUrls: ['./event-confirmation.component.scss']
})
export class EventConfirmationComponent implements OnInit {
    eventCheckInForm: FormGroup;
    eventId: string;
    baseURL: string;
    downloadLink: any = '';
    editEventData: any;
    companyId: any;
    eventNotFound: boolean = false;
    userLanguageSelect: string = 'it';
    language: any;
    alreadySelectedLang: any = false;
    englishFlag = 'assets/images/en-flag.png';
    italianFlag = 'assets/images/ita-flag.png';
    interval;
    intervalForSecretCode;
    timeLeft: number;
    enableCheckPoint: boolean;
    isEventNotFound: boolean = false;
    eventExpired: boolean = false;
    concludedEvent: number = EventStatus.concluded;
    currentDate = new Date();
    hours: any;
    minutes: any;
    seconds: any;
    @HostListener("window:focus")
    protected onFocus() {
        this.getEventData()
    }
    isSecretCodeErrorMessage:boolean = false;
    ischeckpointControlErrorMessage:boolean= false;
    isDisplayActivePage:boolean= false;
    isDisplayActivateButton:boolean= false;
    isActiveCheckType:boolean= false;
    constructor(
        public eventAPI: EventManagementListOfEventService,
        public route: ActivatedRoute,
        public translate: TranslateService,
        public helper: MCPHelperService,
        private eventManagementAPI: EventManagementSettingService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private settingManager: SettingsManagementService,
        private dateAdapter: DateAdapter<any>,
    ) {
    }

    ngOnInit(): void {
        this.eventNotFound = false;
        document.body.classList.add('full-page');
        this.eventId = this.route.snapshot.paramMap.get('id');
        this.eventCheckInForm = this.formBuilder.group({
            eventId: this.eventId,
            meetingCode: ['', Validators.required],
            type: 'checkEventType',
        });
        this.getEventData();
        let x = setInterval(() => {
            this.getEventData();
        }, 30000);
        setTimeout(()=>{ this.createQRCodeData(this.eventId, this.baseURL);; }, 1000)

        this.changeTheme("#4B6BA2");
        this.language = [
            {
                "_id": "62f389aa83ef5974fa89c98c",
                "languages": "English",
                "languagesFlagImg": "assets/images/en-flag.png",
                "order": 0,
                "languageCode": "en",
                "checked": true,
                "id": "dedf453d-0c74-41f4-a206-72c8c9530a6c",
                "createdAt": "2022-08-10T10:34:18.773Z",
                "updatedAt": "2022-08-10T10:34:18.773Z"
            },
            {
                "_id": "62f389aa83ef5974fa89c98e",
                "languages": "Italian",
                "languagesFlagImg": "assets/images/ita-flag.png",
                "order": 1,
                "languageCode": "it",
                "checked": true,
                "id": "f106df67-f26e-474f-be63-8874bc6e360e",
                "createdAt": "2022-08-10T10:34:18.773Z",
                "updatedAt": "2022-08-10T10:34:18.773Z"
            }
        ];
        this.userLanguageSelect = this.settingManager.getSettingsValue('currentMeetingLanguage') ? this.settingManager.getSettingsValue('currentMeetingLanguage') : 'it';
        this.helper.languageTranslator(this.userLanguageSelect);
        this.translate.use(this.userLanguageSelect);
        setInterval(() => {
            this.currentDate = new Date();
        }, 1000);
    }

    onLanguageChange(valueLanguage: any): void {
        this.helper.languageTranslator(valueLanguage.value);
        this.translate.use(valueLanguage.value);
        this.settingManager.setSettingsValue('currentMeetingLanguage', valueLanguage.value);
    }

    itLocale() {
        this.dateAdapter.setLocale('it');
    }

    enLocale() {
        this.dateAdapter.setLocale('en');
    }

    async getEventData(): Promise<void> {
        await this.eventAPI.getEventCheckInData({id: this.eventId}).then((res: any) => {
            if (res.statusCode == 200) {
                clearInterval(this.intervalForSecretCode);
                clearInterval(this.interval);
                this.isSecretCodeErrorMessage = false;
                this.ischeckpointControlErrorMessage= false;
                this.isDisplayActivePage= false;
                this.isDisplayActivateButton= false;
                this.isActiveCheckType= false;
                this.editEventData = res.data;
                this.companyId = this.editEventData?.generalSetting?.companyId
                this.baseURL = this.editEventData?.generalSetting?.baseURL
                if (this.editEventData.type !== 'live') {
                    if (this.editEventData.status === this.concludedEvent) {
                        this.eventExpired = true;
                        this.eventNotFound = true;
                    }
                    if (this.editEventData.isMeetingLinkActiveBySecretCode) {
                        this.ischeckpointControlErrorMessage = false;
                        this.isSecretCodeErrorMessage = !res.data.isMeetingLinkActive;
                        this.isDisplayActivateButton = !res.data.isMeetingLinkActive;
                        this.isDisplayActivePage = res.data.isMeetingLinkActive;
                        if (this.editEventData.remainingActiveLinkDuration > 0) {
                            this.setRemainTimer(this.editEventData.remainingActiveLinkDuration);
                        }
                    } else {
                        if (!this.editEventData.activeCheckType || this.editEventData.activeCheckType == ''){
                            this.isActiveCheckType =  false;
                        } else {
                            this.isActiveCheckType =  true;
                        }
                        this.enableCheckPoint = this.editEventData.enableCheckPoint;
                        if (this.isActiveCheckType && this.enableCheckPoint) {
                            this.ischeckpointControlErrorMessage = false
                            this.isDisplayActivePage = true;
                            if (this.editEventData.remainingCheckPointDuration > 0 ) {
                                this.setRemainingCheckPointDuration(this.editEventData.remainingCheckPointDuration);
                            }
                        } else {
                            this.isDisplayActivePage = false;
                            this.ischeckpointControlErrorMessage = true;
                            this.isSecretCodeErrorMessage = false;
                            this.isDisplayActivateButton = false;
                        }
                    }
                } else {
                    this.eventNotFound = true;
                    this.isEventNotFound = true;
                }
            }
        }, (err) => {
            this.eventNotFound = true;
            this.isEventNotFound = true;
            /*swal.fire(
                'Info',
                this.translate.instant(err.error.message),
                'info'
            );*/
        });

    }


    setRemainingCheckPointDuration(value: any) {
        this.timeLeft = value / 1000;
        let miliseconds = value;
        this.interval = setInterval(() => {
            if (this.timeLeft > 1) {
                miliseconds = miliseconds - 1000;
                this.timeLeft--;
                let hours = Math.floor((miliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((miliseconds % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((miliseconds % (1000 * 60)) / (1000));
                hours.toString().length === 1 ? this.hours = '0' + hours.toString() : this.hours = hours.toString()
                minutes.toString().length === 1 ? this.minutes = '0' + minutes.toString() : this.minutes = minutes.toString()
                seconds.toString().length === 1 ? this.seconds = '0' + seconds.toString() : this.seconds = seconds.toString()
            } else {
                this.hours = '00';
                this.minutes = '00';
                this.seconds = '00';
                this.ischeckpointControlErrorMessage = true
                this.isDisplayActivePage = false;
                clearInterval(this.interval);
            }
        }, 1000);
    }

    setRemainTimer(value: any) {
        this.timeLeft = value / 1000;
        let miliseconds = value;
        this.intervalForSecretCode = setInterval(() => {
            if (this.timeLeft > 1) {
                miliseconds = miliseconds - 1000;
                this.timeLeft--;
                let hours = Math.floor((miliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((miliseconds % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((miliseconds % (1000 * 60)) / (1000));
                hours.toString().length === 1 ? this.hours = '0' + hours.toString() : this.hours = hours.toString()
                minutes.toString().length === 1 ? this.minutes = '0' + minutes.toString() : this.minutes = minutes.toString()
                seconds.toString().length === 1 ? this.seconds = '0' + seconds.toString() : this.seconds = seconds.toString()
            } else {
                /*Swal.fire(
                    '',
                    this.translate.instant('EVENT_MANAGEMENT.PageExpiredMessage'),
                    'info'
                );*/
                this.hours = '00';
                this.minutes = '00';
                this.seconds = '00';
                this.dialog.closeAll();
                this.isDisplayActivePage = false;
                this.isSecretCodeErrorMessage= true;
                this.isDisplayActivateButton= true;
                clearInterval(this.intervalForSecretCode);
            }
        }, 1000);
    }

    async createQRCodeData(eventId: any, baseURL:string) {
        this.helper.toggleLoaderVisibility(true);
        var that = this;
        this.eventAPI.createQRCodeEventPublic(eventId, baseURL).subscribe((event) => {
            if (event instanceof HttpResponse) {
                that.downloadLink = event.body.data.qrcode;
                this.helper.toggleLoaderVisibility(false);
            }
        }, (error) => {
            this.helper.toggleLoaderVisibility(false);
            Swal.fire(
                '',
                error.error.message,
                'info'
            )
        });
    }

    async checkWebexCheckInOut() {
        if (this.eventCheckInForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            this.eventCheckInForm.value.type = 'checkEventType';
            this.eventCheckInForm.value.meetingCode = +this.eventCheckInForm.value.meetingCode
            this.eventAPI.webexCheckInOut(this.eventCheckInForm.value).then((data: any) => {
                this.helper.toggleLoaderVisibility(false);
                if (data.result) {
                    if (data.Message == "") {
                        const dialogRef = this.dialog.open(ConfirmPopupComponent, {
                            data: {
                                message: this.translate.instant('confirm') + '?',
                                heading: this.translate.instant(data.type)
                            }
                        });
                        dialogRef.afterClosed().subscribe(result => {
                            if (result) {
                                this.helper.toggleLoaderVisibility(true);
                                this.eventCheckInForm.value.type = 'updateEventStatus'
                                this.eventAPI.webexCheckInOut(this.eventCheckInForm.value).then((data: any) => {
                                    this.helper.toggleLoaderVisibility(false);
                                    if (data.result) {
                                        Swal.fire(
                                            '',
                                            this.translate.instant(data.message) + " " + data.eventName,
                                            'success'
                                        )
                                    } else {
                                        Swal.fire(
                                            '',
                                            this.translate.instant(data.reason),
                                            'info'
                                        )
                                    }
                                }, (error) => {
                                    this.helper.toggleLoaderVisibility(false);
                                    Swal.fire(
                                        '',
                                        error.error.message,
                                        'info'
                                    )
                                });
                            }
                        });
                    } else {
                        Swal.fire(
                            '',
                            this.translate.instant(data.Message),
                            'info'
                        )
                    }
                } else {
                    Swal.fire(
                        '',
                        this.translate.instant(data.reason),
                        'info'
                    )
                }
            }, (error) => {
                this.helper.toggleLoaderVisibility(false);
                Swal.fire(
                    '',
                    error.error.message,
                    'info'
                )
            });
        }
    }

    changeTheme(primaryColor: string) {
        document.documentElement.style.setProperty("--primary-color", primaryColor)
    }

    activePageDialog() {
        const that = this;
        const dialogRef = this.dialog.open(ActivePagePopupComponent, {
            data: {
                eventId: this.eventId,
                companyId: this.companyId,
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.isDisplayActivePage = true;
                this.isSecretCodeErrorMessage= false;
                this.isDisplayActivateButton= false;
                this.setRemainTimer(result.meetingLinkDuration);
            }
        });
    }
}
