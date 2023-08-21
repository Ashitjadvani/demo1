import {DatePipe} from '@angular/common';
import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    Inject,
    Injectable,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {DateSelectArg, EventApi, EventClickArg, Calendar, CalendarApi} from '@fullcalendar/core';
import {createEventId, INITIAL_EVENTS} from './event-utils';
import {ActivatedRoute, Router} from "@angular/router";
import {EventManagementListOfEventService} from "../../../../../../fe-common-v2/src/lib/services/event-management-list-of-event.service";
import {EventHelper} from "../../../../../../fe-common-v2/src/lib";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import * as moment from 'moment';
import {EventRenderRange} from "@fullcalendar/common";
import {GoogleCalendarAuthService} from "../../../../../../fe-common/src/lib/services/google-calendar-auth.service";
// import {google} from 'googleapis'
// import {GoogleCalendarAuthService} from "../../../../../../fe-common/src/lib/services/google-calendar-auth.service";
declare var gapi: any
import {DOCUMENT} from '@angular/common'
import {Tooltip} from 'chart.js';
import {EventEmitter} from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {EventStatus} from "../../../../../../fe-common-v2/src/lib/enums/event-status.enum";
// import itLocaleLocale from '@fullcalendar/core/locales/it';
import itLocale from "@fullcalendar/core/locales/it";
import esLocale from '@fullcalendar/core/locales/en-au';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import tippy from 'tippy.js';
/*import {MatTabChangeEvent} from "@angular/material/tabs";
import {
  AgendaService,
  DayService,
  MonthAgendaService,
  MonthService, TimelineMonthService, TimelineViewsService,
  WeekService,
  WorkWeekService
} from "@syncfusion/ej2-angular-schedule";*/
const I18N_VALUES = {
    'Eng': {weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
            'Nov', 'Dec'],
    },
    'it': {
        weekdays: ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'],
        months: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    }
    // other languages you would support
};
@Injectable()
export class I18n {
    language = MCPHelperService.getLanguageName() == "it" ? "it" : "Eng";
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

    constructor(private _i18n: I18n) {

        super();
    }

    getWeekdayShortName(weekday: number): string {
        return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
    }
    getMonthShortName(month: number): string {
        return I18N_VALUES[this._i18n.language].months[month - 1];
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }

    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}
@Component({
    template: `
        <button class='col-6 eventDelete' (onClick)="deleted.emit(info.event)" data-event-id=" + event.id +"><i
            class='bi bi-trash3-fill'></i></button>`,
})
export class EventActionsComponent {
    info: any;
    @Output() deleted = new EventEmitter();
}

@Component({
    selector: 'app-event-calendar',
    templateUrl: './event-calendar.component.html',
    styleUrls: ['./event-calendar.component.scss'],
    providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
    // tslint:disable-next-line:max-line-length
    /*providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService]*/
})
export class EventCalendarComponent implements OnInit, AfterViewInit {
    selected: Date | null;
    companyId: any;
    authorId: any;
    selectedIndex: any;
    private tabIndex: number;
    calendarVisible = true;
    calendarOptions: any;
    currentEvents: EventApi[] = [];
    dateFilter: any;
    goToDate = false;
    showYear = false;
    showDatePicker = true;
    showDay = false;
    showEventDetails: boolean = false;
    @ViewChild("fullCalender") fullCalendar!: FullCalendarComponent;
    ngComponentsMap = new Map<HTMLElement, ComponentRef<EventActionsComponent>>();
    eventActionsComponentFactory = this.resolver.resolveComponentFactory(
        EventActionsComponent
    );
    calenderEventList: any;
    listOfCalenderEvent: any[] = [];
    // @ts-ignore
    // tokenClient:any;
    CLIENT_ID = '675549511936-7b79coi35r69jgnlb7k30eimpg6rdod4.apps.googleusercontent.com';
    API_KEY = 'AIzaSyDEdpxcjNNMDmr7mIavQya5VEE26xFlNOM';

    // Discovery doc URL for APIs used by the quickstart
    DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    SCOPES = 'https://www.googleapis.com/auth/calendar';
    gapiInited = false;
    gisInited = false;
    zone: any;
    tokenClient: any;
    response: any;
    scopeId: any = null;
    getClassCount: any;
    fullStartDt: string;
    fullEndDt: string;
    newStartDate: any;
    newEndDate: any;
    eventStatus: any;
    concludedEvent: number = EventStatus.concluded;
    currentEvent: number = EventStatus.current;
    startTime: any;
    endTime: any;
    userLanguageSelect: string;
    currentView: any ="timeGridDay";
    duration: any;
    html: string;
    sidebarMenuName: string;

