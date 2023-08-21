import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../popup/delete-popup/delete-popup.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PeopleManagementService } from '../../../../../fe-common-v2/src/lib/services/people-management.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Scope } from '../../../../../fe-common-v2/src/lib/models/company';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { MCPHelperService } from '../../service/MCPHelper.service';
import { TranslateService } from '@ngx-translate/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SelectionModel } from '@angular/cdk/collections';

export interface DialogData {
  message: any;
  heading: any;
}

@Component({
  selector: 'app-people-management',
  templateUrl: './people-management.component.html',
  styleUrls: ['./people-management.component.scss'],
})
export class PeopleManagementComponent implements OnInit {
  areaList: any = new MatTableDataSource([]);
  roleList: any = new MatTableDataSource([]);
  jobTitle: any = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  selectionR = new SelectionModel<any>(true, []);
  selectionJ = new SelectionModel<any>(true, []);
  navTitle: string = 'PEOPLE_MANAGEMENT.Areas'
  public requestPara = {
    search: '',
    page: 1,
    limit: 10,
    sortBy: '-1',
    sortKey: '',
  };
  public requestParaR = {
    search: '',
    page: 1,
    limit: 10,
    sortBy: '-1',
    sortKey: '',
  };
  public requestParaJ = {
    search: '',
    page: 1,
    limit: 10,
    sortBy: '-1',
    sortKey: '',
  };
  @Input() scope: Scope;
  public filter: any;
  private subject: Subject<string> = new Subject();
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  searchArea: any = '';
  sortBy: any = '-1';
  sortKey = null;
  sortClass: any = 'down';
  noRecordFound = false;

  private subjectR: Subject<string> = new Subject();
  pageR: any = 1;
  itemsPerPageR: any = '10';
  totalItemsR: any = 0;
  limitR: any = 10;
  searchRole: any = '';
  sortByR: any = '-1';
  sortKeyR = null;
  sortClassR: any = 'down';
  noRecordFoundR = false;

  private subjectJ: Subject<string> = new Subject();
  pageJ: any = 1;
  itemsPerPageJ: any = '10';
  totalItemsJ: any = 0;
  limitJ: any = 10;
  searchJob: any = '';
  sortByJ: any = '-1';
  sortKeyJ = null;
  sortClassJ: any = 'down';
  noRecordFoundJ = false;
  areaDisplayedColumns: string[] = ['select','wheelAction',
    //'action',
    'AreaName',
    'Scope',
    'Created at',
    'Updated at',
    //'viewDetails',
  ];
  resultsLength = 0;
  roleDisplayedColumns: string[] = [
    'select',
    'wheelAction',
    'RoleName',
    //'action'
  ];
  jobTitleDisplayedColumns: string[] = [
    'select',
    'wheelAction',
    'JobTitleName',
    //'action'
  ];
  selectedIndex: any;
  tabIndex: any = 0;
  sidebarMenuName:string;
  @ViewChild('table') table: MatTable<any>;
  @ViewChild('table2') table2: MatTable<any>;
  @ViewChild('table3') table3: MatTable<any>;
  constructor(
    public dialog: MatDialog,
    private ApiServices: PeopleManagementService,
    private router: Router,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private activatedRoute : ActivatedRoute,
  ) {
    this._setSearchSubscription();
    this._setSearchSubscriptionR();
    this._setSearchSubscriptionJ();
  }

