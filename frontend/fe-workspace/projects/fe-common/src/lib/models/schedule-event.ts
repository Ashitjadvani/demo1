export enum SCHEDULE_EVENT_TYPE {
    NO_ACTION = 'NoAction',
    IMPORT_USER_FILE = 'ImportUsersFile',
    NO_PLAN_REMAINDER = 'NoPlanRemainder',
    NO_FLOW_REMAINDER = 'NoFlowRemainder',
    SENDMAIL_WITH_REPORT = "SendMailWithReport"
}

export enum SCHEDULE_ORIGIN_TYPE {
    SYSTEM = 'System',
    USER = 'User'
}

export enum SCHEDULE_OCCURRENCE_TYPE {
    DAILY = 'Daily',
    WEEKLY = 'Weekly',
    MONTLY = 'Montly'
}

export class ScheduleEvent {
    id: string;
    name: string;
    enabled: boolean;
    scheduleType: SCHEDULE_EVENT_TYPE;
    scheduleOrigin: SCHEDULE_ORIGIN_TYPE;
    scheduleOccurence: SCHEDULE_OCCURRENCE_TYPE;
    dueTime: Date;
    parametersJSON: any;
    
    static Empty(): ScheduleEvent {
        let document: ScheduleEvent = new ScheduleEvent();

        document.name = '';
        document.enabled = true;
        document.scheduleType = SCHEDULE_EVENT_TYPE.NO_ACTION;
        document.scheduleOrigin = SCHEDULE_ORIGIN_TYPE.USER;
        document.scheduleOccurence = SCHEDULE_OCCURRENCE_TYPE.DAILY;
        document.dueTime = new Date();
        document.parametersJSON = {};

        return document;
    }

}