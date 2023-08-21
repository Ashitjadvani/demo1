import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/dashboard/dashboard.component';
import {ConfirmDialogData} from "../../../../../fe-common-v2/src/lib/dialogs/confirm-dialog/confirm-dialog.component";

// export class ConfirmDialogData {
//   title: string;
//   message: string;
//   confirmButtonText: string;
//   cancelButtonText: string;
//
//   constructor(title, message, confirmButtonText, cancelButtonText) {
//     this.title = title;
//     this.message = message;
//     this.confirmButtonText = confirmButtonText;
//     this.cancelButtonText = cancelButtonText;
//   }
// }

@Component({
  selector: 'app-unlock-pairing-dialog',
  templateUrl: './unlock-pairing-dialog.component.html',
  styleUrls: ['./unlock-pairing-dialog.component.scss']
})
export class UnlockPairingDialogComponent implements OnInit {
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;

  constructor(public dialogRef: MatDialogRef<UnlockPairingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.heading;
    this.message = data.message;
    this.confirmButtonText = data.confirmButtonText;
    this.cancelButtonText = data.cancelButtonText;
  }

  ngOnInit(): void {
  }

  onClick(result): void{
    this.dialogRef.close(result);
  }

}
