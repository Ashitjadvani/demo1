export enum SITE_TYPE {
    HQ = "HQ",
    SITE = "Site",
    AGENCY = "Agency",
    OFFICE = "Office"
};

export enum SITE_STATE {
    CLOSED = "Closed",
    FREE = "Free",
    MAINTENANCE = "Maintenance",
    RESTRICTED_MODE = "RestrictedMode"
};

export class SiteDailyStatus {
    siteKey: string;
    date: string;
    maxCapacity: number;
    currentCapacity: number;
    status: string;
}

export class Site {
    id: string;
    key: string;
    companyId: string;
    name: string;
    address: string;
    city: string;
    description: string;
    cap: string;
    siteType: SITE_TYPE;
    globalStatus: SITE_STATE;
    maxCapacity: number;
    meetingRoomAvalabilityFlag: boolean;
    deskAvalabilityFlag: boolean;
    managerRestriction: boolean;
    useAreaCapacities: boolean;
    enableWeekend: boolean;
    deskAvalableList: any[];
    deleted: boolean;
    facilityManagerId: string;
    officeManagerId: string;
    extra: any;
    createdAt: Date;
    updatedAt: Date;
    gpsLatitude: number;
    gpsLongitude: number;
    gpsAreaGap: number;

    constructor() {

    }

    static Empty(): Site {
        let site = new Site();

        site.key = '';
        site.name = '';
        site.globalStatus = SITE_STATE.RESTRICTED_MODE;
        site.maxCapacity = 100;
        site.meetingRoomAvalabilityFlag = true;
        site.deskAvalabilityFlag = true;
        site.managerRestriction = false;
        site.deskAvalableList = [];
        site.deleted = false;

        return site;
    }

    static filterMatch(data: Site, filter: string): boolean {
        if (filter) {
            let lowerFilter = filter.toLocaleLowerCase();

            return (data.key && data.key.toLocaleLowerCase().includes(lowerFilter)) ||
                (data.name && data.name.toLocaleLowerCase().includes(lowerFilter));
        }
        return false;
    }

}