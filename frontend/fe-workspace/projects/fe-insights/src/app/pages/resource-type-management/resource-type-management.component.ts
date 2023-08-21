import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { AvailabilityTimeslotSchema, IrinaResourceType, RESOURCE_TYPE } from 'projects/fe-common/src/lib/models/bookable-assets';
import { BookableAssetsManagementService } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { ParkingManagementService } from 'projects/fe-common/src/lib/services/parking-management.service';
import { Action, ColumnTemplate } from '../../components/table-data-view/table-data-view.component';
import { HtmlEditorDialogComponent } from '../../dialogs/html-editor-dialog/html-editor-dialog.component';

enum LIST_ITEM {
    liAreas,
    liFacility,
    liLayout
}

@Component({
    selector: 'app-resource-type-management',
    templateUrl: './resource-type-management.component.html',
    styleUrls: ['./resource-type-management.component.scss']
})
export class ResourceTypeManagementComponent implements OnInit {
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;

    LIST_ITEM = LIST_ITEM;
    RESOURCE_TYPE = RESOURCE_TYPE;
    availableTypes = Object.values(RESOURCE_TYPE);

    tableColumnTemplates: ColumnTemplate[] = [
        // { columnCaption: 'ID', columnName: 'ID', columnDataField: 'id', columnFormatter: null, columnRenderer: null, context: this },
        { columnCaption: 'Type', columnName: 'Type', columnDataField: 'type', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Name', columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Description', columnName: 'Description', columnDataField: 'description', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Availability Start', columnName: 'AvailabilityStart', columnDataField: 'availabilityStart', columnFormatter: 'availabilityFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Availability Hours', columnName: 'AvailabilityHours', columnDataField: 'availabilityHoursAfterStart', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: 'Edit', image: null, icon: 'edit', color: '#000000', action: 'onModifyResourceType', context: this },
        { tooltip: 'Resources', image: null, icon: 'category', color: '#000000', action: 'onResourceManagement', context: this },
        { tooltip: 'Delete', image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteResourceType', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: 'Add Resource Group', image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddResourceType', context: this }
    ]

    filterCallback: Function;

    resourceTypes: IrinaResourceType[] = [];
    titleCard: string;

    isModify: boolean;
    currentResourceType: IrinaResourceType = IrinaResourceType.Empty();

    showResourceList: boolean;

    datePipe: DatePipe = new DatePipe('it-IT');
    availabilityStart: string;
    availabilityEnd: string;

    personalParkAutoBookAfterAvailability: boolean = false;
    parkHelpButtonMessage: string;
    parkHelpPhoneNumber: string;

    parkRefreshMessage: string
    parkRefreshAvailable: boolean;
    parkRefreshInterval: number;

    priorityAvailabilityStart: string;
    priorityAvailabilityEnd: string;
    priorityAvailabilityTags: string[] = [];

    tagFC: FormControl = new FormControl();
    separatorKeysCodes: number[] = [ENTER, COMMA];

    currentTimeslot: AvailabilityTimeslotSchema = new AvailabilityTimeslotSchema();

    newArea: string;
    newFacility: string;
    newLayout: string;

    constructor(private commonService: CommonService,
        private bookableAssetsManagementService: BookableAssetsManagementService,
        private parkingManagementService: ParkingManagementService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef,
        public translate: TranslateService) {

    }

    async ngOnInit() {
        await this.loadReourceTypeList();
    }

    async loadReourceTypeList() {
        let res = await this.bookableAssetsManagementService.getBookableResourceTypes()
        if (this.commonService.isValidResponse(res)) {
            this.resourceTypes = res.data;
        } else {
            this.snackBar.open('Error loading resource types', this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    availabilityFormatter(fieldValue: any) {
        try {
            if (fieldValue) {
                let dateTime = new Date(fieldValue);
                return this.commonService.timeFormat(dateTime);
            }
        } catch (ex) {
            console.error('dateColumnFormatter exception: ', ex);
        }

        return fieldValue;
    }

    onEditCancelClick() {
        this.tabgroup.selectedIndex = 0;
    }

    onAddResourceType() {
        this.isModify = false;
        this.showResourceList = false;
        this.titleCard = 'Add Resource Group';
        this.currentResourceType = IrinaResourceType.Empty();
        this.availabilityStart = '00:00';
        this.availabilityEnd = '23:59';
        this.tabgroup.selectedIndex = 1;
    }

    updateCustomDataParking() {
        if (!this.currentResourceType.customData) {
            this.currentResourceType.customData = {
                personalParkAutoBookAfterAvailability: this.personalParkAutoBookAfterAvailability,
                parkHelpButtonMessage: this.parkHelpButtonMessage,
                parkHelpPhoneNumber: this.parkHelpPhoneNumber,
                parkRefreshMessage: this.parkRefreshMessage,
                parkRefreshAvailable: this.parkRefreshAvailable,
                parkRefreshInterval: this.parkRefreshInterval

            }
        } else {
            this.currentResourceType.customData.personalParkAutoBookAfterAvailability = this.personalParkAutoBookAfterAvailability;
            this.currentResourceType.customData.parkHelpButtonMessage = this.parkHelpButtonMessage;
            this.currentResourceType.customData.parkHelpPhoneNumber = this.parkHelpPhoneNumber;
            this.currentResourceType.customData.parkRefreshMessage = this.parkRefreshMessage;
            this.currentResourceType.customData.parkRefreshAvailable = this.parkRefreshAvailable;
            this.currentResourceType.customData.parkRefreshInterval = this.parkRefreshInterval;
        }
    }

    async onEditConfirmClick() {
        if (this.currentResourceType.type == RESOURCE_TYPE.PARKING)
            this.updateCustomDataParking();

        let now = new Date();
        this.currentResourceType.availabilityStart = this.commonService.buildDateTimeFromHHMM(now, this.availabilityStart);
        this.currentResourceType.availabilityEnd = this.commonService.buildDateTimeFromHHMM(now, this.availabilityEnd);

        if (!this.currentResourceType.extraAvailabilityRanges)
            this.currentResourceType.extraAvailabilityRanges = [];

        if (!this.currentResourceType.availabilityTimeslots)
            this.currentResourceType.availabilityTimeslots = [];

        this.currentResourceType.extraAvailabilityRanges[0] = {
            name: 'PRIORITY_TAG',
            availabilityStart: this.priorityAvailabilityStart ? this.commonService.buildDateTimeFromHHMM(now, this.priorityAvailabilityStart) : null,
            availabilityEnd: this.priorityAvailabilityEnd ? this.commonService.buildDateTimeFromHHMM(now, this.priorityAvailabilityEnd) : null,
            targetTags: this.priorityAvailabilityTags
        }

        let res = await this.bookableAssetsManagementService.addOrUpdateBookableResourceTypes(this.currentResourceType)
        if (this.commonService.isValidResponse(res)) {

            if (this.currentResourceType.type == RESOURCE_TYPE.PARKING)
                await this.parkingManagementService.updateParkingPool(res.data.id);

            await this.loadReourceTypeList();
        } else {
            this.snackBar.open('Error :' + res.reason, this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }

        this.tabgroup.selectedIndex = 0;
    }

    async onDeleteResourceType(resourceType: IrinaResourceType) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData('Delete Resource Type', this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.bookableAssetsManagementService.deleteBookableResourceTypes(resourceType.id);
            if (res.result) {
                this.resourceTypes = this.resourceTypes.filter(u => u.id != resourceType.id);
            } else
                this.snackBar.open('Error ' + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    async onModifyResourceType(resourceType: IrinaResourceType) {
        this.isModify = true;
        this.showResourceList = false;
        this.titleCard = 'Modify Resource Group';
        this.currentResourceType = this.commonService.cloneObject(resourceType);

        this.personalParkAutoBookAfterAvailability = (this.currentResourceType.customData ? this.currentResourceType.customData.personalParkAutoBookAfterAvailability : false);
        this.parkHelpButtonMessage = (this.currentResourceType.customData ? this.currentResourceType.customData.parkHelpButtonMessage : '');
        this.parkHelpPhoneNumber = (this.currentResourceType.customData ? this.currentResourceType.customData.parkHelpPhoneNumber : '');
        this.parkRefreshMessage = (this.currentResourceType.customData ? this.currentResourceType.customData.parkRefreshMessage : '');
        this.parkRefreshAvailable = (this.currentResourceType.customData ? this.currentResourceType.customData.parkRefreshAvailable : '');
        this.parkRefreshInterval = (this.currentResourceType.customData ? this.currentResourceType.customData.parkRefreshInterval : '');

        this.availabilityStart = this.commonService.toHHMM(resourceType.availabilityStart);
        this.availabilityEnd = this.commonService.toHHMM(resourceType.availabilityEnd);

        if (this.currentResourceType.extraAvailabilityRanges && (this.currentResourceType.extraAvailabilityRanges.length > 0)) {
            this.priorityAvailabilityStart = this.commonService.toHHMM(this.currentResourceType.extraAvailabilityRanges[0].availabilityStart);
            this.priorityAvailabilityEnd = this.commonService.toHHMM(this.currentResourceType.extraAvailabilityRanges[0].availabilityEnd);
            this.priorityAvailabilityTags = this.currentResourceType.extraAvailabilityRanges[0].targetTags;
        }

        this.tabgroup.selectedIndex = 1;
    }

    async onResourceManagement(resourceType: IrinaResourceType) {
        this.showResourceList = true;
        this.currentResourceType = this.commonService.cloneObject(resourceType);

        this.tabgroup.selectedIndex = 1;
    }

    onResourceBack() {
        this.showResourceList = false;
        this.tabgroup.selectedIndex = 0;
    }

    isEditConfirmEnabled() {
        return true;
    }

    dateColumnFormatter(fieldValue: any) {
        try {
            return this.datePipe.transform(new Date(fieldValue), 'dd/MM/yyyy HH:mm:ss');
        } catch (ex) {
            console.error('dateColumnFormatter exception: ', ex);
        }

        return '#NA'
    }

    setAvailabilityTime(isStart, time) {
        if (isStart)
            this.availabilityStart = time;
        else
            this.availabilityEnd = time;
    }

    setPriorityAvailabilityTime(isStart, time) {
        if (isStart)
            this.priorityAvailabilityStart = time;
        else
            this.priorityAvailabilityEnd = time;
    }

    onAddPriorityTag(tag) {
        if (!this.priorityAvailabilityTags.includes(tag.value)) {
            this.priorityAvailabilityTags.push(tag.value);
            this.tagFC.setValue('');
        }
    }

    onRemovePriorityTag(tag) {
        this.priorityAvailabilityTags = this.priorityAvailabilityTags.filter(t => t != tag);
    }

    getTimeslotTime(isStart: boolean) {
        if (isStart)
            return this.commonService.toHHMM(this.currentTimeslot.startTime);
        else
            return this.commonService.toHHMM(this.currentTimeslot.endTime);
    }

    setTimeslotTime(isStart: boolean, time: string) {
        let now = new Date();
        if (isStart)
            this.currentTimeslot.startTime = this.commonService.buildDateTimeFromHHMM(now, time);
        else
            this.currentTimeslot.endTime = this.commonService.buildDateTimeFromHHMM(now, time);
    }

    onAddTimeslot() {
        this.currentResourceType.availabilityTimeslots = this.currentResourceType.availabilityTimeslots.concat([this.currentTimeslot]);
        this.currentTimeslot = new AvailabilityTimeslotSchema();
    }

    onDeleteTimeslot(index, element) {
        let i = 0;
        this.currentResourceType.availabilityTimeslots = this.currentResourceType.availabilityTimeslots.filter(item => i++ != index);
    }

    async onStartMailClick(startMail: boolean) {
        let getSubject = () => {
            return startMail ?
                this.currentResourceType.customData.notificationMailStartSubject :
                this.currentResourceType.customData.notificationMailEndSubject
        }
        let getBody = () => {
            return startMail ?
                this.currentResourceType.customData.notificationMailStartBody :
                this.currentResourceType.customData.notificationMailEndBody
        }
        let res = await this.dialog.open(HtmlEditorDialogComponent, {
            width: '600px',
            minHeight: '400px',
            panelClass: 'custom-dialog-container',
            data: {
                title: 'Edit mail',
                mailSubject: getSubject(),
                mailBody: getBody(),
                helpContents: {
                    title: "Legenda",
                    helpRows: [
                        ['%USER%', 'Nome utente'],
                        ['%DATE%', 'Data prenotazione']
                    ]
                }
            }
        }).afterClosed().toPromise();
        if (res) {
            if (startMail) {
                this.currentResourceType.customData.notificationMailStartSubject = res.mailSubject;
                this.currentResourceType.customData.notificationMailStartBody = res.mailBody;
            } else {
                this.currentResourceType.customData.notificationMailEndSubject = res.mailSubject;
                this.currentResourceType.customData.notificationMailEndBody = res.mailBody;
            }
        }
    }

    onAddListItem(listItemType: LIST_ITEM) {
        if (listItemType == LIST_ITEM.liAreas) {
            this.currentResourceType.customData.areas = this.commonService.safePush(this.currentResourceType.customData.areas, this.newArea);
        } else if (listItemType == LIST_ITEM.liFacility) {
            this.currentResourceType.customData.facilities = this.commonService.safePush(this.currentResourceType.customData.facilities, this.newFacility);
        } else if (listItemType == LIST_ITEM.liLayout) {
            this.currentResourceType.customData.layouts = this.commonService.safePush(this.currentResourceType.customData.layouts, this.newLayout);
        }
        this.changeDetectorRef.detectChanges();
    }

    onDeleteListItem(listItemType: LIST_ITEM, value: string) {
        if (listItemType == LIST_ITEM.liAreas) {
            this.currentResourceType.customData.areas = this.currentResourceType.customData.areas.filter(area => area != value);
        } else if (listItemType == LIST_ITEM.liFacility) {
            this.currentResourceType.customData.facilities = this.currentResourceType.customData.facilities.filter(facility => facility != value);
        } else if (listItemType == LIST_ITEM.liLayout) {
            this.currentResourceType.customData.layouts = this.currentResourceType.customData.layouts.filter(layout => layout != value);
        }
    }
}
