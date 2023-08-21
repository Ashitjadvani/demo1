import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../popup/delete-popup/delete-popup.component';
import { QrCodeDialogComponent } from '../../popup/qr-code-dialog/qr-code-dialog.component';
import { UnlockPairingDialogComponent } from '../../popup/unlock-pairing-dialog/unlock-pairing-dialog.component';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {TouchpointManagementService} from '../../../../../fe-common-v2/src/lib/services/touchpoint-management.service';
import {MCPHelperService} from '../../service/MCPHelper.service';
import {debounceTime} from 'rxjs/operators';
import {TouchPoint} from '../../../../../fe-common-v2/src/lib/models/touchpoint';
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";
import {
  ConfirmDialogData
} from "../../../../../fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component";
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-touchpoint-management',
  templateUrl: './touchpoint-management.component.html',
  styleUrls: ['./touchpoint-management.component.scss']
})
export class TouchpointManagementComponent implements OnInit {

  touchPointList: any = new MatTableDataSource([]);
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
  showAlert: false;
  openDialog:boolean = false;
  site:any;
  discription:any;
  
  showQR: boolean = false;
  loginQR: string;
  nameQR: string;
  qrLevel: string = 'Q';
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();
  sidebarMenuName:string;
  @ViewChild('table') table: MatTable<any>;
  constructor(public dialog: MatDialog,
              private ApiService: TouchpointManagementService,
              private helper: MCPHelperService,
              public translate: TranslateService) {
    this._setSearchSubscription();
  }

  touchpointList=[]
  touchpointDisplayedColumns: string[]= ['select','wheelAction', 'touchpointID','deviceID','site','description','startedAt','lastkeepAlive','officeIn','officeOut']


  ngOnInit(): void {
    this.sideMenuName();
    this.getTouchpoints(this.requestPara);
  }

  sideMenuName(){
    this.sidebarMenuName = 'Touchpoint Management';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

  async getTouchpoints(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getTouchPointList(this.requestPara);
    if (res.statusCode === 200) {
      this.touchPointList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.touchPointList.length > 0;
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
  openAccountDeleteDialog (event: any){
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this touchpoint?', heading: 'Delete Touchpoint'}
    });
    dialogRef.afterClosed().subscribe(
      result => {

        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteTouchpoints(event.id).then((data: any) => {
            const metaData: any = data.reason;
            this.getTouchpoints(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('TOUCH_POINTS.Touchpoint has been deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.touchPointList.length - 1) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getTouchpoints(this.requestPara);
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


   openUnlockDialog(event:any){
/*    let res = await this.dialog.open(UnlockPairingDialogComponent, {
      // width: '400px',
      panelClass: 'custom-dialog-container',
      data: new ConfirmDialogData(this.translate.instant('INSIGHTS_PEOPLE_PAGE.Unlock Touchpoint Pairing'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
    }).afterClosed().toPromise();
    if (res) {
      await this.ApiService.touchPointUnlockPairing(tp.id);
   this.getTouchpoints(this.requestPara);
    }*/
    this.selection.clear();
    const dialogRef = this.dialog.open(UnlockPairingDialogComponent, {
      data: {message: 'Are you sure you want to unlock pairing this touchpoint?', heading: 'Unlock Pairing'}
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
         this.ApiService.touchPointUnlockPairing(event.id);
        this.getTouchpoints(this.requestPara);
      }
    });
  }

  openQRDialog(event:any){
    this.selection.clear();
    for(let i = 0;i < this.touchPointList.length;i++){
      if(this.touchPointList[i].id == event.id){
        this.site = this.touchPointList[i].name;
        this.discription = this.touchPointList[i].description; 
        this.openDialog = true;
        break
      }
    }
    if(this.openDialog){
      const dialogRef = this.dialog.open(QrCodeDialogComponent,{
        data: {id:event.id,site:this.site,discription:this.discription}
      });
    }
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
    this.getTouchpoints(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page): void {
    // this.search = '';
    this.selection.clear();
    this.getTouchpoints(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
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
    this.getTouchpoints(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }

  private _setSearchSubscription(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.selection.clear();
      this.page = 1;
      this.getTouchpoints(this.requestPara = {
        page: 1,
        limit: this.limit,
        search: this.search,
        sortBy: this.sortBy,
        sortKey: this.sortKey
      });
    });
  }

  showAlerts(touchPoint: TouchPoint) {
    return touchPoint.showAlert;
  }
  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void{
    this.selection.clear();
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    this.getTouchpoints(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
/*  onShowLoginQR(tp: TouchPoint) {
    this.showQR = true;
    this.nameQR = tp.name + '-' + tp.description;
    // this.loginQR = window.location.protocol + '//' + window.location.host + '/login?u=TOUCHPOINTID\\' + tp.id;
    this.loginQR = window.location.protocol + '//' + window.location.host + '/touchpoint/' + tp.id;
  }*/

// multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.touchPointList.length; i++) {
    this.touchPointList[i].checked = checkboxvalue.checked;
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
  const numRows = this.touchPointList.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRows() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.touchPointList);
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}


touchPointID=[]
deleteMultiTouchPoint(){

  const dialogRef = this.dialog.open(DeletePopupComponent, {
    data: {
      message:
        'Are you sure you want to delete selected Touchpoints ?',
      heading: 'Delete Touchpoints',
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
      this.touchPointID.push(paraName);
    }
  }
  if(this.touchPointID.length > 0){
    this.helper.deleteMultiTouchPoints({id:this.touchPointID}).subscribe((res: any)=>{
      if(res.result === true){
        this.getTouchpoints(this.requestPara);
        this.helper.toggleLoaderVisibility(false);
        this.selection.clear();
        this.touchPointID = [];
        swal.fire(
          '',
          this.translate.instant('TOUCH_POINTS.Touchpoint has been deleted successfully'),
          'success'
        );
        setTimeout(() => {
          if((this.touchPointList.length) == 0){
            let pageNumber = this.page - 1 
            this.pageChanged(pageNumber)
            // that.getRole(this.requestParaR);
            this.table.renderRows();
          }
          else{
            that.getTouchpoints(this.requestPara);
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
      this.translate.instant('Please select atleast one touchpoint to delete.'),
      'info'
    );
  }

}});}


}
