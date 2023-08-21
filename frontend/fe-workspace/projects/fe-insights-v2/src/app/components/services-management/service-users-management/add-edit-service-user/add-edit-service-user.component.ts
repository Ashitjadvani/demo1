import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServiceUser, SERVICE_REPOSITORY } from 'projects/fe-common-v2/src/lib/models/services/models';
import { DataRepositoryManagementService } from 'projects/fe-common-v2/src/lib/services/data-repository-management.service';
import { ResourceManagementService } from 'projects/fe-common-v2/src/lib/services/resource-management.service';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { v4 as uuidv4 } from 'uuid';
import swal from 'sweetalert2';

@Component({
    selector: 'app-add-edit-service-user',
    templateUrl: './add-edit-service-user.component.html',
    styleUrls: ['./add-edit-service-user.component.scss']
})
export class AddEditServiceUserComponent implements OnInit {
    provList = [
        'AG', 'AL', 'AN', 'AO', 'AR ', 'AP', 'AT', 'AV',
        'BA', 'BT', 'BL', 'BN', 'BG', 'BI', 'BO', 'BZ', 'BS', 'BR',
        'CA', 'CL', 'CB', 'CE', 'CT', 'CZ', 'CH', 'CO', 'CS', 'CR', 'KR', 'CN',
        'EN',
        'FM', 'FE', 'FI', 'FG', 'FC', 'FR',
        'GE', 'GO', 'GR',
        'IM', 'IS',
        'SP', 'LT', 'LE', 'LC', 'LI', 'LO', 'LU',
        'MC', 'MC', 'MS', 'MT', 'VS', 'ME', 'MI', 'MO', 'MB',
        'NA', 'NO', 'NU',
        'OR',
        'PD', 'PA', 'PR', 'PV', 'PG', 'PU', 'PE', 'PC', 'PI', 'PT', 'PN', 'PZ', 'PO',
        'RG', 'RA', 'RC', 'RE', 'RI', 'RN', 'RM', 'RO',
        'SA', 'SS', 'SV', 'SI', 'SR', 'SO',
        'TA', 'TE', 'TR', 'TO', 'TP', 'TN', 'TV', 'TS',
        'UD',
        'VA', 'VE', 'VB', 'VC', 'VR', 'VV', 'VI', 'VT'
    ];

    genderList = [
        { value: "Not Specified", viewValue: "Not Specified" },
        { value: "Male", viewValue: "Male" },
        { value: "Female", viewValue: "Female" }
    ];

    serviceUserForm: FormGroup;
    serviceUser: ServiceUser = ServiceUser.Empty();
    currentServiceUserId: string;

    constructor(private formBuilder: FormBuilder,
        private resourceManagementService: ResourceManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private dataRepositoryManagementService: DataRepositoryManagementService,
        private commonService: CommonService) {

        this.serviceUserForm = this.formBuilder.group({
            name: ['', Validators.required],
            surname: ['', Validators.required],
            cf: ['', Validators.required],
            gender: [''],
            birthDay: [''],
            birthPlace: [''],
            birthProv: [''],
            address: [''],
            city: [''],
            prov: [''],
            cap: [''],
            phone: [''],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        this.currentServiceUserId = this.route.snapshot.paramMap.get('id');
        if (this.currentServiceUserId != '0') {
            this.dataRepositoryManagementService.getDataRepositorySingleEntry(SERVICE_REPOSITORY.USERS, this.currentServiceUserId).then((response) => {
                if (response.result) {
                    this.serviceUserForm.patchValue(response.data.entityObject)
                }
            })
        }
    }

    async onSaveServiceUser() {
        if (!this.serviceUserForm.valid)
            return;

        this.serviceUser = this.commonService.mapFormGroupToObject(this.serviceUserForm, this.serviceUser);

        let id = this.currentServiceUserId != '0' ? this.currentServiceUserId : uuidv4();
        let res = await this.dataRepositoryManagementService.addOrUpdateDataRepositoryEntry(SERVICE_REPOSITORY.USERS, id, this.serviceUser);
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
        this.router.navigate(['/services-management/srv-users-management']);

    }

}

