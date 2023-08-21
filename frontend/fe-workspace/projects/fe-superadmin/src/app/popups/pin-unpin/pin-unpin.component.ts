import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/client-management/view-dashboard/view-dashboard.component';

@Component({
  selector: 'app-pin-unpin',
  templateUrl: './pin-unpin.component.html',
  styleUrls: ['./pin-unpin.component.scss']
})
export class PinUnpinComponent implements OnInit {
  imgUrl: any;
  constructor(
    public dialogRef: MatDialogRef<PinUnpinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ){
    if (data.heading){
      this.imgUrl = 'assets/images/unpin-img.svg',
      data.heading = 'Unpin Chart',
      data.message = 'Are you sure you want to Unpin this Chart?';
    }else {
      this.imgUrl = 'assets/images/pin-img.svg',
      data.heading = 'Pin Chart',
      data.message = 'Are you sure you want to Pin this Chart?';
    }
  }


  ngOnInit(): void {
  }
  onPopupClick( result: any): void {
    this.dialogRef.close(result);
  }

}
