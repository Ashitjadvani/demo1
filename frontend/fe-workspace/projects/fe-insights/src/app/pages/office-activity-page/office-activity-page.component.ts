import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-office-activity-page',
    templateUrl: './office-activity-page.component.html',
    styleUrls: ['./office-activity-page.component.scss']
})
export class OfficeActivityPageComponent implements OnInit {

    displayedColumns: string[] = [
        'Id',
        'Name',
        'Site',
        'OfficeIn',
        'OfficeOut',
        'LunchIn',
        'LunchOut',
        'SmartworkingIn',
        'SmartworkingOut',
        'Activities'
    ];
    activities: any;

    constructor(private activatedRoute: ActivatedRoute,
        private commonService: CommonService,
        private adminUserManagementService: AdminUserManagementService) { }

    async ngOnInit() {
        let dateFrom = this.activatedRoute.snapshot.params['dateFrom'];
        let dateTo = this.activatedRoute.snapshot.params['dateTo'];

        let res = await this.adminUserManagementService.getUserActivities('all', dateFrom, dateTo);
        if (this.commonService.isValidResponse(res)) {
            this.activities = res.activities;
        } else {
            // TODO display error
        }
    }

    safeGetUserName(element) {
        try {
            return element.user.name + ' ' + element.user.surname; 
        } catch(ex) {
            return '#N/A';
        }
    }

    safeActivities(element) {
        try {
            return element.actionLog; 
        } catch(ex) {
            return [];
        }

    }

}
