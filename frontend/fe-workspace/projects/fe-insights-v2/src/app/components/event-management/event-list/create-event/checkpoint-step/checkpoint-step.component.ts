import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {EventHelper} from "../../../../../../../../fe-common-v2/src/lib";
import {MCPHelperService} from "../../../../../service/MCPHelper.service";
import {EventManagementListOfEventService} from "../../../../../../../../fe-common-v2/src/lib/services/event-management-list-of-event.service";
import {TranslateService} from "@ngx-translate/core";
import {HttpResponse} from "@angular/common/http";
import swal from "sweetalert2";
import {EventStatus} from "../../../../../../../../fe-common-v2/src/lib/enums/event-status.enum";
import {ConfirmPopupComponent} from "../../../../../popup/confirm-popup/confirm-popup.component";
import {RecruitingManagementService} from "../../../../../../../../fe-common-v2/src/lib/services/recruiting-management.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {Sort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import {PeriodicElement} from "../../../../quiz-survey/questions/add-edit-question/add-edit-question.component";
import Swal from "sweetalert2";
import {SelectionModel} from "@angular/cdk/collections";
import {EventManagementSettingService} from "../../../../../../../../fe-common-v2/src/lib/services/event-management-setting.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {SafePipe} from "../../../../../service/pipe.service";

