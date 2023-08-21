import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {RESOURCE_TYPE} from 'projects/fe-common-v2/src/lib/models/bookable-assets';
import {CommonService} from "../../../../../../../fe-common-v2/src/lib/services/common.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatTable} from "@angular/material/table";
import {AddEditSingleFieldPopupComponent} from "../../../../popup/add-edit-single-field-popup/add-edit-single-field-popup.component";
import {EventHelper} from "../../../../../../../fe-common-v2/src/lib";
import {MatDialog} from "@angular/material/dialog";
import {DeletePopupComponent} from "../../../../popup/delete-popup/delete-popup.component";
import {ResourceManagementService} from "../../../../../../../fe-common-v2/src/lib/services/resource-management.service";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {AddEditDisputePopupComponent} from "../../../../popup/add-edit-dispute-popup/add-edit-dispute-popup.component";
import { SendEmailPopupComponent } from 'projects/fe-insights-v2/src/app/popup/send-email-popup/send-email-popup.component';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

enum LIST_ITEM {
    liAreas,
    liFacility,
    liLayout
}

@Component({
    selector: 'app-add-edit-resource-group',
    templateUrl: './add-edit-resource-group.component.html',
    styleUrls: ['./add-edit-resource-group.component.scss']
})
export class AddEditResourceGroupComponent implements OnInit,AfterViewInit {
    addResourceGroupForm: FormGroup;
    RESOURCE_TYPE = RESOURCE_TYPE;
    resourceTypeList : any;
    priorityAvailabilityTags: string[] = [];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    LIST_ITEM = LIST_ITEM;
    resourceTypeListDisplayedColumns: string[] = ['name', 'action'];
    timeSlotDisplayedColumns: string[] = ['label','startTime','endTime','charges', 'action'];
    newArea: string;
    newFacility: string;
    newLayout: string;
    dataPass: any;
    dataDeletePass: any;
    public requestPara = {search: '', page: 1, limit: 10, sortBy: '1', sortKey: 'name'};
    @ViewChild('tableArea') tableArea: MatTable<any>;
    @ViewChild('tableFacility') tableFacility: MatTable<any>;
    @ViewChild('tableLayouts') tableLayouts: MatTable<any>;
    @ViewChild('timeSlotTable') timeSlotTable: MatTable<any>;

    /*resourceTypeList = [
      {value:"Parking",viewValue:"Parking"},
      {value:"Desk",viewValue:"Desk"},
      {value:"Room",viewValue:"Room"},
      {value:"E-Charger",viewValue:"E-Charger"},
      {value:"Car Wash",viewValue:"Car Wash"},
      {value:"Other",viewValue:"Other"},
    ]*/

    tagFC: FormControl = new FormControl();
    selectedResourceType: string;
    permission: any;
    timeSlotForm: FormGroup;
    type: any;
    customData: any={};
    notificationMailStartBody: string='';
    notificationMailStartSubject: any;
    notificationMailEndBody: string='';
    notificationMailEndSubject: any="";
    currentResourceGroup: any;
    resourceGroupData: any;
    resourceTypeEdit: any;
    startTimeValue: any;
    priorityTimeValue: any;
    availabilityEnd: string = "23:59";
    submitted = false;
    sidebarMenuName: string;
    isActiveTab = 1
    constructor(
        private resourceManagementService: ResourceManagementService,
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private ApiService:ResourceManagementService,
        private helper: MCPHelperService,
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService
    ) {

        let now = new Date();
        this.addResourceGroupForm = this._formBuilder.group({
            type:['',[Validators.required]],
            name: '',
            description: '',
            availabilityStart: '',
            availabilityHoursAfterStart: '',
            minimumReservedPool: '',
            priorityAvailabilityStart: '',
            priorityAvailabilityEnd: '',
            extraAvailabilityRanges: [{
                name: 'PRIORITY_TAG',
                availabilityStart: '',
                availabilityEnd: '',
                targetTags: ''
            }],
            parkHelpButtonMessage: '',
            parkHelpPhoneNumber: '',
            parkRefreshAvailable: '',
            parkRefreshInterval: '',
            parkRefreshMessage: '',
            personalParkAutoBookAfterAvailability: '',
            newArea: '',
            newFacility: '',
            newLayout: '',
            availabilityTimeslots:[[]],
            customData: [{
                areas : [],
                facilities: [],
                layouts: []
            }],
            availableStatus:[],
            checkInMode:''
        });
        this.timeSlotForm=this._formBuilder.group({
            name:'',
            startTime:'',
            endTime:'',
            maxCount:''
        })



    }

