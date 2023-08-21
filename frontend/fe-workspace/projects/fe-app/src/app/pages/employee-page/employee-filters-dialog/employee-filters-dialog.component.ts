import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { DailyPlanTimeFrameItem } from 'projects/fe-common/src/lib/services/calendar-management.service';
import { Company, CompanyJustification, EVENT_TYPE } from 'projects/fe-common/src/lib/models/company';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { Person } from 'projects/fe-common/src/lib/models/person';

export class EmployeeFiltersDialogData {
    dataSelected: boolean;
    justificativeSelected: boolean;
    userSelected: boolean;
    dataStart: Date;
    dataEnd: Date;
    justificative: string;
    user: Person;

    constructor() {
        this.dataSelected = false;
        this.justificativeSelected = false;
        this.userSelected = false;
        this.dataStart = new Date();
        this.dataEnd = new Date();
        this.justificative = "";
        this.user = null;
    }
}

@Component({
    selector: 'app-employee-filters-dialog',
    templateUrl: './employee-filters-dialog.component.html',
    styleUrls: ['./employee-filters-dialog.component.scss']
})

export class EmployeeFiltersDialogComponent implements OnInit {
    employeeFiltersDialogData: EmployeeFiltersDialogData;
    dateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    currentCompany: Company;
    currentAccount: Person;
    people: Person[];
    sortedJustificatives: CompanyJustification[];
    sortedPeople: Person[];

    constructor(private _common: CommonService,
        public translate: TranslateService,
        public dialogRef: MatDialogRef<EmployeeFiltersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any) {

        this.currentCompany = data.company;
        this.people = data.people;

        this.sortJustificatives();
        this.sortPeople();

        this.employeeFiltersDialogData = new EmployeeFiltersDialogData();

        this.employeeFiltersDialogData.dataSelected = data.filterData.dataSelected;
        this.employeeFiltersDialogData.justificativeSelected = data.filterData.justificativeSelected;
        this.employeeFiltersDialogData.userSelected = data.filterData.userSelected;
        this.employeeFiltersDialogData.dataStart = data.filterData.dataStart;
        this.employeeFiltersDialogData.dataEnd = data.filterData.dataEnd;
        this.employeeFiltersDialogData.justificative = data.filterData.justificative;
        this.employeeFiltersDialogData.user = data.filterData.user;

        this.dateRange = new FormGroup({
            start: new FormControl(data.filterData.dataStart),
            end: new FormControl(data.filterData.dataEnd),
        });

    }

    ngOnInit() {

    }

    onCancelClick() {
        this.dialogRef.close(null);
    }

    sortJustificatives() {
        this.sortedJustificatives = this.currentCompany.peopleJustificationTypes.sort(function(a, b){    
            return ('' + a.name).localeCompare(b.name);
        });
    }

    sortPeople() {
        this.sortedPeople = this.people.sort(function(a, b){    
            return ('' + a.name).localeCompare(b.name);
        });
    }

    onCommitEvent() {
        this.employeeFiltersDialogData.dataStart = this.dateRange.get('start').value;
        this.employeeFiltersDialogData.dataEnd = this.dateRange.get('end').value;
        this.dialogRef.close(this.employeeFiltersDialogData);
    }

    onConfirmClick() {
        this.onCommitEvent();
    }

    isConfirmEnabled() {
        if(this.employeeFiltersDialogData.justificativeSelected && this.employeeFiltersDialogData.userSelected) {
            if(this.employeeFiltersDialogData.user && this.employeeFiltersDialogData.justificative!="") return true;
            else return false;
        }
        else if(this.employeeFiltersDialogData.justificativeSelected) {
            if(this.employeeFiltersDialogData.justificative!="") return true;
            else return false;
        }
        else if(this.employeeFiltersDialogData.userSelected) {
            if(this.employeeFiltersDialogData.user) return true;
            else return false;
        }
        else return true;
    }
}