    constructor(
        public dialog: MatDialog,
        private elRef: ElementRef,
        private datepipe: DatePipe,
        private router: Router,
        public translate: TranslateService,
        private helper: MCPHelperService,
        private ApiService: EventManagementListOfEventService,
        private authenticatorService: GoogleCalendarAuthService,
        private activatedRoute: ActivatedRoute,
        private render: Renderer2,
        @Inject(DOCUMENT) private _document: HTMLDocument,
        private resolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef
    ) {
        this.currentView= this.activatedRoute.snapshot.queryParams.view
        // if (this.currentView === undefined){
        //     this.router.navigate(['/event-management/event-calendar'],{
        //         queryParams: {
        //             view:'timeGridDay'
        //         }
        //     });
        // }
        if(!this.currentView){
            this.currentView ="timeGridDay"
        }
        if(this.currentView == "timeGridDay" || undefined ){
            this.showDatePicker=true
        }else {
            this.showDatePicker=false
        }
        this.scopeId = this.activatedRoute.snapshot.paramMap.get('scopeId');
        this.userLanguageSelect = MCPHelperService.getLanguageName();
        let language = this.userLanguageSelect == "it" ? itLocale : esLocale
        this.calendarOptions = {
            locale: language,
            scrollTime: '00:00',
            headerToolbar: {
                left: 'createEventBtn',
                center: 'prev title next',
                right: 'timeGridDay,timeGridWeek,dayGridMonth'
            },

            initialView:this.currentView,
            select: function(start, end, jsEvent, view) {
                // start contains the date you have selected
                // end contains the end date.
                // Caution: the end date is exclusive (new since v2).
                var allDay = !start.hasTime() && !end.hasTime();
                alert(["Event Start date: " + moment(start).format(),
                    "Event End date: " + moment(end).format(),
                    "AllDay: " + allDay].join("\n"));
            },
        };
    }

