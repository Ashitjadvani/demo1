import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Company, Scope } from 'projects/fe-common/src/lib/models/company';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { ScopeDialogComponent } from './scope-dialog/scope-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Component({
    selector: 'app-tables-section',
    templateUrl: './tables-section.component.html',
    styleUrls: ['./tables-section.component.scss']
})
export class TablesSectionComponent implements OnInit {
    @Input() currentCompany: Company;

    @Output() UpdateEvent: EventEmitter<void> = new EventEmitter<void>();
    @Output() ReloadEvent: EventEmitter<void> = new EventEmitter<void>();

    currentScopes: Scope[] = new Array();
    currentScope: Scope;

    constructor(private adminUserManagementService: AdminUserManagementService,
        private commonService: CommonService,
        private userManagementService: UserManagementService,
        private dialog: MatDialog,
        public translate: TranslateService) { }

    async ngOnInit() {

    }

    async onUpdateClick() {
        this.UpdateEvent.emit();
    }

    async onModifyScope(scopeModify: Scope) {
        let scopeName = scopeModify.name;
        let result = await this.dialog.open(ScopeDialogComponent, {
            maxWidth: '1400px',
            width: '1400px',
            panelClass: 'custom-dialog-container',
            data: {
                scope: scopeModify,
                isNew: false,
                companyId: this.currentCompany.id
            }
        }).afterClosed().toPromise();

        if(result) {
            this.currentScope = result;
            await this.adminUserManagementService.updateCompanyScope(this.currentCompany.id,scopeName,this.currentScope);
        }
        this.ReloadEvent.emit();
    }

    async onDeleteScope(scopeDelete: Scope) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteScope')+" \""+scopeDelete.name+"\"", this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            await this.adminUserManagementService.deleteCompanyScope(this.currentCompany.id,scopeDelete.name);
            let res = await this.adminUserManagementService.getCompany(this.currentCompany.id);
            if (this.commonService.isValidResponse(res)) {
                this.currentCompany = res.company;
            }
            this.ReloadEvent.emit();
        }
    }

    async onAddScope() {
        this.currentScope = Scope.Empty();
        let result = await this.dialog.open(ScopeDialogComponent, {
            maxWidth: '1400px',
            width: '1400px',
            panelClass: 'custom-dialog-container',
            data: {
                scope: this.currentScope,
                isNew: true
            }
        }).afterClosed().toPromise();

        if(result) {
            this.currentScope = result;
            if(this.currentCompany.scopes) this.currentScopes = this.currentCompany.scopes;
            let found = false;
            let index = 0;
            for(let scope of this.currentScopes) {
                if(scope.name == this.currentScope.name) {
                    found = true;
                    break;
                }
                index++;
            }
            if(found)   await this.adminUserManagementService.updateCompanyScope(this.currentCompany.id,this.currentScope.name,this.currentScope);
            else  await this.adminUserManagementService.addCompanyScope(this.currentCompany.id,this.currentScope);

            let res = await this.adminUserManagementService.getCompany(this.currentCompany.id);
            if (this.commonService.isValidResponse(res)) {
                this.currentCompany = res.company;
            }
            this.ReloadEvent.emit();
        }

    }

}
