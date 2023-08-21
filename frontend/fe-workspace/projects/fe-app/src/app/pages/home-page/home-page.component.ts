import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { NEWS_ACTION_TYPE } from 'projects/fe-common/src/lib/models/admin/news-document';
import { Site, SITE_STATE } from 'projects/fe-common/src/lib/models/admin/site';
import { ActionTile, ActionType, QrScanContext } from 'projects/fe-common/src/lib/models/app';
import { HomeData } from 'projects/fe-common/src/lib/models/home-data';
import { ACCESS_CONTROL_LEVEL, Person } from 'projects/fe-common/src/lib/models/person';
import { REQUEST_STATE } from 'projects/fe-common/src/lib/models/requests';
import { USER_BOOK_TYPE } from 'projects/fe-common/src/lib/models/user-request-book';
import { AdminUserManagementService, CompanyFunctionsResponse } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { AlertsManagementService } from 'projects/fe-common/src/lib/services/alerts-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { CoreService } from 'projects/fe-common/src/lib/services/core.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { RequestManagementService} from 'projects/fe-common/src/lib/services/request-management.service';
import { UserActionManagementService } from 'projects/fe-common/src/lib/services/user-action-management.service';
import { UserActionService, USER_ACTIVITY_TYPE } from 'projects/fe-common/src/lib/services/user-action.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { from } from 'rxjs';
import { ConfirmLunchSettingResult } from '../../components/lunch-settings/lunch-settings.component';
import { HelpdeskServiceSheetComponent } from '../../components/helpdesk-service-sheet/helpdesk-service-sheet.component';
import { ServiceSheetComponent } from './service-sheet/service-sheet.component';
import { AccessControlQrCodeComponent } from '../../components/access-control-qr-code/access-control-qr-code.component';
import { Company } from 'projects/fe-common/src/lib/models/company';
import { UserACQrCode } from 'projects/fe-common/src/lib/models/user-access-control-qr-code';
@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    animations: [
        trigger('slideInOutV', [
            state('in', style({
                overflow: 'hidden',
                height: '*',
            })),
            state('out', style({
                opacity: '0',
                overflow: 'hidden',
                height: '0px',
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ])
    ]
})
export class HomePageComponent implements OnInit {
    actionTiles: ActionTile[];
    menuActionTiles: ActionTile[];

    showInstantAction: boolean;

    static context: any;
    showBack: boolean = false;

    mainTileBackground: string = '#ff000022';

    mainTileTextAction: string;
    mainTileTextSite: string;
    mainTileTextSiteInfo: string;
    mainTileTextDesk: string;
    mainTileTextLastAction: string;

    mainTileIcon: string;
    mainTileIconAction: string;
    mainTileTextActionColor: string;
    mainTileTextColor: string;

    homeData: HomeData;

    userAccount: Person;
    userSite: Site;

    questionDrawer: string = 'out';
    questionMessage: string = '';

    userQrCode: string = "";
    qrLevel: string = 'Q';

    userCompany: Company;
    userGreenpassVerification: Boolean = false;

    currentBadge: UserACQrCode = null;

    constructor(
        private _common: CommonService,
        private _coreApiService: CoreService,
        private _router: Router,
        private _adminUserManagementService: AdminUserManagementService,
        private _userActionManagementService: UserActionManagementService,
        private _userManagementService: UserManagementService,
        private _notifyManagementService: NotifyManagementService,
        private _alertsManagementService: AlertsManagementService,
        private _userActionService: UserActionService,
        private _bottomSheet: MatBottomSheet,
        private _swUpdate: SwUpdate,
        public translate: TranslateService,
        private requestManagementService: RequestManagementService
    ) {
        this.menuActionTiles = [];
        this.userAccount = this._userManagementService.getAccount();
        //this.userQrCode = this._common.getUserQrString(this.userAccount.id);
        HomePageComponent.context = this;
    }

    async ngOnInit() {
        await this.reloadAllData();
    }

    async reloadUser() {
        let result = await this._adminUserManagementService.getPeople(this.userAccount.companyId);
        for(let person of result.people) {
            if(person.id == this.userAccount.id) {
                this.userAccount = person;
                break;
            } 
        }
    }

    async reloadAllData() {
        let result = await this._adminUserManagementService.getPeople(this.userAccount.companyId);
        for(let person of result.people) {
            if(person.id == this.userAccount.id) {
                this.userAccount = person;
                break;
            } 
        }
        let res = await this._coreApiService.getUserHomeData(this.userAccount.id);
        if (res.result) {
            this.homeData = res.data;
            console.log('Home data : ', this.homeData);
        } else {
            this._notifyManagementService.displayErrorSnackBar(res.reason);
        }

        let resTiles = await this._coreApiService.getUserHomeTiles(this.userAccount.id);
        if (resTiles.result) {
            this.actionTiles = this.menuActionTiles = resTiles.homeTiles;
            console.log('Home tiles : ', this.actionTiles);
        }
        let res2 = await this._adminUserManagementService.getCompany(this.userAccount.companyId);
        if(res2.result) {
            this.userCompany = res2.company;
        }
        this.userGreenpassVerification = (await this._adminUserManagementService.getTodayUserGreenpassValidation(this.userAccount.id)).result;

        try {
            if (this.homeData.site) {
                this.initializeUserAndSite();
                this.initializeNewsMarker();
                this.initializeRequestsMarker();
                this.showMainTile(true);
                this.checkUserLunch();
                this.getUserAccessQrCode();
                this.initializeQrCode();
                // this.delayQrCodeRead(1000);
                this.delayQrCodeRead(2000);
                // this.delayQrCodeRead(4000);
                // this.delayQrCodeRead(5000);
            } else {
                this.initializeNewsMarker();
                this.initializeRequestsMarker();
                this.showMainTile(false);
            }
        } catch (ex) {
            console.log('home initialization error: ', ex);
        }
    }

    async initializeQrCode() {
        if(this.homeData.badgeQrCode) {
            this.userQrCode = this.homeData.badgeQrCode;
        }
        else this.userQrCode = this._common.getUserQrString(this.userAccount.id);
        /*
        this.userAccount = (await this._adminUserManagementService.getPeople(this.userAccount.companyId)).people.find(user => user.id==this.userAccount.id);
        if((this.userAccount.accessControlLevel==ACCESS_CONTROL_LEVEL.PASSEPARTOUT || 
            this.userAccount.accessControlLevel==ACCESS_CONTROL_LEVEL.GROUP ||
            this.userAccount.accessControlLevel==ACCESS_CONTROL_LEVEL.SINGLE_PASSAGES ) && this.userAccount.accessControlQrCode!="") {
                this.userQrCode = this.userAccount.accessControlQrCode;
            }
            let res = await this._adminUserManagementService.getAccessControlBadge(this.userQrCode);
            if(res) {
                this.currentBadge = res.badge;
            }
        else this.userQrCode = this._common.getUserQrString(this.userAccount.id);
        */
    }

    async delayQrCodeRead(millisec) {
        setTimeout(()=>{ this.getUserAccessQrCode(); }, millisec)
    }

    checkUserLunch() {
        // check if lunch time is defined
        if (this.homeData.showLunchQuestion) {
            this.showQuestionTile(this.translate.instant('APP_PEOPLE_PAGE.ASKLUNCH'));
        } else {
            this.hideQuestionTile();
        }
    }

    async getUserAccessQrCode() {
        if(this.userAccount.accessControlLevel && this.userAccount.accessControlLevel!=ACCESS_CONTROL_LEVEL.NONE) {
            let res = await this._adminUserManagementService.getAccessControlQrCode(this.userAccount.id);
            if(res && res.qrcode) {
                this.userQrCode = res.qrcode;
            }
        }
    }

    greenpassVerify() {
        if(this.userCompany) {
            if(this.userCompany.greenpassSettings.abilitation && this.userCompany.greenpassSettings.requestedForCheckIn) {
                if(this.userAccount.enableGreenpass && !this.userGreenpassVerification) return false;
            }
        }
        return true;
    }

    showQuestionTile(question: string) {
        this.questionMessage = question;
        this.questionDrawer = 'in';
    }

    hideQuestionTile() {
        this.questionDrawer = 'out';
    }

    onQuestionConfirm(confirm: boolean) {
        this.questionDrawer = 'out';
        if (confirm) {
            this._userActionService.userLunchAction(true);
        } else {
            this._userActionService.userOvertimeAction(true);
        }
        this.reloadAllData();
    }

    async onLunchSettings(lunchSettingsResult: ConfirmLunchSettingResult) {
        this.questionDrawer = 'out';
        console.log('lunchSettingsResult: ', lunchSettingsResult);

        let dateYYYYMMDD = this._common.toYYYYMMDD(new Date());
        await this._userActionService.userLunchSettingsAction(dateYYYYMMDD, lunchSettingsResult.lunchDone, lunchSettingsResult.extraWorkDone, lunchSettingsResult.startTime, lunchSettingsResult.endTime);
    }

    getUserDailyBookType() {
        return HomeData.getUserDailyPlan(this.homeData);
    }

    getSiteDailyStatus() {
        let dateYYYYMMDD = this._common.toYYYYMMDD(new Date());
        if (this.homeData.siteCapacity && this.homeData.siteCapacity.capacityTimeFrames) {
            for (let ctf of this.homeData.siteCapacity.capacityTimeFrames) {
                if ((dateYYYYMMDD >= ctf.dateFrom) && (dateYYYYMMDD <= ctf.dateTo)) {
                    return SITE_STATE.RESTRICTED_MODE;
                }
            }
        }
        return this.homeData.siteDailyStatus ? this.homeData.siteDailyStatus.status : this.homeData.site.globalStatus;
    }

    initializeMainTileStatus() {
        this.mainTileBackground = this.homeData.mainTile.status.mainTileBackground;
        this.mainTileTextColor = this.homeData.mainTile.status.mainTileBackground;
        this.mainTileTextActionColor = this.homeData.mainTile.status.mainTileBackground;
        this.mainTileTextSite = this.homeData.mainTile.status.mainTileBackground;
        this.mainTileIcon = this.homeData.mainTile.status.mainTileBackground;
    }

    initializeMainTileUserAction() {
        this.mainTileIconAction = this.homeData.mainTile.action.mainTileIconAction;
        this.mainTileIcon = this.homeData.mainTile.action.mainTileIcon;
        this.mainTileTextAction = this.homeData.mainTile.action.mainTileTextAction;
        this.mainTileTextSiteInfo = this.homeData.mainTile.action.mainTileTextSiteInfo;
        this.mainTileTextDesk = this.homeData.mainTile.action.mainTileTextDesk;
        if (this.homeData.mainTile.action.mainTileLastAction) {
            this.mainTileTextLastAction = "LAST ACTION: " + this.homeData.mainTile.action.mainTileLastAction;
        } else {
            this.mainTileTextLastAction = '';
        }
    }

    initializeUserAndSite() {
        this.initializeMainTileStatus();
        this.initializeMainTileUserAction();
    }


    buildMenuActionTiles() {
        if (this.homeData != null)
            this.menuActionTiles = this.actionTiles;
        else
            this.menuActionTiles = this.actionTiles.filter(t => t.Action != ActionType.BookWorkRequest);
    }

    initializeNewsMarker() {
        // TODO

        // from(this.newsManagementService.getNewsList(this.nfsUser.UserName)).subscribe(newsDocuments => {
        //     let unreadedCount = 0;

        //     newsDocuments.forEach(news => unreadedCount += (!news.confirmed ? 1 : 0));
        //     if (unreadedCount > 0) {
        //         let newsTile = this.actionTiles.find(t => t.Action == ActionType.News);
        //         if (newsTile)
        //             newsTile.ExtraInfo = '' + unreadedCount;

        //     }
        // });

        from(this._alertsManagementService.getUserAlertList(this.userAccount.id)).subscribe(async newsDocuments => {
            let unreadedCount = 0;

            newsDocuments.forEach(news => unreadedCount += (!news.confirmed ? 1 : 0));
            if (unreadedCount > 0) {
                let newsTile = this.actionTiles.find(t => t.Action == ActionType.News);
                if (newsTile)
                    newsTile.ExtraInfo = '' + unreadedCount;
            }

            let popUpNews = newsDocuments.find(n => n.showPopup && !n.confirmed);
            if (popUpNews) {
                await this._notifyManagementService.openMessageDialog(popUpNews.title, popUpNews.description);
                await this._alertsManagementService.actionOnDocument(popUpNews.id, this.userAccount.id, NEWS_ACTION_TYPE.CONFIRM);
            }
        });
    }

    initializeRequestsMarker() {
        from(this.requestManagementService.getResponsableRequestsByState(this.userAccount.id,REQUEST_STATE.PENDING)).subscribe(async requestsDocumentResPending => {
            let pendingCount = requestsDocumentResPending.length;

            from(this.requestManagementService.getResponsableRequestsByState(this.userAccount.id,REQUEST_STATE.INITIALIZED)).subscribe(async requestsDocumentResInit => {
                pendingCount = pendingCount + requestsDocumentResInit.length;

                from(this.requestManagementService.getAccountableRequestsByState(this.userAccount.id,REQUEST_STATE.PENDING)).subscribe(async requestsDocumentAccPending => {
                    let documentFinal = new Array();
                    let found = false;
                    for(let req of requestsDocumentAccPending) {
                        found = false;
                        for(let req2 of requestsDocumentResPending) {
                            if(req.id == req2.id) {
                                found = true;
                                break;
                            }
                        }
                        if(!found)  documentFinal.push(req);
                    }
                    pendingCount = pendingCount + documentFinal.length;

                    from(this.requestManagementService.getAccountableRequestsByState(this.userAccount.id,REQUEST_STATE.INITIALIZED)).subscribe(async requestsDocumentAccInit => {
                        documentFinal = new Array();
                        let found = false;
                        for(let req of requestsDocumentAccInit) {
                            found = false;
                            for(let req2 of requestsDocumentResInit) {
                                if(req.id == req2.id) {
                                    found = true;
                                    break;
                                }
                            }
                            if(!found)  documentFinal.push(req);
                        }
                        pendingCount = pendingCount + documentFinal.length;

                        let employeeTile = this.actionTiles.find(t => t.Action == ActionType.Employee);
                        if (employeeTile && pendingCount!=0)   employeeTile.ExtraInfo = '' + pendingCount;

                    });

                });

            });
        });

    }

    enableQrCode() {
        if(!this.homeData.site.useAccessControlQrCodeForCheckIn) {
            return false;
        } 
        if(this.userAccount.enablePlan) {
            let action = this.homeData.mainTile.action.mainTileAction;
            if (action) {
                switch (action) {
                    case USER_ACTIVITY_TYPE.SMARTWORK_IN: {
                        return false;
                    }

                    case USER_ACTIVITY_TYPE.SMARTWORK_OUT: {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    async onMainTileClick($event) {
        console.log('Main tile click...');

        if (!this._common.isWorkingTime() && !this.homeData.site.enableWeekend) {
            this._notifyManagementService.openMessageDialog(this.translate.instant('HOMEPAGE.HEY'), this.translate.instant('HOMEPAGE.ENJOY FREE TIME'));
            return;
        }

        if(!this.userAccount.enablePlan) {
            let siteKey = this.homeData.site.key;
            let action = this.homeData.mainTile.action.mainTileAction;
            if (action) {
                switch (action) {
                    case USER_ACTIVITY_TYPE.OFFICE_IN: {
                        await HomePageComponent.navigateQrScanner(QrScanContext.qrOfficeIn, siteKey, USER_ACTIVITY_TYPE.OFFICE_IN);
                        break;
                    }

                    case USER_ACTIVITY_TYPE.DESK_CHECKIN: {
                        await HomePageComponent.navigateQrScanner(QrScanContext.qrDeskCheckIn, siteKey, USER_ACTIVITY_TYPE.DESK_CHECKIN);
                        break;
                    }

                    case USER_ACTIVITY_TYPE.DESK_CHECKOUT: {
                        await HomePageComponent.navigateQrScanner(QrScanContext.qrDeskCheckOut, siteKey, USER_ACTIVITY_TYPE.DESK_CHECKOUT);
                        break;
                    }

                    case USER_ACTIVITY_TYPE.OFFICE_OUT: {
                        await HomePageComponent.navigateQrScanner(QrScanContext.qrOfficeOut, siteKey, USER_ACTIVITY_TYPE.OFFICE_OUT);
                        break;
                    }
                }
            }
            else await HomePageComponent.navigateQrScanner(QrScanContext.qrOfficeIn, siteKey, USER_ACTIVITY_TYPE.OFFICE_IN);
        }
        else {

            let dailyPlanType = this.getUserDailyBookType();
            if (dailyPlanType) {
                console.log('user daily plan: ', dailyPlanType);

                if (dailyPlanType == USER_BOOK_TYPE.VACATION) {
                    this._notifyManagementService.displayWarnSnackBar(this.translate.instant('HOMEPAGE.ENJOY HOLYDAY'));
                } else {
                    let siteKey = this.homeData.site.key;
                    let action = this.homeData.mainTile.action.mainTileAction;

                    if (action) {
                        switch (action) {
                            case USER_ACTIVITY_TYPE.OFFICE_IN: {
                                await HomePageComponent.navigateQrScanner(QrScanContext.qrOfficeIn, siteKey, USER_ACTIVITY_TYPE.OFFICE_IN);
                                break;
                            }

                            case USER_ACTIVITY_TYPE.DESK_CHECKIN: {
                                await HomePageComponent.navigateQrScanner(QrScanContext.qrDeskCheckIn, siteKey, USER_ACTIVITY_TYPE.DESK_CHECKIN);
                                break;
                            }

                            case USER_ACTIVITY_TYPE.DESK_CHECKOUT: {
                                await HomePageComponent.navigateQrScanner(QrScanContext.qrDeskCheckOut, siteKey, USER_ACTIVITY_TYPE.DESK_CHECKOUT);
                                break;
                            }

                            case USER_ACTIVITY_TYPE.OFFICE_OUT: {
                                await HomePageComponent.navigateQrScanner(QrScanContext.qrOfficeOut, siteKey, USER_ACTIVITY_TYPE.OFFICE_OUT);
                                break;
                            }

                            case USER_ACTIVITY_TYPE.SMARTWORK_IN:
                            case USER_ACTIVITY_TYPE.SMARTWORK_OUT: {
                                let result = await this._userActionService.showConfirmMessage(action, '');
                                if (result) {
                                    await this._userActionManagementService.sendSmartworkingAction();
                                    await this.reloadAllData();
                                }
                                break;
                            }

                            case USER_ACTIVITY_TYPE.NOP:
                            case USER_ACTIVITY_TYPE.ALLDONE: {
                                this._notifyManagementService.displayWarnSnackBar(this.translate.instant('HOMEPAGE.PERFORM ALL WORKING ACTION'));
                                break;
                            }
                        }
                    } else
                        this._notifyManagementService.displayWarnSnackBar(this.translate.instant('HOMEPAGE.PERFORM ALL WORKING ACTION'));
                }
            } else {
                this._notifyManagementService.displayWarnSnackBar(this.translate.instant('HOMEPAGE.DONT HAVE ANY PLAN'));
            }
        }
    }

    showMainTile(show: boolean) {
        this.showInstantAction = show && (this.homeData != null) && (this.homeData.site != null);
    }

    async onTileClick(actionTile: ActionTile) {

        if (actionTile.ChildrenAsServices) {
            this._bottomSheet.open(ServiceSheetComponent, {
                data: { serviceActions: actionTile.Children },
                panelClass: 'bottom-sheet'
            });
        } else {
            switch (actionTile.Action) {
                case ActionType.Menu: {
                    this.showBack = true;
                    this.showMainTile(false);
                    this.menuActionTiles = actionTile.Children;
                    return;
                }

                case ActionType.BookWorkRequest: {
                    await this._router.navigate(["user-calendar"]);
                    return;
                }

                case ActionType.QrAction: {
                    if (!this._common.isWorkingTime() && !this.homeData.site.enableWeekend) {
                        this._notifyManagementService.openMessageDialog(this.translate.instant('HOMEPAGE.HEY'), this.translate.instant('HOMEPAGE.ENJOY FREE TIME'));

                        return;
                    }
                    await HomePageComponent.navigateQrScanner(QrScanContext.qrInstantBooking, '', USER_ACTIVITY_TYPE.NOP);
                    return;
                }

                case ActionType.News: {
                    await HomePageComponent.context._router.navigate(["news"]);
                    return;
                }

                case ActionType.UserBookings: {
                    if (!this._common.isWorkingTime() && !this.homeData.site.enableWeekend) {
                        this._notifyManagementService.openMessageDialog(this.translate.instant('HOMEPAGE.HEY'), this.translate.instant('HOMEPAGE.ENJOY FREE TIME'));
                        return;
                    }
                    await HomePageComponent.context._router.navigate(["mybookings"]);
                    return;
                }

                case ActionType.BookRoom: {
                    await HomePageComponent.context._router.navigate(["bookroom"]);
                    return;
                }

                case ActionType.BookDesk: {
                    await HomePageComponent.context._router.navigate(["bookdesk"]);
                    return;
                }

                case ActionType.CheckIn: {
                    if (!this._common.isWorkingTime() && !this.homeData.site.enableWeekend) {
                        this._notifyManagementService.openMessageDialog(this.translate.instant('HOMEPAGE.HEY'), this.translate.instant('HOMEPAGE.ENJOY FREE TIME'));
                        return;
                    }

                    await HomePageComponent.navigateQrScanner(QrScanContext.qrCheckIn, '', USER_ACTIVITY_TYPE.NOP);
                    return;
                }

                case ActionType.ExtendBooking: {
                    if (!this._common.isWorkingTime() && !this.homeData.site.enableWeekend) {
                        this._notifyManagementService.openMessageDialog(this.translate.instant('HOMEPAGE.HEY'), this.translate.instant('HOMEPAGE.ENJOY FREE TIME'));
                        return;
                    }

                    await HomePageComponent.navigateQrScanner(QrScanContext.qrExtendBooking, '', USER_ACTIVITY_TYPE.NOP);
                    return;
                }

                case ActionType.CheckOut: {
                    if (!this._common.isWorkingTime() && !this.homeData.site.enableWeekend) {
                        this._notifyManagementService.openMessageDialog(this.translate.instant('HOMEPAGE.HEY'), this.translate.instant('HOMEPAGE.ENJOY FREE TIME'));
                        return;
                    }

                    await HomePageComponent.navigateQrScanner(QrScanContext.qrCheckOut, '', USER_ACTIVITY_TYPE.NOP);
                    return;
                }

                case ActionType.UserProfile: {
                    await HomePageComponent.context._router.navigate(["user-profile"]);
                    return;
                }

                case ActionType.Information: {
                    await HomePageComponent.context._router.navigate(["information"]);
                    return;
                }

                case ActionType.UserStatistics: {
                    await HomePageComponent.context._router.navigate(["user-statistics"]);
                    return;
                }

                case ActionType.Safety: {
                    if (!this._common.isWorkingTime() && !this.homeData.site.enableWeekend) {
                        this._notifyManagementService.openMessageDialog(this.translate.instant('HOMEPAGE.HEY'), this.translate.instant('HOMEPAGE.ENJOY FREE TIME'));
                        return;
                    }

                    await HomePageComponent.context._router.navigate(["user-safety"]);
                    return;
                }

                case ActionType.Admin: {
                    await HomePageComponent.context._router.navigate(["user-admin"]);
                    return;
                }

                case ActionType.PandemicMeasures: {
                    // this._notifyManagementService.openMessageDialog('IRINA', "Coming soon...");
                    await HomePageComponent.context._router.navigate(["anti-pandemic-measures"]);
                    break;
                }

                case ActionType.BoardInfo: {
                    await HomePageComponent.context._router.navigate(["board-info"]);
                    break;
                }

                case ActionType.TestLab: {
                    await HomePageComponent.context._router.navigate(["test-lab"]);
                    break;
                }

                case ActionType.Community: {
                    await HomePageComponent.context._router.navigate(["community"]);
                    break;
                }

                case ActionType.Survey: {
                    await HomePageComponent.context._router.navigate(["survey"]);
                    break;
                }

                case ActionType.Employee: {
                    await HomePageComponent.context._router.navigate(["employee"]);
                    break;
                }

                case ActionType.StartProduction: {
                    await HomePageComponent.context._router.navigate(["start-production"]);
                    break;
                }

                case ActionType.ProductTracking: {
                    await HomePageComponent.context._router.navigate(["product-tracking"]);
                    break;
                }

                case ActionType.ProductTrackingQA: {
                    await HomePageComponent.context._router.navigate(["product-tracking-qa"]);
                    break;
                }

                case ActionType.ProductReturn: {
                    await HomePageComponent.context._router.navigate(["product-tracking-returnal"]);
                    break;
                }


            }
        }
    }

    async onClickQrCode() {
        await this.reloadUser();
        await this.initializeQrCode();
        const bottomSheetRef = this._bottomSheet.open(AccessControlQrCodeComponent, {
            data: { 
                qrcode: this.userQrCode,
                name: this.userAccount.name + " " + this.userAccount.surname,
                endDate: new Date(this.homeData.badgeValidityEndDate),
                startDate: new Date(this.homeData.badgeValidityStartDate)
            },
            panelClass: 'bottom-sheet'
        });
    }

    onHomeClick() {
        this.showBack = false;
        this.showMainTile(true);
        this.buildMenuActionTiles();
    }

    async onLogoClick() {
        await this.reloadAllData();
    }

    onBackClick() {
        this.onHomeClick();
    }

    private static async navigateQrScanner(qrContext: QrScanContext, siteKey: string, userAction: USER_ACTIVITY_TYPE) {
        await HomePageComponent.context._router.navigate(["qrscanner"], {
            queryParams: {
                "context": qrContext,
                "siteKey": siteKey,
                "userAction": userAction
            }
        });
    }

    onMenuClick() {
        console.log('onMenuClick');
    }
}
