import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CMSManagementService } from 'projects/fe-common/src/lib/services/cms-list.service';
import { MatTableDataSource } from '@angular/material/table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpResponse} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface PeriodicElement {
  name: string;
  tabIndex: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Privacy Policy', tabIndex : 1},
  {name: 'Terms and condition', tabIndex : 2}
];

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {

  constructor(
    private cmsManagementService: CMSManagementService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) { }
  displayedColumns: string[] = ['name', 'action', ];
  // dataSource = ELEMENT_DATA;
  dataSource: any =  new MatTableDataSource([]);
  public Editor = ClassicEditor;
  public showPrivacyDetail = false;
  public showTermsDetail = false;
  public frmDetail: FormGroup;
  loadData: any = true;
  candidateActivePeriod: any = [
    {name: '1 Month'},
    {name: '2 Months'},
    {name: '3 Months'},
    {name: '4 Months'},
    {name: '5 Months'},
    {name: '6 Months'},
    {name: '7 Months'},
    {name: '8 Months'},
    {name: '9 Months'},
    {name: '10 Months'},
    {name: '11 Months'},
    {name: '12 Months'},
    {name: '13 Months'},
    {name: '14 Months'},
    {name: '15 Months'},
    {name: '16 Months'},
    {name: '17 Months'},
    {name: '18 Months'},
    {name: '19 Months'},
    {name: '20 Months'},
    {name: '21 Months'},
    {name: '22 Months'},
    {name: '23 Months'},
    {name: '24 Months'},
  ];

  @ViewChild(MatTabGroup, {static: false}) tabgroup: MatTabGroup;

  cmsObject: any = {};
  cmsTitle: any = 'RECRUITINGTXT.TERMANDCONDITION';
  fileToUpload: any;
  imageUrl: any;
  defaultImage: any = null;
  defaultImageInfo: any = null;

  insertHTML(html: string) {

    // See: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/faq.html#where-are-the-editorinserthtml-and-editorinserttext-methods-how-to-insert-some-content
    const viewFragment = this.Editor.data.processor.toView( html );
    const modelFragment = this.Editor.data.toModel( viewFragment );
    this.Editor.model.insertContent(modelFragment);
  }

  ngOnInit(): void {
    this.frmDetail = this.fb.group({
      id: [null],
      descriptionEN: [null],
      descriptionIT: [null]
    });
    this.getCmsListData();
  }

  onClickCMS(data: any) {
    this.cmsObject = data;
    if (this.cmsObject.type === 'privacy_policy') {
      this.cmsTitle = 'RECRUITINGTXT.PRIVACYPOLICY';
    } else {
      this.cmsTitle = 'RECRUITINGTXT.TERMANDCONDITION';
    }
    this.frmDetail.patchValue({
      id: this.cmsObject.id,
      descriptionEN: this.cmsObject.descriptionEN,
      descriptionIT: this.cmsObject.descriptionIT
    });
    this.tabgroup.selectedIndex = 1;
    this.showPrivacyDetail = true;
  }

  async getCmsListData(): Promise<void> {
    const cmsListData: any = await this.cmsManagementService.getCMSList();
    this.dataSource = cmsListData.data;
    const resImage: any = await this.cmsManagementService.getDefaultImage({type: 'job_default'});
    this.defaultImageInfo = resImage.data;
    if (this.defaultImageInfo) {
      this.cmsManagementService.getImage({id : this.defaultImageInfo.fileId}).then( (image: any) => {
          this.imageUrl = image.data;
      });
    }
  }

  async onPrivacySubmit(): Promise<void> {
    const res: any = await this.cmsManagementService.saveCMSList(this.frmDetail.value);
    if (res.result){
      this.tabgroup.selectedIndex = 0;
      this.snackBar.open(this.translate.instant(res.reason), this.translate.instant('GENERAL.OK'), { duration: 3000 });
      this.showPrivacyDetail = false;
    }
    await this.getCmsListData();
  }



  onCancelClick(): void{
    this.tabgroup.selectedIndex = 0;
    this.showPrivacyDetail = false;
    this.showTermsDetail = false;
  }

  onTabChanged($event): void {
    const clickedIndex = $event.index;
    if (clickedIndex === 0) {
      this.showPrivacyDetail = false;
      this.showTermsDetail = false;
    }
  }

  handleFileInput(file: FileList): void {
    this.fileToUpload = file.item(0);
    // Show image preview
    const allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
    if (allowedExtension.includes(this.fileToUpload.type)) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
    } else {
      this.fileToUpload = null;
      this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.PLEASE UPLOAD VALID IMAGE'), this.translate.instant('GENERAL.OK'), {duration: 3000});
    }
  }

  async saveJobDefaultImage(): Promise<void> {
    const formData: FormData = new FormData();
    if (this.fileToUpload) {
      formData.append('file', this.fileToUpload);
      const res: any = await this.cmsManagementService.saveImage(formData);
      const reqData = {fileId: res.fileId, type: 'job_default'};
      await this.cmsManagementService.saveDefaultImage(reqData);
      this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.DEFAULT IMAGE UPLOADED SUCCESSFULLY'), this.translate.instant('GENERAL.OK'), {duration: 3000});
    } else {
      this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.PLEASE SELECT A IMAGE'), this.translate.instant('GENERAL.OK'), {duration: 3000});
    }
  }
}
