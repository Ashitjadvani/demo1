import {SelectionModel} from '@angular/cdk/collections';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {TranslateService} from '@ngx-translate/core';
import {EventHelper} from 'projects/fe-common-v2/src/lib';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import {MCPHelperService} from '../../../../../service/MCPHelper.service';
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";
import {ConfirmPopupComponent} from "../../../../../popup/confirm-popup/confirm-popup.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-no-record-found-message-with-footer',
    templateUrl: './no-record-found-message-with-footer.component.html',
    styleUrls: ['./no-record-found-message-with-footer.component.scss']
})
export class NoRecordFoundMessgaeWithFooterComponent implements OnInit {

    @Input() list: any[] = [];
    @Input() id: any;
    @Input() scopeId: any;
    @Input() authorId: any;
    @Input() saveInternalOwner: any = [];
    @Input() saveExternalOwner: any = [];
    @Input() saveExternalOrganize: any = [];
    @Input() saveInternalOrganize: any = [];
    @Input() saveExternalSpeaker: any = [];
    @Input() saveInternalSpeaker: any = [];
    @Input() saveExternalAttendee: any = [];
    @Input() saveInternalAttendee: any = [];
    @Input() saveExternalTechnicalSupport: any = [];
    @Input() saveInternalTechnicalSupport: any = [];
    @Input() saveExternalAssistant: any = [];
    @Input() saveInternalAssistant: any = [];
    @Input() selectedInternalPeople: any[] = [];
    @Input() stepName: string = '';
    @Input() selection = new SelectionModel<any>(true, []);
    @Input() attendeesStepper: MatStepper;
    @Input() eventStepper: MatStepper;
    @Input() finalValueForm: FormGroup;
    @Output() addExternalEvent: EventEmitter<any> = new EventEmitter();
    @Output() savedList: EventEmitter<any> = new EventEmitter();
    @Output() savedOwnerList: EventEmitter<any> = new EventEmitter();
    @Output() savedSpeakerList: EventEmitter<any> = new EventEmitter();
    @Output() savedAttendeeList: EventEmitter<any> = new EventEmitter();
    @Output() savedTechnicalSupportList: EventEmitter<any> = new EventEmitter();
    @Output() savedAssistantList: EventEmitter<any> = new EventEmitter();
    @Output() updateFinalFormValue: EventEmitter<any> = new EventEmitter();
    @Output() detectNewAttendeeUser: EventEmitter<any> = new EventEmitter();
    @Output() createICSFile: EventEmitter<any> = new EventEmitter();
    createTimeId: any;
    isNewAttendeeUserDetect: boolean = false;
    @Input() sendAttendeesUserList: any = []
    updateAttendeesUserList: any = [];
    saveOldAttendeesUserList: any = [];

    constructor(
        public translate: TranslateService,
        public eventAPI: EventManagementListOfEventService,
        private helper: MCPHelperService,
        public route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.createTimeId = this.route.snapshot.paramMap.get('id');
        this.saveOldAttendeesUserList = this.sendAttendeesUserList;
    }

    addExternal() {
        this.addExternalEvent.emit();
    }

    previousInfo() {
        if (this.stepName == 'owner') {
            this.eventStepper.previous();
        }
    }

    savInfo(stepper: any, saveExit: boolean) {
        if (this.id !== '0') {
            this.createICSFile.emit(this.id);
        }
        if (this.stepName == 'owner') {
            this.saveOwnerInfo(stepper, saveExit);
        } else if (this.stepName == 'organizer') {
            this.saveOrganizerInfo(stepper, saveExit);
        } else if (this.stepName == 'speaker') {
            this.saveSpeakerInfo(stepper, saveExit);
        } else if (this.stepName == 'attendee') {
            this.saveAttendeeDetailInfo(stepper, saveExit);
        } else if (this.stepName == 'technicalSupport') {
            this.saveTechnicalSupportInfo(stepper, saveExit);
        } else if (this.stepName == 'assistant') {
            this.saveAssistantInfo(stepper, saveExit);
        }
    }

    /*previousClick(stepper: MatStepper) {
        if (this.stepName == 'owner') {
            stepper.previous();
        }
    }*/