@Component({
    selector: 'app-checkpoint-step',
    templateUrl: './checkpoint-step.component.html',
    styleUrls: ['./checkpoint-step.component.scss']
})
export class CheckpointStepComponent implements OnInit {
    @Input() finalValueForm: FormGroup;
    @Input() checkpointsInfoForm: FormGroup;
    @Input() authorId: any;
    @Input() eventStepper: MatStepper;
    @Input() id: any;
    @Input() scopeId: any;
    @Input() htmlContent: any;
    @Input() attendeeList: any;
    @Input() attendeeListData: any;
    @Input() editEventData: any;
    @Input() checkParamCount: any;
    @Input() disableInvitationFlow: any;
    @Output() detectNewAttendeeUser: EventEmitter<any> = new EventEmitter();
    @Output() callAttendees: EventEmitter<any> = new EventEmitter();
    @Output() createQRCode: EventEmitter<any> = new EventEmitter();
    @Output() createICSFile: EventEmitter<any> = new EventEmitter();
    @Output() updateFinalFormValue: EventEmitter<any> = new EventEmitter();
    @ViewChild('attendeeListTable') attendeeListTable: MatTable<PeriodicElement>;
    createTimeId: any;
    invitationEmail = false;
    invitationEmailData: any;
    eventDetailsForGoogle: any;
    cancelledEvent: number = EventStatus.Cancelled;
    concludedEvent: number = EventStatus.concluded;
    currentEvent: number = EventStatus.current;
    scheduledEvent: number = EventStatus.scheduled;
    searchAttendeeTxt: any = '';
    downloadLink: any = '';
    downloadICSLink: any = '';
    attendeeListForGoogleEvent: any;
    listOfAttendees: any;
    updateAttendeesUserList: any = [];
    saveOldAttendeesUserList: any = [];
    attendanceCertificateDisabled: boolean = false;
    attendanceCertificateChecked: boolean;
    isMeetingActiveBySecretCodeValue: boolean;
    hasAttendee: boolean = false;
    selectedAllAttendees: boolean = false;
    showCheckpointsUsers: boolean = false;
    attendeeNameDisplayedColumns: string[] = ['role', 'type', 'firstName', 'surname', 'sendCertificate'];
    currentEventStatus: boolean = true;
    isMeetingLinkActiveBySecretCode: boolean;
    config: AngularEditorConfig = {
        sanitize: false,
        editable: true,
        spellcheck: true,
        height: '13rem',
        minHeight: '4rem',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        toolbarHiddenButtons: [
            ['insertVideo']
        ],
        fonts: [
            {class: 'century-gothic', name: 'Century Gothic'},
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
        defaultFontName: 'Century Gothic',
        customClasses: [
            {
                name: 'LineHeight-15px',
                class: 'LineHeight-15px',
            },
            {
                name: 'LineHeight-20px',
                class: 'LineHeight-20px',
            },
            {
                name: 'LineHeight-25px',
                class: 'LineHeight-25px',
            },
            {
                name: 'LineHeight-30px',
                class: 'LineHeight-30px',
            },
            {
                name: 'Text-justify',
                class: 'Text-justify',
            }
        ],
    };
    /* attendees editor */
    nameOfEvent: any = '%Event_Name%';
    nameOfAttendee: any = '%Attendee_Name%';
    nameOfSpeaker: any = '%name_of_speaker%';
    dateOfEvent: any = '%date_of_event%';
    typeOfEvent: any = '%Type%';
    startDateOfEvent: any = '%Start_Date%';
    endDateOfEvent: any = '%End_date%';
    fromOfEvent: any = '%From%';
    toOfEvent: any = '%To%';
    numberOfCreditsOfEvent: any = '%NumberOfCredits%';

    //CheckPoints control
    hoursSelect = [];
    public defaultHours = '00';
    public defaultMinutes = '05';
    public defaultSeconds = '00';
    minutesSelect = [];
    secondsSelect = [];
    otherCheckParam = [];
    enableCheckpointFlag: boolean;
    mandatoryCheckInOutFlag: boolean;
    otherCheckParamFlag: boolean;
    enableDisableCheckPointFlag: boolean;
    interval: any;
    checked: string = '';
    checkIn: string = 'checkin'
    checkOut: string = 'checkout'
    checkpointsControlForm: FormGroup;
    Webex_CheckIn_URL : SafeUrl;
    private safePipe: SafePipe = new SafePipe(this.domSanitizer);
    url : any;

    constructor(
        private helper: MCPHelperService,
        public eventAPI: EventManagementListOfEventService,
        public translate: TranslateService,
        private recruitingManagementService: RecruitingManagementService,
        private router: Router,
        public dialog: MatDialog,
        public route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private GeneralSettingsAPiService: EventManagementSettingService,
        private domSanitizer: DomSanitizer
    ) {
        this.checkpointsControlForm = this.formBuilder.group({
            eventId: this.id,
            activeCheckType: '',
            enableCheckPoint: false,
            enableCheckPointDuration: 300000,
        });

        for (let i = 0; i <= 59; i++) {
            if (i < 10) {
                this.hoursSelect.push('0' + i);
                this.minutesSelect.push('0' + i);
                this.secondsSelect.push('0' + i);
            } else {
                this.hoursSelect.push(i);
                this.minutesSelect.push(i);
                this.secondsSelect.push(i);
            }
        }
        this.GeneralSettingsAPiService.getListForGeneralSettings({}).subscribe((data: any) => {
            const documentData = data.data;
            let res = documentData.baseURL + 'event/event-checkin/' + this.id;
            this.Webex_CheckIn_URL = this.safePipe.transform(res, 'url');
            let newRes : any = this.Webex_CheckIn_URL;
            this.Webex_CheckIn_URL = newRes.changingThisBreaksApplicationSecurity;
        });
    }

    ngOnInit(): void {
        this.createTimeId = this.route.snapshot.paramMap.get('id');
        if (this.id !== '0') {
            this.enableDisableCheckPointFlag = this.editEventData?.enableCheckPoint
            this.currentEventStatus = (this.editEventData?.status == this.currentEvent || this.editEventData?.status == this.scheduledEvent) ? false : true;
            this.disableInvitationFlow = (this.editEventData?.disableInvitationFlow == true) ? true : false;
            this.checkIntervalDuration(this.editEventData.remainingCheckPointDuration)
            let miliseconds = this.editEventData.enableCheckPointDurationSecond;
            let hours = Math.floor((miliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((miliseconds % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((miliseconds % (1000 * 60)) / (1000));
            if (hours > 0 || minutes > 0 || seconds > 0) {
                hours.toString().length === 1 ? this.defaultHours = '0' + hours.toString() : this.defaultHours = hours.toString()
                minutes.toString().length === 1 ? this.defaultMinutes = '0' + minutes.toString() : this.defaultMinutes = minutes.toString()
                seconds.toString().length === 1 ? this.defaultSeconds = '0' + seconds.toString() : this.defaultSeconds = seconds.toString()
            }
            this.createQRCode.emit(this.id);
            this.createICSFile.emit(this.id);
            //this.checkCheckpointValidation();
            this.callAttendees.emit();

        }
    }

    ngOnChanges() {
        if (this.checkpointsInfoForm.value.otherCheckParamCount) {
            this.getotherCheckParamCount(this.checkpointsInfoForm.value.otherCheckParamCount);
        }
        this.checked = this.checkpointsInfoForm?.value?.activeCheckType;
        /*if (this.mandatoryCheckInOutFlag && this.checked === '') {
            this.checked = 'checkin'
        } else if (!this.mandatoryCheckInOutFlag && this.otherCheckParamFlag && this.checked === '') {
            this.checked = 'check' + 1;
        }*/
    }

    activeCheckType(event: any, data: any) {
        if (event) {
            this.checked = data;
        } else {
            this.checked = '';
        }
        this.submitCheckpointControl();
    }

    getotherCheckParamCount(count: number) {
        this.otherCheckParam = [];
        for (let i = 1; i <= count; i++) {
            this.otherCheckParam.push(i);
        }
    }

    /*checkflagValue() {
        if (this.mandatoryCheckInOutFlag) {
            this.checked = 'checkin'
        } else if (this.otherCheckParamFlag) {
            this.checked = 'check' + 1;
        }
    }*/

    setCheckpointDuration() {
        this.submitCheckpointControl();
    }

    checkIntervalDuration(meetingLinkDuration: any) {
        if (meetingLinkDuration === 0) {
            this.checked = '';
        } else {
            this.interval = setTimeout(async () => {
                try {
                    this.checked = '';
                } catch (e) {
                }
                clearInterval(this.interval);
            }, meetingLinkDuration);
        }
    }


    enableDisableCheckPoint() {
        this.isMeetingLinkActiveBySecretCode = this.finalValueForm.value.isMeetingLinkActiveBySecretCode;
        if (this.id && this.id != '0' && !this.isMeetingLinkActiveBySecretCode) {
            this.enableDisableCheckPointFlag === true ? this.enableDisableCheckPointFlag = false : this.enableDisableCheckPointFlag = true
        }
        this.submitCheckpointControl();
    }

    submitCheckpointControl() {
        clearInterval(this.interval);
        this.isMeetingLinkActiveBySecretCode = this.finalValueForm.value.isMeetingLinkActiveBySecretCode;
        if (!this.isMeetingLinkActiveBySecretCode) {
            let meetingLinkDuration = (+this.defaultHours * 3.6e+6) + (+this.defaultMinutes * 60000) + (+this.defaultSeconds * 1000);
            if (meetingLinkDuration === 0) {
                this.checked = '';
            }
            this.checkIntervalDuration(meetingLinkDuration)
            this.checkpointsControlForm.patchValue({
                eventId: this.id,
                enableCheckPoint: this.enableDisableCheckPointFlag,
                enableCheckPointDuration: meetingLinkDuration,
                activeCheckType: this.checked
            })
            this.helper.toggleLoaderVisibility(true);
            this.eventAPI.getCreateEventCheckpointControl(this.checkpointsControlForm.value).then((res: any) => {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
            });
        }
    }

    saveCheckpointInfo(stepper: MatStepper, saveExit: boolean): void {
        this.checkCheckpointValidation();
        this.resetSearchAttendee();
        if (this.checkpointsInfoForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            let value = this.checkpointsInfoForm.value;
            this.finalValueForm.patchValue({
                id: this.id,
                authorId: this.authorId,
                isMeetingLinkActiveBySecretCode: value.isMeetingLinkActiveBySecretCode,
                addIcsFile: value.addIcsFile,
                checkpoints: {
                    checkInOut: value.checkInOut,
                    otherCheckParam: value.otherCheckParam,
                    otherCheckParamCount: value.otherCheckParamCount,
                    eventCredit: value.eventCredit,
                    eventCreditCount: value.eventCreditCount,
                    attendanceCertificate: value.attendanceCertificate,
                    attendeeCertificateData: value.attendeeCertificateData,
                    isMeetingLinkActive: value.isMeetingLinkActive,
                    eventSetting: {
                        sendInvitation: value.sendInvitation,
                        sendEmailReminder: value.sendEmailReminder,
                        remainderTime: value.remainderTime,
                        sendPushNotification: value.sendPushNotification,
                    },
                    attendeeCertificateUses: this.attendeeList
                },
                step: '7' // Event is complete
            });
            let finalResponse
            if (this.invitationEmail === true) {
                finalResponse = this.invitationEmailData;
                this.invitationEmail = false
            } else {
                finalResponse = this.finalValueForm.value;
            }
            this.eventAPI.getCreateEvent(finalResponse).then((res: any) => {
                this.selectedAllAttendees = false;
                this.currentEventStatus = (res.data?.status == this.currentEvent || res.data?.status == this.scheduledEvent) ? false : true;
                this.updateFinalFormValue.emit(res.data);
                this.createQRCode.emit(this.id);
                this.createICSFile.emit(this.id);
                this.eventDetailsForGoogle = res.data;
                var eventStatus = res.data.status;
                this.getAttendeeList()
                this.helper.toggleLoaderVisibility(false);
                if (saveExit) {
                    this.detectNewAttendeeUser.emit(saveExit);
                } else if (this.editEventData?.status == this.concludedEvent && !saveExit) {
                    this.detectNewAttendeeUser.emit(true);
                    //this.checkScopeIdRedirection();
                } else {
                    stepper.next();
                }
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
            });
        } else {
            Object.keys(this.checkpointsInfoForm.controls).forEach(field => {
                const control = this.checkpointsInfoForm.get(field);
                control.markAsTouched({onlySelf: true});
            });
        }
    }

    checkCheckpointValidation(): void {
        if (this.checkpointsInfoForm.value.otherCheckParam) {
            this.checkpointsInfoForm.get('otherCheckParamCount').setValidators([Validators.required]);
        } else {
            this.checkpointsInfoForm.get('otherCheckParamCount').clearValidators();
        }

        if (this.checkpointsInfoForm.value.eventCredit) {
            this.checkpointsInfoForm.get('eventCreditCount').setValidators([Validators.required]);
        } else {
            this.checkpointsInfoForm.get('eventCreditCount').clearValidators();
        }

        if (this.checkpointsInfoForm.value.sendEmailReminder) {
            this.checkpointsInfoForm.get('remainderTime').setValidators([Validators.required]);
        } else {
            this.checkpointsInfoForm.get('remainderTime').clearValidators();
        }
        this.checkpointsInfoForm.controls['otherCheckParamCount'].updateValueAndValidity();
        this.checkpointsInfoForm.controls['eventCreditCount'].updateValueAndValidity();
        this.checkpointsInfoForm.controls['remainderTime'].updateValueAndValidity();
        this.checkpointsInfoForm.updateValueAndValidity();

        this.eventCreditCountChange(this.checkpointsInfoForm.value.eventCreditCount);
    }

    resetSearchAttendee() {
        this.searchAttendeeTxt = '';
        this.attendeeList = this.attendeeListData;
        // this.attendeeListTable.renderRows();
    }

    /*async createQRCode(eventId: any) {
        var that = this;
        this.recruitingManagementService.createQRCodeAcceptEvent(eventId).subscribe((event) => {
            if (event instanceof HttpResponse) {
                that.downloadLink = event.body.data.qrcode;
            }
        }, (error) => {
            swal.fire(
                '',
                this.translate.instant(error.error.message),
                'info'
            )
        });
    }

    async createICSFile(eventId: any) {
        var that = this;
        this.eventAPI.createICSAPI({id: eventId}).then((res: any) => {
            if (res instanceof HttpResponse) {
                that.downloadICSLink = res.body.data.qrcode;
            }
        }, (error) => {
            swal.fire(
                '',
                this.translate.instant(error.error.message),
                'info'
            )
        });
    }*/

    async getAttendeeList() {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.eventAPI.attendeesCertificateAPI(this.id);
        if (res.statusCode === 200) {
            this.attendeeListForGoogleEvent = res.data
            const array = []
            for (var arr of this.attendeeListForGoogleEvent) {
                array.push({email: arr.email});
            }
            this.listOfAttendees = array;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
        }
        this.helper.toggleLoaderVisibility(false);
    }

    async checkScopeIdRedirection() {
        if (this.scopeId === null) {
            this.router.navigate(['event-management/event-list/']);
        } else {
            this.router.navigate(['training/event-list/' + this.scopeId]);
        }
        if (this.createTimeId != '0') {
            EventHelper.showMessage('', this.translate.instant('Event updated successfully'), 'success');
        } else {
            EventHelper.showMessage('', this.translate.instant('Event added successfully'), 'success');
        }
    }

    eventCreditCountChange(event: any) {
        if (event !== null) {
            if (this.checkpointsInfoForm.value.eventCredit === true && event != '') {
                if (event > 0) {
                    this.attendanceCertificateDisabled = false;
                } else {
                    this.checkpointsInfoForm.value.attendanceCertificate = false;
                    this.attendanceCertificateDisabled = true;
                    this.attendanceCertificateChecked = false;
                }
            }
        } else {
            this.attendanceCertificateDisabled = false;
        }

        if (event == '') {
            this.attendanceCertificateDisabled = false;
        }

        if (event == 0) {
            this.checkpointsInfoForm.value.attendanceCertificate = false;
            this.attendanceCertificateDisabled = true;
            this.attendanceCertificateChecked = false;
        }
    }

    eventCreditChange(event: any) {
        this.eventCreditCountChange(this.checkpointsInfoForm.value.eventCreditCount);
        if (event.checked === false) {
            this.attendanceCertificateDisabled = false;
        }
    }

    async sendInvitationAllByEmail(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        this.checkhasAttendee();
        if (this.attendeeList.length > 0) {
            this.eventAPI.reInviteALLByMail({eventId: this.id, authorId: this.authorId}).then((res: any) => {
                if (res.statusCode === 200) {
                    this.invitationEmail = true
                    this.invitationEmailData = res.data
                    this.helper.toggleLoaderVisibility(false);
                    EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
                } else {
                    this.helper.toggleLoaderVisibility(false);
                    EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
                }
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                Swal.fire(
                    '',
                    this.translate.instant(err.error.message),
                    'info'
                );
            });

        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant('PleaseSelectAtLeastOneUserToResendInvitation'), 'info');
        }
    }

    async sendPushNotification() {
        await this.eventAPI.sendPushNotification({eventId: this.id}).then((res: any) => {
            this.helper.toggleLoaderVisibility(false);
            if (res.statusCode === 200) {
                EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
            } else {
                EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
            }
        }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            Swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
            );
        });
    }

    async sendPinAttendees() {
        await this.eventAPI.sendPersonalPincodeEmail({eventId: this.id}).then((res: any) => {
            this.helper.toggleLoaderVisibility(false);
            if (res.statusCode === 200) {
                EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
            } else {
                EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
            }
        }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            Swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
            );
        });
    }

