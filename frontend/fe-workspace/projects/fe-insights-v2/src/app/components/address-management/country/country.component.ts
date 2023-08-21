import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import {AddressManagementService} from "../../../../../../fe-common-v2/src/lib/services/address-management.service";
import swal from "sweetalert2";
import {Router} from "@angular/router";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {SelectionModel} from "@angular/cdk/collections";
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortBy: any = '-1';
  sortKey = null;
  sortClass: any = 'down';
  countryList: any[] = [];
  noRecordFound = false;
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();
  sidebarMenuName:string;
  @ViewChild('table') table: MatTable<any>;
  constructor(public dialog: MatDialog,
              private ApiService: AddressManagementService,
              private router: Router,
              private helper: MCPHelperService,
              public translate: TranslateService) {
    this._setSearchSubscription();
  }

  resourceGroupDisplayedColumns: string[]= [ 'select', 'wheelAction', 'country', 'createdAt', 'updatedAt'];

  ngOnInit(): void {
    this.sideMenuName();
    this.getCountry({});
  }

  sideMenuName(){
    this.sidebarMenuName = 'Country'; 
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  edit(event){
    this.router.navigate([`address-management/country/add-edit-country/` + event.id])
  }

  getCountry(request): any {
    this.ApiService.getCountryList(this.requestPara).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(true);
      if (res.statusCode === 200) {
        this.countryList = res.data;
        this.totalItems = res.meta.totalCount;
        this.noRecordFound = this.countryList.length > 0;
        this.helper.toggleLoaderVisibility(false);
      }
    }, (err: any) => {
      this.helper.toggleLoaderVisibility(false);
      const e = err.error;
      swal.fire(
        '',
        this.translate.instant(err.error.message),
        'info'
      );

    });
  }
  openAccountDeleteDialog(event){
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this Country ?', heading: 'Delete Country'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ApiService.deleteCountry(event.id).subscribe((data: any) => {
          const metaData: any = data.reason;
          // this.featuresList.splice(index, 1);
          this.getCountry(this.requestPara);
          this.selection.clear();
          swal.fire(
            '',
            this.translate.instant('Swal_Message.Country has been deleted successfully'),
            'success'
          );
          if((this.countryList.length - 1) == 0){
            let pageNumber = this.page - 1 
            this.pageChanged(pageNumber)
            // that.getRole(this.requestParaR);
            this.table.renderRows();
          }
          else{
            that.getCountry(this.requestPara);
          }
          this.selection.clear();
        }, (err: any) => {
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
      this.getCountry(this.requestPara = {
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
    this.getCountry(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getCountry(this.requestPara = {
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
    this.getCountry(this.requestPara = {
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
    this.getCountry(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  // multiple delete
  checkboxvalue: boolean = false;

  toggleAllSelection(checkboxvalue: any){
    for (var i = 0; i < this.countryList.length; i++) {
      this.countryList[i].checked = checkboxvalue.checked;
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
    const numRows = this.countryList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.countryList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  countrysID=[]
  deleteMultiCountry(){

    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected Countries ?',
        heading: 'Delete Countries',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this

    this.helper.toggleLoaderVisibility(true);
    for(let i = 0 ; i < this.selection.selected.length;i++){
      if(this.selection.selected){
        let paraName: string = this.selection.selected[i].id;
        this.countrysID.push(paraName);
      }
    }
    if(this.countrysID.length > 0){
      this.helper.deleteMultiCountry(this.countrysID).subscribe((res: any)=>{
        if(res.statusCode === 200){
          this.getCountry(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          this.selection.clear();
          this.countrysID = [];
          swal.fire(
            '',
            this.translate.instant('Swal_Message.Country has been deleted successfully'),
            'success'
          );
          setTimeout(() => {
            if((this.countryList.length) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getCountry(this.requestPara);
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
        this.translate.instant('Please select atleast one country to delete.'),
        'info'
      );
    }

  }});}
}
