import {animate, state, style, transition, trigger} from "@angular/animations";
import swal from "sweetalert2";

export class EventHelper {
    /**
     * Columns of Event List
     * @returns event list columns
     */
    public static getEventColumns(): string[] {
        //return ['select', 'wheelAction', 'nameOfEvent', 'Area', 'Scope', 'startDate', 'endDate', 'from', 'to', 'totalNumberOfInvitations', 'confirmed', 'declined', 'actions'];
        return ['select', 'wheelAction', 'nameOfEvent', 'Area', 'Scope', 'startDate', 'endDate', 'from', 'to', 'totalNumberOfInvitations', 'confirmed', 'declined', 'totalChecks', 'actions'];
    }

    /**
     * get degree diplsy columns
     * @returns degree diplay columns
     */
    public static getDegreeDisplayedColumns(): string[] {
        //return ['select', 'wheelAction', 'nameOfEvent', 'Area', 'Scope', 'costCenterType', 'type', 'startDate', 'endDate', 'From', 'to', 'totalNumberOfInvitations', 'pending', 'confirmed', 'declined', 'totalCheckIn', 'TotalCheckOut'];
        return ['select', 'wheelAction', 'nameOfEvent', 'Area', 'Scope', 'costCenterType', 'type', 'startDate', 'endDate', 'From', 'to', 'totalNumberOfInvitations', 'pending', 'confirmed', 'declined', 'totalChecks'];
    }

    /**
     * get degree diplsy columns
     * @returns degree diplay columns
     */
    public static emailTemplateDisplayedColumns(): string[] {
        return ['wheelAction', 'Email', 'subject'];
    }

    /**
     * get degree diplsy columns
     * @returns degree diplay columns
     */
    public static ownerDataDisplayedColumns(): string[] {
        return ['firstName','surname','email','status','checkpointsComplied','creditsAccrued'];
    }

    public static attendeesDetailsDataDisplayedColumns(): string[] {
        return ['name','surname','email','status','checkpointsComplied','creditsAccrued','totalChecksCount','action'];
    }

    public static liveAttendeesDetailsDataDisplayedColumns(): string[] {
        return ['name','surname','email','status','checkpointsComplied','creditsAccrued','totalChecksCount'];
    }

    /**
     * detail expand animation
     */
    public static animationForDetailExpand() {
        return trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ])
    }

    /**
     * Get Chips Filter
     * @returns array of chips filter
     */
    public static getChipsFilter(): any[] {
        return [
            {field: 'name', caption: 'FilterEventName'},
            {field: 'scope', caption: 'FilterEventScope'},
            {field: 'costCenter', caption: 'FilterCostCentre'},
            {field: 'startDate', caption: 'FilterStartDate'},
            {field: 'endDate', caption: 'FilterEndDate'},
            {field: 'type', caption: 'Type'},
            {field: 'area', caption: 'Area'},
        ];
    }

    public static compareEventDates(cancelledEventStatus: any, eventStatus: any, eventName: string, startDate: any, today: any) {
        var date = new Date(startDate);
        var todayDate = today;
        switch (eventName) {
            case 'startDateGreaterCurrent':
                return eventStatus !== cancelledEventStatus && date > todayDate;
            case 'startDateLessOrEqualCurrent':
                return eventStatus !== cancelledEventStatus && date <= todayDate;
            default:
                break;
        }
    }


    public static showMessage(title: string, message: string, icon: any) {
        swal.fire(
            title,
            message,
            icon
        );
    }

    public static getEventDurationDrpValue(): any[] {
        return [
            {duration: 'EVENT_MANAGEMENT.All Events', value: 'allEvents'},
            {duration: 'EVENT_MANAGEMENT.Today', value: 'today'},
            {duration: 'EVENT_MANAGEMENT.This_Week', value: 'thisWeek'},
            {duration: 'EVENT_MANAGEMENT.This_Month', value: 'thisMonth'},
            {duration: 'EVENT_MANAGEMENT.This_Year', value: 'thisYear'},
            {duration: 'EVENT_MANAGEMENT.ConcludedEvents', value: 'ConcludedEvents'},
            {duration: 'EVENT_MANAGEMENT.Scheduled_Events', value: 'ScheduledEvents'},
            {duration: 'EVENT_MANAGEMENT.Events_Canceled', value: 'CanceledEvents'},
            {duration: 'EVENT_MANAGEMENT.Events_to_be_completed', value: 'EventsToBeCompleted'}
        ]
    }
}