    ngOnInit(): void {
        this.sideMenuName()
    }
    sideMenuName() {
        this.sidebarMenuName = 'INSIGHTS_MENU.Resource_Group';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    ngAfterViewInit(){
        this.getResourceGroupById()
        this.getResourceType({},name)

    }
    getResourceGroupById(){
        this.currentResourceGroup = this.route.snapshot.queryParams.id;
        if (this.currentResourceGroup) {
            this.resourceManagementService.getBookableResourceType(this.currentResourceGroup).then((response) => {
                if (response.result) {
                    this.resourceGroupData = response.data
                    let name = this.resourceGroupData.type
                    this.getResourceType({}, name)
                    if (this.resourceGroupData.type === 'ROOM') {
                        this.customData = {
                            areas: this.resourceGroupData.customData.areas.map(item => {return { name: item };}),
                            facilities: this.resourceGroupData.customData.facilities.map(item => {return { name: item };}),
                            layouts: this.resourceGroupData.customData.layouts.map(item => {return { name: item };})
                        }
                    }
                    this.addResourceGroupForm.patchValue({
                        id:this.resourceGroupData.id,
                        availabilityStart:this.resourceGroupData.availabilityStart?.slice(11, 16),
                        availabilityHoursAfterStart:this.resourceGroupData.availabilityHoursAfterStart,
                        minimumReservedPool:this.resourceGroupData.minimumReservedPool,
                        priorityAvailabilityStart:this.resourceGroupData.extraAvailabilityRanges[0].availabilityEnd?.slice(11, 16),
                        priorityAvailabilityEnd:this.resourceGroupData.extraAvailabilityRanges[0].availabilityEnd?.slice(11, 16),
                        extraAvailabilityRanges:this.resourceGroupData.extraAvailabilityRanges,
                        parkHelpButtonMessage:this.resourceGroupData.customData.parkHelpButtonMessage,
                        parkHelpPhoneNumber:this.resourceGroupData.customData.parkHelpPhoneNumber,
                        parkRefreshAvailable:this.resourceGroupData.customData.parkRefreshAvailable,
                        parkRefreshInterval:this.resourceGroupData.customData.parkRefreshInterval,
                        parkRefreshMessage:this.resourceGroupData.customData.parkRefreshMessage,
                        personalParkAutoBookAfterAvailability:this.resourceGroupData.customData.personalParkAutoBookAfterAvailability,
                        customData:this.customData,
                        availabilityTimeslots:this.resourceGroupData.availabilityTimeslots,
                        description:this.resourceGroupData.description,
                        name:this.resourceGroupData.name,
                    })
                    this.priorityAvailabilityTags= this.resourceGroupData.extraAvailabilityRanges[0].targetTags
                    this.notificationMailStartBody=this.resourceGroupData.customData.notificationMailStartBody;
                    this.notificationMailStartSubject=this.resourceGroupData.customData.notificationMailStartSubject;
                    this.notificationMailEndBody=this.resourceGroupData.customData.notificationMailEndBody;
                    this.notificationMailEndSubject=this.resourceGroupData.customData.notificationMailEndSubject;
                }
            })
        }
    }


    async getResourceType(request,name): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiService.getResourceType(this.requestPara);
        if (res.result === true){
            this.resourceTypeList = res.data;
            if (this.resourceGroupData?.type && this.resourceTypeList){
                this.resourceTypeEdit = this.resourceTypeList.find(item => item.name === name);
            }
                this.helper.toggleLoaderVisibility(false);
        }else {
            this.helper.toggleLoaderVisibility(false);

        }
    }

