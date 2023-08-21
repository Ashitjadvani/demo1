export class EventRequestParams {
    constructor(page: number, limit: number, search:any,sortBy:string, sortKey:string, filterByDates:string, scope: string) {
        this.search = search;
        this.page = page;
        this.limit = limit;
        this.sortBy = sortBy;
        this.sortKey = sortKey;
        this.filterByDates = filterByDates;
        this.scope = scope;
    }
    search: any;
    page: number;
    limit: number;
    sortBy: string;
    sortKey: string;
    filterByDates: string;
    scope: string;
}
