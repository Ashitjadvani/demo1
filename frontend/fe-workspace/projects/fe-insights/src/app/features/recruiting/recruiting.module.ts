import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuardAdmin } from '../../core/auth-guard-admin';
import { RouterModule, Routes } from '@angular/router';
import {
    DefaultDataServiceConfig, EntityCollectionReducerMethodsFactory,
    EntityDataModule,
    EntityDispatcherDefaultOptions,
    PersistenceResultHandler
} from '@ngrx/data';
import { RecruitingService } from '../../../../../fe-common/src/lib/services/recruiting.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { recruitingReducer, STORE_FEATURE } from './store/reducer';
import { entityConfig } from './store/data.meta';
import { RecruitingEffects } from './store/effects';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { MaterialDesignModule } from '../../core/material-design';
import {
    CustomFieldService,
    JobApplicationService,
    JobOpeningService,
    LaureaService,
    PersonService,
    UniversitaService
} from './store/data.service';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { OpeningsComponent } from './components/openings/openings.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { AdditionalPropertyPersistenceResultHandler } from './store/results-handler';
import { AdditionalEntityCollectionReducerMethodsFactory } from './store/collection-reducer-methods';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { OverviewCardComponent } from '../../components/overview-card/overview-card.component';


const routes: Routes = [
    {
        path: 'candidates',
        component: CandidatesComponent,
        canActivate: [AuthGuardAdmin]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuardAdmin]
    },
    /*{
        path: 'openings',
        component: OpeningsComponent,
        canActivate: [AuthGuardAdmin]
    },*/
    {
        path: 'applications',
        component: ApplicationsComponent,
        canActivate: [AuthGuardAdmin]
    },
    {
        path: 'applications/:opening_id',
        component: ApplicationsComponent,
        canActivate: [AuthGuardAdmin]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        canActivate: [AuthGuardAdmin]
    }
];

const defaultDataServiceConfig: DefaultDataServiceConfig = {
    root: RecruitingService.config.RECRUITING_API_ROOT,
    timeout: 20000,
};

@NgModule({
    declarations: [
        CandidatesComponent,
        DashboardComponent,
        //OpeningsComponent,
        ApplicationsComponent,
        OverviewCardComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        RouterModule.forChild(routes),
        StoreModule.forFeature(STORE_FEATURE, recruitingReducer),
        EffectsModule.forFeature([RecruitingEffects]),
        /*EntityDataModule.forRoot(entityConfig),*/
        TranslateModule,
        MaterialDesignModule,
        SharedModule,
        FlexLayoutModule,
        CKEditorModule
    ],
    exports: [
        RouterModule,
        OverviewCardComponent
    ],
    providers: [
        /*{provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig},
        {provide: EntityDispatcherDefaultOptions, useValue: {optimisticDelete: false}},
        {provide: PersistenceResultHandler, useClass: AdditionalPropertyPersistenceResultHandler},
        {provide: EntityCollectionReducerMethodsFactory, useClass: AdditionalEntityCollectionReducerMethodsFactory},*/
        JobOpeningService,
        JobApplicationService,
        LaureaService,
        PersonService,
        UniversitaService,
        RecruitingService,
        CustomFieldService
    ]
})
export class RecruitingModule {
}
