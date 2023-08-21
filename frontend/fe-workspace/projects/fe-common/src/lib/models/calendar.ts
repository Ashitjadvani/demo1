export enum ENTITY_TYPE {
    PERSON = "Person",
    ASSET = "Asset",
    OTHER = "Other"
}

export enum ACTIVITY_TYPE {
    OFFICE = "OfficeWorking",
    SMARTWORKING = "SmartWorking",
    BUSINESS_TRIP = "BusinessTrip",
    NO_WORKING = "NoWorking"
}

export class PersonPlanData {
    activityType: string;
    activityDetail: string;
    activityLabel: string;
}

export class PersonEventData {
    site: string;
    note: string;
    plan: PersonPlanData;
}

export class CalendarEventDate {
    id: string;
    start: Date;
    end: Date;
    eventData: any; // PersonEventData

    constructor(startDate: Date, endDate: Date, eventData: any) {
        this.id = null;
        this.start = startDate;
        this.end = endDate;
        this.eventData = eventData;
    }
}

export class CalendarDay {
    calendarId: string;
    dateRef: Date;
    events: CalendarEventDate[];

    constructor(date: Date) {
        this.dateRef = date;
        this.events = [];
    }
};

export class Calendar {
    id: string;
    entityType: ENTITY_TYPE;
    summary: string;
    days: CalendarDay[];
}

export class LunchItem {
    dateRef: Date;
    start: Date;
    end: Date;
}