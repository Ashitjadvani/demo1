import {HttpResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router, ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DataStorageManagementService} from 'projects/fe-common-v2/src/lib/services/data-storage-management.service';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import {MasterDocumentTypeService} from 'projects/fe-common-v2/src/lib/services/master-document-type.service';
import {RecruitingManagementService} from 'projects/fe-common-v2/src/lib/services/recruiting-management.service';
import {DeletePopupComponent} from 'projects/fe-insights-v2/src/app/popup/delete-popup/delete-popup.component';
import {MCPHelperService} from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import {environment} from 'projects/fe-insights-v2/src/environments/environment';
import Swal from 'sweetalert2';
import {EventHelper, EventRequestParams, PaginationModel} from 'projects/fe-common-v2/src/lib';
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {EventStatus} from "../../../../../../../fe-common-v2/src/lib/enums/event-status.enum";
import {UserCapabilityService} from "../../../../service/user-capability.service";
import {EditEventCreditPopupComponent} from "../../../../popup/edit-event-credit-popup/edit-event-credit-popup.component";
import swal from "sweetalert2";
import {Sort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import {PeriodicElement} from "../../../quiz-survey/questions/add-edit-question/add-edit-question.component";
import {EditAttendeeUserCreditPopupComponent} from "../../../../popup/edit-attendee-user-credit-popup/edit-attendee-user-credit-popup.component";
import { EventListPopupComponent } from 'projects/fe-insights-v2/src/app/popup/event-list-popup/event-list-popup.component';
import {EventManagementSettingService} from "../../../../../../../fe-common-v2/src/lib/services/event-management-setting.service";
import {error} from "ng-packagr/lib/utils/log";

@Component({
    selector: 'app-event-details',
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.scss'],
    animations: [EventHelper.animationForDetailExpand()]
})
export class EventDetailsComponent implements OnInit {
    id: any = 0;
    companyId: any;
    authorId: any;
    userId: any;
    sortKey: any = '-1';
    sortBy = null;
    sortClass: any = 'down';
    noRecordFound = false;
    eventData: any = [];
    venueData: any = [];
    vanueArry: any = [];
    insightsData:any=[];
    resourcesData: any = [];
    serviceData: any = [];
    checkPointData: any = [];
    QRdownloadLink: any = '';
    showQRcode: boolean = false;
    documentData: any = [];
    newDocumentArry: any = [];
    fileDetails: any = [];
    documentTabName: any = [];
    documentTypeList: any = [];
    // Attendee tab data
    ownerInternalData: any = [];
    organizerInternalData: any = [];
    speakerInternalData: any = [];
    attendeeInternalData: any = [];
    techSupportInternalData: any = [];
    ownerExternalData: any = [];
    organizerExternalData: any = [];
    speakerExternalData: any = [];
    attendeeExternalData: any = [];
    concludedEvent: number = EventStatus.concluded;
    currentEvent: number = EventStatus.current;
    scheduledEvent: number = EventStatus.scheduled;
    currentEventStatus:boolean=false;
    techSupportExternalData: any = [];
    assitantInternalData: any = [];
    assitantExternalData: any = [];
    scopeId: any;
    hasScopeId: boolean = false;
    htmlContent: any;
    isMeetingLinkActiveBySecretCode: any;

    activityLog: any;
    columnsToDisplay = [];
    expandedElement: any | null;
    superUserDeleteEvent: boolean = false;
    superUserTrainingDeleteEvent: boolean = false;
    isDeletable: boolean = false;
    @ViewChild('ownerInternalTableData') ownerInternalTableData: MatTable<PeriodicElement>;
    @ViewChild('ownerExternalTableData') ownerExternalTableData: MatTable<PeriodicElement>;
    @ViewChild('organizerInternalTableData') organizerInternalTableData: MatTable<PeriodicElement>;
    @ViewChild('organizerExternalTableData') organizerExternalTableData: MatTable<PeriodicElement>;
    @ViewChild('speakerInternalTableData') speakerInternalTableData: MatTable<PeriodicElement>;
    @ViewChild('speakerExternalTableData') speakerExternalTableData: MatTable<PeriodicElement>;
    @ViewChild('attendeeInternalTableData') attendeeInternalTableData: MatTable<PeriodicElement>;
    @ViewChild('attendeeExternalTableData') attendeeExternalTableData: MatTable<PeriodicElement>;
    @ViewChild('techSupportInternalTableData') techSupportInternalTableData: MatTable<PeriodicElement>;
    @ViewChild('techSupportExternalTableData') techSupportExternalTableData: MatTable<PeriodicElement>;
    @ViewChild('assitantInternalTableData') assitantInternalTableData: MatTable<PeriodicElement>;
    @ViewChild('assitantExternalTableData') assitantExternalTableData: MatTable<PeriodicElement>;


    fromAssetsData: any[] = [
        {assetType: 'test', resources: 'internal'},
        {assetType: 'test', resources: 'internal'},
    ];
    attendeeList: any = [];
    attendeeNameDisplayedColumns: string[] = ['role', 'type', 'firstName', 'surname', 'sendCertificate'];
    config: AngularEditorConfig = {
        sanitize: false,
        editable: true,
        spellcheck: true,
        height: '13rem',
        minHeight: '4rem',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        toolbarHiddenButtons: [
            ['insertVideo']
        ],
        customClasses: [
            {
                name: 'LineHeight-15px',
                class: 'LineHeight-15px',
            },
            {
                name: 'LineHeight-20px',
                class: 'LineHeight-20px',
            },
            {
                name: 'LineHeight-25px',
                class: 'LineHeight-25px',
            },
            {
                name: 'LineHeight-30px',
                class: 'LineHeight-30px',
            },
            {
                name: 'Text-justify',
                class: 'Text-justify',
            }
        ],
    };
    calendarCreateEvent: any;
    isCalendar : any;
    Webex_CheckIn_URL : any;
    checkEventType : boolean = false;

    constructor(
        public translate: TranslateService,
        private router: Router,
        public dialog: MatDialog,
        public eventAPI: EventManagementListOfEventService,
        public route: ActivatedRoute,
        private helper: MCPHelperService,
        private recruitingManagementService: RecruitingManagementService,
        private ApiService: MasterDocumentTypeService,
        private GeneralSettingsAPiService: EventManagementSettingService,
        private userCapabilityService: UserCapabilityService,
    ) {
        this.superUserDeleteEvent = this.userCapabilityService.isFunctionAvailable('EventManagement/DeleteEvent');
        this.superUserTrainingDeleteEvent = this.userCapabilityService.isFunctionAvailable('Training/ObbligatoriaProfessionisti/DeleteEvent');
    }
    /*patchDataGeneralSettings() {
        this.ApiService.getListForGeneralSettings({}).subscribe((data: any) => {
            const documentData = data.data;
            this.generalSettingForm.patchValue({
                id: documentData.id,
                baseURL: documentData.baseURL
            });
        });
    }*/
    ngOnInit(): void {
        this.sideMenuName();
        this.id = this.route.snapshot.paramMap.get('id');
        this.GeneralSettingsAPiService.getListForGeneralSettings({}).subscribe((data: any) => {
            const documentData = data.data;
            this.Webex_CheckIn_URL = documentData.baseURL + 'event/event-checkin/' + this.id;
        });

        this.calendarCreateEvent = this.route.snapshot.queryParams
        this.isCalendar = this.calendarCreateEvent.redirection
        this.scopeId = this.route.snapshot.paramMap.get('scopeId');
        if (this.scopeId !== null) {
            this.hasScopeId = true;
        } else {
            this.hasScopeId = false;
        }
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.companyId = authUser.person.companyId;
            this.authorId = authUser.person.id;
        }
        this.columnsToDisplay = EventHelper.getEventColumns();
        this.ownerDataDisplayedColumns = EventHelper.attendeesDetailsDataDisplayedColumns();
        this.getEventData();
        this.getEventInsightsCount();
    }
    sidebarMenuName:any;
    sideMenuName(){
        this.sidebarMenuName = 'List of Events';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }
    assetsDataDisplayedColumns: string[] = ['assetType', 'resources'];
    ownerDataDisplayedColumns: string[] = [];
    assistantDataDisplayedColumns: string[] = ['name', 'surname', 'email', 'status', 'action'];
    expandedRows: { [key: number]: boolean } = {};

    // Sorting
    changeSorting(sortBy, sortKey): void {
        this.sortBy = sortBy;
        this.sortKey = (sortKey === '-1') ? '1' : '-1';
    }

    async getEventData(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        await this.eventAPI.getEditEvent({id: this.id}).then(async (res: any) => {
            if (res.statusCode === 200) {
                this.helper.toggleLoaderVisibility(false);
                this.eventData = res.data;
                this.venueData = this.eventData.venue;
                this.vanueArry = this.venueData.vanue;
                this.resourcesData = this.eventData.resources;
                this.serviceData = this.eventData.services;
                this.serviceData = this.eventData.services;
                this.ownerInternalData = this.eventData?.attendees?.owner?.internal ? this.eventData?.attendees?.owner?.internal : [];
                this.ownerExternalData = this.eventData?.attendees?.owner?.external ? this.eventData?.attendees?.owner?.external : [];
                this.organizerInternalData = this.eventData?.attendees?.organizer?.internal ? this.eventData?.attendees?.organizer?.internal : [];
                this.organizerExternalData = this.eventData?.attendees?.organizer?.external ? this.eventData?.attendees?.organizer?.external : [];
                this.speakerInternalData = this.eventData?.attendees?.speaker?.internal ? this.eventData?.attendees?.speaker?.internal : [];
                this.speakerExternalData = this.eventData?.attendees?.speaker?.external ? this.eventData?.attendees?.speaker?.external : [];
                this.attendeeInternalData = this.eventData?.attendees?.attendee?.internal ? this.eventData?.attendees?.attendee?.internal : [];
                this.attendeeExternalData = this.eventData?.attendees?.attendee?.external ? this.eventData?.attendees?.attendee?.external : [];
                this.techSupportInternalData = this.eventData?.attendees?.technicalSupport?.internal ? this.eventData?.attendees?.technicalSupport?.internal : [];
                this.techSupportExternalData = this.eventData?.attendees?.technicalSupport?.external ? this.eventData?.attendees?.technicalSupport?.external : [];
                this.assitantInternalData = this.eventData?.attendees?.assistant?.internal ? this.eventData?.attendees?.assistant?.internal : [];
                this.assitantExternalData = this.eventData?.attendees?.assistant?.external ? this.eventData?.attendees?.assistant?.external : [];
                this.checkPointData = this.eventData.checkpoints;
                this.htmlContent = this.checkPointData.attendeeCertificateData;
                this.documentData = this.eventData.documents;
                this.attendeeList = this.eventData.checkpoints.attendeeCertificateUses;
                this.isMeetingLinkActiveBySecretCode = this.eventData.isMeetingLinkActiveBySecretCode;
                if (this.documentData.length != 0) {
                    const response: any = await this.ApiService.getDocumentType({limit: null});
                    this.documentTypeList = response.data;
                    for (let i = 0; i < this.documentData.length; i++) {
                        let selectedDocId = this.documentData[i]?.documentTypeId;
                        let selectedTabName: any;
                        for (let j = 0; j < this.documentTypeList.length; j++) {
                            if (selectedDocId == this.documentTypeList[j]?.id) {
                                selectedTabName = this.documentTypeList[j]?.name;
                            }
                        }
                        const imageLink = environment.api_host + '/v2/data-storage/download/' + this.documentData[i]?.imageId;
                        this.fileDetails.push({imageLink: imageLink, tabName: selectedTabName});
                    }
                }
                this.showQRcode = this.eventData.QRCode;
                if (this.showQRcode) {
                    this.recruitingManagementService.createQRCodeAcceptEvent(this.id).subscribe((event) => {
                        if (event instanceof HttpResponse) {
                            this.QRdownloadLink = event.body.data.qrcode;
                        }
                    }, (error) => {
                        Swal.fire('', this.translate.instant(error.error.message), 'info');
                    });
                }

                var isConcludedEvent = this.eventData.status === this.concludedEvent;
                var isCurrentEvent = this.eventData.status === this.currentEvent;
                var isSuperUserDeleteEvent = this.superUserDeleteEvent === false && (isConcludedEvent || isCurrentEvent);
                var isSuperUserTrainingDeleteEvent = this.superUserTrainingDeleteEvent === false && (isConcludedEvent || isCurrentEvent);
                if (this.scopeId === null ? isSuperUserDeleteEvent : isSuperUserTrainingDeleteEvent) {
                    this.isDeletable = true;
                } else {
                    this.isDeletable = false;
                }

                if (this.eventData.type == 'live'){
                    this.checkEventType = false;
                    this.ownerDataDisplayedColumns = EventHelper.liveAttendeesDetailsDataDisplayedColumns();
                }else {
                    this.checkEventType = true;
                    this.ownerDataDisplayedColumns = EventHelper.attendeesDetailsDataDisplayedColumns();
                }


            } else {
                this.helper.toggleLoaderVisibility(false);
                Swal.fire('', this.translate.instant(res.reason), 'info');
                this.router.navigate(['/event-management/event-list/']);
            }
        }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            Swal.fire(
                '',
                err.error.message,
                'info'
            );
            this.router.navigate(['event-management/event-list/']);
        });
    }

    async getEventInsightsCount(){
        this.helper.toggleLoaderVisibility(true);
        await this.eventAPI.getEventDetailsCount({id:this.id}).then((res:any) =>{
            if(res.statusCode == 200){
                this.insightsData = res.data;

                this.helper.toggleLoaderVisibility(false);
            }else{
                this.helper.toggleLoaderVisibility(false);
                Swal.fire('', this.translate.instant(res.reason), 'info');
                this.router.navigate(['/event-management/event-list/']);
            }
        },(err)=>{
            this.helper.toggleLoaderVisibility(false);
            Swal.fire(
                '',
                err.error.message,
                'info'
            );
            this.router.navigate(['event-management/event-list/']);
        });
    }

    edit(): void {
        this.router.navigate(['/event-management/event-list/create-event/' + this.id]);
    }

    openDeleteListOfEvent(): void {
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
                    that.eventAPI.deleteListOfItem({id: this.id, companyId: this.companyId}).then((data: any) => {
                        const metaData: any = data.reason;
                        Swal.fire(
                            '',
                            this.translate.instant('Swal_Message.DELETE_LIST_OF_EVENT'),
                            'success'
                        );
                        this.router.navigate(['/event-management/event-list'])
                        this.helper.toggleLoaderVisibility(false);

                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        const e = err.error;
                        Swal.fire(
                            '',
                            this.translate.instant(err.error.message),
                            'info'
                        );
                    });
                }
            });

    }

    editEventCredit(event): void {
        this.userId = event.id;
        const dialogRef = this.dialog.open(EditAttendeeUserCreditPopupComponent, {
            data: {
                heading: 'EVENT_MANAGEMENT.EditUserCredits',
                userCredit: event.eventCreditCount,
            }
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                this.helper.toggleLoaderVisibility(true);
                this.eventAPI.editAttendeesCredit({id: this.id , userId: this.userId, eventCreditCount: result.userCredit}).then((res: any) => {
                    if (res.statusCode === 200){
                        this.helper.toggleLoaderVisibility(false);
                        this.eventData = res.data;
                        this.ownerInternalData = this.eventData?.attendees?.owner?.internal ? this.eventData?.attendees?.owner?.internal : [];
                        this.ownerExternalData = this.eventData?.attendees?.owner?.external ? this.eventData?.attendees?.owner?.external : [];
                        this.organizerInternalData = this.eventData?.attendees?.organizer?.internal ? this.eventData?.attendees?.organizer?.internal : [];
                        this.organizerExternalData = this.eventData?.attendees?.organizer?.external ? this.eventData?.attendees?.organizer?.external : [];
                        this.speakerInternalData = this.eventData?.attendees?.speaker?.internal ? this.eventData?.attendees?.speaker?.internal : [];
                        this.speakerExternalData = this.eventData?.attendees?.speaker?.external ? this.eventData?.attendees?.speaker?.external : [];
                        this.attendeeInternalData = this.eventData?.attendees?.attendee?.internal ? this.eventData?.attendees?.attendee?.internal : [];
                        this.attendeeExternalData = this.eventData?.attendees?.attendee?.external ? this.eventData?.attendees?.attendee?.external : [];
                        this.techSupportInternalData = this.eventData?.attendees?.technicalSupport?.internal ? this.eventData?.attendees?.technicalSupport?.internal : [];
                        this.techSupportExternalData = this.eventData?.attendees?.technicalSupport?.external ? this.eventData?.attendees?.technicalSupport?.external : [];
                        this.assitantInternalData = this.eventData?.attendees?.assistant?.internal ? this.eventData?.attendees?.assistant?.internal : [];
                        this.assitantExternalData = this.eventData?.attendees?.assistant?.external ? this.eventData?.attendees?.assistant?.external : [];
                        Swal.fire('', this.translate.instant('EVENT_MANAGEMENT.userCreditsChangesSuccessfully'), 'success');
                    } else {
                        this.helper.toggleLoaderVisibility(false);
                        Swal.fire('', this.translate.instant(res.reason), 'info');
                        this.router.navigate(['/event-management/event-list/']);
                    }
                }, (err) => {
                    swal.fire(
                        'Info',
                        this.translate.instant(err.error.message),
                        'info'
                    );
                    //this.router.navigate(['event-management/event-list/']);
                });
            }
        });
    }

    async activityLogFunction(element, peopleEmail, peopleId, index): Promise<void> {
        this.eventAPI.getAttendeeActivityLogList({
            eventId: this.id,
            limit: null,
            email: peopleEmail
        }).then((data: any) => {
            if (data.statusCode === 200) {
                this.activityLog = data.data;
            } else {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(data.reason), 'info');
            }
        });
    }

    changeSort(sort: Sort, sortingUserType: any) {
        if (sortingUserType == 'ownerInternalTableSorting') {
            this.ownerInternalData = this.ownerInternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.ownerInternalTableData.renderRows();
        } else if (sortingUserType == 'ownerExternalTableSorting') {
            this.ownerExternalData = this.ownerExternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.ownerExternalTableData.renderRows();
        } else if (sortingUserType == 'organizerInternalTableData') {
            this.organizerInternalData = this.organizerInternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.organizerInternalTableData.renderRows();
        } else if (sortingUserType == 'organizerExternalTableData') {
            this.organizerExternalData = this.organizerExternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.organizerExternalTableData.renderRows();
        } else if (sortingUserType == 'speakerInternalTableData') {
            this.speakerInternalData = this.speakerInternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.speakerInternalTableData.renderRows();
        } else if (sortingUserType == 'speakerExternalTableData') {
            this.speakerExternalData = this.speakerExternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.speakerExternalTableData.renderRows();
        } else if (sortingUserType == 'attendeeInternalTableData') {
            this.attendeeInternalData = this.attendeeInternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.attendeeInternalTableData.renderRows();
        } else if (sortingUserType == 'attendeeExternalTableData') {
            this.attendeeExternalData = this.attendeeExternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.attendeeExternalTableData.renderRows();
        } else if (sortingUserType == 'techSupportInternalTableData') {
            this.techSupportInternalData = this.techSupportInternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.techSupportInternalTableData.renderRows();
        } else if (sortingUserType == 'techSupportExternalTableData') {
            this.techSupportExternalData = this.techSupportExternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.techSupportExternalTableData.renderRows();
        } else if (sortingUserType == 'assitantInternalTableData') {
            this.assitantInternalData = this.assitantInternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.assitantInternalTableData.renderRows();
        } else if (sortingUserType == 'assitantExternalTableData') {
            this.assitantExternalData = this.assitantExternalData.sort((a, b) => {
                const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
                return sort.direction == 'asc' ? value : -value
            })
            this.assitantExternalTableData.renderRows();
        }

    }

    openListOfCount(eventCondition:any,checkInOutData:any, pendingCount:any){
        let headerName:any;
        if(eventCondition == null){
            headerName = this.translate.instant('Invitations for')+' '+ this.eventData.name +' '+this.translate.instant('event');
        }else if(eventCondition == 'accepted'){
            headerName = this.translate.instant('Accepted invitations for') +' '+ this.eventData.name +' '+this.translate.instant('event');
        }else if(eventCondition == 'declined'){
            headerName = this.translate.instant('Declined invitations for') +' '+ this.eventData.name +' '+this.translate.instant('event');
        }else if(eventCondition == 'pending'){
            headerName = this.translate.instant('Pending invitation for') + ' ' + this.eventData.name +' '+this.translate.instant('event');
        }else if(eventCondition == 'checkIn'){
            headerName = this.translate.instant('Check in users for') + ' ' + this.eventData.name +' '+this.translate.instant('event');
        }else if(eventCondition == 'checkOut'){
            headerName = this.translate.instant('Check out users for') + ' ' + this.eventData.name +' '+this.translate.instant('event');
        }else if(eventCondition == 'checksInOut'){
            headerName = this.translate.instant('Checks users for') + ' ' + this.eventData.name +' '+this.translate.instant('event');
        }else if(eventCondition == 'checkpointsCompiled'){
            headerName = this.translate.instant('Checkopoints compiled for') + ' ' + this.eventData.name +' '+this.translate.instant('event');
        }else if(eventCondition == 'accuredCredit'){
            headerName = this.translate.instant('Accured credit for') + ' ' + this.eventData.name +' '+this.translate.instant('event');
        }
        this.dialog.open(EventListPopupComponent, {
            data: {
                eventID: this.id,
                heading: headerName,
                condition: eventCondition,
                checkInOutData: checkInOutData,
                pendingCountData: pendingCount,
                eventListStatus: this.eventData.status
            }
        });
    }

    copyBoardURL(): void {
        swal.fire(
            '',
            //this.translate.instant('Webex checkIn URL copied to clipboard'),
            this.translate.instant('EVENT_MANAGEMENT.WebexCheckInURLCopiedToClipboard'),
            'success'
        )
    }

    sendPersonalCodeToAttendee(attendeeId: number){
        this.eventAPI.sendIndividualPersonalPincodeEmail({eventId: this.id,attendeeId: attendeeId}).then((data: any) => {
            this.helper.toggleLoaderVisibility(false);
            if (data.statusCode === 200) {
                Swal.fire('', this.translate.instant(data.meta.message), 'success');
            } else {
                Swal.fire('', this.translate.instant(data.message), 'info');
            }

        }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(err.message), 'info');
        });
    }

}
