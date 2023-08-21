import { USER_ACTIVITY_TYPE } from "../../services/user-action.service";

export class UserActionLog {
    timestamp: Date;
    site: string;
    action: USER_ACTIVITY_TYPE;
    extra: any;

    constructor () {
        this.timestamp = new Date();
        this.site = '';
        this.action = USER_ACTIVITY_TYPE.NOP;
    }
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

    constructor() {
        this.id = '';
        this.date = '';// YYYYMMMDD
        this.site = '';
        this.smartWorkingInAt = null;
        this.smartWorkingOutAt = null;
        this.officeInAt = null;
        this.officeOutAt = null;
        this.lunchStartAt = null;
        this.lunchStopAt = null;
        this.overTimeStartAt = null;
        this.overTimeEndAt = null;
        this.deskCheckInAt = null;
        this.deskCheckOutAt = null;
        this.deskUsed= '';
        this.isInOffice = false;
        this.actionLog = [];
        this.lunchSettings = new UserLunchSettings();    
    }
}