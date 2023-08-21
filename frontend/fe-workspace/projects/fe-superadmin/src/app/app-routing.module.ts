import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { AddEditClientComponent } from './components/client-management/add-edit-client/add-edit-client.component';
import { ClientManagementComponent } from './components/client-management/client-management.component';
import { ViewClientDetailsComponent } from './components/client-management/view-client-details/view-client-details.component';
import { ViewDashboardComponent } from './components/client-management/view-dashboard/view-dashboard.component';
import { ContactTypeComponent } from './components/contact-type/contact-type.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddFeaturesComponent } from './components/features/add-features/add-features.component';
import { FeaturesComponent } from './components/features/features.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeLayoutComponent } from './components/layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './components/layout/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ChangePasswordComponent } from './components/setting/change-password/change-password.component';
import { EditProfileComponent } from './components/setting/edit-profile/edit-profile.component';

const routes: Routes = [
  {path:'',component:LoginLayoutComponent,
    children:[
      {path:'',component:LoginComponent},
      {path:'forgot-password',component:ForgotPasswordComponent},
      {path:'reset-password',component:ResetPasswordComponent},
    ]
  },
  {path:"",component:HomeLayoutComponent,
    children:[
      {path:"dashboard",component:DashboardComponent},
      {path:'client-management',component:ClientManagementComponent},
      {path:'client-management/view-client-details/:id',component:ViewClientDetailsComponent},
      {path:'client-management/add-edit-client/:id',component:AddEditClientComponent},
      {path:'client-management/view-dashboard/:id',component:ViewDashboardComponent},
      {path:'edit-profile',component:EditProfileComponent},
      {path:'change-password',component:ChangePasswordComponent},
      {path:'activity-log',component:ActivityLogComponent},
      {path:'contact-type',component:ContactTypeComponent},
      {path:'features',component:FeaturesComponent},
      {path:'features/add-features/:id',component:AddFeaturesComponent,data:{title:''}},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
