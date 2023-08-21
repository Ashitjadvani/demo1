export class NfsUser {
    AppUserId: string;
    DisplayName: string;
    FirstName: string;
    LastName: string;
    EmailAddress: string;
    IsAuthenticated: boolean;
    Message: string;
    UserName: string;
    PrimaryPropertyId: string;
    TimeZoneInfoId: any;
    Is12HourTimeFormat: boolean;
    RoleId: string;
    RoleName: string;
    ForeignSystemAppUserId: string;
    IsActive: boolean;
    IsADUser: boolean;
    ApiLogMessage: string;
    UserDataProvider: number;
    HasAccessFromOutsideDomain: any
    VerificationKey: any;
    Password: any;
    LanguagePreference: string;
    AllowMultiPropertyBooking: boolean;
}

export class UserGroup {
    UserGroupId: string;
    PropertyId: string;
    UserGroupName: string;
    PropertyName: string;
    RoleUserGroupId: string;
    RoleId: string;
    FunctionalityUserGroupList: []
}