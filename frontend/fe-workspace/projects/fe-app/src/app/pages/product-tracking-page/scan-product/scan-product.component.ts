import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Plan, PlanItem } from 'projects/fe-common-v2/src/lib/models/product-tracking/products-tracking';
import { QrScannerComponent, CameraType } from 'projects/fe-common/src/lib/components/qr-scanner/qr-scanner.component';
import { ITEM_STATUS, Order, Product, PRODUCT_STATUS } from 'projects/fe-common/src/lib/models/product-tracking/products-tracking';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { ProductsTrackingService } from 'projects/fe-common/src/lib/services/products-tracking.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { ProductTrackingActionSheetComponent, UIMode } from '../product-tracking-action-sheet/product-tracking-action-sheet.component';

@Component({
    selector: 'app-scan-product',
    templateUrl: './scan-product.component.html',
    styleUrls: ['./scan-product.component.scss']
})
export class ScanProductComponent implements OnInit {
    @ViewChild('scanner') qrScanner: QrScannerComponent;

    scanning: boolean = false;
    currentCamera: CameraType = CameraType.Back;
    
    currentOrder: Plan;
    currentProduct: PlanItem;

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

    ngOnInit(): void {
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

    async handleTrackingAction(codeId: string, newProductStatus: PRODUCT_STATUS) {
        console.log('handleTrackingAction: ', codeId, newProductStatus);
        let res = await this.productsTrackingService.updateProductStatus(codeId, newProductStatus);
        if (this.commonService.isValidResponse(res)) {
            this.onBack();
        }
    }

    async onQRProductAction(qr: string) {
        if (false && !this.isValidQR('product-info', qr)) {
            // TODO Display error
            return;
        }
        let codeId = this.unpackQR(qr);
        
        let res = await this.productsTrackingService.getProductByCode(codeId);
        if (this.commonService.isValidResponse(res)) {
            this.currentOrder = res.order;
            this.currentProduct = res.product;

            let bottomSheetRef = this.bottomSheet.open(ProductTrackingActionSheetComponent, {
                data: {
                    mode: UIMode.Tracking,
                    order: this.currentOrder,
                    productItem: this.currentProduct,
                    doneEvent: this.handleTrackingAction.bind(this)
                },
                panelClass: 'bottom-sheet'
            });

            bottomSheetRef.afterDismissed().subscribe(() => {
                this.qrScanner.openUserMedia();
                this.scanning = false;
            });
        } else {
            await this.notifyManagementService.openMessageDialog('ATTENZIONE', 'Questo prodotto non è ancora stato attivato.');        
            this.onBack();   
        }
    }

    async onCodeResult(resultString: string) {
        if ((resultString == null) || this.scanning)
            return;

        this.scanning = true;
        await this.onQRProductAction(resultString);
        this.scanning = false;
    }

    async onBack() {
        this.qrScanner.closeVideoStream();
        this.router.navigate(["home"]);
    }
}
