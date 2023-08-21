import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AccessControlPassage, AccessControlPassageGroup, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { find } from 'rxjs/operators';
import { Document, UserDocument } from 'projects/fe-common/src/lib/models/user-document';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { RecruitingManagementService } from 'projects/fe-common/src/lib/services/recruiting-management.service';
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';

@Component({
    selector: 'app-upload-user-document-dialog',
    templateUrl: './upload-user-document-dialog.component.html',
    styleUrls: ['./upload-user-document-dialog.component.scss']
})

export class UploadUserDocumentDialogComponent implements OnInit {
    
    @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
    file: any = null;

    user: Person;
    companyDocuments: Document[];
    selectedDocumentId: string = "";
    expirationDate: Date = null;

    newDocType: boolean = false;
    newDocName: string = "";
    
    constructor(public dialogRef: MatDialogRef<UploadUserDocumentDialogComponent>,
        private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        public recruitingManagementService: RecruitingManagementService,
        private dataStorageManagementService: DataStorageManagementService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.user = data.user;
            this.companyDocuments = data.companyDocuments;
            //this.endValidityDate = new Date();
    }
    
    async ngOnInit() {
    }


    onFileDropped($event: any) {
        this.file = $event;
    }

    fileBrowseHandler(files: any[]) {
        this.file = files[0];
    }

    onAddDocType() {
        this.newDocType = true;
    }
    
    onSelectDocType() {
        this.newDocType = false;
    }

    uploadButtonEnable() {
        if(this.expirationDate == null) return false;
        if(this.newDocType) {
            if(this.newDocName == "") return false;
            if(this.companyDocuments.find(doc => doc.name == this.newDocName)) return false;
        }
        if(!this.newDocType) {
            if(this.selectedDocumentId == "") return false;
        }
        return true;
    }

    onCancel() {
        this.dialogRef.close(null);
    }

    async onUpload() {
        let userDoc = UserDocument.Empty();
        userDoc.userId = this.user.id;
        userDoc.expirationDate = this.expirationDate;
        userDoc.fileName = this.file.name;
        
        if(this.newDocType) {
            let doc = Document.Empty();
            doc.name = this.newDocName;
            doc.companyId = this.user.companyId;
            let res = await this.adminUserManagementService.createUpdateDocument(doc);
            if(res.result) {
                doc = res.document;
                userDoc.documentId = doc.id;
                let res2 = await this.dataStorageManagementService.uploadFile(this.file);
                userDoc.fileId = res2.body.fileId;
                /*if(res2.body.result) {
                    userDoc.fileId = res2.body.fileId;
                    await this.adminUserManagementService.addUpdateUserDocument(userDoc);
                    this.dialogRef.close(null);
                }*/
                this.dialogRef.close(userDoc);
            }
        }
        else {
            //await this.adminUserManagementService.uploadUserDocument(this.file, this.user.id, this.selectedDocumentId, this.common.toYYYYMMDD(this.expirationDate));
            userDoc.documentId = this.selectedDocumentId;
            let res2 = await this.dataStorageManagementService.uploadFile(this.file);
            userDoc.fileId = res2.body.fileId;
            /*if(res2.body.result) {
                userDoc.fileId = res2.body.fileId;
                await this.adminUserManagementService.addUpdateUserDocument(userDoc);
                this.dialogRef.close(null);
            }*/
            this.dialogRef.close(userDoc);
        }
        
    }

}