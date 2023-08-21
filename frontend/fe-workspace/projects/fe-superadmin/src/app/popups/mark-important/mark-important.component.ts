import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../components/client-management/view-client-details/view-client-details.component';
import swal from "sweetalert2";
import {NSApiService} from "../../service/NSApi.service";

@Component({
  selector: 'app-mark-important',
  templateUrl: './mark-important.component.html',
  styleUrls: ['./mark-important.component.scss']
})
export class MarkImportantComponent implements OnInit {
  markImportantList: any = [];
  markImportantListUpdated: any = [];
  peopleManagementPin = false;
  masterModulesPin = false;
  alertsPin = false;
  recruitingPin = false;
  touchPointPin = false;
  id: any;

  constructor(
    public dialogRef: MatDialogRef<MarkImportantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private api: NSApiService,
  ) {
    console.log('data>>>>>', data);
    this.markImportantList = data.list;
    this.id = data.id;
  }

  ngOnInit(): void {
    this.checkPinStatus();
  }

  checkPinStatus(): void{
    for (let i = 0; i < this.markImportantList.length; i++){
      if (this.markImportantList[i].moduleName === 'peopleManagement'){
        this.peopleManagementPin  = this.markImportantList[i].pin;
        this.markImportantListUpdated.push({moduleName: 'peopleManagement', menuName: 'People Management', pin: this.peopleManagementPin});
      }
      if (this.markImportantList[i].moduleName === 'masterModules'){
        this.masterModulesPin  = this.markImportantList[i].pin;
        this.markImportantListUpdated.push({moduleName: 'masterModules', menuName: 'Master Modules', pin: this.masterModulesPin});
      }
      if (this.markImportantList[i].moduleName === 'alerts'){
        this.alertsPin  = this.markImportantList[i].pin;
        this.markImportantListUpdated.push({moduleName: 'alerts', menuName: 'Alerts', pin: this.alertsPin});
      }
      if (this.markImportantList[i].moduleName === 'recruiting'){
        this.recruitingPin  = this.markImportantList[i].pin;
        this.markImportantListUpdated.push({moduleName: 'recruiting', menuName: 'Recruiting', pin: this.recruitingPin});
      }
      if (this.markImportantList[i].moduleName === 'touchPoint'){
        this.touchPointPin  = this.markImportantList[i].pin;
        this.markImportantListUpdated.push({moduleName: 'touchPoint', menuName: 'Touchpoint', pin: this.touchPointPin});
      }
    }
  }

  onChangeStatus(status, statusField): void{
    this.api.pinChartDashboard({companyId: this.id, moduleName: statusField, pin: status}).subscribe((res: any) => {
      /*if (res.statusCode === 200 ){
        const metaData: any = res.meta.message;
        swal.fire(
          'Success!',
          metaData,
          'success'
        );
      }*/
    }, (err: any) => {
      const e = err.error;
      swal.fire(
        'Error!',
        err.error.message,
        'info'
      );

    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveStatus(): void{
    this.dialogRef.close();
    swal.fire(
      'Success!',
      'Status Changed successfully!',
      'success'
    );
  }
}
