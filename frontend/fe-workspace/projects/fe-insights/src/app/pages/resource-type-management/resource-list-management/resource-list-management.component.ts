import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCalendar } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SatPopover } from '@ncstate/sat-popover';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { User } from 'projects/fe-common/src/lib/models/admin/user';
import { IrinaResource, IrinaResourceType, RESOURCE_TYPE } from 'projects/fe-common/src/lib/models/bookable-assets';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { BookableAssetsManagementService } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { ParkingManagementService, ParkingResourcesEntry, PARKING_STATUS } from 'projects/fe-common/src/lib/services/parking-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { environment } from 'projects/fe-insights/src/environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';

enum IMPORT_TYPE {
    CSV,
    MAP_IMAGE
}

@Component({
    selector: 'app-resource-list-management',
    templateUrl: './resource-list-management.component.html',
    styleUrls: ['./resource-list-management.component.scss']
})
export class ResourceListManagementComponent implements OnInit {
    @ViewChild(MatCalendar, { static: true }) calendar: MatCalendar<Date>;
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    @ViewChild('file', { static: true }) file: ElementRef;
    @ViewChild('bookCalendarPopover', { static: false }) bookCalendarPopover: SatPopover;
    @ViewChild('deleteBookPopover', { static: false }) deleteBookPopover: SatPopover;

    @Input() currentResourceType: IrinaResourceType;
    @Output() onBack: EventEmitter<void> = new EventEmitter<void>();

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: 'Site', columnName: 'Site', columnDataField: 'parkingResource.site', columnFormatter: 'siteFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Code', columnName: 'Code', columnDataField: 'parkingResource.code', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        // { columnCaption: 'Description', columnName: 'Description', columnDataField: 'parkingResource.description', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Grantee', columnName: 'Grantee', columnDataField: 'parkingResource.owner', columnFormatter: 'assigneeFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Status', columnName: 'Status', columnDataField: 'parkingResource', columnFormatter: null, columnRenderer: 'bookStatusRenderer', columnTooltip: 'bookStatusTooltip', context: this },
        { columnCaption: 'Map', columnName: 'Map', columnDataField: 'parkingResource', columnFormatter: null, columnRenderer: 'mapPresenceRenderer', columnTooltip: null, context: this },
        { columnCaption: 'Today Date', columnName: 'TodayDate', columnDataField: 'parkingResource', columnFormatter: 'todayBookDateFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Today Booking', columnName: 'CurrentBook', columnDataField: 'todayUser', columnFormatter: 'todayBookFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Tomorrow Date', columnName: 'TomorrowDate', columnDataField: 'parkingResource', columnFormatter: 'tomorrowDateFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Tomorrow Booking', columnName: 'TomorrowBook', columnDataField: 'tomorrowUser', columnFormatter: 'tomorrowBookFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: 'Edit', image: null, icon: 'edit', color: '#000000', action: 'onModifyResource', context: this },
        { tooltip: 'Book', image: null, icon: 'event_available', color: '#000000', action: 'onBookResource', context: this },
        { tooltip: 'Remove Book', image: null, icon: 'event_busy', color: '#000000', action: 'onRemoveBookResource', context: this },
        { tooltip: 'Delete', image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteResource', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: 'Back', image: null, icon: 'arrow_back', color: '#ffffff', action: 'onGoBack', context: this },
        { tooltip: 'Refresh', image: null, icon: 'refresh', color: '#ffffff', action: 'onRefreshResourceList', context: this },
        { tooltip: 'Add Resource', image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddResource', context: this },
        { tooltip: 'Upload Resources CSV', image: null, icon: 'cloud_upload', color: '#ffffff', action: 'onImportResources', context: this },
        { tooltip: 'Download Report CSV', image: null, icon: 'file_download', color: '#ffffff', action: 'onDownloadParkingReport', context: this },
        { tooltip: 'Update Parking Book', image: null, icon: 'bookmark_add', color: '#ffffff', action: 'onPreBookParkingForUserInOffice', context: this }
    ]

    filterCallback: Function;

    allSites: Site[];
    siteFC: FormControl = new FormControl();
    sites: Observable<Site[]>;

    allUsers: Person[];
    ownerFC: FormControl = new FormControl();
    users: Observable<Person[]>;

    allResources: ParkingResourcesEntry[] = [];
    resources: ParkingResourcesEntry[] = [];
    titleCard: string;
    tableTitle: string;

    isModify: boolean;
    importFileType: IMPORT_TYPE;

    currentResource: IrinaResource = IrinaResource.Empty();
    componentShowEvent: EventEmitter<void> = new EventEmitter<void>();

    mapImageURL: SafeUrl = null;

    resourceOwner: Person;
    resourceSite: Site;

    bookEmployee: User;

    showPageIndex: number;
    calendarDateClassCallback: Function;
    selectedCalendarDay: Date = new Date();
    bookCalendarResource: IrinaResource = null;

    deleteBookResourceEntry: ParkingResourcesEntry;
    deleteBookResourceToday: boolean;
    deleteBookResourceTomorrow: boolean;

    customFilterSites: Site[] = [];
    userAccount: Person;

    constructor(private commonService: CommonService,
        private dataStorageManagementService: DataStorageManagementService,
        private bookableAssetsManagementService: BookableAssetsManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private notifyManagementService: NotifyManagementService,
        private userManagementService: UserManagementService,
        private parkingManagementService: ParkingManagementService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer,
        public translate: TranslateService) {

        this.filterCallback = this.filterResource.bind(this);
        this.calendarDateClassCallback = this.calendarDateClass.bind(this);

        this.tableMainActions.push(
            { tooltip: 'Reset parking reservation(s)', image: null, icon: 'delete', color: '#ff0000', action: 'onResetAllParkingBooking', context: this }
        );
    }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();

        await this.loadSites();
        await this.loadUserList();

        this.customFilterSites = [];

        await this.loadReourceList();
    }

    async loadSites() {
        let res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.allSites = res.sites;
        }
    }

