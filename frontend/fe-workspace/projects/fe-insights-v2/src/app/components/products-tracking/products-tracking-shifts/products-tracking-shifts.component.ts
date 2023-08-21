import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-products-tracking-shifts',
    templateUrl: './products-tracking-shifts.component.html',
    styleUrls: ['./products-tracking-shifts.component.scss']
})
export class ProductsTrackingShiftsComponent implements OnInit {
    page: any = 1;
    totalItems: any = 0;
    limit: any = 10;
    itemsPerPage: any = '10';
    search: any = '';
    sortBy: any = '-1';
    sortKey = null;
    noRecordFound = false;

    displayedColumns: string[] = [

    ];
    listOfShifts: any = new MatTableDataSource([]);

    public requestPara = { search: '', page: 1, limit: 10, sortBy: '', sortKey: '' };

    constructor() { }

    ngOnInit(): void {
    }

}