   /* async updateAttendeesUserCall(saveExit: any):Promise<void>{
        this.helper.toggleLoaderVisibility(true);
        this.eventAPI.attendeesCertificateAPI({id: this.id}).then((res: any) => {
            if (res.statusCode == 200){
                this.updateAttendeesUserList = res.data;
                var unique = [];
                for(var i = 0; i < this.updateAttendeesUserList.length; i++){
                    var found = false;
                    for(var j = 0; j < this.saveOldAttendeesUserList.length; j++){
                        if(this.updateAttendeesUserList[i].email == this.saveOldAttendeesUserList[j].email){
                            found = true;
                            break;
                        }
                    }
                    if(found == false){
                        unique.push(this.updateAttendeesUserList[i].email);
                    }
                }
                if (unique.length> 0){
                    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
                        data: {
                            message: this.translate.instant('Do you want to send invitation?'),
                            heading: this.translate.instant('GENERAL.Confirm'),
                        },
                    });
                    dialogRef.afterClosed().subscribe(async (result) => {
                        if (result) {
                            for (let i = 0; i < unique.length; i++) {
                                this.sendInvitationUserByEmail(unique[i]);
                            }
                            if (this.scopeId === null) {
                                this.router.navigate(['event-management/event-list/']);
                            } else {
                                this.router.navigate(['training/event-list/'+ this.scopeId]);
                            }
                        }else {
                            if (this.scopeId === null) {
                                this.router.navigate(['event-management/event-list/']);
                            } else {
                                this.router.navigate(['training/event-list/'+ this.scopeId]);
                            }
                        }
                    });
                }else {
                    if (saveExit){
                        if (this.scopeId === null) {
                            this.router.navigate(['event-management/event-list/']);
                        } else {
                            this.router.navigate(['training/event-list/'+ this.scopeId]);
                        }
                    }
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
    }*/

    /*async sendInvitationUserByEmail(email: string):Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.eventAPI.reInviteUserByMail({eventId : this.id, email: email});
        if (res.statusCode === 200) {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
        }
    }*/

