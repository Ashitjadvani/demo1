export class Area {
    IsNewArea: boolean;
    AreaId: string;
    Name: string;
    MaintainenceUseOnly: boolean;
    IsActive: boolean;
    SubAreaList: [];
    PropertyId: string;
    ParentAreaId: string;
    PropertyName: string;
    AreaResourceList: AreaResource[];
    Resources: [];
    IsValid: boolean;
    IsNew: boolean;
    IsDeleted: boolean;
    IsCancelled: boolean;
    IsSaveSuccess: boolean;
    BrokenRule: []
}

export class AreaResource {
    ResourceId: string;
    ResourceTypeId: string;
    ResourceTypeSetupBreakDownTimeAttributeId: string;
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
    AreaName: string;
    AreaId: string;
    TimeZone: any;
    StockType: any;
    ResourceLocation: any;
    ResourceTypeName: string;
    SetUpBreakDown: any;
    Name: string;
    ImageFileUrl: string;
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
    NoteId: string;
    SiteId: string;
    ResourceCode: any;
    StockTypeId: string;
    IpadDeviceId: string;
    SystemId: string;
    AllowCurDayBkngsOnly: boolean;
    ZbdProductId: string;
    ZbdProductName: string;
    ZbdConfigurationId: string;
    CutOffPeriod: any;
    CutOffTime: any;
    AddHoursForWeekend: boolean;
    ExternalResourceId: string;
    IsRequireAuth: boolean;
    Notes: any;
    ResourceGroupItem: any;
    EmailIds: any;
    ResourceCategoryItem: any;
    ScanCode: any;
}