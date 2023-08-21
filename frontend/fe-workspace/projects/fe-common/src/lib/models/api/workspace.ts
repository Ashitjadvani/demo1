export class WorkspaceCriteria {
    PropertyId: string;
    ResourceTypeId: string;
    AreaId?: string;
    LayoutId?: string;
    Capacity?: number;
    
    constructor(PropertyId: string, ResourceTypeId: string) {
        this.PropertyId = PropertyId;
        this.ResourceTypeId = ResourceTypeId;
    }
}