    /**/
    fnSetPlaceHolder(_value: string) {
        var parentEl = null, selection;
        if (window.getSelection) {
            selection = window.getSelection();
            if (selection.rangeCount) {
                parentEl = selection.getRangeAt(0).commonAncestorContainer;
                const editorEl = document.getElementsByClassName('angular-editor-textarea')[0] as HTMLInputElement;
                const editorDivEl = document.getElementsByClassName('editor-render-event')[0] as HTMLInputElement;
                while (parentEl !== editorEl) {
                    parentEl = parentEl.parentElement
                    if (editorDivEl === parentEl) {
                        break;
                    }
                }
                if (parentEl === editorEl) {
                    if (selection.getRangeAt && selection.rangeCount) {
                        var range = selection.getRangeAt(0);
                        range.deleteContents();
                        range.insertNode(document.createTextNode(_value));
                    }
                }
                this.htmlContent = editorEl.innerHTML
            }
        }
    }

    async callSendEmailReminder(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        this.checkhasAttendee();
        if (this.attendeeList.length > 0) {
            const res: any = await this.eventAPI.sendEmailReminder({eventId: this.id, authorId: this.authorId});
            if (res.statusCode === 200) {
                EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
            } else {
                EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
            }
            this.helper.toggleLoaderVisibility(false);
        } else {
            EventHelper.showMessage('', this.translate.instant('PleaseSelectAtLeastOneUserToSendEmailReminder'), 'info');
            this.helper.toggleLoaderVisibility(false);
        }
    }

