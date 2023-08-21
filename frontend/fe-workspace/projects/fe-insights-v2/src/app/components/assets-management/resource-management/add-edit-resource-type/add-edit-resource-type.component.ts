import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResourceManagementService } from 'projects/fe-common-v2/src/lib/services/resource-management.service';
import { RESOURCE_TYPE, IrinaResourceType } from 'projects/fe-common-v2/src/lib/models/bookable-assets';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { Person } from 'projects/fe-common-v2/src/lib/models/person';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';

@Component({
    selector: 'app-add-edit-resource-type',
    templateUrl: './add-edit-resource-type.component.html',
    styleUrls: ['./add-edit-resource-type.component.scss']
})
export class AddEditResourceTypeComponent implements OnInit {
    RESOURCE_TYPE = RESOURCE_TYPE;

    addResourceForm: FormGroup;

    resourceTypes: any;
    resourceTypeSelected: RESOURCE_TYPE;

    currentResourceType: IrinaResourceType = IrinaResourceType.Empty();
    siteList: Site[];
    userAccount: Person;
    currentResourceTypeId: string;

    constructor(private _formBuilder: FormBuilder,
        private resourceManagementService: ResourceManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private commonService: CommonService) {
        this.addResourceForm = this._formBuilder.group({
            resourceType: ['', [Validators.required]],
            site: ['', [Validators.required]],
            name: ['', [Validators.required]],
            description: ['', [Validators.required]]
        });
        this.resourceTypes = Object.values(RESOURCE_TYPE);
    }

    ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();
        this.adminSiteManagementService.getSites(this.userAccount.companyId).then((response) => {
            this.siteList = response.data;
        });

        this.currentResourceTypeId = this.route.snapshot.paramMap.get('id');
        if (this.currentResourceTypeId != '0') {
            this.resourceManagementService.getBookableResourceType(this.currentResourceTypeId).then((response) => {
                if (response.result) {
                    this.addResourceForm.patchValue({
                        resourceType: response.data.type,
                        site: response.data.site,
                        name: response.data.name,
                        description: response.data.description
                    })
                }
            })
        }
    }

    onResourceTypeChange($event) {
    }

    async onCreateOrUpdateResourceType() {
        if (!this.addResourceForm.valid)
            return;

        this.currentResourceType.id = (this.currentResourceTypeId == '0') ? null : this.currentResourceTypeId;
        this.currentResourceType.type = this.addResourceForm.controls.resourceType.value;
        this.currentResourceType.site = this.addResourceForm.controls.site.value;
        this.currentResourceType.name = this.addResourceForm.controls.name.value;
        this.currentResourceType.description = this.addResourceForm.controls.description.value;

        let res = await this.resourceManagementService.addOrUpdateBookableResourceTypes(this.currentResourceType);
        if (this.commonService.isValidResponse(res)) {
            swal.fire(
                '',
                'Resource type updated successfully',
                'success'
            );
        } else {
            swal.fire(
                '',
                res.reason,
                'info'
            );
        }
        this.router.navigate(['/assets-management/resource-management']);
    }
}