    async loadUserList() {
        const res = await this.adminUserManagementService.getPeople(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.allUsers = res.people;
        } else {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR USERS'), this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    filterSites(value: string) {
        return this.allSites.filter(s => Site.filterMatch(s, value));
    }

    filterUsers(value: string) {
        return this.allUsers.filter(u => Person.filterMatch(u, value));
    }

    filterResource(filterValue: string, data: any) {
        let filterMatch = filterValue.toLocaleLowerCase().split(' ').reduce((result, value) => {
            return result && JSON.stringify(data).toLocaleLowerCase().includes(value);
        }, true);

        // let res = JSON.stringify(data).toLocaleLowerCase().includes(filterValue.toLocaleLowerCase());
        let site = this.allSites.find(s => s.key == data.site);
        let isSite = site ? JSON.stringify(site).toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()) : false;

        return filterMatch || isSite;
    }

    assigneeFormatter(fieldValue: any, element: any) {
        try {
            if (fieldValue && element) {
                let ownerUser = element.ownerUser as User;
                if (ownerUser)
                    return ownerUser.name + ' ' + ownerUser.surname;
                else
                    return element.parkingResource.owner;
            } else {
                return element.parkingResource.owner;
            }
        } catch (ex) {
            console.error('assigneeFormatter exception: ', ex);
        }

        return fieldValue;
    }

    siteFormatter(fieldValue: any, element: any) {
        try {
            if (fieldValue && element) {
                return element.site.name;
            }
        } catch (ex) {
            console.error('siteFormatter exception: ', ex);
        }

        return fieldValue;
    }

    todayBookDateFormatter(fieldValue: any, element: any) {
        try {
            if (fieldValue && element && element.todayBookedPark) {
                return this.commonService.formatYYYYMMDD(element.todayBookedPark.date, '/');
            }
        } catch (ex) {
            console.error('todayBookFormatter exception: ', ex);
        }

        return '';
    }

    tomorrowDateFormatter(fieldValue: any, element: any) {
        try {
            if (fieldValue && element && element.tomorrowBookedPark) {
                return this.commonService.formatYYYYMMDD(element.tomorrowBookedPark.date, '/');
            }
        } catch (ex) {
            console.error('todayBookFormatter exception: ', ex);
        }

        return '';
    }

    todayBookFormatter(fieldValue: any, element: any) {
        try {
            if (fieldValue && element && element.todayUser) {
                return element.todayUser.name + ' ' + element.todayUser.surname;
            }
        } catch (ex) {
            console.error('todayBookFormatter exception: ', ex);
        }

        return fieldValue;
    }

    tomorrowBookFormatter(fieldValue: any, element: any) {
        try {
            if (fieldValue && element && element.tomorrowUser) {
                return element.tomorrowUser.name + ' ' + element.tomorrowUser.surname;
            }
        } catch (ex) {
            console.error('tomorrowBookFormatter exception: ', ex);
        }

        return fieldValue;
    }

