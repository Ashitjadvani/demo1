import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import swal from 'sweetalert2';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {QuizQuizService} from '../../../../../../fe-common-v2/src/lib/services/quiz-quiz.service';
import {debounceTime} from 'rxjs/operators';
import {Router} from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  quizList: any = new MatTableDataSource([]);
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

  questionsList = []
  @ViewChild('table') table: MatTable<any>;

  questionsDisplayedColumns : string[] = ['select','wheelAction', 'category','code','question','mandatory','questionType']



  constructor(public dialog:MatDialog,
              private ApiService: QuizQuizService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router) {
    this._setSearchSubscription();
  }


  ngOnInit(): void {
    this.sideMenuName();
    this.getQuizList(this.requestPara);
  }
  sideMenuName(){
    this.sidebarMenuName = 'Questions';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
  async getQuizList(request): Promise<void> {
    // let err: any;
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getQuiz(this.requestPara);
    if (res.statusCode === 200) {
      this.quizList = res.data;
      this.totalItems = res.meta.totalCount;
      localStorage.setItem('totalQuestionCount', res.meta.totalCount);
      this.noRecordFound = this.quizList.length > 0;
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

  questionsDeleteDialog(event: any){
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent,{
      data: {message: 'Are you sure you want to delete this Question', heading: 'Delete Question'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteQuiz(event.id).then((data: any) => {
            const metaData: any = data.reason;
            if(data.result){
            this.getQuizList(this.requestPara);
            this.selection.clear();
            swal.fire(
              '',
              this.translate.instant('Swal_Message.Question deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            if((this.quizList.length - 1) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getQuizList(this.requestPara);
            }
            this.selection.clear();
            }else{
              swal.fire(
                '',
                this.translate.instant(data.reason),
                'info'
              );
              this.getQuizList(this.requestPara);
              this.selection.clear();
              this.helper.toggleLoaderVisibility(false);
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

  changeItemsPerPage(event): void {
    // this.search = '';
    this.selection.clear();
    this.page = 1;
    this.itemsPerPage = event
    this.getQuizList(this.requestPara = {
      page: 1, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.limit = this.itemsPerPage;
  }

  pageChanged(page: number): void {
    // this.search = '';
    this.selection.clear();
    this.getQuizList(this.requestPara = {
      page, limit: this.itemsPerPage, search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
    this.page = page;
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
      this.page = 1;
      this.selection.clear();
      this.getQuizList(this.requestPara = {
        page: 1,
        limit: this.limit,
        search: this.search,
        sortBy: this.sortBy,
        sortKey: this.sortKey
      });
    });
  }
  // Sorting
  changeSorting(sortKey, sortBy): void {
    this.selection.clear();
    this.sortKey = sortKey;
    this.sortBy = (sortBy === '-1') ? '1' : '-1';
    this.page = 1;
    this.getQuizList(this.requestPara = {
      page: 1,
      limit: this.limit,
      search: this.search,
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  // search reset
  @ViewChild('searchBox') myInputVariable: ElementRef;
  resetSearch(): void{
    this.selection.clear();
    this.search = '';
    this.myInputVariable.nativeElement.value = '';
    this.page = 1;
    this.getQuizList(this.requestPara = {  page: 1,
      limit: this.limit,
      search: '',
      sortBy: this.sortBy,
      sortKey: this.sortKey
    });
  }
  // View Detail
  viewDetail(event): void {
    this.router.navigate([`/quiz-survey/questions/view-question/` + event.id]);
  }
  // Edit
  edit(event): void {
    this.router.navigate([`/quiz-survey/questions/add-edit-question/` + event.id]);
  }

  // multiple delete
checkboxvalue: boolean = false;

toggleAllSelection(checkboxvalue: any){
  for (var i = 0; i < this.quizList.length; i++) {
    this.quizList[i].checked = checkboxvalue.checked;
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
    const numRows = this.quizList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.quizList);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  questionID=[]
  async deleteMultiQuestion(){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message:
          'Are you sure you want to delete selected Questions?',
        heading: 'Delete Questions',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const that = this

    this.helper.toggleLoaderVisibility(true);
    this.selectedItems();
    if(this.questionID.length > 0){
      this.helper.deleteMultiQuestions({id:this.questionID}).subscribe((res: any)=>{
        if(res.result === true){
          this.getQuizList(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          this.selection.clear();
          this.questionID=[];
          swal.fire(
            '',
            this.translate.instant('Swal_Message.Question deleted successfully'),
            'success'
          );
          setTimeout(() => {
            if((this.quizList.length) == 0){
              let pageNumber = this.page - 1 
              this.pageChanged(pageNumber)
              // that.getRole(this.requestParaR);
              this.table.renderRows();
            }
            else{
              that.getQuizList(this.requestPara);
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
        this.translate.instant('Please select atleast one question to delete.'),
        'info'
      );
    }
  }});}

  async selectedItems(){
    for(let i = 0 ; i < this.selection.selected.length;i++){
      if(this.selection.selected){
        let paraName:string = this.selection.selected[i].id;
        console.log('paraName',paraName);
        this.questionID.push(paraName);
      }
    }
  }
}
