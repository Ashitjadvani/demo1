import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { data } from 'jquery';
import { ActionTileService } from 'projects/fe-common-v2/src/lib/services/action-tile.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MCPHelperService } from '../../service/MCPHelper.service';


@Component({
    selector: 'app-action-tiles',
    templateUrl: './action-tiles.component.html',
    styleUrls: ['./action-tiles.component.scss']
})
export class ActionTilesComponent implements OnInit {

    page: any = 1;
    itemsPerPage: any = '10';
    totalItems: any = 0;
    limit: any = 10;
    search: any = '';
    sortBy: any = '-1';
    sortKey = null;
    sortClass: any = 'down';
    noRecordFound = false;
    filter: any;
    sidebarMenuName: string;

    constructor(private apiService: ActionTileService,
        private helper: MCPHelperService,) {
        this._setSearchSubscription()
    }

    actionTilesList = [];

    actionTilesDisplayedColumns: string[] = ['tile', 'status'];

    public requestPara = { search: '', page: 1, limit: 10, sortBy: '', sortKey: '' };
    private subject: Subject<string> = new Subject();

    async ngOnInit(): Promise<void> {
        this.sideMenuName();
        await this.loadActionTileList(this.requestPara);
    }

    sideMenuName() {
        this.sidebarMenuName = 'Action Tiles';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    async loadActionTileList(data: any) {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.apiService.actionTileList(this.requestPara);
        this.actionTilesList = res.data;
        this.totalItems = res.meta.totalCount;

        this.noRecordFound = this.actionTilesList.length > 0;
        if (res.result) {
            this.actionTilesList = res.data;

            this.helper.toggleLoaderVisibility(false);
        }
        else {
            // this.actionTilesList = [];
            this.helper.toggleLoaderVisibility(false);
        }
        // this.actionTilesList.data = this.actionTiles;
        // this.actionTilesList.paginator = this.paginator;
    }

    async onEnableClick(item: any) {
        item.available = !item.available;
        let res = await this.apiService.updateActionTile(item);

        if (res.result) {
            await this.loadActionTileList(this.requestPara);
        }
    }

    onKeyUp(searchTextValue: any): void {
        this.subject.next(searchTextValue);
    }

    // Pagination
    changeItemsPerPage(event): void {
        // this.search = '';
        this.page = 1;
        this.itemsPerPage = event
        this.loadActionTileList(this.requestPara = {
            page: 1, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.limit = this.itemsPerPage;
    }

    pageChanged(page: number): void {
        // this.search = '';
        this.loadActionTileList(this.requestPara = {
            page, limit: this.itemsPerPage, search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
        this.page = page;
    }

    // Sorting
    changeSorting(sortKey, sortBy): void {
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.loadActionTileList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }

    // search reset
    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch() {
        this.search = '';
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        this.loadActionTileList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }

    changeSelectOption() { }

    private _setSearchSubscription(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.page = 1;
            this.loadActionTileList(this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey
            });
        });
    }
}
