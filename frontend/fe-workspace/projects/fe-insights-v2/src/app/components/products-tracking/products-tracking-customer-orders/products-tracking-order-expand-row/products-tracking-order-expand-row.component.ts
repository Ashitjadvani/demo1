import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';

@Component({
    selector: 'app-products-tracking-order-expand-row',
    templateUrl: './products-tracking-order-expand-row.component.html',
    styleUrls: ['./products-tracking-order-expand-row.component.scss']
})
export class ProductsTrackingOrderExpandRowComponent implements OnInit {
    @Input() orderItems: any;

    constructor(public commonService: CommonService) { }

    ngOnInit(): void {
    }

}
