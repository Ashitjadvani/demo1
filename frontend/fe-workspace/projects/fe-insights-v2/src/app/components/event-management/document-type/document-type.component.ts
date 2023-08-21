import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Subject} from 'rxjs';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import swal from 'sweetalert2';
import {MatDialog} from '@angular/material/dialog';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {MasterDocumentTypeService} from '../../../../../../fe-common-v2/src/lib/services/master-document-type.service';
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.scss']
})
export class DocumentTypeComponent implements OnInit {
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

  constructor(
    public dialog: MatDialog,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private router: Router,
    private ApiService: MasterDocumentTypeService
  ) {
    this._setSearchSubscription();
  }

  documentDisplayedColumns: string[] = ['select', 'wheelAction', 'documentsTypeName', 'CreatedDate', 'UpdatedDate'];


  ngOnInit(): void {
    this.getDocumentType({});
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
    this.getDocumentType(this.requestPara = {
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
      this.getDocumentType(this.requestPara = {
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
    this.getDocumentType(this.requestPara = {
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
    this.router.navigate([`event-management/document-type/add-edit-document-type/` + event.id]);
  }

  changeSorting(sortKey, sortBy): void {
    // this.search = '';
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.selection.clear();
    this.getDocumentType(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }

  deleteDocumentType(event: any): void {
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'MASTER_MODULE.Delete_Document_type', heading: 'Delete Document Type'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const that = this
          that.ApiService.deleteDocumentType({id: event.id}).then((data: any) => {
            if (data.statusCode === 200) {
              this.getDocumentType(this.requestPara);
              this.helper.toggleLoaderVisibility(false);
              this.selection.clear();
              this.documentId=[]
              swal.fire(
                '',
                this.translate.instant('Swal_Message.DELETE_DOCUMENT_TYPE'),
                'success'
              );
              setTimeout(() => {
                if ((this.documentList.length) == 0) {
                  let pageNumber = this.page - 1
                  this.pageChanged(pageNumber)
                  // that.getRole(this.requestParaR);
                  this.table.renderRows();
                } else {
                  that.getDocumentType(this.requestPara);
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

  async getDocumentType(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getDocumentType(this.requestPara);
    if (res.statusCode === 200) {
      this.documentList = res.data;
      console.log('this.costCenterList', this.documentList);
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.documentList.length > 0;
      this.helper.toggleLoaderVisibility(false);
    } else {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(res.reason),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }

  pageChanged(page): void {
    this.selection.clear();
    this.getDocumentType(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }

  deleteMultipleDocumentType() {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected document Types ?',
        heading: 'Delete Document Types',
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
          this.ApiService.multipleDeleteDocumentType({id: this.documentId}).subscribe((res: any) => {
            if (res.statusCode === 200) {
              this.getDocumentType(this.requestPara);
              this.helper.toggleLoaderVisibility(false);
              this.selection.clear();
              this.documentId = [];
              swal.fire(
                '',
                this.translate.instant('Swal_Message.DELETE_DOCUMENT_TYPE'),
                'success'
              );
              setTimeout(() => {
                if ((this.documentList.length) == 0) {
                  let pageNumber = this.page - 1
                  this.pageChanged(pageNumber)
                  // that.getRole(this.requestParaR);
                  this.table.renderRows();
                } else {
                  that.getDocumentType(this.requestPara);
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
            this.translate.instant('Please select atleast one Document Type to delete.'),
            'info'
          );
        }

      }
    });
  }
}
