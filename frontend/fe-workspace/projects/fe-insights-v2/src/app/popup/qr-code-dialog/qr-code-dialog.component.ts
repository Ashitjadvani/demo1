import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/dashboard/dashboard.component';
import {TouchPoint} from "../../../../../fe-common-v2/src/lib/models/touchpoint";
import {CommonService} from "../../../../../fe-common-v2/src/lib/services/common.service";




@Component({
  selector: 'app-qr-code-dialog',
  templateUrl: './qr-code-dialog.component.html',
  styleUrls: ['./qr-code-dialog.component.scss']
})
export class QrCodeDialogComponent implements OnInit {
  showQR: boolean = false;
  loginQR: string;
  nameQR: string;
  qrLevel: string = 'Q';

  constructor(public dialogRef: MatDialogRef<QrCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
              public commonService: CommonService) {
  }

  ngOnInit(): void {
    const tp: any = TouchPoint;
    console.log('tp', tp);
    this.showQR = true;
    this.nameQR = tp.name + '-' + tp.description;
    // this.loginQR = window.location.protocol + '//' + window.location.host + '/login?u=TOUCHPOINTID\\' + tp.id;
    this.loginQR = window.location.protocol + '//' + window.location.host + '/touchpoint/' + this.data.id;
  }

  onClick(result): void{
    this.dialogRef.close(result);
  }
   onShowLoginQR(tp: TouchPoint) {
    this.showQR = true;
    this.nameQR = tp.name + '-' + tp.description;
    // this.loginQR = window.location.protocol + '//' + window.location.host + '/login?u=TOUCHPOINTID\\' + tp.id;
    this.loginQR = window.location.protocol + '//' + window.location.host + '/touchpoint/' + tp.id;
  }
  onCloseLoginQR() {
    this.showQR = false;
    this.dialogRef.close(this.showQR);
  }
  onDownloadLoginQR(qrcode) {
    this.nameQR = this.data.site +'-'+ this.data.discription;
    let qrImage = qrcode.elementRef.nativeElement.querySelector("img").src;
    this.commonService.downloadImageBase64(qrImage, this.nameQR);
  }
}
