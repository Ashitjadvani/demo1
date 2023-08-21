import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { OfficeActivityPageComponent } from '../pages/office-activity-page/office-activity-page.component';
import { TouchpointPageComponent } from '../pages/touchpoint-page/touchpoint-page.component';

const routes: Routes = [
    { path: '', component: TouchpointPageComponent },
    // { path: 'login', component: LoginPageComponent },
    { path: 'touchpoint', component: TouchpointPageComponent },
    // { path: 'office-activity/:site', component: OfficeActivityPageComponent },
    // { path: 'touchpoint/:id', component: TouchpointPageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
