import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/dashboard/dashboard.component';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DeletePopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      }
    
      ngOnInit(): void {
      }
    
      onNoClick(com: any): void {
        this.dialogRef.close(com);
      }
    
}
