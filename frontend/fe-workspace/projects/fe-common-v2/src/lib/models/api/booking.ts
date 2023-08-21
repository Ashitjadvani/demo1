import { Resource } from './resource';

export class AVPanelBooking {
    ResourceId: string;
    BookingTitle: string;
    MeetingNotes: string;
    MeetingStart: string;
    MeetingEnd: string;
    OrganizerEmailId: string;
    OrganizerAppUserId: string;
    BookingTimeZone: string;
    UITypeId: string;
    BookingTypeId?: string;

    constructor (
        ResourceId: string, 
        BookingTitle: string,
        MeetingNotes: string, 
        MeetingStart: string, 
        MeetingEnd: string, 
        OrganizerEmailId: string,
        OrganizerAppUserId: string,
        BookingTimeZone: string,
        UITypeId: string,
        BookingTypeId?: string
    ) {
        this.ResourceId = ResourceId;
        this.BookingTitle = BookingTitle;
        this.MeetingNotes = MeetingNotes;
        this.MeetingStart = MeetingStart;
        this.MeetingEnd = MeetingEnd;
        this.OrganizerEmailId = OrganizerEmailId;
        this.OrganizerAppUserId = OrganizerAppUserId;
        this.BookingTimeZone = BookingTimeZone;
        this.UITypeId = UITypeId;
        this.BookingTypeId = BookingTypeId;
    }
}

export class AVPanelBookingResponse {
    BookingId: string;
    ReferenceNumber: string;
    ErrorCode: number;
    WasBookingProcessed: boolean;
    StartTime: string;
    EndTime: string;
    XChangeReferenceNumber: string;
}

export class BookingSearchCriteria {
    AppUserId: string;
    StartDate: string;
    TimeZoneInfoId: string;
    StartDate2?: string;
    ShowHostOnly?: boolean; 
    ShowTeamBookings?: boolean; 
    currentPageIndex?: number;
    pageSize?: number;
    Duration?: number;
    ResourceId?: string;
    PropertyId?: string;

    constructor (
        AppUserId: string,
        StartDate: string,
        TimeZoneInfoId: string,
        StartDate2?: string,
        ShowHostOnly?: boolean,
        ShowTeamBookings?: boolean,
        currentPageIndex?: number,
        pageSize?: number,
    ) {
        this.AppUserId = AppUserId;
        this.StartDate = StartDate;
        this.StartDate2 = StartDate2;
        
        this.ShowHostOnly = ShowHostOnly;
        this.ShowTeamBookings = ShowTeamBookings;
        this.currentPageIndex = currentPageIndex;
        this.pageSize = pageSize;
        this.TimeZoneInfoId = TimeZoneInfoId;
    }
}

export class Bookings {
    Bookings: BookItem[];

    static Empty(): Bookings {
        return { Bookings: [] };
    }

    static SortItems(bookings: Bookings) {
        return { Bookings: bookings.Bookings.reverse() };
    }
}

export class BookItem {
    AddOns: AddOn;
    AppointmentOrganiser: null;
    Attendees: Attendees;
    BookerId: string;
    BookingId: string;
    BookingItemId?: string;
    BookingPrimaryProperty: string;
    BookingStatus: string;
    BookingStatusId: string;
    BookingType: string;
    BookingTypeId: string;
    ClearExistingAttachment: boolean;
    Covers: number;
    CreatedBy: string;
    EndTime: string;
    Id: number;
    IsPrivate: boolean;
    Notes: string;
    OwnerId: string;
    RTFBody: any
    RecurrenceId: string;
    ReferenceNumber: string;
    Resources: Resources;
    SpecialRequest: string;
    StartTime: string;
    Title: string;
    Host: string;
    Resourcename: string;
    Finish: Date;
    FinishUTC: Date;
}

export class Resources {
    ResourceItems: Resource[];
}

export class Attendees {
    AttendeeItems: AttendeeItem[]
}

export class AttendeeItem {
    AppUserId: string;
    AttendeeType: number;
    BookingRole: string;
    CompanyName: string;
    EmailAddress: string;
    FirstName: string;
    IsExternal: boolean;
    LastName: string;
    Name: string;
    PropertyName: string;
    ResourceId: string;
    ResourceName: string;
    VisitorId: string;
}

export class AddOn {
    AddOnItems: any;
}

export class BookingCancelCriteria {
    UserId: string;
    BookingId: string;
    UITypeId: string;

    constructor(AppUserId: string, BookingId: string, UITypeId: string) {
        this.UserId = AppUserId;
        this.BookingId = BookingId;
        this.UITypeId = UITypeId;
    }
}

export class CheckInCheckOutNoShowCriteria {
    BookingItemId: string;
    UserId: string;
    UITypeId: string;

    constructor(BookingItemId: string, UserId: string, UITypeId: string) {
        this.BookingItemId = BookingItemId;
        this.UserId = UserId;
        this.UITypeId = UITypeId;
    }
}

export class CheckInCheckOutResponse {
    Message?: string;
}

export class ExtendBookingCriteria {
    BookingId: string;
    ResourceId: string;
    FinishUTC: string;
    UserId: string;
    UITypeId: string;

    constructor(BookingId: string, ResourceId: string, FinishUTC: string, UserId: string, UITypeId: string) {
        this.BookingId = BookingId;
        this.ResourceId = ResourceId;
        this.FinishUTC = FinishUTC;
        this.UserId = UserId;
        this.UITypeId = UITypeId;
    }
}

