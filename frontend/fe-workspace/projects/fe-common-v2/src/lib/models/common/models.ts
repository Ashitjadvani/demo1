export class PaginationModel{
    constructor(){
        this.page = 1;
        this.limit = 10;
        this.itemsPerPage = 10;
        this.totalItems = 0;
    }

    page: number;
    limit: number;
    itemsPerPage: number;
    totalItems: number;
}