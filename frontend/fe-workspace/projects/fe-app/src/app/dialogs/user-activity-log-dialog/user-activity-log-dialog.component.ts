import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserActionLog, UserDailyActivity } from 'projects/fe-common/src/lib/models/admin/user-daily-activity';
import { USER_ACTIVITY_TYPE } from 'projects/fe-common/src/lib/services/user-action.service';

@Component({
    selector: 'app-user-activity-log-dialog',
    templateUrl: './user-activity-log-dialog.component.html',
    styleUrls: ['./user-activity-log-dialog.component.scss']
})
export class UserActivityLogDialogComponent implements OnInit {
    userActionLog: UserActionLog[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) data: UserDailyActivity) {
        if (data) {
            this.userActionLog = data.actionLog.filter(act =>
                (act.action == USER_ACTIVITY_TYPE.OFFICE_IN) || (act.action == USER_ACTIVITY_TYPE.OFFICE_OUT) ||
                (act.action == USER_ACTIVITY_TYPE.SMARTWORK_IN) || (act.action == USER_ACTIVITY_TYPE.SMARTWORK_OUT)
            );
        }
    }

    ngOnInit(): void {

    }

    getActivityItemLabel(userActionLog: UserActionLog) {
        return userActionLog.action;
    }

    getActivityItemColor(userActionLog: UserActionLog) {

    }
}
