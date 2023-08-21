import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { DialogData } from '../../components/recruiting/job-applications/job-applications.component';

@Component({
  selector: 'app-access-control-badge-filter-popup',
  templateUrl: './access-control-badge-filter-popup.component.html',
  styleUrls: ['./access-control-badge-filter-popup.component.scss']
})
export class AccessControlBadgeFilterPopupComponent implements OnInit {

  selectedGroupId: string = null;
  getOnlyActive: boolean = true;
  groups = new Array();
  companyId: string = "";

  constructor(public dialogRef: MatDialogRef<AccessControlBadgeFilterPopupComponent>,
    private apiServices: AccessControlService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(data) {
        if(data.selectedGroupId) this.selectedGroupId = data.selectedGroupId;
        if(data.getOnlyActive != null) this.getOnlyActive = data.getOnlyActive;
      }
  }

  async ngOnInit() {const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
    this.apiServices.getFullCompanyGatesGroupsList(this.companyId).subscribe((res) => {
      if(res.data) {
        this.groups = res.data;
        this.groups.sort((a, b) => a.name.localeCompare(b.name));
      }
    });
  }

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

  onConfirmClick() {
    let res = {
      selectedGroupId: this.selectedGroupId,
      onlyActive: this.getOnlyActive
    }
    this.dialogRef.close(res);
  }

  onCancelClick() {
    this.dialogRef.close(null);
  }

}
