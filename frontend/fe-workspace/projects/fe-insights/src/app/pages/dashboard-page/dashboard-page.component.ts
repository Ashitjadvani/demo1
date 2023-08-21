import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import {AdminUserManagementService} from 'projects/fe-common/src/lib/services/admin-user-management.service';
import {UserManagementService} from 'projects/fe-common/src/lib/services/user-management.service';
import {MenuItem, SideMenuAction, UserCapabilityService} from '../../services/user-capability.service';
import {environment} from '../../../environments/environment';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { RecruitingApplicationManagementService } from 'projects/fe-common/src/lib/services/recruiting-application-management.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  @ViewChild('snav', {static: false}) sideNav: MatSidenav;

  navigationItems: MenuItem[];
  selectedMenuItem: MenuItem;
  applicationBudgeCount: any = 0;

  constructor(private router: Router,
              private commonService: CommonService,
              private adminUserManagementService: AdminUserManagementService,
              private userManagementService: UserManagementService,
              private userCapabilityService: UserCapabilityService,
              private dialog: MatDialog,
              private recruitingManagementApplicationService: RecruitingApplicationManagementService,
              private snackBar: MatSnackBar,
              public translate: TranslateService) {
              this.loadRecruitingApplication();
              let that = this;
              this.userCapabilityService.dashboardRecruitingCountChange.subscribe((value) => {
                that.applicationBudgeCount = value;
              });
  }

  async loadRecruitingApplication() {
    let jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationBudgeCount();
    this.applicationBudgeCount = jobsTableData.result ? jobsTableData.reason : '';
  }

  ngOnInit() {
    this.buildNavigationItems();
    this.updateSelectedItem(this.navigationItems[0]);
    this.translate.onLangChange.subscribe(() => this.buildNavigationItems())
    if (!environment.debug) {
      this.router.navigate([this.selectedMenuItem.navigation]);
      if (!this.selectedMenuItem.navigation) {
        this.snackBar.open(this.translate.instant('LOGIN PAGE.USER NOT AUTHORIZED ACCESS SYSTEM'), this.translate.instant('GENERAL.OK'), {duration: 3000});
      }
    }
  }

  buildNavigationItems() {
    let loggedUser = this.userManagementService.getAccount();

    this.navigationItems = this.userCapabilityService.getMainMenu(loggedUser);
    this.navigationItems.forEach(mi => mi.selected = false);
  }

  updateSelectedItem(menuItem: MenuItem) {
    if (this.selectedMenuItem)
      this.selectedMenuItem.selected = false;
    this.selectedMenuItem = menuItem;
    this.selectedMenuItem.selected = true;
  }

  async onSideBarAction(menuItem) {
    if (menuItem.action == SideMenuAction.Logout) {
      let reply = await this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        panelClass: 'custom-dialog-container',
        data: new ConfirmDialogData(this.translate.instant('GENERAL.LOGOUT'), this.translate.instant('GENERAL.ARE YOU SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
      }).afterClosed().toPromise();
      if (reply) {
        this.adminUserManagementService.logout();
        this.router.navigate(['insights']);
      }
    } else {
      this.updateSelectedItem(menuItem);
      this.router.navigate([menuItem.navigation]);
    }
  }
}
