import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeLayoutComponent } from './components/layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './components/layout/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { AddEditAreasComponent } from './components/people-management/add-edit-areas/add-edit-areas.component';
import { AddEditJobTitleComponent } from './components/people-management/add-edit-job-title/add-edit-job-title.component';
import { AddEditRolesComponent } from './components/people-management/add-edit-roles/add-edit-roles.component';
import { PeopleManagementComponent } from './components/people-management/people-management.component';
import { AddUserComponent } from './components/people/add-user/add-user.component';
import { PeopleComponent } from './components/people/people.component';
import { EditCompanyComponent } from './components/profile/edit-company/edit-company.component';
import { DashboardCustomizationComponent } from './components/profile/settings/dashboard-customization/dashboard-customization.component';
import { EmailConfigurationComponent } from './components/profile/settings/email-configuration/email-configuration.component';
import { GreenpassSettingsComponent } from './components/profile/settings/greenpass-settings/greenpass-settings.component';
import { NativeLanguagesComponent } from './components/profile/settings/native-languages/native-languages.component';
import { ServerSettingsComponent } from './components/profile/settings/server-settings/server-settings.component';
import { SettingsComponent } from './components/profile/settings/settings.component';
import { WorkSettingsComponent } from './components/profile/settings/work-settings/work-settings.component';
import { CandidatesComponent } from './components/recruiting/candidates/candidates.component';
import { ViewCandidatesComponent } from './components/recruiting/candidates/view-candidates/view-candidates.component';
import { EditJobApplicationsComponent } from './components/recruiting/job-applications/edit-job-applications/edit-job-applications.component';
import { JobApplicationsComponent } from './components/recruiting/job-applications/job-applications.component';
import { ViewJobApplicationsComponent } from './components/recruiting/job-applications/view-job-applications/view-job-applications.component';
import { RecruitingDashboardComponent } from './components/recruiting/recruiting-dashboard/recruiting-dashboard.component';
import { RecruitingComponent } from './components/recruiting/recruiting.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ManageRFQComponent } from './components/procurement-management/manage-rfq/manage-rfq.component';
import { AddEditRFQComponent } from './components/procurement-management/manage-rfq/add-edit-rfq/add-edit-rfq.component';
import { ManageSupplierComponent } from './components/procurement-management/manage-supplier/manage-supplier.component';
import { ManageServiceComponent } from './components/procurement-management/manage-service/manage-service.component';
import { ViewDetailsManageServiceComponent } from './components/procurement-management/manage-service/view-details/view-details.component';
import { AddEditServiceComponent } from './components/procurement-management/manage-service/add-edit-service/add-edit-service.component';
import { ProcurementManagementComponent } from './components/procurement-management/procurement-management.component';
import { AddEditSupplierComponent } from './components/procurement-management/manage-supplier/add-edit-supplier/add-edit-supplier.component';
import { ViewManageSupplierComponent } from './components/procurement-management/manage-supplier/view-manage-supplier/view-manage-supplier.component';
import { AddEditSurveyComponent } from './components/procurement-management/manage-service/view-details/add-edit-survey/add-edit-survey.component';
import { PeopleGroupsComponent } from './components/people-groups/people-groups.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { SitesComponent } from './components/sites/sites.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { PushNotificationComponent } from './components/push-notification/push-notification.component';
import { TouchpointManagementComponent } from './components/touchpoint-management/touchpoint-management.component';
import { MasterModulesComponent } from './components/master-modules/master-modules.component';
import { EventTypesComponent } from './components/master-modules/event-types/event-types.component';
import { DisputeTypesComponent } from './components/master-modules/dispute-types/dispute-types.component';
import { ScopesComponent } from './components/master-modules/scopes/scopes.component';
import { UniversityComponent } from './components/master-modules/university/university.component';
import { DegreeComponent } from './components/master-modules/degree/degree.component';
import { AssetsManagementComponent } from './components/assets-management/assets-management.component';
import { ResourceGroupComponent } from './components/assets-management/resource-group/resource-group.component';
import { ResourceManagementComponent } from './components/assets-management/resource-management/resource-management.component';
import { JobOpeningsComponent } from './components/recruiting/job-openings/job-openings.component';
import { ActionTilesComponent } from './components/action-tiles/action-tiles.component';
import { ManageInformationComponent } from './components/manage-information/manage-information.component';
import { CategoriesComponent } from './components/manage-information/categories/categories.component';
import { InformationsComponent } from './components/manage-information/informations/informations.component';
import { QuotationComponent } from './components/procurement-management/quotation/quotation.component';
import { ProcurementDashboardComponent } from './components/procurement-management/procurement-dashboard/procurement-dashboard.component';
import { QuizSurveyComponent } from './components/quiz-survey/quiz-survey.component';
import { CategoryComponent } from './components/quiz-survey/category/category.component';
import { SurveyComponent } from './components/quiz-survey/survey/survey.component';
import { QuestionsComponent } from './components/quiz-survey/questions/questions.component';
import { MetricsComponent } from './components/quiz-survey/metrics/metrics.component';
import { AddEditCategoryComponent } from './components/quiz-survey/category/add-edit-category/add-edit-category.component';
import { AddEditedSurveyComponent } from './components/quiz-survey/survey/add-edited-survey/add-edited-survey.component';
import { AddEditQuestionComponent } from './components/quiz-survey/questions/add-edit-question/add-edit-question.component';
import { AddEditMetricsComponent } from './components/quiz-survey/metrics/add-edit-metrics/add-edit-metrics.component';
import { AddEditEventComponent } from './components/master-modules/event-types/add-edit-event/add-edit-event.component';
import { AddEditAccountComponent } from './components/accounts/add-edit-account/add-edit-account.component';
import { AddEditTouchpointSiteComponent } from './components/touchpoint-management/add-edit-touchpoint-site/add-edit-touchpoint-site.component';
import { TouchpointConfigurationComponent } from './components/touchpoint-management/touchpoint-configuration/touchpoint-configuration.component';
import { AddEditResourceGroupComponent } from './components/assets-management/resource-group/add-edit-resource-group/add-edit-resource-group.component';
import { AddEditPushNotificationComponent } from './components/push-notification/add-edit-push-notification/add-edit-push-notification.component';
import { AddEditParkingComponent } from './components/assets-management/resource-group/add-edit-resource-group/add-edit-parking/add-edit-parking.component';
import { AddEditGroupComponent } from './components/people-groups/add-edit-group/add-edit-group.component';
import { AddEditSiteComponent } from './components/sites/add-edit-site/add-edit-site.component';
import { AddEditJobOpeningComponent } from './components/recruiting/job-openings/add-edit-job-opening/add-edit-job-opening.component';
import { ViewMetricsComponent } from './components/quiz-survey/metrics/view-metrics/view-metrics.component';
import { ViewQuestionComponent } from './components/quiz-survey/questions/view-question/view-question.component';
import { EventsSettingsComponent } from './components/master-modules/event-types/events-settings/events-settings.component';
import { AddEditPeopleScopesComponent } from './components/master-modules/scopes/add-edit-people-scopes/add-edit-people-scopes.component';
import { EditEmployeeComponent } from './components/people/edit-employee/edit-employee.component';
import { ViewApplicationComponent } from './components/recruiting/job-openings/view-application/view-application.component';
import { ViewSurveyComponent } from './components/quiz-survey/survey/view-survey/view-survey.component';
import { AddEditFitIndexComponent } from './components/quiz-survey/survey/view-survey/add-edit-fit-index/add-edit-fit-index.component';
import { AddEditAlertComponent } from './components/alerts/add-edit-alert/add-edit-alert.component';
import { LogAuditComponent } from "./components/log-audit/log-audit.component";
import { AddEditCategoriesComponent } from './components/manage-information/categories/add-edit-categories/add-edit-categories.component';
import { CmsComponent } from './components/cms/cms.component';
import { AddEditPrivacyPolicyComponent } from './components/cms/add-edit-privacy-policy/add-edit-privacy-policy.component';
import { AddEditTermsConditionsComponent } from './components/cms/add-edit-terms-conditions/add-edit-terms-conditions.component';
import { AddEditRecruitingComponent } from './components/cms/add-edit-recruiting/add-edit-recruiting.component';
import { ViewAreaDetailsComponent } from './components/people-management/view-area-details/view-area-details.component';
import { AddEditInformationsComponent } from './components/manage-information/informations/add-edit-informations/add-edit-informations.component';
import { SettingPushNotificationComponent } from "./components/profile/settings/setting-push-notification/setting-push-notification.component";
import { AddressManagementComponent } from "./components/address-management/address-management.component";
import { CountryComponent } from "./components/address-management/country/country.component";
import { ProvinceComponent } from "./components/address-management/province/province.component";
import { RegionComponent } from "./components/address-management/region/region.component";
import { CitiesComponent } from "./components/address-management/cities/cities.component";
import { AddEditCountryComponent } from "./components/address-management/country/add-edit-country/add-edit-country.component";
import { AddEditProvinceComponent } from "./components/address-management/province/add-edit-province/add-edit-province.component";
import { AddEditRegionComponent } from "./components/address-management/region/add-edit-region/add-edit-region.component";
import { AddEditCitiesComponent } from "./components/address-management/cities/add-edit-cities/add-edit-cities.component";
import { SupplierLogComponent } from "./components/procurement-management/supplier-log/supplier-log.component";
import { AccessControlComponent } from './components/access-control/access-control.component';
import { AccessControlLogsComponent } from './components/access-control/logs/logs.component';
import { AccessControlUserBadgeComponent } from './components/access-control/user-badge/user-badge.component';
import { ViewUserBadgeComponent } from './components/access-control/user-badge/view-user-badge/view-user-badge.component';
import { AccessControlExtBadgeComponent } from './components/access-control/ext-badge/ext-badge.component';
import { ViewExtBadgeComponent } from './components/access-control/ext-badge/view-ext-badge/view-ext-badge.component';
import { AccessControlSystemComponent } from './components/access-control/systems/system.component';
import { AddEditAccessControlSystemComponent } from './components/access-control/systems/add-edit-system/add-edit-system.component';
import { AccessControlGateComponent } from './components/access-control/gates/gate.component';
import { AddEditAccessControlGateComponent } from './components/access-control/gates/add-edit-gate/add-edit-gate.component';
import { AddEditAccessControlGroupComponent } from './components/access-control/gates/add-edit-group/add-edit-group.component';
import { AccessControlBadgesComponent } from './components/access-control/badges/badges.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AddEditSupplierPrivacyPolicyComponent } from "./components/cms/add-edit-supplier-privacy-policy/add-edit-supplier-privacy-policy.component";
import { AddEditSupplierTermsConditionsComponent } from "./components/cms/add-edit-supplier-terms-conditions/add-edit-supplier-terms-conditions.component";
import { AccessControlDashboardComponent } from './components/access-control/access-control-dashboard/access-control-dashboard.component';
import { EditCandidateRemainderComponent } from './components/recruiting/candidates/edit-candidate-remainder/edit-candidate-remainder.component';
import { RecruitingSettingsComponent } from './components/recruiting/recruiting-settings/recruiting-settings.component';
import { MonitorPresencesHomeComponent } from './components/monitor-presences/monitor-presences-home.component';
import { MonitorPresencesComponent } from './components/monitor-presences/presences/presences.component';
import { MonitorEmployeesComponent } from './components/monitor-presences/employees/employees.component';
import { CostCenterTypeComponent } from "./components/master-modules/cost-center-type/cost-center-type.component";
import { EventCostCenterComponent } from "./components/master-modules/event-cost-center/event-cost-center.component";
import { AddEditEventCostCenterComponent } from "./components/master-modules/event-cost-center/add-edit-event-cost-center/add-edit-event-cost-center.component";
import { EventManagementComponent } from "./components/event-management/event-management.component";
import { EventDashboardComponent } from "./components/event-management/event-dashboard/event-dashboard.component";
import { EventCalendarComponent } from "./components/event-management/event-calendar/event-calendar.component";
import { EventScopesComponent } from "./components/event-management/event-scopes/event-scopes.component";
import { EventServicesComponent } from "./components/event-management/event-services/event-services.component";
import { EventExternalVenuesComponent } from "./components/event-management/event-external-venues/event-external-venues.component";
import { EventListComponent } from "./components/event-management/event-list/event-list.component";
import { EventSettingComponent } from "./components/event-management/event-setting/event-setting.component";
import { AddEditEventScopesComponent } from "./components/event-management/event-scopes/add-edit-event-scopes/add-edit-event-scopes.component";
import { AddEditCostCenterTypeComponent } from "./components/master-modules/cost-center-type/add-edit-cost-center-type/add-edit-cost-center-type.component";
import { DocumentTypeComponent } from "./components/event-management/document-type/document-type.component";
import { AddEditDocumentTypeComponent } from "./components/event-management/document-type/add-edit-document-type/add-edit-document-type.component";
import { AddEditEventServicesComponent } from "./components/event-management/event-services/add-edit-event-service/add-edit-event-services.component";
import { AddEditEventExternalVenuesComponent } from "./components/event-management/event-external-venues/add-edit-event-external-venues/add-edit-event-external-venues.component";
import { ViewEventServiceComponent } from "./components/event-management/event-services/view-event-service/view-event-service.component";
import { CreateEventComponent } from "./components/event-management/event-list/create-event/create-event.component";
import { EventDetailsComponent } from './components/event-management/event-list/event-details/event-details.component';
import { ProcurementSettingsComponent } from './components/procurement-management/procurement-settings/procurement-settings.component';
import { EventEmailTemplateComponent } from "./components/event-management/event-email-template/event-email-template.component";
import { AcceptEventComponent } from './components/event-management/event-list/accept-event/accept-event.component';
import { DeclineEventComponent } from './components/event-management/event-list/decline-event/decline-event.component';
import { EventConfirmationComponent } from './components/event-management/event-list/event-confirmation/event-confirmation.component';
import { MobileAppQrComponent } from './components/profile/mobile-app-qr/mobile-app-qr.component';
import { ProcurementEmailTemplateComponent } from './components/procurement-management/procurement-email-template/procurement-email-template.component'
import { ProductsTrackingComponent } from './components/products-tracking/products-tracking.component';
import { ProductsTrackingDashboardComponent } from './components/products-tracking/products-tracking-dashboard/products-tracking-dashboard.component';
import { ProductsTrackingWorkOrdersComponent } from './components/products-tracking/products-tracking-work-orders/products-tracking-work-orders.component';
import { ProductsTrackingItemsComponent } from './components/products-tracking/products-tracking-items/products-tracking-items.component';
import { ProductsTrackingCustomerOrdersComponent } from './components/products-tracking/products-tracking-customer-orders/products-tracking-customer-orders.component';
import { ProductsTrackingWorkPlansComponent } from './components/products-tracking/products-tracking-work-plans/products-tracking-work-plans.component';
import { ProductsTrackingProductionPlansComponent } from './components/products-tracking/products-tracking-production-plans/products-tracking-production-plans.component';
import { ProductsTrackingShiftsComponent } from './components/products-tracking/products-tracking-shifts/products-tracking-shifts.component';
import { ProductsTrackingShiftsManagementComponent } from './components/products-tracking/products-tracking-shifts-management/products-tracking-shifts-management.component';
import { StaffDocumentComponent } from "./components/master-modules/staff-documents/staff-document.component";
import { AddEditStaffDocumentComponent } from "./components/master-modules/staff-documents/add-edit-staff-document/add-edit-staff-document.component";
import { AddEmployeeComponent } from './components/people/add-employee/add-employee.component';
import {EventManagementSecretCodeComponent} from "./components/profile/settings/event-management-secret-code/event-management-secret-code.component";
import {EmcLoginComponent} from "./emc/login/login.component";
import {EMCForgotPasswordComponent} from "./emc/forgot-password/forgot-password.component";
import {EMCResetPasswordComponent} from "./emc/reset-password/reset-password.component";
import { ResourceGroupInfoComponent } from './components/assets-management/resource-group-info/resource-group-info.component';
import { AddEditResourceComponent } from './components/assets-management/add-edit-resource/add-edit-resource.component';
import {ResourceTypeComponent} from './components/assets-management/resource-type/resource-type.component'
import {AddEditResourcetypeComponent} from './components/assets-management/resource-type/add-edit-resourcetype/add-edit-resourcetype.component'
import { GroupUserListComponent } from './components/access-control/gates/group-user-list/group-user-list.component';
import { ResourceReservationComponent } from './components/assets-management/resource-group-info/resource-reservation/resource-reservation.component';
const routes: Routes = [
    {
        path: '', component: LoginLayoutComponent,
        children: [
            { path: '', component: LoginComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password', component: ResetPasswordComponent },
            { path: 'emc', component: EmcLoginComponent},
            { path: 'emc/forgot-password', component: EMCForgotPasswordComponent },
            { path: 'emc/reset-password', component: EMCResetPasswordComponent },
        ],
    },
    { path: 'event-manager/event/invitation-accept/:attendeeId/:id', component: AcceptEventComponent },
    { path: 'event-manager/event/invitation-decline/:attendeeId/:id', component: DeclineEventComponent },
    { path: 'event/event-checkin/:id', component: EventConfirmationComponent },
    {
        path: '', component: HomeLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'recruiting', component: RecruitingComponent,
                children: [
                    { path: 'recruiting-settings', component: RecruitingSettingsComponent },
                    { path: 'recruiting-dashboard', component: RecruitingDashboardComponent, pathMatch: 'full' },
                    { path: 'job-applications', component: JobApplicationsComponent },
                    { path: 'job-applications/view-job-applications/:id', component: ViewJobApplicationsComponent },
                    { path: 'job-applications/edit-job-applications/:id', component: EditJobApplicationsComponent },
                    { path: 'candidates', component: CandidatesComponent },
                    { path: 'candidates/view-candidates/:id', component: ViewCandidatesComponent },
                    { path: 'candidates/edit-candidate-remainder', component: EditCandidateRemainderComponent },
                    { path: 'job-openings', component: JobOpeningsComponent },
                    { path: 'job-openings/add-edit-job-opening', component: AddEditJobOpeningComponent },
                    { path: 'job-openings/add-edit-job-opening/:id', component: AddEditJobOpeningComponent },
                    { path: 'job-openings/view-application/:id', component: ViewApplicationComponent }

                ]
            },
            { path: 'people-management', component: PeopleManagementComponent },
            { path: 'people-management/add-edit-roles/:roleName', component: AddEditRolesComponent },
            { path: 'people-management/add-edit-job-title/:jobTitleName', component: AddEditJobTitleComponent },
            { path: 'people-management/add-edit-areas/:areaName', component: AddEditAreasComponent },
            { path: 'edit-company', component: EditCompanyComponent },
            { path: 'people-management/view-area-details/:id', component: ViewAreaDetailsComponent },
            {
                path: '', component: SettingsComponent,
                children: [
                    // {path: 'settings', component: SettingPushNotificationComponent},
                    { path: 'settings', component: EmailConfigurationComponent },
                    { path: 'email-config', component: EmailConfigurationComponent },
                    { path: 'server-settings', component: ServerSettingsComponent },
                    { path: 'greenpass-settings', component: GreenpassSettingsComponent },
                    { path: 'native-languages', component: NativeLanguagesComponent },
                    { path: 'work-settings', component: WorkSettingsComponent },
                    { path: 'dashboard-customization', component: DashboardCustomizationComponent },
                    { path: 'secret-code', component: EventManagementSecretCodeComponent },

                ]
            },
            { path: 'mobile-application', component: MobileAppQrComponent },
            { path: 'people', component: PeopleComponent },
            { path: 'people/edit-employee', component: EditEmployeeComponent },
            { path: 'people/add-employee', component: AddEmployeeComponent },
            { path: 'people/edit-employee/:id', component: EditEmployeeComponent },
            { path: 'people/add-user', component: AddUserComponent },

            {
                path: '', component: ProcurementManagementComponent,
                children: [
                    { path: 'procurement-dashboard', component: ProcurementDashboardComponent },
                    { path: 'manage-rfq', component: ManageRFQComponent },
                    { path: 'manage-rfq/add-edit-rfq', component: AddEditRFQComponent },
                    { path: 'manage-supplier', component: ManageSupplierComponent },
                    { path: 'manage-supplier/add-edit-supplier', component: AddEditSupplierComponent },
                    { path: 'manage-supplier/view-manage-supplier/:id', component: ViewManageSupplierComponent },
                    { path: 'manage-service', component: ManageServiceComponent },
                    { path: 'manage-service/view-details/:id', component: ViewDetailsManageServiceComponent },
                    { path: 'manage-service/view-details/add-edit-survey', component: AddEditSurveyComponent },
                    { path: 'manage-service/add-edit-services', component: AddEditServiceComponent },
                    { path: 'manage-service/add-edit-services/:id', component: AddEditServiceComponent },
                    { path: 'quotation', component: QuotationComponent },
                    { path: 'supplier-log', component: SupplierLogComponent },
                    { path: 'procurement-settings', component: ProcurementSettingsComponent },
                    { path: 'procurement-email-template', component: ProcurementEmailTemplateComponent },
                ]
            },
            { path: 'people-groups', component: PeopleGroupsComponent },
            { path: 'people-groups/add-edit-group', component: AddEditGroupComponent },
            { path: 'people-groups/add-edit-group/:id', component: AddEditGroupComponent },
            { path: 'accounts', component: AccountsComponent },
            { path: 'accounts/add-edit-account/:id', component: AddEditAccountComponent },
            { path: 'sites', component: SitesComponent },
            { path: 'sites/add-edit-site', component: AddEditSiteComponent },
            { path: 'sites/add-edit-site/:id', component: AddEditSiteComponent },
            { path: 'alerts', component: AlertsComponent },
            { path: 'alerts/add-edit-alert/:id', component: AddEditAlertComponent },
            { path: 'push-notification', component: PushNotificationComponent },
            { path: 'push-notification/add-edit-push-notification', component: AddEditPushNotificationComponent },
            { path: 'touchpoint-management', component: TouchpointManagementComponent },
            { path: 'touchpoint-management/add-touchpoint-site', component: AddEditTouchpointSiteComponent },
            { path: 'touchpoint-management/touchpoint-configuration', component: TouchpointConfigurationComponent },
            {
                path: "", component: MasterModulesComponent,
                children: [
                    { path: 'master-modules/event-types', component: EventTypesComponent },
                    { path: 'master-modules/event-types/add-edit-event/:id', component: AddEditEventComponent },
                    { path: 'master-modules/event-types/events-settings', component: EventsSettingsComponent },
                    { path: 'master-modules/dispute-types', component: DisputeTypesComponent },
                    { path: 'master-modules/scopes', component: ScopesComponent },
                    { path: 'master-modules/scopes/add-edit-people-scopes', component: AddEditPeopleScopesComponent },
                    { path: 'master-modules/scopes/add-edit-people-scopes/:name', component: AddEditPeopleScopesComponent },
                    { path: 'master-modules/university', component: UniversityComponent },
                    { path: 'master-modules/degree', component: DegreeComponent },
                    { path: 'master-modules/cost-center-type', component: CostCenterTypeComponent },
                    { path: 'master-modules/cost-center-type/add-edit-cost-center-type/:id', component: AddEditCostCenterTypeComponent },
                    { path: 'master-modules/event-cost-center', component: EventCostCenterComponent },
                    { path: 'master-modules/event-cost-center/add-edit-cost-center/:id', component: AddEditEventCostCenterComponent },
                    { path: 'master-modules/staff-documents', component: StaffDocumentComponent },
                    { path: 'master-modules/staff-documents/add-edit-staff-document/:id', component: AddEditStaffDocumentComponent },
                ]
            },
            {
                path: '', component: AssetsManagementComponent,
                children: [
                    { path: 'assets-management/resource-group', component: ResourceGroupComponent },
                    { path: 'assets-management/resource-group/add-edit-resource-group', component: AddEditResourceGroupComponent },
                    { path: 'assets-management/resource-group/add-edit-resource-group/add-edit-parking', component: AddEditParkingComponent },
                    { path: 'assets-management/resource-management', component: ResourceManagementComponent },
                    { path: 'assets-management/resource-group/resource-group-info', component: ResourceGroupInfoComponent },
                    { path: 'assets-management/resource-group/resource-group-info/reservation', component: ResourceReservationComponent },
                    { path: 'assets-management/add-edit-resource', component:AddEditResourceComponent },
                    { path: 'assets-management/resource-type', component:ResourceTypeComponent },
                    { path: 'assets-management/add-edit-resource-type/:id', component:AddEditResourcetypeComponent }
                ]
            }, {
                path: '', component: EventManagementComponent,
                children: [
                    { path: 'event-management/event-dashboard', component: EventDashboardComponent },
                    { path: 'event-management/event-calendar', component: EventCalendarComponent },
                    { path: 'event-management/event-scopes', component: EventScopesComponent },
                    { path: 'event-management/event-scopes/add-edit-event-scopes/:id', component: AddEditEventScopesComponent },
                    { path: 'event-management/document-type', component: DocumentTypeComponent },
                    { path: 'event-management/document-type/add-edit-document-type/:id', component: AddEditDocumentTypeComponent },
                    { path: 'event-management/event-services', component: EventServicesComponent },
                    { path: 'event-management/event-services/add-edit-event-services/:id', component: AddEditEventServicesComponent },
                    { path: 'event-management/event-services/view-details/:id', component: ViewEventServiceComponent },
                    { path: 'event-management/event-external-venues', component: EventExternalVenuesComponent },
                    { path: 'event-management/event-list', component: EventListComponent },
                    { path: 'event-management/event-list/event-details/:id', component: EventDetailsComponent },
                    { path: 'event-management/event-list/create-event/:id', component: CreateEventComponent },
                    { path: 'event-management/event-settings', component: EventSettingComponent },
                    { path: 'event-management/event-external-venues/add-edit-external-venues/:id', component: AddEditEventExternalVenuesComponent },
                    { path: 'event-management/event-email-template', component: EventEmailTemplateComponent },
                    { path: 'training/event-dashboard/:scopeId', component: EventDashboardComponent },
                    { path: 'training/event-calendar/:scopeId', component: EventCalendarComponent },
                    { path: 'training/event-list/:scopeId', component: EventListComponent },
                    { path: 'training/event-email-template/:scopeId', component: EventEmailTemplateComponent },
                    { path: 'training/event-list/create-event/:id/:scopeId', component: CreateEventComponent },
                    { path: 'training/event-list/event-details/:id/:scopeId', component: EventDetailsComponent },
                ]
            },
            { path: 'action-tiles', component: ActionTilesComponent },
            {
                path: '', component: ManageInformationComponent,
                children: [
                    { path: 'manage-information/categories', component: CategoriesComponent },
                    { path: 'manage-information/categories/add-edit-categories', component: AddEditCategoriesComponent },
                    { path: 'manage-information/categories/add-edit-categories/:id', component: AddEditCategoriesComponent },
                    { path: 'manage-information/informations', component: InformationsComponent },
                    { path: 'manage-information/informations/add-edit-information', component: AddEditInformationsComponent },
                    { path: 'manage-information/informations/add-edit-information/:id', component: AddEditInformationsComponent }
                ]
            },
            { path: 'log-audit', component: LogAuditComponent },
            { path: 'cms', component: CmsComponent },
            { path: 'cms/add-edit-privacy-policy', component: AddEditPrivacyPolicyComponent },
            { path: 'cms/add-edit-terms-conditions', component: AddEditTermsConditionsComponent },
            { path: 'cms/add-edit-recruiting', component: AddEditRecruitingComponent },
            { path: 'cms/add-edit-recruiting', component: AddEditRecruitingComponent },
            { path: 'cms/supplier-privacy-policy', component: AddEditSupplierPrivacyPolicyComponent },
            { path: 'cms/supplier-terms-conditions', component: AddEditSupplierTermsConditionsComponent },
            {
                path: '', component: QuizSurveyComponent,
                children: [
                    { path: 'quiz-survey/category', component: CategoryComponent },
                    { path: 'quiz-survey/category/add-edit-category', component: AddEditCategoryComponent },
                    { path: 'quiz-survey/survey', component: SurveyComponent },
                    { path: 'quiz-survey/survey/add-edit-survey/:id', component: AddEditedSurveyComponent },
                    { path: 'quiz-survey/survey/view-survey/:id', component: ViewSurveyComponent },
                    { path: 'quiz-survey/survey/view-survey/:id/add-edit-fit-index/:fitIndexId', component: AddEditFitIndexComponent },
                    { path: 'quiz-survey/questions', component: QuestionsComponent },
                    { path: 'quiz-survey/questions/add-edit-question/:id', component: AddEditQuestionComponent },
                    { path: 'quiz-survey/questions/view-question/:id', component: ViewQuestionComponent },
                    { path: 'quiz-survey/metrics', component: MetricsComponent },
                    { path: 'quiz-survey/metrics/add-edit-metrics/:id', component: AddEditMetricsComponent },
                    { path: 'quiz-survey/metrics/view-metrics/:id', component: ViewMetricsComponent },
                ]
            },
            {
                path: '', component: AddressManagementComponent,
                children: [
                    { path: 'address-management/country', component: CountryComponent },
                    { path: 'address-management/country/add-edit-country/:id', component: AddEditCountryComponent },
                    { path: 'address-management/province', component: ProvinceComponent },
                    { path: 'address-management/province/add-edit-province', component: AddEditProvinceComponent },
                    { path: 'address-management/region', component: RegionComponent },
                    { path: 'address-management/region/add-edit-region/:id', component: AddEditRegionComponent },
                    { path: 'address-management/cities', component: CitiesComponent },
                    { path: 'address-management/cities/add-edit-cities/:id', component: AddEditCitiesComponent }
                ]
            },
            {
                path: '', component: AccessControlComponent,
                children: [
                    { path: 'access-control/dashboard', component: AccessControlDashboardComponent },
                    { path: 'access-control/systems', component: AccessControlSystemComponent },
                    { path: 'access-control/access-list', component: AccessControlLogsComponent },
                    { path: 'access-control/badges/:tab', component: AccessControlBadgesComponent },
                    { path: 'access-control/gates/:tab', component: AccessControlGateComponent },
                ]
            },
            { path: 'access-control/badges/user/view-user-badge/:id', component: ViewUserBadgeComponent },
            { path: 'access-control/badges/ext/view-ext-badge/:id', component: ViewExtBadgeComponent },
            { path: 'access-control/systems/add-edit-system/:id', component: AddEditAccessControlSystemComponent },
            { path: 'access-control/gates/add-edit-gate/:id', component: AddEditAccessControlGateComponent },
            { path: 'access-control/gates/add-edit-group/:id', component: AddEditAccessControlGroupComponent },
            { path: 'access-control/gates/group-users-list/:id', component: GroupUserListComponent },
            {
                path: '', component: MonitorPresencesHomeComponent,
                children: [
                    { path: 'monitor-presences/presences', component: MonitorPresencesComponent },
                    { path: 'monitor-presences/employees', component: MonitorEmployeesComponent }
                ]
            },
            {
                path: '', component: ProductsTrackingComponent,
                children: [
                    { path: 'products-tracking/dashboard', component: ProductsTrackingDashboardComponent },
                    { path: 'products-tracking/items', component: ProductsTrackingItemsComponent },
                    { path: 'products-tracking/work-orders', component: ProductsTrackingWorkOrdersComponent },
                    { path: 'products-tracking/customer-orders', component: ProductsTrackingCustomerOrdersComponent },
                    { path: 'products-tracking/production-orders', component: ProductsTrackingProductionPlansComponent },
                    { path: 'products-tracking/work-plans', component: ProductsTrackingWorkPlansComponent },
                    { path: 'products-tracking/shifts', component: ProductsTrackingShiftsComponent },
                    { path: 'products-tracking/shifts-management', component: ProductsTrackingShiftsManagementComponent }

                ]
            },
            { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
