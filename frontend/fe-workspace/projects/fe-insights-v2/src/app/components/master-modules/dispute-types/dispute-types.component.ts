import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditDisputePopupComponent } from '../../../popup/add-edit-dispute-popup/add-edit-dispute-popup.component';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {MasterModuleDisputeTypeService} from '../../../../../../fe-common-v2/src/lib/services/master-module-dispute-type.service';
import swal from 'sweetalert2';
import {debounceTime} from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

export interface DialogData {
  placeholder:string;
  heading:string;
  validation:string;
  value: string;
}
@Component({
  selector: 'app-dispute-types',
  templateUrl: './dispute-types.component.html',
  styleUrls: ['./dispute-types.component.scss']
})
export class DisputeTypesComponent implements OnInit {
  disputeTypeList: any = new MatTableDataSource([]);
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortBy: any = '';
  sortKey = '';
  sortClass: any = 'down';
  noRecordFound = false;
  filter: any;
  name: any;
  isAddEdit:boolean = false;
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();
  sidebarMenuName:string;
  @ViewChild('table') table: MatTable<any>;
  constructor(public dialog: MatDialog,
              private helper: MCPHelperService,
              public translate: TranslateService,
              public ApiService: MasterModuleDisputeTypeService) {
     this._setSearchSubscription();
  }

  disputeTypesDisplayedColumns: string[] = ['select','wheelAction', 'disputeName'];


  ngOnInit(): void {
    this.sideMenuName();
    this.getdisputetList(this.requestPara);
  }
  sideMenuName(){
    this.sidebarMenuName = 'Dispute Types';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getdisputetList(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getDispute(this.requestPara);
    if (res.statusCode === 200){
      this.helper.toggleLoaderVisibility(false);
      this.disputeTypeList = res.data;

      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.disputeTypeList.length > 0;
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

  openAccountDeleteDialog(event){
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Swal_Message.Are you sure you want to delete this Dispute?', heading: 'Delete Dispute'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteDispute(event.name).then( (data: any) => {
            const metaData: any = data.reason;
            this.getdisputetList(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('Swal_Message.Dispute has been deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.disputeTypeList.length - 1) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getdisputetList(this.requestPara);
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

   openAddEditDisputeDialog(){
    const that = this;
    const dialogRef = this.dialog.open(AddEditDisputePopupComponent,{
      data: {placeholder: 'MASTER_MODULE.DisputeName', heading: 'MASTER_MODULE.Add Dispute',validation:'Enter your dispute name.',
      value:''}
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.isAddEdit = false;
          this.selection.clear();
          for(let i = 0;i < this.disputeTypeList.length;i++){
            if(this.disputeTypeList[i].name == result.description){
              this.isAddEdit = true;
            }
          }
          if(this.isAddEdit === false){

            this.helper.toggleLoaderVisibility(true);
            const name = result.description;
            that.ApiService.addDispute({peopleDispute: name}).then( (data: any) => {
              const metaData: any = data.reason;
              this.getdisputetList(this.requestPara);
              swal.fire(
                '',
                this.translate.instant('Swal_Message.Dispute added successfully'),
                'success'
              );
              this.helper.toggleLoaderVisibility(false);
              that.getdisputetList(this.requestPara);
            }, (err) => {
              this.helper.toggleLoaderVisibility(false);
              const e = err.error;
              swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
              );
            });
          }else{
            swal.fire(
              '',
              this.translate.instant('Dispute name is already exists'),
              'info'
            );
          }
        }
      });
  }
  openAddEditDisputeDialogE(event){
    const that = this;
    const dialogRef = this.dialog.open(AddEditDisputePopupComponent,{
      data: {
        placeholder: 'MASTER_MODULE.DisputeName',
        heading: 'Edit Dispute',
        validation:'Enter your dispute name.',
        id: event?.id,
        description: event.name
      }
    });
    this.name = event.name;
    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.isAddEdit = false;
          this.selection.clear();
          for(let i = 0;i < this.disputeTypeList.length;i++){
            if(this.disputeTypeList[i].name == result.description){
              this.isAddEdit = true;
            }
          }
          if(this.isAddEdit === false){
            this.helper.toggleLoaderVisibility(true);
            that.ApiService.editDispute(this.name, result.description).then( (data: any) => {
              const metaData: any = data.reason;
              this.getdisputetList(this.requestPara);
              swal.fire(
                '',
                this.translate.instant('Swal_Message.Dispute edited successfully'),
                'success'
              );
              this.helper.toggleLoaderVisibility(false);
              that.getdisputetList(this.requestPara);
            }, (err) => {
              this.helper.toggleLoaderVisibility(false);
              const e = err.error;
              swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
              );
            });
          }else{
            swal.fire(
              '',
              this.translate.instant('Dispute name is already exists'),
              'info'
            );
          }
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
      this.getdisputetList(this.requestPara = {
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
    this.page = 1;
    this.itemsPerPage = event;
    this.selection.clear();
    this.getdisputetList(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    this.selection.clear();
    this.getdisputetList(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }
  // Sorting
  changeSorting(sortKey, sortBy): void {
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.selection.clear();
    this.getdisputetList(this.requestPara = {
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
    this.getdisputetList(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
// multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.disputeTypeList.length; i++) {
    this.disputeTypeList[i].checked = checkboxvalue.checked;
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
    const numRows = this.disputeTypeList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.disputeTypeList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  disputeName=[]
  async deleteMultiDispute(){

    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected Dispute Types ?',
        heading: 'Delete Dispute Types',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this

    this.helper.toggleLoaderVisibility(true);
    this.selectedItems();
    if(this.disputeName.length > 0){
      this.helper.deleteMultiDispute({name:this.disputeName}).subscribe((res: any)=>{
        if(res.result === true){
          this.getdisputetList(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          this.selection.clear();
          this.disputeName=[];
          swal.fire(
            '',
            this.translate.instant('Swal_Message.Dispute has been deleted successfully'),
            'success'
          );
          setTimeout(() => {
            if((this.disputeTypeList.length) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getdisputetList(this.requestPara);
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
        this.translate.instant('Please select atleast one dispute to delete.'),
        'info'
      );
    }
  }
});
  }

  async selectedItems(){
    for(let i = 0 ; i < this.selection.selected.length;i++){
      if(this.selection.selected){
        let paraName:string = this.selection.selected[i].name;
        this.disputeName.push(paraName);
      }
    }
  }
}
