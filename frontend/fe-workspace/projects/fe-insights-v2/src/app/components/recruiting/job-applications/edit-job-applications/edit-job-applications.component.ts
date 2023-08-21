import { Component, OnInit } from '@angular/core';
import swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { MCPHelperService } from '../../../../service/MCPHelper.service';
import { RecrutingJobApplicationManagementService } from '../../../../../../../fe-common-v2/src/lib/services/recruting-job-application-management.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { RecruitingCandidateManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-candidate-management.service';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-edit-job-applications',
    templateUrl: './edit-job-applications.component.html',
    styleUrls: ['./edit-job-applications.component.scss']
})
export class EditJobApplicationsComponent implements OnInit {
    public frmChangeStatus: FormGroup;
    id: any;
    JobapplicationsDetails: any = [];
    applicationStatus: any = [];
    opening: any = [];
    userInfo: any = [];
    laurea: any = [];
    univ: any = [];
    videoAssessment: any = [];
    applicationStatusNotes: any = [];
    current_element: any = {};
    noRecordFound = false;
    documentData: any;
    document: any;
    // notes = null;
    resumeId: any;
    fileName: '';
    url: string = '';
    momentTime: string;
    jobOpeningType: any;
    statusApplication: any;

    constructor(private fb: FormBuilder,
        private router: Router,
        private activitedRoute: ActivatedRoute,
        private helper: MCPHelperService,
        private ApiServices: RecrutingJobApplicationManagementService,
        private documentDownload: RecruitingCandidateManagementService,
        public translate: TranslateService) {

        const id = this.activitedRoute.snapshot.paramMap.get('id');

        this.frmChangeStatus = this.fb.group({
            id: [null],
            application_id: [id],
            from_state_id: ['', Validators.required],
            notes: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]]
        });
    }

    public bussines_data: any[] = [];
    displayedColumns: string[] = ['DateTime', 'appStatus', 'appNote', 'appBy'];
    dataSource = this.bussines_data;
    resultsLength = 0;

    ngOnInit(): void {
        this.getJobDetails();
    }
    async getJobDetails(): Promise<void> {
        this.id = this.activitedRoute.snapshot.paramMap.get('id');
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiServices.viewApplication({ id: this.id });
        const result: any = await this.ApiServices.getApplicationHistory({ application_id: this.id });
        const status: any = await this.ApiServices.getApplicationHistoryStatus({ application_id: this.id });
        if (res.statusCode === 200) {
            this.statusApplication = res.data.status_id;
            this.helper.toggleLoaderVisibility(false);
            this.JobapplicationsDetails = res.data;
            this.opening = res.data.opening;
            this.userInfo = res.data.userInfo;
            this.jobOpeningType = res.data.jobOpeningType;
            this.univ = res.data.univ;
            this.laurea = res.data.laurea;
            this.videoAssessment = res.data.opening.videoAssessment;
            this.applicationStatus = result.data;
            this.applicationStatusNotes = status.data;
            this.noRecordFound = this.applicationStatus.length > 0;

            this.frmChangeStatus.patchValue({
                id: this.applicationStatus[this.applicationStatus.length - 1].id,
                application_id: this.applicationStatus[this.applicationStatus.length - 1].application_id,
                from_state_id: this.statusApplication = 7 ? this.statusApplication : this.applicationStatus[this.applicationStatus.length - 1].from_state_id,
                // from_state_id:  this.userInfo.status.id,
                notes: null
            });
            console.log('this.frmChangeStatus>>>>', this.frmChangeStatus.value.from_state_id);
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            // const e = err.error;
            swal.fire(
                '',
                // err.error.message,
                this.translate.instant(res.reason),
                'info'
            );
        }
    }

    isStatusEnabled(status: any): boolean {
        const matrix = this.historyStatus(this.statusApplication);
        if (matrix) {
            return matrix.indexOf(status.id) > -1;
        }
        return false;
    }

    historyStatus(status): any {
        let matrix = [];
        switch (status) {
            case '1':
                matrix = [];
                break;
            case '2':
                matrix = ['2', '3', '8'];
                break;
            case '3':
                matrix = ['3', '4'];
                break;
            case '4':
                matrix = ['5', '6', '7', '8'];
                break;
            case '5':
                matrix = ['6', '7', '8'];
                break;
            case '6':
                matrix = ['7'];
                break;
            case '7':
                matrix = ['7'];
                break;
            case '8':
                matrix = ['8'];
                break;
        }
        return matrix;
    }

    downloadCv(): void {
        this.id = this.activitedRoute.snapshot.paramMap.get('id');
        this.helper.toggleLoaderVisibility(true);
        this.documentDownload.downloadDocument(this.userInfo.resumeId).subscribe((res: any) => {

            const blob = new Blob([res], { type: 'application/pdf' });
            this.url = window.URL.createObjectURL(blob);
            this.resumeId = this.userInfo.resumeId;
            this.fileName = this.userInfo.nome;
            FileSaver.saveAs(blob, this.userInfo.nome + '-cv-' + this.momentTime + '.pdf');
            this.helper.toggleLoaderVisibility(false);
        }, error => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant('TABLE.No_record_found'),
                'info'
            );
        });
    }


    async editStatus(formData: any, formDirective: FormGroupDirective): Promise<void> {
        if (this.frmChangeStatus.valid) {
            this.helper.toggleLoaderVisibility(true);
            this.documentData = new FormData();
            const getInputsValues = this.frmChangeStatus.value;
            for (const key in getInputsValues) {
                this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
            }
            this.documentData.append('document', this.document);
            const application_id = this.frmChangeStatus.value.application_id;
            const from_state_id = this.frmChangeStatus.value.from_state_id;
            const notes = this.frmChangeStatus.value.notes;
            const res: any = await this.ApiServices.editStatusNotes({ id: null, application_id: application_id, from_state_id: from_state_id, notes: notes });
            if (res.result) {
                this.helper.toggleLoaderVisibility(false);
                this.getJobDetails();
                swal.fire('',
                    this.translate.instant('Swal_Message.Job Application edited successfully'),
                    'success');
                this.getJobDetails();
                formDirective.resetForm();
                this.frmChangeStatus.reset();
            } else {
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant(res.reason),
                    'info'
                );
            }
        }
    }
}
