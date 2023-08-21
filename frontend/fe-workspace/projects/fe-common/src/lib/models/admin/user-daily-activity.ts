import { USER_ACTIVITY_TYPE } from "../../services/user-action.service";

export class UserActionLog {
    timestamp: Date;
    site: string;
    action: USER_ACTIVITY_TYPE;
    extra: any;
}

export class UserLunchSettings {
    timestamp: Date;
    confirmed: boolean;
    extraWorkDone: boolean;
    lunchDone: boolean;   
}

export class UserDailyActivity {
    id: string;
    date: string;// YYYYMMMDD
    site: string;
    smartWorkingInAt: Date;
    smartWorkingOutAt: Date;
    officeInAt: Date;
    officeOutAt: Date;
    lunchStartAt: Date;
    lunchStopAt: Date;
    overTimeStartAt: Date;
    overTimeEndAt: Date;
    deskCheckInAt: Date;
    deskCheckOutAt: Date;
    deskUsed: string;
    isInOffice: boolean;
    actionLog: UserActionLog[];
    lunchSettings: UserLunchSettings;
}