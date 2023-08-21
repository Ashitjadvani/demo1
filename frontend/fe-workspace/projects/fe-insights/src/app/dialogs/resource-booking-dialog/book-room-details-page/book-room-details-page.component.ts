import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IrinaResource } from 'projects/fe-common/src/lib/models/bookable-assets';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AttendeeSelected, BookableAssetsManagementService } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { AttendeePickerComponent } from '../attendee-picker/attendee-picker.component';

@Component({
  selector: 'app-book-room-details-page',
  templateUrl: './book-room-details-page.component.html',
  styleUrls: ['./book-room-details-page.component.scss']
})
export class BookRoomDetailsPageComponent implements OnInit {
    @Input() resourceItem: IrinaResource;
    @Input() meetingDate: string;
    @Input() meetingStartTime: string;
    @Input() meetingEndTime: string;
    @Input() standalone = false;

    @Output() bookComplete: EventEmitter<void> = new EventEmitter();

    bookFormGroup: FormGroup;

    meetingAttendees: AttendeeSelected[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private notifyManagementService: NotifyManagementService,
        private commonService: CommonService,
        private changeDetectorRef: ChangeDetectorRef,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private bookableAssetsManagementService: BookableAssetsManagementService,
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        public translate: TranslateService
    ) { }

    ngOnInit() {
        if (!!this.route.snapshot.queryParams['standalone'])
            this.standalone = this.route.snapshot.queryParams['standalone'];
        if (!!this.route.snapshot.queryParams['meetingDate'])
            this.meetingDate = this.route.snapshot.queryParams['meetingDate'];
        if (!!this.route.snapshot.queryParams['meetingStartTime'])
            this.meetingStartTime = this.route.snapshot.queryParams['meetingStartTime'];
        if (!!this.route.snapshot.queryParams['meetingEndTime'])
            this.meetingEndTime = this.route.snapshot.queryParams['meetingEndTime'];
        if (!!this.route.snapshot.queryParams['resourceItem'])
            this.resourceItem = JSON.parse(this.route.snapshot.queryParams['resourceItem']);
        this.bookFormGroup = this.formBuilder.group({
            title: ["", Validators.required],
            notes: ""
        });
    }

    displayDate() {
        return this.commonService.dateDisplayFormat(new Date(this.meetingDate));
    }

    safeDisplayResourceDescription() {
        return "TODO";
    }

    getRoomMaxCapacity() {
        return this.resourceItem ? this.resourceItem.custom.capacity : '-';
    }

    async onClickConfirm() {
        let meetingDate = this.commonService.toYYYYMMDD(this.meetingDate);
        let startTime = this.commonService.dateFromHHMM(this.meetingStartTime);
        let endTime = this.commonService.dateFromHHMM(this.meetingEndTime);
        let title = this.bookFormGroup.get("title").value;
        let notes = this.bookFormGroup.get("notes").value;

        let res = await this.bookableAssetsManagementService.resourceReserveTimeframe(this.resourceItem.type, this.resourceItem.code, meetingDate, startTime, endTime, title, notes, this.meetingAttendees);
        if (this.commonService.isValidResponse(res)) {
            this.notifyManagementService.displaySuccessSnackBar(this.translate.instant('GENERAL.BOOKING SUCCESSFULLY CREATED'));
            this.bookComplete.emit();
        } else {
            this.notifyManagementService.displaySuccessSnackBar('Error: ' + res.reason);
        }
    }

    async addMeetingAttendee() {
        let attendeeSelected = await this.dialog.open(AttendeePickerComponent, {
            width: '300px',
            panelClass: 'custom-dialog-container',
            data: null
        }).afterClosed().toPromise();
        if (attendeeSelected) {
            this.onSelectedAttendee(attendeeSelected);
        }
    }

    onSelectedAttendee(attendee: AttendeeSelected) {
        if (!this.meetingAttendees.find(ma => ma.email == attendee.email))
            this.meetingAttendees.push(attendee);
    }

    deleteMeetingAttendee(attendee: AttendeeSelected) {
        this.meetingAttendees = this.meetingAttendees.filter(ma => ma.email != attendee.email);
    }
}
