import * as Hammer from 'hammerjs';
import { Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { AppRoutingModule } from './core/app-routing.module';

import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MaterialDesignModule } from 'projects/fe-common/src/lib/core/material-design';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { environment } from 'projects/fe-app/src/environments/environment';
import { QRCodeModule } from 'angular2-qrcode';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FeCommonModule } from 'projects/fe-common/src/lib';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar.component';
import { ServiceSheetComponent } from './pages/home-page/service-sheet/service-sheet.component';
import { MainActionTileComponent } from './components/main-action-tile/main-action-tile.component';
import { ActionTileComponent } from './components/action-tile/action-tile.component';
import { UserCalendarPageComponent } from './pages/user-calendar-page/user-calendar-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { QrScannerPageComponent } from './pages/qr-scanner-page/qr-scanner-page.component';
import { AlertPageComponent } from './pages/alert-page/alert-page.component';
import { AlertTileComponent } from './components/alert-tile/alert-tile.component';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';
import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { QuestionTileComponent } from './components/question-tile/question-tile.component';
import { InformationPageComponent } from './pages/information-page/information-page.component';
import { InformationTileComponent } from './components/information-tile/information-tile.component';
import { EmployeePageComponent } from './pages/employee-page/employee-page.component';
import { RequestTileComponent } from './components/request-tile/request-tile.component';
import { RequestNoteDialogComponent } from './components/request-tile/note-dialog/note-dialog.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QrCodeDialogComponent } from './dialogs/qr-code-dialog/qr-code-dialog.component';
import { UserActivityLogDialogComponent } from './dialogs/user-activity-log-dialog/user-activity-log-dialog.component';
import { MainTabBarComponent } from './components/main-tab-bar/main-tab-bar.component';
import { CalendarPlanEditorDialogComponent } from './pages/user-calendar-page/calendar-plan-editor-dialog/calendar-plan-editor-dialog.component';
import { EmployeeFiltersDialogComponent } from './pages/employee-page/employee-filters-dialog/employee-filters-dialog.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { LunchSettingsComponent } from './components/lunch-settings/lunch-settings.component';
import { HelpdeskServiceSheetComponent } from './components/helpdesk-service-sheet/helpdesk-service-sheet.component';
import { GreenpassChooseComponent } from './components/greenpass-choose/greenpass-choose.component';
import { CropImageComponent } from './components/crop-image/crop-image.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GreenpassScannerComponent } from './components/greenpass-scanner/greenpass-scanner.component';
import { ProductTrackingPageComponent } from './pages/product-tracking-page/start-production/product-tracking-page.component';
import { ProductTrackingActionSheetComponent } from './pages/product-tracking-page/product-tracking-action-sheet/product-tracking-action-sheet.component';
import { ScanProductComponent } from './pages/product-tracking-page/scan-product/scan-product.component';
import { ScanProductQaComponent } from './pages/product-tracking-page/scan-product-qa/scan-product-qa.component';
import { ScanProductReturnalComponent } from './pages/product-tracking-page/scan-product-returnal/scan-product-returnal.component';
import { MyBookingsPageComponent } from './pages/resource-booking/my-bookings-page/my-bookings-page.component';
import { BookRoomPageComponent } from './pages/resource-booking/book-room-page/book-room-page.component';
import { BookDeskPageComponent } from './pages/resource-booking/book-desk-page/book-desk-page.component';
import { BookSearchResultsComponent } from './pages/resource-booking/book-search-results/book-search-results.component';
import { BookResourceListItemComponent } from './pages/resource-booking/book-resource-list-item/book-resource-list-item.component';
import { BookRoomDetailsPageComponent } from './pages/resource-booking/book-room-details-page/book-room-details-page.component';
import { BookListItemComponent } from './pages/resource-booking/book-list-item/book-list-item.component';
import { QrScannerActionSheetComponent } from './pages/qr-scanner-page/qr-scanner-action-sheet/qr-scanner-action-sheet.component';
import { BookItemTimeframesComponent } from './pages/resource-booking/book-item-timeframes/book-item-timeframes.component';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { AttendeePickerComponent } from './pages/resource-booking/attendee-picker/attendee-picker.component';
import { ResourcePanelPageComponent } from './pages/resource-booking/resource-panel-page/resource-panel-page.component';
import { ResourceServicesSheetComponent } from './pages/resource-booking/resource-panel-page/resource-services-sheet/resource-services-sheet.component';
import { ImageViewerSheetComponent } from './components/image-viewer-sheet/image-viewer-sheet.component';
import { AccessControlQrCodeComponent } from './components/access-control-qr-code/access-control-qr-code.component';
import { InformationPublicPageComponent } from './pages/information-public-page/information-public-page.component';

registerLocaleData(localeIt);

@Injectable()
export class HammerConfig extends HammerGestureConfig {
    buildHammer(element: HTMLElement) {
        const mc = new Hammer(element, {
            touchAction: 'auto',
            inputClass: Hammer.PointerEventInput, // Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput,
            recognizers: [
                [Hammer.Swipe, {
                    direction: Hammer.DIRECTION_HORIZONTAL
                }]
            ]
        });
        return mc;
    }
}

@Injectable()
export class MyDateAdapter extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
        return 1;
    }
}

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        HomePageComponent,
        MainToolbarComponent,
        ServiceSheetComponent,
        MainActionTileComponent,
        ActionTileComponent,
        UserCalendarPageComponent,
        QrScannerPageComponent,
        AlertPageComponent,
        AlertTileComponent,
        UserProfilePageComponent,
        QuestionTileComponent,
        InformationPageComponent,
        EmployeePageComponent,
        InformationTileComponent,
        RequestTileComponent,
        QrCodeDialogComponent,
        UserActivityLogDialogComponent,
        MainTabBarComponent,
        CalendarPlanEditorDialogComponent,
        EmployeeFiltersDialogComponent,
        LunchSettingsComponent,
        RequestNoteDialogComponent,
        HelpdeskServiceSheetComponent,
        GreenpassChooseComponent,
        CropImageComponent,
        GreenpassScannerComponent,
        ProductTrackingPageComponent,
        ProductTrackingActionSheetComponent,
        ScanProductComponent,
        ScanProductQaComponent,
        ScanProductReturnalComponent,
        MyBookingsPageComponent,
        BookRoomPageComponent,
        BookDeskPageComponent,
        BookSearchResultsComponent,
        BookResourceListItemComponent,
        BookRoomDetailsPageComponent,
        BookListItemComponent,
        QrScannerActionSheetComponent,
        BookItemTimeframesComponent,
        AttendeePickerComponent,
        ResourcePanelPageComponent,
        ResourceServicesSheetComponent,
        ImageViewerSheetComponent,
        AccessControlQrCodeComponent,
        InformationPublicPageComponent
    ],
    imports: [
        AppRoutingModule,
        ImageCropperModule,
        BrowserModule,
        FeCommonModule.forRoot({ env: environment }),
        QRCodeModule,
        BrowserAnimationsModule,
        MaterialDesignModule,
        SatPopoverModule,
        NgxMaterialTimepickerModule.setLocale('it-IT'),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        PdfViewerModule,
        NgxAudioPlayerModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }),

    ],
    providers: [
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
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerConfig
        }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