  async ngOnInit(): Promise<void> {
    this.sideMenuName();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.tab) {
        this.selectedIndex = params.tab;
        localStorage.setItem('peopleManagementTabLocation', params.tab);
      }
    });
    await this.getArea(this.requestPara);
    await this.getRole(this.requestParaR);
    await this.getJob(this.requestParaJ);
    //this.ngAfterViewInit();
  }

  sideMenuName(){
    this.sidebarMenuName = 'People Management';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getArea(request): Promise<void> {
    this.ApiServices.getAllArea(this.requestPara).subscribe((res: any) => {
      this.areaList = res.data;
      this.noRecordFound = this.areaList.length > 0;
      this.totalItems = res.meta.totalCount;
    });
  }
  async getRole(request): Promise<void> {
    this.ApiServices.getAllRoll(this.requestParaR).subscribe((res: any) => {
      this.roleList = res.data;
      this.noRecordFoundR = this.roleList.length > 0;
      this.totalItemsR = res.meta.totalCount;
    });
  }

  async getJob(request): Promise<void> {
    this.ApiServices.getJobTitle(this.requestParaJ).subscribe((res: any) => {
      this.jobTitle = res.data;
      this.noRecordFoundJ = this.jobTitle.length > 0;
      this.totalItemsJ = res.meta.totalCount;
    });
  }

  onKeyUp(searchTextValue: any): void {
    this.subject.next(searchTextValue);
  }
  private _setSearchSubscription(): void {
    this.subject.pipe(debounceTime(500)).subscribe((searchValue: string) => {
      this.page = 1;
      this.selection.clear();
      this.getArea(
        (this.requestPara = {
          page: 1,
          limit: this.limit,
          search: this.searchArea,
          sortBy: this.sortBy,
          sortKey: this.sortKey
        })
      );
    });
  }
  // Sorting
  changeSorting(sortKey, sortBy): void {
    this.sortKey = sortKey;
    this.sortBy = sortBy === '-1' ? '1' : '-1';
    this.page = 1;
    this.selection.clear();
    this.getArea(
      (this.requestPara = {
        page: 1,
        limit: this.limit,
        search: this.searchArea,
        sortBy: this.sortBy,
        sortKey: this.sortKey
      })
    );
  }
  // Pagination
  changeItemsPerPage(event): void {
    this.page = 1;
    this.itemsPerPage = event
    this.selection.clear();
    this.getArea(
      (this.requestPara = {
        page: 1,
        limit: this.itemsPerPage,
        search: this.searchArea,
        sortBy: this.sortBy,
        sortKey: this.sortKey
      })
    );
    this.limit = this.itemsPerPage;
  }

  // Pagination
  pageChanged(page): void {
    this.selection.clear();
    this.getArea(
      (this.requestPara = {
        page,
        limit: this.itemsPerPage,
        search: this.searchArea,
        sortBy: this.sortBy,
        sortKey: this.sortKey
      })
    );
    this.page = page;
  }

  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearchA() {
    this.searchArea = '';
    this.selection.clear();
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    this.getArea(
      (this.requestPara = {
        page: 1,
        limit: this.limit,
        search: '',
        sortBy: this.sortBy,
        sortKey: this.sortKey
      })
    );
  }

  openAreaDeleteDialog(event): void {
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'PEOPLE_MANAGEMENT.Are you sure you want to delete this Area ?',
        heading: 'Delete Area',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.helper.toggleLoaderVisibility(true);
        that.ApiServices.deleteArea(event.name).then(
          (data: any) => {
            const metaData: any = data.reason;
            if(data.result){
              this.getArea(this.requestPara);
              this.selectionR.clear();
              swal.fire(
                '',
                this.translate.instant(
                  'Swal_Message.AreaHasBeenDeletedSuccessfully'
                ),
                'success'
              );
              this.helper.toggleLoaderVisibility(false);
              if((this.areaList.length - 1) == 0){
                let pageNumber = this.page - 1 
                this.pageChanged(pageNumber)
                // that.getRole(this.requestParaR);
                this.table3.renderRows();
              }
              else{
                that.getArea(this.requestPara);
              }
            }else{
              swal.fire('', this.translate.instant(data.reason), 'info');
              that.getArea(this.requestPara);
              this.helper.toggleLoaderVisibility(false);
            }
          },
          (err) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire('', this.translate.instant(err.error.message), 'info');
          }
        );
        this.selection.clear();
      }
    });
  }
  // edit
  editArea(event): void {
    this.router.navigate([`people-management/add-edit-areas/` + event.name], {
      queryParams: { id: event.id },
      skipLocationChange: true,
    });
  }
  // View Detail Area
  viewDetail(event): void {
    this.router.navigate([`people-management/view-area-details/` + event.id], { queryParams: { name: event.name }, skipLocationChange: true });
  }
  // editArea(areaName: string): void {
  //   this.router.navigate([`people-management/add-edit-areas` + areaName], { queryParams: this.id, skipLocationChange: true});
  // }
  // ===================================================

  onKeyUpR(searchTextValue: any): void {
    this.subjectR.next(searchTextValue);
  }
  private _setSearchSubscriptionR(): void {
    this.subjectR.pipe(debounceTime(500)).subscribe((searchValue: string) => {
      this.pageR = 1;
      this.selectionR.clear();
      this.getRole(
        (this.requestParaR = {
          page: 1,
          limit: this.limitR,
          search: this.searchRole,
          sortBy: this.sortByR,
          sortKey: this.sortKeyR
        })
      );
    });
  }
  // Sorting
  changeSortingR(sortKey, sortBy): void {
    this.sortKeyR = sortKey;
    this.sortByR = sortBy === '-1' ? '1' : '-1';
    this.pageR = 1;
    this.selectionR.clear();
    this.getRole(
      (this.requestParaR = {
        page: 1,
        limit: this.limitR,
        search: this.searchRole,
        sortBy: this.sortByR,
        sortKey: this.sortKeyR
      })
    );
  }
  // Pagination
  changeItemsPerPageR(event): void {
    this.pageR = 1;
    this.itemsPerPageR = event
    this.selectionR.clear();
    this.getRole(
      (this.requestParaR = {
        page: 1,
        limit: this.itemsPerPageR,
        search: this.searchRole,
        sortBy: this.sortByR,
        sortKey: this.sortKeyR
      })
    );
    this.limitR = this.itemsPerPageR;
  }

  // Pagination
  pageChangedR(page): void {
    this.selectionR.clear();
    this.getRole(
      (this.requestParaR = {
        page,
        limit: this.itemsPerPageR,
        search: this.searchRole,
        sortBy: this.sortByR,
        sortKey: this.sortKeyR
      })
    );
    this.pageR = page;
  }
  @ViewChild('searchBoxR') myInputVariableR: ElementRef;
  resetSearchR() {
    this.searchRole = '';
    this.selectionR.clear();
    this.myInputVariableR.nativeElement.value = '';
    this.pageR = 1;
    this.getRole(
      (this.requestParaR = {
        page: 1,
        limit: this.limit,
        search: this.searchRole,
        sortBy: this.sortBy,
        sortKey: this.sortKey
      })
    );
  }

  // edit
  edit(event): void {
    this.router.navigate([`people-management/add-edit-roles/` + event.name]);
  }
  openRoleDeleteDialog(event) {
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'PEOPLE_MANAGEMENT.Are you sure you want to delete this Role ?',
        heading: 'Delete Role',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.helper.toggleLoaderVisibility(true);
        that.ApiServices.deleteRole(event.name).then(
          (data: any) => {
            const metaData: any = data.reason;
            this.getRole(this.requestParaR);
            this.selectionR.clear();
            swal.fire(
              '',
              this.translate.instant(
                'Swal_Message.Rolehasbeendeletedsuccessfully'
              ),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.roleList.length - 1) == 0){
              let pageNumber = this.pageR - 1 
              this.pageChangedR(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getRole(this.requestParaR);
            }
          },
          (err) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire('', this.translate.instant(err.error.message), 'info');
          }
          
        );
      }
      
    });
  }
  // ==================================
  onKeyUpJ(searchTextValue: any): void {
    this.selectionJ.clear();
    this.subjectJ.next(searchTextValue);
  }
  private _setSearchSubscriptionJ(): void {
    this.subjectJ.pipe(debounceTime(500)).subscribe((searchValue: string) => {
      this.selectionJ.clear();
      this.pageJ = 1;
      this.getJob(
        (this.requestParaJ = {
          page: 1,
          limit: this.limitJ,
          search: this.searchJob,
          sortBy: this.sortByJ,
          sortKey: this.sortKeyJ
        })
      );
    });
  }
  // Sorting
  changeSortingJ( sortKey,sortBy): void {
    this.sortKeyJ = sortKey;
    this.sortByJ = sortBy === '-1' ? '1' : '-1';
    this.pageJ = 1;
    this.selectionJ.clear();
    this.getJob(
      (this.requestParaJ = {
        page: 1,
        limit: this.limitJ,
        search: this.searchJob,
        sortBy: this.sortByJ,
        sortKey: this.sortKeyJ
      })
    );
  }
  // Pagination
  changeItemsPerPageJ(event): void {
    this.pageJ = 1;
    this.itemsPerPageJ = event
    this.selectionJ.clear();
    this.getJob(
      (this.requestParaJ = {
        page: 1,
        limit: this.itemsPerPageJ,
        search: this.searchJob,
        sortBy: this.sortByJ,
        sortKey: this.sortKeyJ
      })
    );
    this.limitJ = this.itemsPerPageJ;
  }

  // Pagination
  pageChangedJ(page): void {
    // this.pageJ = page
    this.selectionJ.clear();
    this.getJob(
      (this.requestParaJ = {
        page,
        limit: this.itemsPerPageJ,
        search: this.searchJob,
        sortBy: this.sortByJ,
        sortKey: this.sortKeyJ
      })
    );
    this.pageJ = page;
  }
  @ViewChild('searchBoxj') myInputVariableJ: ElementRef;
  resetSearchJ() {
    this.selectionJ.clear();
    this.searchJob = '';
    this.myInputVariableJ.nativeElement.value = '';
    this.pageJ = 1;
    this.getJob(
      (this.requestParaJ = {
        page: 1,
        limit: this.limit,
        search: '',
        sortBy:  this.sortBy,
        sortKey: this.sortKey
      })
    );
  }

  openJobTitleDeleteDialog(event) {
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'PEOPLE_MANAGEMENT.Are you sure you want to delete this Job Title ?',
        heading: 'Delete Job Title',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.helper.toggleLoaderVisibility(true);
        that.ApiServices.deletejob(event.name).then(
          (data: any) => {
            const metaData: any = data.reason;
            this.getJob(this.requestParaJ);
            this.selectionJ.clear();
            swal.fire(
              '',
              this.translate.instant(
                'Swal_Message.Jobtitlehasbeendeletedsuccessfully'
              ),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.jobTitle.length - 1) == 0){
              let pageNumber = this.pageJ - 1 
              this.pageChangedJ(pageNumber)
              // that.getRole(this.requestParaR);
              this.table2.renderRows();
            }
            else{
              that.getJob(this.requestParaJ);
            }
            this.selectionJ.clear();
          },
          (err) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire('', this.translate.instant(err.error.message), 'info');
          }
        );
      }
    });
  }
  // edit
  editJob(event): void {
    this.router.navigate([
      `people-management/add-edit-job-title/` + event.name,
    ]);
  }

  matchnage() {}
  handleMatTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    if(this.tabIndex == 0){
      this.navTitle = 'PEOPLE_MANAGEMENT.Areas'
    }
    if(this.tabIndex == 1){
      this.navTitle = 'PEOPLE_MANAGEMENT.Roles'
    }
    if(this.tabIndex == 2){
      this.navTitle = 'PEOPLE_MANAGEMENT.JobTitles'
    }
    localStorage.setItem('peopleManagementTabLocation', event.index.toString());
  }

  ngAfterViewInit() {
    let index = localStorage.getItem('peopleManagementTabLocation') || 0; // get stored number or zero if there is nothing stored
    this.selectedIndex = index; // with tabGroup being the MatTabGroup accessed through ViewChild
  }

  // multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.areaList.length; i++) {
    this.areaList[i].checked = checkboxvalue.checked;
    if (checkboxvalue.checked){
      this.checkboxvalue = true;
    }else {
      this.checkboxvalue = false;
    }
  }

  for (var i = 0; i < this.roleList.length; i++) {
    this.roleList[i].checked = checkboxvalue.checked;
    if (checkboxvalue.checked){
      this.checkboxvalue = true;
    }else {
      this.checkboxvalue = false;
    }
  }

  for (var i = 0; i < this.jobTitle.length; i++) {
    this.jobTitle[i].checked = checkboxvalue.checked;
    if (checkboxvalue.checked){
      this.checkboxvalue = true;
    }else {
      this.checkboxvalue = false;
    }
  }
}