    ngOnInit(): void {
        if(!this.currentView){
            this.currentView ="timeGridDay"
        }
        this.scopeId = this.activatedRoute.snapshot.paramMap.get('scopeId');
        this.getCalenderEvents1({});
        this.getEvents({}, {});
        this.sideMenuName()
    }
    sideMenuName() {
        this.sidebarMenuName = 'INSIGHTS_MENU.Calendar';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    createGoogleEvent() {

    }


    handleCalendarToggle() {
        this.calendarVisible = !this.calendarVisible;
    }

    getEvents(start, end) {
        return this.listOfCalenderEvent
    }

    async getCalenderEvents1(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiService.getCalenderEvents({filterByDates: "thisYear", scope: this.scopeId});
        if (res.statusCode === 200) {
            this.calenderEventList = res.data
            for (let arr of this.calenderEventList) {
                //start: '2019-08-12T10:30:00'
                this.fullStartDt = arr.startDate
                this.fullEndDt = arr.endDate
                this.startTime=arr.from
                this.endTime=arr.to
                let endDate = new Date(this.fullEndDt)
                let endDate2 = endDate.setDate(endDate.getDate())
                this.listOfCalenderEvent.push({
                    id: arr.id,
                    title: arr.name,
                    startRecur: this.fullStartDt,
                    endRecur:endDate2,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    backgroundColor: arr.color,
                    textColor: '#000000',
                    overlap: false,
                    display: "inline-block",
                    extraParams: {
                        eventStatus: arr.status,
                        end: this.endTime,
                        type:arr.type
                    }
                })
            }
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
        }
        this.helper.toggleLoaderVisibility(false);
        var that = this
        let language = this.userLanguageSelect == "it" ? itLocale : esLocale
        this.calendarOptions = {
            customButtons: {
                myCustomButton: {
                    text: 'Year',
                    click: function () {
                        that.showYear = true
                        let el: any = document.getElementsByClassName('fc-view-harness')[0];
                        el.style.display = 'none'
                    }
                },
                createEventBtn: {
                    text:  this.translate.instant('EVENT_MANAGEMENT.CreateNewEvent'),
                    click: function () {
                        if (that.scopeId === null){
                            that.router.navigate(['/event-management/event-list/create-event/' + 0],{
                                queryParams: {
                                    redirection:'calendar'
                                }
                            });
                        }else {
                            that.router.navigate(['/training/event-list/create-event/' + 0 + '/' + that.scopeId],{
                                queryParams: {
                                    redirection:'calendar'
                                }
                            });
                        }

                    }
                },
                timeGridDay: {
                    text: this.translate.instant('Day'),
                    click: function () {
                        if(that.scopeId === null){
                            that.router.navigate(['/event-management/event-calendar'],{
                                queryParams: {
                                    view:'timeGridDay'
                                }
                            });
                        }else {
                            that.router.navigate(['/training/event-calendar/'+that.scopeId],{
                                queryParams: {
                                    view:'timeGridDay'
                                }
                            });
                        }

                        let el: any = document.getElementsByClassName('fc-view-harness')[0];
                        el.style.display = 'initial'
                        that.showDatePicker = true
                        let api = that.fullCalendar.getApi()
                        api.changeView('timeGridDay')
                    }

                },
                dayGridMonth: {
                    text: this.translate.instant('Month'),
                    click: function () {
                        if (that.scopeId === null){
                            that.router.navigate(['/event-management/event-calendar'],{
                                queryParams: {
                                    view:'dayGridMonth'
                                }
                            });
                        }else {
                            that.router.navigate(['/training/event-calendar/'+that.scopeId],{
                                queryParams: {
                                    view:'dayGridMonth'
                                }
                            });
                        }
                        let el: any = document.getElementsByClassName('fc-view-harness')[0];
                        el.style.display = 'initial'
                        that.showDatePicker = false
                        let api = that.fullCalendar.getApi()
                        api.changeView('dayGridMonth')
                    }
                },
                timeGridWeek: {
                    text: this.translate.instant('Week'),
                    click: function () {
                        if(that.scopeId === null){
                            that.router.navigate(['/event-management/event-calendar'],{
                                queryParams: {
                                    view:'timeGridWeek'
                                }
                            });
                        }else {
                            that.router.navigate(['/training/event-calendar/'+that.scopeId],{
                                queryParams: {
                                    view:'timeGridWeek'
                                }
                            });
                        }

                        let el: any = document.getElementsByClassName('fc-view-harness')[0];
                        el.style.display = 'initial'
                        that.showDatePicker = false
                        let api = that.fullCalendar.getApi()
                        api.changeView('timeGridWeek')

                    }
                },
            },
            headerToolbar: {
                left: 'createEventBtn',
                center: 'prev title next',
                right: 'timeGridDay,timeGridWeek,dayGridMonth'
            },

            locale: language,
            initialView: this.currentView,
            initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
            weekends: true,
            selectable: false,
            selectMirror: true,
            events: this.listOfCalenderEvent,
            slotEventOverlap: true,
            editable: false,
            eventOverlap: true,
            allDaySlot: false,
            selectOverlap: true,
            dayMaxEventRows: false,

            eventDidMount: function (event: any,element) {
                let taht = this
                var addEventEdit = event.el.querySelectorAll(".eventEdit")
                addEventEdit.forEach((element: any) => {
                    element.addEventListener('click', (event: any) => that.edit(event));
                });
                var addEventDelete = event.el.querySelectorAll(".eventDelete")
                addEventDelete.forEach((element: any) => {
                    element.addEventListener('click', (event: any) => that.delete(event));
                });
                var addEventEdit = event.el.querySelectorAll(".eventEdit1")
                addEventEdit.forEach((element: any) => {
                    element.addEventListener('click', (event: any) => that.edit(event));
                });
                var addEventDelete = event.el.querySelectorAll(".eventDelete1")
                addEventDelete.forEach((element: any) => {
                    element.addEventListener('click', (event: any) => that.delete(event));
                });
            },
            eventTimeFormat: { // like '14:30:00'
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            },
            views: {
                dayGrid: {
                    scrollTime: '00:00',
                    dayMaxEvents: 0,
                    moreLinkContent: function (args) {
                        var listViewDiv = document.createElement('div');
                        var listView = document.createElement('ul');
                        listViewDiv.appendChild(listView);
                        for (var i = 0; i < args.num; i++) {
                            var listViewItem = document.createElement('li');
                            listView.appendChild(listViewItem);
                        }
                        /*var customHtmlJ = '<span class="eventCustomCount">' + args.num + '</span>' + listViewDiv.innerHTML*/
                        var customHtmlJ = '<span class="eventCustomCount">' + args.num + '</span>'
                        return {html: customHtmlJ};
                        /*return '<span class="eventCustomCount">' + args.num + '</span>' + 'Events';*/
                    },
                    eventClick: function(info) {
                        let id = info.event.id
                        if(!that.showEventDetails){
                            if (that.scopeId === null){
                                that.router.navigate(['/event-management/event-list/event-details/' + id],{
                                    queryParams: {
                                        redirection:'calendar'
                                    }
                                });
                            }else {
                                that.router.navigate(['/training/event-list/event-details/' + id + '/' + that.scopeId],{
                                    queryParams: {
                                        redirection:'calendar'
                                    }
                                });
                            }
                        }else{
                            that.showEventDetails = false;
                        }
                    },
                    eventContent: function (arg: any) {
                        var event: any = arg.event;
                        var customHtml = '';
                        // event.title
                        var d = event.start
                        let startHours = d.getHours();
                        let startMinutes = d.getMinutes();
                        startHours = startHours <= 9 ? '0' + startHours : startHours;
                        startMinutes = startMinutes <= 9 ? '0' + startMinutes : startMinutes;
                        let stDtHr = startHours
                        let stDtMn = startMinutes
                        that.newStartDate = stDtHr + ":" + stDtMn;
                        that.newEndDate =event.extendedProps.extraParams?.end;
                        let eventStatus = event.extendedProps.extraParams?.eventStatus
                        let type = event.extendedProps.extraParams?.type
                        if (!(eventStatus === that.concludedEvent || eventStatus === that.currentEvent)) {
                            customHtml += "</div><div class='row custom-design week-calendar-design'><div class='col-7'>" + "<span class='title'>" + event.title + " </span>" + "  <br>" + "<div class='calenderIcon'><i class='bi bi-calendar'></i> " + "<span>" + that.newStartDate + "  -  " + that.newEndDate +"</span>" + "</div>" +"<div class='calenderIcon'><img src='assets/images/meeting-white.svg'> " + "<span>" +  that.translate.instant(type).toString() +"</span>" + "</div>"+ "</div><div class='col-5'><div class='justify-content-end row'>" +
                                "<div class='eventBtnActionWrap1 p-0'><div class='col-6 eventEdit1' (eventClick)='eventClick($event)' data-event-id=" + event.id + "><i class='bi bi-pencil-fill' ></i></div><div class='col-6 eventDelete1' data-event-id=" + event.id + "><i class='bi bi-trash3-fill'></i></div></div>";
                            +"</div></div></div>";
                        } else {
                            customHtml += "</div><div class='row custom-design week-calendar-design'><div class='col-8'>" + "<span class='title'>" + event.title + " </span>" + " <br>" + "<div class='calenderIcon'><i class='bi bi-calendar'></i> " + "<span>" + that.newStartDate + "  -  " + that.newEndDate +"</span>" + "</div>"+"<div class='calenderIcon'><img src='assets/images/meeting-white.svg'> " + "<span>" +  that.translate.instant(type).toString() +"</span>" + "</div>" + "</div><div class='col-4'><div class='justify-content-end row'>" +
                                "<div class='eventBtnActionWrap1 p-0'><div class='col-6 eventEdit1' (eventClick)='eventClick($event)' data-event-id=" + event.id + "><i class='bi bi-pencil-fill' ></i></div></div>";
                            +"</div></div></div>";
                        }
                        return {html: customHtml}

                    }
                    // options apply to dayGridMonth, dayGridWeek, and dayGridDay views
                },
                // timeGrid: {
                //     // options apply to timeGridWeek and timeGridDay views
                // },
                // week: {
                //     eventMaxStack: 1,
                //     // options apply to dayGridWeek and timeGridWeek views
                // },
                // day: {
                //     // options apply to dayGridDay and timeGridDay views
                // },
                timeGridWeek: {
                    scrollTime: '00:00',
                    moreLinkDidMount: function (element) {
                        element.el.style.bottom = ""
                        element.el.style.opacity = "1"
                    },
                    moreLinkContent: function (args) {
                        return '+' + args.num + ' Events';
                    },
                    eventContent: function (arg: any) {
                        var event: any = arg.event;
                        var customHtml = '';
                        // event.title
                        var d = event.start
                        let startHours = d.getHours();
                        let startMinutes = d.getMinutes();
                        startHours = startHours <= 9 ? '0' + startHours : startHours;
                        startMinutes = startMinutes <= 9 ? '0' + startMinutes : startMinutes;
                        let stDtHr = startHours
                        let stDtMn = startMinutes
                        that.newStartDate = stDtHr + ":" + stDtMn;
                        that.newEndDate =event.extendedProps.extraParams?.end;
                        let eventStatus = event.extendedProps.extraParams?.eventStatus
                        let type = event.extendedProps.extraParams?.type
                        if (!(eventStatus === that.concludedEvent || eventStatus === that.currentEvent)) {
                            customHtml += "</div><div class='row custom-design week-calendar-design'><div class='col-7'>" + "<span id='title' class='title'>" + event.title + " </span>" + "  <br>" + "<div class='calenderIcon'><i class='bi bi-calendar'></i> " + "<span>" + that.newStartDate + "  -  " + that.newEndDate+"</div>"+"<div class='calenderIcon meeting-type'><img src='assets/images/meeting.svg'> " + "<span>" +  that.translate.instant(type).toString() +"</span>"  + "</div>" + "</div><div class='col-5'><div class='justify-content-end row'></div></div></div>";
                        } else {
                            customHtml += "</div><div class='row custom-design week-calendar-design'><div class='col-8'>" + "<span id='title' class='title'>" + event.title + " </span>" + " <br>" + "<div class='calenderIcon'><i class='bi bi-calendar'></i> " + "<span>" + that.newStartDate + "  -  " + that.newEndDate  + "</div>"+"<div class='calenderIcon meeting-type'><img src='assets/images/meeting.svg'> " + "<span>" +  that.translate.instant(type).toString() +"</span>" +  "</div>" + "</div><div class='col-4'><div class='justify-content-end row'></div></div></div>";
                        }
                        return {html: customHtml}

                    },
                    eventDidMount: function (event: any,element) {
                        let taht = this
                        const id= event.event._def.publicId
                        const title = event.event.title
                        const backgroundColor = event.event.backgroundColor
                        const header=moment(event.event.start).format('DD MMMM YYYY');
                        const duration =event.timeText
                        const type = event.event._def.extendedProps.extraParams.type
                        const eventStatus = event.event._def.extendedProps.extraParams.eventStatus
                        const edit = '<div id="fc-dom-21" class="fc-popover  fc-more-popover fc-day fc-day-tue fc-day-past" aria-labelledby="fc-dom-88" data-date="2023-02-07" style="top: 195.99px; left: 217.951px;"><div class="fc-popover-header "><span class="fc-popover-title" id="fc-dom-88">'+header+'</span><span id="close" class="fc-popover-close fc-icon fc-icon-x" title="Close"></span></div><div class="fc-popover-body "><div class="fc-daygrid-event-harness"><a class="fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-start fc-event-end fc-event-past" tabindex="0"  style="background-color: '+backgroundColor+';" ><div class="fc-event-main" ><div class="row custom-design "><div class="col-8 p-0"><span id="title1" class="title">'+title+'</span> <br><div class="calenderIcon"><i class="bi bi-calendar"></i> <span>'+duration+'</span></div><div class="calenderIcon"><img src="assets/images/meeting-white.svg"> <span>'+type+'</span></div></div><div class="col-4 p-0"><div class="justify-content-end row"><div class="eventBtnActionWrap1 row "><div class="col-6 eventEdit1 " id="eventEdit1" (eventclick)="eventClick($event)"  data-event-id=' + id + '><i class="bi bi-pencil-fill"></i></div></div></div></div></div></div></a></div></div></div>'
                        const editDelete = '<div id="fc-dom-21" class="fc-popover  fc-more-popover fc-day fc-day-tue fc-day-past" aria-labelledby="fc-dom-88" data-date="2023-02-07" style="top: 195.99px; left: 217.951px;"><div class="fc-popover-header "><span class="fc-popover-title" id="fc-dom-88">'+header+'</span><span id="close"  class="fc-popover-close fc-icon fc-icon-x" title="Close"></span></div><div class="fc-popover-body "><div class="fc-daygrid-event-harness"><a class="fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-start fc-event-end fc-event-past" tabindex="0" style="background-color:'+backgroundColor+';"><div class="fc-event-main" style="color: rgb(0, 0, 0);"><div class="row custom-design "><div class="col-8 p-0"><span id="title1" class="title">'+title+'</span> <br><div class="calenderIcon"><i class="bi bi-calendar"></i> <span>'+duration+'</span></div><div class="calenderIcon"><img src="assets/images/meeting-white.svg"> <span>'+type+'</span></div></div><div class="col-4 p-0"><div class="justify-content-end row"><div class="eventBtnActionWrap1 row"><div class="col-6 eventEdit1" id="eventEdit1" (eventclick)="eventClick($event)" data-event-id=' + id + '><i class="bi bi-pencil-fill"></i></div><div class="col-6 eventDelete1" id="eventDelete1" data-event-id=' + id + '><i class="bi bi-trash3-fill"></i></div></div></div></div></div></div></a></div></div></div>'
                        if(!(eventStatus === that.concludedEvent || eventStatus === that.currentEvent)){

                            that.html =editDelete
                        }else {
                            that.html = edit
                        }
                        tippy(event.el, {
                            allowHTML: true,
                            content:that.html,
                            onMount(instance) {
                                let editData =   document.getElementById('eventEdit1');
                                editData.addEventListener("click", (event: any) => {
                                    instance.hide();
                                    that.edit(event);

                                });
                                let deleteData =   document.getElementById('eventDelete1');
                                if (deleteData !== null){
                                    deleteData.addEventListener("click", (event: any) => {
                                        instance.hide();
                                        that.delete(event);
                                    });
                                }

                                let close =   document.getElementById('close');
                                close.addEventListener("click", (event: any) => {
                                    instance.hide();
                                    if(!that.showEventDetails){
                                        if (that.scopeId === null){
                                            that.router.navigate(['/event-management/event-list/event-details/' + id],{
                                                queryParams: {
                                                    redirection:'calendar'
                                                }
                                            });
                                        }else {
                                            that.router.navigate(['/training/event-list/event-details/' + id + '/' + that.scopeId],{
                                                queryParams: {
                                                    redirection:'calendar'
                                                }
                                            });
                                        }
                                    }else{
                                        that.showEventDetails = false;
                                    }
                                });
                                let redirect =  document.getElementById('title1');
                                if (redirect !==null){
                                    redirect.addEventListener("click", (event: any) => {
                                        instance.hide();
                                        if(!that.showEventDetails){
                                            if (that.scopeId === null){
                                                that.router.navigate(['/event-management/event-list/event-details/' + id],{
                                                    queryParams: {
                                                        redirection:'calendar'
                                                    }
                                                });
                                            }else {
                                                that.router.navigate(['/training/event-list/event-details/' + id + '/' + that.scopeId],{
                                                    queryParams: {
                                                        redirection:'calendar'
                                                    }
                                                });
                                            }
                                        }else{
                                            that.showEventDetails = false;
                                        }
                                    });
                                }
                            },
                            trigger:'click',
                            // arrow: true,
                            zIndex: 9999,
                            placement: 'auto',
                            interactive: true,
                            appendTo: () => document.body,

                        })
                    },


                },
                timeGridDay: { // name of view
                    // eventMaxStack: 3,
                    // moreLinkDidMount: function (element) {
                    //     element.el.style.bottom = ""
                    //     element.el.style.opacity = "1"
                    // },
                    // moreLinkContent: function (args) {
                    //     return '+' + args.num + ' Events';
                    // },

                    eventDidMount: function (event: any,element) {
                        let taht = this
                        const id= event.event._def.publicId
                        const title = event.event.title
                        const backgroundColor = event.event.backgroundColor
                        const header=moment(event.event.start).format('DD MMMM YYYY');
                        const duration =event.timeText
                        const type = event.event._def.extendedProps.extraParams.type
                        const eventStatus = event.event._def.extendedProps.extraParams.eventStatus
                        const edit = '<div id="fc-dom-21" class="fc-popover  fc-more-popover fc-day fc-day-tue fc-day-past" aria-labelledby="fc-dom-88" data-date="2023-02-07" style="top: 195.99px; left: 217.951px;"><div class="fc-popover-header "><span class="fc-popover-title" id="fc-dom-88">'+header+'</span><span id="close" class="fc-popover-close fc-icon fc-icon-x" title="Close"></span></div><div class="fc-popover-body "><div class="fc-daygrid-event-harness"><a class="fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-start fc-event-end fc-event-past" tabindex="0"  style="background-color: '+backgroundColor+';" ><div class="fc-event-main" ><div class="row custom-design "><div class="col-8 p-0"><span id="title" class="title">'+title+'</span> <br><div class="calenderIcon"><i class="bi bi-calendar"></i> <span>'+duration+'</span></div><div class="calenderIcon"><img src="assets/images/meeting-white.svg"> <span>'+type+'</span></div></div><div class="col-4 p-0"><div class="justify-content-end row"><div class="eventBtnActionWrap1 row "><div class="col-6 eventEdit1 " id="eventEdit1" (eventclick)="eventClick($event)"  data-event-id=' + id + '><i class="bi bi-pencil-fill"></i></div></div></div></div></div></div></a></div></div></div>'
                        const editDelete = '<div id="fc-dom-21" class="fc-popover  fc-more-popover fc-day fc-day-tue fc-day-past" aria-labelledby="fc-dom-88" data-date="2023-02-07" style="top: 195.99px; left: 217.951px;"><div class="fc-popover-header "><span class="fc-popover-title" id="fc-dom-88">'+header+'</span><span id="close"  class="fc-popover-close fc-icon fc-icon-x" title="Close"></span></div><div class="fc-popover-body "><div class="fc-daygrid-event-harness"><a class="fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-start fc-event-end fc-event-past" tabindex="0" style="background-color:'+backgroundColor+';"><div class="fc-event-main" style="color: rgb(0, 0, 0);"><div class="row custom-design "><div class="col-8 p-0"><span id="title" class="title">'+title+'</span> <br><div class="calenderIcon"><i class="bi bi-calendar"></i> <span>'+duration+'</span></div><div class="calenderIcon"><img src="assets/images/meeting-white.svg"> <span>'+type+'</span></div></div><div class="col-4 p-0"><div class="justify-content-end row"><div class="eventBtnActionWrap1 row"><div class="col-6 eventEdit1" id="eventEdit1" (eventclick)="eventClick($event)" data-event-id=' + id + '><i class="bi bi-pencil-fill"></i></div><div class="col-6 eventDelete1" id="eventDelete1" data-event-id=' + id + '><i class="bi bi-trash3-fill"></i></div></div></div></div></div></div></a></div></div></div>'
                        if(!(eventStatus === that.concludedEvent || eventStatus === that.currentEvent)){

                            that.html =editDelete
                        }else {
                            that.html = edit
                        }
                        tippy(event.el, {
                            allowHTML: true,
                            content:that.html,
                            onMount(instance) {
                                let editData =   document.getElementById('eventEdit1');
                                editData.addEventListener("click", (event: any) => {
                                    instance.hide();
                                    that.edit(event);

                                });
                                let deleteData =   document.getElementById('eventDelete1');
                                if (deleteData !== null){
                                    deleteData.addEventListener("click", (event: any) => {
                                        instance.hide();
                                        that.delete(event);
                                    });
                                }

                                let close =   document.getElementById('close');
                                close.addEventListener("click", (event: any) => {
                                    instance.hide();
                                });
                                let redirect =  document.getElementById('title');
                                if (redirect !==null){
                                    redirect.addEventListener("click", (event: any) => {
                                        instance.hide();
                                        if(!that.showEventDetails){
                                            if (that.scopeId === null){
                                                that.router.navigate(['/event-management/event-list/event-details/' + id],{
                                                    queryParams: {
                                                        redirection:'calendar'
                                                    }
                                                });
                                            }else {
                                                that.router.navigate(['/training/event-list/event-details/' + id + '/' + that.scopeId],{
                                                    queryParams: {
                                                        redirection:'calendar'
                                                    }
                                                });
                                            }
                                        }else{
                                            that.showEventDetails = false;
                                        }
                                    });
                                }
                            },
                            trigger:'click',
                            // arrow: true,
                            zIndex: 9999,
                            placement: 'auto',
                            interactive: true,
                            appendTo: () => document.body,

                        })
                    },
                }

            },
            dayMaxEvents: true,
            select: this.handleDateSelect.bind(this),
            // eventClick: this.handleEventClick.bind(this),
            slotLabelFormat: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            },


            eventContent: function (arg: any) {
                var event: any = arg.event;
                var customHtml = '';
                // event.title
                var d = event.start
                let startHours = d.getHours();
                let startMinutes = d.getMinutes();
                startHours = startHours <= 9 ? '0' + startHours : startHours;
                startMinutes = startMinutes <= 9 ? '0' + startMinutes : startMinutes;
                let stDtHr = startHours
                let stDtMn = startMinutes
                that.newStartDate = stDtHr + ":" + stDtMn;
                that.newEndDate =event.extendedProps.extraParams?.end;
                let eventStatus = event.extendedProps.extraParams?.eventStatus
                let type =event.extendedProps.extraParams?.type
                if (!(eventStatus === that.concludedEvent || eventStatus === that.currentEvent)) {
                    customHtml += "</div><div class='row custom-design'><div class='col-7'>" + "<span class='title'>" + event.title + " </span>" + "  <br>" + "<div class='calenderIcon'><i class='bi bi-calendar'></i> " + "<span>" + that.newStartDate + "  -  " + that.newEndDate +"</span>" + "<img style='margin-left: 30px' src='assets/images/meeting.svg'>" + "<span>" + that.translate.instant(type).toString() +"</span>" + "</div>" + "</div><div class='col-5'></div></div></div>";
                } else {
                    customHtml += "</div><div class='row custom-design'><div class='col-8'>" + "<span class='title'>" + event.title + " </span>" + " <br>" + "<div class='calenderIcon'><i class='bi bi-calendar'></i> " + "<span>" + that.newStartDate + "  -  " + that.newEndDate +"</span>" + "<img style='margin-left: 30px' src='assets/images/meeting.svg'>" + "<span>" + that.translate.instant(type).toString() +"</span>" + "</div>" + "</div><div class='col-4'></div></div></div>";
                }
                return {html: customHtml}

            }

        };


    }

