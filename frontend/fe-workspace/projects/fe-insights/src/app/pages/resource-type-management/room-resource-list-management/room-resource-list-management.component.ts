import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { IrinaResource, IrinaResourceBook, IrinaResourceBookTimeslot, IrinaResourceType, RESOURCE_TYPE } from 'projects/fe-common-v2/src/lib/models/bookable-assets';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { BookableAssetsManagementService } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { ParkingManagementService } from 'projects/fe-common/src/lib/services/parking-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';
import { ResourceBookingDialogComponent } from '../../../dialogs/resource-booking-dialog/resource-booking-dialog.component';

enum UploadType {
    Image,
    Map
}

enum DETAIL_MODE {
    dmEdit,
    dmReservation
}

// NFS Image public url: https://space.agos.it/WorkspaceAPI/api/Image/2/
// NFS reatures public url: https://space.agos.it/WorkspaceAPI/api/Image/1/

@Component({
    selector: 'app-room-resource-list-management',
    templateUrl: './room-resource-list-management.component.html',
    styleUrls: ['./room-resource-list-management.component.scss']
})
export class RoomResourceListManagementComponent implements OnInit {
    RESOURCE_TYPE = RESOURCE_TYPE;
    DETAIL_MODE = DETAIL_MODE;
    UploadType = UploadType;

    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    @ViewChild('file', { static: true }) file: ElementRef;

