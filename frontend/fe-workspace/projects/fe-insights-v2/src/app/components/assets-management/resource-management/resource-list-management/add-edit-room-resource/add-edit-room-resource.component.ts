import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IrinaResource, RESOURCE_TYPE } from 'projects/fe-common-v2/src/lib/models/bookable-assets';
import { DataRepositoryManagementService } from 'projects/fe-common-v2/src/lib/services/data-repository-management.service';
import { ResourceManagementService } from 'projects/fe-common-v2/src/lib/services/resource-management.service';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';

@Component({
    selector: 'app-add-edit-room-resource',
    templateUrl: './add-edit-room-resource.component.html',
    styleUrls: ['./add-edit-room-resource.component.scss']
})
export class AddEditRoomResourceComponent implements OnInit {
    currentResourceId: string;
    currentResourceType: RESOURCE_TYPE = RESOURCE_TYPE.ROOM;
    currentResourceGroupId: string;
    currentResource: IrinaResource = IrinaResource.Empty();

    addRoomResourceForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        private resourceManagementService: ResourceManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private dataRepositoryManagementService: DataRepositoryManagementService,
        private commonService: CommonService) {
        this.addRoomResourceForm = this.formBuilder.group({

        });

    }

    ngOnInit(): void {
        this.currentResourceId = this.route.snapshot.paramMap.get('id');
        this.currentResourceGroupId = this.route.snapshot.paramMap.get('groupId');

        if (this.currentResourceId != '0') {

        }
    }

    goBackLink() {
        return `/assets-management/resource-management/resource-list-management/${this.currentResourceType}/${this.currentResourceGroupId}`;
    }
}
