import { _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { ThemeService } from 'ng2-charts';
import { AccessControlGate } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { Person } from 'projects/fe-common-v2/src/lib/models/person';
import { Document, UserDocument } from 'projects/fe-common-v2/src/lib/models/user-document';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { DataStorageManagementService } from 'projects/fe-common-v2/src/lib/services/data-storage-management.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {MasterStaffDocumentService} from "../../../../../fe-common-v2/src/lib/services/staff-document.service";
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";
import {MCPHelperService} from "../../service/MCPHelper.service";

@Component({
  selector: 'app-modify-user-document-popup',
  templateUrl: './modify-user-document-popup.component.html',
  styleUrls: ['./modify-user-document-popup.component.scss']
})
export class ModifyUserDocumentPopupComponent implements OnInit {

  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  file: any = null;
  fileName: string = "";
  isDateSelected: any;
  selectDocumentName: boolean;
  fileCheck: boolean;
  documentSelectCheck: boolean;

  userDoc: UserDocument = null;
  selectedDocId: string = "";

  now = new Date();
  companyId: "";
  currentUser: Person = null;
  expiration: any = new Date();
  newDocType: Document = new Document();

  documentTypes: Document[] = new Array();

  datePipe: DatePipe = new DatePipe('it-IT');
    staffDocumentList: any;
    staffDocumentId: any;
    staffDocumentName: any;
    filtered: any;
    userId: string;
    isExpired: any;
    isMandatory: boolean;

  constructor(
    public _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModifyUserDocumentPopupComponent>,
    public acService: AccessControlService,
    public peopleService: AdminUserManagementService,
    public siteService: AdminSiteManagementService,
    private router: Router,
    private commonService: CommonService,
    private _adapter: DateAdapter<any>,
    private adminUserManagementService: AdminUserManagementService,
    private masterStaffDocumentService: MasterStaffDocumentService,
    public translate: TranslateService,
    private helper: MCPHelperService,
    private dataStorageManagementService: DataStorageManagementService,

    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(data) {
          console.log("data------>",data.userDoc)
        this.userDoc = data.userDoc;
          if (this.userDoc.expirationDate===null){
              this.expiration = ''
          }else {
              this.expiration = new Date(this.userDoc.expirationDate);
          }
        this.selectedDocId = this.userDoc.documentId;
        this.fileName = this.userDoc.fileName;
        this.staffDocumentId = this.userDoc.documentId
          this.staffDocumentName=this.userDoc.staffDocumentName
          console.log("this.staffDocumentName",this.staffDocumentName)
          this.userId=this.userDoc.userId
          this.isExpired = this.data.userDoc.isMandatory
        console.log(this.selectedDocId);
      }
    }

  async ngOnInit() {
      this._adapter.setLocale('eg-EG');
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
      let res = await this.peopleService.getUserInfo(authUser.person.id);
      if(res.result) this.currentUser = res.person;
    }


    await this.getDocumentTypes();
  }
    staffDocumentData(data:any){
        this.staffDocumentId = data
        this.selectedDocId = data
        if (data ==='new'){
            console.log("working-----------")
            this.isMandatory=false
            console.log("this.isMandatory",this.isMandatory)
        }
        this.newDocType.id=data.id
        this.documentSelectCheck=false
        let findedData = this.staffDocumentList.filter((value) => {
            return value.id === data
            // (i => i.id === data.id);
        })
        if (data!=='new'){
            this.staffDocumentId =findedData[0].id
            this.staffDocumentName=findedData[0].name
            console.log("0000--->",findedData[0].id)
        }


    }
  async onSave() {
      console.log("this.fileName",this.fileName)
      if (this.fileName===null){
          this.fileCheck =true
      }else {
          this.fileCheck =false
      }
      if (this.staffDocumentId !==undefined || this.staffDocumentId ==='new'){
          this.documentSelectCheck=false
      }else {
          this.documentSelectCheck=true
      }
      if(this.newDocType.name !==''){
          this.documentSelectCheck = true
      }else {
          this.documentSelectCheck=false
      }
      if (this.isMandatory === false || this.newDocType.name !=='' || this.file !== null){
          console.log('if condition.....1')
          console.log("this.newDocType.name",this.newDocType.name)
          if (this.selectedDocId === 'new' && this.newDocType.name !=undefined && this.file !=null){
              console.log('if condition.....2')
              let data = {
                  name:this.newDocType.name,
                  isMandatory:false,
                  companyId:this.companyId
              }
              await this.masterStaffDocumentService.addStaffDocument(data).then((res:any)=>{
                  if (res.result){
                      this.staffDocumentId =res.document.id
                      this.addDocument()
                  }else {
                      swal.fire('',
                          this.translate.instant(res.reason),
                          'info');
                  }
              },(err) =>{
                  this.helper.toggleLoaderVisibility(false);
                  swal.fire(
                      '',
                      this.translate.instant(err.reason),
                      'info'
                  )
              });
          }else {
              // this.addDocument()
          }
      }else {
          if (this.selectedDocId !== 'new'){
              this.isMandatory = true
          }
          this.selectDocumentName =true
      }

  }
    addEvent(event){
        console.log(event)
        if (event){
            this.isDateSelected =true
            this.isMandatory=false
            this.isExpired = true
        }
    }

 async addDocument(){
     if(this.staffDocumentId) {
         if(this.staffDocumentName!="") {
             if(this.file) {
                 let res2 = await this.dataStorageManagementService.uploadFile(this.file);
                 this.userDoc.fileId = res2.body.fileId;
                 this.userDoc.fileName = this.file.name;
             }
             let data:any ={
                 id:this.userDoc.id,
                 documentId: this.staffDocumentId,
                 userId: this.userId,
                 deleted:false,
                 fileName:this.userDoc.fileName,
                 fileId:this.userDoc.fileId,
                 expirationDate:new Date(this.expiration),
                 timestamp:new Date()
             }
             let res = await this.adminUserManagementService.addUpdateDocument(data);
             this.newDocType = res.document;
             this.userDoc.documentId = this.staffDocumentId;
             this.userDoc.expirationDate = new Date(this.expiration);
             this.userDoc.staffDocumentName = this.staffDocumentName
             this.dialogRef.close(this.userDoc);
             console.log("this.doc",this.userDoc)

         }
         else {
             console.log("else")
             this.userDoc.documentId = this.selectedDocId;
             this.userDoc.expirationDate = new Date(this.expiration);
             let res2 = await this.dataStorageManagementService.uploadFile(this.file);
             this.userDoc.fileId = res2.body.fileId;
             this.userDoc.fileName = this.file.name;
             this.dialogRef.close(this.userDoc);
         }}
  }
  onClose(): void{
    this.dialogRef.close(null);
  }

    changeValue(event){
        if (event){
            this.selectDocumentName = false
        }
    }
  async getDocumentTypes() {

      try {
          let data={
              search: "",
              limit : "full",
              page: 1,
              sortKey: "name",
              sortBy: "1"
          }
          await this.masterStaffDocumentService.getStaffDocsList(data,this.companyId).then((res: any) => {
              if (res.result){
                  this.staffDocumentList= res.documents
                  console.log(this.staffDocumentList)
              }
          });
      } catch (e) {
      }

    try {
      let res = await this.adminUserManagementService.getDocuments(this.companyId);
      if(res.result && res.documents) {
        this.documentTypes = res.documents;
        if(this.documentTypes.length > 0) {
          this.selectedDocId = this.documentTypes[0].id;
        }
      }
    }
    catch(e) {}
  }



  onFileDropped($event: any) {
    this.file = $event;
    this.fileName = this.file.name;
  }

  fileBrowseHandler(files: any[]) {
      this.file = files[0];
      this.fileName = this.file.name;
  }



}
