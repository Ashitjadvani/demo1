import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CameraType, QrScannerComponent } from 'projects/fe-common/src/lib/components/qr-scanner/qr-scanner.component';
import { Order, PRODUCT_STATUS } from 'projects/fe-common/src/lib/models/product-tracking/products-tracking';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { ProductsTrackingService } from 'projects/fe-common/src/lib/services/products-tracking.service';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { ProductTrackingActionSheetComponent, UIMode } from '../product-tracking-action-sheet/product-tracking-action-sheet.component';

@Component({
    selector: 'app-scan-product-qa',
    templateUrl: './scan-product-qa.component.html',
    styleUrls: ['./scan-product-qa.component.scss']
})
export class ScanProductQaComponent implements OnInit {
    @ViewChild('scanner') qrScanner: QrScannerComponent;

    scanning: boolean = false;
    currentCamera: CameraType = CameraType.Back;

    currentOrder: Order;

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

    ngOnInit() {

    }

    unpackQR(data: string) {
        let split = data.split('/');
        if (split.length < 1)
            return null;
        return split[split.length - 1];
    }

    async handleQualityCheckAction(codeId: string, newProductStatus: PRODUCT_STATUS) {
        console.log('handleQualityCheckAction: ', codeId, newProductStatus);
        if (newProductStatus == PRODUCT_STATUS.QUALITY_CHECK_OK) {
            let res = await this.productsTrackingService.updateProductOperationLog(codeId, PRODUCT_STATUS.QUALITY_CHECK_OK);
            if (this.commonService.isValidResponse(res)) {
                this.onBack();
            }
        } else {
            let res = await this.productsTrackingService.updateProductStatus(codeId, newProductStatus);
            if (this.commonService.isValidResponse(res)) {
                this.onBack();
            }
        }

    }

    async onQRProductAction(qr: string) {
        let codeId = this.unpackQR(qr);

        let res = await this.productsTrackingService.getProductByCode(codeId);
        if (this.commonService.isValidResponse(res)) {

            let bottomSheetRef = this.bottomSheet.open(ProductTrackingActionSheetComponent, {
                data: {
                    mode: UIMode.QA,
                    order: res.order,
                    productItem: res.product,
                    doneEvent: this.handleQualityCheckAction.bind(this)
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
