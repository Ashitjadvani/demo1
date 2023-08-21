import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { Area, Company, Scope} from 'projects/fe-common/src/lib/models/company';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
    selector: 'app-new-area-dialog',
    templateUrl: './new-area-dialog.component.html',
    styleUrls: ['./new-area-dialog.component.scss']
})
export class NewAreaDialogComponent implements OnInit {
    area: Area;
    isNew: boolean;
    currentCompany: Company;
    currentAreaScopes: string[] = new Array();
    name = 'Angular 6';
    htmlContent = '';
    

    config: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: '15rem',
      minHeight: '5rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      sanitize: false,
      fonts: [
        {class: 'Arial', name: 'Arial'},
        {class: 'Times New Roman', name: 'Times New Roman'},
        {class: 'Calibri', name: 'Calibri'},
        {class: 'sans-serif', name: 'sans-serif'}
        ],
      toolbarHiddenButtons: [
        ['insertImage'],
        ['insertVideo']
      ],
      customClasses: [
        {
            name: 'LineHeight-15px',
            class: 'LineHeight-15px'
        },
        {
            name: 'LineHeight-20px',
            class: 'LineHeight-20px'
        },
        {
            name: 'LineHeight-25px',
            class: 'LineHeight-25px'
        },
        {
            name: 'LineHeight-30px',
            class: 'LineHeight-30px'
        },
      ]
    };

    constructor(public dialogRef: MatDialogRef<NewAreaDialogComponent>,
        private userManagementService: UserManagementService,
        private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) {
            this.area = data.area;
            this.isNew = data.isNew;
            this.currentCompany = data.company;
    }

    async ngOnInit() {
        for(let scope of this.area.scopes) {
            this.currentAreaScopes.push(scope);
        }
    }

    onCancel() {
        this.dialogRef.close(null);
    }

    async onSave() {
        this.dialogRef.close(this.area);
    }

    onChangeCheck(event: any, scope: string) {
        if(event.checked) {
            this.currentAreaScopes.push(scope);
        }
        else {
            let index = this.currentAreaScopes.indexOf(scope, 0);
            if (index > -1) {
                this.currentAreaScopes.splice(index, 1);
            }
        }
        this.area.scopes = this.currentAreaScopes;
    }

    getChecked(scopeToCheck: string) {
        for(let scope of this.area.scopes) {
            if(scopeToCheck == scope) return true;
        }
        return false;
    }

}
