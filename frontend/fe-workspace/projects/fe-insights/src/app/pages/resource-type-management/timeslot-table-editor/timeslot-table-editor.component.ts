import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvailabilityTimeslotSchema } from 'projects/fe-common/src/lib/models/bookable-assets';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-timeslot-table-editor',
    templateUrl: './timeslot-table-editor.component.html',
    styleUrls: ['./timeslot-table-editor.component.scss']
})
export class TimeslotTableEditorComponent implements OnInit {
    @Input() Timeslots: AvailabilityTimeslotSchema[];
    @Output() TimeslotsChange: EventEmitter<AvailabilityTimeslotSchema[]> = new EventEmitter<AvailabilityTimeslotSchema[]>();

    currentTimeslot: AvailabilityTimeslotSchema = new AvailabilityTimeslotSchema();

    constructor(private commonService: CommonService) { }

    ngOnInit(): void {
    }

    getTimeslotTime(isStart: boolean) {
        if (isStart)
            return this.commonService.toHHMM(this.currentTimeslot.startTime);
        else
            return this.commonService.toHHMM(this.currentTimeslot.endTime);
    }

    setTimeslotTime(isStart: boolean, time: string) {
        let now = new Date();
        if (isStart)
            this.currentTimeslot.startTime = this.commonService.buildDateTimeFromHHMM(now, time);
        else
            this.currentTimeslot.endTime = this.commonService.buildDateTimeFromHHMM(now, time);
    }

    onAddTimeslot() {
        this.Timeslots = this.Timeslots.concat([this.currentTimeslot]);
        this.TimeslotsChange.emit(this.Timeslots);

        this.currentTimeslot = new AvailabilityTimeslotSchema();
    }

    onDeleteTimeslot(index, element) {
        let i = 0;

        this.Timeslots = this.Timeslots.filter(item => i++ != index);
        this.TimeslotsChange.emit(this.Timeslots);
    }

    isAddTimeslotEnabled() {
        return this.commonService.isValidField(this.currentTimeslot.name) &&
            this.currentTimeslot.startTime &&
            this.currentTimeslot.endTime &&
            this.currentTimeslot.maxCount > 0;
    }
}
