import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Plan, PlanItem } from 'projects/fe-common-v2/src/lib/models/product-tracking/products-tracking';
import { Order, Product, PRODUCT_STATUS } from 'projects/fe-common/src/lib/models/product-tracking/products-tracking';

export enum UIMode {
    Tracking,
    QA,
    Returned
}

@Component({
    selector: 'app-product-tracking-action-sheet',
    templateUrl: './product-tracking-action-sheet.component.html',
    styleUrls: ['./product-tracking-action-sheet.component.scss']
})
export class ProductTrackingActionSheetComponent implements OnInit {
    ProductStatus = PRODUCT_STATUS;
    UIMode = UIMode;

    currentOrder: Plan;
    currentProduct: PlanItem;
    currentMode: UIMode;
    doneEvent: Function;

    constructor(private bottomSheetRef: MatBottomSheetRef<ProductTrackingActionSheetComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
        
        this.currentMode = data.mode;
        this.currentOrder = data.order;
        this.currentProduct = data.productItem;
        this.doneEvent = data.doneEvent;
    }

    ngOnInit(): void {
    }

    getActionStyle(isexit: boolean = false) {
        return {
            'background': isexit ? '#ff0000' : '#0640A9',
            'color': '#0640A9'
        }
    }

    async onProductChangeStatus(productStatus: PRODUCT_STATUS) {
        await this.doneEvent(this.currentProduct.activation_id, productStatus);
        this.bottomSheetRef.dismiss();
    }

    onCloseDrawer() {
        this.bottomSheetRef.dismiss();
    }

    onScrapProduct() {
        this.bottomSheetRef.dismiss();
    }
}
