import { animate, state, style, transition, trigger } from '@angular/animations';
import { RtlScrollAxisType } from '@angular/cdk/platform';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Site, SITE_STATE } from 'projects/fe-common/src/lib/models/admin/site';
import { UserDailyActivity } from 'projects/fe-common/src/lib/models/admin/user-daily-activity';
import { ACTIVITY_TYPE, Calendar, CalendarDay, CalendarEventDate, LunchItem, PersonEventData, PersonPlanData } from 'projects/fe-common/src/lib/models/calendar';
import { CompanyJustification, JustificationApproval } from 'projects/fe-common/src/lib/models/company';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { USER_BOOK_TYPE } from 'projects/fe-common/src/lib/models/user-request-book';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CalendarManagementService, CalendarResponse, DailyPlanTimeFrame, DailyPlanTimeFrameItem } from 'projects/fe-common/src/lib/services/calendar-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { CoreService } from 'projects/fe-common/src/lib/services/core.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserActionService, USER_ACTIVITY_TYPE } from 'projects/fe-common/src/lib/services/user-action.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { UserActivityLogDialogComponent } from '../../dialogs/user-activity-log-dialog/user-activity-log-dialog.component';
import { CalendarPlanEditorDialogComponent, CalendarPlanEditorDialogData, CalendarPlanEditorDialogResult } from './calendar-plan-editor-dialog/calendar-plan-editor-dialog.component';
import { RequestNoteDialogComponent } from '../../components/request-tile/note-dialog/note-dialog.component'

import { Request, REQUEST_STATE, REQUEST_TYPE } from 'projects/fe-common/src/lib/models/requests';
import { RequestManagementService } from 'projects/fe-common/src/lib/services/request-management.service';
import { ConfirmLunchSettingResult } from '../../components/lunch-settings/lunch-settings.component';

