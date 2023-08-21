import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DeletePopupComponent } from 'projects/fe-insights-v2/src/app/popup/delete-popup/delete-popup.component';
import swal from 'sweetalert2';
import {QuizSurveyService} from '../../../../../../../fe-common-v2/src/lib/services/quiz-survey.service';
import {MCPHelperService} from '../../../../service/MCPHelper.service';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import { promise } from 'protractor';
import { TklabMqsService } from 'projects/fe-common-v2/src/lib/services/tklab.mqs.service';
import { Subject } from 'rxjs';
import {debounceTime} from 'rxjs/operators';


@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss']
})
export class ViewSurveyComponent implements OnInit {

  surveyDetails: any = new MatTableDataSource([]);
  metricsData : any[] = [];
  questionData = [];
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortKey: any = '-1';
  sortBy = null;
  sortClass: any = 'down';
  noRecordFound = false;
  id:any;

  survey_id = this.activitedRoute.snapshot.paramMap.get('id')
  public requestPara = {survey_id: this.survey_id,search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};
  private subject: Subject<string> = new Subject();
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private activitedRoute: ActivatedRoute,
    private ApiService: QuizSurveyService,
    private helper: MCPHelperService,
    private tklabMqsService:TklabMqsService,
    public translate: TranslateService) {
      this._setSearchSubscription()
  }

  fitIndexList = []

  fitIndexDisplayedColumns: string[] = ['metric','operator','value','textResult','scalarResult']

  ngOnInit(): void {
  this.getdetails();
  this.getFitIndexList(this.requestPara);
  }
  async getdetails(): Promise<void> {
    const id = this.activitedRoute.snapshot.paramMap.get('id');
    this.id = id;
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.viewSurvey({surveyId: id});
    if (res.result === true) {
      this.surveyDetails = res.data[0];
      // this.metricsData = res.data[0].metricsData;
      //this.questionData = res.data[0].questions;
      await this.getQuestionList();
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
  async getQuestionList(): Promise<void>{
    const id = this.activitedRoute.snapshot.paramMap.get('id');
    this.helper.toggleLoaderVisibility(true);
    const questionList: any = await this.tklabMqsService.loadAppQuizQuestion({id : id});
    this.questionData = questionList.result;
    this.helper.toggleLoaderVisibility(false);
  }
  async getFitIndexList(request):Promise<void>{
    const id = this.activitedRoute.snapshot.paramMap.get('id');
    this.helper.toggleLoaderVisibility(true);
    // const metricList: any = await this.tklabMqsService.loadAppQuizMetricList(this.requestPara);
    const metricList: any = await this.tklabMqsService.loadlistBySurvey(this.requestPara);
    this.metricsData = metricList.result;
    //this.totalItems = metricList.result.length;
    this.totalItems = metricList.meta.totalCount;
    console.log('this.totalItems', this.totalItems);
    this.noRecordFound = this.metricsData.length > 0;
      this.helper.toggleLoaderVisibility(false);
  }

  surveyEdit(){
    this.router.navigate(['/quiz-survey/survey/add-edit-survey/' + this.id]);
  }
  openDialog() {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: { message: "Are you sure you want to delete this Survey?", heading: "Delete Survey" }
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          this.ApiService.deleteSurvey(this.id).then((data: any) => {
            const metaData: any = data.reason;
            if(data.result){
              this.router.navigate(['/quiz-survey/survey/'])
              this.helper.toggleLoaderVisibility(false);
              swal.fire(
                '',
                this.translate.instant(metaData),
                'success'
              );
            }else{
              this.helper.toggleLoaderVisibility(false);
              swal.fire(
                '',
                this.translate.instant(metaData),
                'info'
              );
            }
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

  editFitIndex(fitIndexId){
    this.router.navigate(['/quiz-survey/survey/view-survey/' + this.id  + '/add-edit-fit-index/' + fitIndexId]);
  }

  async fitIndexDeleteDialog(metricId):Promise<void>{
    const dialogRef = this.dialog.open(DeletePopupComponent,{
      data:{message:'Are you sure you want to delete this Fit-Index?',heading:'Delete Fit-Index'}
    });
    dialogRef.afterClosed().subscribe(
      result =>{
        if(result){
          this.helper.toggleLoaderVisibility(true);
          this.tklabMqsService.deleteAppSurveyMetric({id:metricId});
          this.getFitIndexList(this.requestPara);
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant('Fit index has been deleted successfully'),
            'success'
          );
        }
      }
    )

  }


    // Pagination
    changeItemsPerPage(): void {
      this.search = '';
      this.page = 1;
      // this.limit = this.itemsPerPage;
      this.getFitIndexList(this.requestPara = {
        survey_id: this.survey_id,
        page: 1, limit: this.itemsPerPage, search: this.search,
        sortBy: this.sortKey,
        sortKey: this.sortBy
      });
      this.limit = this.itemsPerPage;
    }

    pageChanged(page: number): void {
      this.search = '';
      this.page = page;
      this.getFitIndexList(this.requestPara = {
        survey_id: this.survey_id,
        page: this.page, limit: this.itemsPerPage, search: this.search,
        sortBy: this.sortKey,
        sortKey: this.sortBy,
      });
      // this.page = page;
    }

    // Sorting
    changeSorting(sortBy, sortKey): void {
      this.sortBy = sortBy;
      this.sortKey = (sortKey === '-1') ? '1' : '-1';
      this.getFitIndexList(this.requestPara = {
        survey_id: this.survey_id,
        page: 1,
        limit: this.limit,
        search: this.search,
        sortBy: this.sortKey,
        sortKey: this.sortBy
      });
    }

    // search reset
    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch(){
      this.search = '';
      this.myInputVariable.nativeElement.value = '';
      this.getFitIndexList(this.requestPara = {
        survey_id: this.survey_id,
        page: 1,
        limit: this.limit,
        search: '',
        sortBy: this.sortKey,
        sortKey: this.sortBy});
    }

    private _setSearchSubscription(): void {
      this.subject.pipe(
        debounceTime(500)
      ).subscribe((searchValue: string) => {
        this.page = 1;
        this.getFitIndexList(this.requestPara = {
          survey_id: this.survey_id,
          page: 1,
          limit: this.limit,
          search: this.search,
          sortBy: this.sortKey,
          sortKey: this.sortBy
        });
      });
    }

    onKeyUp(searchTextValue: any): void {
      this.subject.next(searchTextValue);
    }

    changeSelectOption(){}


}
