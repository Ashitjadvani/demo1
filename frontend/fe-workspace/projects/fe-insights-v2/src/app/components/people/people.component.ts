import { Component, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';
import { DeletePopupComponent } from '../../popup/delete-popup/delete-popup.component';
import {Company, Scope} from '../../../../../fe-common-v2/src/lib/models/company';
import {Person} from '../../../../../fe-common-v2/src/lib/models/person';
import {AdminUserManagementService} from '../../../../../fe-common-v2/src/lib/services/admin-user-management.service';
import {UserManagementService} from '../../../../../fe-common-v2/src/lib/services/user-management.service';
import {CommonService} from '../../../../../fe-common-v2/src/lib/services/common.service';
import {UserCapabilityService} from '../../service/user-capability.service';
import {MCPHelperService} from "../../service/MCPHelper.service";
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ActivatedRoute} from "@angular/router";


// Delete popup Dialog data
export interface DialogData {
  message: any;
  heading: any;
}


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  selectedIndex: any;
  tabIndex: any =  1;
  // page = 1;
  // itemsPerPage = 5;
  // public config: PaginationInstance = {
  //   id: 'advanced',
  //   itemsPerPage: 5,
  //   currentPage: this.page

  // };


  currentCompany: Company = new Company();
  userAccount: Person;
  scopesAvailable: Scope[];
  breadcrumb: any;
  public employees_data = [
    // {Name: 'Alice', Surname: 'Alli', Area: 'Marketing & Communication', JobTitle: 'Mark & Com', Role: 'Clerk', empStatus: 'Active' },
    // {Name: 'Patrizia', Surname: 'Ammirati', Area: 'Marketing & Communication', JobTitle: 'Mark & Com', Role: 'Clerk', empStatus: 'Inactive' },
    // {Name: 'Maria Angela', Surname: 'Argentieri', Area: 'Active Invoicing', JobTitle: 'Accounting', Role: 'Clerk', empStatus: 'Active' },
    // {Name: 'Sara', Surname: 'Avanzo', Area: 'Secretariat', JobTitle: 'Ass. Secretariat', Role: 'Clerk', empStatus: 'Inactive' },
    // {Name: 'Giulia', Surname: 'Bacchetti', Area: 'Travel Office', JobTitle: 'Ass. Travel Office', Role: 'Clerk', empStatus: 'Active' },
    // {Name: 'Silvia Daniela', Surname: 'Barbieri', Area: 'Library', JobTitle: 'Ass. Secretariat', Role: 'Clerk', empStatus: 'Inactive' },
    // {Name: 'Alessia', Surname: 'Bevacqua', Area: 'General Accounting', JobTitle: 'Accounting', Role: 'Clerk', empStatus: 'Active' }

  ];
  public users_data = [
    // {Name: 'Irina', Surname: 'Developer', Area: 'Marketing & Communication', JobTitle: 'Mark & Com', Role: 'Clerk', empStatus: 'Active' },
    // {Name: 'MQOS', Surname: 'MultiQOS', Area: 'Active Invoicing', JobTitle: 'Accounting', Role: 'Clerk', empStatus: 'Inactive' },
    // {Name: 'Irina', Surname: 'Developer', Area: 'Marketing & Communication', JobTitle: 'Mark & Com', Role: 'Clerk', empStatus: 'Active' },
    // {Name: 'MQOS', Surname: 'MultiQOS', Area: 'Active Invoicing', JobTitle: 'Accounting', Role: 'Clerk', empStatus: 'Inactive' },
    // {Name: 'Irina', Surname: 'Developer', Area: 'Marketing & Communication', JobTitle: 'Mark & Com', Role: 'Clerk', empStatus: 'Active' },
    // {Name: 'MQOS', Surname: 'MultiQOS', Area: 'Active Invoicing', JobTitle: 'Accounting', Role: 'Clerk', empStatus: 'Inactive' },
    // {Name: 'Irina', Surname: 'Developer', Area: 'Marketing & Communication', JobTitle: 'Mark & Com', Role: 'Clerk', empStatus: 'Active' }

  ];
  employeesDisplayedColumns: string[] = ['check', 'Name', 'Surname', 'Area', 'JobTitle', 'Role', 'empStatus', 'viewDetails', 'action'];
  usersDisplayedColumns: string[] = ['check', 'Name', 'Surname', 'Area', 'JobTitle', 'Role', 'empStatus', 'viewDetails', 'action'];

  constructor(public dialog: MatDialog,
              private adminUserManagementService: AdminUserManagementService,
              private userManagementService: UserManagementService,
              private commonService: CommonService,
              private userCapabilityService: UserCapabilityService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private activatedRoute: ActivatedRoute) {
  }


  public filter: any;
  public selectedRow: any = [];

  onKeyUp(xyz: any){}

  async ngOnInit(): Promise<void> {

    this.scopesAvailable = new Array();
    this.userAccount = this.userManagementService.getAccount();

    await this.loadCompany();
    for (const scope of this.currentCompany.scopes) {
      if (this.userCapabilityService.isFunctionAvailable('People/' + scope.name)) {    this.scopesAvailable.push(scope); }
    }
    const selectedIndex : any = localStorage.getItem('Peopleindex');
    this.selectedIndex = JSON.parse(selectedIndex);
    //console.log('this.selectedIndex', this.selectedIndex);
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.tab) {
        this.selectedIndex = params.tab;
        localStorage.setItem('Peopleindex', params.tab);
        // console.log('localStorage.setItem Peopleindex, params.tab)', localStorage.setItem('Peopleindex', params.tab))
      }
    });
  }

  async loadCompany(): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    let res = await this.adminUserManagementService.getCompany(this.userAccount.companyId);
    if (this.commonService.isValidResponse(res)) {
      this.currentCompany = res.company;
      this.helper.toggleLoaderVisibility(false);
    }else {
      this.helper.toggleLoaderVisibility(false);
      // const e = err.error;
      swal.fire(
        '',
        // err.error.message,
        this.translate.instant(res.reason),
        'info'
      );
      this.helper.toggleLoaderVisibility(false);
    }
    this.helper.toggleLoaderVisibility(false);
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this people?', heading: 'Delete People'}
    });
  }
  selectedTabValue(event: MatTabChangeEvent){
    let scopeValue = this.scopesAvailable.find(x => x.name == event.tab.textLabel);
    this.breadcrumb = event.tab.textLabel;
    // this.tabIndex = event.index;
    localStorage.setItem('ScopeValue', JSON.stringify(scopeValue));
      // this.handleMatTabChange(event);
  }
  handleMatTabChange(event: MatTabChangeEvent) {
    // this.breadcrumb = event.tab.textLabel;
    // // this.tabIndex = event.index;
    // this.selectedIndex = event.index;
    // localStorage.setItem('Peopleindex', event.index.toString());
    this.tabIndex = event.index;
    localStorage.setItem('Peopleindex', event.index.toString());
  }

  ngAfterViewInit() {
    let index = localStorage.getItem('Peopleindex') || 1; // get stored number or zero if there is nothing stored
    this.selectedIndex = index; // with tabGroup being the MatTabGroup accessed through ViewChild
  }

}
