
export class AreaCapacity {
    codeArea: string;
    descrArea: string;
    fullCapacityArea: number;
    capacity: number;
    // originalCapacity: number;
};

export class SiteCapacityTimeRange {
    dateFrom: string; // YYYYMMDD
    dateTo: string; // YYYYMMDD
    capacity: number;
    exclusion: number;
    capacityPercentage: number;
    areaCapacities: AreaCapacity[] = [];

    static Create(dateFrom: string, dateTo: string, capacity: number, exclusion: number, capacityPercentage: number, areaCapacities: AreaCapacity[]) {
        let sctr = new SiteCapacityTimeRange();
  
        sctr.dateFrom = dateFrom;
        sctr.dateTo = dateTo;
        sctr.capacity = capacity;
        sctr.exclusion = exclusion;
        sctr.capacityPercentage = capacityPercentage;
        areaCapacities.forEach(ac => sctr.areaCapacities.push(Object.assign({}, ac)));

        return sctr;
    }

    static Duplicate(source: SiteCapacityTimeRange) {
        let clone = new SiteCapacityTimeRange();
  
        clone.dateFrom = source.dateFrom;
        clone.dateTo = source.dateTo;
        clone.capacity = source.capacity;
        clone.exclusion = source.exclusion;
        clone.capacityPercentage = source.capacityPercentage;
        source.areaCapacities.forEach(ac => clone.areaCapacities.push(Object.assign({}, ac)));

        return clone;
    }
};

export class SiteCapacity {
    siteKey: string;
    capacityTimeFrames: SiteCapacityTimeRange[];

    static Empty() {
        let sc = new SiteCapacity();

        sc.siteKey = '';
        sc.capacityTimeFrames = [];

        return sc;
    }
};