    ngAfterViewInit(): void {

    }

    handleWeekendsToggle() {
        const {calendarOptions} = this;
        calendarOptions.weekends = !calendarOptions.weekends;
    }


    handleDateSelect(selectInfo: DateSelectArg) {
        const calendarApi = selectInfo.view.calendar;
        if (this.scopeId === null){
            this.router.navigate(['/event-management/event-list/create-event/' + 0], {
                queryParams: {
                    'start': selectInfo.start,
                    'end': selectInfo.end,
                    redirection:'calendar'
                }
            });
        }else {
            this.router.navigate(['/training/event-list/create-event/' + 0 + '/' + this.scopeId], {
                queryParams: {
                    'start': selectInfo.start,
                    'end': selectInfo.end,
                    redirection:'calendar'
                }
            });
        }
        calendarApi.unselect(); // clear date selection


    }


    // handleEventClick(clickInfo: EventClickArg) {
    //
    //     clickInfo.event.remove();
    //
    // }

    handleEvents(events: EventApi[]) {
        this.currentEvents = events;

    }

    goToDay(event: any) {
        let dateFilter = event.year + "/" + event.month + "/" + event.day;
        let xyz = this.fullCalendar.getApi();
        var date = new Date(dateFilter);
        xyz?.gotoDate(date)
    }


