import { Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './core/app-routing.module';
// import { FeCommonModule } from 'fe-common';
import { FeCommonModule } from 'projects/fe-common/src/lib';

import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { environment } from 'projects/fe-insights/src/environments/environment';
import { QRCodeModule } from 'angular2-qrcode';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MaterialDesignModule } from 'projects/fe-common/src/lib/core/material-design';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { TableDataViewComponent } from './components/table-data-view/table-data-view.component';
import { PeoplePageComponent } from './pages/people-page/people-page.component';
import { PeopleSingleScopePageComponent } from './pages/people-page/people-single-scope-page/people-single-scope-page.component';
import { AccountsPageComponent } from './pages/accounts-page/accounts-page.component';
import { UserManagementDialogComponent } from './dialogs/user-management-dialog/user-management-dialog.component';
import { AccountManagementDialogComponent } from './dialogs/account-management-dialog/account-management-dialog.component';
import { LogAuditPageComponent } from './pages/log-audit-page/log-audit-page.component';
import { SitesPageComponent } from './pages/sites-page/sites-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { TouchpointPageComponent } from './pages/touchpoint-page/touchpoint-page.component';
import { TouchpointConfigDialogComponent } from './pages/touchpoint-page/touchpoint-config-dialog/touchpoint-config-dialog.component';
import { TouchpointSettingsDialogComponent } from './pages/touchpoint-page/touchpoint-settings-dialog/touchpoint-settings-dialog.component';
import { CompanyPageComponent } from './pages/company-page/company-page.component';
import { GeneralSectionComponent } from './pages/company-page/general-section/general-section.component';
import { GroupsSectionComponent } from './pages/company-page/groups-section/groups-section.component';
import { SitesSectionComponent } from './pages/company-page/sites-section/sites-section.component';
import { GreenpassSettingsSectionComponent } from './pages/company-page/greenpass-settings-section/greenpass-settings-section.component';
import { TablesSectionComponent } from './pages/company-page/tables-section/tables-section.component';
import { PersonGroupManagementDialogComponent } from './dialogs/person-group-management-dialog/person-group-management-dialog.component';
import { PropertyInputComponent } from './components/property-input/property-input.component';
import { PeopleManagementSectionComponent } from './pages/company-page/people-management-section/people-management-section.component';
import { NewAreaDialogComponent } from './pages/company-page/people-management-section/people-management-new-area-dialog/new-area-dialog.component';
import { NewRoleDialogComponent } from './pages/company-page/people-management-section/people-management-new-role-dialog/new-role-dialog.component';
import { NewJobTitleDialogComponent } from './pages/company-page/people-management-section/people-management-new-jobtitle-dialog/new-jobtitle-dialog.component';
import { PeopleGroupPageComponent } from './pages/people-group-page/people-group-page.component';
import { GeneralTypesComponent } from './pages/company-page/general-types/general-types.component';
import { PeopleGeneralSectionComponent } from './pages/people-page/people-single-scope-page/people-general-section/people-general-section.component';
import { PeopleContactSectionComponent } from './pages/people-page/people-single-scope-page/people-contact-section/people-contact-section.component';
import { PeopleSettingsSectionComponent } from './pages/people-page/people-single-scope-page/people-settings-section/people-settings-section.component';
import { PeopleDisputeSectionComponent } from './pages/people-page/people-single-scope-page/people-dispute-section/people-dispute-section.component';
import { PeopleEconomicsSectionComponent } from './pages/people-page/people-single-scope-page/people-economics-section/people-economics-section.component';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { PeopleChangeLogPopupComponent } from './pages/people-page/people-single-scope-page/people-change-log-popup/people-change-log-popup.component';
import { PeopleGroupGeneralSectionComponent } from './pages/people-group-page/people-group-general-section/people-group-general-section.component';
import { PeopleGroupMembersSectionComponent } from './pages/people-group-page/people-group-members-section/people-group-members-section.component';
import { PeopleGroupFunctionsSectionComponent } from './pages/people-group-page/people-group-functions-section/people-group-functions-section.component';
import { AlertsPageComponent } from './pages/alerts-page/alerts-page.component';
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { ActionTilePageComponent } from './pages/action-tile-page/action-tile-page.component';
import { InformationsPageComponent } from './pages/informations-page/informations-page.component';
import { InformationsSectionComponent } from './pages/informations-page/informations-section/informations-section.component';
import { InformationsCategoriesSectionComponent } from './pages/informations-page/categories-section/informations-categories-section.component';
import { PeoplePickerComponent } from './components/people-picker/people-picker.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { OfficeActivityPageComponent } from './pages/office-activity-page/office-activity-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MonthChooserDialogComponent } from './dialogs/month-chooser-dialog/month-chooser-dialog.component';
import { PeopleDashboardDialogComponent } from './dialogs/people-dashboard-dialog/people-dashboard-dialog.component';
import { JustificationSectionComponent } from './pages/company-page/justification-section/justification-section.component';
import { JustificationsSettingsDialogComponent } from './pages/company-page/justification-section/justification-settings-dialog/justifications-settings-dialog.component';
import { ScopeDialogComponent } from './pages/company-page/tables-section/scope-dialog/scope-dialog.component';
import { ModifyAccessControlGroupDialogComponent } from './pages/sites-page/modify-access-control-group-dialog/modify-access-control-group-dialog.component';
import { ExcelService } from './services/excel.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {ClipboardModule} from '@angular/cdk/clipboard';

