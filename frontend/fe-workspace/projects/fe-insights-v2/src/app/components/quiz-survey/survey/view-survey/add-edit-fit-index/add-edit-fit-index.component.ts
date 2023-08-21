import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { TklabMqsService } from 'projects/fe-common-v2/src/lib/services/tklab.mqs.service';
import { MCPHelperService } from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import { TranslateService } from '@ngx-translate/core';
// import { data } from 'jquery';

@Component({
  selector: 'app-add-edit-fit-index',
  templateUrl: './add-edit-fit-index.component.html',
  styleUrls: ['./add-edit-fit-index.component.scss']
})
export class AddEditFitIndexComponent implements OnInit {
  addFitIndexForm:FormGroup;
  title ='Add';
  survey_id:any;
  metricsData:any;

  metricList = [
    // {value:'SCORE',viewValue:'SCORE'},
  ]

  operatiorList = [
    {value:'==',viewValue:'equal (=)'},
    {value:'!=',viewValue:'not equal (!=)'},
    {value:'>',viewValue:'greater than (>)'},
    {value:'>=',viewValue:'greater than equal (>=)'},
    {value:'<',viewValue:'less than (<)'},
    {value:'<=',viewValue:'less than equal (<=)'}
  ]

  constructor(public _categoriesForm:FormBuilder,
    private router: Router,
    private tklabMqsService:TklabMqsService,
    private activitedRoute: ActivatedRoute,
    public translate: TranslateService,
    private helper: MCPHelperService,
    ) {

   }

  ngOnInit(): void {
    const id = this.activitedRoute.snapshot.paramMap.get('id');
    this.survey_id = id;
    this.getMetricList();
    this.editFitIndex();
    this.addFitIndexForm = this._categoriesForm.group({
      id: [null],
      survey_id: [this.survey_id, [Validators.required]],
      metric_id: [null, [Validators.required]],
      result: [null, [Validators.required]],
      operator: [null, [Validators.required]],
      value: [null, [Validators.required]],
      scalarResult: [null, [Validators.required]]
    });

    
  }

  async getMetricList(): Promise<void>{
    const res: any = await this.tklabMqsService.loadAppQuizMetric({survey: this.survey_id});
    this.metricList = res.result;

  }

  async editFitIndex():Promise<void>{
    // this.helper.toggleLoaderVisibility(true);
    const id = this.activitedRoute.snapshot.paramMap.get('id');
    const fitIndexId = this.activitedRoute.snapshot.paramMap.get('fitIndexId');
    if(fitIndexId !== '0'){ this.title = 'Edit';}
    this.helper.getFitIndexDetails({id: fitIndexId,surveyId:id}).subscribe((data:any)=>{
      this.helper.toggleLoaderVisibility(true);
      this.metricsData = data.data;
      console.log('this.metricsData',this.metricsData);
      this.addFitIndexForm.patchValue({
        id: [fitIndexId],
        survey_id: [this.survey_id],
        metric_id: this.metricsData.metric_id,
        result: this.metricsData.result,
        operator: this.metricsData.operator,
        value: this.metricsData.value,
        scalarResult: this.metricsData.scalarResult
      });
      this.helper.toggleLoaderVisibility(false);
    });
    // let response: any = await this.tklabMqsService.loadAppQuizMetric({survey:id});
    // this.metricsData = response.result;
    
    this.helper.toggleLoaderVisibility(false);
  }

  async addFitIndex(): Promise<void>{
    if(this.addFitIndexForm.valid){
      this.helper.toggleLoaderVisibility(true);
      await this.tklabMqsService.saveAppSurveyMetric(this.addFitIndexForm.value);
      this.helper.toggleLoaderVisibility(false);
      this.router.navigate(['/quiz-survey/survey/view-survey/' + this.survey_id]);
      swal.fire(
        '',
        this.translate.instant('Fit index added successfully'),
        'success'
      );
    }
  }
  changeCategory(){}
}
