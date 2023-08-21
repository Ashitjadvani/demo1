import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CMSManagementService } from 'projects/fe-common-v2/src/lib/services/cms-list.service';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-recruiting',
  templateUrl: './add-edit-recruiting.component.html',
  styleUrls: ['./add-edit-recruiting.component.scss']
})
export class AddEditRecruitingComponent implements OnInit {
  addContentForm:FormGroup;
  addCandidatePeriodForm:FormGroup;
  addDefaultImageForm:FormGroup;

  defaultImageInfo: any = null;
  imageUrl: any;

  documentInput: any;
  documentName: any;
  fileToUpload: any;
  fileCoverImage: any;

  activePeriodList = new Array(24)
  dataSource: any;
  privacyDataObj: any;

  constructor(private _formBuilder: FormBuilder,
    private cmsManagementService:CMSManagementService,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private router: Router) {
    this.addContentForm = this._formBuilder.group({
      recruiting_titleEN: ['',Validators.required],
      recruiting_subtitleEN: ['',Validators.required],
      descriptionEN: ['',Validators.required],
      recruiting_titleIT: ['',Validators.required],
      recruiting_subtitleIT: ['',Validators.required],
      descriptionIT: ['',Validators.required],
      type:['recruiting'],
      id:['']
    });

    this.addDefaultImageForm = this._formBuilder.group({
      logoID: ['']
    });

    this.addCandidatePeriodForm = this._formBuilder.group({
      candidateActivePeriod: ['']
    });
  }

  ngOnInit(): void {
    this.getCmsListData();
    this.getRecruitingContentCMS();
    for (var i = 0; i < 24; i++) {
      this.activePeriodList[i] = i + 1;
    }
  }

  getRecruitingContentCMS() {
    let typeName = 'recruiting';
    this.helper.toggleLoaderVisibility(true);
    this.helper.getCMSDetails({type : typeName}).subscribe((data:any) =>{
      this.privacyDataObj = data.data;
      this.addContentForm.patchValue({
        id:this.privacyDataObj.id,
        type: 'recruiting',
        recruiting_titleEN: this.privacyDataObj.recruiting_titleEN,
        recruiting_subtitleEN: this.privacyDataObj.recruiting_subtitleEN,
        descriptionEN: this.privacyDataObj.descriptionEN,
        recruiting_titleIT: this.privacyDataObj.recruiting_titleIT,
        recruiting_subtitleIT: this.privacyDataObj.recruiting_subtitleIT,
        descriptionIT: this.privacyDataObj.descriptionIT,
      });
    });
    this.helper.toggleLoaderVisibility(false);
   }

  async getCmsListData(): Promise<void> {
    const cmsListData: any = await this.cmsManagementService.getCMSList();
    this.dataSource = cmsListData.data;
    const resImage: any = await this.cmsManagementService.getDefaultImage({type: 'job_default'});
    this.documentName = resImage.data;
    if (this.documentName) {
      this.cmsManagementService.getImage({id : this.documentName.fileId}).then( (image: any) => {
          this.imageUrl = image.data;
      });
    }
  }

  async addRecruitingContent(): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.cmsManagementService.saveCMSList(this.addContentForm.value)
      if(this.addContentForm.valid){
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate([`cms`]);
        swal.fire(
          '',
          this.translate.instant('Swal_Message.cms_save_successfully'),
          'success'

        );
      }else{
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant( res.error.message),
          'info'
          );
      }
  }

  async saveJobDefaultImage(): Promise<void> {
    const formData: FormData = new FormData();
    if (this.fileToUpload) {
      formData.append('file', this.fileToUpload);
      const res: any = await this.cmsManagementService.saveImage(formData);
      const reqData = {fileId: res.fileId, type: 'job_default'};
      await this.cmsManagementService.saveDefaultImage(reqData);
      this.router.navigate([`cms`]);
      swal.fire(
        '',
        this.translate.instant('Swal_Message.DEFAULT IMAGE UPLOADED SUCCESSFULLY'),
        'success'
      );
    } if (this.fileToUpload === null){
      swal.fire(
        '',
        this.translate.instant('Swal_Message.PLEASE SELECT A IMAGE'),
        'info'
      );
    }
    else{
      this.fileToUpload = null;
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

    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
  }

  resetCoverValue(): void {
    this.documentInput = null;
    this.documentName = null;
    this.imageUrl = null
    this.addDefaultImageForm.patchValue({
      logoID: null
    });
  }
  public space(event:any){
    if(event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

}
