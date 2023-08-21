
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { HelperService } from './service/helper.service';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginLayoutComponent } from './components/layout/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SignupComponent } from './components/signup/signup.component';
import { SignupSubmitComponent } from './components/signup-submit/signup-submit.component';
import { HomeLayoutComponent } from './components/layout/home-layout/home-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { RFQsComponent } from './components/rfqs/rfqs.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { MyQuotesComponent } from './components/my-account/my-quotes/my-quotes.component';
import {ApiService} from './service/api.service';
import {AuthGuardService} from './service/auth-guard.service';
import { ChangePasswordComponent } from './components/my-account/change-password/change-password.component';
import { DeleteAccountComponent } from './components/my-account/delete-account/delete-account.component';
import { DeletePopupComponent } from './popups/delete-popup/delete-popup.component';
import { EditProfileComponent } from './components/my-account/edit-profile/edit-profile.component';
import { OnbordingLayoutComponent } from './components/layout/onbording-layout/onbording-layout.component';
import { SupplierRegistrationComponent } from './components/supplier-registration/supplier-registration.component';
import { EmailVarificationComponent } from './components/email-varification/email-varification.component';
import { QuotationComponent } from './components/quotation/quotation.component';
import { QuotationDetailsComponent } from './components/quotation-details/quotation-details.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './components/terms-condition/terms-condition.component';
import { SearchPipe } from './pipes/search.pipe';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SupplierDeclineComponent } from './components/supplier-decline/supplier-decline.component';
import { AngularIbanModule } from 'angular-iban';
import {MatSelectFilterModule} from 'mat-select-filter';
import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import{registerLocaleData} from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ActivityLogComponent } from './components/my-account/activity-log/activity-log.component';

registerLocaleData(localeIt);

@Injectable()
export class MyDateAdapter extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
        return 1;
    }
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginLayoutComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SignupComponent,
    SignupSubmitComponent,
    HomeLayoutComponent,
    HeaderComponent,
    RFQsComponent,
    MyAccountComponent,
    MyQuotesComponent,
    ChangePasswordComponent,
    DeleteAccountComponent,
    DeletePopupComponent,
    EditProfileComponent,
    OnbordingLayoutComponent,
    SupplierRegistrationComponent,
    EmailVarificationComponent,
    QuotationComponent,
    QuotationDetailsComponent,
    PrivacyPolicyComponent,
    TermsConditionComponent,
    SearchPipe,
    SupplierDeclineComponent,
    ActivityLogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NgxMatSelectSearchModule,
    AngularIbanModule ,
    MatSelectFilterModule ,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
  ],
  providers: [HelperService, ApiService, AuthGuardService,
    { provide: MAT_DATE_LOCALE, useValue: 'it' },
    { provide: LOCALE_ID, useValue: 'it-IT'},
    { provide: DateAdapter, useClass: MyDateAdapter},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
