import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import {Router} from '@angular/router';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {SettingsManagementService} from '../../../../../../fe-common-v2/src/lib/services/settings-management.service';
import {CommonService} from "../../../../../../fe-common-v2/src/lib/services/common.service";
import {AdminUserManagementService} from "../../../../../../fe-common-v2/src/lib/services/admin-user-management.service";
import {DataStorageManagementService} from "../../../../../../fe-common-v2/src/lib/services/data-storage-management.service";
import { User, UserProfile } from 'projects/fe-common-v2/src/lib/models/admin/user';
import {UserManagementService} from "../../../../../../fe-common-v2/src/lib/services/user-management.service";
import {element} from "protractor";
import {ProfileSettingsService} from "../../../../../../fe-common-v2/src/lib/services/profile-settings.service";
// import {SidenavListComponent} from "../sidenav-list/sidenav-list.component";
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {fas} from "@fortawesome/free-solid-svg-icons";
import { DateAdapter } from '@angular/material/core';
import {UserCapabilityService} from "../../../service/user-capability.service";
import { MatDialog } from '@angular/material/dialog';
import { NotificationDetailsComponent } from '../../../popup/notification-details/notification-details.component';

export interface DialogData {
  message: any;
  heading:any;
  title:any;
  CreateDate:any;
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  toggleIcon = 'assets/images/toggle-icon.svg';
  // profileIMG = 'assets/images/profile-img.png';
  profileIMG = 'assets/images/no-profile-img.png';

  englishFlag = 'assets/images/en-flag.png';
  italianFlag = 'assets/images/ita-flag.png';
  spanishFlag = 'assets/images/spa-flag.png';
  frenchFlag = 'assets/images/fr-flag.png';
  bodyText:any = '';
  bodyTitle:any ='';
  bodyDate:any = '';
  subscription: Subscription;