    edit(event: any) {
        let id = event.currentTarget.dataset.eventId;
        if (this.scopeId === null){
            this.router.navigate(['/event-management/event-list/create-event/' + id],{
                queryParams: {
                    redirection:'calendar'
                }
            });
        }else {
            this.router.navigate(['/training/event-list/create-event/' + id + '/' + this.scopeId],{
                queryParams: {
                    redirection:'calendar'
                }
            });
        }

    }

    delete(event: any) {

        this.showEventDetails =true;
        let id = event.currentTarget.dataset.eventId;
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: this.translate.instant('MASTER_MODULE.Are You Sure You Want To Delete This Event?'),
                heading: 'Delete Event'
            }
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.helper.toggleLoaderVisibility(true);
                    const credentials = localStorage.getItem('credentials');
                    if (credentials) {
                        const authUser: any = JSON.parse(credentials);
                        this.authorId = authUser.person.id;
                        this.companyId = authUser.person.companyId;
                    }
                    that.ApiService.deleteListOfItem({id: id, companyId: this.companyId}).then((data: any) => {
                        this.getEvents({}, {});
                        this.helper.toggleLoaderVisibility(false);
                        this.getCalenderEvents1({});
                        EventHelper.showMessage('', this.translate.instant('Swal_Message.DELETE_LIST_OF_EVENT'), 'success');
                        if(this.scopeId===null){
                            this.router.navigate(['/event-management/event-calendar'],{
                                queryParams: {
                                    view:this.currentView
                                }
                            });
                        }else {
                            this.router.navigate(['/training/event-calendar/'+this.scopeId],{
                                queryParams: {
                                    view:this.currentView
                                }
                            });
                        }

                        window.location.reload();
                        // this.getEvents({}, {});
                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        EventHelper.showMessage('', this.translate.instant(err.error.message), 'error');
                    });
                }
            });
    }


    changeFormate(date: Date) {
        let fDate = this.datepipe.transform(date, 'shortTime');
        return fDate
    }


}
export class NgbdDatepickerI18n {
    model: NgbDateStruct;
}
