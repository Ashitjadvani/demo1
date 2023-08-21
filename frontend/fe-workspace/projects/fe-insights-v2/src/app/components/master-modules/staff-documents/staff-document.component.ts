import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Subject} from 'rxjs';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import swal from 'sweetalert2';
import {MatDialog} from '@angular/material/dialog';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {MasterStaffDocumentService} from '../../../../../../fe-common-v2/src/lib/services/staff-document.service';
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-document-type',
  templateUrl: './staff-document.component.html',
  styleUrls: ['./staff-document.component.scss']
})
export class StaffDocumentComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);
  private subject: Subject<string> = new Subject();
  search: any = '';
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  sortBy: any = '-1';
  sortKey = null;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  page: any = 1;
  noRecordFound = false;
  @ViewChild('searchBox') myInputVariable: ElementRef;
  @ViewChild('table') table: MatTable<any>;
  documentList: any = new MatTableDataSource([]);
  documentId = [];
    companyId: any;

  constructor(
    public dialog: MatDialog,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private router: Router,
    private ApiService: MasterStaffDocumentService
  ) {
    this._setSearchSubscription();
  }

  documentDisplayedColumns: string[] = ['select', 'wheelAction', 'documentsTypeName', 'isExpired', 'CreatedDate', 'UpdatedDate'];


  ngOnInit(): void {

      const credentials = localStorage.getItem('credentials');
      if (credentials) {
          const authUser: any = JSON.parse(credentials);
          this.companyId = authUser.person.companyId;
      }
      this.getStaffDocument({});
  }

  onKeyUp(searchTextValue: any): void {
    this.selection.clear();
    this.subject.next(searchTextValue);
  }

  resetSearch(): void {
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    this.selection.clear();
    this.getStaffDocument(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }

  private _setSearchSubscription(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe((searchValue: string) => {
      this.page = 1;
      this.selection.clear();
      this.getStaffDocument(this.requestPara = {
        page: 1,
        limit: this.limit,
        search: this.search,
        sortBy: this.sortBy,
        sortKey: this.sortKey
      });
    });
  }

  changeItemsPerPage(event): void {
    // this.search = '';
    this.page = 1;
    this.itemsPerPage = event;
    this.selection.clear();
    this.getStaffDocument(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.documentList);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.documentList.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  addEditDocument(event: any): void {
    this.router.navigate([`master-modules/staff-documents/add-edit-staff-document/` + event.id]);
  }

  changeSorting(sortKey, sortBy): void {
    // this.search = '';
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.selection.clear();
    this.getStaffDocument(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }

  deleteStaffDocument(event: any): void {
      console.log("event===========>",event)
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'MASTER_MODULE.Delete_Staff_Document', heading: 'MASTER_MODULE.Delete Staff Document'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const that = this
            let data={
            id: event.id,
                deleted : true,
                companyId: event.companyId,
                 createdAt: new Date(event.createdAt),
                isMandatory: true,
                name: event.name
            }
            console.log("data",data)
          that.ApiService.addStaffDocument(data).then((data: any) => {
            if (data.result === true) {
                console.log(data)
              this.getStaffDocument(this.requestPara);
              this.helper.toggleLoaderVisibility(false);
              this.selection.clear();
              this.documentId=[]
              swal.fire(
                '',
                this.translate.instant('staffDocumentDeletedSuccessfully'),
                'success'
              );
              setTimeout(() => {
                if ((this.documentList.length) == 0) {
                  let pageNumber = this.page - 1
                  this.pageChanged(pageNumber)
                  // that.getRole(this.requestParaR);
                  this.table.renderRows();
                } else {
                  that.getStaffDocument(this.requestPara);
                }
              }, 100);

            } else {
              this.helper.toggleLoaderVisibility(false);
              swal.fire(
                '',
                this.translate.instant(data.reason),
                'info'
              );
              this.selection.clear();
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
  }

  async getStaffDocument(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getStaffDocsList(this.requestPara,this.companyId);
    if (res.result === true) {
      this.documentList = res.documents;
      this.totalItems = res.totalCount;
      this.noRecordFound = this.documentList.length > 0;
      this.helper.toggleLoaderVisibility(false);
    } else {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(res.message),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }

  pageChanged(page): void {
    this.selection.clear();
    this.getStaffDocument(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }

  deleteStaffMultipleDocument() {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
            this.translate.instant('Are you sure you want to delete selected staff documents?'),
        heading: this.translate.instant('Delete Staff Documents'),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this
        this.helper.toggleLoaderVisibility(true);
        if (this.selection.selected.length > 0) {
          for (let i = 0; i < this.selection.selected.length; i++) {
            let paraName: string = this.selection.selected[i].id;
            this.documentId.push(paraName);
          }
        } else {
          this.documentId = [];
        }
        if (this.documentId.length > 0) {
          this.ApiService.multipleDeleteStaffDocument({id: this.documentId}).subscribe((res: any) => {
            if (res.result === true) {
              this.getStaffDocument(this.requestPara);
              this.helper.toggleLoaderVisibility(false);
              this.selection.clear();
              this.documentId = [];
              swal.fire(
                '',
                this.translate.instant('Swal_Message.DELETE_STAFF_DOCUMENT'),
                'success'
              );
              setTimeout(() => {
                if ((this.documentList.length) == 0) {
                  let pageNumber = this.page - 1
                  this.pageChanged(pageNumber)
                  // that.getRole(this.requestParaR);
                  this.table.renderRows();
                } else {
                  that.getStaffDocument(this.requestPara);
                }
              }, 100);

            } else {
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
        } else {
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant('selectAtleastOneStaffDocumentToDelete'),
            'info'
          );
        }

      }
    });
  }
}
