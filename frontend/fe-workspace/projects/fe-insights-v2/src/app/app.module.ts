import { Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginLayoutComponent } from './components/layout/login-layout/login-layout.component';
import { HomeLayoutComponent } from './components/layout/home-layout/home-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/navigation/header/header.component';
import { SidenavListComponent } from './components/navigation/sidenav-list/sidenav-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { RecruitingComponent } from './components/recruiting/recruiting.component';
import { RecruitingDashboardComponent } from './components/recruiting/recruiting-dashboard/recruiting-dashboard.component';
import { JobApplicationsComponent } from './components/recruiting/job-applications/job-applications.component';
import { DeletePopupComponent } from './popup/delete-popup/delete-popup.component';
import { CancelPopupComponent } from './popup/cancel-popup/cancel-popup.component';
import { ReActivateEventPopupComponent } from './popup/re-activate-event-popup/re-activate-event-popup.component';
import { ViewJobApplicationsComponent } from './components/recruiting/job-applications/view-job-applications/view-job-applications.component';
import { EditJobApplicationsComponent } from './components/recruiting/job-applications/edit-job-applications/edit-job-applications.component';
import { CandidatesComponent } from './components/recruiting/candidates/candidates.component';
import { ViewCandidatesComponent } from './components/recruiting/candidates/view-candidates/view-candidates.component';
import { PeopleManagementComponent } from './components/people-management/people-management.component';
import { AddEditRolesComponent } from './components/people-management/add-edit-roles/add-edit-roles.component';
import { AddEditJobTitleComponent } from './components/people-management/add-edit-job-title/add-edit-job-title.component';
import { AddEditAreasComponent } from './components/people-management/add-edit-areas/add-edit-areas.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EditCompanyComponent } from './components/profile/edit-company/edit-company.component';
import { SettingsComponent } from './components/profile/settings/settings.component';
import { EmailConfigurationComponent } from './components/profile/settings/email-configuration/email-configuration.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FeCommonModule } from '../../../fe-common-v2/src/lib';
import { ServerSettingsComponent } from './components/profile/settings/server-settings/server-settings.component';
import { GreenpassSettingsComponent } from './components/profile/settings/greenpass-settings/greenpass-settings.component';
import { NativeLanguagesComponent } from './components/profile/settings/native-languages/native-languages.component';
import { WorkSettingsComponent } from './components/profile/settings/work-settings/work-settings.component';
import { DashboardCustomizationComponent } from './components/profile/settings/dashboard-customization/dashboard-customization.component';
import { PeopleComponent } from './components/people/people.component';
import { AddUserComponent } from './components/people/add-user/add-user.component';
import { ManageRFQComponent } from './components/procurement-management/manage-rfq/manage-rfq.component';
import { AddEditRFQComponent } from './components/procurement-management/manage-rfq/add-edit-rfq/add-edit-rfq.component';
import { ManageSupplierComponent } from './components/procurement-management/manage-supplier/manage-supplier.component';
import { ManageServiceComponent } from './components/procurement-management/manage-service/manage-service.component';
import { ViewDetailsManageServiceComponent } from './components/procurement-management/manage-service/view-details/view-details.component';
import { AddEditServiceAgreementPopupComponent } from './popup/add-edit-service-agreement-popup/add-edit-service-agreement-popup.component';
import { AddEditServiceComponent } from './components/procurement-management/manage-service/add-edit-service/add-edit-service.component';
import { MCPHelperService } from './service/MCPHelper.service';
import { DefaultDataServiceConfig } from '@ngrx/data';
import { environment } from '../environments/environment';
import { ProcurementManagementComponent } from './components/procurement-management/procurement-management.component';
import { AddEditSupplierComponent } from './components/procurement-management/manage-supplier/add-edit-supplier/add-edit-supplier.component';
import { ViewManageSupplierComponent } from './components/procurement-management/manage-supplier/view-manage-supplier/view-manage-supplier.component';
import { RefuseSupplierDialogComponent } from './popup/refuse-supplier-dialog/refuse-supplier-dialog.component';
import { AddEditSurveyComponent } from './components/procurement-management/manage-service/view-details/add-edit-survey/add-edit-survey.component';
import { PeopleSingleScopePageComponent } from './components/people/people-single-scope-page/people-single-scope-page.component';
import { ProcurementService } from '../../../fe-common-v2/src/lib/services/procurement.service';
import { PeopleGroupsComponent } from './components/people-groups/people-groups.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { ImportAccountComponent } from './popup/import-account/import-account.component';
import { SitesComponent } from './components/sites/sites.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { PushNotificationComponent } from './components/push-notification/push-notification.component';
import { TouchpointManagementComponent } from './components/touchpoint-management/touchpoint-management.component';
import { UnlockPairingDialogComponent } from './popup/unlock-pairing-dialog/unlock-pairing-dialog.component';
import { QrCodeDialogComponent } from './popup/qr-code-dialog/qr-code-dialog.component';
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
import { ProcurementDashboardComponent } from './components/procurement-management/procurement-dashboard/procurement-dashboard.component';
import { QuotationComponent } from './components/procurement-management/quotation/quotation.component';
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
import { AddEditDisputePopupComponent } from './popup/add-edit-dispute-popup/add-edit-dispute-popup.component';
import { AddEditAccountComponent } from './components/accounts/add-edit-account/add-edit-account.component';
import { AddEditTouchpointSiteComponent } from './components/touchpoint-management/add-edit-touchpoint-site/add-edit-touchpoint-site.component';
import { TouchpointConfigurationComponent } from './components/touchpoint-management/touchpoint-configuration/touchpoint-configuration.component'
import { PdfViewerModule } from "ng2-pdf-viewer";
import { AddEditResourceGroupComponent } from './components/assets-management/resource-group/add-edit-resource-group/add-edit-resource-group.component';
import { AddEditPushNotificationComponent } from './components/push-notification/add-edit-push-notification/add-edit-push-notification.component';
import { AddEditParkingComponent } from './components/assets-management/resource-group/add-edit-resource-group/add-edit-parking/add-edit-parking.component';
import { AddEditGroupComponent } from './components/people-groups/add-edit-group/add-edit-group.component';
import { AddEditSupplierEmailComponent } from './popup/add-edit-supplier-email/add-edit-supplier-email.component';
import { AddEditSiteComponent } from './components/sites/add-edit-site/add-edit-site.component';
import { AddEditJobOpeningComponent } from './components/recruiting/job-openings/add-edit-job-opening/add-edit-job-opening.component';
import { AddEditVideoAssessmentComponent } from './popup/add-edit-video-assessment/add-edit-video-assessment.component';
import { ViewMetricsComponent } from './components/quiz-survey/metrics/view-metrics/view-metrics.component';
import { ViewQuestionComponent } from './components/quiz-survey/questions/view-question/view-question.component';
import { EventsSettingsComponent } from './components/master-modules/event-types/events-settings/events-settings.component';
import { AddEditPeopleScopesComponent } from './components/master-modules/scopes/add-edit-people-scopes/add-edit-people-scopes.component';
import { EditEmployeeComponent } from './components/people/edit-employee/edit-employee.component';
import { RequestMoreDetailDialogComponent } from './popup/request-more-detail-dialog/request-more-detail-dialog.component';
import { ViewApplicationComponent } from './components/recruiting/job-openings/view-application/view-application.component';
import { ViewSurveyComponent } from './components/quiz-survey/survey/view-survey/view-survey.component';
import { AddEditFitIndexComponent } from './components/quiz-survey/survey/view-survey/add-edit-fit-index/add-edit-fit-index.component';
import { AddEditAlertComponent } from './components/alerts/add-edit-alert/add-edit-alert.component';
import { LogAuditComponent } from './components/log-audit/log-audit.component';
import { AddEditCategoriesComponent } from './components/manage-information/categories/add-edit-categories/add-edit-categories.component';
import { SeeLogComponent } from './popup/see-log/see-log.component';
import { CmsComponent } from './components/cms/cms.component';
import { AddEditPrivacyPolicyComponent } from './components/cms/add-edit-privacy-policy/add-edit-privacy-policy.component';
import { AddEditTermsConditionsComponent } from './components/cms/add-edit-terms-conditions/add-edit-terms-conditions.component';
import { AddEditRecruitingComponent } from './components/cms/add-edit-recruiting/add-edit-recruiting.component';
import { TklabMqsService } from 'projects/fe-common-v2/src/lib/services/tklab.mqs.service';
import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ViewAreaDetailsComponent } from './components/people-management/view-area-details/view-area-details.component';
import { AddEditInformationsComponent } from './components/manage-information/informations/add-edit-informations/add-edit-informations.component';
import { DatePipe } from '@angular/common';
import { AddEditSideEffectComponent } from './popup/add-edit-side-effect/add-edit-side-effect.component';
import { SettingPushNotificationComponent } from './components/profile/settings/setting-push-notification/setting-push-notification.component';
import { ChangeLogDialogPopupComponent } from './popup/change-log-dialog-popup/change-log-dialog-popup.component';
import { ShowUserActivityPopupComponent } from './popup/show-user-activity-popup/show-user-activity-popup.component';
import { ExcelService } from "./service/excel.service";
import { ImportPeopleReportPopupComponent } from './popup/import-people-report-popup/import-people-report-popup.component';
import { AddEditSurveyQuestionsPopupComponent } from './popup/add-edit-survey-questions-popup/add-edit-survey-questions-popup.component';
import { QRCodeModule } from "angular2-qrcode";
import { AddEditFitIndexPopupComponent } from './popup/add-edit-fit-index-popup/add-edit-fit-index-popup.component';
import { SitesStatusChangePopupComponent } from './popup/sites-status-change-popup/sites-status-change-popup.component';
import { AddressManagementComponent } from './components/address-management/address-management.component';
import { CountryComponent } from './components/address-management/country/country.component';
import { ProvinceComponent } from './components/address-management/province/province.component';
import { RegionComponent } from './components/address-management/region/region.component';
import { CitiesComponent } from './components/address-management/cities/cities.component';
import { AddEditCountryComponent } from './components/address-management/country/add-edit-country/add-edit-country.component';
import { AddEditProvinceComponent } from './components/address-management/province/add-edit-province/add-edit-province.component';
import { AddEditRegionComponent } from './components/address-management/region/add-edit-region/add-edit-region.component';
import { AddEditCitiesComponent } from './components/address-management/cities/add-edit-cities/add-edit-cities.component';
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatSelectFilterModule } from 'mat-select-filter';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SupplierLogComponent } from './components/procurement-management/supplier-log/supplier-log.component';
import { AccessControlComponent } from './components/access-control/access-control.component';
import { AccessControlLogsComponent } from './components/access-control/logs/logs.component';
import { AccessControlUserBadgeComponent } from './components/access-control/user-badge/user-badge.component';
import { BlockPopupComponent } from './popup/block-popup/block-popup.component';
import { ViewUserBadgeComponent } from './components/access-control/user-badge/view-user-badge/view-user-badge.component';
import { AccessControlExtBadgeComponent } from './components/access-control/ext-badge/ext-badge.component';
import { ViewExtBadgeComponent } from './components/access-control/ext-badge/view-ext-badge/view-ext-badge.component';
import { AccessControlSystemComponent } from './components/access-control/systems/system.component';
import { AddEditAccessControlSystemComponent } from './components/access-control/systems/add-edit-system/add-edit-system.component';
import { AccessControlGateComponent } from './components/access-control/gates/gate.component';
import { AddEditAccessControlGateComponent } from './components/access-control/gates/add-edit-gate/add-edit-gate.component';
import { FilterJobApplicationsPopupComponent } from './components/recruiting/job-applications/filter-job-applications-popup/filter-job-applications-popup.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuardService } from "./service/MCAuthGuardService";
import { AddEditSupplierPrivacyPolicyComponent } from './components/cms/add-edit-supplier-privacy-policy/add-edit-supplier-privacy-policy.component';
import { AddEditSupplierTermsConditionsComponent } from './components/cms/add-edit-supplier-terms-conditions/add-edit-supplier-terms-conditions.component';
import { AddEditAccessControlGroupComponent } from './components/access-control/gates/add-edit-group/add-edit-group.component';
import { AccessControlBadgesComponent } from './components/access-control/badges/badges.component';
import { FilterAccessControlLogPopupComponent } from './popup/filter-access-control-log-popup/filter-access-control-log-popup.component';
import { ExtractAccessControlLogPopupComponent } from './popup/extract-access-control-log-popup/extract-access-control-log-popup.component';
import { AccessControlDashboardComponent } from './components/access-control/access-control-dashboard/access-control-dashboard.component';
import { AddAccessControlLogPopupComponent } from './popup/add-access-control-log-popup/add-access-control-log-popup.component';
import { BadgeHistoryPopupComponent } from './popup/badge-history-popup/badge-history-popup.component';
import { YesNoPopupComponent } from './popup/yesno-popup/yesno-popup.component';
import { ConfirmPopupComponent } from './popup/confirm-popup/confirm-popup.component';
import { EditCandidateRemainderComponent } from './components/recruiting/candidates/edit-candidate-remainder/edit-candidate-remainder.component';
import { RecruitingSettingsComponent } from './components/recruiting/recruiting-settings/recruiting-settings.component';
import { UserBadgeHistoryPopupComponent } from './popup/user-badge-history-popup/user-badge-history-popup.component';
import { BreadcrumbComponent } from './components/global/breadcrumb/breadcrumb.component';
import { UploadUserDocumentPopupComponent } from './popup/upload-user-document-popup/upload-user-document-popup.component';
import { ModifyUserDocumentPopupComponent } from './popup/modify-user-document-popup/modify-user-document-popup.component';
import { ViewFilePopupComponent } from './popup/view-file-popup/view-file-popup.component';
import { PaginationComponent } from './components/global/pagination/pagination.component';
import { MonitorPresencesHomeComponent } from './components/monitor-presences/monitor-presences-home.component';
import { MonitorEmployeesComponent } from './components/monitor-presences/employees/employees.component';
import { MonitorPresencesComponent } from './components/monitor-presences/presences/presences.component';
import { MonitorPresencesSettingsPopupComponent } from './popup/monitor-presences-settings-popup/monitor-presences-settings-popup.component';
import { WheelActionComponent } from './components/global/wheel-action/wheel-action.component';
import { EventManagementComponent } from './components/event-management/event-management.component';
import { EventDashboardComponent } from './components/event-management/event-dashboard/event-dashboard.component';
import { EventScopesComponent } from './components/event-management/event-scopes/event-scopes.component';
import { EventCalendarComponent } from './components/event-management/event-calendar/event-calendar.component';
import { EventCostCenterComponent } from './components/master-modules/event-cost-center/event-cost-center.component';
import { AddEditEventCostCenterComponent } from "./components/master-modules/event-cost-center/add-edit-event-cost-center/add-edit-event-cost-center.component";
import { EventServicesComponent } from './components/event-management/event-services/event-services.component';
import { EventExternalVenuesComponent } from './components/event-management/event-external-venues/event-external-venues.component';
import { EventListComponent } from './components/event-management/event-list/event-list.component';
import { EventSettingComponent } from './components/event-management/event-setting/event-setting.component';
import { CostCenterTypeComponent } from './components/master-modules/cost-center-type/cost-center-type.component';
import { DocumentTypeComponent } from './components/event-management/document-type/document-type.component';
import { AddEditDocumentTypeComponent } from './components/event-management/document-type/add-edit-document-type/add-edit-document-type.component';
import { AddEditCostCenterTypeComponent } from './components/master-modules/cost-center-type/add-edit-cost-center-type/add-edit-cost-center-type.component';
import { AddEditEventScopesComponent } from "./components/event-management/event-scopes/add-edit-event-scopes/add-edit-event-scopes.component";
import { AddEditEventServicesComponent } from "./components/event-management/event-services/add-edit-event-service/add-edit-event-services.component";
import { AddEditEventExternalVenuesComponent } from "./components/event-management/event-external-venues/add-edit-event-external-venues/add-edit-event-external-venues.component";
import { ViewEventServiceComponent } from './components/event-management/event-services/view-event-service/view-event-service.component';
import { CreateEventComponent } from './components/event-management/event-list/create-event/create-event.component'
import { AddCostCenterTypeComponent } from './popup/add-cost-center-type/add-cost-center-type.component'
import { AddEditSingleFieldPopupComponent } from './popup/add-edit-single-field-popup/add-edit-single-field-popup.component';
import { FilterListOfEventPopupComponent } from "./popup/filter-list-of-event-popup/filter-list-of-event-popup.component";
import { EventDetailsComponent } from './components/event-management/event-list/event-details/event-details.component';
import { CalenderEventDetailsComponent } from './components/event-management/event-calendar/event-details/event-details.component';
import { FullcalenderViewComponent } from './components/event-management/event-calendar/fullcalender-view/fullcalender-view.component';
// import { AngularCalendarYearViewModule } from 'angular-calendar-year-view';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from "@fullcalendar/angular";
import { NotificationDetailsComponent } from './popup/notification-details/notification-details.component';
import { EventCollapseExpandRowComponent } from './components/event-management/event-collapse-expand-row/event-collapse-expand-row.component';
import { SortTableColumnComponent } from './components/global/sort-table-column/sort-table-column.component';
import { AddExternalPeoplePopupComponent } from './popup/add-external-people-popup/add-external-people-popup.component';
import { TabsModule } from "ngx-bootstrap/tabs";
import { CreateEventDetailInfoComponent } from './components/event-management/event-list/create-event/create-event-detail-info/create-event-detail-info.component';
import { VenueStepComponent } from './components/event-management/event-list/create-event/venue-step/venue-step.component';
import { ResourceStepComponent } from './components/event-management/event-list/create-event/resource-step/resource-step.component';
import { ServiceStepComponent } from './components/event-management/event-list/create-event/service-step/service-step.component';
import { SearchAttendeeComponent } from './components/event-management/event-list/create-event/search-attendee/search-attendee.component';
import { InteralPeopleComponent } from './components/event-management/event-list/create-event/interal-people/interal-people.component';
import { ExternalListRowsComponent } from './components/event-management/event-list/create-event/external-list-rows/external-list-rows.component';
import { NoRecordFoundMessgaeWithFooterComponent } from './components/event-management/event-list/create-event/no-record-found-message-with-footer/no-record-found-message-with-footer.component';
import { DocumentsStepComponent } from './components/event-management/event-list/create-event/documents-step/documents-step.component';
import { CheckpointStepComponent } from './components/event-management/event-list/create-event/checkpoint-step/checkpoint-step.component';
import { ProcurementSettingsComponent } from './components/procurement-management/procurement-settings/procurement-settings.component';
import { EventEmailTemplateComponent } from './components/event-management/event-email-template/event-email-template.component';
import { EditEmailTemplateComponent } from "./components/event-management/event-email-template/edit-email-template/edit-email-template.component";
import { ListEmailTemplateComponent } from "./components/event-management/event-email-template/list-email-template/list-email-template.component";
import { AcceptEventComponent } from './components/event-management/event-list/accept-event/accept-event.component';
import { DeclineEventComponent } from './components/event-management/event-list/decline-event/decline-event.component';
import { UserPlanPopupComponent } from './popup/user-plan-popup/user-plan-popup.component';
import { EventListPopupComponent } from './popup/event-list-popup/event-list-popup.component';
import { EditEventCreditPopupComponent } from './popup/edit-event-credit-popup/edit-event-credit-popup.component';
import { AttendeeFilterPopupComponent } from './popup/attendee-filter-popup/attendee-filter-popup.component';
import { MonitorEmployeeSettingsPopupComponent } from './popup/monitor-employee-settings-popup/monitor-employee-settings-popup.component';
import { GlobalLoaderInterceptor } from './service/global-loader.interceptor'
import { EditAttendeeUserCreditPopupComponent } from './popup/edit-attendee-user-credit-popup/edit-attendee-user-credit-popup.component';
import { MobileAppQrComponent } from './components/profile/mobile-app-qr/mobile-app-qr.component';
import { ProcurementEmailTemplateComponent } from './components/procurement-management/procurement-email-template/procurement-email-template.component';
import { ProcurementEditTemplateComponent } from './components/procurement-management/procurement-email-template/procurement-edit-template/procurement-edit-template.component';
import { ProcurementListTemplateComponent } from './components/procurement-management/procurement-email-template/procurement-list-template/procurement-list-template.component';
import { EventConfirmationComponent } from './components/event-management/event-list/event-confirmation/event-confirmation.component'
import { ProductsTrackingComponent } from './components/products-tracking/products-tracking.component';
import { ProductsTrackingDashboardComponent } from './components/products-tracking/products-tracking-dashboard/products-tracking-dashboard.component';
import { ProductsTrackingWorkOrdersComponent } from './components/products-tracking/products-tracking-work-orders/products-tracking-work-orders.component';
import { ProductsTrackingItemsComponent } from './components/products-tracking/products-tracking-items/products-tracking-items.component';
import { ProductsTrackingCustomerOrdersComponent } from './components/products-tracking/products-tracking-customer-orders/products-tracking-customer-orders.component';
import { ProductsTrackingWorkPlansComponent } from './components/products-tracking/products-tracking-work-plans/products-tracking-work-plans.component';
import { ProductsTrackingPlanExpandRowComponent } from './components/products-tracking/products-tracking-production-plans/products-tracking-plan-expand-row/products-tracking-plan-expand-row.component';
import { ProductsTrackingProductionPlansComponent } from './components/products-tracking/products-tracking-production-plans/products-tracking-production-plans.component';
import { ProductsTrackingWorkPlanExpandRowComponent } from './components/products-tracking/products-tracking-work-plans/products-tracking-work-plan-expand-row/products-tracking-work-plan-expand-row.component';
import { ProductsTrackingShiftsComponent } from './components/products-tracking/products-tracking-shifts/products-tracking-shifts.component';
import { ProductsTrackingShiftsManagementComponent } from './components/products-tracking/products-tracking-shifts-management/products-tracking-shifts-management.component';
import { ProductsTrackingOrderExpandRowComponent } from './components/products-tracking/products-tracking-customer-orders/products-tracking-order-expand-row/products-tracking-order-expand-row.component';
import { GroupUserListComponent } from './components/access-control/gates/group-user-list/group-user-list.component';
import { AccessControlBadgeFilterPopupComponent } from './popup/access-control-badge-filter-popup/access-control-badge-filter-popup.component';
import { StaffDocumentComponent } from "./components/master-modules/staff-documents/staff-document.component";
import { AddEditStaffDocumentComponent } from "./components/master-modules/staff-documents/add-edit-staff-document/add-edit-staff-document.component";
import { AddEmployeeComponent } from './components/people/add-employee/add-employee.component';
import { EventManagementSecretCodeComponent } from './components/profile/settings/event-management-secret-code/event-management-secret-code.component';
import { ActivePagePopupComponent } from './popup/active-page-popup/active-page-popup.component';
import { EmcLoginComponent } from './emc/login/login.component';
import { EMCForgotPasswordComponent} from "./emc/forgot-password/forgot-password.component";
import { EMCResetPasswordComponent} from "./emc/reset-password/reset-password.component";
import { ResourceGroupInfoComponent } from './components/assets-management/resource-group-info/resource-group-info.component';
import { AddEditResourceComponent } from './components/assets-management/add-edit-resource/add-edit-resource.component';
import { ResourceTypeComponent } from './components/assets-management/resource-type/resource-type.component';
import { AddEditResourcetypeComponent } from './components/assets-management/resource-type/add-edit-resourcetype/add-edit-resourcetype.component';
import { SendEmailPopupComponent } from './popup/send-email-popup/send-email-popup.component';
import {SatPopoverModule} from "@ncstate/sat-popover";
import {SafePipe} from "./service/pipe.service";
import { ResourceReservationComponent } from './components/assets-management/resource-group-info/resource-reservation/resource-reservation.component';
import { BookResourcePopupComponent } from './popup/book-resource-popup/book-resource-popup.component';
registerLocaleData(localeIt);

