import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QrScanContext } from 'projects/fe-common/src/lib/models/app';
import { HomeData } from 'projects/fe-common/src/lib/models/home-data';
import { USER_BOOK_TYPE } from 'projects/fe-common/src/lib/models/user-request-book';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { CoreService } from 'projects/fe-common/src/lib/services/core.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserActionManagementService } from 'projects/fe-common/src/lib/services/user-action-management.service';
import { UserActionService, USER_ACTIVITY_TYPE } from 'projects/fe-common/src/lib/services/user-action.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Injectable({
    providedIn: 'root'
})
export class MainActionService {

    constructor(private _common: CommonService,
        private _coreApiService: CoreService,
        private _userManagementService: UserManagementService,
        private _router: Router,
        private _notifyManagementService: NotifyManagementService,
        private _userActionManagementService: UserActionManagementService,
        private _userActionService: UserActionService,
        public translate: TranslateService) { }

    async doMainAction() {
        let userAccount = this._userManagementService.getAccount();
        let res = await this._coreApiService.getUserHomeData(userAccount.id);
        if (res.result) {
            let homeData = res.data;

            if (!this._common.isWorkingTime() && !homeData.site.enableWeekend) {
                this._notifyManagementService.openMessageDialog(this.translate.instant('HOMEPAGE.HEY'), this.translate.instant('HOMEPAGE.ENJOY FREE TIME'));
                return;
            }
            if(!userAccount.enablePlan) {
                let siteKey = homeData.site.key;
                let action = homeData.mainTile.action.mainTileAction;
                if (action) {
                    switch (action) {
                        case USER_ACTIVITY_TYPE.OFFICE_IN: {
                            await this.navigateQrScanner(QrScanContext.qrOfficeIn, siteKey, USER_ACTIVITY_TYPE.OFFICE_IN);
                            break;
                        }
    
                        case USER_ACTIVITY_TYPE.DESK_CHECKIN: {
                            await this.navigateQrScanner(QrScanContext.qrDeskCheckIn, siteKey, USER_ACTIVITY_TYPE.DESK_CHECKIN);
                            break;
                        }
    
                        case USER_ACTIVITY_TYPE.DESK_CHECKOUT: {
                            await this.navigateQrScanner(QrScanContext.qrDeskCheckOut, siteKey, USER_ACTIVITY_TYPE.DESK_CHECKOUT);
                            break;
                        }
    
                        case USER_ACTIVITY_TYPE.OFFICE_OUT: {
                            await this.navigateQrScanner(QrScanContext.qrOfficeOut, siteKey, USER_ACTIVITY_TYPE.OFFICE_OUT);
                            break;
                        }
                    }
                }
                else await this.navigateQrScanner(QrScanContext.qrOfficeIn, siteKey, USER_ACTIVITY_TYPE.OFFICE_IN);
            }
            else {
                let dailyPlanType = HomeData.getUserDailyPlan(homeData);
                if (dailyPlanType) {
                    console.log('user daily plan: ', dailyPlanType);
        
                    if (dailyPlanType == USER_BOOK_TYPE.VACATION) {
                        this._notifyManagementService.displayWarnSnackBar(this.translate.instant('HOMEPAGE.ENJOY HOLYDAY'));
                    } else {
                        let siteKey = homeData.site.key;
                        let action = homeData.mainTile.action.mainTileAction;
        
                        if (action) {
                            switch (action) {
                                case USER_ACTIVITY_TYPE.OFFICE_IN: {
                                    await this.navigateQrScanner(QrScanContext.qrOfficeIn, siteKey, USER_ACTIVITY_TYPE.OFFICE_IN);
                                    break;
                                }
        
                                case USER_ACTIVITY_TYPE.DESK_CHECKIN: {
                                    await this.navigateQrScanner(QrScanContext.qrDeskCheckIn, siteKey, USER_ACTIVITY_TYPE.DESK_CHECKIN);
                                    break;
                                }
        
                                case USER_ACTIVITY_TYPE.DESK_CHECKOUT: {
                                    await this.navigateQrScanner(QrScanContext.qrDeskCheckOut, siteKey, USER_ACTIVITY_TYPE.DESK_CHECKOUT);
                                    break;
                                }
        
                                case USER_ACTIVITY_TYPE.OFFICE_OUT: {
                                    await this.navigateQrScanner(QrScanContext.qrOfficeOut, siteKey, USER_ACTIVITY_TYPE.OFFICE_OUT);
                                    break;
                                }
        
                                case USER_ACTIVITY_TYPE.SMARTWORK_IN:
                                case USER_ACTIVITY_TYPE.SMARTWORK_OUT: {
                                    let result = await this._userActionService.showConfirmMessage(action, '');
                                    if (result) {
                                        await this._userActionManagementService.sendSmartworkingAction();
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
                    await this._router.navigate(["qrscanner"], {
                        queryParams: {
                            "context": QrScanContext.qrInstantBooking,
                            "siteKey": '',
                            "userAction": USER_ACTIVITY_TYPE.NOP
                        }
                    });    // this._notifyManagementService.displayWarnSnackBar(this.translate.instant('HOMEPAGE.DONT HAVE ANY PLAN'));
                }
            }
        } else {
            this._notifyManagementService.displayErrorSnackBar(res.reason);
        }

    }

    private  async navigateQrScanner(qrContext: QrScanContext, siteKey: string, userAction: USER_ACTIVITY_TYPE) {
        await this._router.navigate(["qrscanner"], {
            queryParams: {
                "context": qrContext,
                "siteKey": siteKey,
                "userAction": userAction
            }
        });
    }
}
