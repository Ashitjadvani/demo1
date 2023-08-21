import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../popup/delete-popup/delete-popup.component';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {AlertsManagementService} from '../../../../../fe-common-v2/src/lib/services/alerts-management.service';
import {MCPHelperService} from "../../service/MCPHelper.service";
import {debounceTime} from "rxjs/operators";
import {Subject} from "rxjs";
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  alertsList: any = new MatTableDataSource([]);
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
  sidebarMenuName:string;
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();
  @ViewChild('table') table: MatTable<any>;
  constructor(public dialog: MatDialog,
              private ApiService: AlertsManagementService,
              private helper: MCPHelperService,
              private translate: TranslateService,
              public router: Router) {
    this._setSearchSubscription();
  }

  alertsDisplayedColumns: string[] = ['select','wheelAction', 'alertDate', 'title', 'publicationDate', 'view', 'confirmed'];


  ngOnInit(): void {
    this.sideMenuName();
    this.getAlerts(this.requestPara);
  }

  sideMenuName(){
    this.sidebarMenuName = 'Alerts'; 
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  edit(event): void {
    this.router.navigate([`alerts/add-edit-alert/` + event.id]);
  }
  async getAlerts(request): Promise<void> {
     this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getAlertsList(this.requestPara);
    if (res.statusCode === 200) {
      this.alertsList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.alertsList.length > 0;
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


  openAccountDeleteDialog(event: any): void{
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this alert?', heading: 'Delete Alert'}
    });
    dialogRef.afterClosed().subscribe(
      result => {

        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteAlert(event.id).then((data: any) => {
            const metaData: any = data.reason;
            this.getAlerts(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('Alert has been deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.alertsList.length - 1) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getAlerts(this.requestPara);
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
      this.getAlerts(this.requestPara = {
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
    this.getAlerts(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getAlerts(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }

  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void{
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    this.selection.clear();
    this.getAlerts(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }

  // Sorting
  changeSorting(sortKey,sortBy): void {
    // this.search = '';
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.selection.clear();
    this.getAlerts(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
// multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.alertsList.length; i++) {
    this.alertsList[i].checked = checkboxvalue.checked;
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
  const numRows = this.alertsList.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRows() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.alertsList);
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}


sitesID=[]
deleteMultiAlert(){
  const dialogRef = this.dialog.open(DeletePopupComponent, {
    data: {
      message:
        'Are you sure you want to delete selected Alerts ?',
      heading: 'Delete Alerts',
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
      this.sitesID.push(paraName);
    }
  }
  if(this.sitesID.length > 0){
    this.helper.deleteMultiAlerts({id:this.sitesID}).subscribe((res: any)=>{
      if(res.result === true){
        this.getAlerts(this.requestPara);
        this.helper.toggleLoaderVisibility(false);
        this.selection.clear();
        this.sitesID = [];
        swal.fire(
          '',
          this.translate.instant('Alert has been deleted successfully'),
          'success'
        );
        setTimeout(() => {
          if((this.alertsList.length) == 0){
            let pageNumber = this.page - 1 
            this.pageChanged(pageNumber)
            // that.getRole(this.requestParaR);
            this.table.renderRows();
          }
          else{
            that.getAlerts(this.requestPara);
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
      this.translate.instant('Please select atleast one alert to delete.'),
      'info'
    );
  }

}});}


}
