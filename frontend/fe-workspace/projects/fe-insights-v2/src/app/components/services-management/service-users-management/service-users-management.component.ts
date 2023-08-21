import { Component, OnInit } from '@angular/core';
import { Person } from 'projects/fe-common-v2/src/lib/models/person';
import { ServiceUser, SERVICE_REPOSITORY } from 'projects/fe-common-v2/src/lib/models/services/models';
import { DataRepositoryEntry, DataRepositoryManagementService } from 'projects/fe-common-v2/src/lib/services/data-repository-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-service-users-management',
    templateUrl: './service-users-management.component.html',
    styleUrls: ['./service-users-management.component.scss']
})
export class ServiceUsersManagementComponent implements OnInit {
    page = 1;
    limit = '5';
    totalItems = 0;
    search = '';
    sortKey = 1;
    sortBy = '';
    sortClass = 'down';

    serviceUsers: DataRepositoryEntry[] = [];
    serviceUserDisplayedColumns: string[] = ['wheelAction', 'name', 'surname', 'cf'];

    constructor(private dataRepositoryManagementService: DataRepositoryManagementService,
        private router: Router,
        private helper: MCPHelperService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService,
        private commonService: CommonService) {

    }

    async ngOnInit() {
        await this.loadServiceUsersList();
    }

    async loadServiceUsersList() {
        let res = await this.dataRepositoryManagementService.getDataRepositoryEntries(SERVICE_REPOSITORY.USERS, { search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: '' });
        if (this.commonService.isValidResponse(res)) {
            this.serviceUsers = res.data;
        } else {
            swal.fire('', 'Error loading service users: ', 'info');
        }
    }

    onKeyUp($event) {

    }

    changeSelectOption() {

    }

    pageChanged($event) {

    }

    changeSorting(field) {

    }

    onModifyServiceUser(dataRepositoryEntry: DataRepositoryEntry) {
        this.router.navigate([`services-management/srv-users-management/add-edit-service-user/` + dataRepositoryEntry.entityId]);
    }

    onDeleteServiceUser(dataRepositoryEntry: DataRepositoryEntry) {
        let serviceUser: ServiceUser = dataRepositoryEntry.entityObject;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: 'Sei sicuro di voler eliminare ' + serviceUser.name + ' ' + serviceUser.surname + '?',
                heading: 'Cancella Utente'
            }
        }).afterClosed().subscribe(async (result) => {
            if (result) {
                this.helper.toggleLoaderVisibility(true);
                await this.dataRepositoryManagementService.deleteDataRepositoryEntry(SERVICE_REPOSITORY.USERS, dataRepositoryEntry.entityId);
                this.helper.toggleLoaderVisibility(false);
                this.loadServiceUsersList();
                swal.fire(
                    '',
                    serviceUser.name + ' ' + serviceUser.surname + ' ' + this.translate.instant('has been deleted successfully'),
                    'success'
                )
            }
        })
    }

}
