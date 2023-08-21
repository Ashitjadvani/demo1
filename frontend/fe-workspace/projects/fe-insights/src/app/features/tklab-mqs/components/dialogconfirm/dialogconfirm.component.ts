import {Component, OnInit, ChangeDetectionStrategy, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'tkl-dialogconfirm',
  templateUrl: './dialogconfirm.component.html',
  styleUrls: ['./dialogconfirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogconfirmComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogconfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit() {
  }

  onNoClick():void{
    this.dialogRef.close()
  }

}
