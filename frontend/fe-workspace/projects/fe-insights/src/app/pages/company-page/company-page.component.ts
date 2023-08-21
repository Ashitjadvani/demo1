import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { Company } from 'projects/fe-common/src/lib/models/company';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Component({
    selector: 'app-company-page',
    templateUrl: './company-page.component.html',
    styleUrls: ['./company-page.component.scss']
})
export class CompanyPageComponent implements OnInit {

    currentCompany: Company = new Company;

    constructor(private adminUserManagementService: AdminUserManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        private notifyManagementService: NotifyManagementService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService) { }

    async ngOnInit() {
        let userAccount = this.userManagementService.getAccount();
        let res = await this.adminUserManagementService.getCompany(userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.currentCompany = res.company;
        }
        this.loadCompanyData();
        let foundDir, foundMan;
        for(let role of this.currentCompany.peopleRoles) {
            if(role == "Director")  foundDir = true;
            if(role == "Area Manager")  foundMan = true;
        }
        if(foundDir && foundMan) {}
        else {
            let newRoles = new Array();
            if(!foundDir && !foundMan) {
                newRoles.push("Director");
                newRoles.push("Area Manager");
            }
            else if(!foundDir) {
                newRoles.push("Director");
            }
            else if(!foundMan) {
                newRoles.push("Area Manager");
            }
            for(let role of this.currentCompany.peopleRoles) {
                newRoles.push(role);
            }
            this.currentCompany.peopleRoles = newRoles;
            await this.adminUserManagementService.updateCompany(this.currentCompany);
        }

    }

    async onUpdate() {
        let res = await this.adminUserManagementService.updateCompany(this.currentCompany);
        if (!this.commonService.isValidResponse(res)) {
            // TODO display error
        } else {
            this.currentCompany = res.company;
            this.snackBar.open(this.translate.instant('INSIGHTS_PEOPLE_PAGE.Company data update'), this.translate.instant('GENERAL.OK'), { duration: 3000 })
        }
    }

    async loadCompanyData() {
        let userAccount = this.userManagementService.getAccount();
        let res = await this.adminUserManagementService.getCompany(userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.currentCompany = res.company;
        }
    }

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


}
