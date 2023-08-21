import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AdminUserManagementService} from '../../../../../fe-common-v2/src/lib/services/admin-user-management.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-log-dialog-popup',
  templateUrl: './change-log-dialog-popup.component.html',
  styleUrls: ['./change-log-dialog-popup.component.scss']
})
export class ChangeLogDialogPopupComponent implements OnInit {

  id : any;
  currentPersonHistory: any = "";

  constructor(
    public dialogRef: MatDialogRef<ChangeLogDialogPopupComponent>,
    private adminUserManagementService: AdminUserManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) {
    this.id =  data.id
  }

  async ngOnInit():Promise<void> {
    let res = await this.adminUserManagementService.getPersonHistory(this.id);
    this.currentPersonHistory = res.history;
  }

  onClose(): void{
    this.dialogRef.close();
  }
  onModifyHistory(element):void{
    this.router.navigate([`people/edit-employee/` + this.id]);
    this.dialogRef.close();
  }
}