    public removeValidators(form: FormGroup) {
        for (const key in form.controls) {
            form.get(key).clearValidators();
            form.get(key).updateValueAndValidity();
        }}
    // selectResourceType(type){
    //     this.addResourceGroupForm.clearValidators()
    //     this.addResourceGroupForm.updateValueAndValidity()
    //     this.type =type?.permission.name
    //     // this.selectedResourceType =type.source.value.permission
    //     this.permission =type?.permission
    //     this.permission?.requiredName === true ? (this.addResourceGroupForm.get('name').setValidators(Validators.required),this.addResourceGroupForm.get('name').updateValueAndValidity()):(this.addResourceGroupForm.get('name').clearValidators(),this.addResourceGroupForm.get('name').updateValueAndValidity());
    //     this.permission?.requiredDescription === true ? (this.addResourceGroupForm.get('description').setValidators(Validators.required),this.addResourceGroupForm.get('description').updateValueAndValidity()):(this.addResourceGroupForm.get('description').clearValidators(),this.addResourceGroupForm.get('description').updateValueAndValidity());
    //     this.permission?.requiredAvailabilityHours === true ? (this.addResourceGroupForm.get('availabilityHoursAfterStart').setValidators(Validators.required),this.addResourceGroupForm.get('availabilityHoursAfterStart').updateValueAndValidity()):(this.addResourceGroupForm.get('availabilityHoursAfterStart').clearValidators(),this.addResourceGroupForm.get('availabilityHoursAfterStart').updateValueAndValidity());
    //     this.permission?.requiredAvailabilityStart === true ? (this.addResourceGroupForm.get('availabilityStart').setValidators(Validators.required), this.addResourceGroupForm.get('availabilityStart').updateValueAndValidity() ):(this.addResourceGroupForm.get('availabilityStart').clearValidators(),this.addResourceGroupForm.get('availabilityStart').updateValueAndValidity());
    //     this.permission?.requiredEnableRefreshParkTile === true ? (this.addResourceGroupForm.get('parkRefreshAvailable').setValidators(Validators.required),this.addResourceGroupForm.get('parkRefreshAvailable'),this.addResourceGroupForm.get('parkRefreshAvailable').updateValueAndValidity()):(this.addResourceGroupForm.get('parkRefreshAvailable').clearValidators(),this.addResourceGroupForm.get('parkRefreshAvailable').updateValueAndValidity());
    //     this.permission?.requiredMinimumReservedPool === true ? (this.addResourceGroupForm.get('minimumReservedPool').setValidators(Validators.required),this.addResourceGroupForm.get('minimumReservedPool').updateValueAndValidity()): (this.addResourceGroupForm.get('minimumReservedPool').clearValidators(),this.addResourceGroupForm.get('minimumReservedPool').updateValueAndValidity());
    //     this.permission?.requiredPriorityStart === true ? (this.addResourceGroupForm.get('priorityAvailabilityStart').setValidators(Validators.required),this.addResourceGroupForm.get('priorityAvailabilityStart').updateValueAndValidity()):(this.addResourceGroupForm.get('priorityAvailabilityStart').clearValidators(),this.addResourceGroupForm.get('priorityAvailabilityStart').updateValueAndValidity());
    //     this.permission?.requiredPriorityEnd === true ? (this.addResourceGroupForm.get('priorityAvailabilityEnd').setValidators(Validators.required),this.addResourceGroupForm.get('priorityAvailabilityEnd').updateValueAndValidity()):(this.addResourceGroupForm.get('priorityAvailabilityEnd').clearValidators(),this.addResourceGroupForm.get('priorityAvailabilityEnd').updateValueAndValidity());
    //     this.permission?.requiredHelpButtonText === true ? (this.addResourceGroupForm.get('parkHelpButtonMessage').setValidators(Validators.required),this.addResourceGroupForm.get('parkHelpButtonMessage').updateValueAndValidity()):(this.addResourceGroupForm.get('parkHelpButtonMessage').clearValidators(),this.addResourceGroupForm.get('parkHelpButtonMessage').updateValueAndValidity());
    //     this.permission?.requiredHelpPhone === true ? (this.addResourceGroupForm.get('parkHelpPhoneNumber').setValidators(Validators.required),this.addResourceGroupForm.get('parkHelpPhoneNumber').updateValueAndValidity()):(this.addResourceGroupForm.get('parkHelpPhoneNumber').clearValidators(),this.addResourceGroupForm.get('parkHelpPhoneNumber').updateValueAndValidity());
    //     this.permission?.requiredRefreshMessage === true ? (this.addResourceGroupForm.get('parkRefreshMessage').setValidators(Validators.required),this.addResourceGroupForm.get('parkRefreshMessage').updateValueAndValidity()):(this.addResourceGroupForm.get('parkRefreshMessage').clearValidators(),this.addResourceGroupForm.get('parkRefreshMessage').updateValueAndValidity());
    //     this.permission?.requiredRefreshInterval === true ? (this.addResourceGroupForm.get('parkRefreshInterval').setValidators(Validators.required),this.addResourceGroupForm.get('parkRefreshInterval').updateValueAndValidity()):(this.addResourceGroupForm.get('parkRefreshInterval').clearValidators(),this.addResourceGroupForm.get('parkRefreshInterval').updateValueAndValidity());
    //     this.permission?.requiredPersonalParkAutoBookAfterAvailability === true ? (this.addResourceGroupForm.get('personalParkAutoBookAfterAvailability').setValidators(Validators.required),this.addResourceGroupForm.get('personalParkAutoBookAfterAvailability').updateValueAndValidity()):(this.addResourceGroupForm.get('personalParkAutoBookAfterAvailability').clearValidators(),this.addResourceGroupForm.get('personalParkAutoBookAfterAvailability').updateValueAndValidity());
    //     this.permission?.requiredTimeSlot === true ? (this.timeSlotForm.get('name').setValidators(Validators.required),this.timeSlotForm.get('name').updateValueAndValidity()):(this.timeSlotForm.get('name').clearValidators(),this.timeSlotForm.get('name').updateValueAndValidity());
    //     this.permission?.requiredTimeSlot === true ? (this.timeSlotForm.get('startTime').setValidators(Validators.required),this.timeSlotForm.get('startTime').updateValueAndValidity()):(this.timeSlotForm.get('startTime').clearValidators(),this.timeSlotForm.get('startTime').updateValueAndValidity());
    //     this.permission?.requiredTimeSlot === true ? (this.timeSlotForm.get('endTime').setValidators(Validators.required),this.timeSlotForm.get('endTime').updateValueAndValidity()):(this.timeSlotForm.get('endTime').clearValidators(),this.timeSlotForm.get('endTime').updateValueAndValidity());
    //     this.permission?.requiredTimeSlot === true ? (this.timeSlotForm.get('maxCount').setValidators(Validators.required),this.timeSlotForm.get('maxCount').updateValueAndValidity()):(this.timeSlotForm.get('maxCount').clearValidators(),this.timeSlotForm.get('maxCount').updateValueAndValidity());
    // }
    selectResourceType(type) {
        this.addResourceGroupForm.clearValidators();
        this.addResourceGroupForm.updateValueAndValidity();
        this.type = type?.permission.name;
        this.permission = type?.permission;

        const requiredFields = [
            { field: 'name', required: this.permission?.requiredName },
            { field: 'description', required: this.permission?.requiredDescription },
            { field: 'availabilityHoursAfterStart', required: this.permission?.requiredAvailabilityHours },
            { field: 'availabilityStart', required: this.permission?.requiredAvailabilityStart },
            { field: 'parkRefreshAvailable', required: this.permission?.requiredEnableRefreshParkTile },
            { field: 'minimumReservedPool', required: this.permission?.requiredMinimumReservedPool },
            { field: 'priorityAvailabilityStart', required: this.permission?.requiredPriorityStart },
            { field: 'priorityAvailabilityEnd', required: this.permission?.requiredPriorityEnd },
            { field: 'parkHelpButtonMessage', required: this.permission?.requiredHelpButtonText },
            { field: 'parkHelpPhoneNumber', required: this.permission?.requiredHelpPhone },
            { field: 'parkRefreshMessage', required: this.permission?.requiredRefreshMessage },
            { field: 'parkRefreshInterval', required: this.permission?.requiredRefreshInterval },
            { field: 'personalParkAutoBookAfterAvailability', required: this.permission?.requiredPersonalParkAutoBookAfterAvailability },
        ];

        requiredFields.forEach(({ field, required }) => {
            const control = this.addResourceGroupForm.get(field);
            if (required) {
                control.setValidators(Validators.required);
            } else {
                control.clearValidators();
            }
            control.updateValueAndValidity();
        });

        if (this.permission?.requiredTimeSlot) {
            this.timeSlotForm.get('name').setValidators(Validators.required);
            this.timeSlotForm.get('startTime').setValidators(Validators.required);
            this.timeSlotForm.get('endTime').setValidators(Validators.required);
            this.timeSlotForm.get('maxCount').setValidators(Validators.required);
        } else {
            this.timeSlotForm.get('name').clearValidators();
            this.timeSlotForm.get('startTime').clearValidators();
            this.timeSlotForm.get('endTime').clearValidators();
            this.timeSlotForm.get('maxCount').clearValidators();
        }

        this.timeSlotForm.get('name').updateValueAndValidity();
        this.timeSlotForm.get('startTime').updateValueAndValidity();
        this.timeSlotForm.get('endTime').updateValueAndValidity();
        this.timeSlotForm.get('maxCount').updateValueAndValidity();
    }

