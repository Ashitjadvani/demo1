import {DatePipe} from '@angular/common';
import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateAdapter, MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatStepper} from '@angular/material/stepper';
import {TranslateService} from '@ngx-translate/core';
import {EventHelper} from 'projects/fe-common-v2/src/lib';
import {EventManagementCostCenterService} from 'projects/fe-common-v2/src/lib/services/event-management-cost-centers.service';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import {EventManagementScopesService} from 'projects/fe-common-v2/src/lib/services/event-management-scopes.service';
import {PeopleManagementService} from 'projects/fe-common-v2/src/lib/services/people-management.service';
import {MCPHelperService} from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmPopupComponent} from "../../../../../popup/confirm-popup/confirm-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {EventStatus} from "../../../../../../../../fe-common-v2/src/lib/enums/event-status.enum";
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
    selector: 'app-create-event-detail-info',
    templateUrl: './create-event-detail-info.component.html',
    styleUrls: ['./create-event-detail-info.component.scss']
})
export class CreateEventDetailInfoComponent implements OnInit {

    @Input() eventStepper: MatStepper;
    @Input() authorId: any;
    @Input() id: any;
    @Input() scopeId: any;
    @Input() finalValueForm: FormGroup;
    @Input() detailsInfoForm: FormGroup;
    @Input() detailsInfoFormOldData: any;
    @Input() eventCurrentStatus: any;
    @Input() disableInvitationFlow: any;
    @Output() changeId: EventEmitter<any> = new EventEmitter();
    @Output() detectNewAttendeeUser: EventEmitter<any> = new EventEmitter();
    @Output() updateFinalFormValue: EventEmitter<any> = new EventEmitter();
    @Output() sendInvitationAllByEmailNew: EventEmitter<any> = new EventEmitter();
    @Output() createICSFile: EventEmitter<any> = new EventEmitter();
    createTimeId: any;
    scopesList: any = [];
    costCenterList: any = [];
    areaList: any = [];
    allSelected = false;
    @ViewChild('select') select: MatSelect;
    public today: Date = new Date();
    fromTimeValue: any;
    changeDetect: boolean = false;
    detailsInfoFormGetData: any;
    cancelledEvent: number = EventStatus.Cancelled;
    concludedEvent: number = EventStatus.concluded;
    currentEvent: number = EventStatus.current;
    inProgressEvent: number = EventStatus.inProgress;

