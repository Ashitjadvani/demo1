import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-products-tracking-work-plan-expand-row',
    templateUrl: './products-tracking-work-plan-expand-row.component.html',
    styleUrls: ['./products-tracking-work-plan-expand-row.component.scss']
})
export class ProductsTrackingWorkPlanExpandRowComponent implements OnInit {
    @Input() workPlanItems: any;

    constructor() { }

    ngOnInit(): void {
    }

}
