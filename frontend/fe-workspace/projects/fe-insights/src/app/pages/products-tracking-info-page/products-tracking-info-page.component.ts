import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActionTile } from 'projects/fe-common/src/lib/models/app';
import { Product, Order, PRODUCT_STATUS } from 'projects/fe-common/src/lib/models/product-tracking/products-tracking';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { ProductsTrackingService } from 'projects/fe-common/src/lib/services/products-tracking.service';
import { HelpdeskSheetComponent } from './helpdesk-sheet/helpdesk-sheet.component';

enum ActionType {
    atPhone,
    atMail
}

@Component({
    selector: 'app-products-tracking-info-page',
    templateUrl: './products-tracking-info-page.component.html',
    styleUrls: ['./products-tracking-info-page.component.scss']
})
export class ProductsTrackingInfoPageComponent implements OnInit {
    breakpointWidth: number = 460;

    productId: string;
    breakpoint: number = 2;
    product: Product;
    order: Order;

    productionDate: Date;

    helpDeskAction: ActionTile[];
    helpDeskNumber: string = '0123456789';
    helpDeskMail: string = 'helpdesk@simplast.it';

    constructor(private commonService: CommonService,
        private bottomSheet: MatBottomSheet,
        private router: Router,
        private productsTrackingService: ProductsTrackingService,
        private notifyManagementService: NotifyManagementService,
        private activatedRoute: ActivatedRoute,
        public translate: TranslateService) {
        this.helpDeskAction = [
            new ActionTile('Help Desk: invia una mail', 'mail', ActionType.atMail, null, '#1AAEB7', null, null, null, null, null),
            new ActionTile('Help Desk: chiamata telefonica', 'phone', ActionType.atPhone, null, '#FF0000', null, null, null, null, null)
        ];

    }

    async ngOnInit() {
        /*
        this.breakpoint = (window.innerWidth <= this.breakpointWidth) ? 1 : 2;

        this.productId = this.activatedRoute.snapshot.params['id'];
        let res = await this.productsTrackingService.getProductByCode(this.productId);
        if (this.commonService.isValidResponse(res)) {
            let activationItem = res.product.operationLog.find(o => o.status == PRODUCT_STATUS.ACTIVE);
            if (activationItem) {
                this.productionDate = activationItem.timestamp
            } else {
                this.productionDate = null;
            }

            //this.product = res.product;
            //this.order = res.order;
        }*/
    }

    onResize(event) {
        this.breakpoint = (event.target.innerWidth <= this.breakpointWidth) ? 1 : 2;
    }

    onDownloadTechInfo() {
        window.open('/assets/simplast/simplast-sample-doc.pdf', '_blank');
    }

    onHelpRequest() {
        this.bottomSheet.open(HelpdeskSheetComponent, {
            data: { serviceActions: [] },
            panelClass: 'bottom-sheet'
        });
    }

    getActionStyle(serviceAction: ActionTile) {
        return {
            'background': serviceAction.BackgroundColor,
            'color': serviceAction.TextColor
        }
    }

    async onServiceAction(serviceAction: ActionTile) {
        switch (serviceAction.Action) {
            case ActionType.atPhone: {
                if (this.commonService.isMobileDevice()) {
                    document.location.href = "tel:" + this.helpDeskNumber;
                } else {
                    this.notifyManagementService.openMessageDialog('Helpdesk', 'Chiama il numero: ' + this.helpDeskNumber);
                }
                break;
            }

            case ActionType.atMail: {
                document.location.href = "mailto:" + this.helpDeskMail;
                break;
            }
        }
    }
}
