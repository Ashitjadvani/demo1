import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { MasterModulesUniversityService } from 'projects/fe-common-v2/src/lib/services/master-modules-university.service';
import { RecruitingApplicationManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-application-management.service';
import { RecruitingManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-management.service';

export class JobApplicationFilterData {
    freeSearch: string;
    jobOpening: string;
    jobArea: string;
    jobType: string;
    surname: string;
    name: string;
    gender: string;
    minAge: number;
    maxAge: number;
    university: string;
    degreeYear: number;
    minDegree: number;
    maxDegree: number;
    eduLevel: string;
    completionDate: string;
    fitIndex: string;
    status: string;
    showUnread: boolean;

    jobAreaText: string;
    jobTypeText: string;
    statusText: string;

    constructor() {
        this.freeSearch = null;
        this.jobOpening = null;
        this.jobArea = null;
        this.jobType = null;
        this.surname = null;
        this.name = null;
        this.gender = null;
        this.minAge = null;
        this.maxAge = null;
        this.university = null;
        this.degreeYear = null;
        this.minDegree = null;
        this.maxDegree = null;
        this.eduLevel = null;
        this.completionDate = null;
        this.fitIndex = null;
        this.status = null;
        this.showUnread = false;

        this.jobAreaText = '';
        this.jobTypeText = '';
        this.statusText = '';
    }

    static getFieldText(fieldName: string, jobApplicationFilterData: JobApplicationFilterData) {
        if (fieldName == 'jobArea')
            return jobApplicationFilterData.jobAreaText;
        else if (fieldName == 'jobType')
            return jobApplicationFilterData.jobTypeText;
        else if (fieldName == 'status')
            return jobApplicationFilterData.statusText;

        return jobApplicationFilterData[fieldName];
    }
}

@Component({
    selector: 'app-filter-job-applications-popup',
    templateUrl: './filter-job-applications-popup.component.html',
    styleUrls: ['./filter-job-applications-popup.component.scss']
})
export class FilterJobApplicationsPopupComponent implements OnInit {
    jobTypeFilter: any = [
        { id: 'Open Positions', value: this.translate.instant('EXTRA_WORD.Open_Positions') },
        { id: 'Spontaneous Applications', value: this.translate.instant('EXTRA_WORD.Spontaneous_Applications') }
    ];

    genderData: any = [
        { id: 'Male', value: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Male') },
        { id: 'Female', value: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Female') },
        { id: 'Other', value: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Other') },
        { id: 'Not Specified', value: this.translate.instant('INSIGHTS_PEOPLE_PAGE.NotSpecified') }
    ];

    completionDate = [
        { id: '1-week', name: this.translate.instant('JOB_APPLICATION_FILTER_POPUP.ONE_WEEK') },
        { id: '2-weeks', name: this.translate.instant('JOB_APPLICATION_FILTER_POPUP.TWO_WEEK') },
        { id: '1-month', name: this.translate.instant('JOB_APPLICATION_FILTER_POPUP.ONE_MONTH') },
        { id: '2-months', name: this.translate.instant('JOB_APPLICATION_FILTER_POPUP.TWO_MONTH') },
    ];
    levelEducation = [
        { id: 'not-graduated', name: this.translate.instant('JOB_APPLICATION_FILTER_POPUP.NOT_GRADUATED') },
        { id: 'graduated', name: this.translate.instant('JOB_APPLICATION_FILTER_POPUP.GRADUATED') },
        // {id: 'master', name: 'Master'},
        // {id: 'doctorate', name: 'Doctorate'},
    ];
    universityListData: any[] = [];
    applicationStatusTableData: any[] = [];
    areas: any[] = [];

    filterJobApplicationForm: FormGroup;
    jobApplicationFilterData: JobApplicationFilterData;

    constructor(public dialogRef: MatDialogRef<FilterJobApplicationsPopupComponent>,
        private formBuilder: FormBuilder,
        private commonService: CommonService,
        private translate: TranslateService,
        private recruitingManagementService: RecruitingManagementService,
        private recruitingManagementApplicationService: RecruitingApplicationManagementService,
        private masterModulesUniversityService: MasterModulesUniversityService,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.filterJobApplicationForm = this.formBuilder.group({
            jobOpening: ['', Validators.nullValidator],
            jobArea: ['', Validators.nullValidator],
            jobType: ['', Validators.nullValidator],
            surname: ['', Validators.nullValidator],
            name: ['', Validators.nullValidator],
            gender: ['', Validators.nullValidator],
            minAge: ['', Validators.nullValidator],
            maxAge: ['', Validators.nullValidator],
            university: ['', Validators.nullValidator],
            degreeYear: ['', Validators.nullValidator],
            minDegree: ['', Validators.nullValidator],
            maxDegree: ['', Validators.nullValidator],
            eduLevel: ['', Validators.nullValidator],
            completionDate: ['', Validators.nullValidator],
            fitIndex: ['', Validators.nullValidator],
            status: ['', Validators.nullValidator],
            showUnread: [false, Validators.nullValidator]
        });
        this.jobApplicationFilterData = data;
        this.commonService.mapObjectToFormGroup(this.filterJobApplicationForm, this.jobApplicationFilterData);
    }

    async ngOnInit() {
        this.recruitingManagementApplicationService.getCandidateUniversities().then((data: any) => {
            this.universityListData = data.data;
        });

        this.recruitingManagementApplicationService.getCandidateAreas().then((data: any) => {
            this.areas = data.data;
        });

        this.recruitingManagementApplicationService.getApplicationStatusList().then((data: any) => {
            this.applicationStatusTableData = data.data.filter((b) => b.id !== '1');
        });
    }

    onClick(result: boolean) {
        this.jobApplicationFilterData = this.commonService.mapFormGroupToObject(this.filterJobApplicationForm, this.jobApplicationFilterData);
        this.dialogRef.close(result && this.jobApplicationFilterData);
       console.log("result && this.jobApplicationFilterData",result && this.jobApplicationFilterData)
    }

    onSelectChangeUpdateText(args: MatSelectChange, fieldName: string) {

        this.jobApplicationFilterData[fieldName] = args.source.triggerValue;
    }
}
