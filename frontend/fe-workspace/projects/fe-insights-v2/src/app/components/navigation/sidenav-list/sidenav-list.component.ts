import { DOCUMENT } from '@angular/common';
import {Component, OnInit, ElementRef, Inject, Renderer2, Input} from '@angular/core';
import {RecruitingApplicationManagementService} from '../../../../../../fe-common-v2/src/lib/services/recruiting-application-management.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {UserManagementService} from '../../../../../../fe-common-v2/src/lib/services/user-management.service';
import {MatDialog} from '@angular/material/dialog';
import {AdminUserManagementService} from '../../../../../../fe-common-v2/src/lib/services/admin-user-management.service';
import {MenuItem, SideMenuAction, UserCapabilityService} from '../../../service/user-capability.service';
import {environment} from '../../../../environments/environment';
import {RecrutingJobApplicationManagementService} from '../../../../../../fe-common-v2/src/lib/services/recruting-job-application-management.service';
import {MCPHelperService} from "../../../service/MCPHelper.service";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  navigationItems: MenuItem[];
  unReadCount: any = [];
  selectedMenuItem: MenuItem;
  applicationBudgeCount: any = 0;
  sidebarMenuName: any = 'Dashboard';
  primaryColor:any;
  sumNumber: any = 0;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    public elementRef: ElementRef,
    private userManagementService: UserManagementService,
    private adminUserManagementService: AdminUserManagementService,
    private recruitingManagementApplicationService: RecruitingApplicationManagementService,
    private userCapabilityService: UserCapabilityService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
    private ApiService: RecrutingJobApplicationManagementService,
    private MCPservice: MCPHelperService

  ) {
    // this.MCPservice.sideMenuListName.subscribe((name:any)=>{
    //   this.sidebarMenuName = name
    // })
    this.loadRecruitingApplication();
    let that = this;
    this.userCapabilityService.dashboardRecruitingCountChange.subscribe((value) => {
      that.applicationBudgeCount = value;
    });
    this.MCPservice.updateSideMenuEmitter.subscribe((name:string) => {
      this.buildNavigationItems();
    });
  }

  async loadRecruitingApplication(): Promise<void> {
    let jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationBudgeCount();
    this.applicationBudgeCount = jobsTableData.result ? jobsTableData.reason : '';
  }

  async ngOnInit(): Promise<void> {
    //this.userCapabilityService.initAllMenu();
    this.getCount({});
    const userAccount = this.userManagementService.getAccount();
    if (userAccount) {
      const res = await this.adminUserManagementService.getCompany(userAccount.companyId);
      this.primaryColor = res?.company?.brandColor;
      this.changeTheme(this.primaryColor);
    }
    this.buildNavigationItems();
    this.updateSelectedItem(this.selectedMenuItem);
    // if (!environment.debug) {
    //   this.router.navigate([this.selectedMenuItem.navigation]);
    //   if (!this.selectedMenuItem.navigation) {
    //     this.snackBar.open(this.translate.instant('LOGIN PAGE.USER NOT AUTHORIZED ACCESS SYSTEM'), this.translate.instant('GENERAL.OK'), {duration: 3000});
    //   }
    // }
  }
  async getCount(request): Promise<void> {
    const res: any = await this.ApiService.getUnreadCount({});
    this.unReadCount = res.data;
  }

  async buildNavigationItems(): Promise<void> {
    let loggedUser = this.userManagementService.getAccount();
    this.navigationItems =  await this.userCapabilityService.getMainMenu(loggedUser);
    this.navigationItems.forEach(mi => mi.selected = false);
    this.sumNumber = 0;
    for (let i = 0; i < this.navigationItems.length; i++) {
      if (this.navigationItems[i].subMenu.length > 0){
        for (let n = 0; n < this.navigationItems[i].subMenu.length; n++) {
          if (this.navigationItems[i].subMenu[n]?.countNumber !== undefined){
            this.sumNumber += this.navigationItems[i].subMenu[n]?.countNumber;
          }
        }
      }
    }
    return this.sumNumber;
  }

  updateSelectedItem(menuItem: MenuItem): void {
    if (this.selectedMenuItem) {
      this.selectedMenuItem.selected = false;
    }
    this.selectedMenuItem = menuItem;
    //this.selectedMenuItem.selected = true;
  }

  async onSideBarAction(menuItem): Promise<void> {
    this.updateSelectedItem(menuItem);
    this.router.navigate([menuItem.navigation]);
  }

  mouseHover(): void {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }

  mouseOut(): void {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }

  changeTheme(primaryColor: string): any{
    document.documentElement.style.setProperty('--primary-color', primaryColor);
  }
  sideMenuName(name: any){
    localStorage.setItem('peopleManagementTabLocation', '0');
    this.sidebarMenuName = name;
    this.MCPservice.sideMenuListName.next(this.sidebarMenuName);
  }
}
