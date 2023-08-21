import { I } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { TouchPoint } from 'projects/fe-common/src/lib/models/touchpoint';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { TouchpointManagementService } from 'projects/fe-common/src/lib/services/touchpoint-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Subscription, timer } from 'rxjs';
import { TouchpointConfigDialogComponent } from './touchpoint-config-dialog/touchpoint-config-dialog.component';
import { TouchpointSettingsDialogComponent } from './touchpoint-settings-dialog/touchpoint-settings-dialog.component';

@Component({
  selector: 'app-touchpoint-page',
  templateUrl: './touchpoint-page.component.html',
  styleUrls: ['./touchpoint-page.component.scss']
})
export class TouchpointPageComponent implements OnInit, OnDestroy {
    REFRESH_INTERVAL = 60 * 1000;

    touchPointSourceItems = new MatTableDataSource<any>();
    displayedColumns = [
        'ID',
        'DeviceID',
        'Name',
        'Descr',
        'StartedAt',
        'LastKeepAlive',
        'OfficeInCount',
        'OfficeOutCount',
        'Action'
    ];
    showQR: boolean = false;
    loginQR: string;
    nameQR: string;
    qrLevel: string = 'Q';
    refreshSubscription: Subscription;

    constructor(private touchPointManagementService: TouchpointManagementService,
        private userManagementService: UserManagementService,
        public commonService: CommonService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService) {

    }

    async ngOnInit() {
        await this.loadTouchPointList();
        this.refreshSubscription = timer(this.REFRESH_INTERVAL, this.REFRESH_INTERVAL).subscribe(val => {
            this.loadTouchPointList();
        });
    }

    ngOnDestroy() {
        this.refreshSubscription.unsubscribe();
     }

    async loadTouchPointList() {
        let res = await this.touchPointManagementService.getTouchPointList();
        if (res && res.result) {
            this.touchPointSourceItems.data = res.touchPoints;
            await this.addCompanyIdToTouchpoints(res.touchPoints);
        } else {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR USERS'), this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    async addCompanyIdToTouchpoints(touchpoints: TouchPoint[]) {
        let userAccount = this.userManagementService.getAccount();
        for(let touch of touchpoints) {
            if(!touch.companyId) {
                await this.touchPointManagementService.touchPointRegister(touch.id,touch.name,touch.description,userAccount.companyId);
            }
        }
    }

    showAlert(touchPoint: TouchPoint) {
        return touchPoint.showAlert;
    }

    async onAddTouchPoint() {
        let res = await this.dialog.open(TouchpointConfigDialogComponent, {
            maxWidth: '300px',
            width: '300px',
            panelClass: 'custom-dialog-container'
        }).afterClosed().toPromise();
        if (res) {
            this.loadTouchPointList();
        }
    }

    async onSettings() {
        await this.dialog.open(TouchpointSettingsDialogComponent, {
            maxWidth: '300px',
            width: '300px',
            panelClass: 'custom-dialog-container'
        }).afterClosed().toPromise();
    }

    async onDeleteTouchPoint(tp: TouchPoint) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.DeleteTouchPoint'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            await this.touchPointManagementService.touchPointDelete(tp.id);
            await this.loadTouchPointList();
        }
    }

    onCloseLoginQR() {
        this.showQR = false;
    }

    onPrintLoginQR() {
        const printContent = document.getElementById("print-qr");
        const WindowPrt = window.open('', '', 'left=0,top=0,width=700,height=600,toolbar=0,scrollbars=0,status=0');

        let html = '<div style="display: flex; flex-direction: column; text-align: left">' +
            '<div>NuNow Irina Touchpoint: ' + this.nameQR + '</div>' +
            printContent.innerHTML +
            '</div>';

        WindowPrt.document.write(html);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    }

    onDownloadLoginQR(qrcode) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
        this.commonService.downloadImageBase64(qrImage, this.nameQR);
    }

    async onShowLoginQR(tp: TouchPoint) {
        this.showQR = true;
        this.nameQR = tp.name + '-' + tp.description;
        // this.loginQR = window.location.protocol + '//' + window.location.host + '/login?u=TOUCHPOINTID\\' + tp.id;
        this.loginQR = window.location.protocol + '//' + window.location.host + '/touchpoint/' + tp.id;
    }

    async onUnlockPairing (tp: TouchPoint) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('INSIGHTS_PEOPLE_PAGE.Unlock Touchpoint Pairing'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            await this.touchPointManagementService.touchPointUnlockPairing(tp.id);
            await this.loadTouchPointList();
        }
    }
}
