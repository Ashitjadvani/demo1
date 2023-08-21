import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/recruiting/job-applications/job-applications.component';

@Component({
  selector: 'app-block-popup',
  templateUrl: './block-popup.component.html',
  styleUrls: ['./block-popup.component.scss']
})
export class BlockPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BlockPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

}
