import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {NSHelperService} from '../../service/NSHelper.service';
import {NSApiService} from "../../service/NSApi.service";
import {any} from "codelyzer/util/function";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import Swal from "sweetalert2";
import swal from "sweetalert2";

@Component({
    selector: 'app-activity-log',
    templateUrl: './activity-log.component.html',
    styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
    dataSource: any = new MatTableDataSource([]);
    public requestPara = {page: 1, limit: 10, search: '', sortBy: '', sortKey: ''};
    private subject: Subject<string> = new Subject();
    sidebarMenuName: string;
    noRecordFound = false;
    page = 1;
    itemsPerPage = '10';
    totalItems: any = 0;
    limit: any = 10;
    sortBy: any = '-1';
    sortKey = null;
    public filter: any;

    constructor(
        public dialog: MatDialog,
        private helper: NSHelperService,
        private api: NSApiService
    ) {
        // @ViewChild(MatSort) sort: MatSort;
    }

    displayedColumns: string[] = ['datetime', 'userName', 'moduleName', 'activityType', 'status', 'description'];
    resultsLength = 0;

    onKeyUp(event: any): any {
        this.page = 1;
        this.subject.next(event.target.value);
    }

    ngOnInit(): void {
        this.loadActivityData(this.requestPara);
        this.sideMenuName();
        this.subject.pipe(debounceTime(500)).subscribe(searchTextValue => {
            this.applyFilter(searchTextValue);
        });
    }

    loadActivityData(req: any) {
        this.helper.toggleLoaderVisibility(true);
        this.api.activityLogAPI(req).subscribe((res: any) => {
            if (res) {
                this.helper.toggleLoaderVisibility(false);
                this.dataSource = res.data
            } else {
                Swal.fire('', res.error.message, 'error')
            }
        }, (error) => {
            this.helper.toggleLoaderVisibility(false);
            const e = error.error;
            swal.fire(
                'Info!',
                e.message,
                'error'
            );
        });
    }

    sideMenuName() {
        this.sidebarMenuName = 'Activity Log';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    applyFilter(filterValue: string): void {
        if (filterValue) {
            filterValue = filterValue.trim();
            filterValue = filterValue.toLowerCase();
        }
        this.filter = filterValue;
        this.dataSource.data = [];

        this.requestPara = {
            page: this.page,
            limit: this.limit,
            search: filterValue,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        };
        this.loadActivityData(this.requestPara);
    }

    // Sorting
    changeSorting(sortBy, sortKey): void {
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.loadActivityData(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.filter,
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }

    //  pagination
    pageChanged(page): void {
        this.loadActivityData({page, limit: this.itemsPerPage});
        this.page = page;
    }

    changeItemsPerPage(): void {
        this.loadActivityData({page: 1, limit: this.itemsPerPage});
    }

    @ViewChild('searchBox') myInputVariable: ElementRef;

    resetSearch() {
        this.myInputVariable.nativeElement.value = '';
        this.requestPara = {
            page: this.page,
            limit: this.limit,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey
        };
        this.loadActivityData(this.requestPara);
    }

}
