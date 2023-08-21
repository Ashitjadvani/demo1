import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatStepper} from '@angular/material/stepper';
import {TranslateService} from '@ngx-translate/core';
import {EventHelper} from 'projects/fe-common-v2/src/lib';
import {EventManagementExternalVenuesService} from 'projects/fe-common-v2/src/lib/services/event-management-external-venues.service';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import {AddEditSingleFieldPopupComponent} from 'projects/fe-insights-v2/src/app/popup/add-edit-single-field-popup/add-edit-single-field-popup.component';
import {MCPHelperService} from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import {ActivatedRoute, Router} from "@angular/router";
import {fork} from "child_process";
import {ConfirmPopupComponent} from "../../../../../popup/confirm-popup/confirm-popup.component";
import {EventStatus} from "../../../../../../../../fe-common-v2/src/lib/enums/event-status.enum";

@Component({
    selector: 'app-venue-step',
    templateUrl: './venue-step.component.html',
    styleUrls: ['./venue-step.component.scss']
})
export class VenueStepComponent implements OnInit {

    @Input() finalValueForm: FormGroup;
    @Input() venuesInfoForm: FormGroup;
    @Input() authorId: any;
    @Input() eventStepper: MatStepper;
    @Input() id: any;
    @Input() scopeId: any;
    @Input() detailsInfoFormOldData: any;
    @Input() eventCurrentStatus: any;
    @Output() changeVenueEvent: EventEmitter<void> = new EventEmitter();
    @Output() detectNewAttendeeUser: EventEmitter<any> = new EventEmitter();
    @Output() updateFinalFormValue: EventEmitter<any> = new EventEmitter();
    @Output() sendInvitationAllByEmailNew: EventEmitter<any> = new EventEmitter();
    @Input() venueSiteList: any;
    @Input() externalVenuesList: any;
    @Input() vanueDetailsForm: FormGroup;
    @Output() createICSFile: EventEmitter<any> = new EventEmitter();
    createTimeId: any;
    changeDetectVenue: boolean = false;
    venuesInfoFormGetData: any;
    cancelledEvent: number = EventStatus.Cancelled;
    concludedEvent: number = EventStatus.concluded;
    currentEvent: number = EventStatus.current;
    inProgressEvent: number = EventStatus.inProgress;

    constructor(
        public eventAPI: EventManagementListOfEventService,
        public translate: TranslateService,
        public dialog: MatDialog,
        private externalVenuesApi: EventManagementExternalVenuesService,
        private helper: MCPHelperService,
        private _formBuilder: FormBuilder,
        public route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.createTimeId = this.route.snapshot.paramMap.get('id');
        //this.venuesInfoFormOldData = this.venuesInfoForm.value;
        setTimeout(()=>{
            this.venuesInfoFormGetData = this.detailsInfoFormOldData?.venue;
        },500)
    }

