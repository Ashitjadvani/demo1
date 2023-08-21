import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  activityLogList:any = []
  noRecordFound:boolean = false;
  result:any;
  constructor(private Api: ApiService,) { }

  ngOnInit(): void {
    this.getActivityList();
    this.searching();
  }

  getActivityList(){
    this.Api.getActivityLogList({supplierId : localStorage.getItem('NPLoginId'), isProcurement : true}).subscribe((res:any)=>{
      this.activityLogList = res.data;
      this.result = this.activityLogList
      this.searching()
    });
  }
  searching(){
    if(this.activityLogList.length <= 0){
      this.noRecordFound = true;
    }else{
      this.noRecordFound = false;
    }
  }



  activityLogListDisplayedColumns: string[] = ['title', 'date'];

}
