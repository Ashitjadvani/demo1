import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { ACTIVITY_TYPE, CalendarDay, CalendarEventDate, PersonEventData, PersonPlanData } from 'projects/fe-common/src/lib/models/calendar';
import { DailyPlanTimeFrameItem } from 'projects/fe-common/src/lib/services/calendar-management.service';
import { CompanyJustification, EVENT_TYPE } from 'projects/fe-common/src/lib/models/company';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

export class CalendarPlanEditorDialogData {
    date: Date;
    eventSite: Site;
    sites: Site[];
    eventTimeFrame: string[];
    eventActivityTypeData: PersonPlanData;
    activityTypeDatas: PersonPlanData[];
    events: CalendarEventDate[];
    plan: ACTIVITY_TYPE;
    isModify: boolean;
    modifyOnlyEndTime: boolean;
    companyJustificationTypes: CompanyJustification[];
    isOvertime: boolean;
}

export class CalendarPlanEditorDialogResult {
    dayRepeatCount: number;
    calendarPlanItem: DailyPlanTimeFrameItem;

    constructor() {
        this.dayRepeatCount = 1;
        this.calendarPlanItem = null;
    }
}

@Component({
    selector: 'app-calendar-plan-editor-dialog',
    templateUrl: './calendar-plan-editor-dialog.component.html',
    styleUrls: ['./calendar-plan-editor-dialog.component.scss']
})
export class CalendarPlanEditorDialogComponent implements OnInit {
    calendarPlanEditorDialogData: CalendarPlanEditorDialogData;
    calendarPlanEditorDialogResult: CalendarPlanEditorDialogResult = new CalendarPlanEditorDialogResult();

    newEventTime: string[] = [];

    constructor(private _common: CommonService,
        private _notifyManagementService: NotifyManagementService,
        private _userManagementService: UserManagementService,
        public translate: TranslateService,
        public dialogRef: MatDialogRef<CalendarPlanEditorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: CalendarPlanEditorDialogData) {

        this.calendarPlanEditorDialogData = data;
        this.newEventTime[0] = this.calendarPlanEditorDialogData.eventTimeFrame[0];
        this.newEventTime[1] = this.calendarPlanEditorDialogData.eventTimeFrame[1];
    }

    ngOnInit() {

    }

    onCancelClick() {
        this.dialogRef.close(null);
    }

    onCommitEvent() {
        if (!this._common.isValidHHMM(this.newEventTime[0])) {
            this._notifyManagementService.openMessageDialog(this.translate.instant('APP_PEOPLE_PAGE.ATTENTION'), this.translate.instant('APP_PEOPLE_PAGE.STARTTIMEINVALID'));
            return;
        }

        if (!this._common.isValidHHMM(this.newEventTime[1])) {
            this._notifyManagementService.openMessageDialog(this.translate.instant('APP_PEOPLE_PAGE.ATTENTION'), this.translate.instant('APP_PEOPLE_PAGE.ENDTIMEINVALID'));
            return;
        }

        if (!this.checkEventTime()) {
            this._notifyManagementService.openMessageDialog(this.translate.instant('APP_PEOPLE_PAGE.ATTENTION'), this.translate.instant('APP_PEOPLE_PAGE.The booking end time must be higher than the start time'));
            return;
        }

        if (!this.isActivityTypeSelectedOvertime()) {
            if (this.checkEventTimeOverlap()) {
                this._notifyManagementService.openMessageDialog(this.translate.instant('APP_PEOPLE_PAGE.ATTENTION'), this.translate.instant('APP_PEOPLE_PAGE.A new schedule cannot overlap an existing one'));
                return;
            }
        }

        if (this.checkRepeatDays()) {
            this._notifyManagementService.openMessageDialog(this.translate.instant('APP_PEOPLE_PAGE.ATTENTION'), this.translate.instant('APP_PEOPLE_PAGE.Days for which the schedule repeats are not valid'));
            return;
        }
        let justificativeDaysNeeded = this.checkValidJustificativeDate()
        if (justificativeDaysNeeded != 0) {
            this._notifyManagementService.openMessageDialog(this.translate.instant('APP_PEOPLE_PAGE.ATTENTION'), this.translate.instant('APP_PEOPLE_PAGE.Days of advance for this justificative part1') 
            + this.calendarPlanEditorDialogData.eventActivityTypeData.activityLabel + this.translate.instant('APP_PEOPLE_PAGE.Days of advance for this justificative part2') 
            + justificativeDaysNeeded + this.translate.instant('APP_PEOPLE_PAGE.Days of advance for this justificative part3'));
            return;
        }

        let data: PersonEventData = {
            site: this.calendarPlanEditorDialogData.eventSite.key,
            note: '',
            plan: this.calendarPlanEditorDialogData.eventActivityTypeData
        }
        let startTime = this._common.buildDateTimeFromHHMM(new Date(), this.newEventTime[0]);
        let endTime = this._common.buildDateTimeFromHHMM(new Date(), this.newEventTime[1]);

        this.calendarPlanEditorDialogResult.calendarPlanItem = new DailyPlanTimeFrameItem();
        this.calendarPlanEditorDialogResult.calendarPlanItem.start = startTime;
        this.calendarPlanEditorDialogResult.calendarPlanItem.end = endTime;
        this.calendarPlanEditorDialogResult.calendarPlanItem.eventData = data;

        this.dialogRef.close(this.calendarPlanEditorDialogResult);
    }

