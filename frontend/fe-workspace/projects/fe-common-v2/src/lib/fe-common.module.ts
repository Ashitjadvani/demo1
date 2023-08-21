import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Configurations } from './configurations';
import { FeCommonComponent } from './fe-common.component';
import { MaterialDesignModule } from './core/material-design';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';
import { JwtInterceptor } from './core/jwt-interceptor';
import { PropertyInputComponent } from './components/property-input/property-input.component';
import { PersonInputAutocompleteComponent } from './components/person-input-autocomplete/person-input-autocomplete.component';
import { ListActionMenuComponent } from './components/list-action-menu/list-action-menu.component';

@NgModule({
    declarations: [
        FeCommonComponent,
        ConfirmDialogComponent,
        QrScannerComponent,
        PropertyInputComponent,
        PersonInputAutocompleteComponent,
        ListActionMenuComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule,
        HttpClientModule,
        MaterialDesignModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ],
    exports: [
        FeCommonComponent,
        MaterialDesignModule,
        QrScannerComponent,
        PropertyInputComponent,
        PersonInputAutocompleteComponent,
        ListActionMenuComponent
    ],
    entryComponents: [
        // ServicesSheetComponent,

        ConfirmDialogComponent,
        // SiteManagementDialogComponent,
        // UserManagementDialogComponent,
        // SiteDailyStatusDialogComponent,
        // UserDailyAccessDialogComponent,
        // NewsUploadDialogComponent,
        // QrCodeDialogComponent,
        // UserPlanLegendComponent,
        // SiteRestrictedmodeDialogComponent,
        // AddSafetyDialogComponent,
        // ModifySafetyDialogComponent,
        // UserCalendarPlanDialogComponent,
        // DateAreaPickerDialogComponent,
        // SafetyUsersDialogComponent,
        // SchedulerManagementDialogComponent,
        // ScheduleSendmailDialogComponent,
        // ReservationSiteDialogComponent,
        // ReservationSiteConfigDialogComponent,
        // UserHealthStatusDialogComponent,
        // ApmSettingsDialogComponent,
        // ApmAddCaseDialogComponent
    ],

})

export class FeCommonModule {
    public static forRoot(config: Configurations): ModuleWithProviders<FeCommonModule> {
        return {
            ngModule: FeCommonModule,
            providers: [
                { provide: Configurations, useValue: config }
            ]
        };
    }
}
