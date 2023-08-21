import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IrinaResourceType } from 'projects/fe-common-v2/src/lib/models/bookable-assets';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { ResourceManagementService } from 'projects/fe-common-v2/src/lib/services/resource-management.service';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'app-resource-management',
    templateUrl: './resource-management.component.html',
    styleUrls: ['./resource-management.component.scss']
})
export class ResourceManagementComponent implements OnInit {

    page = 1;
    itemsPerPage = '10';
    totalItems = 0;
    search = '';
    sortKey = 1;
    sortBy = '';
    sortClass = 'down';

    resourceTypes = [
        {
            resourceType: 'Room',
            name: 'Conference Room',
            description: 'Meeting Room Assets',
            availabilityStart: '04:30',
            availabilityHours: "24"
        },
        {
            resourceType: 'Parking',
            name: 'Vehicle Parking',
            description: 'Lorem Ipsum',
            availabilityStart: '04:00',
            availabilityHours: "12"
        },
        {
            resourceType: 'Desk',
            name: 'Hotel Desk',
            description: 'Lorem Ipsum',
            availabilityStart: '05:50',
            availabilityHours: "06"
        },
        {
            resourceType: 'E-Charger',
            name: 'Car E-Charger',
            description: 'Lorem Ipsum',
            availabilityStart: '12:30',
            availabilityHours: "11"
        },
        {
            resourceType: 'Car Wash',
            name: 'Car Wash',
            description: 'Lorem Ipsum',
            availabilityStart: '06:55',
            availabilityHours: "08"
        },
        {
            resourceType: 'Other',
            name: 'Lorem Ipsum',
            description: 'Lorem Ipsum',
            availabilityStart: '11:45',
            availabilityHours: "10"
        }
    ]
    resourceManageDisplayedColumns: string[] = ['wheelAction', 'resourceType', 'name', 'descr', 'availStart', 'availHours']

    constructor(public dialog: MatDialog,
        private helper: MCPHelperService,
        private router: Router,
        private commonService: CommonService,
        private resourceManagementService: ResourceManagementService) {

    }

    availabilityFormatter(fieldValue: any) {
        try {
            if (fieldValue) {
                let dateTime = new Date(fieldValue);
                return this.commonService.timeFormat(dateTime);
            }
        } catch (ex) {
            console.error('dateColumnFormatter exception: ', ex);
        }

        return fieldValue;
    }

    async ngOnInit() {
    }

    async onAddResourceType() {
        this.router.navigate(['']);
    }

    async onModifyResourceType(irinaResourceType: IrinaResourceType) {
        this.router.navigate([`assets-management/resource-management/add-edit-resource-type/` + irinaResourceType.id]);
    }

    async onResourceListManagement(irinaResourceType: IrinaResourceType) {
        this.router.navigate([`assets-management/resource-management/resource-list-management/${irinaResourceType.type}/${irinaResourceType.id}`]);
    }

    async onDeleteResourceType(irinaResourceType: IrinaResourceType) {

    }

    onKeyUp($event) { }
    changeSelectOption() { }
    pageChanged($event) { }
    changeSorting(field) { }
}