    saveVenuesInfo(stepper: MatStepper, saveExit: boolean): void {
        if (this.finalValueForm.value.type === 'live') {
            this.setVenuesValidators('validate');
            this.setMeetingLinkValidators('clear');
        } else if (this.finalValueForm.value.type === 'online') {
            this.setMeetingLinkValidators('validate');
            this.setVenuesValidators('clear');
        } else if (this.finalValueForm.value.type === 'hybrid') {
            this.setMeetingLinkValidators('validate');
            this.setVenuesValidators('validate');
        }

        if (this.venuesInfoForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            let value = this.venuesInfoForm.value
            this.finalValueForm.patchValue({
                id: this.id,
                authorId: this.authorId,
                venue: {
                    meetingLink: value.meetingLink,
                    vanue: value.venue,
                },
                step: '2'
            });
            if (this.id !== '0') {
                this.checkChangeData();
            }
            if (this.changeDetectVenue){
                this.helper.toggleLoaderVisibility(false);
                const dialogRef = this.dialog.open(ConfirmPopupComponent, {
                    data: {
                        message: this.translate.instant('Do you want to send invitation?'),
                        heading: this.translate.instant('GENERAL.Confirm'),
                    },
                    disableClose: true
                });
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result) {
                        this.getCreateEventCall(saveExit, stepper, true);
                        //this.sendInvitationAllByEmailNew.emit()
                    }else {
                        this.getCreateEventCall(saveExit, stepper, false);
                    }
                });
            }else {
                this.getCreateEventCall(saveExit, stepper, false);
            }
        } else {
            Object.keys(this.venuesInfoForm.controls).forEach(field => {
                const control = this.venuesInfoForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

    async getCreateEventCall(saveExit, stepper, isInvite): Promise<void> {
        if (isInvite){
            var paraMeter = {
                ...this.finalValueForm.value,
                invitationStatus: "reInviteAll"
            }
        }else {
            var paraMeter = {
                ...this.finalValueForm.value,
            }
        }
        this.eventAPI.getCreateEvent(paraMeter).then((res:any) => {
            this.helper.toggleLoaderVisibility(false);
            this.updateFinalFormValue.emit(res.data);
            /*if (this.id !== '0') {
                this.createICSFile.emit(this.id);
            }*/
            this.venuesInfoFormGetData = res.data?.venue;
            if (saveExit){
                this.detectNewAttendeeUser.emit(saveExit);
            }else {
                stepper.next();
            }
        }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
        });
    }
    async checkChangeData(): Promise<void> {
        if (this.eventCurrentStatus != this.inProgressEvent){
            this.changeDetectVenue = false;
            for (let i = 0; i < this.venuesInfoFormGetData?.vanue?.length; i++) {
                if (this.venuesInfoFormGetData?.vanue[i]?.site != this.venuesInfoForm?.value?.venue[i]?.site ||
                    this.venuesInfoFormGetData?.vanue[i]?.type != this.venuesInfoForm?.value?.venue[i]?.type){
                    this.changeDetectVenue = true;
                    break;
                }
            }

            if (this.venuesInfoFormGetData?.meetingLink !== this.venuesInfoForm?.value?.meetingLink) {
                this.changeDetectVenue = true;
            }

            this.venuesInfoFormGetData = this.finalValueForm.value;
        }
    }

    setVenuesValidators(status: any): void {
        const expvalidation = <FormArray>this.venuesInfoForm.get('venue');
        if (status === 'validate') {
            expvalidation.at(0).get('type').setValidators([Validators.required]);
            expvalidation.at(0).get('site').setValidators([Validators.required]);
        } else {
            expvalidation.at(0).get('type').clearValidators();
            expvalidation.at(0).get('site').clearValidators();
        }
        expvalidation.at(0).get('type').updateValueAndValidity();
        expvalidation.at(0).get('site').updateValueAndValidity();
        this.venuesInfoForm.updateValueAndValidity();
    }

    setMeetingLinkValidators(status: any): void {
        if (status === 'validate') {
            this.venuesInfoForm.controls['meetingLink'].setValidators([Validators.required]);
        } else {
            this.venuesInfoForm.controls['meetingLink'].clearValidators();
        }
        this.venuesInfoForm.controls['meetingLink'].updateValueAndValidity();
        this.venuesInfoForm.updateValueAndValidity();
    }

    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

    changeVenueType(event, index): void {
        this.changeVenueEvent.emit(event)
    }

    openExternalVenue() {
        const dialogRef = this.dialog.open(AddEditSingleFieldPopupComponent, {
            data: {
                placeholder: 'EVENT_MANAGEMENT.External_Venues_Name',
                heading: 'EVENT_MANAGEMENT.Add_External_Venues',
                validation: 'EVENT_MANAGEMENT.EnterExternalVenueName'
            }
        });
        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                this.externalVenuesApi.addExternalVenuesType(result).subscribe((res: any) => {
                    if (res.statusCode === 200) {
                        this.changeVenueEvent.emit();
                        this.helper.toggleLoaderVisibility(false);
                        EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
                    }
                    this.helper.toggleLoaderVisibility(false);
                }, (err) => {
                    this.helper.toggleLoaderVisibility(false);
                    EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
                });
            }
        });
    }

    get formVenueInfoArr(): any {
        return this.venuesInfoForm.get('venue') as FormArray;
    }

    addVenueInfoRow(index: number): void {
        this.formVenueInfoArr.push(this.initVenueInfoRows(index));
    }

    initVenueInfoRows(index: number): any {
        var event: any = 'internal';
        this.changeVenueEvent.emit(event)
        return this._formBuilder.group({
            type: ['internal'],
            site: [null]
        });
    }

    deleteVenueInfoRow(index: number): void {
        this.formVenueInfoArr.removeAt(index);
    }

    back() {
        history.back();
    }

}