    onConfirmClick() {
        this.onCommitEvent();
    }

    isConfirmEnabled() {
        return true;
    }

    setEventTime(index, time) {
        this.newEventTime[index] = time; // this._common.buildDateTimeFromHHMM(new Date(), time);
    }

    checkEventTime() {
        let startTime = this._common.buildDateTimeFromHHMM(new Date(), this.newEventTime[0]);
        let endTime = this._common.buildDateTimeFromHHMM(new Date(), this.newEventTime[1]);

        return (startTime.getTime() - endTime.getTime() < 0);
    }

    checkEventTimeOverlap() {
        let startTime = this._common.buildDateTimeFromHHMM(new Date(), this.newEventTime[0]);
        let endTime = this._common.buildDateTimeFromHHMM(new Date(), this.newEventTime[1]);
        let originalStartTime = this._common.buildDateTimeFromHHMM(new Date(), this.calendarPlanEditorDialogData.eventTimeFrame[0]);
        let originalEndTime = this._common.buildDateTimeFromHHMM(new Date(), this.calendarPlanEditorDialogData.eventTimeFrame[1]);

        let overlap = null;
        if (!this.calendarPlanEditorDialogData.isModify) {
            // se è un inserimento di un nuovo slot valuto l'overlap su tutti quelli presenti (escludo dal controllo gli straordinari che possono sovrapporsi)
            overlap = this.calendarPlanEditorDialogData.events.filter(ev => ev.eventData.plan.activityEventType != EVENT_TYPE.EXTRA_WORKING).find(ev => {
                let res = this._common.timeRagesOverlap(startTime, endTime, ev.start, ev.end)
                    || (this._common.compareOnlyTime(ev.start, startTime) == 0)
                    || (this._common.compareOnlyTime(ev.end, endTime) == 0);
                return res;
            });
        } else {
            // se è una modifica di uno slot valuto l'overlap su tutti quelli presenti tranne quello che sto' modificando
            let eligibleTimeFrames = this.calendarPlanEditorDialogData.events.filter(ev => {
                return (this._common.compareOnlyTime(ev.start, originalStartTime) != 0) &&
                    (this._common.compareOnlyTime(ev.end, originalEndTime) != 0);
            })
            overlap = eligibleTimeFrames.filter(ev => ev.eventData.plan.activityEventType != EVENT_TYPE.EXTRA_WORKING).find(ev => {
                let res = this._common.timeRagesOverlap(startTime, endTime, ev.start, ev.end) || (ev.start == startTime)
                    || (this._common.compareOnlyTime(ev.start, startTime) == 0)
                    || (this._common.compareOnlyTime(ev.end, endTime) == 0);
                return res;
            });
        }

        return overlap;
    }

    checkRepeatDays() {
        return (this.calendarPlanEditorDialogResult.dayRepeatCount <= 0);
    }

    onRepeatPlan() {

    }

    checkValidJustificativeDate() {
        if (this.calendarPlanEditorDialogData.eventActivityTypeData.activityType == ACTIVITY_TYPE.NO_WORKING) {
            for (let justificativeType of this.calendarPlanEditorDialogData.companyJustificationTypes) {
                if (this.calendarPlanEditorDialogData.eventActivityTypeData.activityLabel == justificativeType.name) {
                    let justificativeDaysNeeded = justificativeType.daysToRequest;
                    let now = new Date();
                    let requestDate = new Date(this.calendarPlanEditorDialogData.date);
                    let requestDays = this._common.dateDiffInDays(requestDate, now);
                    if (justificativeDaysNeeded - 1 > requestDays) return (justificativeDaysNeeded);
                    else break;
                }
            }
            return 0;
        }
        else return 0;
    }

    getActivityTypeDatas() {
        if (this.calendarPlanEditorDialogData.isOvertime) {
            let onlyOvertimeActivities = this.calendarPlanEditorDialogData.activityTypeDatas.filter(at => {
                let justificationType = this.calendarPlanEditorDialogData.companyJustificationTypes.find(jt => jt.name == at.activityLabel);
                return justificationType ? justificationType.scheduleAbilitation : false;
            });
            //if (onlyOvertimeActivities.length > 0)
            //    this.calendarPlanEditorDialogData.eventActivityTypeData = onlyOvertimeActivities[0];

            return onlyOvertimeActivities;
        } else
            return this.calendarPlanEditorDialogData.activityTypeDatas;
    }

    isActivityTypeSelectedOvertime() {
        let justificationType = this.calendarPlanEditorDialogData.companyJustificationTypes.find(jt => jt.name == this.calendarPlanEditorDialogData.eventActivityTypeData.activityLabel);
        return justificationType ? justificationType.scheduleAbilitation : false;
    }
}
