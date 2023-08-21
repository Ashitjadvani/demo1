import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CameraType, QrScannerComponent } from 'projects/fe-common-v2/src/lib/components/qr-scanner/qr-scanner.component';
import { ITEM_STATUS, Order, OrderItem, Plan, PlanItem, Product, PRODUCT_STATUS } from 'projects/fe-common-v2/src/lib/models/product-tracking/products-tracking';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common-v2/src/lib/services/notify-management.service';
import { ProductsTrackingService } from 'projects/fe-common-v2/src/lib/services/products-tracking.service';
import { SettingsManagementService } from 'projects/fe-common-v2/src/lib/services/settings-management.service';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';

enum SCAN_STATE {
    ssOrder,
    ssProduct
}

enum ACTION_STATE {
    asStartOrder,
    asOrderActive,
    asCloseOrder,
    asOrderDead
}

class ProductActivationCommand {
    public productCode: string;
    public productDescr: string;
    public quantity: number;
    public done: number;
}

@Component({
    selector: 'app-product-tracking-page',
    templateUrl: './product-tracking-page.component.html',
    styleUrls: ['./product-tracking-page.component.scss']
})
export class ProductTrackingPageComponent implements OnInit {
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    @ViewChild('scanner') qrScanner: QrScannerComponent;

    ACTION_STATE = ACTION_STATE;

    currentActionState: ACTION_STATE;

    scanning: boolean = false;
    currentCamera: CameraType = CameraType.Back;

    currentScanState: SCAN_STATE;
    currentOrder: Plan;
    currentOrderProducts: PlanItem[] = [];

    isItemComplete = (item: PlanItem) => (item.status == PRODUCT_STATUS.ELIGIBLE) || (item.status == PRODUCT_STATUS.PACKAGING) || (item.status == PRODUCT_STATUS.SHIP);

    productActivationCommands: ProductActivationCommand[] = [];
    currentProductItemCode: string;

    constructor(private commonService: CommonService,
        private adminSiteManagementService: AdminSiteManagementService,
        private productsTrackingService: ProductsTrackingService,
        private userManagementService: UserManagementService,
        private bottomSheet: MatBottomSheet,
        private settingsManagementService: SettingsManagementService,
        private notifyManagementService: NotifyManagementService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService,
        private router: Router) { }

    async ngOnInit() {
        let workingOrder = this.settingsManagementService.getSettingsValue('wo');
        if (workingOrder) {
            let res = await this.productsTrackingService.getOrder(workingOrder);
            if (this.commonService.isValidResponse(res)) {
                this.currentOrder = res.order;

                await this.loadOrderProducts();
                this.buildProductActivation();

                if (this.isOrderClosed())
                    this.currentActionState = ACTION_STATE.asCloseOrder;
                else
                    this.currentActionState = ACTION_STATE.asOrderActive;
            } else {
                await this.notifyManagementService.openMessageDialog('ATTENZIONE', 'Si è verificato un errore: ' + res.reason);
                this.currentActionState = ACTION_STATE.asOrderDead;
            }
        } else {
            this.currentActionState = ACTION_STATE.asStartOrder;
        }
    }

    async loadOrderProducts() {
        /*
        let res = await this.productsTrackingService.getOrderProducts(this.currentOrder.id);
        if (this.commonService.isValidResponse(res)) {
            this.currentOrderProducts = res.products;
        } else {
            this.currentOrderProducts = [];
            await this.notifyManagementService.openMessageDialog('ATTENZIONE', 'Si è verificato un errore: ' + res.reason);
        }
        */

        this.currentOrderProducts = this.currentOrder.items.filter(oi => oi.status == PRODUCT_STATUS.ACTIVE);
    }

    buildProductActivation() {
        /*
        let eligibleCommands = this.currentOrder.items.map(oi => {
            let activeProducts = this.currentOrderProducts.filter(op => (op.itemCode == oi.code) && (op.status != PRODUCT_STATUS.DRAFT) && (op.status != PRODUCT_STATUS.SCRAP));
            return {
                productCode: oi.code,
                productDescr: oi.description,
                quantity: oi.quantity,
                done: activeProducts.length
            }
        });
        */

        let eligibleCommands = this.currentOrder.items.map(oi => {
            let activeCount = 0;
            return {
                productCode: oi.id,
                productDescr: oi.code,
                quantity: oi.qty_prod,
                done: oi.qty_prod
            }
        });

        this.productActivationCommands = eligibleCommands.filter(cmd => cmd.done);
    }

