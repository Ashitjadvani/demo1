import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {UserManagementService} from '../../../../../../fe-common-v2/src/lib/services/user-management.service';
import {AdminUserManagementService} from '../../../../../../fe-common-v2/src/lib/services/admin-user-management.service';
import {CommonService} from '../../../../../../fe-common-v2/src/lib/services/common.service';
import {Company} from '../../../../../../fe-common-v2/src/lib/models/company';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import {DataStorageManagementService} from '../../../../../../fe-common-v2/src/lib/services/data-storage-management.service';
import { MCPHelperService } from '../../../service/MCPHelper.service';


@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styles: []
})
export class EditCompanyComponent implements OnInit {

  companyInformationForm: FormGroup;
  documentInput: any;
  documentName: any;
  // public ctrlColors = [
  //   {color: '#4B6BA2'}
  // ];
  primaryColor:any;

  currentCompany: Company = new Company;
  fileToUpload: any;
  fileCoverImage: any;
  resumeDetailsData: any;

  constructor(
    private formBuilder: FormBuilder,
    private userManagementService: UserManagementService,
    private adminUserManagementService: AdminUserManagementService,
    private dataStorageManagementService: DataStorageManagementService,
    private commonService: CommonService,
    public translate: TranslateService,
    private MCPservice: MCPHelperService
  ) {
    this.companyInformationForm = this.formBuilder.group({
      id: ['',[ Validators.required]],
      name: ['', [Validators.required,MCPHelperService.noWhitespaceValidator]],
      address: ['',[ Validators.required,MCPHelperService.noWhitespaceValidator]],
      city: ['', [Validators.required,MCPHelperService.noWhitespaceValidator]],
      cap: ['', [Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      vatNumber: ['', [Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      brandColor: [''],
      logoID: [''],
    });
    // this.changeTheme(this.primaryColor);
  }

  firstImageFunction(){
    this.MCPservice.onFirstComponentButtonClick();
  }

  async ngOnInit(): Promise<void> {
    this.firstImageFunction();
    const userAccount = this.userManagementService.getAccount();
    if (userAccount) {
      const res = await this.adminUserManagementService.getCompany(userAccount.companyId);
      if (this.commonService.isValidResponse(res)) {
        this.currentCompany = res?.company;
      }
      const getCompany = res?.company;
      this.primaryColor = res?.company?.brandColor;
      if (getCompany?.logoID) {
        const fileDetails = await this.dataStorageManagementService.getFileDetails(getCompany?.logoID);
        this.documentName = fileDetails?.data?.file ? fileDetails.data.file : null;
        this.primaryColor=getCompany.brandColor;
      }
      this.companyInformationForm.patchValue({
        id: getCompany.id,
        name: getCompany.name,
        address: getCompany.address,
        city: getCompany.city,
        cap: getCompany.cap,
        vatNumber: getCompany.vatNumber,
        logoID: getCompany?.logoID,
        brandColor: getCompany.brandColor
      });
    }
    this.changeTheme(this.primaryColor);
  }

  async onUpdate(): Promise<void> {
    if (this.companyInformationForm.valid) {
      this.uploadFile(this.fileToUpload).then(async (fileId) => {
        this.companyInformationForm.patchValue({
          logoID: (fileId) ? fileId : (this.companyInformationForm.value.logoID) ? this.companyInformationForm.value.logoID : null
        });
        const res = await this.adminUserManagementService.updateCompany(this.companyInformationForm.value);
        this.firstImageFunction();
        if (!this.commonService.isValidResponse(res)) {
          // TODO display error
        } else {
          this.currentCompany = res.company;
          swal.fire(
            '',
            this.translate.instant('INSIGHTS_PEOPLE_PAGE.Company data update'),
            'success'
          );
        }
      });
    }
  }

  onFileChanged(input: HTMLInputElement): void {
    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;
      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }
      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    // @ts-ignore
    const file = input.files[0];
    this.fileToUpload = input.files[0];
    this.documentInput = file;
    this.documentName = `${file.name} (${formatBytes(file.size)})`;
  }

  resetCoverValue(): void {
    this.documentInput = null;
    this.documentName = null;
    this.companyInformationForm.patchValue({
      logoID: null
    });
  }

  uploadFile(fileToUpload): any {
      console.log("fileToUpload:::-->>",fileToUpload)
    return new Promise((resolve, reject) => {
      if (fileToUpload) {
        this.dataStorageManagementService.uploadFile(fileToUpload).then((data: any) => {
          const fileId = data?.body?.fileId ? data.body.fileId : null;
          resolve(fileId);
        }, (error) => {
          resolve(null);
        });
      } else {
        resolve(null);
      }
    });
  }

  changeTheme(primaryColor:string){
    document.documentElement.style.setProperty("--primary-color",primaryColor)
  }

}
