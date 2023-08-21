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
import { DomSanitizer } from '@angular/platform-browser';
import { RecruitingManagementService } from 'projects/fe-common/src/lib/services/recruiting-management.service';
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';

@Component({
    selector: 'app-view-user-document-dialog',
    templateUrl: './view-user-document-dialog.component.html',
    styleUrls: ['./view-user-document-dialog.component.scss']
})

export class ViewUserDocumentDialogComponent implements OnInit {
    documentPath: string;
    trustedUrl: any;
    doc: UserDocument;
    url: string = '';

    docIsImage = false;
    docIsPdf = false;
    docIsUnknown = true;
    
    constructor(public dialogRef: MatDialogRef<ViewUserDocumentDialogComponent>,
        private adminUserManagementService: AdminUserManagementService,
        private dataStorageManagementService: DataStorageManagementService,
        public translate: TranslateService,
        public common: CommonService,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) data: any) {
            this.doc = data.doc;
            this.getDocument();
        }

    async ngOnInit() {

    }

    async getDocument() {
        let res = await this.dataStorageManagementService.downloadFile(this.doc.fileId).toPromise();
        let blob = new Blob([res]);
        this.url = window.URL.createObjectURL(blob);
        this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(this.url);
        
        if(this.doc.fileName.indexOf("pdf")>0)
        {
            this.docIsUnknown = false;
            this.docIsImage = false;
            this.docIsPdf = true;
        }
        else if(this.doc.fileName.indexOf("png")>0 || this.doc.fileName.indexOf("jpg")>0 || this.doc.fileName.indexOf("jpeg")>0)
        { 
            this.docIsUnknown = false;
            this.docIsPdf = false;
            this.docIsImage = true;      
        }
    }

    onCancel() {
        this.dialogRef.close(null);
    }


}