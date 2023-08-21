import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import swal from 'sweetalert2';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {QuizMatrixService} from '../../../../../../fe-common-v2/src/lib/services/quiz-matrix.service';
import {debounceTime} from "rxjs/operators";
import {Router} from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
  matrixList: any = new MatTableDataSource([]);
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortBy: any = '-1';
  sortKey = null;
  sortClass: any = 'down';
  noRecordFound = false;
  sidebarMenuName:string;
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();
  metricsList = []

  metricsDisplayedColumns : string[] = ['select','wheelAction', 'title','type','description','Aggregation']
  @ViewChild('table') table: MatTable<any>;

  constructor(public dialog: MatDialog,
              private ApiService: QuizMatrixService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router) {
    this._setSearchSubscription();
  }

  ngOnInit(): void {
    this.sideMenuName();
    this.getMatrixList(this.requestPara)
  }
  sideMenuName(){
    this.sidebarMenuName = 'Metrics';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

  async getMatrixList(request): Promise<void> {
    // let err: any;
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getMatrix(this.requestPara);
    if (res.statusCode === 200) {
      this.matrixList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.matrixList.length > 0;
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


  metricsDeleteDialog(event: any){
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent,{
      data:{message:'Are you sure you want to delete this Metric',heading:'Delete Metric'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteMatrix(event.id).then((data: any) => {
            const metaData: any = data.reason;
            this.getMatrixList(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('Swal_Message.Matrices deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.matrixList.length - 1) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getMatrixList(this.requestPara);
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



  // Sorting
  changeSorting(sortKey, sortBy): void {
    this.selection.clear();
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.getMatrixList(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  // Searching
  onKeyUp(searchTextValue: any): void {
    this.selection.clear();
    this.subject.next(searchTextValue);
  }
  private _setSearchSubscription(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.selection.clear();
      this.page = 1;
      this.getMatrixList(this.requestPara = {
        page: 1,
        limit: this.limit,
        search: this.search,
        sortBy: this.sortBy,
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
    this.getMatrixList(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  // Pagination
  changeItemsPerPage(event): void {
    this.selection.clear();
    this.page = 1;
    this.itemsPerPage = event
    this.getMatrixList(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page: number): void {
    this.selection.clear();
    this.getMatrixList(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }
  // View Detail
  viewDetail(event): void {
    this.router.navigate([`/quiz-survey/metrics/view-metrics/` + event.id]);
  }
  // View Detail
  edit(event): void {
    this.router.navigate([`/quiz-survey/metrics/add-edit-metrics/` + event.id]);
  }
// multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.matrixList.length; i++) {
    this.matrixList[i].checked = checkboxvalue.checked;
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
    const numRows = this.matrixList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.matrixList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  metricsID=[]
  async deleteMultiMetrics(){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected Metrics?',
        heading: 'Delete Metrics',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this

    this.helper.toggleLoaderVisibility(true);
    this.selectedItems();
    if(this.metricsID.length > 0){
      this.helper.deleteMultiMetrics({id:this.metricsID}).subscribe((res: any)=>{
        if(res.result === true){
          this.getMatrixList(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          this.selection.clear();
          this.metricsID=[];
          swal.fire(
            '',
            this.translate.instant('Swal_Message.Matrices deleted successfully'),
            'success'
          );
          setTimeout(() => {
            if((this.matrixList.length) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getMatrixList(this.requestPara);
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
        this.translate.instant('Please select atleast one metric to delete.'),
        'info'
      );
    }
  }});}

  async selectedItems(){
    for(let i = 0 ; i < this.selection.selected.length;i++){
      if(this.selection.selected){
        let paraName:string = this.selection.selected[i].id;
        console.log('paraName',paraName);
        this.metricsID.push(paraName);
      }
    }
  }

}
