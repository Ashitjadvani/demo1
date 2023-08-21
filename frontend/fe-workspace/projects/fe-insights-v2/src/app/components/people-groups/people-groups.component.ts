import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {DeletePopupComponent} from '../../popup/delete-popup/delete-popup.component';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {PeopleGroupService} from '../../../../../fe-common-v2/src/lib/services/people-group.service';
import {Sort} from '@angular/material/sort';
import {debounceTime} from "rxjs/operators";
import swal from "sweetalert2";
import {MCPHelperService} from "../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-people-groups',
  templateUrl: './people-groups.component.html',
  styleUrls: ['./people-groups.component.scss']
})
export class PeopleGroupsComponent implements OnInit {
  peopleGroupsList: any = new MatTableDataSource([]);
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortBy: any = '-1';
  sortKey = null;
  sortClass: any = 'down';
  noRecordFound = false;
  filter: any;
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  RFQDisplayedColumns: string[] = ['select','wheelAction', 'peopleGroupID', 'role', 'description'];
  private subject: Subject<string> = new Subject();
  sidebarMenuName:string;
  // private searchSubject: Subject<string> = new Subject();
  @ViewChild('table') table: MatTable<any>;

  constructor(public dialog: MatDialog,
              private ApiServices: PeopleGroupService,
              private helper: MCPHelperService,
              private translate: TranslateService,
              private router: Router) {
    this._setSearchSubscription();
  }

  ngOnInit(): void {
    this.sideMenuName();
    this.getPeople(this.requestPara);
  }

  sideMenuName(){
    this.sidebarMenuName = 'People Groups';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  getPeople(req: any): any {
    this.ApiServices.getPeopleGroup(this.requestPara).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(true);
      const metaData: any = res.meta.message;
      if (res.statusCode === 200) {
        this.peopleGroupsList = res.data;
        this.totalItems = res.meta.totalCount;
        this.noRecordFound = this.peopleGroupsList.length > 0;
        this.helper.toggleLoaderVisibility(false);
      }
    }, (err: any) => {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(err.error.message),
        'info'
      );
    });
  }

  openRFQDeleteDialog(event: any): void {
    const that = this
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this people group?', heading: 'Delete People Group'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ApiServices.deletePeople(event.id).subscribe((data: any) => {
          const metaData: any = data.reason;
          // this.featuresList.splice(index, 1);
          this.getPeople(this.requestPara);
          this.selection.clear();
          swal.fire(
            '',
            this.translate.instant('Swal_Message.People group has been deleted successfully'),
            'success'
          );
          if((this.peopleGroupsList.length - 1) == 0){
            let pageNumber = this.page - 1 
            this.pageChanged(pageNumber)
            // that.getRole(this.requestParaR);
            this.table.renderRows();
          }
          else{
            that.getPeople(this.requestPara);
          }
          this.selection.clear();
        }, (err: any) => {
          const e = err.error;
          swal.fire(
            '',
            this.translate.instant(result.reason),
            'info'
          );
          this.selection.clear();
        });
      }
    });
  }

  onKeyUp(searchTextValue: any): void {
    this.selection.clear();
    this.subject.next(searchTextValue);
  }

  // Pagination
  changeItemsPerPage(event): void {
    // this.search = '';
    this.selection.clear();
    this.page = 1;
    this.itemsPerPage = event
    this.getPeople(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy:  this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getPeople(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy:  this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }

  // Sorting
  changeSorting(sortKey, sortBy): void {
    // this.search = '';
    this.selection.clear();
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.getPeople(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy:  this.sortBy,
      sortKey: this.sortKey
    });
  }

  private _setSearchSubscription(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.selection.clear();
      this.page = 1;
      this.getPeople(this.requestPara = {
        page: 1,
        limit: this.limit,
        search: this.search,
        sortBy:  this.sortBy,
        sortKey: this.sortKey
      });
    });
  }
  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void{
    this.selection.clear();
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    this.getPeople(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy:  this.sortBy,
      sortKey: this.sortKey
    });
  }
  edit(event): void {
    this.router.navigate([`/people-groups/add-edit-group/` + event.id]);
  }

  // multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.peopleGroupsList.length; i++) {
    this.peopleGroupsList[i].checked = checkboxvalue.checked;
    if (checkboxvalue.checked){
      this.checkboxvalue = true;
    }else {
      this.checkboxvalue = false;
    }
  }
}

selection = new SelectionModel<any>(true, []);

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.peopleGroupsList.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRows() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.peopleGroupsList);
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}


groupID=[]
deleteMultipeopleGroup(){
  const dialogRef = this.dialog.open(DeletePopupComponent, {
    data: {
      message:
        'Are you sure you want to delete selected People Groups?',
      heading: 'Delete People Groups',
    },
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      const that = this

  this.helper.toggleLoaderVisibility(true);
  for(let i = 0 ; i < this.selection.selected.length;i++){
    if(this.selection.selected){
      let paraName:string = this.selection.selected[i].id;
      console.log('paraName',paraName);
      this.groupID.push(paraName);
    }
  }
  if(this.groupID.length > 0){
    this.helper.deleteMultiPeopleGroups({id:this.groupID}).subscribe((res: any)=>{
      if(res.result === true){
        this.getPeople(this.requestPara);
        this.helper.toggleLoaderVisibility(false);
        this.selection.clear();
        this.groupID = [];
        swal.fire(
          '',
          this.translate.instant('Swal_Message.People group has been deleted successfully'),
          'success'
        );
        setTimeout(() => {
          if((this.peopleGroupsList.length) == 0){
            let pageNumber = this.page - 1 
            this.pageChanged(pageNumber)
            // that.getRole(this.requestParaR);
            this.table.renderRows();
          }
          else{
            that.getPeople(this.requestPara);
          }
        }, 100);
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
      this.translate.instant('Please select atleast one people group to delete.'),
      'info'
    );
  }

}});}


}
