import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Scope } from 'projects/fe-common/src/lib/models/company';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { Document, UserDocument } from 'projects/fe-common/src/lib/models/user-document';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';
import { Action, ColumnTemplate } from 'projects/fe-insights/src/app/components/table-data-view/table-data-view.component';
import { ModifyUserDocumentDialogComponent } from './modify-user-document-dialog/modify-user-document-dialog.component';
import { UploadUserDocumentDialogComponent } from './upload-user-document-dialog/upload-user-document-dialog.component';
import { ViewUserDocumentDialogComponent } from './view-user-document-dialog/view-user-document-dialog.component';


@Component({
    selector: 'app-people-documents-section',
    templateUrl: './people-documents-section.component.html',
    styleUrls: ['./people-documents-section.component.scss']
})

export class PeopleDocumentsSectionComponent implements OnChanges{
    @Input() currentEditPerson: Person;
    @Input() scope: Scope;
    @Input() userDocuments: UserDocument[];
    @Output() docModifiedEvent = new EventEmitter<UserDocument>();

    companyDocuments: Document[];
    datePipe: DatePipe = new DatePipe('it-IT');
    now = new Date();

    userDocTableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('DOCUMENTS.Type'), columnName: 'Type', columnDataField: 'docName', columnFormatter: null, columnRenderer: 'nameRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('DOCUMENTS.FileName'), columnName: 'Name', columnDataField: 'fileName', columnFormatter: null, columnRenderer: 'fileRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('DOCUMENTS.ExpirationDate'), columnName: 'ExpirationDate', columnDataField: 'expirationDate', columnFormatter: null, columnRenderer: 'dateRenderer', columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    userDocTableRowActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Edit'), image: './assets/images/pencil.svg', icon: null, color: '#000000', action: 'onModifyDocument', context: this },
        { tooltip: this.translate.instant('DOCUMENTS.View'), image: null, icon: 'visibility', color: '#000000', action: 'onViewDocument', context: this },
        { tooltip: "Download", image: null, icon: 'download', color: '#000000', action: 'onDownloadDocument', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteDocument', context: this },
    ]

    userDocTableMainActions: Action[] = [
        //{ tooltip: this.translate.instant('DOCUMENTS.UploadUserDoc'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onUploadDoc', context: this },
    ]

    constructor(private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        private dataStorageManagementService: DataStorageManagementService,
        private commonService: CommonService,
        private dialog: MatDialog) { }

    async ngOnChanges() {
        await this.reloadData();
    }

    async reloadData() {
        if(this.currentEditPerson.companyId) {
            let res = await this.adminUserManagementService.getCompanyDocuments(this.currentEditPerson.companyId);
            if(res.result) {
                this.companyDocuments = res.documents; 
            }
        }
    }

    async onDownloadDocument (doc: UserDocument) {
        let res = await this.dataStorageManagementService.downloadFile(doc.fileId).toPromise();
        let blob = new Blob([res]);
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = doc.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }


    colorRender(valid: boolean, value: String) {
        if(valid) return "<div>"+value+"</div>";
        return "<div class=\"red\">"+value+"</div>";
    }

    nameRenderer(item: any) {
        try {
            let expDate = new Date(item.expirationDate);
            if(this.companyDocuments) {
                let docRef = this.companyDocuments.find(doc => doc.id == item.documentId);
                if(this.now.getTime() > expDate.getTime()) {
                    return this.colorRender(false, docRef.name);  
                }
                return this.colorRender(true, docRef.name);  
            }
            return this.colorRender(true, "-");
        } catch(ex) {
            console.error('nameRenderer exception: ', ex);
        }

        return '#NA'
    }

    fileRenderer(item: any) {
        try {
            let expDate = new Date(item.expirationDate);
            if(this.now.getTime() > expDate.getTime()) {
                return this.colorRender(false, item.fileName);  
            }
            return this.colorRender(true, item.fileName);
        } catch(ex) {
            console.error('fileRenderer exception: ', ex);
        }

        return '#NA'
    }

    dateRenderer(item: any) {
        try {
            let expDate = new Date(item.expirationDate);
            if(this.now.getTime() > expDate.getTime()) {
                return this.colorRender(false, this.dateToDDMMYYYY(item.expirationDate));  
            }
            return this.colorRender(true, this.dateToDDMMYYYY(item.expirationDate));
        } catch(ex) {
            console.error('dateRenderer exception: ', ex);
        }

        return '#NA'
    }

    dateToDDMMYYYY(date: Date) {
        return this.datePipe.transform(date, 'dd-MM-yyyy');
    }

    async onUploadDoc() {
        let result = await this.dialog.open(UploadUserDocumentDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                user: this.currentEditPerson,
                companyDocuments: this.companyDocuments
            }
        }).afterClosed().toPromise();
        this.docModifiedEvent.emit(result);
        await this.reloadData();
    }

    async onModifyDocument(doc: UserDocument) {
        let result = await this.dialog.open(ModifyUserDocumentDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                user: this.currentEditPerson,
                companyDocuments: this.companyDocuments,
                userDocument: doc
            }
        }).afterClosed().toPromise();
        this.docModifiedEvent.emit(result);
        await this.reloadData();
    }
    
    async onDeleteDocument(doc: UserDocument) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('DOCUMENTS.TooltipDeleteDoc')+" \""+doc.fileName+"\"", this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if(res) {
            doc.deleted = true;
            /*let res = await this.adminUserManagementService.addUpdateUserDocument(doc);
            if(res.result) {
                await this.reloadData();
            }*/
            this.docModifiedEvent.emit(doc);
            await this.reloadData();
        }
    }
    
    async onViewDocument(doc: UserDocument) {
        let result = await this.dialog.open(ViewUserDocumentDialogComponent, {
            maxWidth: '1200px',
            panelClass: 'custom-dialog-container',
            data: {
                doc: doc
            }
        }).afterClosed().toPromise();
    }
}