  public config: any = {};
  panelOpenState = false;
  loginUserData: any = {};
  loginIncidentsData: any = {};
  imageChange:any;
  authUser: any = {};
  userLanguageSelect: string;
  currentCompany: any;
  fileDetails: any;
  isCompany: boolean = false;
  notificationList: any[] = [];
  unreadCount: any;
  totalcount: any;
  noRecordlist: boolean = false;
  sideListMenuName: string = 'Dashboard';
  readCount: any;
  language:any;
  default: any = false;
  alreadySelectedLang: any = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private userCapabilityService: UserCapabilityService,
    private settingManager: SettingsManagementService,
    private adminUserManagementService: AdminUserManagementService,
    private dataStorageManagementService: DataStorageManagementService,
    private commonService: CommonService,
    private router: Router,
    private userManagementService: UserManagementService,
    private ApiService: ProfileSettingsService,
    private dateAdapter: DateAdapter<any>,
    public dialog: MatDialog,
    // private sideMenuName: SidenavListComponent
  ) {
    this.helper.sideMenuListName.subscribe((name: any) => {
      this.sideListMenuName = name;
    });
    this.helper.invokeFirstComponentFunction.subscribe((name:string) => {
      this.firstChangeImageFunction();
    });
    this.helper.updateSideMenuEmitter.subscribe((name:string) => {
      //this.loadDashbord();
      this.ngOnInit();
    });
    this.helper.languageList.subscribe((lanlist: any) => {
      this.language = lanlist;
      for (var i = 0; i < this.language.length; i++) {
        if (this.language[i].checked && (this.language[i].languageCode == this.userLanguageSelect)){
          this.alreadySelectedLang = true;
          return;
        }else {
          this.alreadySelectedLang = false;
        }
      }
      for (var i = 0; i < this.language.length; i++) {
        if(this.language[i].checked){
          if (this.alreadySelectedLang !== true){
            this.userLanguageSelect = this.language[i].languageCode;
            this.helper.languageTranslator(this.userLanguageSelect);
            this.translate.use(this.userLanguageSelect);
            this.settingManager.setSettingsValue('currentLanguage', this.userLanguageSelect);
            return
          }
        }
      }
    });
    this.bellNotifiaction();
    // this.sideListMenuName = this.sideMenuName.sidebarMenuName;
    //this.isCompany = this.userCapabilityService.isFunctionAvailable('Company');
    // if (UserProfile.SYSTEM  || UserProfile.ADMIN){
    //   this.isCompany = true;
    // }else {
    //   this.isCompany = false;
    // }
  }

  callSidemenuCollapse(): void {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  timeout: any;
  async ngOnInit(): Promise<void> {
    this.timeout = setTimeout(this.closeNotification, 3000);
    let loggedUser : any = this.userManagementService.getAccount();
    const selectedMenu : any = await this.userCapabilityService.getMainMenu(loggedUser);
    for(let i = 0;i < selectedMenu.length; i++){
      if (selectedMenu[i].functionId == "Company"){
        this.isCompany = true
      }
    }

    const authUser: any = MCPHelperService.loginUserData;
    if (authUser) {
      this.authUser = authUser;
      const res: any = await this.adminUserManagementService.getCompany(authUser.companyId);
      if (this.commonService.isValidResponse(res)) {
        this.currentCompany = res.company;
        this.language = res.company.nativeLanguages;
      }
      const getCompany = res.company;
      this.imageChange = res.company;
      if (getCompany?.logoID) {
        const fileDetails = await this.dataStorageManagementService.getFileBase64(getCompany?.logoID);
        this.fileDetails = (fileDetails?.data) ? fileDetails.data : null;
      }

    } else {
      this.router.navigate(['/']);
    }

    this.userLanguageSelect = MCPHelperService.getLanguageName();
    if (!this.userLanguageSelect) {
      this.translate.use('it');
      this.settingManager.setSettingsValue('currentLanguage', 'it');
    } else {
      this.translate.use(this.userLanguageSelect);
      this.settingManager.setSettingsValue('currentLanguage', this.userLanguageSelect);
    }
    this.userLanguageSelect = this.settingManager.getSettingsValue('currentLanguage');
  }

   bellNotifiaction(){
    this.userManagementService.getnotifications({}).subscribe((res: any) => {
      this.notificationList = res.data;
      if (this.notificationList?.length === 0){
        this.noRecordlist = true;
      }
      this.unreadCount = res.meta?.unreadCount;
    });
  }

  details(jobApplictionId: any, id: any){
    // this.router.navigate(['/recruiting']);
    if(this.unreadCount !== 0){
      this.userManagementService.getnotificationsRead({id: id, isRead: true}).subscribe((res: any) => {
        if(res.statusCode == 200){
          // this.router.navigate(['/recruiting']);
          this.helper.toggleLoaderVisibility(true);
            this.router.navigate(['/recruiting/job-applications/view-job-applications/' + jobApplictionId]);
            this.bellNotifiaction();
          this.helper.toggleLoaderVisibility(false);
        }
      });
    } else {
      // this.router.navigate(['/recruiting']);
      this.router.navigate(['/recruiting/job-applications/view-job-applications/' + jobApplictionId]);
      this.bellNotifiaction();
    }
  }

  closeNotification(){
    document.body.classList.add('hide-notification');
    setTimeout(() => {
      document.body.classList.remove('hide-notification');
    },500);

  }

  onImgError(event): void {
    event.target.src = this.profileIMG;
  }

  onLanguageChange(valueLanguage: any): void {
    this.helper.languageTranslator(valueLanguage.value);
    this.translate.use(valueLanguage.value);
    this.settingManager.setSettingsValue('currentLanguage', valueLanguage.value);
    this.chartUpdateFunction();
  }

  chartUpdateFunction(){
    this.helper.chartUpdateData();
  }

  logOUT(): void {
    MCPHelperService.onLogOut();
    this.router.navigate(['/']);
  }

   async firstChangeImageFunction() {
    const authUser: any = MCPHelperService.loginUserData;
    if (authUser) {
      this.authUser = authUser;
      const res: any = await this.adminUserManagementService.getCompany(authUser.companyId);
      if (this.commonService.isValidResponse(res)) {
        this.currentCompany = res.company;
        this.language = res.company.nativeLanguages;
      }
      const getCompany = res.company;
      this.imageChange = res.company;
      if (getCompany?.logoID) {
        const fileDetails = await this.dataStorageManagementService.getFileBase64(getCompany?.logoID);
        this.fileDetails = (fileDetails?.data) ? fileDetails.data : null;
      }
    }
    // if (this.imageChange.logoID) {
    //   const fileDetails = await this.dataStorageManagementService.getFileBase64(this.imageChange.logoID);
    //   this.fileDetails = (fileDetails?.data) ? fileDetails.data : null;
    // }
  }


  itLocale(){
    this.dateAdapter.setLocale('it');
  }
  enLocale(){
    this.dateAdapter.setLocale('en');
  }
  frLocale(){
    this.dateAdapter.setLocale('fr');
  }
  spLocale(){
    this.dateAdapter.setLocale('sp');
  }

  openDetailsDialog(event:any){
    console.log('event>>',event);
    this.bodyDate = event.createdAt;
    this.bodyTitle = event.type;
      if(this.userLanguageSelect === 'en'){
        this.bodyText = event.body;
      }else{
        this.bodyText = event.bodyIt;
      }

   if(this.unreadCount !== 0){
    this.userManagementService.getnotificationsRead({id: event.id,type: 'pushNotification', isRead: true}).subscribe((res: any) => {
      if(res.statusCode == 200){
        this.helper.toggleLoaderVisibility(true);
        const dialogRef = this.dialog.open(NotificationDetailsComponent, {
          data: {
            message: this.bodyText,
            heading: 'Notification Details',
            title: this.bodyTitle,
            CreateDate: this.bodyDate
          }
       });
       this.bellNotifiaction();
       this.helper.toggleLoaderVisibility(false);
      }
      this.helper.toggleLoaderVisibility(false);
    });
   }else{
        this.helper.toggleLoaderVisibility(true);
        const dialogRef = this.dialog.open(NotificationDetailsComponent, {
          data: {
            message: this.bodyText,
            heading: 'Notification Details',
            title: this.bodyTitle,
            CreateDate: this.bodyDate
          }
        });
        this.bellNotifiaction();
        this.helper.toggleLoaderVisibility(false);
   }
  }


}
