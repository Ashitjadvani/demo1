import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Site } from 'projects/fe-common-v2/src/lib/models/admin/site';
import { UserActionLog, UserDailyActivity } from 'projects/fe-common-v2/src/lib/models/admin/user-daily-activity';
import { ACTIVITY_TYPE } from 'projects/fe-common-v2/src/lib/models/calendar';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { USER_ACTIVITY_TYPE } from 'projects/fe-common-v2/src/lib/services/user-action.service';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-user-plan-popup',
    templateUrl: './user-plan-popup.component.html',
    styleUrls: ['./user-plan-popup.component.scss']
})
export class UserPlanPopupComponent implements OnInit {
    date: Date = new Date();
    person: Person;
    userDailyActivity: UserDailyActivity = new UserDailyActivity();
    currentLogActivity: UserActionLog = new UserActionLog();

    siteList: Site[];

    activityTypes = Object.values(USER_ACTIVITY_TYPE);

    constructor(public dialogRef: MatDialogRef<UserPlanPopupComponent>,
        private userManagementService: UserManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private commonService: CommonService,
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.person = data.person;
    }

    async ngOnInit() {
        await this.loadPersonActivity();

        this.adminSiteManagementService.getSites(this.person.companyId).then((response) => {
            let responseValue : any = JSON.parse(JSON.stringify(response))
            this.siteList = [{id: 'SMARTWORKING', name: 'SMARTWORKING' }, ...responseValue.data];
          });      
    }

    async loadPersonActivity() {
        let dateYYYYMMDD = this.commonService.toYYYYMMDD(this.date);
        let res = await this.adminUserManagementService.getUserActivities(this.person.id, dateYYYYMMDD, dateYYYYMMDD);
        if (this.commonService.isValidResponse(res)) {
            let ua = this.commonService.firstOrDefault(res.activities);
            if (ua)
                this.userDailyActivity = ua 
            else {
                this.userDailyActivity = new UserDailyActivity();
                this.userDailyActivity.id = this.person.id;
                this.userDailyActivity.date = dateYYYYMMDD;
            }
        }
    }

    async onDateChange() {
        await this.loadPersonActivity();
    }

    onUpdateActivityLog(logActivity: UserActionLog) {
        this.currentLogActivity = logActivity;
    }

    getTimestamp() {
        return this.commonService.timeFormat(this.currentLogActivity.timestamp);
    }

    setTimestamp(time) {
        this.currentLogActivity.timestamp = this.commonService.buildDateTimeFromHHMM(this.date, time);
    }

    selectedTimestampChange($event) {
        console.log($event);
    }

    onDeleteActivityLog(index: number) {
        this.userDailyActivity.actionLog.splice(index, 1);
        this.userDailyActivity.actionLog = new Array(...this.userDailyActivity.actionLog);
    }

    async onSave() {
        let res = await this.adminUserManagementService.updateUserActivity(this.userDailyActivity);
        if (this.commonService.isValidResponse(res)) {

            this.dialogRef.close(null);
        } else {

        }
    }

    onClose(): void {
        this.dialogRef.close(null);
    }

    onUpdateActionLog() {
        this.userDailyActivity.actionLog.push(this.currentLogActivity);
        this.userDailyActivity.actionLog.sort((a, b) => {
            return this.commonService.compareOnlyTime(a.timestamp, b.timestamp);
        })

        this.userDailyActivity.actionLog = new Array(...this.userDailyActivity.actionLog);
        this.currentLogActivity = new UserActionLog();
    }

}