    bookStatusRenderer(item: any) {
        try {
            // return "<img src='./assets/images/circle.svg' />";
            switch (item.currStatus) {
                case PARKING_STATUS.BOOKED: return "<i class=\"material-icons red\" matTooltip=\"Prenotato\">circle</i>";
                case PARKING_STATUS.FREE: return "<i class=\"material-icons green\" matTooltip=\"Libero\">circle</i>";
                case PARKING_STATUS.EXCLUSIVE: return "<i class=\"material-icons blue\" matTooltip=\"Esclusivo\">circle</i>";
                case PARKING_STATUS.PERSONAL_AVAILABLE: return "<i class=\"material-icons orange\" matTooltip=\"Libero con riserva\">circle</i>";
                case PARKING_STATUS.POOL_PARK: return "<i class=\"material-icons purple\">circle</i>";
            }

        } catch (ex) {
            console.error('todayBookFormatter exception: ', ex);
        }

        return '';
    }

    mapPresenceRenderer(item: any) {
        try {
            if (item.parkingResource.imageURL)
                return "<i class=\"material-icons\" matTooltip=\"Map\">map</i>";
        } catch (ex) {
            console.error('mapPresenceRenderer exception: ', ex);
        }

        return '';
    }

    bookStatusTooltip(item: any) {
        try {
            // return "<img src='./assets/images/circle.svg' />";
            switch (item.currStatus) {
                case PARKING_STATUS.BOOKED: return "Prenotato";
                case PARKING_STATUS.FREE: return "Libero";
                case PARKING_STATUS.EXCLUSIVE: return "Esclusivo";
                case PARKING_STATUS.PERSONAL_AVAILABLE: return "Libero con riserva";
                case PARKING_STATUS.POOL_PARK: return "Pool di riserva";
            }

        } catch (ex) {
            console.error('bookStatusTooltip exception: ', ex);
        }

        return '';
    }

