import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {RecruitingManagementService} from "fe-common/services/recruiting-management.service";

@Component({
  selector: 'app-add-edit-university-dialog',
  templateUrl: './add-edit-university-dialog.component.html',
  styleUrls: ['./add-edit-university-dialog.component.scss']
})
export class AddEditUniversityDialogComponent implements OnInit {
  mode: string = "Add";
  university : any;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    public dialogRef: MatDialogRef<AddEditUniversityDialogComponent>,
    private recruitingManagementService: RecruitingManagementService,
  ) {
    this.mode = data.mode;
    this.university = data.university;
  }

  ngOnInit(): void {
  }

  onCancel(){
    this.dialogRef.close(false);
  }

  onSave(){
    this.recruitingManagementService.universitySave(this.university).then((data: any) => {
      this.dialogRef.close(true);
    });
  }
}
