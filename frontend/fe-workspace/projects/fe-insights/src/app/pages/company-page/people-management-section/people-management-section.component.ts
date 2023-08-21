import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../../../../projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Area, Company } from '../../../../../../../projects/fe-common/src/lib/models/company';
import { AdminUserManagementService } from '../../../../../../../projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from '../../../../../../../projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from '../../../../../../../projects/fe-common/src/lib/services/user-management.service';
import { NewAreaDialogComponent } from './people-management-new-area-dialog/new-area-dialog.component';
import { NewJobTitleDialogComponent } from './people-management-new-jobtitle-dialog/new-jobtitle-dialog.component';
import { NewRoleDialogComponent } from './people-management-new-role-dialog/new-role-dialog.component';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-people-management-section',
    templateUrl: './people-management-section.component.html',
    styleUrls: ['./people-management-section.component.scss']
})
export class PeopleManagementSectionComponent implements OnInit {
    @Input() currentCompany: Company;

    @Output() UpdateEvent: EventEmitter<void> = new EventEmitter<void>();
    @Output() ReloadEvent: EventEmitter<void> = new EventEmitter<void>();

    newRoleName: string;
    newAreaName: string;
    newDirectionName: string;
    newJobTitleName: string;

    areasSorted: Area[] = new Array();
    rolesSorted: string[] = new Array();
    jobTitlesSorted: string[] = new Array();

    constructor(private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        private snackBar: MatSnackBar,
        public translate: TranslateService,
        private dialog: MatDialog) { }

    async ngOnInit() {
        this.sortAreas();
        this.sortRoles();
        this.sortJobTitles();
    }

    async sortAreas() {
        await this.loadCompanyData();
        let arr = new Array();
        if(this.currentCompany.areas) arr = this.currentCompany.areas;
        this.areasSorted = arr.sort(function(a, b){
            return ('' + a.name).localeCompare(b.name);
        });
    }
    async sortRoles() {
        await this.loadCompanyData();
        let arr = new Array();
        if(this.currentCompany.peopleRoles) arr = this.currentCompany.peopleRoles;
        this.rolesSorted = arr.sort(function(a, b){
            return ('' + a).localeCompare(b);
        });
    }
    async sortJobTitles() {
        await this.loadCompanyData();
        let arr = new Array();
        if(this.currentCompany.peopleJobTitles) arr = this.currentCompany.peopleJobTitles
        this.jobTitlesSorted = arr.sort(function(a, b){
            return ('' + a).localeCompare(b);
        });
    }

    async loadCompanyData() {
        let userAccount = this.userManagementService.getAccount();
        let res = await this.adminUserManagementService.getCompany(userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.currentCompany = res.company;
        }
    }

    async onUpdateClick() {
        this.UpdateEvent.emit();
    }

