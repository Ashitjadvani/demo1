import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { LoginComponent } from './components/login/login.component';
import { JobApplicationComponent } from './components/job-application/job-application.component';
import { PositionComponent } from './components/position/position.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ChangePasswordComponent } from './components/my-account/change-password/change-password.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import {AuthGuardService} from './service/AuthGuardService';
import { PrivatePolicyComponent } from './components/private-policy/private-policy.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { DeleteAccountComponent } from './components/my-account/delete-account/delete-account.component';
import { ActivityLogComponent } from './components/my-account/activity-log/activity-log.component';
import { DownloadDocumentComponent } from './components/my-account/download-document/download-document.component';
import { EditProfileComponent } from './components/my-account/edit-profile/edit-profile.component';
import { LinkedinLoginResponseComponent } from './components/login/linkedin-login-response/linkedin-login-response.component';
import { JobApplicationDetailsComponent } from './components/job-application-details/job-application-details.component';
import {SignupVerifyCodeComponent} from './components/signup-verify-code/signup-verify-code.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'linkedinLoginResponse',
    component: LinkedinLoginResponseComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'position',
    component: PositionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'verify-code',
    component: SignupVerifyCodeComponent
  },
  {
    path: 'job-details/:id',
    component: JobDetailsComponent
  },
  {
    path: 'job-application/:id',
    component: JobApplicationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'my-application',
    component: MyAccountComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'privacy-policy',
    component: PrivatePolicyComponent
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent
  },
  {
    path: 'delete-account',
    component: DeleteAccountComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'activity-log',
    component: ActivityLogComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'download-document',
    component: DownloadDocumentComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'job-application-details/:id',
    component: JobApplicationDetailsComponent,
    canActivate: [AuthGuardService]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
