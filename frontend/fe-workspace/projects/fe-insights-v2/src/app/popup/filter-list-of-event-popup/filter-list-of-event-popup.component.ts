import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import {} from '@angular/material/datepicker';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from 'projects/fe-common-v2/src/lib/services/common.service';
import {MasterModulesUniversityService} from 'projects/fe-common-v2/src/lib/services/master-modules-university.service';
import {EventManagementScopesService} from 'projects/fe-common-v2/src/lib/services/event-management-scopes.service';
import {EventManagementCostCenterService} from 'projects/fe-common-v2/src/lib/services/event-management-cost-centers.service';
import swal from "sweetalert2";
import {MCPHelperService} from "../../service/MCPHelper.service";
import {PeopleManagementService} from "../../../../../fe-common-v2/src/lib/services/people-management.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {DatePipe} from "@angular/common";
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {ActivatedRoute} from "@angular/router";

export const PICK_FORMATS = {
    parse: {
        parse: {dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'}},
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'D MMM YYYY',
    }
};

export class ListOfEventFilterData {
    freeSearch: string;
    name: string;
    scope: string;
    scopeName: string;
    costCenter: string;
    costCenterName: string;
    startDate: string;
    startDateFt: string;
    endDate: string;
    endDateFt: string;
    type: string;
    area: string;

    constructor() {
        this.freeSearch = null;
        this.name = null;
        this.scope = null;
        this.costCenter = null;
        this.startDate = null;
        this.startDateFt = '';
        this.endDate = null;
        this.endDateFt = '';
        this.type = null;
        this.area = null;
        this.scopeName = ''
        this.costCenterName = ''

    }

    static getFieldText(fieldName: string, listOfEventFilterData: ListOfEventFilterData) {
        if (fieldName == 'scope')
            return listOfEventFilterData.scopeName;
        else if (fieldName == 'costCenter')
            return listOfEventFilterData.costCenterName;
        else if (fieldName == 'startDate')
            return listOfEventFilterData.startDateFt;
        else if (fieldName == 'endDate')
            return listOfEventFilterData.endDateFt;

        return listOfEventFilterData[fieldName];
    }

}

@Component({
    selector: 'app-filter-job-applications-popup',
    templateUrl: './filter-list-of-event-popup.component.html',
    styleUrls: ['./filter-list-of-event-popup.component.scss'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: {showError: true},
        },
        {provide: MAT_DATE_LOCALE, useValue: 'it'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    ],
})
export class FilterListOfEventPopupComponent implements OnInit {
    types: any = [
        {id: 'Live', value: this.translate.instant('EVENT_MANAGEMENT.Live')},
        {id: 'Online', value: this.translate.instant('EVENT_MANAGEMENT.Online')},
        {id: 'Hybrid', value: this.translate.instant('EVENT_MANAGEMENT.Hybrid')},
    ];
    costCenter: any[] = [];
    applicationStatusTableData: any[] = [];
    scopes: any[] = [];
    startDate: '';
    public today: Date = new Date();
    endDate: '';
    filterListOfEventForm: FormGroup;
    listOfEventFilterData: ListOfEventFilterData;
    areaList: any;
    scopeId: any;

    constructor(
        public dialogRef: MatDialogRef<FilterListOfEventPopupComponent>,
        private formBuilder: FormBuilder,
        private commonService: CommonService,
        private translate: TranslateService,
        private helper: MCPHelperService,
        private eventAreaApi: PeopleManagementService,
        private _adapter: DateAdapter<any>,
        private datePipe: DatePipe,
        private eventManagementCostCenterService: EventManagementCostCenterService,
        private eventManagementScopesService: EventManagementScopesService,
        private masterModulesUniversityService: MasterModulesUniversityService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private activatedRoute: ActivatedRoute) {

        this.filterListOfEventForm = this.formBuilder.group({
            name: ['', Validators.nullValidator],
            scope: ['', Validators.nullValidator],
            freeSearch: ['', Validators.nullValidator],
            costCenter: ['', Validators.nullValidator],
            startDate: ['', Validators.nullValidator],
            endDate: ['', Validators.nullValidator],
            type: ['', Validators.nullValidator],
            area: ['', Validators.nullValidator],
        });
        this.listOfEventFilterData = data.data;
        this.scopeId = data.scopeId;
        this.commonService.mapObjectToFormGroup(this.filterListOfEventForm, this.listOfEventFilterData);
    }

    async ngOnInit() {
        this.eventManagementCostCenterService.getCostCenterList({}).then((data: any) => {
            this.costCenter = data.data;

        });

        this.eventManagementScopesService.getScopesList({}).then((data: any) => {
            this.scopes = data.data;
        });

        this.getEventAreaList()
    }

    streamOpened() {
        if (localStorage.getItem('currentLanguage') == 'it') {
            this._adapter.setLocale('it-IT');
        } else {
            this._adapter.setLocale('eg-EG');
        }
    }

    onClick(result: boolean) {
        this.listOfEventFilterData = this.commonService.mapFormGroupToObject(this.filterListOfEventForm, this.listOfEventFilterData);
        this.listOfEventFilterData.startDate = this.datePipe.transform(this.listOfEventFilterData.startDate, 'yyyy-MM-dd')
        this.listOfEventFilterData.endDate = this.datePipe.transform(this.listOfEventFilterData.endDate, 'yyyy-MM-dd')
        this.dialogRef.close(result && this.listOfEventFilterData);
    }

    onSelectChangeUpdateText(args: MatSelectChange, fieldName: string) {
        this.listOfEventFilterData[fieldName] = args.source.triggerValue;
    }

    startDateFn(e) {
        this.listOfEventFilterData['startDateFt'] = this.datePipe.transform(e.value, 'dd-MM-yyyy')

    }

    endDateFn(e) {

        this.listOfEventFilterData['endDateFt'] = this.datePipe.transform(e.value, 'dd-MM-yyyy')
    }


    async getEventAreaList(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        this.eventAreaApi.getEventAreaList('').subscribe((res: any) => {
            if (res.statusCode === 200) {
                this.areaList = res.data;
                this.helper.toggleLoaderVisibility(false);
            } else {
                this.helper.toggleLoaderVisibility(false);
                // const e = err.error;
                swal.fire(
                    '',
                    // err.error.message,
                    this.translate.instant(res.error),
                    'info'
                );
            }
            this.helper.toggleLoaderVisibility(false);
        });
    }

}