    async saveOwnerInfo(stepper: MatStepper, saveExit):Promise<void>{
        this.helper.toggleLoaderVisibility(true);
        for (let i = 0; i < this.selection.selected.length; i++) {
            if (this.selection.selected) {
                let id: string = this.selection.selected[i].id;
                let name: string = this.selection.selected[i].name;
                let surname: string = this.selection.selected[i].surname;
                let email: string = this.selection.selected[i].email;
                this.selectedInternalPeople.push({id, name, surname, email});
            }
        }
        // let data =  this.saveInternalSpeaker.filter((el, i, a) => i === a.indexOf(el))
        let data = this.removeDuplicates(this.saveInternalOwner, 'id');
        this.saveInternalOwner = this.selectedInternalPeople.length > 0 ? this.selectedInternalPeople : data;
        const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
        this.saveInternalOwner = this.saveInternalOwner.map(o => filterKeys.reduce((acc, curr) => {
            if (curr == 'invitataion') {
                acc[curr] = o[curr] ? o[curr] : 'pending';
            }else if (curr == 'eventCreditCount'){
                acc[curr] = o[curr] ? o[curr] : 0;
            }else if (curr == 'isEmailSent'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else if (curr == 'attendeeId'){
                acc[curr] = o[curr] ? o[curr] : '';
            }else if (curr == 'checkPointsCompiled'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else {
                acc[curr] = o[curr];
            }
            return acc;
        }, {}));
        this.saveExternalOwner = this.list;
        this.finalValueForm.patchValue({
            id: this.id,
            authorId: this.authorId,
            attendees: {
                owner: {
                    internal: [...this.saveInternalOwner],
                    external: [...this.saveExternalOwner]
                },
                organizer: {
                    internal: [...this.saveInternalOrganize],
                    external: [...this.saveExternalOrganize]
                },
                speaker: {
                    internal: [...this.saveInternalSpeaker],
                    external: [...this.saveExternalSpeaker]
                },
                attendee: {
                    internal: [...this.saveInternalAttendee],
                    external: [...this.saveExternalAttendee]
                },
                technicalSupport: {
                    internal: [...this.saveInternalTechnicalSupport],
                    external: [...this.saveExternalTechnicalSupport]
                },
                assistant: {
                    internal: [...this.saveInternalAssistant],
                    external: [...this.saveExternalAssistant]
                },
            },
            step: '5'
        });
        this.eventAPI.getCreateEvent(this.finalValueForm.value).then((res:any) => {
            if (res.statusCode == 200){
                const updatedPeopleData = res?.data;
                this.selectedInternalPeople = [];
                let obj: any = {
                    saveInternalOwner: updatedPeopleData?.attendees?.owner?.internal,
                    saveExternalOwner: updatedPeopleData?.attendees?.owner?.external,
                    saveInternalOrganize: updatedPeopleData?.attendees?.organizer.internal,
                    saveExternalOrganize: updatedPeopleData?.attendees?.organizer.external,
                    saveInternalSpeaker: updatedPeopleData?.attendees?.speaker.internal,
                    saveExternalSpeaker: updatedPeopleData?.attendees?.speaker.external,
                    saveInternalAttendee: updatedPeopleData?.attendees?.attendee.internal,
                    saveExternalAttendee: updatedPeopleData?.attendees?.attendee.external,
                    saveInternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.internal,
                    saveExternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.external,
                    saveInternalAssistant: updatedPeopleData?.attendees?.assistant.internal,
                    saveExternalAssistant: updatedPeopleData?.attendees?.assistant.external,
                }
                this.savedList.emit(obj);
                //this.savedOwnerList.emit(obj);
                // this.list = [];
                if (saveExit) {
                    this.detectNewAttendeeUser.emit(saveExit);
                } else {
                    stepper.next();
                }
            }
            this.helper.toggleLoaderVisibility(false);
        }, (err) => {
            EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
            this.helper.toggleLoaderVisibility(false);

        });
    }

    saveOrganizerInfo(stepper: MatStepper, saveExit): void {
        this.helper.toggleLoaderVisibility(true);
        for (let i = 0; i < this.selection.selected.length; i++) {
            if (this.selection.selected) {
                let id: string = this.selection.selected[i].id;
                let name: string = this.selection.selected[i].name;
                let surname: string = this.selection.selected[i].surname;
                let email: string = this.selection.selected[i].email;
                this.selectedInternalPeople.push({id, name, surname, email});
            }
        }
        let data = this.removeDuplicates(this.saveInternalOrganize, 'id');
        this.saveInternalOrganize = this.selectedInternalPeople.length > 0 ? this.selectedInternalPeople : data;

        const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
        this.saveInternalOrganize = this.saveInternalOrganize.map(o => filterKeys.reduce((acc, curr) => {
            if (curr == 'invitataion') {
                acc[curr] = o[curr] ? o[curr] : 'pending';
            }else if (curr == 'eventCreditCount'){
                acc[curr] = o[curr] ? o[curr] : 0;
            }else if (curr == 'isEmailSent'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else if (curr == 'attendeeId'){
                acc[curr] = o[curr] ? o[curr] : '';
            }else if (curr == 'checkPointsCompiled'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else {
                acc[curr] = o[curr];
            }
            return acc;
        }, {}));

        this.saveExternalOrganize = this.list;
        if (this.saveInternalOrganize.length != 0 || this.list.length != 0) {
            this.finalValueForm.patchValue({
                id: this.id,
                authorId: this.authorId,
                attendees: {
                    owner: {
                        internal: [...this.saveInternalOwner],
                        external: [...this.saveExternalOwner]
                    },
                    organizer: {
                        internal: [...this.saveInternalOrganize],
                        external: [...this.saveExternalOrganize]
                    },
                    speaker: {
                        internal: [...this.saveInternalSpeaker],
                        external: [...this.saveExternalSpeaker]
                    },
                    attendee: {
                        internal: [...this.saveInternalAttendee],
                        external: [...this.saveExternalAttendee]
                    },
                    technicalSupport: {
                        internal: [...this.saveInternalTechnicalSupport],
                        external: [...this.saveExternalTechnicalSupport]
                    },
                    assistant: {
                        internal: [...this.saveInternalAssistant],
                        external: [...this.saveExternalAssistant]
                    },
                },
                step: '5'
            });
            this.eventAPI.getCreateEvent(this.finalValueForm.value).then((res:any) => {
                if (res.statusCode == 200){
                    const updatedPeopleData = res?.data;
                    this.selectedInternalPeople = [];
                    let obj: any = {
                        saveInternalOwner: updatedPeopleData?.attendees?.owner?.internal,
                        saveExternalOwner: updatedPeopleData?.attendees?.owner?.external,
                        saveInternalOrganize: updatedPeopleData?.attendees?.organizer.internal,
                        saveExternalOrganize: updatedPeopleData?.attendees?.organizer.external,
                        saveInternalSpeaker: updatedPeopleData?.attendees?.speaker.internal,
                        saveExternalSpeaker: updatedPeopleData?.attendees?.speaker.external,
                        saveInternalAttendee: updatedPeopleData?.attendees?.attendee.internal,
                        saveExternalAttendee: updatedPeopleData?.attendees?.attendee.external,
                        saveInternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.internal,
                        saveExternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.external,
                        saveInternalAssistant: updatedPeopleData?.attendees?.assistant.internal,
                        saveExternalAssistant: updatedPeopleData?.attendees?.assistant.external,
                    }
                    this.savedList.emit(obj);
                    //this.savedOwnerList.emit(obj);
                    // this.list = [];
                    if (saveExit) {
                        this.detectNewAttendeeUser.emit(saveExit);
                    } else {
                        stepper.next();
                    }
                }
                this.helper.toggleLoaderVisibility(false);
            }, (err) => {
                EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
                this.helper.toggleLoaderVisibility(false);
            });
        } else {
            EventHelper.showMessage('', this.translate.instant('Please select atleast one people.'), 'info')
            this.helper.toggleLoaderVisibility(false);
        }
    }

    saveSpeakerInfo(stepper: MatStepper, saveExit): void {
        this.helper.toggleLoaderVisibility(true);
        for (let i = 0; i < this.selection.selected.length; i++) {
            if (this.selection.selected) {
                let id: string = this.selection.selected[i].id;
                let name: string = this.selection.selected[i].name;
                let surname: string = this.selection.selected[i].surname;
                let email: string = this.selection.selected[i].email;
                this.selectedInternalPeople.push({id, name, surname, email});
            }
        }
        // let data =  this.saveInternalSpeaker.filter((el, i, a) => i === a.indexOf(el))
        let data = this.removeDuplicates(this.saveInternalSpeaker, 'id');
        this.saveInternalSpeaker = this.selectedInternalPeople.length > 0 ? this.selectedInternalPeople : data

        const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
        this.saveInternalSpeaker = this.saveInternalSpeaker.map(o => filterKeys.reduce((acc, curr) => {
            if (curr == 'invitataion') {
                acc[curr] = o[curr] ? o[curr] : 'pending';
            }else if (curr == 'eventCreditCount'){
                acc[curr] = o[curr] ? o[curr] : 0;
            }else if (curr == 'isEmailSent'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else if (curr == 'attendeeId'){
                acc[curr] = o[curr] ? o[curr] : '';
            }else if (curr == 'checkPointsCompiled'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else {
                acc[curr] = o[curr];
            }
            return acc;
        }, {}));

        this.saveExternalSpeaker = this.list;
        this.finalValueForm.patchValue({
            id: this.id,
            authorId: this.authorId,
            attendees: {
                owner: {
                    internal: [...this.saveInternalOwner],
                    external: [...this.saveExternalOwner]
                },
                organizer: {
                    internal: [...this.saveInternalOrganize],
                    external: [...this.saveExternalOrganize]
                },
                speaker: {
                    internal: [...this.saveInternalSpeaker],
                    external: [...this.saveExternalSpeaker]
                },
                attendee: {
                    internal: [...this.saveInternalAttendee],
                    external: [...this.saveExternalAttendee]
                },
                technicalSupport: {
                    internal: [...this.saveInternalTechnicalSupport],
                    external: [...this.saveExternalTechnicalSupport]
                },
                assistant: {
                    internal: [...this.saveInternalAssistant],
                    external: [...this.saveExternalAssistant]
                },
            },
            step: '5'
        });
        this.eventAPI.getCreateEvent(this.finalValueForm.value).then((res:any) => {
            if (res.statusCode == 200){
                const updatedPeopleData = res?.data;
                this.selectedInternalPeople = [];
                let obj: any = {
                    saveInternalOwner: updatedPeopleData?.attendees?.owner?.internal,
                    saveExternalOwner: updatedPeopleData?.attendees?.owner?.external,
                    saveInternalOrganize: updatedPeopleData?.attendees?.organizer.internal,
                    saveExternalOrganize: updatedPeopleData?.attendees?.organizer.external,
                    saveInternalSpeaker: updatedPeopleData?.attendees?.speaker.internal,
                    saveExternalSpeaker: updatedPeopleData?.attendees?.speaker.external,
                    saveInternalAttendee: updatedPeopleData?.attendees?.attendee.internal,
                    saveExternalAttendee: updatedPeopleData?.attendees?.attendee.external,
                    saveInternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.internal,
                    saveExternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.external,
                    saveInternalAssistant: updatedPeopleData?.attendees?.assistant.internal,
                    saveExternalAssistant: updatedPeopleData?.attendees?.assistant.external,
                }
                this.savedList.emit(obj);
                //this.savedSpeakerList.emit(obj);
                // this.list = [];
                if (saveExit) {
                    this.detectNewAttendeeUser.emit(saveExit);
                } else {
                    stepper.next();
                }
            }
            this.helper.toggleLoaderVisibility(false);
        }, (err) => {
            EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
            this.helper.toggleLoaderVisibility(false);

        });

    }

    saveAttendeeDetailInfo(stepper: MatStepper, saveExit) {
        this.helper.toggleLoaderVisibility(true);
        for (let i = 0; i < this.selection.selected.length; i++) {
            if (this.selection.selected) {
                let id: string = this.selection.selected[i].id;
                let name: string = this.selection.selected[i].name;
                let surname: string = this.selection.selected[i].surname;
                let email: string = this.selection.selected[i].email;
                this.selectedInternalPeople.push({id, name, surname, email});
            }
        }
        let data = this.removeDuplicates(this.saveInternalAttendee, 'id');
        this.saveInternalAttendee = this.selectedInternalPeople.length > 0 ? this.selectedInternalPeople : data;

        const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
        this.saveInternalAttendee = this.saveInternalAttendee.map(o => filterKeys.reduce((acc, curr) => {
            if (curr == 'invitataion') {
                acc[curr] = o[curr] ? o[curr] : 'pending';
            }else if (curr == 'eventCreditCount'){
                acc[curr] = o[curr] ? o[curr] : 0;
            }else if (curr == 'isEmailSent'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else if (curr == 'attendeeId'){
                acc[curr] = o[curr] ? o[curr] : '';
            }else if (curr == 'checkPointsCompiled'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else {
                acc[curr] = o[curr];
            }
            return acc;
        }, {}));

        this.saveExternalAttendee = this.list;
        if (this.saveInternalAttendee.length != 0 || this.list.length != 0) {
            this.finalValueForm.patchValue({
                id: this.id,
                authorId: this.authorId,
                attendees: {
                    owner: {
                        internal: [...this.saveInternalOwner],
                        external: [...this.saveExternalOwner]
                    },
                    organizer: {
                        internal: [...this.saveInternalOrganize],
                        external: [...this.saveExternalOrganize]
                    },
                    speaker: {
                        internal: [...this.saveInternalSpeaker],
                        external: [...this.saveExternalSpeaker]
                    },
                    attendee: {
                        internal: [...this.saveInternalAttendee],
                        external: [...this.saveExternalAttendee]
                    },
                    technicalSupport: {
                        internal: [...this.saveInternalTechnicalSupport],
                        external: [...this.saveExternalTechnicalSupport]
                    },
                    assistant: {
                        internal: [...this.saveInternalAssistant],
                        external: [...this.saveExternalAssistant]
                    },

                },
                step: '5'
            });
            this.eventAPI.getCreateEvent(this.finalValueForm.value).then((res:any) => {
                if (res.statusCode == 200){
                    const updatedPeopleData = res?.data;
                    this.selectedInternalPeople = [];
                    let obj: any = {
                        saveInternalOwner: updatedPeopleData?.attendees?.owner?.internal,
                        saveExternalOwner: updatedPeopleData?.attendees?.owner?.external,
                        saveInternalOrganize: updatedPeopleData?.attendees?.organizer.internal,
                        saveExternalOrganize: updatedPeopleData?.attendees?.organizer.external,
                        saveInternalSpeaker: updatedPeopleData?.attendees?.speaker.internal,
                        saveExternalSpeaker: updatedPeopleData?.attendees?.speaker.external,
                        saveInternalAttendee: updatedPeopleData?.attendees?.attendee.internal,
                        saveExternalAttendee: updatedPeopleData?.attendees?.attendee.external,
                        saveInternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.internal,
                        saveExternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.external,
                        saveInternalAssistant: updatedPeopleData?.attendees?.assistant.internal,
                        saveExternalAssistant: updatedPeopleData?.attendees?.assistant.external,
                    }
                    this.savedList.emit(obj);
                    // this.savedAttendeeList.emit(obj);
                    // this.list = [];
                    if (saveExit) {
                        this.detectNewAttendeeUser.emit(saveExit);
                    } else {
                        stepper.next();
                    }
                }
                this.helper.toggleLoaderVisibility(false);
            }, (err) => {
                EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
                this.helper.toggleLoaderVisibility(false);

            });
        } else {
            EventHelper.showMessage('', this.translate.instant('Please select atleast one people.'), 'info');
            this.helper.toggleLoaderVisibility(false);
        }
    }

    saveTechnicalSupportInfo(stepper: MatStepper, saveExit) {
        this.helper.toggleLoaderVisibility(true);
        for (let i = 0; i < this.selection.selected.length; i++) {
            if (this.selection.selected) {
                let id: string = this.selection.selected[i].id;
                let name: string = this.selection.selected[i].name;
                let surname: string = this.selection.selected[i].surname;
                let email: string = this.selection.selected[i].email;
                this.selectedInternalPeople.push({id, name, surname, email});
            }
        }
        let data = this.removeDuplicates(this.saveInternalTechnicalSupport, 'id');
        this.saveInternalTechnicalSupport = this.selectedInternalPeople.length > 0 ? this.selectedInternalPeople : data;

        const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
        this.saveInternalTechnicalSupport = this.saveInternalTechnicalSupport.map(o => filterKeys.reduce((acc, curr) => {
            if (curr == 'invitataion') {
                acc[curr] = o[curr] ? o[curr] : 'pending';
            }else if (curr == 'eventCreditCount'){
                acc[curr] = o[curr] ? o[curr] : 0;
            }else if (curr == 'isEmailSent'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else if (curr == 'attendeeId'){
                acc[curr] = o[curr] ? o[curr] : '';
            }else if (curr == 'checkPointsCompiled'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else {
                acc[curr] = o[curr];
            }
            return acc;
        }, {}));

        this.saveExternalTechnicalSupport = this.list;

        this.finalValueForm.patchValue({
            id: this.id,
            authorId: this.authorId,
            attendees: {
                owner: {
                    internal: [...this.saveInternalOwner],
                    external: [...this.saveExternalOwner]
                },
                organizer: {
                    internal: [...this.saveInternalOrganize],
                    external: [...this.saveExternalOrganize]
                },
                speaker: {
                    internal: [...this.saveInternalSpeaker],
                    external: [...this.saveExternalSpeaker]
                },
                attendee: {
                    internal: [...this.saveInternalAttendee],
                    external: [...this.saveExternalAttendee]
                },
                technicalSupport: {
                    internal: [...this.saveInternalTechnicalSupport],
                    external: [...this.saveExternalTechnicalSupport]
                },
                assistant: {
                    internal: [...this.saveInternalAssistant],
                    external: [...this.saveExternalAssistant]
                },
            },
            step: '5'
        });
        this.eventAPI.getCreateEvent(this.finalValueForm.value).then((res:any) => {
            if (res.statusCode == 200){
                const updatedPeopleData = res?.data;
                this.selectedInternalPeople = [];
                let obj: any = {
                    saveInternalOwner: updatedPeopleData?.attendees?.owner?.internal,
                    saveExternalOwner: updatedPeopleData?.attendees?.owner?.external,
                    saveInternalOrganize: updatedPeopleData?.attendees?.organizer.internal,
                    saveExternalOrganize: updatedPeopleData?.attendees?.organizer.external,
                    saveInternalSpeaker: updatedPeopleData?.attendees?.speaker.internal,
                    saveExternalSpeaker: updatedPeopleData?.attendees?.speaker.external,
                    saveInternalAttendee: updatedPeopleData?.attendees?.attendee.internal,
                    saveExternalAttendee: updatedPeopleData?.attendees?.attendee.external,
                    saveInternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.internal,
                    saveExternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.external,
                    saveInternalAssistant: updatedPeopleData?.attendees?.assistant.internal,
                    saveExternalAssistant: updatedPeopleData?.attendees?.assistant.external,
                }
                this.savedList.emit(obj);
                //this.savedTechnicalSupportList.emit(obj);
                // this.list = [];
                if (saveExit) {
                    this.detectNewAttendeeUser.emit(saveExit);
                } else {
                    stepper.next();
                }
            }
            this.helper.toggleLoaderVisibility(false);
        }, (err) => {
            EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
            this.helper.toggleLoaderVisibility(false);

        });
    }

    saveAssistantInfo(stepper: MatStepper, saveExit) {
        this.helper.toggleLoaderVisibility(true);
        for (let i = 0; i < this.selection.selected.length; i++) {
            if (this.selection.selected) {
                let id: string = this.selection.selected[i].id;
                let name: string = this.selection.selected[i].name;
                let surname: string = this.selection.selected[i].surname;
                let email: string = this.selection.selected[i].email;
                this.selectedInternalPeople.push({id, name, surname, email});
            }
        }
        let data = this.removeDuplicates(this.saveInternalAssistant, 'id');
        this.saveInternalAssistant = this.selectedInternalPeople.length > 0 ? this.selectedInternalPeople : data;

        const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
        this.saveInternalAssistant = this.saveInternalAssistant.map(o => filterKeys.reduce((acc, curr) => {
            if (curr == 'invitataion') {
                acc[curr] = o[curr] ? o[curr] : 'pending';
            }else if (curr == 'eventCreditCount'){
                acc[curr] = o[curr] ? o[curr] : 0;
            }else if (curr == 'isEmailSent'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else if (curr == 'attendeeId'){
                acc[curr] = o[curr] ? o[curr] : '';
            }else if (curr == 'checkPointsCompiled'){
                acc[curr] = o[curr] ? o[curr] : false;
            }else {
                acc[curr] = o[curr];
            }
            return acc;
        }, {}));

        this.saveExternalAssistant = this.list;

        this.finalValueForm.patchValue({
            id: this.id,
            authorId: this.authorId,
            attendees: {
                owner: {
                    internal: [...this.saveInternalOwner],
                    external: [...this.saveExternalOwner]
                },
                organizer: {
                    internal: [...this.saveInternalOrganize],
                    external: [...this.saveExternalOrganize]
                },
                speaker: {
                    internal: [...this.saveInternalSpeaker],
                    external: [...this.saveExternalSpeaker]
                },
                attendee: {
                    internal: [...this.saveInternalAttendee],
                    external: [...this.saveExternalAttendee]
                },
                technicalSupport: {
                    internal: [...this.saveInternalTechnicalSupport],
                    external: [...this.saveExternalTechnicalSupport]
                },
                assistant: {
                    internal: [...this.saveInternalAssistant],
                    external: [...this.saveExternalAssistant]
                },
            },
            step: '5'
        });
        this.eventAPI.getCreateEvent(this.finalValueForm.value).then((res:any) => {
            if (res.statusCode == 200){
                const updatedPeopleData = res?.data;
                this.selectedInternalPeople = [];
                let obj: any = {
                    saveInternalOwner: updatedPeopleData?.attendees?.owner?.internal,
                    saveExternalOwner: updatedPeopleData?.attendees?.owner?.external,
                    saveInternalOrganize: updatedPeopleData?.attendees?.organizer.internal,
                    saveExternalOrganize: updatedPeopleData?.attendees?.organizer.external,
                    saveInternalSpeaker: updatedPeopleData?.attendees?.speaker.internal,
                    saveExternalSpeaker: updatedPeopleData?.attendees?.speaker.external,
                    saveInternalAttendee: updatedPeopleData?.attendees?.attendee.internal,
                    saveExternalAttendee: updatedPeopleData?.attendees?.attendee.external,
                    saveInternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.internal,
                    saveExternalTechnicalSupport: updatedPeopleData?.attendees?.technicalSupport.external,
                    saveInternalAssistant: updatedPeopleData?.attendees?.assistant.internal,
                    saveExternalAssistant: updatedPeopleData?.attendees?.assistant.external,
                }
                this.savedList.emit(obj);
                //this.savedAssistantList.emit(obj);
                // this.list = [];
                if (saveExit) {
                    this.detectNewAttendeeUser.emit(saveExit);
                } else {
                    stepper.next();
                }
            }
            this.helper.toggleLoaderVisibility(false);
        }, (err) => {
            EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
            this.helper.toggleLoaderVisibility(false);

        });
    }

    removeDuplicates(myArray, Prop) {
        return myArray.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[Prop]).indexOf(obj[Prop]) === pos;
        });
    }

    back() {
        history.back();
    }

}
