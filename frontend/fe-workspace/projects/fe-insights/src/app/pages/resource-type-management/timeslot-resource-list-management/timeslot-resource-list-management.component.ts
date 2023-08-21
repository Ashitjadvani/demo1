import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SatPopover } from '@ncstate/sat-popover';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { User } from 'projects/fe-common/src/lib/models/admin/user';
import { IrinaResourceType, IrinaResource, RESOURCE_TYPE, IrinaResourceBookTimeslot } from 'projects/fe-common/src/lib/models/bookable-assets';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { BookableAssetsManagementService, ResourceReservation } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { ParkingManagementService } from 'projects/fe-common/src/lib/services/parking-management.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';


enum DETAIL_MODE {
    dmEdit,
    dmReservation
}

@Component({
    selector: 'app-timeslot-resource-list-management',
    templateUrl: './timeslot-resource-list-management.component.html',
    styleUrls: ['./timeslot-resource-list-management.component.scss']
})
export class TimeslotResourceListManagementComponent implements OnInit {
    DETAIL_MODE = DETAIL_MODE;

    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    @ViewChild('file', { static: true }) file: ElementRef;
    @ViewChild('bookUserPopover', { static: false }) bookUserPopover: SatPopover;

    @Input() currentResourceType: IrinaResourceType;
    @Output() onBack: EventEmitter<void> = new EventEmitter<void>();

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: 'Site', columnName: 'Site', columnDataField: 'site', columnFormatter: 'siteFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Code', columnName: 'Code', columnDataField: 'code', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Description', columnName: 'Description', columnDataField: 'description', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Enabled', columnName: 'Enabled', columnDataField: 'enabled', columnFormatter: null, columnRenderer: 'enabledRenderer', columnTooltip: null, context: this },
        { columnCaption: 'Map', columnName: 'Map', columnDataField: 'imageURL', columnFormatter: null, columnRenderer: 'mapPresenceRenderer', columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: 'Edit', image: null, icon: 'edit', color: '#000000', action: 'onModifyResource', context: this },
        { tooltip: 'Reservation', image: null, icon: 'event_available', color: '#000000', action: 'onModifyReservations', context: this },
        { tooltip: 'Delete', image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteResource', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: 'Back', image: null, icon: 'arrow_back', color: '#ffffff', action: 'onGoBack', context: this },
        { tooltip: 'Refresh', image: null, icon: 'refresh', color: '#ffffff', action: 'onRefreshResourceList', context: this },
        { tooltip: 'Add Resource', image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddResource', context: this }
    ]

    tableReservationColumnTemplates: ColumnTemplate[] = [
        { columnCaption: 'Name', columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Start Time', columnName: 'StartTime', columnDataField: 'startTime', columnFormatter: 'reservationDateFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'End Time', columnName: 'EndTime', columnDataField: 'endTime', columnFormatter: 'reservationDateFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Reservation', columnName: 'Reservation', columnDataField: 'users', columnFormatter: 'reservationUserFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableReservationRowActions: Action[] = [
        { tooltip: 'Edit', image: null, icon: 'edit', color: '#000000', action: 'onModifyResourceReservation', context: this },
        { tooltip: 'Delete', image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteResourceReservation', context: this }
    ]

    filterCallback: Function;

    allSites: Site[];
    siteFC: FormControl = new FormControl();
    sites: Observable<Site[]>;

    resourceSite: Site;

    showPageIndex: number;
    calendarDateClassCallback: Function;
    selectedCalendarDay: Date = new Date();
    bookCalendarResource: IrinaResource = null;

    customFilterSites: Site[] = [];
    currentResource: IrinaResource = IrinaResource.Empty();
    resources: IrinaResource[] = [];
    allResources: IrinaResource[] = [];

    isModify: boolean;
    titleCard: string;
    tableTitle: string;

    displaySiteCallback: Function;
    mapImageURL: SafeUrl = null;

    detailMode: DETAIL_MODE = DETAIL_MODE.dmEdit;
    currentReservationDate: Date;
    resourceReservations: ResourceReservation;
    resourceReservationTimeslots: IrinaResourceBookTimeslot[];

    bookEmployee: User;
    allUsers: User[];
    ownerFC: FormControl = new FormControl();
    users: Observable<User[]>;
    currentResourceBookTimeslot: IrinaResourceBookTimeslot;

    constructor(private commonService: CommonService,
        private dataStorageManagementService: DataStorageManagementService,
        private bookableAssetsManagementService: BookableAssetsManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private notifyManagementService: NotifyManagementService,
        private parkingManagementService: ParkingManagementService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer,
        public translate: TranslateService) {

        this.displaySiteCallback = this.displaySite.bind(this);
    }

    async ngOnInit() {
        this.allSites = await this.adminSiteManagementService.siteList();
        this.allUsers = await this.adminUserManagementService.userList('ALL');

        this.customFilterSites = [];
        this.currentResource.availabilityTimeslots = this.currentResourceType.availabilityTimeslots;

        await this.loadReourceList();
    }

    async loadReourceList() {
        this.tableTitle = this.currentResourceType.type + " Resources";

        let res = await this.bookableAssetsManagementService.getBookableResources(this.currentResourceType.type);
        if (this.commonService.isValidResponse(res)) {
            this.allResources = res.data;
            this.resources = res.data; // TODO Optimize this
        } else {
            this.snackBar.open('Error loading resources', this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    enabledRenderer(item: any) {
        try {
            if (item.enabled)
                return "<i class=\"material-icons green\">circle</i>";
            else
                return "<i class=\"material-icons red\">circle</i>";
        } catch (ex) {
            console.error('mapPresenceRenderer exception: ', ex);
        }

        return '';
    }

    siteFormatter(fieldValue: any, element: any) {
        try {
            if (fieldValue && element) {
                let site = this.allSites.find(s => s.key == element.site);
                return site ? site.name : element.site;
            }
        } catch (ex) {
            console.error('siteFormatter exception: ', ex);
        }

        return fieldValue;
    }

    displaySite(siteKey: string) {
        if (this.allSites) {
            let site = this.allSites.find(s => s.key == siteKey);
            return site ? site.name : siteKey;
        }
        return null;
    }

    isEditConfirmEnabled() {
        return this.commonService.isValidField(this.currentResource.code) &&
            this.commonService.isValidField(this.currentResource.site) &&
            (this.currentResource.availabilityTimeslots.length > 0);
    }

    filterSites(value: string) {
        return this.allSites.filter(s => Site.filterMatch(s, value));
    }

    filterUsers(value: string) {
        return this.allUsers.filter(u => User.filterMatch(u, value));
    }

    async onRefreshResourceList() {
        await this.loadReourceList();
    }

    mapPresenceRenderer(item: any) {
        try {
            if (item.imageURL)
                return "<i class=\"material-icons\" matTooltip=\"Map\">map</i>";
        } catch (ex) {
            console.error('mapPresenceRenderer exception: ', ex);
        }

        return '';
    }

    onImportResourceMapImage() {
        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }
        this.file.nativeElement.click();
    }

    onRemoveMapImage() {
        this.mapImageURL = null;
        this.currentResource.imageURL = null;
    }

    async onUploadFile() {
        let fileChoosen = this.file.nativeElement.files[0];
        if (!fileChoosen)
            return;

        if (fileChoosen.size > (10 * 1024 * 1024)) {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.FILE SIZE BIG'), this.translate.instant('GENERAL.OK'), { duration: 2000 });
            return;
        }

        let file = this.file.nativeElement.files[0];

        let res = await this.dataStorageManagementService.uploadFile(file);
        if (this.commonService.isValidResponse(res.body)) {
            this.currentResource.imageURL = res.body.fileId;
            this.notifyManagementService.displaySuccessSnackBar('Resource image imported');

            this.mapImageURL = await this.downloadImageMap();
        } else {
            this.snackBar.open('Error: ' + res.body.reason, this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    async downloadImageMap() {
        try {
            let res = await this.dataStorageManagementService.downloadFile(this.currentResource.imageURL).toPromise();

            let blob = new Blob([res]);
            return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
        } catch (ex) {
            this.snackBar.open('Error download map image', this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
            return null;
        }
    }

    onGoBack() {
        this.onBack.emit();
    }

    onAddResource() {
        this.isModify = false;
        this.currentResource = IrinaResource.Empty();
        this.currentResource.availabilityTimeslots = this.currentResourceType.availabilityTimeslots;
        this.sites = this.siteFC.valueChanges.pipe(startWith(''), map(s => this.filterSites(s)));

        this.tabgroup.selectedIndex = 1;
    }

    async onEditCancelClick() {
        this.tabgroup.selectedIndex = 0;
    }

    async onEditConfirmClick() {

        this.currentResource.type = this.currentResourceType.type;

        let res = await this.bookableAssetsManagementService.addOrUpdateBookableResource(this.currentResource);
        if (this.commonService.isValidResponse(res)) {
            await this.loadReourceList();
            this.showPageIndex = 0;
        } else {
            this.snackBar.open('Error: ' + res.reason, this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }

        this.tabgroup.selectedIndex = 0;
    }

    async onModifyResource(resource: IrinaResource) {
        this.detailMode = DETAIL_MODE.dmEdit;
        this.isModify = true;
        this.titleCard = 'Modify Resource - ' + resource.code;

        this.sites = this.siteFC.valueChanges.pipe(startWith(''), map(s => this.filterSites(s)));

        this.currentResource = resource;
        this.resourceSite = this.allSites.find(s => s.key == this.currentResource.site);

        if (this.currentResource.imageURL) {
            this.mapImageURL = await this.downloadImageMap();
        } else {
            this.mapImageURL = null;
        }

        this.tabgroup.selectedIndex = 1;
    }

    async onModifyReservations(resource: IrinaResource) {
        this.detailMode = DETAIL_MODE.dmReservation;
        this.titleCard = 'Resource Calendar - ' + resource.code;

        this.currentResource = resource;
        this.resourceSite = this.allSites.find(s => s.key == this.currentResource.site);
        this.currentReservationDate = new Date();

        await this.loadResourceReservations();

        this.tabgroup.selectedIndex = 1;
    }

    async onDeleteResource(resource: IrinaResource) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData('Delete Resource', this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.bookableAssetsManagementService.deleteBookableResource(resource.code);
            if (this.commonService.isValidResponse(res)) {
                this.resources = this.resources.filter(u => u.code != resource.code);
            } else
                this.snackBar.open('Error ' + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    onFilterSite(site: Site) {
        if (site == null) {
            this.resources = this.allResources;
        } else {
            this.resources = this.allResources.filter(r => r.site == site.key);
        }
    }

    async loadResourceReservations() {
        let res = await this.bookableAssetsManagementService.resourceReservationStatus(this.commonService.toYYYYMMDD(this.currentReservationDate), RESOURCE_TYPE.ECHARGER, this.currentResource.code);
        if (this.commonService.isValidResponse(res)) {
            this.resourceReservations = res.resourceReservation;
            this.resourceReservationTimeslots = this.resourceReservations.timeslotReservations;
        } else {
            this.resourceReservations = null;
            this.resourceReservationTimeslots = [];
        }
    }

    async onReservationDateChange(eventData: MatDatepickerInputEvent<Date>) {
        this.currentReservationDate = eventData.value;
        await this.loadResourceReservations();
    }

    reservationDateFormatter(fieldValue: any, element: any) {
        try {
            if (fieldValue && element) {
                return this.commonService.formatDateTime(fieldValue, 'HH:mm');
            }
        } catch (ex) {
            console.error('reservationDateFormatter exception: ', ex);
        }

        return fieldValue;
    }

    reservationUserFormatter(fieldValue: any, element: any) {
        try {
            if (element && fieldValue && (fieldValue.length > 0)) {
                return fieldValue[0].name + ' ' + fieldValue[0].surname;
            }
        } catch (ex) {
            console.error('reservationUserFormatter exception: ', ex);
        }

        return fieldValue;
    }

    onModifyResourceReservation(resourceBookTimeslot: IrinaResourceBookTimeslot) {
        this.users = this.ownerFC.valueChanges.pipe(startWith(''), map(u => this.filterUsers(u)));
        this.currentResourceBookTimeslot = resourceBookTimeslot;

        this.bookUserPopover.open();
    }

    async onDeleteResourceReservation(resourceBookTimeslot: IrinaResourceBookTimeslot) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData('Delete Reservation', this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let bookendUser = resourceBookTimeslot.users[0];
            res = await this.bookableAssetsManagementService.deleteUserReservedResourceSlot(bookendUser.id, RESOURCE_TYPE.ECHARGER, this.resourceReservations.resourceId, resourceBookTimeslot.name, this.commonService.toYYYYMMDD(this.currentReservationDate));
            if (this.commonService.isValidResponse(res)) {
                await this.loadResourceReservations();
            } else
                this.snackBar.open('Error ' + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    displayUser(user: User) {
        return user ? user.name + ' ' + user.surname : '';
    }

    async onBookCancelClick() {
        this.bookUserPopover.close();
    }

    async onBookConfirmClick() {
        let res = await this.bookableAssetsManagementService.reserveUserResourceSlot(this.bookEmployee.id, RESOURCE_TYPE.ECHARGER, this.resourceReservations.resourceId, this.currentResourceBookTimeslot.name, this.commonService.toYYYYMMDD(this.currentReservationDate));
        if (this.commonService.isValidResponse(res)) {
            await this.loadResourceReservations();
        } else
            this.snackBar.open('Error ' + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });

        this.bookUserPopover.close();
    }
}