@Component({
    selector: 'app-user-calendar-page',
    templateUrl: './user-calendar-page.component.html',
    styleUrls: ['./user-calendar-page.component.scss'],
    animations: [
        trigger('slideInOutH', [
            state('in', style({
                overflow: 'hidden',
                width: '40px'
            })),
            state('out', style({
                opacity: '0',
                overflow: 'hidden',
                width: '0px'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
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
export class UserCalendarPageComponent implements OnInit {
    @ViewChild(MatCalendar, { static: true }) calendar: MatCalendar<Date>;
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;

    activityTypeColors = [
        { key: ACTIVITY_TYPE.OFFICE, color: '#14aab9' },
        { key: ACTIVITY_TYPE.SMARTWORKING, color: '#9d00ff4f' },
        { key: ACTIVITY_TYPE.BUSINESS_TRIP, color: 'aquamarine' },
        { key: ACTIVITY_TYPE.NO_WORKING, color: '#007bb9' }
    ];

    activityTypeMap = [];

    datePipe: DatePipe = new DatePipe('it-IT');

    actionDrawer: string = "out";
    paramDrawer: string = "out";
    lunchQuestionDrawer: string = 'out';

    currAccount: Person;
    calendarResponse: CalendarResponse;

    sites: Site[] = [];
    activityTypeDatas: PersonPlanData[] = [];
    companyJustificationTypes: CompanyJustification[] = [];

    calendarDateClassCallback: Function;
    selectedCalendarDay: CalendarDay = new CalendarDay(new Date());
    selectedDayPlanTimeFrame: DailyPlanTimeFrame;
    selectedDayPlanItems: DailyPlanTimeFrameItem[] = [];

    userRequests: Request[] = [];
    newRequest: Request;

    // day event data
    defaultEventSite: Site;
    defaultEventActivityTypeData: PersonPlanData;

    /*eventTimeFrame: Date[] = [
        this._common.buildDateTimeFromHHMM(new Date(), '9:00'),
        this._common.buildDateTimeFromHHMM(new Date(), '18:00')
    ];*/
    eventTimeFrame: string[] = [
        '09:00',
        '18:00'
    ];

    currentLunchItem: LunchItem = null;
    currentActivity: UserDailyActivity = null;
    currentPerson: Person = Person.Empty();
    onlyOvertimeActivities = [];

    ALLOW_PAST_EVENT_UPDATE: boolean = false;

    constructor(private _common: CommonService,
        private _coreApiService: CoreService,
        private _router: Router,
        private _dialog: MatDialog,
        private _adminUserManagementService: AdminUserManagementService,
        private _calendarManagement: CalendarManagementService,
        private _userManagementService: UserManagementService,
        private _notifyManagementService: NotifyManagementService,
        private requestManagementService: RequestManagementService,
        private _userActionService: UserActionService,
        public translate: TranslateService
    ) {
        this.calendarDateClassCallback = this.calendarDateClass.bind(this);
    }

    async ngOnInit() {
        this.activityTypeMap = [
            { key: ACTIVITY_TYPE.OFFICE, value: this.translate.instant('APP_PEOPLE_PAGE.Office') },
            { key: ACTIVITY_TYPE.SMARTWORKING, value: this.translate.instant('APP_PEOPLE_PAGE.Smart Working') },
            { key: ACTIVITY_TYPE.BUSINESS_TRIP, value: this.translate.instant('APP_PEOPLE_PAGE.Business Trip') }
        ];
        this.currAccount = this._userManagementService.getAccount();
        setTimeout(() => {
            const prev = document.querySelector('.mat-calendar-previous-button');
            const next = document.querySelector('.mat-calendar-next-button');
            prev.addEventListener('click', async () => { // Previous Button
                console.log('Prev ', this.calendar.activeDate);
                await this.reloadAllData(this.calendar.activeDate);
            });
            next.addEventListener('click', async () => { // Next Button
                console.log('Next', this.calendar.activeDate);
                await this.reloadAllData(this.calendar.activeDate);
            });
        }, 150);

        await this.reloadAllData(new Date());
    }

    onToggleParamDrawer() {
        this.paramDrawer = this.paramDrawer == 'out' ? 'in' : 'out';
    }

    onToggleActionDrawer(event: DailyPlanTimeFrameItem) {
        if (event.enableEdit || event.enableDelete || this.ALLOW_PAST_EVENT_UPDATE)
            this.actionDrawer = this.actionDrawer == 'out' ? 'in' : 'out';
    }

    async reloadAllData(currentDate: Date) {
        let calendarDate = this.calendar.activeDate ?? new Date();
        this.userRequests = await this.requestManagementService.getAllRequestsByUser(this.currAccount.id);
        let res = await this._calendarManagement.getUserPlanData(calendarDate.getFullYear().toString(), (calendarDate.getMonth() + 1).toString());
        if (this._common.isValidResponse(res)) {
            console.log('user calendar result: ', res);
            this.calendarResponse = res;
            this.sites = this.calendarResponse.sites;
            this.activityTypeDatas = this.getActivityTypes();
            this.companyJustificationTypes = this.getCompanyJustificationTypes();
            this.currentPerson = this.calendarResponse.user;

            this.defaultEventSite = this.sites.find(s => s.id == this.calendarResponse.user.site);
            this.defaultEventActivityTypeData = this.activityTypeDatas[0];

            if (this.calendarResponse.user.workingHours[0])
                this.eventTimeFrame[0] = this._common.toHHMM(this.calendarResponse.user.workingHours[0]);

            if (this.calendarResponse.user.workingHours[3])
                this.eventTimeFrame[1] = this._common.toHHMM(this.calendarResponse.user.workingHours[3]);

            this.calendar.updateTodaysDate();

            this.onlyOvertimeActivities = this.activityTypeDatas.filter(at => {
                let justificationType = this.companyJustificationTypes.find(jt => jt.name == at.activityLabel);
                return justificationType ? justificationType.scheduleAbilitation : false;
            });

            this.onDateSelectedChange(currentDate || new Date());
        } else {
            this._notifyManagementService.openMessageDialog(this.translate.instant('APP_PEOPLE_PAGE.ATTENTION'), 'Server error: ' + res.reason);
        }
    }

    async onShowActivityLog() {
        await this._dialog.open(UserActivityLogDialogComponent, {
            width: '300px',
            panelClass: 'custom-dialog-container',
            data: this.currentActivity
        }).afterClosed().toPromise();
    }

    calendarDateClass(date: Date) {
        if (this.calendarResponse && this.calendarResponse.calendar) {
            try {
                let siteClassStyle = '';
                let userClassStyle = '';
                let firstDatePlan = this.getFirstDayPlanItem(date);
                if (firstDatePlan) {
                    siteClassStyle = this.getCalendarSiteDayStyleClass(firstDatePlan.site);
                    userClassStyle = this.getCalendarUserDayStyleClass(date, firstDatePlan.eventData)
                } else {
                    siteClassStyle = this.getCalendarSiteDayStyleClass(null);
                }
                let currentDayStyle = '';
                if (this._common.compareOnlyDate(new Date(), date)) {
                    currentDayStyle = ' current-day';
                }
                let resultStyle = (userClassStyle ? siteClassStyle + ' ' + userClassStyle : siteClassStyle) + currentDayStyle;

                if (this.isMissingLunchDay(date))
                    resultStyle = resultStyle + ' missing-lunch';

                return resultStyle;
            } catch (ex) {
                console.log('date class ex: ', date);
            }
        }
    }

    getActivityTypes() {
        let result = [];
        result = this.calendarResponse.companyActivityType.filter(at => this.activityTypeMap.find(am => am.key == at)).map(at => {
            return {
                activityType: at,
                activityDetail: null,
                activityLabel: this.activityTypeMap.find(am => am.key == at).value,
                activityEventType: ''
            }
        });
        let justificatives = new Array();
        for (let justificative of this.calendarResponse.companyJustificationTypes) {
            if (justificative.enable) justificatives.push(justificative);
        }
        return result.concat(justificatives.map(jt => {
            return {
                activityType: ACTIVITY_TYPE.NO_WORKING,
                activityDetail: jt.name,
                activityLabel: jt.name,
                activityEventType: jt.eventType
            }
        }));
    }

    getCompanyJustificationTypes() {
        return this.calendarResponse.companyJustificationTypes;
    }

    getCalendarUserDayStyleClass(dateRef, personEventData: PersonEventData) {
        switch (personEventData.plan.activityType) {
            case ACTIVITY_TYPE.OFFICE:
                return 'office-date';

            case ACTIVITY_TYPE.SMARTWORKING:
                return 'smartworking-date';

            case ACTIVITY_TYPE.BUSINESS_TRIP:
                return 'vacation-date';

            default: {
                let reqState = this.checkRequestState(dateRef, personEventData.plan.activityDetail);
                switch (reqState) {
                    case REQUEST_STATE.INITIALIZED: return 'notworking-date';
                    case REQUEST_STATE.PENDING: return 'notworking-date';
                    //case REQUEST_STATE.ACCEPTED: return 'notworking-accepted-date';
                    //case REQUEST_STATE.REJECTED: return 'notworking-rejected-date';
                    default: return 'notworking-date';
                }
            }
        }
    }

    getCalendarSiteDayStyleClass(siteKey: string) {
        let userSite;
        if (siteKey)
            userSite = this.sites.find(s => s.key == siteKey);
        else
            userSite = this.sites.find(s => s.id == this.calendarResponse.user.site);
        switch (userSite.globalStatus) {
            case SITE_STATE.FREE:
                return 'site-free';

            case SITE_STATE.RESTRICTED_MODE:
                return 'site-restricted';

            case SITE_STATE.MAINTENANCE:
                return 'site-maintenance';

            case SITE_STATE.CLOSED:
                return 'site-closed';
        }
    }

    getCalendarDayTitle() {
        try {
            return this.datePipe.transform(this.selectedCalendarDay.dateRef, 'd MMMM y');
        } catch (ex) {
            return '';
        }
    }

    isMissingLunchDay(dateRef) {
        let currDayPlan = this.calendarResponse.dailyPlanTimeFrames ?
            this.calendarResponse.dailyPlanTimeFrames.find(ev => this._common.compareOnlyDate(ev.dateRef, dateRef)) :
            null;

        return currDayPlan.isMissingLunch;
    }

    getActivityRequestState(event: CalendarEventDate) {
        if (event.eventData.plan.activityType == ACTIVITY_TYPE.NO_WORKING) {
            let reqState = this.checkRequestStateInTime(event.start, event.end, event.eventData.plan.activityDetail);
            return reqState;
        }
    }

    getActivityLastActionName(event: CalendarEventDate) {
        if (event.eventData.plan.activityType == ACTIVITY_TYPE.NO_WORKING) {
            let lastActionName = this.checkLastActionNameInTime(event.start, event.end, event.eventData.plan.activityDetail);
            return lastActionName;
        }
    }

    getActivityLastActionDate(event: CalendarEventDate) {
        if (event.eventData.plan.activityType == ACTIVITY_TYPE.NO_WORKING) {
            let lastActionDate = this.checkLastActionDateInTime(event.start, event.end, event.eventData.plan.activityDetail);
            return lastActionDate;
        }
    }

    getActivityTypeColor(event: DailyPlanTimeFrameItem) {
        let activityColorType = this.activityTypeColors.find(a => a.key == event.action);

        if (activityColorType)
            return activityColorType.color;

        return '#bbbbbb';
    }

    getActivityTypeHeight(event: DailyPlanTimeFrameItem) {
        let hoursSpan = 9 * 60;
        let minDiff = this._common.dateDiffInMinutes(event.end, event.start);
        let percent = this._common.calcPercentFromTotal(hoursSpan, minDiff);
        let heightPx = 120; // this._common.calcPercent(800, percent);
        return heightPx + "px";
    }

    getEventActivityTime(event: DailyPlanTimeFrameItem, isStartTime: boolean) {
        if (isStartTime)
            return event.activityStartTime;
        else
            return event.activityEndTime;
    }

    getActivityTypeTitle(event: DailyPlanTimeFrameItem) {
        if (event.isOverTime)
            return '';
        else
            return event.action;
    }

    getActivityType(event: DailyPlanTimeFrameItem) {
        return event.action;
    }

    getActivityTypeDetails(event: DailyPlanTimeFrameItem) {
        if (event.eventData.plan.activityType == ACTIVITY_TYPE.OFFICE) {
            return event.site;
        } else if (event.eventData.plan.activityType == ACTIVITY_TYPE.NO_WORKING) {
            return event.eventData.plan.activityDetail;
        }
    }

    showDeleteEvent(event: DailyPlanTimeFrameItem) {
        if(this.actionDrawer=="out") return false;
        return event.enableDelete; // !this._common.isDateExpired(this.selectedCalendarDay.dateRef);
    }

    showEditEvent(event: DailyPlanTimeFrameItem) {
        if(this.actionDrawer=="out") return false;
        return event.enableEdit || this.ALLOW_PAST_EVENT_UPDATE; // !this._common.isDateExpired(this.selectedCalendarDay.dateRef); // && !this.isCurrentEventExpired(calendarEvent); 
    }

    showCalendarTimeWarning(event: DailyPlanTimeFrameItem) {
        return event.showAlert;
    }

    getFirstDayPlanItem(date): DailyPlanTimeFrameItem {
        if (!this.calendarResponse)
            return null;

        let dayPlanTimeFrame = this.calendarResponse.dailyPlanTimeFrames ?
            this.calendarResponse.dailyPlanTimeFrames.find(ev => this._common.compareOnlyDate(ev.dateRef, date)) :
            null;

        return dayPlanTimeFrame ? this._common.firstOrDefault(dayPlanTimeFrame.planItems) : null;

    }

    getDateEvents(date: Date) {
        return this.calendarResponse.calendar.days.find(ev => this._common.compareOnlyDate(ev.dateRef, date));
    }

    async onDateSelectedChange(date: Date) {
        this.selectedCalendarDay = this.getDateEvents(date) || new CalendarDay(date);

        console.log('selected date: ', date, this.selectedCalendarDay);

        this.actionDrawer = 'out';

        this.selectedCalendarDay.events = this.selectedCalendarDay.events.map(e => {
            return {
                id: e.id,
                start: new Date(e.start),
                end: new Date(e.end),
                eventData: e.eventData
            }
        });

        this.currentActivity = this.calendarResponse.activities.find(ua => ua.date == this._common.toYYYYMMDD(this.selectedCalendarDay.dateRef));
        this.currentLunchItem = this.calendarResponse.lunchItems.find(lt => {
            let lunchDate = new Date(lt.dateRef);
            return this._common.compareOnlyDate(lunchDate, date);
        });

        this.selectedDayPlanTimeFrame = this.calendarResponse.dailyPlanTimeFrames ?
            this.calendarResponse.dailyPlanTimeFrames.find(ev => this._common.compareOnlyDate(ev.dateRef, date)) :
            null;

        if (this.selectedDayPlanTimeFrame == null) {
            this.selectedDayPlanItems = [];
            this.showLunchSettings(false);
        } else {
            this.showLunchSettings(this.selectedDayPlanTimeFrame.isMissingLunch);
            this.selectedDayPlanItems = this.selectedDayPlanTimeFrame.planItems.map(pi => {
                // translate date string (from BE) in Date object...
                pi.start = new Date(pi.start);
                pi.end = new Date(pi.end);
                pi.activityStartTime = pi.activityStartTime ? new Date(pi.activityStartTime) : null;
                pi.activityEndTime = pi.activityEndTime ? new Date(pi.activityEndTime) : null;

                return pi;
            });
        }

        this.updateNewEventTimeFrames();
    }

    onChangeDay(delta: number) {
        let selectedDate = new Date(this.selectedCalendarDay.dateRef);
        let newDate = this._common.dateHoursOffset(selectedDate, 24 * delta);

        this.onDateSelectedChange(newDate);
    }

    isAddPlanEnabled() {
        try {
            return this.selectedDayPlanTimeFrame.planSpaceAvailable;
        } catch (ex) {

        }
        return false;
    }

    isOvertimeAvailable() {
        try {
            return this.selectedDayPlanTimeFrame.overtimeAvailable;
        } catch (ex) {

        }
        return false;
    }
    
    isPastPlanAvailable() {
        try {
            let selectedDayDate = new Date(this.selectedDayPlanTimeFrame.dateRef);
            let todayDate = new Date();
            return ((selectedDayDate < todayDate) && (selectedDayDate.getDate() != todayDate.getDate()));
        } catch (ex) {

        }
        return false;
    }

    updateUserCalendarEvents(calendarItem: DailyPlanTimeFrameItem, add: boolean): CalendarEventDate[] {
        if (add) {
            this.selectedCalendarDay.events.push({
                id: calendarItem.id,
                start: calendarItem.start,
                end: calendarItem.end,
                eventData: calendarItem.eventData
            });
        } else {
            this.selectedCalendarDay.events = this.selectedCalendarDay.events.filter(e => e.id != calendarItem.id);
        }
        return this.selectedCalendarDay.events;
    }

    async repeatPlan(dayRepeatCount: number, events: CalendarEventDate[]) {
        let dayIndex = 0;
        let currentDay = new Date(this.selectedCalendarDay.dateRef);
        while (dayIndex < dayRepeatCount) {
            if ((currentDay.getDay() != 0) && (currentDay.getDay() != 6)) { // exclude WE
                let currentDayYYYYMMDD = this._common.toYYYYMMDD(currentDay);

                console.log('addMultipleEvents: ', currentDayYYYYMMDD);

                let res = await this._calendarManagement.updateUserCalendar(this.calendarResponse.calendar.id, currentDayYYYYMMDD, events);

                dayIndex++;
            }
            currentDay.setDate(currentDay.getDate() + 1);
        }
        this.reloadAllData(currentDay);
    }

    async onCreateEvent(isOvertime: boolean) {
        if (isOvertime) {
            if (this.calendarResponse.user.workingHours[0])
                this.eventTimeFrame[0] = this._common.toHHMM(this.calendarResponse.user.workingHours[0]);

            if (this.calendarResponse.user.workingHours[3])
                this.eventTimeFrame[1] = this._common.toHHMM(this.calendarResponse.user.workingHours[3]);

            if (this.onlyOvertimeActivities.length > 0) this.defaultEventActivityTypeData = this.onlyOvertimeActivities[0];
        }
        let dialogRespose: CalendarPlanEditorDialogResult = await this._dialog.open(CalendarPlanEditorDialogComponent, {
            width: '300px',
            panelClass: 'custom-dialog-container',
            data: {
                date: this.selectedCalendarDay.dateRef,
                eventSite: this.defaultEventSite,
                sites: this.sites,
                eventTimeFrame: [
                    this.eventTimeFrame[0],
                    this.eventTimeFrame[1]
                ],
                eventActivityTypeData: this.defaultEventActivityTypeData,
                activityTypeDatas: this.activityTypeDatas,
                companyJustificationTypes: this.companyJustificationTypes,
                events: this.selectedCalendarDay.events,
                plan: ACTIVITY_TYPE.OFFICE,
                isModify: false,
                isOvertime: isOvertime
            }
        }).afterClosed().toPromise();
        if (dialogRespose) {
            console.log(dialogRespose.calendarPlanItem);

            let events = this.updateUserCalendarEvents(dialogRespose.calendarPlanItem, true);
            if (dialogRespose.calendarPlanItem.eventData.plan.activityType == ACTIVITY_TYPE.NO_WORKING) {
                await this.sendRequest(dialogRespose.calendarPlanItem.eventData.plan.activityLabel,
                    dialogRespose.dayRepeatCount,
                    dialogRespose.calendarPlanItem.start,
                    dialogRespose.calendarPlanItem.end,
                    this.selectedCalendarDay.dateRef);
            }
            if (dialogRespose.dayRepeatCount > 1) {
                this.repeatPlan(dialogRespose.dayRepeatCount, events);
            } else {
                console.log('events: ', events);

                let dateYYYYMMDD = this._common.toYYYYMMDD(this.selectedCalendarDay.dateRef);
                let res = await this._calendarManagement.updateUserCalendar(this.calendarResponse.calendar.id, dateYYYYMMDD, events);
                if (!this._common.isValidResponse(res)) {
                    // TODO SHOW ERROR
                } else {
                    console.log('add event: ', res);
                    await this.reloadAllData(this.selectedCalendarDay.dateRef);
                }
            }
        }

    }

    async sendRequest(justificative: string, repeatCount: number, start: Date, end: Date, date_rec: Date) {

        let date = new Date(date_rec);
        this.newRequest = Request.Empty();
        this.newRequest.justificative = justificative;
        this.newRequest.userId = this.currAccount.id;
        this.newRequest.userName = this.currAccount.name;
        this.newRequest.userSurname = this.currAccount.surname;
        if (repeatCount > 1) {
            let dateTimeStart = new Date(start);
            dateTimeStart.setMonth(date.getMonth());
            dateTimeStart.setFullYear(date.getFullYear());
            dateTimeStart.setDate(date.getDate());
            let dateTimeEnd = new Date(end);
            dateTimeEnd.setMonth(date.getMonth());
            dateTimeEnd.setFullYear(date.getFullYear());
            let temp = new Date(date);
            let count = 0;
            for (let i = 1; i < repeatCount; i++) {
                temp.setDate(temp.getDate() + 1);
                if (temp.getDay() == 0 || temp.getDay() == 6) {
                    count++;
                    i--;
                }
                else count++;
            }
            dateTimeEnd.setDate(date.getDate() + count);
            this.newRequest.dateTimeStart = dateTimeStart;
            this.newRequest.dateTimeEnd = dateTimeEnd;
        }
        else {
            let dateTimeStart = new Date(start);
            dateTimeStart.setMonth(date.getMonth());
            dateTimeStart.setFullYear(date.getFullYear());
            dateTimeStart.setDate(date.getDate());
            let dateTimeEnd = new Date(end);
            dateTimeEnd.setMonth(date.getMonth());
            dateTimeEnd.setFullYear(date.getFullYear());
            dateTimeEnd.setDate(date.getDate());
            this.newRequest.dateTimeStart = dateTimeStart;
            this.newRequest.dateTimeEnd = dateTimeEnd;
        }
        await this.requestManagementService.addOrUpdateRequest(this.newRequest);
    }

    async onEditEvent(calendarItem: DailyPlanTimeFrameItem) {

        console.log('onEditEvent: ', calendarItem);
        let eventSite = this.sites.find(s => s.key == calendarItem.eventData.site);
        if (!eventSite) {
            eventSite = this.sites.find(s => s.id == this.calendarResponse.user.site);
        }

        let dialogRespose: CalendarPlanEditorDialogResult = await this._dialog.open(CalendarPlanEditorDialogComponent, {
            width: '300px',
            panelClass: 'custom-dialog-container',
            data: {
                date: this.selectedCalendarDay.dateRef,
                eventSite: eventSite,
                sites: this.sites,
                eventTimeFrame: [
                    this._common.toHHMM(calendarItem.start),
                    this._common.toHHMM(calendarItem.end)
                ],
                eventActivityTypeData: this.activityTypeDatas.find(ev => ev.activityType == calendarItem.eventData.plan.activityType),
                activityTypeDatas: this.activityTypeDatas,
                companyJustificationTypes: this.companyJustificationTypes,
                events: this.selectedCalendarDay.events,
                plan: calendarItem.eventData.plan.activityType,
                isModify: true,
                isOvertime: this.ALLOW_PAST_EVENT_UPDATE ? false : calendarItem.isOverTime,
                modifyOnlyEndTime: (calendarItem.activityStartTime != null)
            }
        }).afterClosed().toPromise();
        if (dialogRespose) {
            // remove old event
            this.updateUserCalendarEvents(calendarItem, false);

            // add modified event
            let events = this.updateUserCalendarEvents(dialogRespose.calendarPlanItem, true);

            console.log('events: ', events);

            let dateYYYYMMDD = this._common.toYYYYMMDD(this.selectedCalendarDay.dateRef);
            let res = await this._calendarManagement.updateUserCalendar(this.calendarResponse.calendar.id, dateYYYYMMDD, events);
            if (!this._common.isValidResponse(res)) {
                // TODO SHOW ERROR
            } else {
                console.log('add event: ', res);
                await this.reloadAllData(this.selectedCalendarDay.dateRef);
            }
        }
    }

    async onRemoveEvent(calendarItem: DailyPlanTimeFrameItem) {
        let res = await this._notifyManagementService.openConfirmDialog(this.translate.instant('APP_PEOPLE_PAGE.ATTENTION'), this.translate.instant('APP_PEOPLE_PAGE.Are you sure you want to cancel this schedule'));
        if (res) {
            let events = this.updateUserCalendarEvents(calendarItem, false);

            console.log('events: ', events);

            let dateYYYYMMDD = this._common.toYYYYMMDD(this.selectedCalendarDay.dateRef);
            res = await this._calendarManagement.updateUserCalendar(this.calendarResponse.calendar.id, dateYYYYMMDD, events);
            if (!this._common.isValidResponse(res)) {
                // TODO SHOW ERROR
            } else {
                console.log('remove event: ', res);
                await this.reloadAllData(this.selectedCalendarDay.dateRef);
            }
        } else {
            console.error(res);
        }
    }

    onBack() {
        this._router.navigate(['home']);
    }

    async onQrScanEvent() {
        await this.reloadAllData(this.selectedCalendarDay.dateRef);
    }


    async getUserRequests() {
        let requests = this.requestManagementService.getAllRequestsByUser(this.currAccount.id);
        return requests;
    }


    checkRequestState(dateRef: Date, activityDetail: string) {
        dateRef = new Date(dateRef);
        let dateStart = new Date();

        for (let req of this.userRequests) {
            dateStart = new Date(req.dateTimeStart);
            if (this._common.compareOnlyDate(dateStart, dateRef) && activityDetail == req.justificative) {
                return req.requestState;
            }
        }
    }

    checkRequestStateInTime(timeRefStart: Date, timeRefEnd: Date, activityDetail: string) {
        try {
            timeRefStart = new Date(timeRefStart);
            timeRefEnd = new Date(timeRefEnd);
            let dateRef = new Date(this.selectedCalendarDay.dateRef);
            let dateStart = new Date();
            let dateEnd = new Date();

            for (let req of this.userRequests) {
                dateStart = new Date(req.dateTimeStart);
                dateEnd = new Date(req.dateTimeEnd);
                if (this._common.dateIsInTimeFrameOnlyData(dateRef, dateStart, dateEnd) &&
                    (this._common.compareOnlyTime(dateStart, timeRefStart) == 0) &&
                    (this._common.compareOnlyTime(dateEnd, timeRefEnd) == 0) &&
                    activityDetail == req.justificative) {
                    return req.requestState;
                }
            }
        } catch (ex) {

        }
    }

    checkLastActionNameInTime(timeRefStart: Date, timeRefEnd: Date, activityDetail: string) {

        try {
            timeRefStart = new Date(timeRefStart);
            timeRefEnd = new Date(timeRefEnd);
            let dateRef = new Date(this.selectedCalendarDay.dateRef);
            let dateStart = new Date();
            let dateEnd = new Date();

            for (let req of this.userRequests) {
                dateStart = new Date(req.dateTimeStart);
                dateEnd = new Date(req.dateTimeEnd);
                if (this._common.dateIsInTimeFrameOnlyData(dateRef, dateStart, dateEnd) &&
                    (this._common.compareOnlyTime(dateStart, timeRefStart) == 0) &&
                    (this._common.compareOnlyTime(dateEnd, timeRefEnd) == 0) &&
                    activityDetail == req.justificative) {
                    return req.lastActionName;
                }
            }
        } catch (ex) {

        }
    }

    checkLastActionDateInTime(timeRefStart: Date, timeRefEnd: Date, activityDetail: string) {
        try {
            timeRefStart = new Date(timeRefStart);
            timeRefEnd = new Date(timeRefEnd);
            let dateRef = new Date(this.selectedCalendarDay.dateRef);
            let dateStart = new Date();
            let dateEnd = new Date();
            let dateReaded = new Date();

            for (let req of this.userRequests) {
                dateStart = new Date(req.dateTimeStart);
                dateEnd = new Date(req.dateTimeEnd);
                if (this._common.dateIsInTimeFrameOnlyData(dateRef, dateStart, dateEnd) &&
                    (this._common.compareOnlyTime(dateStart, timeRefStart) == 0) &&
                    (this._common.compareOnlyTime(dateEnd, timeRefEnd) == 0) &&
                    activityDetail == req.justificative) {
                    if (req.lastActionDate) {
                        dateReaded = new Date(req.lastActionDate);
                        return this._common.toDDMMYYYY(req.lastActionDate) + " " + this._common.toHHMM(req.lastActionDate);
                    }
                    return "";
                }
            }
        } catch (ex) {

        }
    }

    async onRefreshPage() {
        await this.reloadAllData(this.selectedCalendarDay.dateRef);
    }

    getCalendarWarningInfo(event: DailyPlanTimeFrameItem) {
        if (event.alertInfo)
            return event.alertInfo;
        return '';
    }

    updateNewEventTimeFrames() {
        this.eventTimeFrame[0] = this.selectedDayPlanTimeFrame.startNewEventTimeFrame;
        this.eventTimeFrame[1] = this.selectedDayPlanTimeFrame.endNewEventTimeFrame;
    }

    async onNotes(event) {
        try {
            let timeRefStart = new Date(event.start);
            let timeRefEnd = new Date(event.end);
            let dateRef = new Date(this.selectedCalendarDay.dateRef);
            let activityDetail = event.eventData.plan.activityDetail;
            let request = null;

            for (let req of this.userRequests) {
                let dateStart = new Date(req.dateTimeStart);
                let dateEnd = new Date(req.dateTimeEnd);
                if (this._common.dateIsInTimeFrameOnlyData(dateRef, dateStart, dateEnd) &&
                    (this._common.compareOnlyTime(dateStart, timeRefStart) == 0) &&
                    (this._common.compareOnlyTime(dateEnd, timeRefEnd) == 0) &&
                    activityDetail == req.justificative) {
                    request = req;
                    break;
                }
            }

            if (request) {
                let dialogRespose = await this._dialog.open(RequestNoteDialogComponent, {
                    width: '300px',
                    panelClass: 'custom-dialog-container',
                    data: {
                        request: request,
                        currentUser: this.currAccount
                    }
                }).afterClosed().toPromise();
            }

        } catch (ex) {
            console.log(ex)
        }
        /*
        let dialogRespose = await this._dialog.open(RequestNoteDialogComponent, {
            width: '300px',
            panelClass: 'custom-dialog-container',
            data: {
                request: this.request,
                currentUser: this.currentUser
            }
        }).afterClosed().toPromise();*/
    }

    showLunchSettings(show: boolean) {
        this.lunchQuestionDrawer = show ? 'in' : 'out';
    }

    async onLunchSettings(lunchSettingsResult: ConfirmLunchSettingResult) {
        this.lunchQuestionDrawer = 'out';
        console.log('lunchSettingsResult: ', lunchSettingsResult, this.selectedCalendarDay);
        let dateYYYYMMDD = this._common.toYYYYMMDD(this.selectedCalendarDay.dateRef);

        let res = await this._userActionService.userLunchSettingsAction(dateYYYYMMDD, lunchSettingsResult.lunchDone, lunchSettingsResult.extraWorkDone, lunchSettingsResult.startTime, lunchSettingsResult.endTime);
        if (!this._common.isValidResponse(res)) {
            // TODO SHOW ERROR
        } else {
            console.log('remove event: ', res);
            await this.reloadAllData(this.selectedCalendarDay.dateRef);
        }
    }
}