// Multiple Areas Delete

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.areaList.length;
  return numSelected === numRows;
}

toggleAllRows() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.areaList);
}

checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

areasName =[]
deleteMultiAreas(){

  const dialogRef = this.dialog.open(DeletePopupComponent, {
    data: {
      message:
        'Are you sure you want to delete selected Areas ?',
      heading: 'Delete Areas',
    },
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
  this.helper.toggleLoaderVisibility(true);
  for(let i = 0 ; i < this.selection.selected.length;i++){
    if(this.selection.selected){
      let paraName:string = this.selection.selected[i].name;
      this.areasName.push(paraName);
    }
  }
  const that = this
  if(this.areasName.length > 0){
    this.helper.deleteMultiArea({name:this.areasName}).subscribe((res: any)=>{
      if(res.result === true){
        this.getArea(this.requestPara);
        this.helper.toggleLoaderVisibility(false);
        this.selection.clear();
        this.areasName = [];
        swal.fire(
          '',
          this.translate.instant(
            'Swal_Message.AreaHasBeenDeletedSuccessfully'
          ),
          'success'
        );
        setTimeout(() => {
          if(this.areaList.length  == 0){
            let pageNumber = this.page - 1 
            this.pageChanged(pageNumber)
            // that.getRole(this.requestParaR);
            this.table3.renderRows();
          }
          else{
            that.getArea(this.requestPara);
          }
        }, 200);
        
      }else{
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(res.reason),
          'error'
        );
      }
    })
  }else{
    this.helper.toggleLoaderVisibility(false);
    swal.fire(
      '',
      this.translate.instant('Please select atleast one area to delete.'),
      'info'
    );
  }
}

});
}



