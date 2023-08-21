import { Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { CareerApiService } from './service/careerApi.service';
import { CareerHelperService } from './service/careerHelper.service';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { PositionComponent } from './components/position/position.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobApplicationComponent } from './components/job-application/job-application.component';
import { ChangePasswordComponent } from './components/my-account/change-password/change-password.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { PrivatePolicyComponent } from './components/private-policy/private-policy.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import {AuthGuardService} from './service/AuthGuardService';
import { DeleteAccountComponent } from './components/my-account/delete-account/delete-account.component';
import { ActivityLogComponent } from './components/my-account/activity-log/activity-log.component';
import { DownloadDocumentComponent } from './components/my-account/download-document/download-document.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  LinkedinLoginProvider
} from 'ng-social-login-module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { PopupConfirmDeleteComponent } from './popup/popup-confirm-delete/popup-confirm-delete.component';
import { EditProfileComponent } from './components/my-account/edit-profile/edit-profile.component';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { LinkedinLoginResponseComponent } from './components/login/linkedin-login-response/linkedin-login-response.component';
import { FileSaverModule } from 'ngx-filesaver';
import { JobApplicationDetailsComponent } from './components/job-application-details/job-application-details.component';
import {CountdownConfig, CountdownGlobalConfig, CountdownModule} from 'ngx-countdown';
import {CdkStepper} from "@angular/cdk/stepper";
import {SignupVerifyCodeComponent} from "./components/signup-verify-code/signup-verify-code.component";
import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import{registerLocaleData} from '@angular/common';
import localeIt from '@angular/common/locales/it';
// import localeEn from '@angular/common/locales/en';

export function countdownConfigFactory(): CountdownConfig {
  return { format: `mm:ss` };
}
registerLocaleData(localeIt);
 
@Injectable()
export class MyDateAdapter extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
        return 1;
    }
}


const CONFIG = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    //provider: new GoogleLoginProvider('694921606666-0elc3r83petutbopjbqt9q0fviu8k6uk.apps.googleusercontent.com')
    //provider: new GoogleLoginProvider('202603810118-cl176l0f4lcib97gchtq5ph1atp00ihh.apps.googleusercontent.com')
    //For client
    provider: new GoogleLoginProvider('819868803770-u3q464jmh57rrgprcu2b09g2ve9pdh9j.apps.googleusercontent.com')
    // For local test
    //provider: new GoogleLoginProvider('202603810118-cl176l0f4lcib97gchtq5ph1atp00ihh.apps.googleusercontent.com')
  },
{
    id: LinkedinLoginProvider.PROVIDER_ID,
    provider: new LinkedinLoginProvider('77hilwop9t433d')
  }
], true);

export function provideConfig() {
  return CONFIG;
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    PositionComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SignupVerifyCodeComponent,
    JobDetailsComponent,
    JobApplicationComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    MyAccountComponent,
    PrivatePolicyComponent,
    TermsAndConditionsComponent,
    PopupConfirmDeleteComponent,
    DeleteAccountComponent,
    ActivityLogComponent,
    DownloadDocumentComponent,
    LinkedinLoginResponseComponent,
    JobApplicationDetailsComponent
],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    NgxPaginationModule,
    SocialLoginModule,
    ShareIconsModule,
    FileSaverModule,
    CountdownModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
],
  providers: [CareerApiService, CareerHelperService, AuthGuardService, CdkStepper, {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  },
  { provide: MAT_DATE_LOCALE, useValue: 'it' },
  { provide: LOCALE_ID, useValue: 'it-IT'},
  { provide: DateAdapter, useClass: MyDateAdapter},
  { provide: CountdownGlobalConfig, useFactory: countdownConfigFactory }
 ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(translate: TranslateService,helperService: CareerHelperService) {
    translate.addLangs(['it', 'en']);
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|it/) ? browserLang : 'it');
    helperService.languageTranslator(browserLang);
    if(!browserLang){
      browserLang = 'it';
    }
    localStorage.setItem('currentLanguage',browserLang);
  }
 }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
