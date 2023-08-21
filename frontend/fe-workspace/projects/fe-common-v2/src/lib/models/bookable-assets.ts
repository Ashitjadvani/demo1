import { Site } from "./admin/site";
import { User } from "./admin/user";

export enum RESOURCE_TYPE {
    PARKING = "PARKING",
    DESK = "DESK",
    ROOM = "ROOM",
    ECHARGER = "ECHARGER",
    CARWASH = "CARWASH",
    VEHICLE = "VEHICLE",
    OTHER = "OTHER"
};

export enum RESOURCE_STATE_TYPE {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE",
    MAINTENANCE = "MAINTENANCE",
    RESERVED = "RESERVED",
    BOOKED = "BOOKED",
    RESTRICTED = "RESTRICTED"
};

export enum CHECK_IN_MODE {
    NONE = "NONE",
    QR = "QR",
    IMPLICIT = "IMPLICIT"
};

export enum PREASSIGN_MODE {
    NONE = "NONE",
    PERSON = "PERSON",
    CATEGORY = "CATEGORY"
};

export enum RESOURCE_NOTIFICATION_TYPE {
    NONE = "NONE",
    MAIL = "MAIL"
};

export enum RESOURCE_TYPE_EVENT {
    NONE = "NONE",
    BOOK = "BOOK",
    CANCEL_BOOK = "CANCEL_BOOK"
};

export class IrinaResourceNotification {
    eventType: RESOURCE_TYPE_EVENT;
    type: RESOURCE_NOTIFICATION_TYPE;
    subject: string;
    message: string;
}

export class AvailabilityRange {
    name: string;
    availabilityStart: Date;
    availabilityEnd: Date;
    targetTags: string[];
}

export class AvailabilityTimeslotSchema {
    name: string;
    startTime: Date;
    endTime: Date;
    targetTags: string[];
    maxCount: number;

    constructor() {
        this.name = '';
        this.startTime = null;
        this.endTime = null;
        this.maxCount = 1;
    }
}

export class ResourceAvailabilityTimeslot {
    resourceName: string;
    slot: AvailabilityTimeslotSchema;
}

export class IrinaResourceType {
    companyId: string;
    id: string;
    type: RESOURCE_TYPE;
    name: string;
    site: string;
    description: string;
    bookable: boolean;
    availableStatus: RESOURCE_STATE_TYPE[];
    availabilityStart: Date;
    availabilityEnd: Date;
    availabilityBeforeDays: number;
    availabilityHoursAfterStart: number;
    extraAvailabilityRanges: AvailabilityRange[];
    availabilityTimeslots: AvailabilityTimeslotSchema[];
    checkInMandatory: boolean;
    checkInMode: CHECK_IN_MODE;
    preAssigned: boolean;
    preAssignMode: PREASSIGN_MODE;
    fixedUsage: boolean; // no disponibile per nessun altro. quando è (si) è non risulta presenza in sede, la risorsa si svincola dall'assegnatario
    minimumReservedPool: number;
    bookNotification: IrinaResourceNotification[];
    customData: any;

    static Empty(): IrinaResourceType {
        let resourceType = new IrinaResourceType();

        resourceType.site = '';
        resourceType.availableStatus = [];
        resourceType.availabilityStart = new Date(2021, 0, 1, 0, 0, 0, 0);
        resourceType.availabilityEnd = new Date(2021, 0, 1, 23, 59, 59, 0);
        resourceType.availabilityBeforeDays = 1;
        resourceType.checkInMode = CHECK_IN_MODE.NONE;
        resourceType.preAssignMode = PREASSIGN_MODE.NONE;
        resourceType.availabilityHoursAfterStart = 24;
        resourceType.availabilityTimeslots = [];
        resourceType.customData = {};

        return resourceType;
    }
}

export class IrinaResourceFeature {
    id: string;
    name: string;
    description: string;
}

export class IrinaResource {
    companyId: string;
    parentGroupId: string;
    code: string;
    site: string;
    type: RESOURCE_TYPE;
    description: string;
    resourceType: IrinaResourceType;
    owner: string;
    custom: any;
    features: Object[];
    imageURL: string;
    children: IrinaResource[];
    exclusiveUse: boolean;
    availableToAll: boolean;
    availabilityTimeslots: AvailabilityTimeslotSchema[];
    enabled: boolean;

    static Empty(): IrinaResource {
        let resource = new IrinaResource();

        resource.companyId = '';
        resource.parentGroupId = '';
        resource.code = '';
        resource.site = '';
        resource.description = '';
        resource.owner = '';
        resource.custom = {};
        resource.imageURL = '';

        resource.features = [];
        resource.children = [];
        resource.availabilityTimeslots = [];
        resource.custom = {};

        resource.exclusiveUse = false;
        resource.availableToAll = true;
        resource.enabled = true;

        return resource;
    }
}

export class ResourceBookEntry {
    id: string; // book id (guid)
    parkingId: string;  // parking code
    date: string; // book date YYYYMMDD
    userId: string; // booker
    parkingData: IrinaResource;
    timestamp: Date;
}

export class BookableResourceType extends IrinaResourceType {

}

export class BookableResource extends IrinaResource {
    
}

export class IrinaResourceBookTimeslot {
    id: string;
    name: string;
    startTime: Date;
    endTime: Date;
    targetTags: string[];
    users: User[];
    maxCount: number;
    reservationCount: number;
    extraData: any;
}

export class IrinaResourceBook {
    id: string;
    resourceId: string;
    resourceType: IrinaResourceType
    date: string;
    site: Site;
    resource: IrinaResource;
    timeslotReservations: IrinaResourceBookTimeslot[];
    timeframeReservations: IrinaResourceBookTimeslot[];
    timestamp: Date;

    static Empty(): IrinaResourceBook {
        let resourceBook = new IrinaResourceBook();

        resourceBook.timeslotReservations = [];
        resourceBook.timeframeReservations = [];
        
        return resourceBook;
    }
}