// Multiple Role Delete

isAllSelectedR() {
  const numSelectedR = this.selectionR.selected.length;
  const numRowsR = this.roleList.length;
  return numSelectedR === numRowsR;
}

toggleAllRowsR() {
  if (this.isAllSelectedR()) {
    this.selectionR.clear();
    return;
  }

  this.selectionR.select(...this.roleList);
}

checkboxLabelR(row?: any): string {
  if (!row) {
    return `${this.isAllSelectedR() ? 'deselect' : 'select'} all`;
  }
  return `${this.selectionR.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

roleName =[]
deleteMultiRole(){
  const dialogRef = this.dialog.open(DeletePopupComponent, {
    data: {
      message:
        'Are you sure you want to delete selected Roles ?',
      heading: 'Delete Roles',
    },
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
  this.helper.toggleLoaderVisibility(true);
  for(let i = 0 ; i < this.selectionR.selected.length;i++){
    if(this.selectionR.selected){
      let paraNameR:string = this.selectionR.selected[i].name;
      // console.log('paraName',paraName);
      this.roleName.push(paraNameR);
    }
  }
  const that = this
  if(this.roleName.length > 0){
    this.helper.deleteMultiRoles({name:this.roleName}).subscribe((res: any)=>{
      if(res.result === true){
        this.getRole(this.requestPara);
        this.helper.toggleLoaderVisibility(false);
        this.selectionR.clear();
        this.roleName = [];
        swal.fire(
          '',
          this.translate.instant(
            'Swal_Message.Rolehasbeendeletedsuccessfully'
          ),
          'success'
        );
        setTimeout(() => {
          if(this.roleList.length == 0){
            let pageNumber = this.pageR - 1 
            this.pageChangedR(pageNumber)
            // that.getRole(this.requestParaR);
            this.table.renderRows();
          }
          else{
            that.getRole(this.requestParaR);
          }
        }, 200);
        
      }else{
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(res.reason),
          'error'
        );
      }
    })
  }else{
    this.helper.toggleLoaderVisibility(false);
    swal.fire(
      '',
      this.translate.instant('Please select atleast one role to delete.'),
      'info'
    );
  }
}
  });

}

// Multiple Role Delete

isAllSelectedJ() {
  const numSelectedJ = this.selectionJ.selected.length;
  const numRowsJ = this.jobTitle.length;
  return numSelectedJ === numRowsJ;
}

toggleAllRowsJ() {
  if (this.isAllSelectedJ()) {
    this.selectionJ.clear();
    return;
  }

  this.selectionJ.select(...this.jobTitle);
}

checkboxLabelJ(row?: any): string {
  if (!row) {
    return `${this.isAllSelectedJ() ? 'deselect' : 'select'} all`;
  }
  return `${this.selectionJ.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

jobTitleName =[]
deleteMultiJobTitles(){
  const dialogRef = this.dialog.open(DeletePopupComponent, {
    data: {
      message:
        'Are you sure you want to delete selected Job Titles ?',
      heading: 'Delete Job Titles',
    },
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
  this.helper.toggleLoaderVisibility(true);
  for(let i = 0 ; i < this.selectionJ.selected.length;i++){
    if(this.selectionJ.selected){
      let paraNameJ:string = this.selectionJ.selected[i].name;
      // console.log('paraName',paraName);
      this.jobTitleName.push(paraNameJ);
    }
  }
  const that = this
  if(this.jobTitleName.length > 0){
    this.helper.deleteMultiJobTitle({title:this.jobTitleName}).subscribe((res: any)=>{
      if(res.result === true){
        this.getJob(this.requestPara);
        this.helper.toggleLoaderVisibility(false);
        this.selectionJ.clear();
        this.jobTitleName = [];
        swal.fire(
          '',
          this.translate.instant(
            'Swal_Message.Jobtitlehasbeendeletedsuccessfully'
          ),
          'success'
        );
        setTimeout(() => {
          if(this.jobTitle.length == 0){
            let pageNumber = this.pageJ - 1 
            this.pageChangedJ(pageNumber)
            // that.getRole(this.requestParaR);
            this.table2.renderRows();
          }
          else{
            that.getJob(this.requestParaJ);
          }
        }, 200);
      }else{
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(res.reason),
          'error'
        );
      }
    })
  }else{
    this.helper.toggleLoaderVisibility(false);
    swal.fire(
      '',
      this.translate.instant('Please select atleast one job title to delete.'),
      'info'
    );
  }
}

});
}

}
