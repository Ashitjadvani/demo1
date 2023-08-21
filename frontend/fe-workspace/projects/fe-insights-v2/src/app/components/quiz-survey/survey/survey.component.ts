import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import swal from 'sweetalert2';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {QuizSurveyService} from '../../../../../../fe-common-v2/src/lib/services/quiz-survey.service';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Router} from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  surveyList: any = new MatTableDataSource([]);
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
  @ViewChild('table') table: MatTable<any>;

  // surveyList = [
  //   {title:'Maths',subtitle:'Multiply',category:'Mathematics',startDate:'10/02/2022',endDate:'12/02/2022',privacy:'Only Manager'},
  //   {title:'Develop',subtitle:'Build',category:'Development',startDate:'08/02/2022',endDate:'10/02/2022',privacy:'Only Coach'},
  //   {title:'Web Design',subtitle:'UI/UX',category:'Design',startDate:'07/02/2022',endDate:'09/02/2022',privacy:'Only User'},
  //   {title:'Graphics',subtitle:'Multiply',category:'UI/UX',startDate:'05/02/2022',endDate:'07/02/2022',privacy:'Inherit'},
  //   {title:'Code',subtitle:'Build',category:'Java Developer',startDate:'03/02/2022',endDate:'05/02/2022',privacy:'Only Manager'},
  //   {title:'Maths',subtitle:'UI/UX',category:'Mathematics',startDate:'02/02/2022',endDate:'04/02/2022',privacy:'Only Coach'},
  //   {title:'Web Design',subtitle:'Multiply',category:'Design',startDate:'01/02/2022',endDate:'03/02/2022',privacy:'Only User'},
  // ]

  surveyDisplayedColumns: string[] = ['select','wheelAction', 'title','subtitle','scope','startDate','endDate']


  constructor(public dialog:MatDialog,
              private ApiService: QuizSurveyService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router) {
    this._setSearchSubscription();
  }

  ngOnInit(): void {
    this.sideMenuName();
    this.getSurveyList(this.requestPara);
  }
  sideMenuName(){
    this.sidebarMenuName = 'Survey';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

  edit(event): void {
    this.router.navigate([`quiz-survey/survey/add-edit-survey/` + event.id]);
  }

  async getSurveyList(request): Promise<void> {
    // let err: any;
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getSurvey(this.requestPara);
    if (res.statusCode === 200) {
      this.surveyList = res.data;
      this.totalItems = res.meta.totalCount;
      this.noRecordFound = this.surveyList.length > 0;
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

  surveyDeleteDialog(event: any): void{
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent,{
      data: {message: 'Are you sure you want to delete this Survey?', heading: 'Delete Survey'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteSurvey(event.id).then((data: any) => {
            const metaData: any = data.reason;
            if(data.result){
              this.getSurveyList(this.requestPara);
              this.selection.clear();
              swal.fire(
                '',
                this.translate.instant(metaData),
                'success'
              );
              this.helper.toggleLoaderVisibility(false);
              if((this.surveyList.length - 1) == 0){
                let pageNumber = this.page - 1 
                this.pageChanged(pageNumber)
                // that.getRole(this.requestParaR);
                this.table.renderRows();
              }
              else{
                that.getSurveyList(this.requestPara);
              }
              this.selection.clear();
            }else{
              this.helper.toggleLoaderVisibility(false);
              swal.fire(
                '',
                this.translate.instant(metaData),
                'info'
              );
              this.selection.clear();
            }
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


  // Pagination
  changeItemsPerPage(event): void {
    // this.search = '';
    this.selection.clear();
    this.page = 1;
    this.itemsPerPage = event
    this.getSurveyList(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page: number): void {
    // this.search = '';
    this.selection.clear();
    this.getSurveyList(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
  }

  // Sorting
  changeSorting(sortKey, sortBy): void {
    this.selection.clear();
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.getSurveyList(this.requestPara = {
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
      this.getSurveyList(this.requestPara = {
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
    this.getSurveyList(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  // View Detail
  viewDetail(event): void {
    this.router.navigate([`/quiz-survey/survey/view-survey/` + event.id]);
  }
// multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.surveyList.length; i++) {
    this.surveyList[i].checked = checkboxvalue.checked;
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
    const numRows = this.surveyList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.surveyList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  surveyID=[]
  async deleteMultiSurvey(){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected Surveys?',
        heading: 'Delete Surveys',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this

    this.helper.toggleLoaderVisibility(true);
    this.selectedItems();
    if(this.surveyID.length > 0){
      this.helper.deleteMultiSurvey({id:this.surveyID}).subscribe((res: any)=>{
        if(res.result === true){
          this.getSurveyList(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          this.selection.clear();
          this.surveyID=[];
          swal.fire(
            '',
            this.translate.instant('Survey has been deleted successfully'),
            'success'
          );
          setTimeout(() => {
            if((this.surveyList.length) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getSurveyList(this.requestPara);
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
        this.translate.instant('Please select atleast one survey to delete.'),
        'info'
      );
    }
  }});}

  async selectedItems(){
    for(let i = 0 ; i < this.selection.selected.length;i++){
      if(this.selection.selected){
        let paraName:string = this.selection.selected[i].id;
        console.log('paraName',paraName);
        this.surveyID.push(paraName);
      }
    }
  }
}
