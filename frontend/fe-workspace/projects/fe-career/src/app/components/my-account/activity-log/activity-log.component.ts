import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CareerHelperService} from "../../../service/careerHelper.service";
import {Router} from "@angular/router";
import { CareerApiService } from '../../../service/careerApi.service';
import swal  from 'sweetalert2';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  logintype = "";
  authUser:any={};
  type:any;
  public current_page = 0;
  public per_page = 10;
  public total = 0;
  public limit = 10;
  public requestPara = {};
  loadData: any = true;
  public filter: any;
  private subject: Subject<string> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  userDetails: any;
  constructor(
    private apiService: CareerApiService,
    private router: Router,
    private helper: CareerHelperService) {
    let authUser: any = localStorage.getItem('loggedInUser');
    if (authUser) {
      this.authUser = JSON.parse(authUser);
      this.logintype=this.authUser.user.user.type;
    }
  }
  displayedColumns: string[] = ['Title',  'Date', ];
  dataSource: any =  new MatTableDataSource([]);

  ngOnInit(): void {
    this.helper.toggleSidebarVisibility(false);
    this.apiService.getUserdetail().subscribe((data: any) => {
      this.userDetails = data.user.type;
    });

    this.listActivityLog({ page: 1, limit: 10 });
    this.subject.pipe(debounceTime(500)).subscribe(searchTextValue => {
      this.loadData = true;
      this.applyFilter(searchTextValue);
    });

    

  }

  onKeyUp(event: any){
    this.current_page = 1;
    this.subject.next(event.target.value);
    
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
    }
    this.filter = filterValue;
    this.dataSource.data = [];
    this.requestPara = {
      searchKey: filterValue,
      limit: this.limit,
      page: this.current_page,
    };
    this.listActivityLog(this.requestPara);
  }

  listActivityLog(req: any): any {
    if (this.loadData){
      this.helper.toggleSidebarVisibility(true);
      this.apiService.listActivityLog(req).subscribe((data: any) => {
        this.helper.toggleSidebarVisibility(false);
        const totalRecords = data.totalRecords ? data.totalRecords : 0;
        this.dataSource = data.data;
        this.total = totalRecords;
      }, err => {
        this.helper.toggleSidebarVisibility(false);
      });
    }
  }

  logout() {
    CareerHelperService.onLogOut();
    this.router.navigate(['/login']);
  }

  handlePage(event: any): void {
    this.current_page = event;
    this.requestPara = {
      searchKey: this.filter,
      page: this.current_page,
      limit: this.limit,
    };
    this.listActivityLog(this.requestPara);
  }
}
