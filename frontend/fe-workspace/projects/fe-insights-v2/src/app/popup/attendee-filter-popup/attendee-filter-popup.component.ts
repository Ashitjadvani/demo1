import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AdminUserManagementService} from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import {AdminSiteManagementService} from 'projects/fe-common/src/lib/services/admin-site-management.service';
import {CommonService} from "../../../../../fe-common-v2/src/lib/services/common.service";
import {MatSelectChange} from "@angular/material/select";

export class SearchInternalPeopleFilterData {
    scope: any;
    typology: any;
    area: any;
    role: any;
    jobTitle: any;
    site: any;
    scopeName: any;
    typologyName: any;
    areaName: any;
    roleName: any;
    jobTitleName: any;
    siteName: any;

    constructor() {
        this.scope = null;
        this.typology = null;
        this.area = null;
        this.role = null;
        this.jobTitle = null;
        this.site = null;
        this.scopeName = null;
        this.typologyName = null;
        this.areaName = null;
        this.roleName = null;
        this.jobTitleName = null;
        this.siteName = null;
    }

    static getFieldText(fieldName: string, searchInternalPeopleFilterData: SearchInternalPeopleFilterData) {
        if (fieldName == 'scope')
            return searchInternalPeopleFilterData.scopeName;
        else if (fieldName == 'typology')
            return searchInternalPeopleFilterData.typologyName;
        else if (fieldName == 'area')
            return searchInternalPeopleFilterData.areaName;
        else if (fieldName == 'role')
            return searchInternalPeopleFilterData.roleName;
        else if (fieldName == 'jobTitle')
            return searchInternalPeopleFilterData.jobTitleName;
        else if (fieldName == 'site')
            return searchInternalPeopleFilterData.siteName;

        return searchInternalPeopleFilterData[fieldName];
    }
}
@Component({
    selector: 'app-attendee-filter-popup',
    templateUrl: './attendee-filter-popup.component.html',
    styleUrls: ['./attendee-filter-popup.component.scss']
})

export class AttendeeFilterPopupComponent implements OnInit {
    company: any;
    listData: any;
    areaList: any;
    scopeList: any;
    roleList: any;
    jobTitleList: any;
    siteList: any;
    filterForm: FormGroup;
    searchInternalPeopleFilterData: SearchInternalPeopleFilterData;


    constructor(
        public dialogRef: MatDialogRef<AttendeeFilterPopupComponent>,
        private formBuilder: FormBuilder,
        private adminUserManagementService: AdminUserManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private commonService: CommonService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.filterForm = this.formBuilder.group({
            scope: ['', Validators.nullValidator],
            typology: ['', Validators.nullValidator],
            area: ['', Validators.nullValidator],
            role: ['', Validators.nullValidator],
            jobTitle: ['', Validators.nullValidator],
            site: ['', Validators.nullValidator],
        });
        this.searchInternalPeopleFilterData = data.data;
        this.commonService.mapObjectToFormGroup(this.filterForm, this.searchInternalPeopleFilterData);
    }

    typologyList = [
        {value: "Personale Diretto", viewValue: "Personale Diretto"},
        {value: "Personale Indiretto", viewValue: "Personale Indiretto"},
        {value: "Professionisti", viewValue: "Professionisti"}
    ]

    ngOnInit(): void {
        this.loadCompany();
    }

    async loadCompany(): Promise<void> {
        this.company = JSON.parse(localStorage.getItem('credentials'));
        let res = await this.adminUserManagementService.getCompany(this.company.person.companyId);
        this.listData = res.company;
        this.areaList = this.listData.areas;
        this.scopeList = this.listData.scopes;
        this.jobTitleList = this.listData.peopleJobTitles;
        this.roleList = this.listData.peopleRoles;
        this.adminSiteManagementService.getSites(this.company.person.companyId).then((response) => {
            let responseValue: any = JSON.parse(JSON.stringify(response))
            this.siteList = responseValue.data;
        });
    }

    onClick(result: boolean) {
        if (result){
            this.searchInternalPeopleFilterData = this.commonService.mapFormGroupToObject(this.filterForm, this.searchInternalPeopleFilterData);
            this.dialogRef.close(result && this.searchInternalPeopleFilterData);
        }else {
            this.dialogRef.close();
        }
        /*this.searchInternalPeopleFilterData = this.commonService.mapFormGroupToObject(this.filterForm, this.searchInternalPeopleFilterData);
        this.dialogRef.close(result && this.searchInternalPeopleFilterData);*/
    }

    onSelectChangeUpdateText(args: MatSelectChange, fieldName: any) {
        this.searchInternalPeopleFilterData[fieldName] = args.source.triggerValue;
    }

}
