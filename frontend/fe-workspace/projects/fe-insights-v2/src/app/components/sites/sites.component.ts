import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DeletePopupComponent} from '../../popup/delete-popup/delete-popup.component';
import {SiteService} from '../../../../../fe-common-v2/src/lib/services/site.service';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ApiService, buildRequest} from '../../../../../fe-common-v2/src/lib/services/api';
import {Subject} from 'rxjs';
import {debounceTime} from "rxjs/operators";
import swal from "sweetalert2";
import {MCPHelperService} from '../../service/MCPHelper.service';
import {TranslateService} from "@ngx-translate/core";
import { SelectionModel } from '@angular/cdk/collections';
import {SitesStatusChangePopupComponent} from "../../popup/sites-status-change-popup/sites-status-change-popup.component";
import { Router } from '@angular/router';

// import { ApiService} from './api';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  siteList: any = new MatTableDataSource([]);
  sidebarMenuName:string;
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
  companyId: any;
  search1: any = null;
  // public requestPara1 = {companyId: '' , search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  sitesDisplayedColumns: string[] = ['select','wheelAction', 'key', 'name','siteTypes', 'status', 'officeIn', 'officeOut'];
  public requestPara = {companyId: '' , search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: ''};
  @ViewChild('table') table: MatTable<any>;

  private subject: Subject<string> = new Subject();

  constructor(public dialog: MatDialog,
              private apiServices: SiteService,
              public router: Router,
              private helper: MCPHelperService,
              private translate: TranslateService) {

    this._setSearchSubscription();
  }
   // public requestPara = {companyId: this.companyId , search: '', page: 1, limit: this.limit, sortBy: '', sortKey: ''};

  ngOnInit(): void {
    this.sideMenuName();
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
    // const request = { search: '', page: this.page, limit: this.limit, sortBy: '', sortKey: '' };
    this.getSite(this.requestPara);
  }

  sideMenuName(){
    this.sidebarMenuName = 'Sites';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  edit(event): void {
    this.router.navigate([`sites/add-edit-site/` + event.id]);
  }

  getSite(req: any): void {
    this.apiServices.getSites( {
      companyId: this.companyId,
      page: this.page,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    }).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(true);
      if (res.statusCode === 200) {
        this.helper.toggleLoaderVisibility(false);
        this.siteList = res.data;
        this.totalItems = res.meta.totalCount;
        this.noRecordFound = this.siteList.length > 0;
      }else {
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(res.reason),
          'info'
        );
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
    this.helper.toggleLoaderVisibility(false);
  }

  siteDeleteDialog(event: any): void {
    const that = this
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this site?', heading: 'Delete Site'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiServices.deleteSite(event.id).subscribe((data: any) => {
          const metaData: any = data.reason;
          // this.featuresList.splice(index, 1);
          this.getSite(this.requestPara);
          this.selection.clear();
          swal.fire(
            '',
            this.translate.instant('SITE_DELETED_SUCCESSFULLY'),
            'success'
          );
          if((this.siteList.length - 1) == 0){
            let pageNumber = this.page - 1
            this.pageChanged(pageNumber)
            // that.getRole(this.requestParaR);
            this.table.renderRows();
          }
          else{
            that.getSite(this.requestPara);
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
      this.getSite(this.requestPara = {
        companyId: this.companyId,
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
    this.selection.clear();
    this.itemsPerPage = event
    this.limit = this.itemsPerPage;
    this.page = 1;
    this.getSite(this.requestPara = {
      companyId: this.companyId,
      page: this.page, limit: this.limit, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.page = page
    this.getSite(this.requestPara = {
      companyId: this.companyId,
      page : this.page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
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
    this.getSite(this.requestPara = {
      companyId: this.companyId,
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }


  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void {
    this.selection.clear();
    this.myInputVariable.nativeElement.value = '';
    this.search = '';
    this.page = 1;
    const request = {companyId: this.companyId , search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
    this.getSite(request);
  }

  // multiple delete
  checkboxvalue: boolean = false;

  toggleAllSelection(checkboxvalue: any){
    for (var i = 0; i < this.siteList.length; i++) {
      this.siteList[i].checked = checkboxvalue.checked;
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
    const numRows = this.siteList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.siteList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  sitesID=[]
  async deleteMultiSites(){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected Sites?',
        heading: 'Delete Sites',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this

    this.helper.toggleLoaderVisibility(true);
    this.selectedItems();
    if(this.sitesID.length > 0){
      this.helper.deleteMultiSites({id:this.sitesID}).subscribe((res: any)=>{
        if(res.result === true){
          this.getSite(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          this.selection.clear();
          this.sitesID=[];
          swal.fire(
            '',
            this.translate.instant('SITE_DELETED_SUCCESSFULLY'),
            'success'
          );
          setTimeout(() => {
            if((this.siteList.length) == 0){
              let pageNumber = this.page - 1
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getSite(this.requestPara);
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
      }, (err) => {
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
              '',
              this.translate.instant(err.error.message),
              'info'
          );
      });
    }else{
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant('Please select atleast one site to delete.'),
        'info'
      );
    }
  }});}

  async selectedItems(){
    for(let i = 0 ; i < this.selection.selected.length;i++){
      if(this.selection.selected){
        let paraName:string = this.selection.selected[i].id;
        console.log('paraName',paraName);
        this.sitesID.push(paraName);
      }
    }
  }

  openChangeStatusPopup(){

    this.selectedItems();
    if(this.sitesID.length > 0){
      const dialogRef = this.dialog.open(SitesStatusChangePopupComponent, {
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.statusResult){
          console.log('this.sitesID>>>>>', result.globalStatus + ' ------' + this.sitesID);
          this.apiServices.changeSites({id:this.sitesID, status: result.globalStatus}).subscribe((res: any)=>{
            if(res.result === true){
              this.getSite(this.requestPara);
              this.helper.toggleLoaderVisibility(false);
              this.selection.clear();
              this.sitesID=[];
              swal.fire(
                '',
                this.translate.instant('SITE_STATUS_CHANGE_SUCCESSFULLY'),
                'success'
              );

            }else{
              this.helper.toggleLoaderVisibility(false);
              swal.fire(
                '',
                this.translate.instant(res.reason),
                'error'
              );
            }
          }, (err) => {
              this.helper.toggleLoaderVisibility(false);
              swal.fire(
                  '',
                  this.translate.instant(err.error.message),
                  'info'
              );
          });
        }
      });
    }else{
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant('Please select atleast one site.'),
        'info'
      );
    }
  }
}


