export enum ActionType {
    Menu = 0,
    QrAction = 1,
    BookDesk = 2,
    BookRoom = 3,
    BookWorkRequest = 4,
    UserBookings = 5,
    CheckIn = 6,
    ExtendBooking = 7,
    CheckOut = 8,
    SmartWorkIn = 9,
    SmartWorkOut = 10,
    OfficeIn = 11,
    OfficeOut = 12,
    InstantBook = 13,
    Services = 14,
    Statistics = 15,
    News = 16,
    UserProfile = 17,
    UserStatistics = 18,
    Safety = 19,
    Information = 20,
    Admin = 21,
    PandemicMeasures = 22,
    BoardInfo = 23,
    TestLab = 24,
    Community = 25,
    Survey = 26,
    Employee = 28,
    Recruiting = 29,
    Quiz = 30,
    ProductTracking = 31,
    StartProduction = 32,
    ProductTrackingQA = 33,
    ProductReturn = 34,

    // Services Action Types
    ComingSoon = 9999,

    VaxPreReservation = 1000,
    VaxReservation = 1001,
    Sustainability = 1002
}

export class ActionTile {
    id: string;
    available: boolean;
    Caption: string;
    Icon: string;
    Action: any;
    TextColor: string;
    BackgroundColor: string;
    InfoText: string;
    ExtraInfo: any;
    BorderColor: string;
    ChildrenAsServices: boolean;
    Children: ActionTile[];

    constructor(caption: string, icon: string, action: any, textColor: string, backgroundColor: string, infoText: string, extraInfo: string, borderColor: string, childrenAsServices: boolean, ...childrenTiles: ActionTile[]) {
        this.Caption = caption;
        this.Icon = icon;
        this.Action = action;
        this.TextColor = textColor;
        this.BackgroundColor = backgroundColor;
        this.InfoText = infoText;
        this.ExtraInfo = extraInfo;
        this.BorderColor = borderColor;
        this.ChildrenAsServices = childrenAsServices;
        this.Children = childrenTiles;
    }
}

export class StatsEntry {
    Caption: string;
    Image: string;
    Total: number;
    Available: number;

    constructor(caption: string, image: string, total: number, available: number) {
        this.Caption = caption;
        this.Image = image;
        this.Total = total;
        this.Available = available;
    }
}

export enum QrScanContext {
    qrInstantBooking,
    qrCheckIn,
    qrCheckOut,
    qrExtendBooking,
    qrBusCheckin,
    qrOfficeIn,
    qrOfficeOut,
    qrDeskCheckIn,
    qrDeskCheckOut
}