    async saveResourceGroup() {
        this.submitted = true;
        if (this.addResourceGroupForm.valid &&
            (this.permission?.requiredArea ===true ? this.addResourceGroupForm.value.customData.areas?.length !==0 : this.addResourceGroupForm.value.customData.areas?.length >=0)&&
            (this.permission?.requiredFacility ===true ? this.addResourceGroupForm.value.customData.facilities?.length !==0 : this.addResourceGroupForm.value.customData.facilities?.length >=0)&&
            (this.permission?.requiredLayout ===true ? this.addResourceGroupForm.value.customData.layouts?.length !==0:this.addResourceGroupForm.value.customData.layouts?.length >=0)&&
            (this.permission?.requiredTimeSlot===true ? this.addResourceGroupForm.value.availabilityTimeslots.length!==0:this.addResourceGroupForm.value.availabilityTimeslots.length>=0)&&
            (this.permission?.requiredPriorityTag===true ? this.priorityAvailabilityTags.length!==0:this.priorityAvailabilityTags.length>=0)
        ) {
                this.customData = {
                    parkHelpButtonMessage: this.addResourceGroupForm.value.parkHelpButtonMessage,
                    parkHelpPhoneNumber: this.addResourceGroupForm.value.parkHelpPhoneNumber,
                    parkRefreshAvailable: this.addResourceGroupForm.value.parkRefreshAvailable,
                    parkRefreshInterval: this.addResourceGroupForm.value.parkRefreshInterval,
                    parkRefreshMessage: this.addResourceGroupForm.value.parkRefreshMessage,
                    personalParkAutoBookAfterAvailability: this.addResourceGroupForm.value.personalParkAutoBookAfterAvailability,
                    areas: this.addResourceGroupForm.value.customData.areas.map(a => a.name),
                    facilities: this.addResourceGroupForm.value.customData.facilities.map(a => a.name),
                    layouts: this.addResourceGroupForm.value.customData.layouts.map(a => a.name),
                    notificationMailEndBody: this.notificationMailEndBody,
                    notificationMailEndSubject: this.notificationMailEndSubject,
                    notificationMailStartBody: this.notificationMailStartBody,
                    notificationMailStartSubject: this.notificationMailStartSubject
            }
            let now = new Date();
            //this.commonService.buildDateTimeFromHHMM(now, this.availabilityEnd);
            const resourceGrpData: any = {
                type:this.addResourceGroupForm.value.type.name,
                name: this.addResourceGroupForm.value.name,
                description: this.addResourceGroupForm.value.description,
                availabilityBeforeDays: 1,
                availabilityHoursAfterStart:this.addResourceGroupForm.value.availabilityHoursAfterStart,
                availabilityStart:this.commonService?.buildDateTimeFromHHMM(now,this.addResourceGroupForm.value.availabilityStart?this.addResourceGroupForm.value.availabilityStart:''),
                availabilityEnd: this.commonService.buildDateTimeFromHHMM(now,this.availabilityEnd),
                availabilityTimeslots: this.addResourceGroupForm.value.availabilityTimeslots,
                availableStatus: this.addResourceGroupForm.value.availableStatus,
                checkInMode:"NONE", /*this.addResourceGroupForm.value.checkInMode*/
                customData: this.customData,
                site:"TDB",
                extraAvailabilityRanges: {
                    availabilityEnd:this.commonService.buildDateTimeFromHHMM(now,this.addResourceGroupForm.value.priorityAvailabilityEnd?this.addResourceGroupForm.value.priorityAvailabilityEnd:''),
                    availabilityStart: this.commonService.buildDateTimeFromHHMM(now,this.addResourceGroupForm.value.priorityAvailabilityStart?this.addResourceGroupForm.value.priorityAvailabilityStart:''),
                    name: this.addResourceGroupForm.value.extraAvailabilityRanges.name,
                    targetTags: this.priorityAvailabilityTags
                }
            }
            if(!this.currentResourceGroup){
                let res = await this.resourceManagementService.addOrUpdateBookableResourceTypes(resourceGrpData);
                if (this.commonService.isValidResponse(res)) {
                    swal.fire(
                        '',
                        this.translate.instant('ASSETS_MANAGEMENT.Resource type added successfully'),
                        'success'
                    );
                    this.router.navigate(['/assets-management/resource-group']);
                } else {
                    swal.fire('',
                        res.reason,
                        'info'
                    );
                }
            }else {
                Object.assign(resourceGrpData, {id:this.currentResourceGroup});
                let res = await this.resourceManagementService.addOrUpdateBookableResourceTypes(resourceGrpData);
                if (this.commonService.isValidResponse(res)) {
                    swal.fire(
                        '',
                        this.translate.instant('ASSETS_MANAGEMENT.Resource type updated successfully'),
                        'success'
                    );
                    this.router.navigate(['/assets-management/resource-group']);
                } else {
                    swal.fire('',
                        res.reason,
                        'info'
                    );
                }
            }


        }
    }
    onTimeChange(event: any) {
        this.startTimeValue = event;
    }
    priorityTimeChange(event:any){
        this.priorityTimeValue = event
    }
    saveTimeSlot(){
        if(this.timeSlotForm.valid){
            let now = new Date();
            let timeSlotData ={
                name:this.timeSlotForm.value.name,
                startTime:this.commonService.buildDateTimeFromHHMM(now,this.timeSlotForm.value.startTime),
                endTime:this.commonService.buildDateTimeFromHHMM(now,this.timeSlotForm.value.endTime),
                maxCount:this.timeSlotForm.value.maxCount
            }
            this.addResourceGroupForm.value.availabilityTimeslots = this.commonService.safePush(this.addResourceGroupForm.value?.availabilityTimeslots,timeSlotData);
            this.timeSlotTable.renderRows();
            this.changeDetectorRef.detectChanges();
            this.timeSlotForm.reset()
            this.timeSlotForm.clearValidators()
            this.timeSlotForm.updateValueAndValidity()
            this.timeSlotForm.untouched
            this.resetForm()
        }

    }
    resetForm() {
        this.timeSlotForm.markAsUntouched();
        Object.keys(this.timeSlotForm.controls).forEach(key => {
            const control = this.timeSlotForm.get(key);
            control.markAsUntouched();
            control.updateValueAndValidity();
        });
    }
    onDeleteTimeSlotItem(value:string){
        this.dataDeletePass =  {
            message: 'Are you sure you want to delete this Time Slot?',
            heading: 'Delete Time Slot',
        }
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                ...this.dataDeletePass
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.addResourceGroupForm.value.availabilityTimeslots = this.addResourceGroupForm.value?.availabilityTimeslots.filter(availabilityTimeslots => availabilityTimeslots != value);
                this.tableArea.renderRows();
            }
        });
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
    onEndMailClick() {
        const dialogRef = this.dialog.open(SendEmailPopupComponent, {
            data: {
                subject: this.notificationMailEndSubject,
                heading: this.translate.instant("Send Email"),
                validation: this.translate.instant("EVENT_MANAGEMENT.EnterSubjectName"),
                placeholder: this.translate.instant("EVENT_MANAGEMENT.EmailSubject"),
                body:this.notificationMailEndBody
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.notificationMailEndBody =result.emailBody
                this.notificationMailEndSubject = result.subject
            }
        });
    }
    onStartMailClick() {
        const dialogRef = this.dialog.open(SendEmailPopupComponent, {
            data: {
                subject: this.notificationMailStartSubject,
                heading: this.translate.instant("Send Email"),
                validation: this.translate.instant("EVENT_MANAGEMENT.EnterSubjectName"),
                placeholder: this.translate.instant("EVENT_MANAGEMENT.EmailSubject"),
                body:this.notificationMailStartBody
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.notificationMailStartSubject =result.subject
              this.notificationMailStartBody = result.emailBody
            }
        });
    }

    onAddListItem(listItemType: LIST_ITEM) {
        if (listItemType == LIST_ITEM.liAreas) {
            this.dataPass =  {
                placeholder: this.permission?.alternativeArea===''?this.translate.instant('ASSETS_MANAGEMENT.Area'):(this.permission?.alternativeArea ) +' '+ this.translate.instant('EDIT COMPANY.Name') ,
                heading: this.translate.instant('GENERAL.Add') +' '+ this.translate.instant(this.permission?.alternativeArea===''?this.translate.instant('ASSETS_MANAGEMENT.Area'):(this.permission?.alternativeArea )) +' '+ this.translate.instant('EDIT COMPANY.Name'),
                validation: this.translate.instant('GENERAL.Enter') +' '+ this.translate.instant(this.permission?.alternativeArea===''?this.translate.instant('ASSETS_MANAGEMENT.Area'):(this.permission?.alternativeArea )) +' '+ this.translate.instant('EDIT COMPANY.Name')
            }
        } else if (listItemType == LIST_ITEM.liFacility) {
            this.dataPass =  {
                placeholder: this.permission?.alternativeFacility===''?this.translate.instant('ASSETS_MANAGEMENT.Facility'):(this.permission?.alternativeFacility ) +' '+ this.translate.instant('EDIT COMPANY.Name') ,
                heading: this.translate.instant('GENERAL.Add') +' '+ this.translate.instant(this.permission?.alternativeFacility===''?this.translate.instant('ASSETS_MANAGEMENT.Facility'):(this.permission?.alternativeFacility )) +' '+ this.translate.instant('EDIT COMPANY.Name'),
                validation: this.translate.instant('GENERAL.Enter') +' '+ this.translate.instant(this.permission?.alternativeFacility===''?this.translate.instant('ASSETS_MANAGEMENT.Facility'):(this.permission?.alternativeFacility )) +' '+ this.translate.instant('EDIT COMPANY.Name')
            }
        } else if (listItemType == LIST_ITEM.liLayout) {
            this.dataPass =  {
                placeholder: this.permission?.alternativeLayout===''?this.translate.instant('ASSETS_MANAGEMENT.Layout'):(this.permission?.alternativeLayout ) +' '+ this.translate.instant('EDIT COMPANY.Name') ,
                heading: this.translate.instant('GENERAL.Add') +' '+ this.translate.instant(this.permission?.alternativeLayout===''?this.translate.instant('ASSETS_MANAGEMENT.Layout'):(this.permission?.alternativeLayout )) +' '+ this.translate.instant('EDIT COMPANY.Name'),
                validation: this.translate.instant('GENERAL.Enter') +' '+ this.translate.instant(this.permission?.alternativeLayout===''?this.translate.instant('ASSETS_MANAGEMENT.Layout'):(this.permission?.alternativeLayout )) +' '+ this.translate.instant('EDIT COMPANY.Name')
            }
        }

        const dialogRef = this.dialog.open(AddEditSingleFieldPopupComponent, {
            data: {
                ...this.dataPass
            }
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                if (listItemType == LIST_ITEM.liAreas) {
                    this.addResourceGroupForm.value.customData.areas = this.commonService.safePush(this.addResourceGroupForm.value?.customData?.areas, result);
                    this.tableArea.renderRows();
                } else if (listItemType == LIST_ITEM.liFacility) {
                    this.addResourceGroupForm.value.customData.facilities = this.commonService.safePush(this.addResourceGroupForm.value?.customData?.facilities, result);
                    this.tableFacility.renderRows();
                } else if (listItemType == LIST_ITEM.liLayout) {
                    this.addResourceGroupForm.value.customData.layouts = this.commonService.safePush(this.addResourceGroupForm.value?.customData?.layouts, result);
                    this.tableLayouts.renderRows();
                }
                this.changeDetectorRef.detectChanges();
            }
        });

    }



    onDeleteListItem(listItemType: LIST_ITEM, value: string) {
        if (listItemType == LIST_ITEM.liAreas) {
            this.dataDeletePass =  {
                message: this.translate.instant('ASSETS_MANAGEMENT.AreYouSureYouWantToDeleteThis') +' '+ this.translate.instant(this.permission?.alternativeArea===''?this.translate.instant('ASSETS_MANAGEMENT.Area'):(this.permission?.alternativeArea ))+"?",
                heading: this.translate.instant('GENERAL.Delete') +' '+ this.translate.instant(this.permission?.alternativeArea===''?this.translate.instant('ASSETS_MANAGEMENT.Area'):(this.permission?.alternativeArea )),
            }
        } else if (listItemType == LIST_ITEM.liFacility) {
            this.dataDeletePass =  {
                message: this.translate.instant('ASSETS_MANAGEMENT.AreYouSureYouWantToDeleteThis') +' '+ this.translate.instant(this.permission?.alternativeFacility===''?this.translate.instant('ASSETS_MANAGEMENT.Facility'):(this.permission?.alternativeFacility ))+"?",
                heading: this.translate.instant('GENERAL.Delete') +' '+ this.translate.instant(this.permission?.alternativeFacility===''?this.translate.instant('ASSETS_MANAGEMENT.Facility'):(this.permission?.alternativeFacility )),
            }
        } else if (listItemType == LIST_ITEM.liLayout) {
            this.dataDeletePass =  {
                message: this.translate.instant('ASSETS_MANAGEMENT.AreYouSureYouWantToDeleteThis') +' '+ this.translate.instant(this.permission?.alternativeLayout===''?this.translate.instant('ASSETS_MANAGEMENT.Layout'):(this.permission?.alternativeLayout ))+"?",
                heading: this.translate.instant('GENERAL.Delete') +' '+ this.translate.instant(this.permission?.alternativeLayout===''?this.translate.instant('ASSETS_MANAGEMENT.Layout'):(this.permission?.alternativeLayout )),
            }
        }
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                ...this.dataDeletePass
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (listItemType == LIST_ITEM.liAreas) {
                    this.addResourceGroupForm.value.customData.areas = this.addResourceGroupForm.value?.customData?.areas.filter(area => area != value);
                    this.tableArea.renderRows();
                } else if (listItemType == LIST_ITEM.liFacility) {
                    this.addResourceGroupForm.value.customData.facilities = this.addResourceGroupForm.value?.customData?.facilities.filter(facility => facility != value);
                    this.tableFacility.renderRows();
                } else if (listItemType == LIST_ITEM.liLayout) {
                    this.addResourceGroupForm.value.customData.layouts = this.addResourceGroupForm.value?.customData?.layouts.filter(layout => layout != value);
                    this.tableLayouts.renderRows();
                }
            }
        });

    }


}
