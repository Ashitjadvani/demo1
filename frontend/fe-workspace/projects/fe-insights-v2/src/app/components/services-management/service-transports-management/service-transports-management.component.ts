import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServiceTransport, SERVICE_REPOSITORY, TRANSPORT_REQUEST_TYPE } from 'projects/fe-common-v2/src/lib/models/services/models';
import { DataRepositoryEntry, DataRepositoryManagementService } from 'projects/fe-common-v2/src/lib/services/data-repository-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import swal from 'sweetalert2';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import { MCPHelperService } from '../../../service/MCPHelper.service';

enum TABLE_COLUMN_REF {
    DATE,
    REQUESTER
}


@Component({
  selector: 'app-service-transports-management',
  templateUrl: './service-transports-management.component.html',
  styleUrls: ['./service-transports-management.component.scss']
})
export class ServiceTransportsManagementComponent implements OnInit {
    TABLE_COLUMN_REF = TABLE_COLUMN_REF;

    page = 1;
    limit = '5';
    totalItems = 0;
    search = '';
    sortKey = 1;
    sortBy = '';
    sortClass = 'down';

    serviceTransports: DataRepositoryEntry[] = [];
    serviceTransportsDisplayedColumns: string[] = ['wheelAction', 'date', 'requester'];

    constructor(private dataRepositoryManagementService: DataRepositoryManagementService,
        private router: Router,
        private helper: MCPHelperService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService,
        private commonService: CommonService) {

    }

    async ngOnInit() {  
        await this.loadServiceTransportsList();
    }

    async loadServiceTransportsList() {
        let res = await this.dataRepositoryManagementService.getDataRepositoryEntries(SERVICE_REPOSITORY.TRANSPORTS, {search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: '' });
        if (this.commonService.isValidResponse(res)) {
            this.serviceTransports = res.data;
        } else {
            swal.fire('', 'Error loading service users: ', 'info');
        }
    }

    renderTableColumn(columnRef: TABLE_COLUMN_REF, dateEntry: DataRepositoryEntry) {
        let serviceTransport: ServiceTransport = dateEntry.entityObject;

        if (columnRef == TABLE_COLUMN_REF.DATE) {
            return this.commonService.formatDateTime(serviceTransport.creationDate, 'dd/MM/yyyy');
        } else if (columnRef == TABLE_COLUMN_REF.REQUESTER) {
            return ServiceTransport.TranslateRequestType(serviceTransport.requester); 
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

    onModifyServiceTransport(dataRepositoryEntry: DataRepositoryEntry) {
        this.router.navigate([`services-management/srv-transports-management/add-edit-service-multi-transport/` + dataRepositoryEntry.entityId]);
    }

    onDeleteServiceTransport(dataRepositoryEntry: DataRepositoryEntry) {
        let serviceTransport: ServiceTransport = dataRepositoryEntry.entityObject;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: 'Sei sicuro di voler eliminare la richiesta di trasporto ?',
                heading: 'Cancella Richiesta'
            }
        }).afterClosed().subscribe(async (result) => {
            if (result) {
                this.helper.toggleLoaderVisibility(true);
                await this.dataRepositoryManagementService.deleteDataRepositoryEntry(SERVICE_REPOSITORY.TRANSPORTS, dataRepositoryEntry.entityId);
                this.helper.toggleLoaderVisibility(false);
                this.loadServiceTransportsList();
                swal.fire(
                    '',
                    'La richiesta è stata eliminata',
                    'success'
                )
            }
        })
    }
}
