import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccessControlGate, UserACQrCode } from 'projects/fe-common-v2/src/lib/models/access-control/models';
import { ACCESS_CONTROL_LEVEL } from 'projects/fe-common-v2/src/lib/models/person';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { AccessControlUserBadgeComponent } from '../../components/access-control/user-badge/user-badge.component';
import { DialogData } from '../../components/recruiting/job-applications/job-applications.component';
import { MCPHelperService } from '../../service/MCPHelper.service';

@Component({
  selector: 'app-user-badge-history-popup',
  templateUrl: './user-badge-history-popup.component.html',
  styleUrls: ['./user-badge-history-popup.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class UserBadgeHistoryPopupComponent implements OnInit {

  userId: string = "";
  badgeList: UserACQrCode[] = new Array();
  now: Date = new Date();
  gatesListBySite: AccessControlGate[] = new Array();

  constructor(public dialogRef: MatDialogRef<UserBadgeHistoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: AccessControlService,
    private helper: MCPHelperService,
    private common: CommonService) {
      this.helper.toggleLoaderVisibility(true);
      if(data) {
        this.userId = data.userId;
        this.gatesListBySite = data.gatesListBySite;
        this.apiService.getUserBadgesByUserId({userId: this.userId}).subscribe((res) => {
          this.badgeList = res.data;
          this.badgeList.sort((a,b) => {
            let aDate = new Date(a.codeData.startDate);
            let bDate = new Date(b.codeData.startDate)
            return bDate.getTime() - aDate.getTime();
          });
          this.helper.toggleLoaderVisibility(false);
        })
      }
  }

  ngOnInit(): void {

  }

  onClose() {
    this.dialogRef.close(null);
  }

  isExpired(end: any) {
    let endDate = new Date(end);
    return this.common.compareOnlyDateGreater(this.now, endDate);
  }

  checkGate(badge: UserACQrCode, gateId: string) {
    try {
      return badge.codeData.effectivePassagesId.find(effGateId => effGateId == gateId);
    }
    catch(e){
      return false;
    }
  }

}
