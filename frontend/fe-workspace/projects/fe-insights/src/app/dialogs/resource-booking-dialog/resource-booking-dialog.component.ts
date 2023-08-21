import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { IrinaResource, IrinaResourceType, RESOURCE_TYPE } from 'projects/fe-common/src/lib/models/bookable-assets';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { BookableAssetsManagementService } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { UserManagementDialogComponent } from '../user-management-dialog/user-management-dialog.component';

@Component({
    selector: 'app-resource-booking-dialog',
    templateUrl: './resource-booking-dialog.component.html',
    styleUrls: ['./resource-booking-dialog.component.scss']
})
export class ResourceBookingDialogComponent implements OnInit {
    @ViewChild('stepper', { static: false }) stepper: MatStepper;

    selectedResource: any;

    searchFormGroup: FormGroup;

    locationSelected: string;
    areaSelected: string;
    layoutSelected: string;

    selectedDate: Date;
    selectedCapacity: number = 2;
    selectedStartTime: Date;
    selectedEndTime: Date;

    loading: boolean;

    searchResults: IrinaResource[];
    currAccount: Person;

    sites: Site[] = [];
    roomResourceType: IrinaResourceType = IrinaResourceType.Empty();

    constructor(public dialogRef: MatDialogRef<UserManagementDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        private bookableAssetsManagementService: BookableAssetsManagementService,
        private changeDetectorRef: ChangeDetectorRef,
        public commonService: CommonService,
        public translate: TranslateService,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) data: any) { }

    async ngOnInit() {
        this.loading = true;
        this.currAccount = this.userManagementService.getAccount();

        await this.loadSites();
        await this.loadRoomResourceType();

        this.searchFormGroup = this.formBuilder.group({
            location: ["", Validators.required],
            area: ["", Validators.required],
            layout: ["", Validators.required],
            meetingDate: ["", Validators.required],
            meetingStartTime: ["", Validators.required],
            meetingEndTime: ["", Validators.required],
            capacity: ["", Validators.required]
        });

        let bookingDate = new Date();

        this.selectedDate = new Date();
        this.selectedStartTime = bookingDate;
        this.selectedEndTime = this.commonService.dateHoursOffset(bookingDate, 1);

        this.searchFormGroup.get("meetingDate").setValue(bookingDate);
        this.searchFormGroup.get("capacity").setValue(this.selectedCapacity);
        this.searchFormGroup.get("meetingStartTime").setValue(this.selectedStartTime);
        this.searchFormGroup.get("meetingEndTime").setValue(this.selectedEndTime);

        this.loading = false;
    }

    async loadSites() {
        let res = await this.adminSiteManagementService.getSites(this.currAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.sites = res.sites;
            this.locationSelected = (this.sites.length > 0) ? this.sites[0].id : null;
        } else {
            this.sites = [];
        }
    }

    async loadRoomResourceType() {
        let res = await this.bookableAssetsManagementService.getBookableResourceTypes();
        if (this.commonService.isValidResponse(res)) {
            this.roomResourceType = res.data.find(rt => rt.type == RESOURCE_TYPE.ROOM);

            this.areaSelected = 'all';
            this.layoutSelected = 'all';
        }
    }

    getEventTime(isStart: boolean) {
        if (isStart)
            return this.commonService.timeFormat(this.selectedStartTime);
        else
            return this.commonService.timeFormat(this.selectedEndTime);
    }

    onEventTimeChange(isStart: boolean, time: string) {
        if (this.commonService.isValidHHMM(time))
            this.setEventTime(isStart, time);
    }

    setEventTime(isStart: boolean, time: string) {
        if (isStart)
            this.selectedStartTime = this.commonService.buildDateTimeFromHHMM(new Date(), time);
        else
            this.selectedEndTime = this.commonService.buildDateTimeFromHHMM(new Date(), time);
    }

    onResourceSelected(resource: IrinaResource) {
        this.selectedResource = resource;
        this.changeDetectorRef.detectChanges();
        this.stepper.next();
    }

    async onResourceSearch() {
        let date = this.commonService.toYYYYMMDD(this.selectedDate);
        let res = await this.bookableAssetsManagementService.resourceSearchAvailability(date, RESOURCE_TYPE.ROOM, this.locationSelected, this.areaSelected, this.layoutSelected, this.selectedStartTime, this.selectedEndTime, this.selectedCapacity);
        if (this.commonService.isValidResponse(res)) {
            this.searchResults = res.data;
            this.stepper.next();
        }
    }

    getSelectedMeetingDate() {
        return this.searchFormGroup.get("meetingDate").value;
    }

    getSelectedMeetingStartTime() {
        return this.searchFormGroup.get("meetingStartTime").value;
    }

    getSelectedMeetingEndTime() {
        return this.searchFormGroup.get("meetingEndTime").value;
    }

    onBookComplete() {
        this.dialogRef.close(true);
    }

    onBack() {
        if (this.stepper.selectedIndex == 0)
            this.dialogRef.close(false);
        else
            this.stepper.previous();
    }

    onCloseClick() {

    }
}
