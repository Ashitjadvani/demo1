import {_DisposeViewRepeaterStrategy} from '@angular/cdk/collections';
import {DatePipe} from '@angular/common';
import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ThemeService} from 'ng2-charts';
import {AccessControlGate} from 'projects/fe-common-v2/src/lib/models/access-control/models';
import {Site} from 'projects/fe-common-v2/src/lib/models/admin/site';
import {Person} from 'projects/fe-common-v2/src/lib/models/person';
import {Document, UserDocument} from 'projects/fe-common-v2/src/lib/models/user-document';
import {AccessControlService} from 'projects/fe-common-v2/src/lib/services/access-control.service';
import {AdminSiteManagementService} from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import {AdminUserManagementService} from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import {MasterStaffDocumentService} from 'projects/fe-common-v2/src/lib/services/staff-document.service';
import {CommonService} from 'projects/fe-common-v2/src/lib/services/common.service';
import {DataStorageManagementService} from 'projects/fe-common-v2/src/lib/services/data-storage-management.service';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import swal from "sweetalert2";
import {MCPHelperService} from "../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-upload-user-document-popup',
    templateUrl: './upload-user-document-popup.component.html',
    styleUrls: ['./upload-user-document-popup.component.scss']
})
export class UploadUserDocumentPopupComponent implements OnInit {

    @ViewChild("fileDropRef", {static: false}) fileDropEl: ElementRef;
    file: any = null;

    now = new Date();
    companyId: "";
    currentUser: Person = null;
    currentPerson: Person = null;
    currentPersonId: string = "";
    expiration: string = "";

    documentTypes: Document[] = new Array();
    doc: UserDocument = UserDocument.Empty();
    newDocType: Document = new Document();
    selectedDocId: string = "";

    datePipe: DatePipe = new DatePipe('it-IT');
    staffDocumentList: any;
    staffDocumentId: any;
    staffDocumentName: any;
    expirationValid: any;
    isMandatory: boolean=false;
    isExpired: boolean;
    isDateSelected: any;
    selectDocumentName: boolean;
    fileCheck: boolean;
    documentSelectCheck: boolean;

    constructor(
        public _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<UploadUserDocumentPopupComponent>,
        public acService: AccessControlService,
        public peopleService: AdminUserManagementService,
        public siteService: AdminSiteManagementService,
        private router: Router,
        private commonService: CommonService,
        private _adapter: DateAdapter<any>,
        private adminUserManagementService: AdminUserManagementService,
        private helper: MCPHelperService,
        private dataStorageManagementService: DataStorageManagementService,
        private masterStaffDocumentService: MasterStaffDocumentService,
        public translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.currentPersonId = data.personId;
        }
    }

    async ngOnInit() {
        this._adapter.setLocale('eg-EG');
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.companyId = authUser.person.companyId;
            let res = await this.peopleService.getUserInfo(authUser.person.id);
            if (res.result) this.currentUser = res.person;
        }
        if (this.currentPersonId) {
            let res = await this.peopleService.getUserInfo(this.currentPersonId);
            if (res.result) this.currentPerson = res.person;
        }

        this.newDocType = new Document();
        this.newDocType.companyId = this.companyId;
        this.newDocType.name = "";

        this.doc = new UserDocument();
        this.doc.userId = this.currentPersonId;
        this.doc.timestamp = new Date();
        this.doc.deleted = false;

        await this.getDocumentTypes();
    }
    staffDocumentData(data:any){
        this.staffDocumentId = data.id
        if (data ==='new'){
            this.isMandatory=false
            this.documentSelectCheck=false
        }
        this.staffDocumentName=data.name
        this.newDocType.id=data.id
        this.isMandatory = data.isMandatory
        this.documentSelectCheck=false
        this.selectedDocId = data
    }
    async onSave() {
        if (this.file===null){
            this.fileCheck =true
        }else {
            this.fileCheck =false
        }
        if(this.newDocType.name !==''){
            this.documentSelectCheck = true
        }else {
            this.documentSelectCheck=false
        }
        if (this.staffDocumentId !==undefined || this.staffDocumentId ==='new'){
            this.documentSelectCheck=false
        }else {
            this.documentSelectCheck=true
        }
        if(this.isMandatory === false || this.newDocType.name !=='' || this.file != null){
            if (this.selectedDocId === 'new' && this.newDocType.name !==''&& this.file !=null){
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
                this.addDocument()
            }
        }
        else {
            if (this.selectedDocId !== 'new'){
                this.isMandatory = true
            }
            this.selectDocumentName =true
            this.fileCheck=true
        }


    }
    addEvent(event){
        if (event){
            this.isDateSelected =true
            this.isMandatory=false
            this.isExpired = true
        }
    }

    changeValue(event){
        if (event){
            this.selectDocumentName = false
        }
    }

   async addDocument(){
        if (this.file != null) {
            if (this.staffDocumentId) {
                if (this.staffDocumentName != "") {
                    let res2 = await this.dataStorageManagementService.uploadFile(this.file);
                    if (res2.body.result===true) {
                        let data:any ={
                            documentId: this.staffDocumentId,
                            userId: this.currentPerson.id,
                            deleted:false,
                            fileName:this.file.name,
                            fileId:res2.body.fileId,
                            expirationDate:new Date(this.expiration),
                            timestamp:new Date()
                        }
                        //let res = await this.adminUserManagementService.addUpdateDocument(data);
                        //this.newDocType = res.document;
                        this.doc.documentId = this.staffDocumentId;
                        this.doc.fileId = res2.body.fileId;
                        this.doc.fileName = this.file.name;
                        this.doc.expirationDate = new Date(this.expiration);
                        this.doc.staffDocumentName = this.staffDocumentName
                        this.dialogRef.close(this.doc);
                    }
                }
            } else {
                this.doc.documentId = this.selectedDocId;
                this.doc.expirationDate = new Date(this.expiration);
                let res2 = await this.dataStorageManagementService.uploadFile(this.file);
                this.doc.fileId = res2.body.fileId;
                this.doc.fileName = this.file.name;
                this.dialogRef.close(this.doc);
            }
        }
    }

    onClose(): void {
        this.dialogRef.close(null);
    }

    async getDocumentTypes() {
        let data={
            search: "",
            limit : "full",
            page: 1,
            sortKey: "name",
            sortBy: "1"
        }
        try {
            await this.masterStaffDocumentService.getStaffDocsList(data,this.companyId).then((res: any) => {
                if (res.result){
                    this.staffDocumentList= res.documents
                }
            });
        } catch (e) {
        }
    }

    onFileDropped($event: any) {
        this.file = $event;
    }

    fileBrowseHandler(files: any[]) {
        this.fileCheck =false
        this.file = files[0];
    }


}
