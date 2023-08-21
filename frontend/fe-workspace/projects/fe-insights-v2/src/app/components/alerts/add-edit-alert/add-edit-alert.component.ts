import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AdminSiteManagementService} from "../../../../../../fe-common-v2/src/lib/services/admin-site-management.service";
import { Person } from 'projects/fe-common-v2/src/lib/models/person';
import swal from "sweetalert2";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from '@angular/forms';
import {AlertsManagementService} from '../../../../../../fe-common-v2/src/lib/services/alerts-management.service';
import { DatePipe } from '@angular/common';
import {NewsDocument} from "../../../../../../fe-common-v2/src/lib/models/admin/news-document";
import {HttpResponse} from "@angular/common/http";
import {MAT_MOMENT_DATE_FORMATS,MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const PICK_FORMATS = {
  parse: {
    parse: {dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'}},
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'D MMM YYYY',
  }
};
@Component({
  selector: 'app-add-edit-alert',
  templateUrl: './add-edit-alert.component.html',
  styleUrls: ['./add-edit-alert.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'it'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
  ],
})
export class AddEditAlertComponent implements OnInit {

  currentAlert: NewsDocument = NewsDocument.Empty();

  addAlertForm: FormGroup;
  userAccount: Person;
  documentInput: any;
  documentName: any;
  fileToUpload: any;
  sitelist: any;
  groupList: any;
  companyId: any;
  documentData: any;
  document: any;
  editDate: any;
  id: any;
  datePipe: DatePipe = new DatePipe('it-IT');
  date: any = new FormControl(new Date().toISOString());
  serializedDate = new FormControl(new Date().toISOString());
  title = 'Add';

  constructor(public _categoriesForm: FormBuilder,
              private sitelists: AdminSiteManagementService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              public route: ActivatedRoute,
              private ApiService: AlertsManagementService,
              private datepipe: DatePipe,
              private _adapter: DateAdapter<any>
  ) {


    // const id = this.route.snapshot.paramMap.get('id');
    // console.log('currentAlert', this.currentAlert);
    // if(id !== '0'){
    //   this.title = 'Edit';
    //   this.helper.toggleLoaderVisibility(true);
    //   this.ApiService.editAlerts({id:id}).subscribe((res: any) => {
    //     this.documentData = res.data;
    //     console.log('this.documentData',this.documentData);
    //     if(res.result === true){
    //       this.id =  this.documentData.id
    //       this.documentName = this.documentData.file
    //       this.addAlertForm.patchValue({
    //         id: this.documentData.id,
    //         publicationDate: this.documentData.publicationDate,
    //         name: this.documentData.name,
    //         file: this.documentData.file,
    //         title: this.documentData.title,
    //         description: this.documentData.description,
    //         createdAt: this.documentData.createdAt,
    //         userView: this.documentData.userView,
    //         userConfirmed: this.documentData.userConfirmed,
    //         distributionSites: this.documentData.distributionSites,
    //         distributionGroups: this.documentData.distributionGroups,
    //       });
    //       this.helper.toggleLoaderVisibility(false);
    //     }
    //     this.helper.toggleLoaderVisibility(false);
    //   });
    // }


    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }

    this.addAlertForm = this._categoriesForm.group({
      publicationDate: [ '', [Validators.required]],
      name: [''],
      file: [''],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      createdAt: [this.date ? this.date.value : ''],
      userView: [0],
      userConfirmed: [0],
      distributionSites: [null, [Validators.required]],
      distributionGroups: [null, [Validators.required]],
      // this.date.transform(new Date(fieldValue), 'dd/MM/yyyy')
      // titleItalian : [null,[Validators.required]],
      // contentEnglish: [null,[Validators.required]],
      // contentItalian: [null,[Validators.required]],
      // site: [null,[Validators.required]],
      // safetyGroup: [null,[Validators.required]],
      // enableEvent : [null,[Validators.required]]
      // sendPushNotification:[]
    });
   }

   onFileChanged(input: HTMLInputElement): void {
    // this.attachmentFile = this.file.nativeElement.files[0];

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
    this.addAlertForm.controls['file'].setValue(null);
  }


  ngOnInit(): void {
    this.loadCompany();
    const id = this.route.snapshot.paramMap.get('id');
    this.getDetails(id)

  }
  async  changeCategory(){
    if (this.addAlertForm.valid) {
      const id = this.route.snapshot.paramMap.get('id');
      if(id === '0' || id === null || id === undefined) {
        this.helper.toggleLoaderVisibility(true);
        this.documentData = new FormData();
        /*    const time = this.datepipe.transform(this.addAlertForm.value.publicationDate, 'YYYY-MM-DDTHH:mm:ss');
            const times = time.toString();
            this.addAlertForm.value.publicationDate = times;
            this.addAlertForm.value.createdAt = times;*/
        this.currentAlert = this.addAlertForm.value;
        const res: any = await this.ApiService.addAlerts(this.documentInput,this.addAlertForm.value);
        if (res) {
          this.helper.toggleLoaderVisibility(false);
          this.router.navigate(['/alerts']);
          swal.fire('',
            this.translate.instant('Swal_Message.Alert added successfully'),
            'success');
        } else {
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant(res.reason),
            'info'
          );
        }
      }else {
          this.helper.toggleLoaderVisibility(true);
          this.documentData = new FormData();
          const form = this.addAlertForm.value;
          console.log("form........",form)
          let New = {
            id: this.id,
            publicationDate: form.publicationDate,
            name: form.name,
            file: form.file,
            title: form.title,
            description: form.description,
            createdAt: form.createdAt,
            userView: form.userView,
            userConfirmed: form.userConfirmed,
            distributionSites: form.distributionSites,
            distributionGroups: form.distributionGroups
          };
          const res: any = await this.ApiService.addAlerts(this.documentInput,New);
          if (res) {
            this.helper.toggleLoaderVisibility(false);
            this.router.navigate(['/alerts']);
            swal.fire('',
              this.translate.instant('Swal_Message.Alert edited successfully'),
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
  }

  async loadCompany() {
    const res = await this.sitelists.getFullSites(this.companyId);
    const scp: any = await this.sitelists.getGroupList(this.companyId);
    this.sitelist = res.data;
    this.groupList = scp.groups;
  }
  timeFormater(time: any){
    let timeSplit = time.split(':');
    this.addAlertForm.value.publicationDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), +timeSplit[0], +timeSplit[1]).toISOString();
  }
  attachmentFile: any;
  @ViewChild('file', { static: false }) file: ElementRef;
  // onAttachment() {
  //   if (this.file.nativeElement.files.length > 0) {
  //       this.file.nativeElement.value = '';
  //   }
  //   this.file.nativeElement.click();
  // }

// async onUploadFile() {
//     this.attachmentFile = this.file.nativeElement.files[0];
// }


public space(event:any) {
  if (event.target.selectionStart === 0 && event.code === 'Space'){
    event.preventDefault();
  }
}

streamOpened(){
  if (localStorage.getItem('currentLanguage') == 'it'){
    this._adapter.setLocale('it-IT');
  }else {
    this._adapter.setLocale('eg-EG');
  }
}
getDetails(id){
  // const id = this.route.snapshot.paramMap.get('id');
    // console.log('currentAlert', this.currentAlert);
    if(id !== '0'){
      this.title = 'Edit';
      this.helper.toggleLoaderVisibility(true);
      this.ApiService.editAlerts({id:id}).subscribe((res: any) => {
        this.documentData = res.data;
        console.log('this.documentData',this.documentData);
        if(res.result === true){
          this.id =  this.documentData.id
          this.documentName = this.documentData.file
          this.addAlertForm.patchValue({
            id: this.documentData.id,
            publicationDate: this.documentData.publicationDate,
            name: this.documentData.name,
            file: this.documentData.file,
            title: this.documentData.title,
            description: this.documentData.description,
            createdAt: this.documentData.createdAt,
            userView: this.documentData.userView,
            userConfirmed: this.documentData.userConfirmed,
            distributionSites: this.documentData.distributionSites,
            distributionGroups: this.documentData.distributionGroups,
          });
          this.helper.toggleLoaderVisibility(false);
        }
        this.helper.toggleLoaderVisibility(false);
      });
    }
}


}
