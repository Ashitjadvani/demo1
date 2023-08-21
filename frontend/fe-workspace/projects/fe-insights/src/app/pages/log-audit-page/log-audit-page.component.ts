import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LogItem } from 'projects/fe-common/src/lib/models/log-event';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { LogManagementService } from 'projects/fe-common/src/lib/services/log-management.service';
import { EnvironmentService } from 'projects/fe-touchpoint/src/app/services/environment.service';

const PAGE_ITEM_COUNT = 10;
const FETCH_ITEM_COUNT = 300;

@Component({
    selector: 'app-log-audit-page',
    templateUrl: './log-audit-page.component.html',
    styleUrls: ['./log-audit-page.component.scss']
})
export class LogAuditPageComponent implements OnInit {
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    
    logItems: LogItem[];
    dataSource = new MatTableDataSource<LogItem>();
    searchValue: string;
    

    constructor(private common: CommonService,
        private env: EnvironmentService,
        private router: Router,
        private dialog: MatDialog,
        private logManagement: LogManagementService) { }

    async ngOnInit() {
        await this.loadLogItems(0);
    }

    async loadLogItems(page: number) {
        let res = await this.logManagement.getLogEvents(page, FETCH_ITEM_COUNT);
        if (res && res.result) {
            this.logItems = res.data;
            this.dataSource.data = this.dataSource.data.concat(this.logItems);
            this.dataSource.paginator = this.paginator;
        }
    }

    async onRefreshLog() {
        this.searchValue = '';
        this.dataSource.data = [];
        await this.loadLogItems(0);
    }

    async onSearch() {
        if (this.searchValue && (this.searchValue.length > 0)) {
            this.dataSource.data = this.dataSource.data.filter(log => {
                return log.user.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase()) ||
                    log.message.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase());
            }) 
        } else {
            await this.loadLogItems(0);
        }
    }

    async onPage(event: PageEvent) {
        let lastIndex = ((event.pageIndex * event.pageSize) + event.pageSize);
        if (((lastIndex % FETCH_ITEM_COUNT) == 0)) {
            let page = (lastIndex / FETCH_ITEM_COUNT);
            await this.loadLogItems(page);
        }
    }
}