    panelOpenState = false;
    // text editor config
    config: AngularEditorConfig = {
        sanitize: false,
        editable: true,
        spellcheck: true,
        height: '20rem',
        minHeight: '9rem',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        toolbarHiddenButtons: [
            ['insertVideo']

        ],
        fonts: [
            {class: 'garamond', name: 'Garamond'},
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


    constructor(
        private datePipe: DatePipe,
        public eventAPI: EventManagementListOfEventService,
        public translate: TranslateService,
        private helper: MCPHelperService,
        private scopeApi: EventManagementScopesService,
        private costCenterApi: EventManagementCostCenterService,
        private eventAreaApi: PeopleManagementService,
        private _adapter: DateAdapter<any>,
        private router: Router,
        public route: ActivatedRoute,
        public dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.createTimeId = this.route.snapshot.paramMap.get('id');
        this.getScopesList();
        this.getCostCenterList();
        this.getEventAreaList();
        setTimeout(()=>{
            this.detailsInfoFormGetData = this.detailsInfoFormOldData;
        },500)
    }

    async getScopesList(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.scopeApi.getScopesList({limit: null});
        if (res.statusCode === 200) {
            this.scopesList = res.data;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            // const e = err.error;
            EventHelper.showMessage('', this.translate.instant(res.error), 'info');
        }
    }

    onTimeChange(event: any) {
        this.fromTimeValue = event;
    }

    saveDetailsInfo(stepper: MatStepper, saveExit: boolean): void {
        if (this.detailsInfoForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            let value = this.detailsInfoForm.value;
            this.finalValueForm.patchValue({
                name: value.name,
                scope: value.scope,
                emailFrom: value.emailFrom,
                costCenter: value.costCenter,
                type: value.type,
                area: value.area,
                startDate: this.datePipe.transform(value.startDate, 'yyyy-MM-dd'),
                endDate: this.datePipe.transform(value.endDate, 'yyyy-MM-dd'),
                from: value.from,
                to: value.to,
                disableInvitationFlow: value.disableInvitationFlow,
                description: value.description,
                isEditEventCredit: false,
                authorId: this.authorId,
                step: '1'
            });
            if (this.id !== '0') {
                this.finalValueForm.value.id = this.id;
                this.checkChangeData();
            }
            if (this.changeDetect && !value.disableInvitationFlow) {
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
                        /*this.sendInvitationAllByEmailNew.emit()*/
                    }else {
                        this.getCreateEventCall(saveExit, stepper, false);
                    }
                });
            } else {
                this.helper.toggleLoaderVisibility(false);
                this.getCreateEventCall(saveExit, stepper, false);
            }
        } else {
            this.helper.toggleLoaderVisibility(false);
            Object.keys(this.detailsInfoForm.controls).forEach(field => {
                const control = this.detailsInfoForm.get(field);
                control.markAsTouched({onlySelf: true});
            });
        }
    }

    slash(event: any) {
        if ((event.code === 'Slash') || (event.target.selectionStart === 0 && event.code === 'Space')) {
            event.preventDefault();
        }
    }

    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

    toggleAllSelection() {
        if (this.allSelected) {
            this.select.options.forEach((item: MatOption) => item.select());
        } else {
            this.select.options.forEach((item: MatOption) => item.deselect());
        }
    }

    optionClick() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelected = newStatus;
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

        this.eventAPI.getCreateEvent(paraMeter).then((res: any) => {
            this.helper.toggleLoaderVisibility(false);
            this.detailsInfoFormGetData = res.data;
            this.id = res.data.id;
            this.changeId.emit(this.id);
            this.updateFinalFormValue.emit(res.data);
            /*if (this.id !== '0') {
                this.createICSFile.emit(this.id);
            }*/
            if (saveExit) {
                this.detectNewAttendeeUser.emit(saveExit);
            } else {
                stepper.next();
            }
        }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
        });
    }

    async getCostCenterList(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.costCenterApi.getCostCenterList({limit: null});
        if (res.statusCode === 200) {
            this.costCenterList = res.data;
            if (this.detailsInfoForm.value.costCenter.length === this.costCenterList.length) {
                this.allSelected = true;
            } else {
                this.allSelected = false;
            }
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            // const e = err.error;
            EventHelper.showMessage('', this.translate.instant(res.error), 'info');
        }
    }

    async getEventAreaList(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        this.eventAreaApi.getEventAreaList('').subscribe((res: any) => {
            if (res.statusCode === 200) {
                this.areaList = res.data;
                this.helper.toggleLoaderVisibility(false);
            } else {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(res.error), 'info');
            }
        });
    }

    async checkChangeData(): Promise<void> {
        if (this.eventCurrentStatus != this.inProgressEvent){
            this.detailsInfoFormGetData.startDate = this.datePipe.transform(this.detailsInfoFormGetData.startDate, 'yyyy-MM-dd');
            this.detailsInfoForm.value.startDate = this.datePipe.transform(this.detailsInfoForm.value.startDate, 'yyyy-MM-dd');
            this.detailsInfoFormGetData.endDate = this.datePipe.transform(this.detailsInfoFormGetData.endDate, 'yyyy-MM-dd');
            this.detailsInfoForm.value.endDate = this.datePipe.transform(this.detailsInfoForm.value.endDate, 'yyyy-MM-dd');
            if (this.detailsInfoFormGetData.startDate !== this.detailsInfoForm.value.startDate || this.detailsInfoFormGetData.endDate !== this.detailsInfoForm.value.endDate ||
                this.detailsInfoFormGetData.from !== this.detailsInfoForm.value.from || this.detailsInfoFormGetData.to !== this.detailsInfoForm.value.to) {
                this.changeDetect = true;
            } else {
                this.changeDetect = false
            }
            this.detailsInfoFormGetData = this.finalValueForm.value;
        }
    }


    streamOpened() {
        if (localStorage.getItem('currentLanguage') == 'it') {
            this._adapter.setLocale('it-IT');
        } else {
            this._adapter.setLocale('eg-EG');
        }
    }

    back() {
        history.back();
    }
}
