import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-products-tracking-plan-expand-row',
    templateUrl: './products-tracking-plan-expand-row.component.html',
    styleUrls: ['./products-tracking-plan-expand-row.component.scss']
})
export class ProductsTrackingPlanExpandRowComponent implements OnInit {
    @Input() planItems: any;
    
    constructor() { }

    ngOnInit(): void {
    }

}
