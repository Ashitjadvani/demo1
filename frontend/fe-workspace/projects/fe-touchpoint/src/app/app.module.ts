import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './core/app-routing.module';

import { AppComponent } from './app.component';
import { environment } from 'projects/fe-touchpoint/src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OfficeActivityPageComponent } from './pages/office-activity-page/office-activity-page.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { QRCodeModule } from 'angular2-qrcode';
import { TouchpointPageComponent } from './pages/touchpoint-page/touchpoint-page.component';
import { MaterialDesignModule } from './core/material-design';
import { FeCommonModule } from 'projects/fe-common/src/lib';
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ServiceWorkerModule } from '@angular/service-worker';


registerLocaleData(localeIt);

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        OfficeActivityPageComponent,
        HeaderBarComponent,
        TouchpointPageComponent
    ],
    imports: [
        AppRoutingModule,
        MaterialDesignModule,
        BrowserModule,
        FeCommonModule.forRoot({ env: environment }),
        QRCodeModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }), ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the app is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})
    ],
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'it-IT'
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'it-IT'
        }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
