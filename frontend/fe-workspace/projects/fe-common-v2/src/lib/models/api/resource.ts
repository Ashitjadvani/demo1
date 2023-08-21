import { Configuration } from './configuration';
import { WorkspaceCriteria } from './workspace';

export class ResourceAvailabilityCriteria {
    RoleId: string;
    StartDate: string;
    EndDate: string;
    TimeZoneInfoId: string;
    Locale: string;
    UITypeId: string;
    WorkspaceCriteriaList?: WorkspaceCriteria[];
    constructor(RoleId: string, StartDate: string, EndDate: string, TimeZoneInfoId: string, Locale: string, UITypeId: string) {
        this.RoleId = RoleId;
        this.StartDate = StartDate;
        this.EndDate = EndDate;
        this.TimeZoneInfoId = TimeZoneInfoId;
        this.Locale = Locale;
        this.UITypeId = UITypeId;
    }
}

export class FeatureIcon {
    FeatureIconName: string;
    ImageFileUrl: string;
    ToolTip: string;
}

export class Resource {
    ResourceId: string;
    Name: string;
    ResourceName: string;
    Floor: string;
    PropertyId: string;
    PropertyName: string;
    MinCapacity: number;
    MaxCapacity: number;
    ResourceDescription: string;
    Setup: string;
    Breakdown: string;
    AllowCurDayBkngsOnly: boolean;
    ImageFileUrl: string;
    IsRequireAuth: boolean;
    DisplayOnReaderBoard: boolean;
    AreaId: string;
    AreaName: string;
    FeatureIcons: FeatureIcon[];
    ScanCode: string;
    ResourceTypeId: string;
    ResourceTypeName: string;
    Price: number;
    Notes: string;
    constructor() { }
}

export enum ResourceTypeNames {
    Desks = "Desks",
    Equipment = "Equipment",
    Hospitality = "Hospitality",
    MeetingRoom = "Meeting Room",
    Parking = "Parking"
}

export class ResourceType {
    ResourceTypeId: string;
    ResourceTypeName: ResourceTypeNames | string
    Description: string;
    ImageFileUrl: string;
    AllowLayout: boolean;
    IsAddOn: boolean;
    IsActive: boolean;
    Version: number;
    AllowParticipants: boolean;
    ModifiedOn: string;
    AllowSearchWebApp: boolean;
    AllowSearchOutlook: boolean;
    NameByCulture: string;
    HasConfigurations: boolean;
    Name: string;
    ResourceTypeAttributes: [];
    ResourceTypeCategories: [];
    AttributeTemplates: [];
    Configuration: Configuration;
    SpaceType: string;
}

export class BlockedResourceTiming {
    BlockedFromTime: string;
    BlockedFromTimeWithoutSetup: string;
    BlockedToTime: string;
    BlockedToTimeWithoutBreakdown: string;
    ResourceId: string;
}

export class ResourceSearchResult {
    AllResources: Resource[];
    BlockedResourceTimings: BlockedResourceTiming[];
    constructor() { }
}

export class ResourceCriteria {
    ResourceNameLike: string;
    PropertyId?: string;
    FunctionalityId?: string;
    RoleId?: string;
    StockTypeId?: string;
    ResourceTypeId?: string;
    ResourceName?: string;
    IsActive?: boolean;
    IsDeletedFromDb?: boolean;
    IsAddOn?: boolean;
    IsGlobalAddOn?: boolean;
    ExternalResourceId?: string;
    ResourceId?: string;
    ResourceIds?: string[];
    ScanCode?: string;

    constructor(ResourceNameLike: string) {
        this.ResourceNameLike = ResourceNameLike;
    }
}

export class ResourceTypeAttribute {
    ResourceTypeAttributeId: string;
    ResourceTypeId: string;
    AttributeName: string;
    AttributeTypeID: string;
    AttributeTypeName: string;
    AttributeValue: string;
    AttributeExtraValue: string;
    AttributeDefaultValue: string;
    IsFilter: boolean;
    AttributeOrderValue: number;
    IsActive: boolean;
    Version: number;
    AttributeDataTypeName: string;
    IsNew: boolean;
    IsDefaultLayout: boolean;
    NameByCulture: string;
    LookUpItem: string;
}