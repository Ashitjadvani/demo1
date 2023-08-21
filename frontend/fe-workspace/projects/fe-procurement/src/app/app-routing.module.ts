import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailVarificationComponent } from './components/email-varification/email-varification.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeLayoutComponent } from './components/layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './components/layout/login-layout/login-layout.component';
import { OnbordingLayoutComponent } from './components/layout/onbording-layout/onbording-layout.component';
import { LoginComponent } from './components/login/login.component';
import { ActivityLogComponent } from './components/my-account/activity-log/activity-log.component';
import { ChangePasswordComponent } from './components/my-account/change-password/change-password.component';
import { DeleteAccountComponent } from './components/my-account/delete-account/delete-account.component';
import { EditProfileComponent } from './components/my-account/edit-profile/edit-profile.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { MyQuotesComponent } from './components/my-account/my-quotes/my-quotes.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { QuotationDetailsComponent } from './components/quotation-details/quotation-details.component';
import { QuotationComponent } from './components/quotation/quotation.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RFQsComponent } from './components/rfqs/rfqs.component';
import { SignupSubmitComponent } from './components/signup-submit/signup-submit.component';
import { SignupComponent } from './components/signup/signup.component';
import { SupplierDeclineComponent } from './components/supplier-decline/supplier-decline.component';
import { SupplierRegistrationComponent } from './components/supplier-registration/supplier-registration.component';
import { TermsConditionComponent } from './components/terms-condition/terms-condition.component';

const routes: Routes = [
  {path: 'supplier-decline/:id', component: SupplierDeclineComponent},
  {path: '', component: LoginLayoutComponent,
      children: [
        {path: '', component: LoginComponent},
        {path: 'forgot-password', component: ForgotPasswordComponent},
        {path: 'reset-password', component: ResetPasswordComponent},
        {path: 'signup', component: SignupComponent},
        {path: 'signup-submit', component: SignupSubmitComponent},
        {path: 'email-verification', component: EmailVarificationComponent},
      ]
  },
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  {path: 'terms-condition', component: TermsConditionComponent},
  {path: '', component: HomeLayoutComponent,
      children: [
        /*{path: 'RFQs', component: RFQsComponent},*/
        {path: 'quotation', component: QuotationComponent},
        {path: 'quotation-details', component: QuotationDetailsComponent},
        {path: '', component: MyAccountComponent,
            children: [
              /*{path: 'my-account/my-quotes', component: MyQuotesComponent},*/
              {path: 'my-account/change-password', component: ChangePasswordComponent},
              {path: 'my-account/delete-account', component: DeleteAccountComponent},
              {path: 'my-account/edit-profile', component: EditProfileComponent},
              {path: 'my-account/activity-log', component: ActivityLogComponent}
            ]
        },
      ]
  },
  {path: 'on-boarding/:id', component: OnbordingLayoutComponent,
      children: [
        {path: '', component: SupplierRegistrationComponent}
      ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
