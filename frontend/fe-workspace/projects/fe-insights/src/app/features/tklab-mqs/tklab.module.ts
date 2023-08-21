import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {DefaultDataServiceConfig, EntityDataModule} from '@ngrx/data';
import {RouterModule, Routes} from '@angular/router';
import {TklHomeComponent} from './components/admin/tkl-home/tkl-home.component';
import {AuthGuardAdmin} from '../../core/auth-guard-admin';
import {TklSurveyComponent} from './components/admin/tkl-survey/tkl-survey.component';
import {TklQuestionComponent} from './components/admin/tkl-question/tkl-question.component';
import {MaterialDesignModule} from '../../../../../fe-common/src/lib/core/material-design';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {STORE_FEATURE, tklabReducer} from './store/reducer';
import {TklabEffects} from './store/effects';
import {TklabService} from '../../../../../fe-common/src/lib/services/tklab.service';

import {
  AnswerSideEffectService, ConditionService,
  MetricService,
  QuestionService,
  SurveyQuestionService,
  SurveyService
} from './store/data.service';
import {entityConfig} from './store/data.meta';
import {MatSortModule} from '@angular/material/sort';
import {QuestionDialogComponent} from './components/admin/tkl-question/question-dialog/question-dialog.component';
import {DialogconfirmComponent} from './components/dialogconfirm/dialogconfirm.component';
import {SideEffectsDialogComponent} from './components/admin/tkl-question/side-effects-dialog/side-effects-dialog.component';
import { TklMetricsComponent } from './components/admin/tkl-metrics/tkl-metrics.component';
import {MetricDialogComponent} from './components/admin/tkl-metrics/metric-dialog/metric-dialog.component';
import { TklNavComponent } from './components/admin/tkl-nav/tkl-nav.component';
import { SurveyDialogComponent } from './components/admin/tkl-survey/survey-dialog/survey-dialog.component';
import { SurveyQuestionDialogComponent } from './components/admin/tkl-survey/survey-question-dialog/survey-question-dialog.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { TklabMqsService } from 'projects/fe-common/src/lib/services/tklab.mqs.service';
import { FitIndexCalcDialogComponent } from './components/admin/tkl-survey/fit-index-calc-dialog/fit-index-calc-dialog.component';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";

const routes: Routes = [
  {
    path: 'home',
    component: TklHomeComponent,
    canActivate: [AuthGuardAdmin]
  },
  {
    path: 'survey',
    component: TklSurveyComponent,
    canActivate: [AuthGuardAdmin]
  },
  {
    path: 'question',
    component: TklQuestionComponent,
    canActivate: [AuthGuardAdmin]
  },
  {
    path: 'metric',
    component: TklMetricsComponent,
    canActivate: [AuthGuardAdmin]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    canActivate: [AuthGuardAdmin]
  }
];

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: TklabService.config.TKLAB_SURVEY_API_ROOT,
  timeout: 10000,
};

@NgModule({
  declarations: [
    DialogconfirmComponent,
    TklHomeComponent,
    TklSurveyComponent,
    TklQuestionComponent,
    QuestionDialogComponent,
    SideEffectsDialogComponent,
    TklMetricsComponent,
    MetricDialogComponent,
    TklNavComponent,
    SurveyDialogComponent,
    SurveyQuestionDialogComponent,
    FitIndexCalcDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialDesignModule,
    MatSortModule,
    MatTooltipModule,
    RouterModule.forChild(routes),
    // StoreModule.forFeature(STORE_FEATURE, tklabReducer),
    // EffectsModule.forFeature([TklabEffects]),
    /*EntityDataModule.forRoot(entityConfig),*/
    TranslateModule,
    CKEditorModule,
    NgxMatSelectSearchModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    /*{provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig},*/
    TklabService,
    TklabMqsService,
    AnswerSideEffectService,
    ConditionService,
    MetricService,
    QuestionService,
    SurveyQuestionService,
    SurveyService,
  ]
})
export class TklabMQSModule {
}
