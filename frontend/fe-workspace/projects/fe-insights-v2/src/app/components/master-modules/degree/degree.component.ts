import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditDisputePopupComponent } from '../../../popup/add-edit-dispute-popup/add-edit-dispute-popup.component';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {MasterModulesDegreeService} from '../../../../../../fe-common-v2/src/lib/services/master-modules-degree.service';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {debounceTime} from 'rxjs/operators';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.scss']
})
export class DegreeComponent implements OnInit {
  degreeList: any = new MatTableDataSource([]);
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
  createdAt: any;
  id: any;
  updated_at: any;
  __v: any;
  _id: any;
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();
  sidebarMenuName:string;
  @ViewChild('table') table: MatTable<any>;
  constructor(public dialog: MatDialog,
              private ApiService: MasterModulesDegreeService,
              private helper: MCPHelperService,
              public translate: TranslateService) {
     this._setSearchSubscription();
  }

  degreeDisplayedColumns: string[] = ['select','wheelAction', 'degreeName'];

  ngOnInit(): void {
    this.sideMenuName();
    this.getDegreeList(this.requestPara);
  }

  sideMenuName(){
    this.sidebarMenuName = 'Degree';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getDegreeList(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getDegree(this.requestPara);
    if (res.statusCode === 200) {
      this.degreeList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.degreeList.length > 0;
      this.helper.toggleLoaderVisibility(false);
    }else {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(res.reason),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }


  openAccountDeleteDialog(event: any): void{
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'MASTER_MODULE.Are You Sure You Want To Delete This Degree?', heading: 'Delete Degree'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteDegree(event.id).then( (data: any) => {
            const metaData: any = data.reason;
            this.getDegreeList(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('Swal_Message.Degree deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.degreeList.length - 1) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getDegreeList(this.requestPara);
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
      this.getDegreeList(this.requestPara = {
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
    this.itemsPerPage = event;
    this.selection.clear();
    this.getDegreeList(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getDegreeList(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }

  openAddDeegre(){
    const that = this;
    const dialogRef = this.dialog.open(AddEditDisputePopupComponent,{
      data:{placeholder:'MASTER_MODULE.DegreeName',heading:'MASTER_MODULE.Add Degree',validation:'Enter your degree name.'}
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          const name = result.description;
          that.ApiService.addDegree({description: name}).then( (data: any) => {
            const metaData: any = data.reason;
            this.getDegreeList(this.requestPara);
            swal.fire(
              '',
              this.translate.instant('Swal_Message.Degree added successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            that.getDegreeList(this.requestPara);
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
  openAddDeegreE(event: any){
    const that = this;
    const dialogRef = this.dialog.open(AddEditDisputePopupComponent,{
      data:{placeholder:'MASTER_MODULE.DegreeName',heading:'COMPANYTXT.EditDegree',validation:'Enter your degree name.',
      id: event.id,
      description: event.description}
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.selection.clear();
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.editDegree({id: event.id}).then( (data: any) => {
            const metaData: any = data.reason;
            this.createdAt = metaData.createdAt;
            this.updated_at = metaData.updated_at;
            this.__v = metaData.__v;
            this._id = metaData._id;
          });
          const name = result.description;
          that.ApiService.addDegree({createdAt: this.createdAt, description: name, id: event.id, updated_at: this.updated_at, __v: this.__v, _id: this._id}).then( (data: any) => {
            const metaData: any = data.reason;
            this.getDegreeList(this.requestPara);
            swal.fire(
              '',
              this.translate.instant('Swal_Message.Degree edited successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            that.getDegreeList(this.requestPara);
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
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.selection.clear();
    this.getDegreeList(this.requestPara = {
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
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    this.selection.clear();
    this.getDegreeList(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }

  // multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.degreeList.length; i++) {
    this.degreeList[i].checked = checkboxvalue.checked;
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
  const numRows = this.degreeList.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRows() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.degreeList);
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}


degreeID=[]
deleteMultiDegree(){

  const dialogRef = this.dialog.open(DeletePopupComponent, {
    data: {
      message:
        'Are you sure you want to delete selected Degrees ?',
      heading: 'Delete Degrees',
    },
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      const that = this

  this.helper.toggleLoaderVisibility(true);
  for(let i = 0 ; i < this.selection.selected.length;i++){
    if(this.selection.selected){
      let paraName:string = this.selection.selected[i].id;
      this.degreeID.push(paraName);
    }
  }
  if(this.degreeID.length > 0){
    this.helper.deleteMultiDegrees({id:this.degreeID}).subscribe((res: any)=>{
      if(res.result === true){
        this.getDegreeList(this.requestPara);
        this.helper.toggleLoaderVisibility(false);
        this.selection.clear();
        this.degreeID = [];
        swal.fire(
          '',
          this.translate.instant('Swal_Message.Degree deleted successfully'),
          'success'
        );
        setTimeout(() => {
          if((this.degreeList.length) == 0){
            let pageNumber = this.page - 1
            this.pageChanged(pageNumber)
            // that.getRole(this.requestParaR);
            this.table.renderRows();
          }
          else{
            that.getDegreeList(this.requestPara);
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
      this.translate.instant('Please select atleast one degree to delete.'),
      'info'
    );
  }

}});}


}
