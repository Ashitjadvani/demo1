import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import {Subject} from "rxjs";
import {AddressManagementService} from "../../../../../../fe-common-v2/src/lib/services/address-management.service";
import {Router} from "@angular/router";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import swal from "sweetalert2";
import {debounceTime} from "rxjs/operators";
import {SelectionModel} from "@angular/cdk/collections";
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {

  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortBy: any = '-1';
  sortKey = null;
  sortClass: any = 'down';
  regionList: any[] = [];
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

  resourceGroupList=[
    {resourceType:'Room',name:'Conference Room',description:'Meeting Room Assets',availabilityStart:'04:30',availabilityHours:"24"},
    {resourceType:'Parking',name:'Vehicle Parking',description:'Lorem Ipsum',availabilityStart:'04:00',availabilityHours:"12"},
    {resourceType:'Desk',name:'Hotel Desk',description:'Lorem Ipsum',availabilityStart:'05:50',availabilityHours:"06"},
    {resourceType:'E-Charger',name:'Car E-Charger',description:'Lorem Ipsum',availabilityStart:'12:30',availabilityHours:"11"},
    {resourceType:'Car Wash',name:'Car Wash',description:'Lorem Ipsum',availabilityStart:'06:55',availabilityHours:"08"},
    {resourceType:'Other',name:'Lorem Ipsum',description:'Lorem Ipsum',availabilityStart:'11:45',availabilityHours:"10"}


  ]
  resourceGroupDisplayedColumns: string[]= ['select', 'wheelAction', 'Country', 'Region'];

  ngOnInit(): void {
    this.sideMenuName();
    this.getRegion({});
  }

  sideMenuName(){
    this.sidebarMenuName = 'Region'; 
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  edit(event){
    this.router.navigate([`address-management/region/add-edit-region/` + event.id])
  }
  getRegion(request): any {
    this.ApiService.getRegionList(this.requestPara).subscribe((res: any) => {
      this.helper.toggleLoaderVisibility(true);
      if (res.statusCode === 200) {
        this.regionList = res.data;
        this.totalItems = res.meta.totalCount;
        this.noRecordFound = this.regionList.length > 0;
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
  openAccountDeleteDialog(event: any){
    const that = this
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this Region ?', heading: 'Delete Region'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ApiService.deleteRegion(event.id).subscribe((data: any) => {
          const metaData: any = data.reason;
          // this.featuresList.splice(index, 1);
          this.getRegion(this.requestPara);
          this.selection.clear();
          swal.fire(
            '',
            this.translate.instant('Swal_Message.Region has been deleted successfully'),
            'success'
          );
          if((this.regionList.length - 1) == 0){
            let pageNumber = this.page - 1 
            this.pageChanged(pageNumber)
            // that.getRole(this.requestParaR);
            this.table.renderRows();
          }
          else{
            that.getRegion(this.requestPara);
          }
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
      this.getRegion(this.requestPara = {
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
    this.getRegion(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getRegion(this.requestPara = {
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
    this.getRegion(this.requestPara = {
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
    this.getRegion(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  // multiple delete
  checkboxvalue: boolean = false;

  toggleAllSelection(checkboxvalue: any){
    for (var i = 0; i < this.regionList.length; i++) {
      this.regionList[i].checked = checkboxvalue.checked;
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
    const numRows = this.regionList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.regionList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  regionsID=[]
  deleteMultiRegion(){

    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected Regions?',
        heading: 'Delete Regions',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this

    this.helper.toggleLoaderVisibility(true);
    for(let i = 0 ; i < this.selection.selected.length;i++){
      if(this.selection.selected){
        let paraName: string = this.selection.selected[i].id;
        this.regionsID.push(paraName);
      }
    }
    if(this.regionsID.length > 0){
      this.helper.deleteMultiRegion(this.regionsID).subscribe((res: any)=>{
        if(res.statusCode === 200){
          this.getRegion(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          this.selection.clear();
          this.regionsID = [];
          swal.fire(
            '',
            this.translate.instant('Swal_Message.Region has been deleted successfully'),
            'success'
          );
          setTimeout(() => {
            if((this.regionList.length) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getRegion(this.requestPara);
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
      });
    }else{
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant('Please select atleast one region to delete.'),
        'info'
      );
    }

  }});}
}
