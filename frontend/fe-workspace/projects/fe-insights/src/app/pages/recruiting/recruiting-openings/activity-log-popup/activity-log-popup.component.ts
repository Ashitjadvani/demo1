import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { RecruitingManagementService } from 'projects/fe-common/src/lib/services/recruiting-management.service';

export interface PeriodicElement {
  date: any;
  author: any;
  changes: any;
}


@Component({
  selector: 'app-activity-log-popup',
  templateUrl: './activity-log-popup.component.html',
  styles: [
  ]
})

export class ActivityLogPopupComponent implements OnInit {

  displayedColumns: string[] = ['date', 'author', 'description'];
  dataSource = [];

  constructor(private recruitingManagementService: RecruitingManagementService,
              @Inject(MAT_DIALOG_DATA) public logData: any,
              public dialogRef: MatDialogRef<ActivityLogPopupComponent>,
              ) {
    this.recruitingManagementService.getHistoryList({type_id:  this.logData.id}).then( (data: any) => {
      this.dataSource = data.data;
    });
  }

  ngOnInit(): void {
  }

   onNoClick(): void {
    this.dialogRef.close();
  }

}
