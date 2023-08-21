import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataRepositoryManagementService } from 'projects/fe-common-v2/src/lib/services/data-repository-management.service';
import { ResourceManagementService } from 'projects/fe-common-v2/src/lib/services/resource-management.service';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import { IrinaResource, RESOURCE_TYPE } from 'projects/fe-common-v2/src/lib/models/bookable-assets';
import swal from 'sweetalert2';
import { Person } from 'projects/fe-common-v2/src/lib/models/person';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';

enum TABLE_COLUMN_REF {
    SITE,
    CODE,
    CARPLATE,
    DESCRIPTION
}

@Component({
    selector: 'app-resource-list-management',
    templateUrl: './resource-list-management.component.html',
    styleUrls: ['./resource-list-management.component.scss']
})
export class ResourceListManagementComponent implements OnInit {
    TABLE_COLUMN_REF = TABLE_COLUMN_REF;

    page = 1;
    itemsPerPage = '5';
    totalItems = 0;
    search = '';
    sortKey = 1;
    sortBy = '';
    sortClass = 'down';

    resourceDisplayedColumns: string[] = ['wheelAction', 'site', 'code', 'descr'];

    currentResourceType: RESOURCE_TYPE;
    currentResourceGroupId: string;
    currentResources: IrinaResource[] = [];

    userAccount: Person;
    siteList: Site[] = [];

    constructor(private formBuilder: FormBuilder,
        private resourceManagementService: ResourceManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private dataRepositoryManagementService: DataRepositoryManagementService,
        private commonService: CommonService) {

    }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();

        this.currentResourceType = this.route.snapshot.paramMap.get('type') as RESOURCE_TYPE;
        this.currentResourceGroupId = this.route.snapshot.paramMap.get('groupId');

        let res = await this.resourceManagementService.getCurrentResourcesInGroup(this.currentResourceType, this.currentResourceGroupId);
        if (this.commonService.isValidResponse(res)) {
            this.currentResources = res.data;
        } else {
            swal.fire('', 'Error loading resource types', 'info');
        }

        this.adminSiteManagementService.getSites(this.userAccount.companyId).then((response) => {
            let responseValue: any = JSON.parse(JSON.stringify(response))
            this.siteList = responseValue.data
        });

        this.setupTableColumns();
    }

    setupTableColumns() {
        if (this.currentResourceType == RESOURCE_TYPE.VEHICLE) {
            this.resourceDisplayedColumns = ['wheelAction', 'site', 'carPlate', 'descr'];
        }
    }

    async onAddResource() {
        if (this.currentResourceType == RESOURCE_TYPE.VEHICLE)
            this.router.navigate([`assets-management/resource-management/resource-list-management/add-edit-vehicle-resource/0/${this.currentResourceGroupId}`]);
        else if (this.currentResourceType == RESOURCE_TYPE.ROOM)
            this.router.navigate([`assets-management/resource-management/resource-list-management/add-edit-room-resource/0/${this.currentResourceGroupId}`]);
    }

    async onModifyResource(irinaResource: IrinaResource) {
        if (this.currentResourceType == RESOURCE_TYPE.VEHICLE)
            this.router.navigate([`assets-management/resource-management/resource-list-management/add-edit-vehicle-resource/${irinaResource.code}/${this.currentResourceGroupId}`]);
        else if (this.currentResourceType == RESOURCE_TYPE.ROOM)
            this.router.navigate([`assets-management/resource-management/resource-list-management/add-edit-room-resource/${irinaResource.code}/${this.currentResourceGroupId}`]);
    }

    async onDeleteResource(irinaResource: IrinaResource) {

    }

    renderTableColumn(columnRef: TABLE_COLUMN_REF, irinaResource: IrinaResource) {
        if (columnRef == TABLE_COLUMN_REF.SITE) {
            let resourceSite = this.siteList.find(s => s.id == irinaResource.site);
            return resourceSite ? resourceSite.name : '';
        } else if (columnRef == TABLE_COLUMN_REF.CODE) {
            return irinaResource.code
        } else if (columnRef == TABLE_COLUMN_REF.CARPLATE) {
            return irinaResource.custom.carPlate;
        } else if (columnRef == TABLE_COLUMN_REF.DESCRIPTION) {
            return irinaResource.description;
        }
    }


    onKeyUp($event) { }
    changeSelectOption() { }
    pageChanged($event) { }
    changeSorting(field) { }
}
