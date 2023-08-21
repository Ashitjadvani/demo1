import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertPageComponent } from '../pages/alert-page/alert-page.component';
import { HomePageComponent } from '../pages/home-page/home-page.component';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { QrScannerPageComponent } from '../pages/qr-scanner-page/qr-scanner-page.component';
import { UserCalendarPageComponent } from '../pages/user-calendar-page/user-calendar-page.component';
import { UserProfilePageComponent } from '../pages/user-profile-page/user-profile-page.component';
import { InformationPageComponent } from '../pages/information-page/information-page.component';
import { EmployeePageComponent } from '../pages/employee-page/employee-page.component';
import { ProductTrackingPageComponent } from '../pages/product-tracking-page/start-production/product-tracking-page.component';
import { AuthGuard } from './auth-guard';
import { ScanProductComponent } from '../pages/product-tracking-page/scan-product/scan-product.component';
import { ScanProductQaComponent } from '../pages/product-tracking-page/scan-product-qa/scan-product-qa.component';
import { ScanProductReturnalComponent } from '../pages/product-tracking-page/scan-product-returnal/scan-product-returnal.component';
import { BookRoomPageComponent } from '../pages/resource-booking/book-room-page/book-room-page.component';
import { BookDeskPageComponent } from '../pages/resource-booking/book-desk-page/book-desk-page.component';
import { MyBookingsPageComponent } from '../pages/resource-booking/my-bookings-page/my-bookings-page.component';
import { ResourcePanelPageComponent } from '../pages/resource-booking/resource-panel-page/resource-panel-page.component';
import { InformationPublicPageComponent } from '../pages/information-public-page/information-public-page.component';

const routes: Routes = [
    { path: '', component: LoginPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
    { path: 'qrscanner', component: QrScannerPageComponent, canActivate: [AuthGuard] },
    { path: 'news', component: AlertPageComponent, canActivate: [AuthGuard] },
    { path: 'user-profile', component: UserProfilePageComponent, canActivate: [AuthGuard] },
    { path: 'information', component: InformationPageComponent, canActivate: [AuthGuard] },
    { path: 'user-calendar', component: UserCalendarPageComponent, canActivate: [AuthGuard] },
    { path: 'employee', component: EmployeePageComponent, canActivate: [AuthGuard] },
    { path: 'start-production', component: ProductTrackingPageComponent, canActivate: [AuthGuard] },
    { path: 'product-tracking', component: ScanProductComponent, canActivate: [AuthGuard] },
    { path: 'product-tracking-qa', component: ScanProductQaComponent, canActivate: [AuthGuard] },
    { path: 'product-tracking-returnal', component: ScanProductReturnalComponent, canActivate: [AuthGuard] },
    { path: 'bookroom', component: BookRoomPageComponent, canActivate: [AuthGuard] },
    { path: 'bookdesk', component: BookDeskPageComponent, canActivate: [AuthGuard] },
    { path: 'mybookings', component: MyBookingsPageComponent, canActivate: [AuthGuard] },
    { path: 'resource/room/:id', component: ResourcePanelPageComponent },
    { path: 'public-info/:lang/:id', component: InformationPublicPageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
