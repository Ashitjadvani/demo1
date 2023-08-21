import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/recruiting/job-applications/job-applications.component';

@Component({
  selector: 'app-cancel-popup',
  templateUrl: './cancel-popup.component.html',
  styleUrls: ['./cancel-popup.component.scss']
})
export class CancelPopupComponent implements OnInit {
    isActiveStatus = false;
    isDeactiveStatus = false;
    constructor(
      public dialogRef: MatDialogRef<CancelPopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      if (data.statusNameType === 'active'){
        this.isActiveStatus = true;
      }
      if (data.statusNameType === 'deactive'){
        this.isDeactiveStatus = true;
      }
    }

  ngOnInit(): void {
  }

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

}
