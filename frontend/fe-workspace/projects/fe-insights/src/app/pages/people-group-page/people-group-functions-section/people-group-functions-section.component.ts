import { Component, Input, OnInit } from '@angular/core';
import { PersonProfileGroup } from 'projects/fe-common/src/lib/models/person-profile-group';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Component({
    selector: 'app-people-group-functions-section',
    templateUrl: './people-group-functions-section.component.html',
    styleUrls: ['./people-group-functions-section.component.scss']
})
export class PeopleGroupFunctionsSectionComponent implements OnInit {
    @Input() currentGroup: PersonProfileGroup;

    companyFunctions: string[];

    constructor(private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        public commonService: CommonService) { }

    async ngOnInit() {
        let res = await this.adminUserManagementService.getCompanyFunctions();
        if (this.commonService.isValidResponse(res)) {
            this.companyFunctions = res.functions;
        }
    }

    isFunctionSelected(func: string) {
        return this.currentGroup.functions.includes(func); 
    }

    onFunctionSelected(func: string) {
        if (this.currentGroup.functions.includes(func))
            this.currentGroup.functions = this.currentGroup.functions.filter(p => p != func);
        else
            this.currentGroup.functions.push(func);
    }
}
