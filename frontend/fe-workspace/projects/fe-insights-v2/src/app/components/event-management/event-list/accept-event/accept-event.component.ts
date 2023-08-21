import {AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import {MCPHelperService} from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import Swal from 'sweetalert2';
import * as FileSaver from "file-saver";
import {HttpResponse} from '@angular/common/http';
import {RecruitingManagementService} from 'projects/fe-common-v2/src/lib/services/recruiting-management.service';
import {EventHelper} from 'projects/fe-common-v2/src/lib';
import swal from "sweetalert2";

declare var gapi: any;

@Component({
    selector: 'app-accept-event',
    templateUrl: './accept-event.component.html',
    styleUrls: ['./accept-event.component.scss']
})
export class AcceptEventComponent implements OnInit, OnDestroy {
    eventAllData: any;
    id: string;
    attendeeId: number;
    eventName: string;
    downloadLink: any = '';
    responseInsert: any;
    tokenClient: any
    eventDetailsForGoogle: any
    downloadICSLink: any = '';
    userRole: any = '';
    oppsError: boolean = false;
    invitationMessage: any;
    errorMessage: any;
    qrImage: boolean;
    successImage: boolean;

    constructor(
        public eventAPI: EventManagementListOfEventService,
        public route: ActivatedRoute,
        public translate: TranslateService,
        public helper: MCPHelperService,
        private recruitingManagementService: RecruitingManagementService
        ) {
    }

    ngOnInit(): void {
        document.body.classList.add('full-page');
        this.id = this.route.snapshot.paramMap.get('id');
        this.attendeeId = Number (this.route.snapshot.paramMap.get('attendeeId'));
        this.createQRCodeData(this.id);
        this.acceptEventData();
    }

    async acceptEventData() {
        this.helper.toggleLoaderVisibility(true);
        const eventData = {id: this.id, attendeeId: this.attendeeId, invitationStatus: 'accepted'}
        await this.eventAPI.acceptEventByMail(eventData).then((res: any) => {
            if (res.statusCode == 200) {
                this.oppsError = false;
                this.eventAllData = res.data;
                this.eventName = this.eventAllData.eventdata.name;
                this.userRole = this.eventAllData.UserRole;
                this.eventDetailsForGoogle = this.eventAllData.eventdata;
                this.invitationMessage = res.meta.message
                if ((this.userRole == 'owner') || (this.userRole == 'organizer') || (this.userRole == 'speaker')) {
                    this.qrImage = true
                } else if ((this.userRole == 'attendee') || (this.userRole == 'technicalSupport') || (this.userRole == 'assistant')) {
                    this.successImage = true
                } else {
                    this.qrImage = false
                    this.successImage = false
                }
                this.helper.toggleLoaderVisibility(false);
            } else {
                this.oppsError = true;
                this.helper.toggleLoaderVisibility(false);
            }
            this.helper.toggleLoaderVisibility(false);
        }, (err) => {
            this.oppsError = true;
            this.errorMessage = err.error.message;
            this.helper.toggleLoaderVisibility(false);
        });

    }

    async createQRCodeData(eventId: any) {
        this.helper.toggleLoaderVisibility(true);
        var that = this;
        this.recruitingManagementService.createQRCodeAcceptEvent(eventId).subscribe((event) => {
            if (event instanceof HttpResponse) {
                that.downloadLink = event.body.data.qrcode;
                this.helper.toggleLoaderVisibility(false);
            }
        }, (error) => {
            this.helper.toggleLoaderVisibility(false);
            Swal.fire(
                '',
                error.error.message,
                'info'
            )
        });
    }

    async downloadICSFile() {
        this.helper.toggleLoaderVisibility(true);
        var that = this;
        this.createICSFile(that.id);
    }

    async createICSFile(eventId: any) {
        var that = this;
        this.eventAPI.createICSAPI({id: eventId}).then((res: any) => {
            if (res instanceof HttpResponse) {
                that.downloadICSLink = res.body.data.qrcode;
            }
            if (res.statusCode == '200'){
                this.eventAPI.downloadICSAPI({id: that.id}).then((res: any) => {
                    const blob = new Blob([res], {type: 'application/ics'});
                    FileSaver.saveAs(blob, this.eventName + '.ICS');
                    this.helper.toggleLoaderVisibility(false);
                }, (error) => {
                    Swal.fire(
                        '',
                        error.error.message,
                        'info'
                    )
                });
            }
        }, (error) => {
            swal.fire(
                '',
                this.translate.instant(error.error.message),
                'info'
            )
        });
    }

    ngOnDestroy(): void {
        document.body.classList.remove('full-page');
    }

}
