import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { PersonProfileGroup } from 'projects/fe-common/src/lib/models/person-profile-group';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Action, ColumnTemplate } from '../../components/table-data-view/table-data-view.component';
import { PersonGroupManagementDialogComponent } from '../../dialogs/person-group-management-dialog/person-group-management-dialog.component';

enum EditType {
    GroupEdit,
    MemberEdit
}

@Component({
    selector: 'app-people-group-page',
    templateUrl: './people-group-page.component.html',
    styleUrls: ['./people-group-page.component.scss']
})
export class PeopleGroupPageComponent implements OnInit {
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;

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

    EditType = EditType;

    editType: EditType;
    groups: PersonProfileGroup[];
    titleCard: string;
    currentGroup: PersonProfileGroup = PersonProfileGroup.Empty();

    isModify: boolean;

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

    isEditConfirmEnabled() {
        return this.commonService.isValidField(this.currentGroup.name);
    }

    onEditCancelClick() {
        this.tabgroup.selectedIndex = 0;
    }

    async onDeleteGroup(group: PersonProfileGroup) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData("Delete group", this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.adminUserManagementService.deletePeopleGroup(group.id);
            if (res.result) {
                this.groups = this.groups.filter(u => u.id != group.id);
            } else
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    async onEditConfirmClick() {
        this.currentGroup.companyId = this.userManagementService.getAccount().companyId;

        let res;
        if (this.isModify)
            res = await this.adminUserManagementService.updatePeopleGroup(this.currentGroup);
        else
            res = await this.adminUserManagementService.addPeopleGroup(this.currentGroup);

        if (this.commonService.isValidResponse(res)) {
            await this.loadGroupList();
            this.tabgroup.selectedIndex = 0;
        } else
            this.snackBar.open(this.translate.instant('INSIGHTS_PEOPLE_PAGE.Error') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
    }

    async onAddGroup() {
        this.isModify = false;
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add Group');
        this.editType = EditType.GroupEdit;
        this.currentGroup = PersonProfileGroup.Empty();
        this.tabgroup.selectedIndex = 1;
    }

    async onModifyGroup(group: PersonProfileGroup) {
        this.isModify = true;
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Modify Group');
        this.editType = EditType.GroupEdit;
        this.currentGroup = group;
        this.tabgroup.selectedIndex = 1;
    }
}
