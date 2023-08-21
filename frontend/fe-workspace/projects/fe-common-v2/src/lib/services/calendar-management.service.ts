import { Injectable } from '@angular/core';
import { Site } from '../models/admin/site';
import { UserDailyActivity } from '../models/admin/user-daily-activity';
import { ACTIVITY_TYPE, Calendar, CalendarDay, CalendarEventDate, LunchItem, PersonEventData } from '../models/calendar';
import { CompanyJustification } from '../models/company';
import { Person } from '../models/person';
import { USER_BOOK_TYPE } from '../models/user-request-book';
import { ApiService, buildRequest } from './api';
import { BaseResponse } from './base-response';
import { USER_ACTIVITY_TYPE } from './user-action.service';

export class DailyPlanTimeFrameItem {
    id: string;
    action: ACTIVITY_TYPE;
    site: string;
    start: Date;
    end: Date;
    activityStartTime: Date;
    activityEndTime: Date;
    enableDelete: boolean;
    enableEdit: boolean;
    showAlert: boolean;
    alertInfo: string;
    isOverTime: boolean;
    eventData: PersonEventData;
}

export class DailyPlanTimeFrame {
    dateRef: Date;
    planSpaceAvailable: boolean;
    overtimeAvailable: boolean;
    startNewEventTimeFrame: string;     // hh:mm
    endNewEventTimeFrame: string;       // hh:mm
    isMissingLunch: boolean;
    planItems: DailyPlanTimeFrameItem[];
}

export class CalendarResponse extends BaseResponse {
    user: Person;
    calendar: Calendar;
    sites: Site[];
    lunchItems: LunchItem[];
    companyVacationsType: string[];
    companyActivityType: string[];
    companyJustificationTypes: CompanyJustification[];
    activities: UserDailyActivity[];
    dailyPlanTimeFrames: DailyPlanTimeFrame[];
}

export class UpdateCalendarResponse extends BaseResponse {
    calendarDay: CalendarDay;
}

@Injectable({
    providedIn: 'root'
})
export class CalendarManagementService {

    constructor(private apiService: ApiService) { }

    getUserCalendar(year: string, month: string): Promise<CalendarResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_CALENDAR,
            {
                ':year': year,
                ':month': month
            });
        return this.apiService.get<CalendarResponse>(url).toPromise();
    }

    getUserPlanData(year: string, month: string): Promise<CalendarResponse> {
        let url = buildRequest(this.apiService.API.BE.GET_USER_PLAN_DATA,
            {
                ':year': year,
                ':month': month
            });
        return this.apiService.get<CalendarResponse>(url).toPromise();
    }

    updateUserCalendar(calendarId: string, dateYYYYMMDD: string, calendarEventDate: CalendarEventDate[]): Promise<UpdateCalendarResponse> {
        let url = buildRequest(this.apiService.API.BE.UPDATE_CALENDAR,
            {
                ':calendarId': calendarId,
                ':date': dateYYYYMMDD
            });
        return this.apiService.post<UpdateCalendarResponse>(url, calendarEventDate).toPromise();
    }
}
