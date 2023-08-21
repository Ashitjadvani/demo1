import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsPageComponent } from '../pages/accounts-page/accounts-page.component';
import { ActionTilePageComponent } from '../pages/action-tile-page/action-tile-page.component';
import { InformationsPageComponent } from '../pages/informations-page/informations-page.component';
import { AlertsPageComponent } from '../pages/alerts-page/alerts-page.component';
import { CompanyPageComponent } from '../pages/company-page/company-page.component';
import { DashboardPageComponent } from '../pages/dashboard-page/dashboard-page.component';
import { LogAuditPageComponent } from '../pages/log-audit-page/log-audit-page.component';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { PeopleGroupPageComponent } from '../pages/people-group-page/people-group-page.component';
import { PeoplePageComponent } from '../pages/people-page/people-page.component';
import { SettingsPageComponent } from '../pages/settings-page/settings-page.component';
import { SitesPageComponent } from '../pages/sites-page/sites-page.component';
import { TouchpointPageComponent } from '../pages/touchpoint-page/touchpoint-page.component';
import { AuthGuardAdmin } from './auth-guard-admin';
import { OfficeActivityPageComponent } from '../pages/office-activity-page/office-activity-page.component';
import { PERSON_SCOPE } from 'projects/fe-common/src/lib/models/person';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ForgotPasswordPageComponent} from '../pages/forgot-password-page/forgot-password-page.component';
import {TicketGeneratePageComponent} from '../pages/ticket-generate-page/ticket-generate-page.component';

import { QuizSurveyListingPageComponent } from '../pages/quiz-survey-page/quiz-survey-listing-page/quiz-survey-listing-page.component';
import {RecruitingDashboardPageComponent} from "../pages/recruiting/recruiting-dashboard-page.component";
import {RecruitingOpeningsComponent} from "../pages/recruiting/recruiting-openings/recruiting-openings.component";
import { AddQuestionsComponent } from '../pages/quiz-survey-page/add-questions/add-questions.component';
import {RecruitingApplicationsComponent} from "../pages/recruiting/recruiting-applications/recruiting-applications.component";
import {RecruitingCandidatesComponent} from "../pages/recruiting/recruiting-candidates/recruiting-candidates.component";
import { CmsComponent } from '../pages/cms/cms.component';
import { ProductsTrackingPageComponent } from '../pages/products-tracking-page/products-tracking-page.component';
import { ProductsTrackingInfoPageComponent } from '../pages/products-tracking-info-page/products-tracking-info-page.component';
import { ResourceTypeManagementComponent } from '../pages/resource-type-management/resource-type-management.component';
import { AccessControlPageComponent } from '../pages/access-control-page/access-control-page.component';

const routes: Routes = [
    // admin section routes
    { path: '', component: LoginPageComponent },
    { path: 'forgot-password', component: ForgotPasswordPageComponent },
    { path: 'insights', component: LoginPageComponent },
    { path: 'insights/login', component: LoginPageComponent },
    { path: 'insights/product-info/:id', component: ProductsTrackingInfoPageComponent },
    { path: 'insights/office-activity/:dateFrom/:dateTo', component: OfficeActivityPageComponent },
    {
        path: 'insights/main',
        component: DashboardPageComponent,
        canActivate: [AuthGuardAdmin],
        children: [
            { path: 'company', component: CompanyPageComponent },
            { path: 'people', component: PeoplePageComponent },
            { path: 'user-groups', component: PeopleGroupPageComponent },
            { path: 'accounts', component: AccountsPageComponent },
            { path: 'log-audit', component: LogAuditPageComponent },
            { path: 'sites', component: SitesPageComponent },
            { path: 'alerts', component: AlertsPageComponent },
            { path: 'settings-management', component: SettingsPageComponent },
            { path: 'touchpoint-management', component: TouchpointPageComponent },
            { path: 'action-tiles', component: ActionTilePageComponent },
            { path: 'informations', component: InformationsPageComponent },
            { path: 'products-tracking', component: ProductsTrackingPageComponent },
            { path: 'assets-management', component: ResourceTypeManagementComponent },
            { path: 'recruiting',  loadChildren: () => import('../features/recruiting/recruiting.module').then( m => m.RecruitingModule)},
            { path: 'ticket-generate', component: TicketGeneratePageComponent },
            { path: 'access-control', component: AccessControlPageComponent },
            { path: 'recruiting-mqs', component: RecruitingDashboardPageComponent },
            { path: 'recruiting-mqs/openings', component: RecruitingOpeningsComponent },
            { path: 'quiz-survey-listing/addQuestion', component: AddQuestionsComponent},
            { path: 'quiz-survey-listing', component: QuizSurveyListingPageComponent},
            { path: 'recruiting-mqs', component: RecruitingDashboardPageComponent },
            { path: 'recruiting-mqs/applications', component: RecruitingApplicationsComponent },
            { path: 'recruiting-mqs/applications/:id', component: RecruitingApplicationsComponent },
            { path: 'recruiting-mqs/candidates', component: RecruitingCandidatesComponent },
            { path: 'tklab',  loadChildren: () => import('../features/tklab/tklab.module').then( m => m.TklabModule)},
            { path: 'tklab-mqs',  loadChildren: () => import('../features/tklab-mqs/tklab.module').then( m => m.TklabMQSModule)},
            { path: 'cms', component: CmsComponent },

            // { path: 'safety', component: SafetyComponent },
            // { path: 'stats', component: StatisticsComponent },
            // { path: 'news', component: NewsComponent },
            // { path: 'survey', component: SurveyComponent },
            // { path: 'sustainability', component: SustainabilityComponent },
            // { path: 'scheduler', component: SchedulerComponent },
            // { path: 'reservation', component: ReservationComponent },
            // { path: 'apm', component: ApmComponent },
            // ,
            // ,
            // ,
            // ,
            //
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule implements OnInit{

    constructor(
        private adminUserManagementServer: AdminUserManagementService
    ) { }

    ngOnInit() {

    }
}
