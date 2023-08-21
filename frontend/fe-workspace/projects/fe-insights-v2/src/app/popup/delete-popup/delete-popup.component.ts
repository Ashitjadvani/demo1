import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/recruiting/job-applications/job-applications.component';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit {
    isActiveStatus = false;
    isDeactiveStatus = false;
    constructor(
      public dialogRef: MatDialogRef<DeletePopupComponent>,
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
