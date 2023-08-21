import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { Company, Scope } from 'projects/fe-common/src/lib/models/company';
import { Person} from 'projects/fe-common/src/lib/models/person';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { UserCapabilityService } from '../../services/user-capability.service';

@Component({
    selector: 'app-people-page',
    templateUrl: './people-page.component.html',
    styleUrls: ['./people-page.component.scss'],
    providers: [
        { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } }
      ]
})
export class PeoplePageComponent implements OnInit {

    currentCompany: Company = new Company();
    userAccount: Person;
    scopesAvailable: Scope[];

    constructor(private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        private userCapabilityService: UserCapabilityService) {
    }

    async ngOnInit() {
        this.scopesAvailable = new Array();
        this.userAccount = this.userManagementService.getAccount();

        await this.loadCompany();
        for(let scope of this.currentCompany.scopes) {
            if(this.userCapabilityService.isFunctionAvailable('People/'+scope.name))    this.scopesAvailable.push(scope);
        }
    }

    async loadCompany() {
        let res = await this.adminUserManagementService.getCompany(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.currentCompany = res.company;
        }
    }
}
