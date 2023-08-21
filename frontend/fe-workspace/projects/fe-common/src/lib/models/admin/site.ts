import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { v4 as uuidv4 } from 'uuid';

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

export class AccessControlPassage {
    id: string;
    name: string;
    centralUnitId: number;
    releNumber: number;
    documentId: string;

    constructor() {

    }

    static Empty(): AccessControlPassage {
        let passage = new AccessControlPassage();

        passage.id = uuidv4();
        passage.name = "";

        return passage;
    }
}

export class AccessControlPassageGroup {
    id: string;
    name: string;
    passageIds: string[];

    constructor() {

    }

    static Empty(): AccessControlPassageGroup {
        let group = new AccessControlPassageGroup();

        group.id = uuidv4();
        group.name = "";
        group.passageIds = [];

        return group;
    }
}
  
export class AvailableAccessControlCentralUnit {
    centralUnitId: number;
    name: string;
    groupname: string;
    tokenWifi: string;
    lastConnection: Date;

    constructor() {

    }
}

export class AvailableAccessControlGroup {
    groupId: number;
    name: string;

    constructor() {

    }
}

export class GeneratedAccessControlCentralUnit {
    id: string;
    name: string;
    centralUnitId: number;
    wifiSSID: string;
    wifiPassword: string;
    groupId: number;
    groupName: string;
    lomniaUrl: string;
    createQrCode: string;
    setWifiQrCode: string;
    setPathQrCode: string;
    resetKeypadQrCode: string;
    resetBlacklistQrCode: string;
}

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

    accessControlEnable: boolean;
    accessControlUrl: string;
    accessControlToken: string;
    accessControlGroupId: number;
    accessControlGroupName: string;
    accessControlPassages: AccessControlPassage[];
    accessControlPassageGroups: AccessControlPassageGroup[];
    availableAccessControlCentralUnits: AvailableAccessControlCentralUnit[];
    availableAccessControlGroups: AvailableAccessControlGroup[];
    accessControlConnected: boolean;
    useAccessControlQrCodeForCheckIn: boolean;
    generatedAccessControlCentralUnits: GeneratedAccessControlCentralUnit[];
    lastAccessControlAnswer: string;

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
        site.accessControlPassages = [];
        site.availableAccessControlCentralUnits = [];
        site.accessControlPassageGroups = [];

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