    @Input() currentResourceType: IrinaResourceType;
    @Output() onBack: EventEmitter<void> = new EventEmitter<void>();

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: 'Site', columnName: 'Site', columnDataField: 'site', columnFormatter: 'siteFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Code', columnName: 'Code', columnDataField: 'code', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Description', columnName: 'Description', columnDataField: 'description', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Enabled', columnName: 'Enabled', columnDataField: 'enabled', columnFormatter: null, columnRenderer: 'enabledRenderer', columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: 'Edit', image: null, icon: 'edit', color: '#000000', action: 'onModifyResource', context: this },
        { tooltip: 'Reservation', image: null, icon: 'event_available', color: '#000000', action: 'onShowReservations', context: this },
        { tooltip: 'Delete', image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteResource', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: 'Back', image: null, icon: 'arrow_back', color: '#ffffff', action: 'onGoBack', context: this },
        { tooltip: 'Refresh', image: null, icon: 'refresh', color: '#ffffff', action: 'onRefreshResourceList', context: this },
        { tooltip: 'Book', image: null, icon: 'bookmark_add', color: '#ffffff', action: 'onResourceBook', context: this },
        { tooltip: 'Add Resource', image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddResource', context: this }
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
    imageURL: SafeUrl = null;
    mapImageURL: SafeUrl = null;

    featureIcons: string[] = [];
    qrLevel: string = 'Q';
    qrResource: string = '';

    userAccount: Person;
    currentUploadType: UploadType;

    detailMode: DETAIL_MODE = DETAIL_MODE.dmEdit;
    currentReservationDate: Date;

    resourceReservation: IrinaResourceBook;

    constructor(private commonService: CommonService,
        private dataStorageManagementService: DataStorageManagementService,
        private bookableAssetsManagementService: BookableAssetsManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private notifyManagementService: NotifyManagementService,
        private parkingManagementService: ParkingManagementService,
        private userManagementService: UserManagementService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private sanitizer: DomSanitizer,
        public translate: TranslateService) {

        this.displaySiteCallback = this.displaySite.bind(this);
    }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();

        await this.loadSites();
        await this.loadReourceList();
    }

    async loadSites() {

        let res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.allSites = res.sites;
            console.log("this.allSites",this.allSites)
        }
    }

    async loadReourceList() {
        this.tableTitle = this.currentResourceType.type + " Resources";

        let res = await this.bookableAssetsManagementService.getBookableResources(this.currentResourceType.type);
        if (this.commonService.isValidResponse(res)) {
            this.allResources = res.data;
            this.resources = res.data; // TODO Optimize this
            console.log("this.resources",this.resources)

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
            this.commonService.isValidField(this.currentResource.site);
    }

    filterSites(value: string) {
        return this.allSites.filter(s => Site.filterMatch(s, value));
    }

    async onRefreshResourceList() {
        await this.loadReourceList();
    }

    onGoBack() {
        this.onBack.emit();
    }

    async onModifyResource(resource: IrinaResource) {
        this.isModify = true;
        this.detailMode = DETAIL_MODE.dmEdit;

        this.titleCard = 'Modify Resource - ' + resource.code;

        this.sites = this.siteFC.valueChanges.pipe(startWith(''), map(s => this.filterSites(s)));

        this.currentResource = resource;
        this.resourceSite = this.allSites.find(s => s.key == this.currentResource.site);

        if (this.currentResource.imageURL) {
            this.imageURL = await this.dataStorageManagementService.downloadImageFile(this.currentResource.imageURL);
        } else {
            this.imageURL = null;
        }

        if (this.currentResource.custom.mapImageURL) {
            this.mapImageURL = await this.dataStorageManagementService.downloadImageFile(this.currentResource.custom.mapImageURL);
        } else {
            this.mapImageURL = null;
        }

        this.tabgroup.selectedIndex = 1;
    }

    async onShowReservations(resource: IrinaResource) {
        this.isModify = false;
        this.detailMode = DETAIL_MODE.dmReservation;

        this.titleCard = 'Resource Schedule - ' + resource.code;

        this.currentResource = resource;
        this.currentReservationDate = new Date();

        await this.loadResourceReservation();

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

    async onAddResource() {
        this.isModify = false;
        this.titleCard = 'Add Resource - ' + this.currentResourceType.type;

        this.sites = this.siteFC.valueChanges.pipe(startWith(''), map(s => this.filterSites(s)));

        this.currentResource = IrinaResource.Empty();

        this.tabgroup.selectedIndex = 1;
    }

    async onEditCancelClick() {
        this.tabgroup.selectedIndex = 0;
    }

    async onEditConfirmClick() {
        this.tabgroup.selectedIndex = 0;

        this.currentResource.type = this.currentResourceType.type;
        this.currentResource.companyId = this.userAccount.companyId;
        let res = await this.bookableAssetsManagementService.addOrUpdateBookableResource(this.currentResource);
        if (this.commonService.isValidResponse(res)) {
            await this.loadReourceList();
            this.showPageIndex = 0;
        } else {
            this.snackBar.open('Error: ' + res.reason, this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    onImportResourceImage(uploadType: UploadType) {
        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }
        this.currentUploadType = uploadType;
        this.file.nativeElement.click();
    }

    onRemoveResourceImage(uploadType: UploadType) {
        if (uploadType == UploadType.Image) {
            this.imageURL = null;
            this.currentResource.imageURL = null;
        } else if (uploadType == UploadType.Map) {
            this.mapImageURL = null;
            this.currentResource.custom.mapImageURL = null;
        }
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
            if (this.currentUploadType == UploadType.Image) {
                this.currentResource.imageURL = res.body.fileId;
                this.imageURL = await this.dataStorageManagementService.downloadImageFile(this.currentResource.imageURL);
            } else if (this.currentUploadType == UploadType.Map) {
                this.currentResource.custom.mapImageURL = res.body.fileId;
                this.mapImageURL = await this.dataStorageManagementService.downloadImageFile(this.currentResource.custom.mapImageURL);
            }

            this.notifyManagementService.displaySuccessSnackBar('Resource image imported');
        } else {
            this.snackBar.open('Error: ' + res.body.reason, this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    async onReservationDateChange(eventData: MatDatepickerInputEvent<Date>) {
        this.currentReservationDate = eventData.value;

        await this.loadResourceReservation();
    }

    formatTimeframeTime(dateTime) {
        return this.commonService.toHHMM(dateTime);
    }

    getMyTimeframes() {
        return this.resourceReservation.timeframeReservations;
    }

    getTimeframeCaption(tf) {
        return tf.users[0].name + ' ' + tf.users[0].surname + ' - ' + tf.extraData.title;
    }

    getTimeframeNotes(tf) {
        return tf.extraData.notes;
    }

    isInProgress(timeframeItem: IrinaResourceBookTimeslot) {
        let now = new Date();
        return this.commonService.timeIsInTimeFrame(now, timeframeItem.startTime, timeframeItem.endTime);
    }

    getStatusColor() {
        let isMeetingInProgress = false;
        this.resourceReservation.timeframeReservations.forEach(tf => isMeetingInProgress = isMeetingInProgress || this.isInProgress(tf));

        return isMeetingInProgress ? '#ff0000aa' : '#00ff0066';
    }

    async loadResourceReservation() {
        let res = await this.bookableAssetsManagementService.getCurrentResourceStatus(this.currentResource.code, this.commonService.toYYYYMMDD(this.currentReservationDate));
        if (this.commonService.isValidResponse(res)) {
            this.resourceReservation = res.reservation ? res.reservation : IrinaResourceBook.Empty();
        } else {
            this.resourceReservation = IrinaResourceBook.Empty();
        }
    }

    async onResourceBook() {
        let res = await this.dialog.open(ResourceBookingDialogComponent, {
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: { currentResource: this.currentResource }
        }).afterClosed().toPromise();
        if (res) {

        }
    }
}
