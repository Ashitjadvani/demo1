import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AccessControlPassage, AccessControlPassageGroup, Site } from 'projects/fe-common/src/lib/models/admin/site';
import { Scope } from 'projects/fe-common/src/lib/models/company';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { ACCESS_CONTROL_LEVEL } from 'projects/fe-common/src/lib/models/person';
import { ViewUserQrCodesDialogComponent } from './view-user-qrcodes-dialog/view-user-qrcodes-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
    selector: 'app-people-access-section',
    templateUrl: './people-access-section.component.html',
    styleUrls: ['./people-access-section.component.scss']
})
export class PeopleAccessSectionComponent implements OnChanges {
    @Input() currentEditPerson: Person;
    @Input() scope: Scope;
    @Input() sites: Site[];

    site: Site;
    ACCESS_CONTROL_LEVEL = ACCESS_CONTROL_LEVEL;

    constructor(
        private dialog: MatDialog,
        private adminUserManagementService: AdminUserManagementService,
        public translate: TranslateService,
        private snackBar: MatSnackBar) { }

    ngOnChanges(): void {
        if(this.sites) this.site = this.sites.find(site => site.id == this.currentEditPerson.site);
        if(this.currentEditPerson) {
            if(!this.currentEditPerson.accessControlPassagesId) this.currentEditPerson.accessControlPassagesId = new Array();
        }
    }

    checkChanged(event: any, passageToCheck: AccessControlPassage) {
        if(event.checked) {
            this.currentEditPerson.accessControlPassagesId.push(passageToCheck.id);
        }
        else {
            this.currentEditPerson.accessControlPassagesId = this.currentEditPerson.accessControlPassagesId.filter(id => id != passageToCheck.id);
        }
    }

    checkPassage(passage: AccessControlPassage) {
        return this.currentEditPerson.accessControlPassagesId.find(id => id == passage.id);
    }

    checkGroupChanged(event: any, groupToCheck: AccessControlPassageGroup) {
        if(!this.currentEditPerson.accessControlGroupsId) this.currentEditPerson.accessControlGroupsId = new Array();
        if(event.checked) {
            this.currentEditPerson.accessControlGroupsId.push(groupToCheck.id);
        }
        else {
            this.currentEditPerson.accessControlGroupsId = this.currentEditPerson.accessControlGroupsId.filter(id => id != groupToCheck.id);
        }
    }

    checkGroup(group: AccessControlPassageGroup) {
        if(!this.currentEditPerson.accessControlGroupsId) this.currentEditPerson.accessControlGroupsId = new Array();
        return this.currentEditPerson.accessControlGroupsId.find(id => id == group.id);
    }

    async onViewCodes() {
        let res = await this.adminUserManagementService.getUserAccessControlQrCode(this.currentEditPerson.id);
        let userQrCodes = new Array();
        if(res.result) {
            userQrCodes = res.userQrCodes;
        }

        let result = await this.dialog.open(ViewUserQrCodesDialogComponent, {
            width: '1300px',
            panelClass: 'custom-dialog-container',
            data: {
                sites: this.sites,
                user: this.currentEditPerson,
                userQrCodes: userQrCodes
            }
        }).afterClosed().toPromise();
    }

    async onRegenerateCode() {
        let reply = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ACCESS_CONTROL.Attention'), 
            this.translate.instant('ACCESS_CONTROL.RegerateQrCodeSure1')+this.currentEditPerson.name+" "+this.currentEditPerson.surname+this.translate.instant('ACCESS_CONTROL.RegerateQrCodeSure2'),
            this.translate.instant('GENERAL.YES'),
            this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (reply) {
            let res = await this.adminUserManagementService.generateAccessControlQrCode(this.currentEditPerson.id);
            if(res.result) {
                this.snackBar.open
                (
                    this.translate.instant('ACCESS_CONTROL.RegerateQrCodeReplyStart') + this.currentEditPerson.name + " " + this.currentEditPerson.surname + this.translate.instant('ACCESS_CONTROL.RegerateQrCodeReplyOk') ,
                    this.translate.instant('GENERAL.OK'),
                    { duration: 3000 }
                );
            }
            else {
                this.snackBar.open
                (
                    this.translate.instant('ACCESS_CONTROL.RegerateQrCodeReplyStart') + this.currentEditPerson.name + " " + this.currentEditPerson.surname + this.translate.instant('ACCESS_CONTROL.RegerateQrCodeReplyNot') ,
                    this.translate.instant('GENERAL.OK'),
                    { duration: 3000 }
                );
            }
        }
    }

}