    isOrderClosed() {
        let completeItem = this.currentOrder.items.filter(i => this.isItemComplete(i)).length;
        return completeItem == this.currentOrder.orderData.quantity;
    }

    isValidQR(qrKey: string, qrValue: string): boolean {
        return qrValue.includes(qrKey);
    }

    unpackQR(data: string) {
        let split = data.split('/');
        if (split.length < 1)
            return null;
        return split[split.length - 1];
    }

    getActionStyle(isexit: boolean = false) {
        return {
            'background': isexit ? '#ff0000' : '#0640A9',
            'color': '#0640A9'
        }
    }

    onStartOrder() {
        this.currentScanState = SCAN_STATE.ssOrder;
        this.tabgroup.selectedIndex = 1;
        this.qrScanner.openUserMedia();
    }

    onStartProduct(productItemCode: string) {
        this.currentScanState = SCAN_STATE.ssProduct;
        this.tabgroup.selectedIndex = 1;
        this.currentProductItemCode = productItemCode;
        this.qrScanner.openUserMedia();
    }

    async doQRAction(qr: string) {
        switch (this.currentScanState) {
            case SCAN_STATE.ssOrder: {
                await this.onQROrderAction(qr);
                break;
            }

            case SCAN_STATE.ssProduct: {
                await this.onQRProductAction(qr);
                break;
            }
        }
    }

    async onQROrderAction(qr: string) {
        if (false && !this.isValidQR('order-info', qr)) {
            // TODO Display error
            this.tabgroup.selectedIndex = 0;
            return;
        }

        // TODO remove this
        let orderId = this.unpackQR(qr);
        let res = await this.productsTrackingService.getOrder(orderId);
        if (this.commonService.isValidResponse(res)) {
            this.currentOrder = res.order;
            this.settingsManagementService.setSettingsValue('wo', this.currentOrder.id);

            await this.loadOrderProducts();
            this.buildProductActivation();

            this.currentActionState = ACTION_STATE.asOrderActive;
            this.tabgroup.selectedIndex = 0;
        } else {
            await this.notifyManagementService.openMessageDialog('ATTENZIONE', 'Il codice dell\'ordine non è corretto.');
            this.tabgroup.selectedIndex = 0;
        }
    }

    async onQRProductAction(qr: string) {
        if (false && !this.isValidQR('product-info', qr)) {
            // TODO Display error
            this.tabgroup.selectedIndex = 0;
            return;
        }
        let orderId = this.currentOrder.id;
        let codeId = this.unpackQR(qr);

        let res = await this.productsTrackingService.activateProduct(orderId, this.currentProductItemCode, codeId);
        if (this.commonService.isValidResponse(res)) {
            await this.loadOrderProducts();
            this.buildProductActivation();

            this.tabgroup.selectedIndex = 0;
        } else {
            // TODO display error
            await this.notifyManagementService.openMessageDialog('ATTENZIONE', 'Si è verificato un errore: ' + res.reason);
        }
    }

    async onCodeResult(resultString: string) {
        if ((resultString == null) || this.scanning)
            return;

        this.scanning = true;

        await this.doQRAction(resultString);

        this.scanning = false;
    }

    async onBack() {
        this.qrScanner.closeVideoStream();

        if (this.tabgroup.selectedIndex == 1)
            this.tabgroup.selectedIndex = 0;
        else
            this.router.navigate(["home"]);
    }

    getOrderItemQuantity() {
        return this.currentOrder ? this.currentOrder.items.reduce((acc, curr) => acc += curr.qty_prod, 0) : 0;
    }

    getOrderItemActive() {
        return this.currentOrder ? this.currentOrder.items.reduce((acc, curr) => acc += (curr.status == PRODUCT_STATUS.ACTIVE) ? 1 : 0 , 0) : 0;
    }

    getOrderItemScrap() {
        return 0; // TODO ---> this.currentOrderProducts ? this.currentOrderProducts.filter(op => op.status == PRODUCT_STATUS.SCRAP).length : 0;
    }

    async onCloseOrder(askQuestion: boolean) {
        if (askQuestion) {
            let ok = await this.notifyManagementService.openConfirmDialog('Attenzione', 'Sei sicuro di voler abbandonare la lavorazione dell\'ordine?');
            if (!ok)
                return;
        }

        this.settingsManagementService.removeSettings('wo');
        this.router.navigate(["home"]);
    }
}
