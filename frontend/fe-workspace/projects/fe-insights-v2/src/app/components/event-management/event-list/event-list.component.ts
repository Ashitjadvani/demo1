import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime} from "rxjs/operators";
import {Subject} from "rxjs";
import {EventManagementListOfEventService} from "../../../../../../fe-common-v2/src/lib/services/event-management-list-of-event.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import {CancelPopupComponent} from "../../../popup/cancel-popup/cancel-popup.component";
import {ReActivateEventPopupComponent} from "../../../popup/re-activate-event-popup/re-activate-event-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {
    FilterListOfEventPopupComponent,
    ListOfEventFilterData
} from "../../../popup/filter-list-of-event-popup/filter-list-of-event-popup.component";
import {SettingsManagementService} from "../../../../../../fe-common-v2/src/lib/services/settings-management.service";
import {DatePipe} from "@angular/common";
import {EventStatus} from 'projects/fe-common-v2/src/lib/enums/event-status.enum';
import {EventHelper, EventRequestParams, PaginationModel} from 'projects/fe-common-v2/src/lib';
import { EventListPopupComponent } from '../../../popup/event-list-popup/event-list-popup.component';
import { EditEventCreditPopupComponent } from '../../../popup/edit-event-credit-popup/edit-event-credit-popup.component';
import swal from "sweetalert2";
import {FormGroup} from "@angular/forms";
import {UserCapabilityService} from "../../../service/user-capability.service";


export interface EventDialogData {
    eventID: any;
    heading: any;
    condition:any;
    checkInOutData:any;
    pendingCountData:any;
    eventListStatus:any;
}
export interface EventCreditDialogData {
    heading: any;
    eventCreditPopValue : boolean;
    eventCreditCountPopValue: number;
}

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.scss'],
    animations: [EventHelper.animationForDetailExpand()]
})
export class EventListComponent implements OnInit {
    dataSource;
    cancelledEvent: number = EventStatus.Cancelled;
    concludedEvent:number = EventStatus.concluded;
    currentEvent:number=EventStatus.current;
    selection = new SelectionModel<any>(true, []);
    columnsToDisplay = [];
    expandedElement: any | null;
    search: any = '';
    sortBy: any;
    sortKey: any;
    paginationModel: PaginationModel = new PaginationModel();
    filterByDates: any = "allEvents"
    sidebarMenuName: string;
    selectedDate = 'allEvents';
    public today: Date = new Date();
    scopeId: any = null;
    public requestPara: EventRequestParams = new EventRequestParams(this.paginationModel.page, this.paginationModel.limit, null, '', '', 'allEvents', null);
    listOfEventList: any = new MatTableDataSource([]);
    // expandedElement: any;
    noRecordFound: boolean = false;
    listOfEventID = []
    activityLog: any;
    authorId: any;
    companyId:any;
    listOfEventFilterData: ListOfEventFilterData = new ListOfEventFilterData();
    activeFilters: any[];
    chipsFilters: any[] = EventHelper.getChipsFilter();
    eventDurationDrpValue: any[];
    public eventCreditValue : boolean;
    public eventCreditCountValue: number;
    finalValueForm: FormGroup;
    superUserDeleteEvent: boolean = false;
    superUserTrainingDeleteEvent: boolean = false;
    hasScopeId: boolean = false;

    constructor(
        public dialog: MatDialog,
        private helper: MCPHelperService,
        public translate: TranslateService,
        private router: Router,
        private datePipe: DatePipe,
        private ApiService: EventManagementListOfEventService,
        private settingsManagementService: SettingsManagementService,
        private activatedRoute: ActivatedRoute,
        private userCapabilityService: UserCapabilityService,
    ) {
        this._setSearchSubscription();
        this.superUserDeleteEvent = this.userCapabilityService.isFunctionAvailable('EventManagement/DeleteEvent');
        this.superUserTrainingDeleteEvent = this.userCapabilityService.isFunctionAvailable('Training/ObbligatoriaProfessionisti/DeleteEvent');
    }

