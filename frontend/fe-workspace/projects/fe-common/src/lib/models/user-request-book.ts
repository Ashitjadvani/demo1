export enum USER_BOOK_TYPE {
    NONE = 'None',
    SMART_WORKING = "SmartWorking",
    OFFICE_WORKING = "OfficeWorking",
    NOT_WORKING = "NotWorking",
    BUSINNESS_TRIP = "BusinnessTrip",
    VACATION = "Vacation"
}

export class UserRequestBook {
    id: string;
    siteKey: string;
    date: string;
    bookType: USER_BOOK_TYPE;
    vacationTypeId: number;
    deleted: boolean;
}
