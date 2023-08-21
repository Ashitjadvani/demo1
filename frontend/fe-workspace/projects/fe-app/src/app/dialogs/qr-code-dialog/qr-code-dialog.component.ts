import { Component, OnInit } from '@angular/core';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Component({
  selector: 'app-qr-code-dialog',
  templateUrl: './qr-code-dialog.component.html',
  styleUrls: ['./qr-code-dialog.component.scss']
})
export class QrCodeDialogComponent implements OnInit {
    userQR: string;
    qrLevel: string = 'Q';

    constructor(private _userManagementService: UserManagementService,
        private _common: CommonService) { 

    }

    async ngOnInit() {
        let currentAccount = this._userManagementService.getAccount();
        this.userQR = this._common.getUserQrString(currentAccount.id);
    }

    onPrintQR() {
        window.print();
    }

    onSaveQR(qrcode) {
        let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
        this._common.downloadImageBase64(qrImage, 'qr-code');
    }

}