registerLocaleData(localeIt);


import { StoreModule } from '@ngrx/store';
import { irinaReducer } from './store/irina.reducer';
import { extModules } from '../build-spec';
import { EffectsModule } from '@ngrx/effects';
import { WorkSettingsSectionComponent } from './pages/company-page/work-settings-section/work-settings-section.component';
import {
    DefaultDataServiceConfig, EntityCollectionReducerMethodsFactory,
    EntityDataModule,
    EntityDispatcherDefaultOptions,
    PersistenceResultHandler
} from '@ngrx/data';
import { entityConfig } from './features/ngrx.conf';
import { InterceptService } from './services/intercept.service';
import { AdditionalPropertyPersistenceResultHandler } from './features/recruiting/store/results-handler';
import { AdditionalEntityCollectionReducerMethodsFactory } from './features/recruiting/store/collection-reducer-methods';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { EmailConfigurationComponent } from './pages/company-page/email-configuration-section/email-configuration-section.component';
import { RecruitingDashboardPageComponent } from './pages/recruiting/recruiting-dashboard-page.component';
import { ActionTileComponent } from './pages/recruiting/components/action-tile/action-tile.component';
import { RecruitingOpeningsComponent } from './pages/recruiting/recruiting-openings/recruiting-openings.component';
import { QuizSurveyListingPageComponent } from './pages/quiz-survey-page/quiz-survey-listing-page/quiz-survey-listing-page.component';
import { InsertSurveyComponent } from './pages/quiz-survey-page/insert-survey/insert-survey.component';
import { AddQuestionsComponent } from './pages/quiz-survey-page/add-questions/add-questions.component';
import { RecruitingApplicationsComponent } from './pages/recruiting/recruiting-applications/recruiting-applications.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RecruitingCandidatesComponent } from './pages/recruiting/recruiting-candidates/recruiting-candidates.component';
import { TableDataViewMqsComponent } from "./pages/recruiting/components/table-data-view/table-data-view.component";
import {
  FiltersDialogMqsComponent,
  MyOpenFilterPipe
} from "./pages/recruiting/components/filtering/filters-dialog/filters-dialog.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { UniversitySectionComponent } from './pages/company-page/university-section/university-section.component';
import { DegreeSectionComponent } from './pages/company-page/degree-section/degree-section.component';
import { AddEditDegreeDialogComponent } from './pages/company-page/degree-section/add-edit-degree-dialog/add-edit-degree-dialog.component';
import { AddEditUniversityDialogComponent } from './pages/company-page/university-section/add-edit-university-dialog/add-edit-university-dialog.component';
import { TicketGeneratePageComponent } from './pages/ticket-generate-page/ticket-generate-page.component';
import { CmsComponent } from './pages/cms/cms.component';
import { ProductsTrackingPageComponent } from './pages/products-tracking-page/products-tracking-page.component';
import { FileSaverModule } from "ngx-filesaver";
import { ProductsTrackingInfoPageComponent } from './pages/products-tracking-info-page/products-tracking-info-page.component';
import { HelpdeskSheetComponent } from './pages/products-tracking-info-page/helpdesk-sheet/helpdesk-sheet.component';
import { ResourceTypeManagementComponent } from './pages/resource-type-management/resource-type-management.component';
import { TimeslotTableEditorComponent } from './pages/resource-type-management/timeslot-table-editor/timeslot-table-editor.component';
import {AddEditCustomFieldsDialogComponent} from './pages/recruiting/recruiting-openings/add-edit-custom-fields--dialog/add-edit-custom-fields-dialog.component';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { RoomResourceListManagementComponent } from './pages/resource-type-management/room-resource-list-management/room-resource-list-management.component';
import { ResourceListManagementComponent } from './pages/resource-type-management/resource-list-management/resource-list-management.component';
import { TimeslotResourceListManagementComponent } from './pages/resource-type-management/timeslot-resource-list-management/timeslot-resource-list-management.component';
import { HtmlEditorDialogComponent } from './dialogs/html-editor-dialog/html-editor-dialog.component';
import {MatSliderModule} from "@angular/material/slider";
import { PeopleAccessSectionComponent } from './pages/people-page/people-single-scope-page/people-access-section/people-access-section.component';
import { ActivityLogPopupComponent } from './pages/recruiting/recruiting-openings/activity-log-popup/activity-log-popup.component';
import {MatInputModule} from '@angular/material/input';
import { GenerateAccessControlQrCodeDialogComponent } from './pages/sites-page/generate-access-control-qrcode-dialog/generate-access-control-qrcode-dialog.component';
import { GeneratedAccessControlQrCodeDialogComponent } from './pages/sites-page/generated-access-control-qrcode-dialog/generated-access-control-qrcode-dialog.component';
import { GenerateAccessControlCentralUnitsDialogComponent } from './pages/sites-page/generate-access-control-centralunits-dialog/generate-access-control-centralunits-dialog.component';
import { ViewAccessControlCentralUnitsQrCodeDialogComponent } from './pages/sites-page/view-access-control-centralunits-qrcode-dialog/view-access-control-centralunits-qrcode-dialog.component';
import { ViewAccessControlResponseDialogComponent } from './pages/sites-page/view-access-control-response-dialog/view-access-control-response-dialog.component';
import { SendAccessControlCommandDialogComponent } from './pages/sites-page/send-access-control-command-dialog/send-access-control-command-dialog.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { DownloadPreviewDialogComponent } from './pages/recruiting/recruiting-applications/download-preview-dialog/download-preview-dialog.component';
import {PdfViewerModule} from "ng2-pdf-viewer";
import { AccessControlPageComponent } from './pages/access-control-page/access-control-page.component';
import { AccessControlLogFilterDialogComponent } from './pages/access-control-page/access-control-log-filter-dialog/access-control-log-filter-dialog.component';
import { ViewAccessControlQrCodeDialogComponent } from './pages/access-control-page/view-access-control-qrcode-dialog/view-access-control-qrcode-dialog.component';
import { ResourceBookingDialogComponent } from './dialogs/resource-booking-dialog/resource-booking-dialog.component';
import { BookSearchResultsComponent } from './dialogs/resource-booking-dialog/book-search-results/book-search-results.component';
import { BookRoomDetailsPageComponent } from './dialogs/resource-booking-dialog/book-room-details-page/book-room-details-page.component';
import { BookResourceListItemComponent } from './dialogs/resource-booking-dialog/book-resource-list-item/book-resource-list-item.component';
import { AttendeePickerComponent } from './dialogs/resource-booking-dialog/attendee-picker/attendee-picker.component';
import { PeopleDocumentsSectionComponent } from './pages/people-page/people-single-scope-page/people-documents-section/people-documents-section.component';
import { UploadUserDocumentDialogComponent } from './pages/people-page/people-single-scope-page/people-documents-section/upload-user-document-dialog/upload-user-document-dialog.component';
import { ModifyUserDocumentDialogComponent } from './pages/people-page/people-single-scope-page/people-documents-section/modify-user-document-dialog/modify-user-document-dialog.component';
import { ViewUserDocumentDialogComponent } from './pages/people-page/people-single-scope-page/people-documents-section/view-user-document-dialog/view-user-document-dialog.component';
import { SendAccessControlQrCodeDialogComponent } from './pages/access-control-page/send-access-control-qrcode-dialog/send-access-control-qrcode-dialog.component';
import { ViewCustomAccessControlQrCodeDialogComponent } from './pages/access-control-page/view-custom-access-control-qrcode-dialog/view-custom-access-control-qrcode-dialog.component';
import { ViewUserQrCodesDialogComponent } from './pages/people-page/people-single-scope-page/people-access-section/view-user-qrcodes-dialog/view-user-qrcodes-dialog.component';
import { CompanyAccessControlSectionComponent } from './pages/company-page/access-control/access-control-section.component';


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

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        DashboardPageComponent,
        HeaderBarComponent,
        TableDataViewComponent,
        PeoplePageComponent,
        PeopleSingleScopePageComponent,
        AccountsPageComponent,
        UserManagementDialogComponent,
        AccountManagementDialogComponent,
        TouchpointConfigDialogComponent,
        TouchpointSettingsDialogComponent,
        LogAuditPageComponent,
        SitesPageComponent,
        SettingsPageComponent,
        TouchpointPageComponent,
        CompanyPageComponent,
        GeneralSectionComponent,
        GroupsSectionComponent,
        SitesSectionComponent,
        TablesSectionComponent,
        PersonGroupManagementDialogComponent,
        PropertyInputComponent,
        PeopleManagementSectionComponent,
        PeopleGroupPageComponent,
        GeneralTypesComponent,
        PeopleGeneralSectionComponent,
        PeopleContactSectionComponent,
        PeopleSettingsSectionComponent,
        PeopleDisputeSectionComponent,
        PeopleEconomicsSectionComponent,
        PeopleChangeLogPopupComponent,
        PeopleGroupGeneralSectionComponent,
        PeopleGroupMembersSectionComponent,
        PeopleGroupFunctionsSectionComponent,
        AlertsPageComponent,
        ActionTilePageComponent,
        InformationsPageComponent,
        InformationsSectionComponent,
        InformationsCategoriesSectionComponent,
        PeoplePickerComponent,
        OfficeActivityPageComponent,
        MonthChooserDialogComponent,
        PeopleDashboardDialogComponent,
        JustificationSectionComponent,
        JustificationsSettingsDialogComponent,
        WorkSettingsSectionComponent,
        ScopeDialogComponent,
        NewAreaDialogComponent,
        NewRoleDialogComponent,
        NewJobTitleDialogComponent,
        ForgotPasswordPageComponent,
        EmailConfigurationComponent,
        InsertSurveyComponent,
        AddQuestionsComponent,
        TicketGeneratePageComponent,
        QuizSurveyListingPageComponent,
        RecruitingDashboardPageComponent,
        RecruitingOpeningsComponent,
        ActionTileComponent,
        TableDataViewMqsComponent,
        FiltersDialogMqsComponent,
        RecruitingApplicationsComponent,
        RecruitingCandidatesComponent,
        UniversitySectionComponent,
        DegreeSectionComponent,
        AddEditDegreeDialogComponent,
        AddEditUniversityDialogComponent,
        CmsComponent,
        ProductsTrackingPageComponent,
        GreenpassSettingsSectionComponent,
        AddEditCustomFieldsDialogComponent,
        ProductsTrackingInfoPageComponent,
        HelpdeskSheetComponent,
        ResourceTypeManagementComponent,
        TimeslotTableEditorComponent,
        TimeslotResourceListManagementComponent,
        ResourceListManagementComponent,
        RoomResourceListManagementComponent,
        HtmlEditorDialogComponent,
        ActivityLogPopupComponent,
        MyOpenFilterPipe,
        ModifyAccessControlGroupDialogComponent,
        PeopleAccessSectionComponent,
        PeopleDocumentsSectionComponent,
        GenerateAccessControlQrCodeDialogComponent,
        GeneratedAccessControlQrCodeDialogComponent,
        GenerateAccessControlCentralUnitsDialogComponent,
        ViewAccessControlCentralUnitsQrCodeDialogComponent,
        ViewAccessControlResponseDialogComponent,
        SendAccessControlCommandDialogComponent,
        DownloadPreviewDialogComponent,
        AccessControlPageComponent,
        AccessControlLogFilterDialogComponent,
        ViewAccessControlQrCodeDialogComponent,
        AccessControlLogFilterDialogComponent,
        ResourceBookingDialogComponent,
        BookSearchResultsComponent,
        BookRoomDetailsPageComponent,
        BookResourceListItemComponent,
        AttendeePickerComponent,
        UploadUserDocumentDialogComponent,
        ModifyUserDocumentDialogComponent,
        ViewUserDocumentDialogComponent,
        SendAccessControlQrCodeDialogComponent,
        ViewCustomAccessControlQrCodeDialogComponent,
        ViewUserQrCodesDialogComponent,
        CompanyAccessControlSectionComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        FeCommonModule.forRoot({env: environment}),
        QRCodeModule,
        BrowserAnimationsModule,
        MaterialDesignModule,
        FlexLayoutModule,
        SatPopoverModule,
        CKEditorModule,
        ClipboardModule,
        MatInputModule,
        NgxMaterialTimepickerModule.setLocale('it-IT'),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ColorPickerModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        StoreModule.forRoot({irinaReducer}),
        EffectsModule.forRoot([]),
        ...extModules,
        EntityDataModule.forRoot(entityConfig),
        FileSaverModule,
        AngularEditorModule,
        MatSliderModule,
        DragDropModule,
        PdfViewerModule
    ],
    exports: [
        TableDataViewComponent,
        MyOpenFilterPipe,
        DragDropModule
    ],
    entryComponents: [

    ],
    providers: [
        { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
        { provide: EntityDispatcherDefaultOptions, useValue: { optimisticDelete: false } },
        { provide: PersistenceResultHandler, useClass: AdditionalPropertyPersistenceResultHandler },
        { provide: EntityCollectionReducerMethodsFactory, useClass: AdditionalEntityCollectionReducerMethodsFactory },
        { provide: HTTP_INTERCEPTORS, useClass: InterceptService, multi: true },
        {
            provide: LOCALE_ID,
            useValue: 'it-IT'
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'it-IT'
        },
        {
            provide: DateAdapter,
            useClass: MyDateAdapter
        },
        ExcelService
    ],
    bootstrap: [
        AppComponent
    ],
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
