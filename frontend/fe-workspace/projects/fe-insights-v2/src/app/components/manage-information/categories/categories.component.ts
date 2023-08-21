import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {ManageInformationCategoriesService} from '../../../../../../fe-common-v2/src/lib/services/manage-information-categories.service';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import swal from 'sweetalert2';
import {TranslateService} from "@ngx-translate/core";
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categoriesList: any = new MatTableDataSource([]);
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
              private helper: MCPHelperService,
              private ApiService: ManageInformationCategoriesService,
              private translate: TranslateService,
              private route: Router) {
    this._setSearchSubscription();
  }

  categoriesDisplayedColumns: string[]= ['select','wheelAction', 'categoryTitle','categoryTitleIT'];


  ngOnInit(): void {
    this.sideMenuName();
    this.getCatagories(this.requestPara);
  }

  sideMenuName(){
    this.sidebarMenuName = 'Categories';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getCatagories(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getCategoriesList(this.requestPara);
    if (res.statusCode === 200) {
      this.categoriesList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.categoriesList.length > 0;
      this.helper.toggleLoaderVisibility(false);
    }else {
      this.helper.toggleLoaderVisibility(false);
      // const e = err.error;
      swal.fire(
        '',
        this.translate.instant(res.reason),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }

  openCategoryDeleteDialog(event: any){
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this Category?', heading: 'Delete Category'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteCategories(event.id).then((data: any) => {
            const metaData: any = data.reason;
            this.getCatagories(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('Category has been deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.categoriesList.length - 1) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getCatagories(this.requestPara);
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
      this.getCatagories(this.requestPara = {
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
    this.getCatagories(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }

  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getCatagories(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }

  // Sorting
  changeSorting(sortKey, sortBy): void {
    // this.search = '';
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.selection.clear();
    this.getCatagories(this.requestPara = {
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
    this.getCatagories(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  edit(event: any){
    if(event.id){
      this.route.navigate(['manage-information/categories/add-edit-categories/'+ event.id]);
    }
  }

  // multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.categoriesList.length; i++) {
    this.categoriesList[i].checked = checkboxvalue.checked;
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
    const numRows = this.categoriesList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.categoriesList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  categoryID=[]
  async selectedItems(){
    for(let i = 0 ; i < this.selection.selected.length;i++){
      if(this.selection.selected){
        let paraName:string = this.selection.selected[i].id;
        console.log('paraName',paraName);
        this.categoryID.push(paraName);
      }
    }
  }


  async deleteMultiCategory(){

    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected Categories?',
        heading: 'Delete Categories',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this

    this.helper.toggleLoaderVisibility(true);
     this.selectedItems();
    if(this.categoryID.length > 0){
      this.helper.deleteMultiCategory({id:this.categoryID}).subscribe((res: any)=>{
        if(res.result === true){
          this.getCatagories(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          this.selection.clear();
          this.categoryID=[];
          swal.fire(
            '',
            this.translate.instant('Category has been deleted successfully'),
            'success'
          );
          setTimeout(() => {
            if((this.categoriesList.length) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getCatagories(this.requestPara);
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
        this.translate.instant('Please select atleast one category to delete.'),
        'info'
      );
    }
  }});}

}