@Injectable()
export class MyDateAdapter extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
        return 1;
    }
}

const defaultDataServiceConfig: DefaultDataServiceConfig = {
    root: environment.api_host + '{api_prefix}',
    timeout: 20000,
};

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
    dayGridPlugin,
    timeGrigPlugin,
    interactionPlugin
]);
@NgModule({
    declarations: [
        SafePipe,
        AppComponent,
        LoginComponent,
        ResetPasswordComponent,
        ForgotPasswordComponent,
        LayoutComponent,
        LoginLayoutComponent,
        HomeLayoutComponent,
        HeaderComponent,
        SidenavListComponent,
        DashboardComponent,
        RecruitingComponent,
        RecruitingDashboardComponent,
        JobApplicationsComponent,
        DeletePopupComponent,
        CancelPopupComponent,
        ReActivateEventPopupComponent,
        ViewJobApplicationsComponent,
        EditJobApplicationsComponent,
        CandidatesComponent,
        ViewCandidatesComponent,
        PeopleManagementComponent,
        AddEditRolesComponent,
        AddEditJobTitleComponent,
        AddEditAreasComponent,
        EditCompanyComponent,
        SettingsComponent,
        EmailConfigurationComponent,
        ServerSettingsComponent,
        GreenpassSettingsComponent,
        NativeLanguagesComponent,
        WorkSettingsComponent,
        DashboardCustomizationComponent,
        PeopleComponent,
        AddUserComponent,
        ManageRFQComponent,
        AddEditRFQComponent,
        ManageSupplierComponent,
        ManageServiceComponent,
        ViewDetailsManageServiceComponent,
        AddEditServiceAgreementPopupComponent,
        AddEditServiceComponent,
        ProcurementManagementComponent,
        AddEditSupplierComponent,
        ViewManageSupplierComponent,
        RefuseSupplierDialogComponent,
        AddEditSurveyComponent,
        PeopleSingleScopePageComponent,
        PeopleGroupsComponent,
        AccountsComponent,
        ImportAccountComponent,
        SitesComponent,
        AlertsComponent,
        PushNotificationComponent,
        TouchpointManagementComponent,
        UnlockPairingDialogComponent,
        QrCodeDialogComponent,
        MasterModulesComponent,
        EventTypesComponent,
        DisputeTypesComponent,
        ScopesComponent,
        UniversityComponent,
        DegreeComponent,
        AssetsManagementComponent,
        ResourceGroupComponent,
        ResourceManagementComponent,
        JobOpeningsComponent,
        ActionTilesComponent,
        ManageInformationComponent,
        CategoriesComponent,
        InformationsComponent,
        ProcurementDashboardComponent,
        QuotationComponent,
        QuizSurveyComponent,
        CategoriesComponent,
        CalenderEventDetailsComponent,
        CategoryComponent,
        SurveyComponent,
        QuestionsComponent,
        MetricsComponent,
        AddEditCategoryComponent,
        AddEditedSurveyComponent,
        AddEditQuestionComponent,
        AddEditMetricsComponent,
        AddEditEventComponent,
        AddEditDisputePopupComponent,
        AddEditAccountComponent,
        AddEditTouchpointSiteComponent,
        TouchpointConfigurationComponent,
        AddEditResourceGroupComponent,
        AddEditPushNotificationComponent,
        AddEditParkingComponent,
        AddEditGroupComponent,
        AddEditSupplierEmailComponent,
        AddEditSiteComponent,
        AddEditJobOpeningComponent,
        AddEditVideoAssessmentComponent,
        ViewMetricsComponent,
        ViewQuestionComponent,
        EventsSettingsComponent,
        AddEditPeopleScopesComponent,
        EditEmployeeComponent,
        AddEmployeeComponent,
        RequestMoreDetailDialogComponent,
        ViewApplicationComponent,
        ViewSurveyComponent,
        AddEditFitIndexComponent,
        AddEditAlertComponent,
        LogAuditComponent,
        AddEditCategoriesComponent,
        SeeLogComponent,
        CmsComponent,
        AddEditPrivacyPolicyComponent,
        AddEditTermsConditionsComponent,
        AddEditRecruitingComponent,
        ViewAreaDetailsComponent,
        AddEditInformationsComponent,
        AddEditSideEffectComponent,
        SettingPushNotificationComponent,
        ChangeLogDialogPopupComponent,
        ShowUserActivityPopupComponent,
        ImportPeopleReportPopupComponent,
        AddEditSurveyQuestionsPopupComponent,
        AddEditFitIndexPopupComponent,
        SitesStatusChangePopupComponent,
        AddressManagementComponent,
        CountryComponent,
        ProvinceComponent,
        RegionComponent,
        CitiesComponent,
        AddEditCountryComponent,
        AddEditProvinceComponent,
        AddEditRegionComponent,
        AddEditCitiesComponent,
        SupplierLogComponent,
        AccessControlComponent,
        AccessControlLogsComponent,
        AccessControlBadgesComponent,
        AccessControlUserBadgeComponent,
        AccessControlExtBadgeComponent,
        BlockPopupComponent,
        ViewUserBadgeComponent,
        ViewExtBadgeComponent,
        AccessControlSystemComponent,
        AddEditAccessControlSystemComponent,
        AccessControlGateComponent,
        AddEditAccessControlGateComponent,
        AddEditAccessControlGroupComponent,
        GroupUserListComponent,
        FilterJobApplicationsPopupComponent,
        PageNotFoundComponent,
        AddEditSupplierPrivacyPolicyComponent,
        AddEditSupplierTermsConditionsComponent,
        FilterAccessControlLogPopupComponent,
        ExtractAccessControlLogPopupComponent,
        AccessControlDashboardComponent,
        AddAccessControlLogPopupComponent,
        BadgeHistoryPopupComponent,
        YesNoPopupComponent,
        UserBadgeHistoryPopupComponent,
        ConfirmPopupComponent,
        EditCandidateRemainderComponent,
        RecruitingSettingsComponent,
        YesNoPopupComponent,
        UploadUserDocumentPopupComponent,
        ModifyUserDocumentPopupComponent,
        ViewFilePopupComponent,
        BreadcrumbComponent,
        PaginationComponent,
        MonitorPresencesHomeComponent,
        MonitorEmployeesComponent,
        MonitorPresencesComponent,
        MonitorPresencesSettingsPopupComponent,
        WheelActionComponent,
        EventManagementComponent,
        EventDashboardComponent,
        EventScopesComponent,
        EventCalendarComponent,
        EventCostCenterComponent,
        EventServicesComponent,
        EventExternalVenuesComponent,
        EventListComponent,
        EventSettingComponent,
        BreadcrumbComponent,
        CostCenterTypeComponent,
        DocumentTypeComponent,
        AddEditEventScopesComponent,
        AddEditEventCostCenterComponent,
        AddEditCostCenterTypeComponent,
        AddEditEventScopesComponent,
        AddEditDocumentTypeComponent,
        AddEditEventServicesComponent,
        AddEditEventExternalVenuesComponent,
        ViewEventServiceComponent,
        AddCostCenterTypeComponent,
        CreateEventComponent,
        AddEditSingleFieldPopupComponent,
        FilterListOfEventPopupComponent,
        EventDetailsComponent,
        FullcalenderViewComponent,
        NotificationDetailsComponent,
        EventCollapseExpandRowComponent,
        SortTableColumnComponent,
        AddExternalPeoplePopupComponent,
        CreateEventDetailInfoComponent,
        VenueStepComponent,
        ResourceStepComponent,
        EditEmailTemplateComponent,
        ListEmailTemplateComponent,
        ServiceStepComponent,
        SearchAttendeeComponent,
        InteralPeopleComponent,
        ExternalListRowsComponent,
        NoRecordFoundMessgaeWithFooterComponent,
        DocumentsStepComponent,
        CheckpointStepComponent,
        ProcurementSettingsComponent,
        EventEmailTemplateComponent,
        AcceptEventComponent,
        DeclineEventComponent,
        UserPlanPopupComponent,
        EventListPopupComponent,
        EditEventCreditPopupComponent,
        AttendeeFilterPopupComponent,
        MonitorEmployeeSettingsPopupComponent,
        EditAttendeeUserCreditPopupComponent,
        MobileAppQrComponent,
        ProcurementEmailTemplateComponent,
        ProcurementEditTemplateComponent,
        ProcurementListTemplateComponent,
        EventConfirmationComponent,
        StaffDocumentComponent,
        AddEditStaffDocumentComponent,
        ProductsTrackingComponent,
        ProductsTrackingDashboardComponent,
        ProductsTrackingWorkOrdersComponent,
        ProductsTrackingItemsComponent,
        ProductsTrackingCustomerOrdersComponent,
        ProductsTrackingWorkPlansComponent,
        ProductsTrackingPlanExpandRowComponent,
        ProductsTrackingProductionPlansComponent,
        ProductsTrackingWorkPlanExpandRowComponent,
        ProductsTrackingShiftsComponent,
        ProductsTrackingShiftsManagementComponent,
        ProductsTrackingOrderExpandRowComponent,
        AccessControlBadgeFilterPopupComponent,
        EventManagementSecretCodeComponent,
        ActivePagePopupComponent,
        EmcLoginComponent,
        EMCForgotPasswordComponent,
        EMCResetPasswordComponent,
        ResourceGroupInfoComponent,
        AddEditResourceComponent,
        ResourceTypeComponent,
        AddEditResourcetypeComponent,
        SendEmailPopupComponent,
        ResourceReservationComponent,
        BookResourcePopupComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule,
        BrowserAnimationsModule,
        ChartsModule,
        NgxPaginationModule,
        HttpClientModule,
        AngularEditorModule,
        MatSnackBarModule,
        PdfViewerModule,
        DragDropModule,
        FlexLayoutModule,
        MatSelectFilterModule,
        NgxMaterialTimepickerModule,
        NgbDatepickerModule,
        FeCommonModule.forRoot({env: environment}),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ClipboardModule,
        QRCodeModule,
        FullCalendarModule,
        NgxMatSelectSearchModule,
        // AngularCalendarYearViewModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
            // registrationStrategy: 'registerImmediately'
        }),
        TabsModule,
        SatPopoverModule,

    ],
    // providers: [{ provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }, MCPHelperService, TklabMqsService],
    providers: [
        MCPHelperService,
        TklabMqsService,
        ExcelService,
        DatePipe,
        AuthGuardService,
        { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
        {
            provide: LOCALE_ID,
            useValue: 'en'
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'en'
        },
        {
            provide: DateAdapter,
            useClass: MyDateAdapter
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GlobalLoaderInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/');
}
