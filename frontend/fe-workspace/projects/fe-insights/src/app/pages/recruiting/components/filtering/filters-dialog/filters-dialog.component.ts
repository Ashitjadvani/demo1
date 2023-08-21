import { Component, Inject, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import { RecruitingApplicationManagementService } from 'projects/fe-common/src/lib/services/recruiting-application-management.service';
import { HelperService } from 'projects/fe-procurement/src/app/service/helper.service';
import { CareerHelperService } from 'projects/fe-career/src/app/service/careerHelper.service';


@Component({
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss']
})
export class FiltersDialogMqsComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  _filterForm: FormGroup;
  formConfig: any;
  jobId: any = null;
  applicationTableData: any = [];
  showUnreadApp = false;
  constructor(public dialogRef: MatDialogRef<FiltersDialogMqsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { filters: any },
              public fb: FormBuilder,
              private recruitingManagementApplicationService: RecruitingApplicationManagementService) {
  }

  ngOnInit(): void {
    this.processColumns();
    this.unReadApp()
  }

  unReadApp(){
    if(CareerHelperService.filterApplicationStatus ===  'unread'){
      this.showUnreadApp = true;
    }else{
      this.showUnreadApp = false;
    }
  }
  async showUnread(showUnreadApp) {
    if (showUnreadApp.checked){
      CareerHelperService.filterApplicationStatus =  'unread'
      //const jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationList({ jobId: this.jobId, applicationStatus : 'unread'});
      //this.applicationTableData = jobsTableData.data;

      this.showUnreadApp = true
    }else {
      CareerHelperService.filterApplicationStatus =  'all'
     // const jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationList({ jobId: this.jobId, applicationStatus : 'all'});
      //this.applicationTableData = jobsTableData.data;
      this.showUnreadApp = false
    }
  }

  public get availableFilters(): any {
    return this.data.filters.filter(item => item.filterWidget);
  }

  processColumns(): void {
    this.formConfig = {};
    for (const col of this.availableFilters) {
      if (col.columnDataField === '') {
        continue;
      }
      this.formConfig[col.columnDataField] = [col.filterValue, []];
    }
    this._filterForm = this.fb.group(this.formConfig);
  }

}

@Pipe({
  name: 'myOpenfilter',
  pure: false
})
export class MyOpenFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return [];
    }

    return items.filter(item => item.scopes.includes(filter));
  }
}