    async loadReourceList() {
        this.tableTitle = this.currentResourceType.type + " Resources";

        let res = await this.parkingManagementService.getParkingResources(); // this.bookableAssetsManagementService.getBookableResources()
        if (this.commonService.isValidResponse(res)) {
            this.allResources = res.data;
            this.resources = res.data; // TODO Optimize this
        } else {
            this.snackBar.open('Error loading resources', this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    onAddResource() {
        this.isModify = false;
        this.titleCard = 'Add ' + this.currentResourceType.type + ' Resource';
        this.currentResource = IrinaResource.Empty();
        this.currentResource.parentGroupId = this.currentResourceType.id;
        this.currentResource.type = this.currentResourceType.type;
        this.currentResource.resourceType = this.currentResourceType;
        this.resourceSite = null;
        this.resourceOwner = null;

        this.sites = this.siteFC.valueChanges.pipe(startWith(''), map(s => this.filterSites(s)));
        this.users = this.ownerFC.valueChanges.pipe(startWith(''), map(u => this.filterUsers(u)));

        this.tabgroup.selectedIndex = 1;
    }

    async onModifyResource(resource: ParkingResourcesEntry) {
        this.isModify = true;
        this.titleCard = 'Modify Resource - ' + resource.parkingResource.code;

        this.sites = this.siteFC.valueChanges.pipe(startWith(''), map(s => this.filterSites(s)));
        this.users = this.ownerFC.valueChanges.pipe(startWith(''), map(u => this.filterUsers(u)));

        this.currentResource = resource.parkingResource;
        this.resourceSite = this.allSites.find(s => s.key == this.currentResource.site);
        this.resourceOwner = this.allUsers.find(u => u.id == this.currentResource.owner);

        if (this.currentResource.imageURL) {
            this.mapImageURL = await this.downloadImageMap();
        } else {
            this.mapImageURL = null;
        }

        await this.loadReourceList();

        this.tabgroup.selectedIndex = 1;
    }

    async onBookResource(resource: ParkingResourcesEntry) {
        this.users = this.ownerFC.valueChanges.pipe(startWith(''), map(u => this.filterUsers(u)));
        this.bookCalendarResource = resource.parkingResource;

        this.bookCalendarPopover.open();
    }

    async onBookCancelClick() {
        this.bookCalendarPopover.close();
    }

    async onBookConfirmClick() {
        let dateYYYYMMDD = this.commonService.toYYYYMMDD(this.selectedCalendarDay);
        let res = await this.parkingManagementService.bookUserParking(this.bookEmployee.id, dateYYYYMMDD, this.bookCalendarResource);
        if (this.commonService.isValidResponse(res)) {
            await this.loadReourceList();
            this.bookCalendarPopover.close();
        } else
            this.snackBar.open('Error ' + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
    }

    async onResetAllParkingBooking() {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData('Delete all booking(s)', this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            res = await this.parkingManagementService.removeBookParking('ALL');
            if (this.commonService.isValidResponse(res)) {
                await this.loadReourceList();
            } else
                this.snackBar.open('Error ' + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }

    }

    calendarDateClass(date: Date) {
        if (this.commonService.compareOnlyDate(this.selectedCalendarDay, date)) {
            return 'current-day';
        }
        return 'other-day';
    }

    async onDateSelectedChange(date: Date) {
        this.selectedCalendarDay = date;
        this.calendar.updateTodaysDate();
    }

    async onDeleteResource(resource: ParkingResourcesEntry) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData('Delete Resource', this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.bookableAssetsManagementService.deleteBookableResource(resource.parkingResource.code);
            if (this.commonService.isValidResponse(res)) {
                this.resources = this.resources.filter(u => u.parkingResource.code != resource.parkingResource.code);
            } else
                this.snackBar.open('Error ' + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    async onRemoveBookResource(resource: ParkingResourcesEntry) {
        if (!resource.todayBookedPark && !resource.tomorrowBookedPark)
            return;

        this.deleteBookResourceEntry = resource;
        this.deleteBookResourceToday = false;
        this.deleteBookResourceTomorrow = false;

        this.deleteBookPopover.open();

        /*
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData('Delete current resource book', this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.parkingManagementService.removeBookParking(resource.currentBook.id);
            if (this.commonService.isValidResponse(res)) {
                await this.loadReourceList();
            } else
                this.snackBar.open('Error ' + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
        */
    }

    onRemoveBookCancelClick() {
        this.deleteBookPopover.close();
    }

    async onRemoveBookConfirmClick() {
        if (this.deleteBookResourceToday) {
            await this.parkingManagementService.removeBookParking(this.deleteBookResourceEntry.todayBookedPark.id);
        }

        if (this.deleteBookResourceTomorrow) {
            await this.parkingManagementService.removeBookParking(this.deleteBookResourceEntry.tomorrowBookedPark.id);
        }

        this.deleteBookPopover.close();
        await this.loadReourceList();
    }

    onGoBack() {
        this.onBack.emit();
    }

    isEditConfirmEnabled() {
        return true;
    }

    async onEditCancelClick() {
        this.tabgroup.selectedIndex = 0;
    }

    async onEditConfirmClick() {
        this.currentResource.site = this.resourceSite ? this.resourceSite.key : null;
        this.currentResource.owner = this.resourceOwner ? this.resourceOwner.id : null;

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

    onImportResources() {
        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }
        this.importFileType = IMPORT_TYPE.CSV;
        this.file.nativeElement.click();
    }

    async onRefreshResourceList() {
        await this.loadReourceList();
    }

    onImportResourceMapImage() {
        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }
        this.importFileType = IMPORT_TYPE.MAP_IMAGE;
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

        if (this.importFileType == IMPORT_TYPE.CSV) {
            let res = await this.bookableAssetsManagementService.uploadResourceCSV(file, RESOURCE_TYPE.PARKING);
            if (this.commonService.isValidResponse(res.body)) {
                this.notifyManagementService.displaySuccessSnackBar('Resources imported');
                this.loadReourceList();
            } else {
                this.snackBar.open('Error: ' + res.body.reason, this.translate.instant('GENERAL.OK'), {
                    duration: 3000
                });
            }
        } else if (this.importFileType == IMPORT_TYPE.MAP_IMAGE) {
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

    displaySite(site: Site) {
        return site ? site.name : '';
    }

    displayUser(user: User) {
        return user ? user.name + ' ' + user.surname : '';
    }

    async onDownloadParkingReport() {
        let reportContent = await this.parkingManagementService.getParkingCSV();
        let BOM = "\uFEFF";

        const blob = new Blob([reportContent], { type: "text/csv;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        let now = new Date();
        link.download = `report-parking-booking-${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}.xls`;

        link.click();
    }

    async onPreBookParkingForUserInOffice() {
        let res = await this.parkingManagementService.preBookParkingForUserInOffice();
        if (this.commonService.isValidResponse(res)) {
            this.loadReourceList();
            this.snackBar.open('Parking book successfully updated', this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        } else {
            this.snackBar.open('Error: ' + res.reason, this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    onFilterSite(site: Site) {
        if (site == null) {
            this.resources = this.allResources;
        } else {
            this.resources = this.allResources.filter(r => r.site.key == site.key);
        }
    }
}
