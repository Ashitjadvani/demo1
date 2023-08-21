import { Area } from './area';
import { UserGroup } from './nfs-user';

export enum PropertyNames {
    AgosHeadQuarters = "Agos GreenLife 280"
}

export class Property {
    IsNewProperty: boolean;
    AddressId: string;
    PropertyId: string;
    Name: PropertyNames | string;
    Image: string;
    Description: string;
    URL: string;
    TimeDisplay: boolean;
    TimeZoneGMT: string;
    IsActive: boolean;
    IsLenelProperty: boolean;
    LenelInstanceName: string;
    LenelConfigurationId: string;
    PropertyAreaList: Area[];
    PropertyResourceList: PropertyResource[];
    Address: [];
    RoleUserGroup: UserGroup[];
    PropertyTypeId: string;
    DefaultCountryId: string;
    RegionId: string;
    DefaultStateId: string;
    ExternalPropertyId: string;
    IsValid: boolean;
    IsNew: boolean;
    IsDeleted: boolean;
    IsCancelled: boolean;
    IsSaveSuccess: boolean;
    BrokenRule: []
}

export class PropertyResource {
    ResourceId: string;
    ResourceTypeId: string;
    ResourceTypeSetupBreakDownTimeAttributeId: any;
    SiteIdInt: any;
    AttributeValues: any;
    ResourceAttributes: any;
    Covers: any;
    CoversForResource: any;
    SearchStart: any;
    SearchFinish: any;
    IsNearPerfectSearch: boolean;
    PropertyName: string;
    PropertyInfo: any;
    PropertyId: string;
    ResourceType: any;
    AreaName: any;
    AreaId: string;
    TimeZone: any;
    StockType: any;
    ResourceLocation: any;
    ResourceTypeName: string;
    SetUpBreakDown: any;
    Name: string;
    ImageFileUrl: any;
    Department: any;
    IsActive: boolean;
    IsDeletedFromDb: boolean;
    IsAddOn: boolean;
    IsGlobalAddOn: boolean;
    Max: any;
    Unit: any;
    Stock: any;
    IsAVCResourceType: any;
    DiaryPosition: any;
    DisplayName: any;
    IsMainMultiResource: boolean;
    DisplayOnReaderBoard: boolean;
    SelectedQuantity: boolean;
    NoteId: any;
    SiteId: any;
    ResourceCode: any;
    StockTypeId: string;
    IpadDeviceId: any;
    SystemId: any;
    AllowCurDayBkngsOnly: boolean;
    ZbdProductId: any;
    ZbdProductName: any;
    ZbdConfigurationId: any;
    CutOffPeriod: any;
    CutOffTime: any;
    AddHoursForWeekend: boolean;
    ExternalResourceId: any;
    IsRequireAuth: boolean;
    Notes: any;
    ResourceGroupItem: any;
    EmailIds: any;
    ResourceCategoryItem: any;
    ScanCode: any;
}

export class PropertyInfo {
    DefaultCountryId: string;
    DefaultStateId: string;
    AddressId: string;
    PropertyId: string;
    Name: string;
    IsActive: boolean;
    TimeZoneGMT: string;
    Image: string;
    Description: string;
    TimeDisplay: boolean;
    PropertyTypeName: string;
    PropertyTypeId: string;
    RegionId: string;
    IsLenelProperty: boolean;
    LenelConfigurationId: string;
    LenelInstanceName: string;
    ExternalPropertyId: string;
}