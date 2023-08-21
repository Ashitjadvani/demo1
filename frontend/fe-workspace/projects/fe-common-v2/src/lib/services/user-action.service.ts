import { Injectable } from '@angular/core';
import { USER_BOOK_TYPE } from '../models/user-request-book';
import { NotifyManagementService } from './notify-management.service';
import { User } from '../models/admin/user';
import { Site } from '../models/admin/site';
import { UserDailyActivity } from '../models/admin/user-daily-activity';
import { ApiService, buildRequest } from './api';
import { HomeData } from '../models/home-data';
import { ActionTile } from '../models/app';
import { UserCalendarData } from '../models/user-calendar-data';
import { AdminSiteManagementService } from './admin-site-management.service';
import { BaseResponse } from './base-response';

export class TrackUserActivityResult {
    result: boolean;
    message: string;
}

export class HomeDataResult {
    result: boolean;
    data: HomeData;
}

export class HomeTilesResult {
    result: boolean;
    homeTiles: ActionTile[];
}

export class UserCalendarDataResult {
    result: boolean;
    data: UserCalendarData;
}

export class UserOfficeActionResult {
    result: boolean;
    message: string;
}

export class UserDeskActionResult {
    result: boolean;
    message: string;
}

export class UserSmartworkingActionResult {
    result: boolean;
    message: string;
}

export enum USER_ACTIVITY_TYPE {
    SMARTWORK_IN = 'SmartworkIn',
    SMARTWORK_OUT = 'SmartworkOut',
    OFFICE_IN = 'OfficeIn',
    OFFICE_OUT = 'OfficeOut',
    DESK_CHECKIN = 'DeskCheckIn',
    DESK_CHECKOUT = 'DeskCheckOut',
    LUNCH_START = 'LunchStart',
    LUNCH_STOP = 'LunchStop',
    OVERTIME_START = 'OvertimeStart',
    OVERTIME_STOP = 'OvertimeStop',
    NOP = 'Nop',
    ALLDONE = 'AllDone'
};

export class UserHierarchyResult {
    result: boolean;
    data: {
        user: User;
        teamUsers: User[];
    } 
}

export class UserDepartmentResult {
    result: boolean;
    data: {
        user: User;
        departmentUsers: User[];
    } 
}

export class DepartmentUsersResult {
    result: boolean;
    departmentUsers: User[];
}

@Injectable({
    providedIn: 'root'
})
export class UserActionService {

    constructor(private apiService: ApiService,
        private notifyManagementService: NotifyManagementService,
        private siteManagementService: AdminSiteManagementService) {
    }

    trackUserPlanActivity(site: string, date: string, userActivityType: USER_ACTIVITY_TYPE) {
        let body = {
            site: site,
            date: date,
            userActivity: userActivityType
        };
        return this.apiService.post<any>(this.apiService.API.BE.TRACK_USER_PLAN_ACTIVITY, body).toPromise();
    }

    getUserDailyRequestPlan(site: string, userId: string) {
        let url = buildRequest(this.apiService.API.BE.GET_USER_REQUEST_BOOK,
            {
                ':site': site,
                ':id': userId
            });
        return this.apiService.get<any>(url).toPromise();
    }

    getUserDailyRequestPlanByDate(userId: string, date: string) {
        let url = buildRequest(this.apiService.API.BE.GET_USER_REQUEST_BOOK_BY_DATE,
            {
                ':id': userId,
                ':date': date
            });
        return this.apiService.get<any>(url).toPromise();
    }

    getUserDailyInfo(userId: string) {
        let url = buildRequest(this.apiService.API.BE.GET_USER_DAILY_INFO,
            {
                ':id': userId
            });
        return this.apiService.get<any>(url).toPromise();
    }

    getUserActivity(userId: string) {
        let url = buildRequest(this.apiService.API.BE.GET_USER_ACTIVITY,
            {
                ':id': userId
            });
        return this.apiService.get<any>(url).toPromise();
    }

    deleteUserActivity(id: string, date: string) {
        let url = buildRequest(this.apiService.API.BE.DELETE_USER_ACTIVITY,
            {
                ':id': id,
                ':date': date
            });
        return this.apiService.delete<any>(url).toPromise();
    }

