import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecruitingManagementService } from 'projects/fe-common/src/lib/services/recruiting-management.service';

@Component({
  selector: 'app-add-edit-degree-dialog',
  templateUrl: './add-edit-degree-dialog.component.html',
  styleUrls: ['./add-edit-degree-dialog.component.scss']
})
export class AddEditDegreeDialogComponent implements OnInit {
  mode : string;
  degree : any;

  constructor(
    @Inject (MAT_DIALOG_DATA) data: any,
    public dialogRef : MatDialogRef<AddEditDegreeDialogComponent>,
    private recruitingManagementService: RecruitingManagementService,
  ) {
    this.mode = data.mode
    this.degree = data.degree;
   }

  ngOnInit(): void {
  }

  onCancel(){
    this.dialogRef.close(false);
  }
  onSave(){
    this.recruitingManagementService.degreeSave(this.degree).then((data: any) => {
      this.dialogRef.close(true);
    });
  }
}
