import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User, UserProfile } from 'projects/fe-common/src/lib/models/admin/user';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import {Subject} from "rxjs";

export enum SideMenuAction {
    Company,
    People,
    Groups,
    Accounts,
    Sites,
    Alerts,
    Touchpoints,
    AssetsManagement,
    Statistics,
    Safety,
    News,
    Survey,
    Sustainability,
    Scheduler,
    LogAudit,
    Reservation,
    APM,
    ChangePassword,
    SettingsManagement,
    ActionTiles,
    Informations,
    ProductsTracking,
    Recruiting,
    RecruitingMQS,
    TklHome,
    TicketGenerate,
    QuizSurvey,
    Logout,
    CMSMenu,
    AccessControl
}

export class MenuItem {
    functionId: string;
    icon: string;
    action: SideMenuAction;
    caption: string;
    navigation: string;
    profiles: UserProfile[];
    selected: boolean;
    count: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class UserCapabilityService {
    allMenu: MenuItem[] = [];
    dashboardRecruitingCountChange: Subject<number> = new Subject<number>();
    loaderVisibilityChange: Subject<boolean> = new Subject<boolean>();
    isLoaderVisible = false;

    constructor(private userManagementService: UserManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private translate: TranslateService) {
        this.initAllMenu();
    }

    dashboardRecruitingCount(count: number): void {
      this.dashboardRecruitingCountChange.next(count);
    }

    getMainMenu(person: Person): MenuItem[] {
        this.initAllMenu();
        if (person.profile) {
            return this.allMenu.filter(m => {
                return (m.profiles.length == 0) || m.profiles.filter(mp => person.profile.includes(mp)).length > 0;
            });
        } else {
            return this.allMenu.filter(m => this.isFunctionAvailable(m.functionId));
        }
    }

    toggleLoaderVisibility(isSidebarVisible: boolean): void {
      this.isLoaderVisible = isSidebarVisible;
      this.loaderVisibilityChange.next(this.isLoaderVisible);
    }

    isFunctionAvailable(functionId: string): boolean {
        let token = this.userManagementService.getTokenDecoded();

        if ((functionId == null) || ((token.profile && (token.profile.includes(UserProfile.SYSTEM) || token.profile.includes(UserProfile.ADMIN)))))
            return true;
        else {
            return token && token.availableFunctions && token.availableFunctions.includes(functionId);
        }
    }

    initAllMenu() {
        this.allMenu = [
            {
                functionId: 'Company',
                icon: './assets/images/domain-black.svg',
                action: SideMenuAction.Company,
                caption: this.translate.instant('INSIGHTS_MENU.COMPANY'),
                navigation: 'insights/main/company',
                profiles: [UserProfile.SYSTEM, UserProfile.ADMIN],
                selected: false,
                count: false
            },
            {
                functionId: 'People',
                icon: './assets/images/account.svg',
                action: SideMenuAction.People,
                caption: this.translate.instant('INSIGHTS_MENU.PEOPLE'),
                navigation: 'insights/main/people',
                profiles: [UserProfile.ADMIN],
                selected: false,
                count: false
            },
            {
                functionId: 'PeopleGroups',
                icon: './assets/images/account-group.svg',
                action: SideMenuAction.Groups,
                caption: this.translate.instant('INSIGHTS_MENU.PEOPLEGROUPS'),
                navigation: 'insights/main/user-groups',
                profiles: [UserProfile.ADMIN],
                selected: false,
                count: false
            },
            {
                functionId: 'Accounts',
                icon: './assets/images/account-key.svg',
                action: SideMenuAction.Accounts,
                caption: this.translate.instant('INSIGHTS_MENU.ACCOUNTS'),
                navigation: 'insights/main/accounts',
                profiles: [UserProfile.ADMIN],
                selected: false,
                count: false
            },
            {
                functionId: 'Sites',
                icon: './assets/images/office-building-marker-outline.svg',
                action: SideMenuAction.Sites,
                caption: this.translate.instant('INSIGHTS_MENU.SITES'),
                navigation: 'insights/main/sites',
                profiles: [UserProfile.ADMIN],
                selected: false,
                count: false
            },
            {
                functionId: 'Alerts',
                icon: './assets/images/newspaper-black.svg',
                action: SideMenuAction.Sites,
                caption: this.translate.instant('INSIGHTS_MENU.ALERTS'),
                navigation: 'insights/main/alerts',
                profiles: [UserProfile.ADMIN],
                selected: false,
                count: false
            },
            {
                functionId: 'Touchpoint',
                icon: './assets/images/tablet-android.svg',
                action: SideMenuAction.Touchpoints,
                caption: this.translate.instant('INSIGHTS_MENU.TOUCHPOINTMGM'),
                navigation: 'insights/main/touchpoint-management',
                profiles: [UserProfile.SYSTEM],
                selected: false,
                count: false
            },
            {
                functionId: 'Assets',
                icon: './assets/images/3d-design.svg',
                action: SideMenuAction.AssetsManagement,
                caption: this.translate.instant('INSIGHTS_MENU.ASSETSMGM'),
                navigation: 'insights/main/assets-management',
                profiles: [UserProfile.SYSTEM],
                selected: false,
                count: false
            },
            {
                functionId: 'ActionTiles',
                icon: './assets/images/tile-admin-black.svg',
                action: SideMenuAction.ActionTiles,
                caption: this.translate.instant('INSIGHTS_MENU.ACTIONTILES'),
                navigation: 'insights/main/action-tiles',
                profiles: [UserProfile.SYSTEM],
                selected: false,
                count: false
            },
            {
                functionId: 'Informations',
                icon: './assets/images/information-outline.svg',
                action: SideMenuAction.Informations,
                caption: this.translate.instant('INSIGHTS_MENU.INFORMATIONS'),
                navigation: 'insights/main/informations',
                profiles: [UserProfile.SYSTEM],
                selected: false,
                count: false
            },
            {
                functionId: 'ProductsTracking',
                icon: './assets/images/account_tree_black_24dp.svg',
                action: SideMenuAction.ProductsTracking,
                caption: this.translate.instant('INSIGHTS_MENU.PRODUCTSTRACKING'),
                navigation: 'insights/main/products-tracking',
                profiles: [UserProfile.SYSTEM],
                selected: false,
                count: false
            },
            /*{
                functionId: 'Recruiting',
                icon: './assets/images/meeting.svg',
                action: SideMenuAction.Recruiting,
                caption: this.translate.instant('INSIGHTS_MENU.RECRUITING'),
                navigation: 'insights/main/recruiting',
                profiles: [UserProfile.SYSTEM],
                selected: false
            },*/
          {
            functionId: 'Recruiting',
            icon: './assets/images/meeting.svg',
            action: SideMenuAction.RecruitingMQS,
            caption: this.translate.instant('INSIGHTS_MENU.RECRUITING'),
            navigation: 'insights/main/recruiting-mqs',
            profiles: [UserProfile.SYSTEM],
            selected: false,
            count: true
          },

           /*{
             functionId: 'TkLab',
             icon: './assets/images/domain-green.svg',
             action: SideMenuAction.TklHome,
             caption: this.translate.instant('TKLAB.CAPTION'),
             navigation: 'insights/main/tklab',
             profiles: [UserProfile.SYSTEM],
             selected: false
           },*/
          {
            functionId: 'QuizSurvey',
            icon: './assets/images/domain-green.svg',
            action: SideMenuAction.TklHome,
            caption: this.translate.instant('Quiz/Survey'),
            navigation: 'insights/main/tklab-mqs/survey',
            profiles: [UserProfile.SYSTEM],
            selected: false,
            count: false
          },
          /*{
            functionId: 'Quiz/Survey',
            icon: './assets/images/meeting.svg',
            action: SideMenuAction.QuizSurvey,
            caption: this.translate.instant('QuizSurvey'),
            navigation: 'insights/main/quiz-survey-listing',
            profiles: [UserProfile.SYSTEM],
            selected: false
          },*/
            // {
            //     icon: './assets/images/newspaper-black.svg',
            //     action: SideMenuAction.News,
            //     caption: 'Alerts',
            //     navigation: 'insights/main/news',
            //     profiles: [UserProfile.ADMIN]
            // },
            // {
            //     icon: './assets/images/survey.svg',
            //     action: SideMenuAction.Survey,
            //     caption: 'Survey',
            //     navigation: 'insights/main/survey',
            //     profiles: [UserProfile.ADMIN]
            // },
            // {
            //     icon: './assets/images/leaf.svg',
            //     action: SideMenuAction.Sustainability,
            //     caption: 'Sustainability',
            //     navigation: 'insights/main/sustainability',
            //     profiles: [UserProfile.ADMIN]
            // },
            // {
            //     icon: './assets/images/alarm.svg',
            //     action: SideMenuAction.Scheduler,
            //     caption: 'Scheduler',
            //     navigation: 'insights/main/scheduler',
            //     profiles: [UserProfile.SYSTEM]
            // },
            // {
            //     icon: './assets/images/injections-black.svg',
            //     action: SideMenuAction.Reservation,
            //     caption: 'Flu Vaccine',
            //     navigation: 'insights/main/reservation',
            //     profiles: [UserProfile.ADMIN, UserProfile.SPOC_APM]
            // },
            // {
            //     icon: './assets/images/tile-pandemic-measures-black.svg',
            //     action: SideMenuAction.APM,
            //     caption: 'Anti Pandemic Measures',
            //     navigation: 'insights/main/apm',
            //     profiles: [UserProfile.ADMIN, UserProfile.SPOC_APM]
            // },
            // {
            //     icon: './assets/images/shield-red.svg',
            //     action: SideMenuAction.Safety,
            //     caption: 'Safety',
            //     navigation: 'insights/main/safety',
            //     profiles: [UserProfile.ADMIN, UserProfile.SPOC_APM]
            // },
            {
                functionId: 'LogAudit',
                icon: './assets/images/calendar-month-outline.svg',
                action: SideMenuAction.LogAudit,
                caption: this.translate.instant('INSIGHTS_MENU.LOGAUDIT'),
                navigation: 'insights/main/log-audit',
                profiles: [UserProfile.SYSTEM],
                selected: false,
                count: false
            },
            {
                functionId: 'Settings',
                icon: './assets/images/settings-black.svg',
                action: SideMenuAction.SettingsManagement,
                caption: this.translate.instant('INSIGHTS_MENU.SETTINGSMGM'),
                navigation: 'insights/main/settings-management',
                profiles: [UserProfile.SYSTEM],
                selected: false,
                count: false
            },
            {
                functionId: 'ticketGenerator',
                 icon: './assets/images/question-mark.svg',
                 action: SideMenuAction.TicketGenerate,
                 caption: this.translate.instant('INSIGHTS_MENU.TICKETGN'),
                 navigation: 'insights/main/ticket-generate',
                 profiles: [],
                 selected: false,
                 count: false
             },
            {
               functionId: 'CMS',
               icon: './assets/images/cms-logo.svg',
               action: SideMenuAction.CMSMenu,
               caption: this.translate.instant('RECRUITINGTXT.CMS'),
               navigation: 'insights/main/cms',
               profiles: [],
               selected: false,
               count: false
            },
            {
               functionId: 'AccessControl',
               icon: './assets/images/entry.svg',
               action: SideMenuAction.AccessControl,
               caption: this.translate.instant('INSIGHTS_MENU.ACCESS_CONTROL'),
               navigation: 'insights/main/access-control',
               profiles: [],
               selected: false,
               count: false
            },
            {
                functionId: null,
                icon: './assets/images/logout-black.svg',
                action: SideMenuAction.Logout,
                caption: this.translate.instant('INSIGHTS_MENU.LOGOUT'),
                navigation: '',
                profiles: [],
                selected: false,
                count: false
            }
        ];
    }
}
