import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { PersonProfileGroup } from 'projects/fe-common/src/lib/models/person-profile-group';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';
import { PersonGroupManagementDialogComponent } from '../../../dialogs/person-group-management-dialog/person-group-management-dialog.component';

@Component({
    selector: 'app-groups-section',
    templateUrl: './groups-section.component.html',
    styleUrls: ['./groups-section.component.scss']
})
export class GroupsSectionComponent implements OnInit {

    groups: any[];

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.ID'), columnName: 'ID', columnDataField: 'id', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Name'), columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Description'), columnName: 'Description', columnDataField: 'description', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Edit'), image: './assets/images/pencil.svg', icon: null, color: '#000000', action: 'onModifyGroup', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteGroup', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add Group'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddGroup', context: this }
    ]

    constructor(private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        public commonService: CommonService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService) {

    }

    async ngOnInit() {
        await this.loadGroupList();
    }

    async loadGroupList() {
        const userAccount = this.userManagementService.getAccount();
        let res = await this.adminUserManagementService.getPeopleGroups(userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.groups = res.groups;
        }
    }

    async showGroupDialog(group: PersonProfileGroup) {
        let res = await this.dialog.open(PersonGroupManagementDialogComponent, {
            width: '400px',
            minHeight: '300px',
            panelClass: 'custom-dialog-container',
            data: {
                isModify: group != null,
                group: group
            }
        }).afterClosed().toPromise();
        if (res) {
            await this.loadGroupList();
        }
    }

    async onAddGroup() {
        await this.showGroupDialog(null);
    }

    async onModifyGroup(group: PersonProfileGroup) {
        await this.showGroupDialog(group);
    }

}
