import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import {RecrutingJobOpeningManagementService} from '../../../../../../fe-common-v2/src/lib/services/recruting-job-opening-management.service';
import {RecrutingJobOpeningManagementService} from '../../../../../fe-common-v2/src/lib/services/recruting-job-opening-management.service';

@Component({
  selector: 'app-see-log',
  templateUrl: './see-log.component.html',
  styleUrls: ['./see-log.component.scss']
})
export class SeeLogComponent implements OnInit {

  seeLogTableData = [];

  constructor(public dialogRef: MatDialogRef<SeeLogComponent>,
    private ApiService: RecrutingJobOpeningManagementService,
    @Inject(MAT_DIALOG_DATA) public logData: any,
    ) {
      this.ApiService.getHistoryList({type_id:  this.logData.id}).then( (data: any) => {
        this.seeLogTableData = data.data;
      });
  }

  ngOnInit(): void {
  }

  seeLogDisplayedColumns: string[] = ['date', 'author', 'description'];

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }


}