    getUserActivityByDate(userId: string, date: string) {
        let url = buildRequest(this.apiService.API.BE.GET_USER_ACTIVITY_BY_DATE,
            {
                ':id': userId,
                ':date': date
            });
        return this.apiService.get<any>(url).toPromise();
    }

    trackUserActivity(userId: string, siteKey: string, activity: USER_ACTIVITY_TYPE, desk: string = null): Promise<TrackUserActivityResult> {
        let body = {
            id: userId,
            site: siteKey,
            activity: activity,
            desk: desk
        };
        return this.apiService.post<any>(this.apiService.API.BE.TRACK_USER_ACTIVITY, body).toPromise();
    }

    getUserAreas(siteKey: string) {
        let url = buildRequest(this.apiService.API.BE.GET_USER_AREAS,
            {
                ':siteKey': siteKey
            });
        return this.apiService.get<any>(url).toPromise();
    }

    getUserHomeData(userId: string): Promise<HomeDataResult> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_HOME_DATA,
            {
                ':userId': userId
            });
        return this.apiService.get<HomeDataResult>(url).toPromise();
    }   

    getUserHomeTiles(userId: string, lang: string = 'en'): Promise<HomeTilesResult> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_HOME_TILES,
            {
                ':userId': userId,
                ':lang': lang
            });
        return this.apiService.get<HomeTilesResult>(url).toPromise();
    }   

    getUserHierarchy(userId: string): Promise<UserHierarchyResult> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_HIERARCHY,
            {
                ':userId': userId
            });
        return this.apiService.get<UserHierarchyResult>(url).toPromise();
    }   

    getUserDepartment(userId: string): Promise<UserDepartmentResult> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_DEPARTMENT,
            {
                ':userId': userId
            });
        return this.apiService.get<UserDepartmentResult>(url).toPromise();
    }   

    getUserCalendarData(siteKey: string, userId: string, year: number, month: number): Promise<UserCalendarDataResult> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_CALENDAR_DATA,
            {
                ':siteKey': siteKey,
                ':userId': userId,
                ':year': year,
                ':month': month
            });
        return this.apiService.get<UserCalendarDataResult>(url).toPromise();
    }   

    deleteUserPlansByDateRange(siteKey: string, startDate: string, endDate: string): Promise<any> {
        let url = buildRequest(this.apiService.API.BE.DELETE_USER_PLANS_BY_DATE_RANGE,
            {
                ':siteKey': siteKey,
                ':startDate': startDate,
                ':endDate': endDate
            });
        return this.apiService.delete<any>(url).toPromise();
    }   

    getDepartmentUsers(departmentId: string): Promise<DepartmentUsersResult> {
        let url = buildRequest(this.apiService.API.BE.GET_DEPARTMENT_USERS,
            {
                ':departmentId': departmentId
            });
        return this.apiService.get<DepartmentUsersResult>(url).toPromise();
    }   

    userOfficeAction(siteKey: string): Promise<UserOfficeActionResult> {
        let url = buildRequest(this.apiService.API.BE.USER_ACTION_OFFICE,
            {
                ':siteKey': siteKey
            });
        return this.apiService.get<UserOfficeActionResult>(url).toPromise();
    }

    userDeskAction(deskId: string): Promise<UserDeskActionResult> {
        let url = buildRequest(this.apiService.API.BE.USER_ACTION_DESK,
            {
                ':deskId': deskId
            });
        return this.apiService.get<UserDeskActionResult>(url).toPromise();
    }   

    userSmartworkingAction(): Promise<UserSmartworkingActionResult> {
        return this.apiService.get<UserSmartworkingActionResult>(this.apiService.API.BE.USER_ACTION_SMARTWORKING).toPromise();
    }   

    userLunchAction(isStart: boolean): Promise<BaseResponse> {
        return this.apiService.get<BaseResponse>(this.apiService.API.BE.USER_ACTION_LUNCH).toPromise();
    }   

    userOvertimeAction(isStart: boolean): Promise<BaseResponse> {
        return this.apiService.get<BaseResponse>(this.apiService.API.BE.USER_ACTION_OVERTIME).toPromise();
    }   

    userLunchSettingsAction(dateYYYYMMDD: string, lunchDone: boolean, extraWorkDone: boolean, startTime: string, endTime: string): Promise<BaseResponse> {
        let body = {
            dateYYYYMMDD: dateYYYYMMDD,
            lunchDone: lunchDone,
            extraWorkDone: extraWorkDone,
            startTime: startTime,
            endTime: endTime
        }
        return this.apiService.post<BaseResponse>(this.apiService.API.BE.USER_ACTION_LUNCH_SETTINGS, body).toPromise();
    }   

    async getUserMainAction(siteKey, userName, dailyPlanType) {
        let res = await this.getUserActivity(userName);
        let siteRes = await this.siteManagementService.getSite(siteKey);
        if (res.result && siteRes.result) {
            if (dailyPlanType == USER_BOOK_TYPE.OFFICE_WORKING) {
                if (siteRes.site.deskAvalabilityFlag) {
                    /*
                    if ((res.userActivity == null) || (res.userActivity.officeInAt == null)) {
                        return USER_ACTIVITY_TYPE.OFFICE_IN;
                    } else if ((res.userActivity.officeInAt != null) && (res.userActivity.deskCheckInAt == null)) {
                        return USER_ACTIVITY_TYPE.DESK_CHECKIN;
                    } else if ((res.userActivity.officeInAt != null) && (res.userActivity.deskCheckInAt != null) && (res.userActivity.deskCheckOutAt == null)) {
                        return USER_ACTIVITY_TYPE.DESK_CHECKOUT;
                    } else if ((res.userActivity.officeInAt != null) && (res.userActivity.deskCheckInAt != null) && (res.userActivity.deskCheckOutAt != null) && (res.userActivity.officeOutAt == null)) {
                        return USER_ACTIVITY_TYPE.OFFICE_OUT;
                    }
                    */
                    if ((res.userActivity == null) || (res.userActivity.officeInAt == null)) {
                        return USER_ACTIVITY_TYPE.OFFICE_IN;
                    } else if ((res.userActivity.officeInAt != null) && (res.userActivity.deskCheckInAt == null)) {
                        return USER_ACTIVITY_TYPE.DESK_CHECKIN;
                    } else if ((res.userActivity.officeInAt != null) && (res.userActivity.deskCheckInAt != null) && (res.userActivity.officeOutAt == null)) {
                        return USER_ACTIVITY_TYPE.OFFICE_OUT;
                    }    
                } else {
                    if ((res.userActivity == null) || (res.userActivity.officeInAt == null)) {
                        return USER_ACTIVITY_TYPE.OFFICE_IN;
                    } else if ((res.userActivity.officeInAt != null) && (res.userActivity.officeOutAt == null)) {
                        return USER_ACTIVITY_TYPE.OFFICE_OUT;
                    }
                }
            } else if (dailyPlanType == USER_BOOK_TYPE.SMART_WORKING) {
                if ((res.userActivity == null) || (res.userActivity.smartWorkingInAt == null)) {
                    return USER_ACTIVITY_TYPE.SMARTWORK_IN;
                } else if ((res.userActivity.smartWorkingInAt != null) && (res.userActivity.smartWorkingOutAt == null)) {
                    return USER_ACTIVITY_TYPE.SMARTWORK_OUT;
                }
            }
        } else {
            return null;
        }
    }

    getUserMainActionOffline(dailyPlanType: USER_BOOK_TYPE, user: User, site: Site, userActivity: UserDailyActivity) {
        if (dailyPlanType == null)
            return null;

        if (dailyPlanType == USER_BOOK_TYPE.OFFICE_WORKING) {
            if (site.deskAvalabilityFlag) {
                /*
                if ((userActivity == null) || (userActivity.officeInAt == null)) {
                    return USER_ACTIVITY_TYPE.OFFICE_IN;
                } else if ((userActivity.officeInAt != null) && (userActivity.deskCheckInAt == null)) {
                    return USER_ACTIVITY_TYPE.DESK_CHECKIN;
                } else if ((userActivity.officeInAt != null) && (userActivity.deskCheckInAt != null) && (userActivity.deskCheckOutAt == null)) {
                    return USER_ACTIVITY_TYPE.DESK_CHECKOUT;
                } else if ((userActivity.officeInAt != null) && (userActivity.deskCheckInAt != null) && (userActivity.deskCheckOutAt != null) && (userActivity.officeOutAt == null)) {
                    return USER_ACTIVITY_TYPE.OFFICE_OUT;
                }
                */
                if ((userActivity == null) || (userActivity.officeInAt == null)) {
                    return USER_ACTIVITY_TYPE.OFFICE_IN;
                } else if ((userActivity.officeInAt != null) && (userActivity.deskCheckInAt == null)) {
                    return USER_ACTIVITY_TYPE.DESK_CHECKIN;
                } else if ((userActivity.officeInAt != null) && (userActivity.deskCheckInAt != null) && (userActivity.officeOutAt == null)) {
                    return USER_ACTIVITY_TYPE.OFFICE_OUT;
                }
            } else {
                if ((userActivity == null) || (userActivity.officeInAt == null)) {
                    return USER_ACTIVITY_TYPE.OFFICE_IN;
                } else if ((userActivity.officeInAt != null) && (userActivity.officeOutAt == null)) {
                    return USER_ACTIVITY_TYPE.OFFICE_OUT;
                }
            }
        } else if (dailyPlanType == USER_BOOK_TYPE.SMART_WORKING) {
            if ((userActivity == null) || (userActivity.smartWorkingInAt == null)) {
                return USER_ACTIVITY_TYPE.SMARTWORK_IN;
            } else if ((userActivity.smartWorkingInAt != null) && (userActivity.smartWorkingOutAt == null)) {
                return USER_ACTIVITY_TYPE.SMARTWORK_OUT;
            }
        }
    }

    async trackUserMainAction(userName, action, site, desk = null) {
        let title = '';
        let message = ''; //'Do you confirm your ' + action + ' action?';
        switch (action) {
            case USER_ACTIVITY_TYPE.OFFICE_IN: {
                title = 'Entering Office';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.OFFICE_OUT: {
                title = 'Exiting Office';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.SMARTWORK_IN: {
                title = 'Smart Working Start';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.SMARTWORK_OUT: {
                title = 'Smart Working End';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.DESK_CHECKIN: {
                title = 'Desk Booking';
                message = 'Do you confirm ?' + (desk ? '(' + desk + ')' : '');
                break;
            }
            case USER_ACTIVITY_TYPE.DESK_CHECKOUT: {
                title = 'Desk Check-Out';
                message = 'Do you confirm ?' + (desk ? '(' + desk + ')' : '');
                break;
            }
        }

        let result = await this.notifyManagementService.openConfirmDialog(title, message);
        if (result) {
            let res = await this.trackUserActivity(userName, site, action, desk);
            if (res.result) {
                if ((action == USER_ACTIVITY_TYPE.OFFICE_IN) || (action == USER_ACTIVITY_TYPE.DESK_CHECKIN))
                    this.notifyManagementService.displayWarnSnackBar('Enjoy you workday... :)');
                else
                    this.notifyManagementService.displayWarnSnackBar('Enjoy you day... :)');
            } else {
                this.notifyManagementService.displayWarnSnackBar('There is a problem saving your ' + action + '. Please retry later.');
            }
        }
        return result;
    }

    async trackUserMainActionNoMessage(userName, action, site, desk) {
        return await this.trackUserActivity(userName, site, action, desk);
    }

    async getUserTodayPlan(userName) {
        let res = await this.getUserDailyInfo(userName);
        if (res.result) {
            let userAndPlan = res.info.userAndPlan;
            if (userAndPlan && userAndPlan.userDailyPlan && (userAndPlan.userDailyPlan.length > 0)) {
                return userAndPlan.userDailyPlan[0];
            }
        }

        return null;
    }

    async showConfirmMessage(userAction:USER_ACTIVITY_TYPE, desk: string) {
        let title = '';
        let message = '';
        switch (userAction) {
            case USER_ACTIVITY_TYPE.OFFICE_IN: {
                title = 'Entering Office';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.OFFICE_OUT: {
                title = 'Exiting Office';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.SMARTWORK_IN: {
                title = 'Smart Working Start';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.SMARTWORK_OUT: {
                title = 'Smart Working End';
                message = 'Do you confirm ?';
                break;
            }
            case USER_ACTIVITY_TYPE.DESK_CHECKIN: {
                title = 'Desk Booking';
                message = 'Do you confirm ? ' + (desk ? '(' + desk + ')' : '');
                break;
            }
            case USER_ACTIVITY_TYPE.DESK_CHECKOUT: {
                title = 'Desk Check-Out';
                message = 'Do you confirm ? ' + (desk ? '(' + desk + ')' : '');
                break;
            }
        }

        return await this.notifyManagementService.openConfirmDialog(title, message);
    }  
}