    async onAddAreaClick() {
        let area = Area.Empty();
        let result = await this.dialog.open(NewAreaDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                company: this.currentCompany,
                area: area,
                isNew: true
            }
        }).afterClosed().toPromise();


        if(result) {
            let resArea = result;
            let areas = new Array();
            if(this.currentCompany.areas) areas = this.currentCompany.areas;
            let found = false;
            let index = 0;
            for(let area of areas) {
                if(area.name == resArea.name) {
                    found = true;
                    break;
                }
                index++;
            }
            if(found)   await this.adminUserManagementService.updateCompanyArea(this.currentCompany.id,resArea.name,resArea);
            else  await this.adminUserManagementService.addCompanyArea(this.currentCompany.id,resArea);

            this.sortAreas();
            this.ReloadEvent.emit();
        }
    }

    async onAddRoleClick() {
        let role = "";
        let result = await this.dialog.open(NewRoleDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                role: role,
                isNew: true
            }
        }).afterClosed().toPromise();


        if(result) {
            let resRole = result;
            let roles = new Array();
            if(this.currentCompany.peopleRoles) roles = this.currentCompany.peopleRoles;
            let found = false;
            let index = 0;
            for(let role of roles) {
                if(role == resRole) {
                    found = true;
                    break;
                }
                index++;
            }
            if(!found) await this.adminUserManagementService.addCompanyRole(this.currentCompany.id,resRole);

            let res = await this.adminUserManagementService.getCompany(this.currentCompany.id);
            if (this.commonService.isValidResponse(res)) {
                this.currentCompany = res.company;
            }
            this.sortRoles();
            this.ReloadEvent.emit();
        }
    }

    async onAddJobTitleClick() {
        let role = "";
        let result = await this.dialog.open(NewJobTitleDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                role: role,
                isNew: true
            }
        }).afterClosed().toPromise();


        if(result) {
            let resJobTitle = result;
            let jobTitles = new Array();
            if(this.currentCompany.peopleJobTitles) jobTitles = this.currentCompany.peopleJobTitles;
            let found = false;
            let index = 0;
            for(let role of jobTitles) {
                if(role == resJobTitle) {
                    found = true;
                    break;
                }
                index++;
            }
            if(!found) await this.adminUserManagementService.addCompanyJobTitle(this.currentCompany.id,resJobTitle);

            let res = await this.adminUserManagementService.getCompany(this.currentCompany.id);
            if (this.commonService.isValidResponse(res)) {
                this.currentCompany = res.company;
            }
            this.sortJobTitles();
            this.ReloadEvent.emit();
        }
    }

    async onModifyAreaClick(areaModify: Area) {
        let areaName = areaModify.name;
        let result = await this.dialog.open(NewAreaDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                company: this.currentCompany,
                area: areaModify,
                isNew: false
            }
        }).afterClosed().toPromise();

        if(result) {
            await this.adminUserManagementService.updateCompanyArea(this.currentCompany.id,areaName,result);
            this.sortAreas();
            this.ReloadEvent.emit();
        }
    }

    async onModifyRoleClick(roleModify: string) {
        let roleName = roleModify;
        let result = await this.dialog.open(NewRoleDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                role: roleModify,
                isNew: false
            }
        }).afterClosed().toPromise();

        if(result) {
            await this.adminUserManagementService.updateCompanyRole(this.currentCompany.id,roleName,result);
            this.sortRoles();
            this.ReloadEvent.emit();
        }
    }

    async onModifyJobTitleClick(jobTitleModify: string) {
        let jobTitleName = jobTitleModify;
        let result = await this.dialog.open(NewJobTitleDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                jobTitle: jobTitleModify,
                isNew: false
            }
        }).afterClosed().toPromise();

        if(result) {
            await this.adminUserManagementService.updateCompanyJobTitle(this.currentCompany.id,jobTitleName,result);
            this.sortJobTitles();
            this.ReloadEvent.emit();
        }
    }

    async onDeleteAreaClick(area: Area) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteArea')+" \""+area.name+"\"", this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            const areaRes = await this.adminUserManagementService.deleteCompanyArea(this.currentCompany.id, area.name);
            this.snackBar.open(this.translate.instant('COMPANYTXT.' + areaRes.reason), this.translate.instant('GENERAL.OK'), {duration: 3000});
            if (areaRes.result) {
              this.sortAreas();
              this.ReloadEvent.emit();
            }
        }
    }

    async onDeleteRoleClick(role: string) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteRole')+" \""+role+"\"", this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            await this.adminUserManagementService.deleteCompanyRole(this.currentCompany.id,role);
            this.sortRoles();
            this.ReloadEvent.emit();
        }
    }

    async onDeleteJobTitleClick(job: string) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteJobTitle')+" \""+job+"\"", this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            await this.adminUserManagementService.deleteCompanyJobTitle(this.currentCompany.id,job);
            this.sortJobTitles();
            this.ReloadEvent.emit();
        }
    }

    onAddDirectionClick() {
        if (!this.currentCompany.peopleDirections.includes(this.newDirectionName)) {
            this.currentCompany.peopleDirections.push(this.newDirectionName);
            this.newDirectionName = "";
        }
    }

    onDeleteDirectionClick(direction) {
        this.currentCompany.peopleDirections = this.currentCompany.peopleDirections.filter(a => a != direction);
    }



}
