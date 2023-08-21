import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from 'projects/fe-insights-v2/src/app/popup/delete-popup/delete-popup.component';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {QuizQuizService} from "../../../../../../../fe-common-v2/src/lib/services/quiz-quiz.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import { AddEditSideEffectComponent } from '../../../../popup/add-edit-side-effect/add-edit-side-effect.component';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.scss']
})
export class ViewQuestionComponent implements OnInit {
  quizDetails: any = new MatTableDataSource([]);
  option: any[] = [];
  noRecordFound = false
  dataSourceTable :any = new MatTableDataSource<any>() ;
  constructor(private dialog:MatDialog,
              private router: Router,
              private activitedRoute: ActivatedRoute,
              private ApiService: QuizQuizService,
              private helper: MCPHelperService,
              public translate: TranslateService) { }

  public question_data: any[] =[
    {order: 1,answer:4},
    {order: 2,answer:8},
  ];
  // optionDisplayedColumns: string[] = ['order','answer', 'sideEffect','action'];
  optionDisplayedColumns: string[] = ['order','answer'];


  ngOnInit(): void {
    this.getdetails();
  }
  async getdetails(): Promise<void> {
    const id = this.activitedRoute.snapshot.paramMap.get('id');
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.viewQuiz({id: id});
    if (res.result === true) {
      this.quizDetails = res.reason;
      // this.option = res.reason.answers;
      res.reason.answers.forEach(x => {
        this.option.push(x)
      })
      this.dataSourceTable.data = this.option
      this.noRecordFound = this.option.length > 0 ;
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

  questionsDeleteDialog(id: any){
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent,{
      data: {message: 'Are you sure you want to delete this Question', heading: 'Delete Question'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteQuiz(id).then((data: any) => {
            const metaData: any = data.reason;
            swal.fire(
              '',
              this.translate.instant('Swal_Message.Question deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
          }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire(
              '',
              this.translate.instant(err.error.message),
              'info'
            );
          });
        }
      });
  }
  // Edit
  edit(id: string): void {
    this.router.navigate([`/quiz-survey/questions/add-edit-question/` + id]);
  }
  addEditSideEffect(element){
    // const id = this.route.snapshot.paramMap.get('id');
    const dialogRef = this.dialog.open(AddEditSideEffectComponent, {
      data : {
        currentElement: element,
        questionId: null,
        readonly: true
      }
    });
  }

}
