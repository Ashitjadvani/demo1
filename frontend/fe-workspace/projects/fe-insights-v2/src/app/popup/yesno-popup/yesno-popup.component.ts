import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/recruiting/job-applications/job-applications.component';

@Component({
  selector: 'app-yesno-popup',
  templateUrl: './yesno-popup.component.html',
  styleUrls: ['./yesno-popup.component.scss']
})
export class YesNoPopupComponent implements OnInit {

  title: string = "";
  message1: string = "";
  message2: string = "";
  icon: string = "";
  image: string = "";

  constructor(public dialogRef: MatDialogRef<YesNoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(data) {
        this.title = data.title;
        this.message1 = data.message1;
        this.message2 = data.message2;
        this.icon = data.icon;
        this.image = data.image;
      }
  }

  ngOnInit(): void {

  }

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

  onConfirmClick() {
    this.dialogRef.close(true);
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }

}
