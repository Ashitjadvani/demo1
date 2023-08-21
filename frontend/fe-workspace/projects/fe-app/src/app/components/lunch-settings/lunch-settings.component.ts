import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

export class ConfirmLunchSettingResult {
    lunchDone: boolean;
    extraWorkDone: boolean;
    startTime: string;
    endTime: string;

    constructor() {
        this.lunchDone = false;
        this.extraWorkDone = false;
        this.startTime = null;
        this.endTime = null;
    }
}

enum State {
    getSettings,
    getTimeRange
}

@Component({
    selector: 'app-lunch-settings',
    templateUrl: './lunch-settings.component.html',
    styleUrls: ['./lunch-settings.component.scss']
})
export class LunchSettingsComponent implements OnInit {
    state = State;

    @Input() currentPerson: Person;
    @Output() onConfirmLunchSetting: EventEmitter<ConfirmLunchSettingResult> = new EventEmitter<ConfirmLunchSettingResult>();

    confirmLunchSettingResult: ConfirmLunchSettingResult = new ConfirmLunchSettingResult();
    currentState: State;

    constructor(private commonService: CommonService) { }

    ngOnInit(): void {
        this.initializeData();
    }

    initializeData() {
        this.currentState = State.getSettings;
        this.confirmLunchSettingResult = new ConfirmLunchSettingResult();
    }

    setEventTime(index, time) {
        if (index == 0)
            this.confirmLunchSettingResult.startTime = time; // this._common.buildDateTimeFromHHMM(new Date(), time);
        else
            this.confirmLunchSettingResult.endTime = time;
    }

    isStartTimeLessThanEndTime() {
        try {
            let now = new Date();
            let st = this.commonService.buildDateTimeFromHHMM(now, this.confirmLunchSettingResult.startTime);
            let et = this.commonService.buildDateTimeFromHHMM(now, this.confirmLunchSettingResult.endTime);

            return this.commonService.compareOnlyTime(st, et) < 0;
        } catch (ex) {
            return false;
        }
    }

    disableConfirm() {
        if (this.currentState == State.getSettings)
            return (!this.confirmLunchSettingResult.lunchDone && !this.confirmLunchSettingResult.extraWorkDone);
        else if (this.currentState == State.getTimeRange)
            return !this.commonService.isValidField(this.confirmLunchSettingResult.startTime) || !this.commonService.isValidField(this.confirmLunchSettingResult.endTime) || !this.isStartTimeLessThanEndTime();
        else
            return false;
    }

    showBackButton() {
        return this.currentState == State.getTimeRange; 
    }

    onBackAction() {
        this.currentState = State.getSettings;
    }

    onConfimAction() {
        if ((this.currentState == State.getSettings) && this.currentPerson.lunchOpen) {
            this.currentState = State.getTimeRange;
        } else {
            this.onConfirmLunchSetting.emit(this.confirmLunchSettingResult);
            this.initializeData();
        }
    }
}