    checkhasAttendee() {
        this.hasAttendee = false;
        for (let i = 0; i < this.attendeeList.length; i++) {
            if (this.attendeeList[i].sendCertificate === true) {
                this.hasAttendee = true;
            }
        }
    }


    async sendAttendeeCertificate(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        this.checkhasAttendee();
        if (this.hasAttendee) {
            const res: any = await this.eventAPI.sendAttendeeCertificate({
                eventId: this.id,
                certificateUsers: this.attendeeList,
                attendeeCertificateData: this.htmlContent,
                eventCredit: this.checkpointsInfoForm.value.eventCredit,
                eventCreditCount: this.checkpointsInfoForm.value.eventCreditCount
            });
            if (res.statusCode === 200) {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
            } else {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
            }
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant('PleaseSelectAtLeastOneUserToSendCertificate'), 'info');
        }
    }

    async onAllEnableClick(event: any) {
        if (!this.selectedAllAttendees) {
            this.selectedAllAttendees = true;
        } else {
            this.selectedAllAttendees = false;
        }
        this.attendeeList.forEach(row => {
            row.sendCertificate = this.selectedAllAttendees
        });
        this.attendeeListTable.renderRows();
    }

    changeSort(sort: Sort) {
        this.attendeeList = this.attendeeList.sort((a, b) => {
            const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
            return sort.direction == 'asc' ? value : -value
        })
        this.attendeeListData = this.attendeeList;
        this.attendeeListTable.renderRows();
    }

    searchAttendee($event: any) {
        const filterValue = ($event.target as HTMLInputElement).value;
        this.searchAttendeeTxt = filterValue;
        this.attendeeList = this.attendeeListData.filter(
            x => x.role.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
                x.type.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
                x.firstName.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
                x.surname.toLowerCase().includes(filterValue.trim().toLowerCase())
        );
        this.attendeeListTable.renderRows();
    }

    async onEnableClick(element: any, index: any) {
        element.sendCertificate = !element.sendCertificate;
        this.attendeeList[index] = element;
        this.attendeeList = this.attendeeList;
        this.checkAllAttendees();
        this.attendeeListTable.renderRows();
    }

    checkAllAttendees() {
        this.selectedAllAttendees = true;
        this.attendeeList.forEach(row => {
            if (!row.sendCertificate) {
                this.selectedAllAttendees = false;
            }
        });
    }

    async showCheckpointsCompliedUsers(checked: boolean): Promise<void> {
        this.selectedAllAttendees = false;
        this.helper.toggleLoaderVisibility(true);
        if (checked) {
            await this.eventAPI.getEventDetailsCount({id: this.id}).then((res: any) => {
                this.helper.toggleLoaderVisibility(false);
                this.attendeeList = res.data.checkPointsCompiledData;
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                Swal.fire(
                    '',
                    this.translate.instant(err.error.message),
                    'info'
                );
            });
        } else {
            this.eventAPI.attendeesCertificateAPI({id: this.id}).then((res: any) => {
                if (res.statusCode == 200) {
                    this.attendeeList = res.data;
                }
                this.helper.toggleLoaderVisibility(false);
            }, (error) => {
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant(error.error.message),
                    'info'
                )
            });
        }
    }

    async filterAttendeeList(filterValue: any): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        this.eventAPI.attendeesCertificateAPI({id: this.id}).then((res: any) => {
            if (res.statusCode == 200) {
                this.attendeeList = res.data;
                this.selectedAllAttendees = false;
                this.showCheckpointsUsers = false;
                if (filterValue !== '') {
                    this.attendeeList = this.attendeeList.filter(item => item.role == filterValue);
                }
            }
            this.helper.toggleLoaderVisibility(false);
        }, (error) => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant(error.error.message),
                'info'
            )
        });
        this.attendeeListTable.renderRows();
    }

    back() {
        history.back();
    }

}