    degreeDisplayedColumns: string[];
    // selection = new SelectionModel<any>(true, []);
    private subject: Subject<string> = new Subject();

    ngOnInit(): void {
        this.sideMenuName();
        this.scopeId = this.activatedRoute.snapshot.paramMap.get('scopeId');
        if (this.scopeId !== null){
            this.hasScopeId = true;
        }else {
            this.hasScopeId = false;
        }
        this.eventDurationDrpValue = EventHelper.getEventDurationDrpValue();
        this.columnsToDisplay = EventHelper.getEventColumns();
        this.degreeDisplayedColumns = EventHelper.getDegreeDisplayedColumns();
        this.requestPara = new EventRequestParams(this.paginationModel.page, this.paginationModel.limit, '', '', '', 'allEvents', this.scopeId);
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.list) {
                this.selectedDate = params.list;
                this.filterByDates = params.list;
                this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.limit, this.listOfEventFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));
            } else {
                this.getListOfEventList({})
            }
        })


        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.authorId = authUser.person.id;
        }
    }

    sideMenuName(){
        this.sidebarMenuName = 'List of Events'; 
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    @ViewChild('searchBox') myInputVariable: ElementRef;
    @ViewChild('table') table: MatTable<any>;

    onKeyUp(searchTextValue: any): void {
        this.selection.clear();
        this.subject.next(searchTextValue);
    }

    expandedRows: { [key: number]: boolean } = {};


    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.listOfEventList.length;
        return numSelected === numRows;
    }

    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
        } else {
            this.listOfEventList.data.forEach(row => this.selection.select(row));
        }
    }

    onFilterListOfEvent() {
        this.selection.clear();
        const dialogRef = this.dialog.open(FilterListOfEventPopupComponent, {
            data: {
                data: this.listOfEventFilterData,
                scopeId: this.scopeId
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.listOfEventFilterData = result;
                this.updateChipsFilter();
                this.paginationModel.page = 1;
                this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.limit, this.listOfEventFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));
            }
        });
    }

    updateChipsFilter() {
        this.selection.clear();
        this.activeFilters = [];
        this.chipsFilters?.forEach(cf => {
            if (this.listOfEventFilterData[cf.field] && ((this.listOfEventFilterData[cf.field] != '') || (this.listOfEventFilterData[cf.field] != false))) {
                this.activeFilters.push({
                    columnCaption: cf.caption,
                    filterValue: ListOfEventFilterData.getFieldText(cf.field, this.listOfEventFilterData),
                    field: cf.field
                });
            }
        })
    }

    cancelEvent(event: any): void {
        const that = this;
        const dialogRef = this.dialog.open(CancelPopupComponent, {
            data: {
                message: this.translate.instant('MASTER_MODULE.Are You Sure You Want To Cancel This Event?'),
                heading: 'Cancel Event'
            }
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.helper.toggleLoaderVisibility(true);
                    that.ApiService.cancelListOfItem({id: event.id, authorId: this.authorId}).then((data: any) => {
                        const metaData: any = data.reason;
                        this.getListOfEventList(this.requestPara);
                        this.selection.clear();
                        this.listOfEventID = [];
                        EventHelper.showMessage('', this.translate.instant(data.meta.message), 'success');
                        this.helper.toggleLoaderVisibility(false);
                        if ((this.listOfEventList.length - 1) === 0) {
                            const pageNumber = this.paginationModel.page - 1;
                            this.pageChanged(pageNumber);
                            this.table.renderRows();
                        } else {
                            that.getListOfEventList(this.requestPara);
                        }
                        this.selection.clear();
                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        const e = err.error;
                        EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
                        this.selection.clear();
                    });
                }
            });
    }

    reActivateEvent(event: any): void {
        const that = this;
        const dialogRef = this.dialog.open(ReActivateEventPopupComponent, {
            data: {
                message: this.translate.instant('MASTER_MODULE.Are You Sure You Want To Re-Activate This Event?'),
                heading: 'Re-Activate Event'
            }
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.helper.toggleLoaderVisibility(true);
                    that.ApiService.reActivateListOfItem({id: event.id, authorId: this.authorId}).then((data: any) => {
                        const metaData: any = data.reason;
                        this.getListOfEventList(this.requestPara);
                        this.selection.clear();
                        this.listOfEventID = [];
                        EventHelper.showMessage('', this.translate.instant(data.meta.message), 'success');
                        this.helper.toggleLoaderVisibility(false);
                        if ((this.listOfEventList.length - 1) === 0) {
                            const pageNumber = this.paginationModel.page - 1;
                            this.pageChanged(pageNumber);
                            this.table.renderRows();
                        } else {
                            that.getListOfEventList(this.requestPara);
                        }
                        this.selection.clear();
                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        const e = err.error;
                        EventHelper.showMessage('', this.translate.instant(err.error.message), 'error');
                        this.selection.clear();
                    });
                }
            });
    }

    selectByDate(event) {
        this.router.navigate([], {
            queryParams: {
                'list': null,
            },
            queryParamsHandling: 'merge'
        })
        this.filterByDates = event.value;
        this.paginationModel.page = 1;
        this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.limit, this.listOfEventFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));
        this.selection.clear();
    }

    onChipRemoveAll() {
        this.activeFilters = [];
        this.listOfEventFilterData = new ListOfEventFilterData();
        this.settingsManagementService.setSettingsValue('listOfEventFilterData_V2', JSON.stringify(this.listOfEventFilterData));
        this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.limit, this.listOfEventFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));
    }

    onChipRemove(item) {
        this.selection.clear();
        this.activeFilters = this.activeFilters.filter(af => af.columnCaption != item.columnCaption);
        if (this.activeFilters.length > 0)
            this.listOfEventFilterData[item.field] = null;
        else
            this.listOfEventFilterData = new ListOfEventFilterData();

        this.settingsManagementService.setSettingsValue('listOfEventFilterData_V2', JSON.stringify(this.listOfEventFilterData));
        this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.limit, this.listOfEventFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));
    }

    async activityLogFunction(element, supplierId, index): Promise<void> {
        this.ApiService.getActivityLogList({eventId: supplierId, limit: null}).then((data: any) => {
            if (data.statusCode === 200) {
                this.activityLog = data.data;
            } else {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(data.reason), 'info');
            }
        });

    }

    private _setSearchSubscription(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.paginationModel.page = 1;
            this.listOfEventFilterData.freeSearch = this.search
            this.selection.clear();
            this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.limit, this.listOfEventFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));
        });
    }

    resetSearch() {
        this.search = null;
        this.listOfEventFilterData.freeSearch = null;
        this.myInputVariable.nativeElement.value = '';
        this.settingsManagementService.setSettingsValue('listOfEventFilterData_V2', JSON.stringify(this.listOfEventFilterData));
        this.selection.clear();
        this.paginationModel.page = 1;
        this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.limit, this.listOfEventFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));
    }


    deleteMultipleListOfEvent() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: 'Are you sure you want to delete selected Events ?',
                heading: 'Delete Event',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const that = this
                this.helper.toggleLoaderVisibility(true);
                if (this.selection.selected.length > 0) {
                    for (let i = 0; i < this.selection.selected.length; i++) {
                        let paraName: string = this.selection.selected[i].id;
                        this.listOfEventID.push(paraName);
                    }
                } else {
                    this.listOfEventID = [];
                }
                if (this.listOfEventID.length > 0) {
                    const credentials = localStorage.getItem('credentials');
                    if (credentials) {
                        const authUser: any = JSON.parse(credentials);
                        this.authorId = authUser.person.id;
                        this.companyId = authUser.person.companyId;
                    }
                    this.ApiService.multipleDeleteListOfEvent({id: this.listOfEventID, authorId: this.authorId, companyId: this.companyId}).subscribe((res: any) => {
                        if (res.statusCode === 200) {
                            this.getListOfEventList(this.requestPara);
                            this.helper.toggleLoaderVisibility(false);
                            this.selection.clear();
                            EventHelper.showMessage('', this.translate.instant('Swal_Message.DELETE_LIST_OF_EVENT'), 'success');
                            setTimeout(() => {
                                if ((this.listOfEventList.length) == 0) {
                                    let pageNumber = this.paginationModel.page - 1
                                    this.pageChanged(pageNumber);
                                    this.table.renderRows();
                                } else {
                                    this.getListOfEventList(this.requestPara);
                                }
                            }, 100);

                        } else {
                            this.helper.toggleLoaderVisibility(false);
                            EventHelper.showMessage('', this.translate.instant(res.reason), 'error');
                        }
                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        EventHelper.showMessage('', this.translate.instant(err.error.message), 'error');
                        this.selection.clear();
                    });
                } else {
                    this.helper.toggleLoaderVisibility(false);
                    EventHelper.showMessage('', this.translate.instant('Please select at least one event to delete.'), 'info');
                }
            }
        });
    }

    openDeleteListOfEvent(event: any): void {
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
                    that.ApiService.deleteListOfItem({id: event.id , companyId: this.companyId}).then((data: any) => {
                        this.getListOfEventList(this.requestPara);
                        this.selection.clear();
                        this.listOfEventID = [];
                        EventHelper.showMessage('', this.translate.instant('Swal_Message.DELETE_LIST_OF_EVENT'), 'success');
                        this.helper.toggleLoaderVisibility(false);
                        if ((this.listOfEventList.length - 1) === 0) {
                            const pageNumber = this.paginationModel.page - 1;
                            this.pageChanged(pageNumber);
                            this.table.renderRows();
                        } else {
                            that.getListOfEventList(this.requestPara);
                        }
                        this.selection.clear();
                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        EventHelper.showMessage('', this.translate.instant(err.error.message), 'error');
                        this.selection.clear();
                    });
                }
            });
    }

    async getListOfEventList(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiService.getListOfEventList(this.requestPara);
        if (res.statusCode === 200) {
            this.listOfEventList = res.data;
            this.paginationModel.totalItems = res.meta.totalCount;
            this.noRecordFound = this.listOfEventList.length > 0;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
        }
        this.helper.toggleLoaderVisibility(false);
    }

    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.listOfEventList);
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    edit(event: any): void {
        if (this.scopeId === null){
            this.router.navigate(['/event-management/event-list/create-event/' + event.id]);
        }else {
            this.router.navigate(['/training/event-list/create-event/' + event.id + '/' + this.scopeId]);
        }

    }

    viewDetail(event): void {
        if (this.scopeId === null){
            this.router.navigate(['/event-management/event-list/event-details/' + event.id]);
        }else {
            this.router.navigate(['/training/event-list/event-details/' + event.id + '/' + this.scopeId]);
        }

    }

    changeSorting(sortKey, sortBy): void {
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.paginationModel.page = 1;
        this.selection.clear();
        this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.limit, this.listOfEventFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));
    }

    pageChanged(page): void {
        this.selection.clear();
        this.getListOfEventList(this.requestPara = new EventRequestParams(page, this.paginationModel.itemsPerPage, this.search, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));
        this.paginationModel.page = page;
    }

    changeItemsPerPage(event): void {
        this.paginationModel.page = 1;
        this.paginationModel.itemsPerPage = event;
        this.selection.clear();
        this.paginationModel.limit = this.paginationModel.itemsPerPage;
        this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.itemsPerPage, this.listOfEventFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));
    }

    /**
     * compare two dates
     * Wrote this function to compare two dates because it was not wokring with the pipe
     * @param startDate
     * @param status
     * @param eventName
     * @returns
     */
    compareDates(startDate: any, status: any, eventName: string) {
        return EventHelper.compareEventDates(this.cancelledEvent, status, eventName, startDate, this.today);
    }


    openEditEventCredit(event):void{
        this.ApiService.getEditEvent({id: event.id}).then((res: any) => {
            this.eventCreditValue = res.data.checkpoints.eventCredit;
            this.eventCreditCountValue = res.data.checkpoints.eventCreditCount;
            const dialogRef = this.dialog.open(EditEventCreditPopupComponent, {
                data: {
                    heading: 'EVENT_MANAGEMENT.Edit Event Credit',
                    eventCreditPopValue: this.eventCreditValue,
                    eventCreditCountPopValue: this.eventCreditCountValue,
                }
            });
            dialogRef.afterClosed().subscribe(async result => {
                if (result) {
                    this.helper.toggleLoaderVisibility(true);
                    res.data.checkpoints.eventCredit = result.eventCredit;
                    res.data.checkpoints.eventCreditCount = result.eventCreditCount;
                    res.data.checkpoints.attendanceCertificate = result.eventCreditCount > 0 ? true : false;
                    res.data.isEditEventCredit = true;
                    let myArray = {
                        authorId: this.authorId,
                        ...res.data,

                    };
                    this.ApiService.getCreateEvent(myArray).then((res : any) => {
                        this.helper.toggleLoaderVisibility(false);
                        this.getListOfEventList(this.requestPara);
                        swal.fire(
                            '',
                            this.translate.instant('EVENT_MANAGEMENT.EventCreditUpdatedSuccessfully'),
                            'success'
                        )
                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        swal.fire(
                            '',
                            this.translate.instant(err.error.message),
                            'info'
                        )
                    });
                }
            });
        }, (err) => {
            swal.fire(
                'Info',
                this.translate.instant(err.error.message),
                'info'
            );
            this.router.navigate(['event-management/event-list/']);
        });

    }

    openListOfCount(eventID:any,eventName:any,eventCondition:any,checkInOutData:any, pendingCount:any,eventStatus:any){
        let headerName:any;
        if(eventCondition == null){
            headerName = this.translate.instant('Invitations for')+' '+ eventName +' '+this.translate.instant('event');
        }else if(eventCondition == 'accepted'){
            headerName = this.translate.instant('Accepted invitations for') +' '+ eventName +' '+this.translate.instant('event');
        }else if(eventCondition == 'declined'){
            headerName = this.translate.instant('Declined invitations for') +' '+ eventName +' '+this.translate.instant('event');
        }else if(eventCondition == 'pending'){
            headerName = this.translate.instant('Pending invitation for') + ' ' + eventName +' '+this.translate.instant('event');
        }else if(eventCondition == 'checkIn'){
            headerName = this.translate.instant('Check in users for') + ' ' + eventName +' '+this.translate.instant('event');
        }else if(eventCondition == 'checkOut'){
            headerName = this.translate.instant('Check out users for') + ' ' + eventName +' '+this.translate.instant('event');
        }else if(eventCondition == 'checksInOut'){
            headerName = this.translate.instant('Checks users for') + ' ' + eventName +' '+this.translate.instant('event');
        }
        this.dialog.open(EventListPopupComponent, {
            data: {
                eventID: eventID,
                heading: headerName,
                condition: eventCondition,
                checkInOutData: checkInOutData,
                pendingCountData: pendingCount,
                eventListStatus:eventStatus
            }
        });
    }

    async onRefreshTable() {
        this.search = '';
        this.paginationModel.page = 1;
        this.listOfEventFilterData.area = null;
        this.listOfEventFilterData.costCenter = null;
        this.listOfEventFilterData.costCenterName = '';
        this.listOfEventFilterData.endDate = null;
        this.listOfEventFilterData.endDateFt = '';
        this.listOfEventFilterData.freeSearch = null;
        this.listOfEventFilterData.name = null;
        this.listOfEventFilterData.scope = null;
        this.listOfEventFilterData.scopeName = '';
        this.listOfEventFilterData.startDate = null;
        this.listOfEventFilterData.startDateFt = '';
        this.listOfEventFilterData.type = null;
        this.onChipRemoveAll()
        // this.filterByDates = "allEvents"
        // this.selectedDate = "allEvents"
        this.selection.clear();
        document.body.classList.add('spin-animation');
        setTimeout(function(){
            document.body.classList.remove('spin-animation');
        }, 1000);
        await this.getListOfEventList(this.requestPara);
    }

}
