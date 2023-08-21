import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PeopleManagementService} from '../../../../../../fe-common-v2/src/lib/services/people-management.service';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-job-title',
  templateUrl: './add-edit-job-title.component.html',
  styleUrls: ['./add-edit-job-title.component.scss']
})
export class AddEditJobTitleComponent implements OnInit {
  jobTitleForm: FormGroup;
  public files: any;
  documentData: any;
  document: any;
  documentName: any;
  editMode = 'Add';
  button = 'Save';
  token: any;
  companyId: any;

  constructor(private fb: FormBuilder,
              private router: Router,
              public route: ActivatedRoute,
              private ApiServices: PeopleManagementService,
              private helper: MCPHelperService,
              public translate: TranslateService) {

    // get name from route
    const jobTitleName = this.route.snapshot.paramMap.get('jobTitleName');

    this.jobTitleForm = this.fb.group({
      jobTitleNameEnglish: ['', [Validators.required,MCPHelperService.nameValidator]],
      // jobTitleNameItalian: ['', [Validators.required]],
    });
    if (jobTitleName !== '0') {
      this.editMode = 'Edit';
      this.button = 'Update';
      this.helper.toggleLoaderVisibility(true);
      const documentData = jobTitleName;
      this.jobTitleForm.patchValue({
        jobTitleNameEnglish: documentData,
      });
      this.helper.toggleLoaderVisibility(false);
      this.documentName = 'you have to select document again';
    }
  }

  ngOnInit(): void {
  }

  changeRole() {
  }

  async addJob(): Promise<void> {
    if (this.jobTitleForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.jobTitleForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const res: any = await this.ApiServices.addJob(this.jobTitleForm.value.jobTitleNameEnglish);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/people-management']);
        swal.fire('',
          this.translate.instant('Swal_Message.Job title added successfully'),
          'success');
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

  async editJob(): Promise<void> {
    if (this.jobTitleForm.valid) {
      const jobTitleName = this.route.snapshot.paramMap.get('jobTitleName');
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.jobTitleForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const jobTitle = this.jobTitleForm.value.jobTitleNameEnglish;
      const res: any = await this.ApiServices.editJob(jobTitleName, jobTitle);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/people-management']);
        swal.fire('',
          this.translate.instant('Swal_Message.Job title edited successfully')
          , 'success');
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
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
