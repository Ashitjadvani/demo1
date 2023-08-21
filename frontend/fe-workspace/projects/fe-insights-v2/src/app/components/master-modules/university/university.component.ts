import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddEditDisputePopupComponent} from '../../../popup/add-edit-dispute-popup/add-edit-dispute-popup.component';
import {DeletePopupComponent} from '../../../popup/delete-popup/delete-popup.component';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MasterModulesUniversityService} from '../../../../../../fe-common-v2/src/lib/services/master-modules-university.service';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import {data} from "jquery";
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.scss']
})
export class UniversityComponent implements OnInit {
  universityList: any = new MatTableDataSource([]);
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any;
  limit: any = 10;
  search: any = '';
  sortBy: any = '-1';
  sortKey = null;
  sortClass: any = 'down';
  noRecordFound = false;
  filter: any;
  editMode = 'Add';
  createdAt: any;
  id: any;
  updated_at: any;
  __v: any;
  _id: any;
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();
  sidebarMenuName:string;
  universityDisplayedColumns: string[] = ['select','wheelAction', 'universityName'];
  @ViewChild('table') table: MatTable<any>;

  constructor(public dialog: MatDialog,
              private ApiService: MasterModulesUniversityService,
              private  helper: MCPHelperService,
              public translate: TranslateService) {
    this._setSearchSubscription();
  }

  ngOnInit(): void {
    this.sideMenuName();
    this.getUniversityList(this.requestPara);
  }
  sideMenuName(){
    this.sidebarMenuName = 'University';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getUniversityList(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getUniverstiy(this.requestPara);
    if (res.statusCode === 200){
      this.universityList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.universityList.length > 0;
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
    }
    this.helper.toggleLoaderVisibility(false);
  }

  openAccountDeleteDialog(event: any): void {
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'MASTER_MODULE.Are You Sure You Want To Delete This University?', heading: 'Delete University'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteUniverstiy(event.id).then( (data: any) => {
            const metaData: any = data.reason;
            this.getUniversityList(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('Swal_Message.University deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.universityList.length - 1) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getUniversityList(this.requestPara);
            }
            this.selection.clear();
          }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire(
              '',
              this.translate.instant(err.error.message),
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

  private _setSearchSubscription(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.page = 1;
      this.selection.clear();
      this.getUniversityList(this.requestPara = {
        page: 1,
        limit: this.limit,
        search: this.search,
        sortBy: this.sortBy,
        sortKey: this.sortKey
      });
    });
  }

  // Pagination
  changeItemsPerPage(event): void {
    // this.search = '';
    this.page = 1;
    this.itemsPerPage = event
    this.selection.clear();
    this.getUniversityList(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getUniversityList(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;

  }
  openAddEditUniversityDialog() {
    const that = this;
    const dialogRef = this.dialog.open(AddEditDisputePopupComponent, {
      data: {placeholder: 'COMPANYTXT.UniversityName', heading: 'Add University', validation: 'Enter your university name'}
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
           this.helper.toggleLoaderVisibility(true);
           const name = result.description;
           that.ApiService.addUniverstiy({university: '', description: name}).then( (data: any) => {
            const metaData: any = data.reason;
            this.getUniversityList(this.requestPara);
            swal.fire(
              '',
              this.translate.instant('Swal_Message.University added successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            that.getUniversityList(this.requestPara);
          }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire(
              '',
              this.translate.instant(err.error.message),
              'info'
            );
          });
        }
      });
  }
  openAddEditUniversityDialog1(event): any {
    const that = this;
    const dialogRef = this.dialog.open(AddEditDisputePopupComponent, {
      data: {placeholder: 'COMPANYTXT.UniversityName', heading: 'Edit University', validation: 'Enter your university name',
        id: event.id,
        description: event.description}
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.selection.clear();
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.editUniverstiy({id: event.id}).then( (data: any) => {
            const metaData: any = data.reason;
            this.createdAt = metaData.createdAt;
            this.updated_at = metaData.updated_at;
            this.__v = metaData.__v;
            this._id = metaData._id;
          });
          const name = result.description;
          that.ApiService.addUniverstiy({createdAt: this.createdAt, description: name, id: event.id, updated_at: this.updated_at, __v: this.__v, _id: this._id}).then( (data: any) => {
            const metaData: any = data.reason;
            this.getUniversityList(this.requestPara);
            swal.fire(
              '',
              this.translate.instant('Swal_Message.University edited successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            that.getUniversityList(this.requestPara);
          }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire(
              '',
              this.translate.instant(err.error.message),
              'info'
            );
          });
        }
      });
  }

  // Sorting
  changeSorting(sortKey, sortBy): void {
    // this.search = '';
    this.selection.clear();
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.getUniversityList(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(){
    this.selection.clear();
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    this.getUniversityList(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }

  // multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.universityList.length; i++) {
    this.universityList[i].checked = checkboxvalue.checked;
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
    const numRows = this.universityList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.universityList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  uniID=[]
  async deleteMultiUniversity(){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected Universities ?',
        heading: 'Delete Universities',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this

    this.helper.toggleLoaderVisibility(true);
     this.selectedItems();
    if(this.uniID.length > 0){
      this.helper.deleteMultiUniversity({id:this.uniID}).subscribe((res: any)=>{
        if(res.result === true){
          this.getUniversityList(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          this.selection.clear();
          this.uniID=[];
          swal.fire(
            '',
            this.translate.instant('Swal_Message.University deleted successfully'),
            'success'
          );
          setTimeout(() => {
            if((this.universityList.length) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getUniversityList(this.requestPara);
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
        this.translate.instant('Please select atleast one university to delete.'),
        'info'
      );
    }
  }});}

  async selectedItems(){
    for(let i = 0 ; i < this.selection.selected.length;i++){
      if(this.selection.selected){
        let paraName:string = this.selection.selected[i].id;
        console.log('paraName',paraName);
        this.uniID.push(paraName);
      }
    }
  }
}
