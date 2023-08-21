import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/navigation/header/header.component';
import { SidenavListComponent } from './components/navigation/sidenav-list/sidenav-list.component';
import { HomeLayoutComponent } from './components/layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './components/layout/login-layout/login-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientManagementComponent } from './components/client-management/client-management.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { DeletePopupComponent } from './popups/delete-popup/delete-popup.component';
import { ViewClientDetailsComponent } from './components/client-management/view-client-details/view-client-details.component';
import { MarkImportantComponent } from './popups/mark-important/mark-important.component';
import { AddEditClientComponent } from './components/client-management/add-edit-client/add-edit-client.component';
import { EditProfileComponent } from './components/setting/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './components/setting/change-password/change-password.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { AddFieldPopupComponent } from './popups/add-field-popup/add-field-popup.component';
import { FeaturesComponent } from './components/features/features.component';
import { AddFeaturesComponent } from './components/features/add-features/add-features.component';
import { ContactTypeComponent } from './components/contact-type/contact-type.component';
import { AddContactComponent } from './popups/add-contact/add-contact.component';
import { ViewDashboardComponent } from './components/client-management/view-dashboard/view-dashboard.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ChartsModule} from 'ng2-charts';
import {NSApiService} from './service/NSApi.service';
import {NSHelperService} from "./service/NSHelper.service";
import { PinUnpinComponent } from './popups/pin-unpin/pin-unpin.component';
import { ChangePasswordPopupComponent } from './popups/change-password-popup/change-password-popup.component';
import { DBApiService } from './service/dbapi.service';
import { HttpClientModule } from '@angular/common/http';
import { WheelActionComponent } from './components/global/wheel-action/wheel-action.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LayoutComponent,
    HeaderComponent,
    SidenavListComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    DashboardComponent,
    ClientManagementComponent,
    DeletePopupComponent,
    ViewClientDetailsComponent,
    MarkImportantComponent,
    AddEditClientComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    ActivityLogComponent,
    AddFieldPopupComponent,
    FeaturesComponent,
    AddFeaturesComponent,
    ContactTypeComponent,
    AddContactComponent,
    ViewDashboardComponent,
    PinUnpinComponent,
    ChangePasswordPopupComponent,
    WheelActionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxPaginationModule,
    MatButtonToggleModule,
    ChartsModule,
    HttpClientModule

  ],
  providers: [DBApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
