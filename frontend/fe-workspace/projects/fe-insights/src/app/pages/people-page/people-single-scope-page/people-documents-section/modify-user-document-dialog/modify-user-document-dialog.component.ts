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
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';

@Component({
    selector: 'app-modify-user-document-dialog',
    templateUrl: './modify-user-document-dialog.component.html',
    styleUrls: ['./modify-user-document-dialog.component.scss']
})

export class ModifyUserDocumentDialogComponent implements OnInit {

    @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
    file: any = null;

    userDocument: UserDocument;
    companyDocuments: Document[];
    user: Person;

    newDocType: boolean = false;
    newDocName: string = "";
    
    constructor(public dialogRef: MatDialogRef<ModifyUserDocumentDialogComponent>,
        private adminUserManagementService: AdminUserManagementService,
        private dataStorageManagementService: DataStorageManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.user = data.user;
            this.userDocument = data.userDocument;
            this.companyDocuments = data.companyDocuments;
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

    confirmButtonEnable() {
        if(this.newDocType) {
            if(this.newDocName == "") return false;
            if(this.companyDocuments.find(doc => doc.name == this.newDocName)) return false;
        }
        if(!this.newDocType) {
            if(this.userDocument.documentId == "") return false;
        }
        return true;
    }

    onCancel() {
        this.dialogRef.close(null);
    }

    async onConfirm() {
        if(this.newDocType) {
            let doc = Document.Empty();
            doc.name = this.newDocName;
            doc.companyId = this.user.companyId;
            let res = await this.adminUserManagementService.createUpdateDocument(doc);
            if(res.result) {
                doc = res.document;
                this.userDocument.documentId = doc.id;
            }
        }
        if(this.file!=null) {
            let res2 = await this.dataStorageManagementService.uploadFile(this.file);
            this.userDocument.fileName = this.file.name;
            if(res2.body.result) {
                this.userDocument.fileId = res2.body.fileId;
            }
        }
        //await this.adminUserManagementService.addUpdateUserDocument(this.userDocument);
        this.dialogRef.close(this.userDocument);
        
    }

}