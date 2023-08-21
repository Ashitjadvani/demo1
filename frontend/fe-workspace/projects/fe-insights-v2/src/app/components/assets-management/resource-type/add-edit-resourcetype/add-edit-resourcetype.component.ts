import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddEditDisputePopupComponent } from 'projects/fe-insights-v2/src/app/popup/add-edit-dispute-popup/add-edit-dispute-popup.component';
import {
    Company,
    Scope,
} from '../../../../../../../fe-common-v2/src/lib/models/company';
import { tagsName } from '../../../people/add-user/add-user.component';
import { AdminUserManagementService } from '../../../../../../../fe-common-v2/src/lib/services/admin-user-management.service';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { MCPHelperService } from '../../../../service/MCPHelper.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterModulesScopesService } from 'projects/fe-common-v2/src/lib/services/master-modules-scopes.service';
import { ResourceManagementService } from 'projects/fe-common-v2/src/lib/services/resource-management.service';
import {MatStepper} from "@angular/material/stepper";
import {SelectionModel} from "@angular/cdk/collections";
@Component({
  selector: 'app-add-edit-resourcetype',
  templateUrl: './add-edit-resourcetype.component.html',
  styleUrls: ['./add-edit-resourcetype.component.scss']
})
export class AddEditResourcetypeComponent implements OnInit {
    currentCompany: any;
    companyId: any;
    scopeId: any;
    scopeName: any;
    name: any;
    scopeData: any;
    submitted = false;
    breadcrumb = "Add";
    selection = new SelectionModel<any>(true, []);
    @ViewChild('stepper') stepper : MatStepper;

    currentScope: Scope;
    resourceTypeDetailsForm: FormGroup;
    contactInformationForm: FormGroup;
    page = 1;
    itemsPerPage = '5';
    totalItems = 0;
    search = '';
    sortKey = 1;
    sortBy = '';
    sortClass = 'down';
    responseData: any = null;
    disabled: boolean;
    selected: any = [];
    allSelected = false;
    settingsFieldsList = [
        {
            id: 0,
            title: 'Name',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 1,
            title: 'Description',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 2,
            title: 'Area',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 3,
            title: 'Facility',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 4,
            title: 'Layout',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 5,
            title: 'Availability Start',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 6,
            title: 'Availability Hours',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 7,
            title: 'Minimum Reserved Pool',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 8,
            title: 'Priority Start',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 9,
            title: 'Priority End',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 10,
            title: 'Priority Tag',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 11,
            title: 'Help Button Text',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 12,
            title: 'Help Phone',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 13,
            title: 'Refresh Message',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 14,
            title: 'Enable refresh park tile',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 15,
            title: 'Personal park auto-book after availability',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 16,
            title: 'Email alert',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 17,
            title: 'Pickup Email',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 18,
            title: 'Refresh interval',
            check: false,
            isRequired: false,
            alternativeName: '',
        },
        {
            id: 19,
            title: 'Time Slot',
            check: false,
            isRequired: false,
            alternativeName: '',
        },

    ];
    settingsFieldsDisplayedColumns: string[] = [
        'title',
        'isRequired',
        'alternativeName',
    ];
    ResourceTypeId: any;
    ResourceTypeData: any;
    permission: any;
    checkAddEditID: string;
    sidebarMenuName: string;
  constructor(
      private _formBuilder: FormBuilder,
      private dialog: MatDialog,
      private adminUserManagementService: AdminUserManagementService,
      private router: Router,
      public translate: TranslateService,
      private activitedRoute: ActivatedRoute,
      private ApiService: MasterModulesScopesService,
      private ApiServiceResourceType:ResourceManagementService,
      private helper: MCPHelperService,
  ) {

      this.resourceTypeDetailsForm = this._formBuilder.group({
          name: [null, [MCPHelperService.noWhitespaceValidator,MCPHelperService.nameValidator, Validators.required]],
      });
      this.contactInformationForm = this._formBuilder.group({
          settingFields: this._formBuilder.array([]),
      });
      this.settingsFieldsList.forEach((b: any) => {
          this.settingFields.push(this._formBuilder.group(b));
      });
      this.resourceTypeDetailsForm = this._formBuilder.group({
          name:[null,[MCPHelperService.noWhitespaceValidator,MCPHelperService.nameValidator, Validators.required]],
          enableName:[false],
          enableDescription:[false],
          enableArea:[false],
          enableFacility:[false],
          enableLayout:[false],
          enableAvailabilityStart:[false],
          enableAvailabilityHours:[false],
          enableMinimumReservedPool:[false],
          enablePriorityStart:[false],
          enablePriorityEnd:[false],
          enablePriorityTag:[false],
          enableHelpButtonText:[false],
          enableHelpPhone:[false],
          enableRefreshMessage:[false],
          enableEnableRefreshParkTile:[false],
          enablePersonalParkAutoBookAfterAvailability:[false],
          enableEmailAlert:[false],
          enablePickupEmail:[false],
          enableRefreshInterval:[false],
          enableTimeSlot:[false],
          requiredName:[false],
          requiredDescription:[false],
          requiredArea:[false],
          requiredFacility:[false],
          requiredLayout:[false],
          requiredAvailabilityStart:[false],
          requiredAvailabilityHours:[false],
          requiredMinimumReservedPool:[false],
          requiredPriorityStart:[false],
          requiredPriorityEnd:[false],
          requiredPriorityTag:[false],
          requiredHelpButtonText:[false],
          requiredHelpPhone:[false],
          requiredRefreshMessage:[false],
          requiredEnableRefreshParkTile:[false],
          requiredPersonalParkAutoBookAfterAvailability:[false],
          requiredEmailAlert:[false],
          requiredPickupEmail:[false],
          requiredRefreshInterval:[false],
          requiredTimeSlot:[false],
          alternativeName:[""],
          alternativeDescription:[""],
          alternativeArea:[""],
          alternativeFacility:[""],
          alternativeLayout:[""],
          alternativeAvailabilityStart:[""],
          alternativeAvailabilityHours:[""],
          alternativeMinimumReservedPool:[""],
          alternativePriorityStart:[""],
          alternativePriorityEnd:[""],
          alternativePriorityTag:[""],
          alternativeHelpButtonText:[""],
          alternativeHelpPhone:[""],
          alternativeRefreshMessage:[""],
          alternativeEnableRefreshParkTile:[""],
          alternativePersonalParkAutoBookAfterAvailability:[""],
          alternativeEmailAlert:[""],
          alternativePickupEmail:[""],
          alternativeRefreshInterval:[""],
          alternativeTimeSlot:[""]
      });
  }

    ngOnInit(): void {
        this.currentCompany = localStorage.getItem('credentials');
        var json = JSON.parse(this.currentCompany);
        this.companyId = json.person.companyId;
        this.ResourceTypeId = this.activitedRoute.snapshot.paramMap.get('id');
        this.checkAddEditID = this.activitedRoute.snapshot.paramMap.get('id');
        if (this.ResourceTypeId !== '0') {
            this.breadcrumb = "Edit"
            this.getResorceTypeById()
        }
        this.sideMenuName()
    }

    sideMenuName() {
        this.sidebarMenuName = 'ASSETS_MANAGEMENT.ResourceType';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    openAddAlternativeFieldDialog(id: number) {
        const dialogRef = this.dialog.open(AddEditDisputePopupComponent, {
            data: {
                placeholder: 'Alternative Area Name',
                heading: 'Add Alternative Field',
                validation: 'Enter your alternative area name',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.responseData = result.description;
                this.settingsFieldsList[id].alternativeName = this.responseData;
            }
        });
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.settingsFieldsList.length;
        return numSelected === numRows;
    }

    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.settingsFieldsList);
    }

    editAlternativeName(id: number) {
        const dialogRef = this.dialog.open(AddEditDisputePopupComponent, {
            data: {
                value: this.settingsFieldsList[id].alternativeName,
                placeholder: 'Alternative Area Name',
                heading: 'Edit Alternative Field',
                validation: 'Enter your alternative area name',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.responseData = result.description;
                this.settingsFieldsList[id].alternativeName = this.responseData;
            }
        });
    }

    deleteAlternativeName(id: number) {
        let deleteName;
        deleteName = this.settingsFieldsList.find((x) => x.id == id);
        deleteName.alternativeName = '';
    }

    get settingFields(): FormArray {
        return this.contactInformationForm.get('settingFields') as FormArray;
    }

    onFileChanged(input: HTMLInputElement): void {}

    scopesList:any;
    isAddEdit = false;


    onSubmit(stepper: MatStepper, number: Number) {

        if (number == 1 ) {
            this.submitted = true;
            if (this.resourceTypeDetailsForm.invalid) {
                return;
            }

            if (this.ResourceTypeId !== '0') {
                this.ApiServiceResourceType.addResourceTypeNamePermission(
                    {
                        id:this.ResourceTypeId,
                        name:this.resourceTypeDetailsForm.value.name,
                        permission:this.resourceTypeDetailsForm.value
                    }
                ).then(res=>{
                    this.stepper.next();
                });
            } else {
                this.ApiServiceResourceType.addResourceTypeNamePermission({name:this.resourceTypeDetailsForm.value.name,permission:this.resourceTypeDetailsForm.value}).then((res=>{
                    if (res.result === true){
                        this.stepper.next();
                        let data = res.data
                        this.ResourceTypeId = data.id
                    }else {
                        Swal.fire(
                              '',
                              this.translate.instant(res.reason),
                              'info'
                            )
                    }

                }))
            }
        }
        if (number == 2) {
            this.resourceTypeDetailsForm.patchValue({
                enableName:this.settingsFieldsList[0].check,
                enableDescription:this.settingsFieldsList[1].check,
                enableArea:this.settingsFieldsList[2].check,
                enableFacility:this.settingsFieldsList[3].check,
                enableLayout:this.settingsFieldsList[4].check,
                enableAvailabilityStart:this.settingsFieldsList[5].check,
                enableAvailabilityHours:this.settingsFieldsList[6].check,
                enableMinimumReservedPool:this.settingsFieldsList[7].check,
                enablePriorityStart:this.settingsFieldsList[8].check,
                enablePriorityEnd:this.settingsFieldsList[9].check,
                enablePriorityTag:this.settingsFieldsList[10].check,
                enableHelpButtonText:this.settingsFieldsList[11].check,
                enableHelpPhone:this.settingsFieldsList[12].check,
                enableRefreshMessage:this.settingsFieldsList[13].check,
                enableEnableRefreshParkTile:this.settingsFieldsList[14].check,
                enablePersonalParkAutoBookAfterAvailability:this.settingsFieldsList[15].check,
                enableEmailAlert:this.settingsFieldsList[16].check,
                enablePickupEmail:this.settingsFieldsList[17].check,
                enableRefreshInterval:this.settingsFieldsList[18].check,
                enableTimeSlot:this.settingsFieldsList[19].check,

                requiredName:this.settingsFieldsList[0]?.isRequired,
                requiredDescription:this.settingsFieldsList[1]?.isRequired,
                requiredArea:this.settingsFieldsList[2]?.isRequired,
                requiredFacility:this.settingsFieldsList[3]?.isRequired,
                requiredLayout:this.settingsFieldsList[4]?.isRequired,
                requiredAvailabilityStart:this.settingsFieldsList[5]?.isRequired,
                requiredAvailabilityHours:this.settingsFieldsList[6]?.isRequired,
                requiredMinimumReservedPool:this.settingsFieldsList[7]?.isRequired,
                requiredPriorityStart:this.settingsFieldsList[8]?.isRequired,
                requiredPriorityEnd:this.settingsFieldsList[9]?.isRequired,
                requiredPriorityTag:this.settingsFieldsList[10]?.isRequired,
                requiredHelpButtonText:this.settingsFieldsList[11]?.isRequired,
                requiredHelpPhone:this.settingsFieldsList[12]?.isRequired,
                requiredRefreshMessage:this.settingsFieldsList[13]?.isRequired,
                requiredEnableRefreshParkTile:this.settingsFieldsList[14]?.isRequired,
                requiredPersonalParkAutoBookAfterAvailability:this.settingsFieldsList[15]?.isRequired,
                requiredEmailAlert:this.settingsFieldsList[16]?.isRequired,
                requiredPickupEmail:this.settingsFieldsList[17]?.isRequired,
                requiredRefreshInterval:this.settingsFieldsList[18]?.isRequired,
                requiredTimeSlot:this.settingsFieldsList[19]?.isRequired,

                alternativeName:this.settingsFieldsList[0].alternativeName,
                alternativeDescription:this.settingsFieldsList[1].alternativeName,
                alternativeArea:this.settingsFieldsList[2].alternativeName,
                alternativeFacility:this.settingsFieldsList[3].alternativeName,
                alternativeLayout:this.settingsFieldsList[4].alternativeName,
                alternativeAvailabilityStart:this.settingsFieldsList[5].alternativeName,
                alternativeAvailabilityHours:this.settingsFieldsList[6].alternativeName,
                alternativeMinimumReservedPool:this.settingsFieldsList[7].alternativeName,
                alternativePriorityStart:this.settingsFieldsList[8].alternativeName,
                alternativePriorityEnd:this.settingsFieldsList[9].alternativeName,
                alternativePriorityTag:this.settingsFieldsList[10].alternativeName,
                alternativeHelpButtonText:this.settingsFieldsList[11].alternativeName,
                alternativeHelpPhone:this.settingsFieldsList[12].alternativeName,
                alternativeRefreshMessage:this.settingsFieldsList[13].alternativeName,
                alternativeEnableRefreshParkTile:this.settingsFieldsList[14].alternativeName,
                alternativePersonalParkAutoBookAfterAvailability:this.settingsFieldsList[15].alternativeName,
                alternativeEmailAlert:this.settingsFieldsList[16].alternativeName,
                alternativePickupEmail:this.settingsFieldsList[17].alternativeName,
                alternativeRefreshInterval:this.settingsFieldsList[18].alternativeName,
                alternativeTimeSlot:this.settingsFieldsList[19].alternativeName

            });
            this.ApiServiceResourceType.addResourceTypeNamePermission({id:this.ResourceTypeId,name:this.resourceTypeDetailsForm.value.name,permission:this.resourceTypeDetailsForm.value}).then((res=>{
                if (res.result === true){
                    Swal.fire( '', this.checkAddEditID !=='0' ? this.translate.instant('ASSETS_MANAGEMENT.Resource type updated successfully') : this.translate.instant('ASSETS_MANAGEMENT.Resource type added successfully'), 'success')
                    this.router.navigate([`assets-management/resource-type/`]);
                }
            }))
        }



    }

    toggleAllSelection() {
        if (this.allSelected) {
            this.settingsFieldsList.forEach((x) => {
                x.check = true;
            });
        } else {
            this.settingsFieldsList.forEach((x) => {
                x.check = false;
            });
            this.settingsFieldsList.forEach(field => {
                field.isRequired = false; // change the value of isRequired to true
            });
        }

    }
    checkboxLabel(row?: any): string {
        if (!row) {
            // @ts-ignore
            return `${this.toggleAllSelection() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }


    changeSlideToggle(event: any, index: any) {
        if (event.checked) {
            this.settingsFieldsList[index].isRequired = true;
        } else {
            this.settingsFieldsList[index].isRequired = false;
        }
    }
    changeCheck(event: any, index: any) {
        if (event.checked) {
            this.settingsFieldsList[index].check = true;
        } else {
            this.settingsFieldsList[index].check = false;
        }
    }

    getResorceTypeById(){
        this.ApiServiceResourceType.getResourceTypeById({id:this.ResourceTypeId}).then(res=>{
            if(res.result === true){
                this.ResourceTypeData= res.data
                this.permission= this.ResourceTypeData.permission
                this.resourceTypeDetailsForm.patchValue({
                    name:this.ResourceTypeData.name,
                    //========permission======//
                    enableName:this.permission.enableName,
                    enableDescription:this.permission.enableDescription,
                    enableArea:this.permission.enableArea,
                    enableFacility:this.permission.enableFacility,
                    enableLayout:this.permission.enableLayout,
                    enableAvailabilityStart:this.permission.enableAvailabilityStart,
                    enableAvailabilityHours:this.permission.enableAvailabilityHours,
                    enableMinimumReservedPool:this.permission.enableMinimumReservedPool,
                    enablePriorityStart:this.permission.enablePriorityStart,
                    enablePriorityEnd:this.permission.enablePriorityEnd,
                    enablePriorityTag:this.permission.enablePriorityTag,
                    enableHelpButtonText:this.permission.enableHelpButtonText,
                    enableHelpPhone:this.permission.enableHelpPhone,
                    enableRefreshMessage:this.permission.enableRefreshMessage,
                    enableEnableRefreshParkTile:this.permission.enableEnableRefreshParkTile,
                    enablePersonalParkAutoBookAfterAvailability:this.permission.enablePersonalParkAutoBookAfterAvailability,
                    enableEmailAlert:this.permission.enableEmailAlert,
                    enablePickupEmail:this.permission.enablePickupEmail,
                    enableRefreshInterval:this.permission.enableRefreshInterval,
                    enableTimeSlot:this.permission.enableTimeSlot,

                    requiredName:this.permission.requiredName,
                    requiredDescription:this.permission.requiredDescription,
                    requiredArea:this.permission.requiredArea,
                    requiredFacility:this.permission.requiredFacility,
                    requiredLayout:this.permission.requiredLayout,
                    requiredAvailabilityStart:this.permission.requiredAvailabilityStart,
                    requiredAvailabilityHours:this.permission.requiredAvailabilityHours,
                    requiredMinimumReservedPool:this.permission.requiredMinimumReservedPool,
                    requiredPriorityStart:this.permission.requiredPriorityStart,
                    requiredPriorityEnd:this.permission.requiredPriorityEnd,
                    requiredPriorityTag:this.permission.requiredPriorityTag,
                    requiredHelpButtonText:this.permission.requiredHelpButtonText,
                    requiredHelpPhone:this.permission.requiredHelpPhone,
                    requiredRefreshMessage:this.permission.requiredRefreshMessage,
                    requiredEnableRefreshParkTile:this.permission.requiredEnableRefreshParkTile,
                    requiredPersonalParkAutoBookAfterAvailability:this.permission.requiredPersonalParkAutoBookAfterAvailability,
                    requiredEmailAlert:this.permission.requiredEmailAlert,
                    requiredPickupEmail:this.permission.requiredPickupEmail,
                    requiredRefreshInterval:this.permission.requiredRefreshInterval,
                    requiredTimeSlot:this.permission.requiredTimeSlot,

                    alternativeName:this.permission.alternativeName,
                    alternativeDescription:this.permission.alternativeDescription,
                    alternativeArea:this.permission.alternativeArea,
                    alternativeFacility:this.permission.alternativeFacility,
                    alternativeLayout:this.permission.alternativeLayout,
                    alternativeAvailabilityStart:this.permission.alternativeAvailabilityStart,
                    alternativeAvailabilityHours:this.permission.alternativeAvailabilityHours,
                    alternativeMinimumReservedPool:this.permission.alternativeMinimumReservedPool,
                    alternativePriorityStart:this.permission.alternativePriorityStart,
                    alternativePriorityEnd:this.permission.alternativePriorityEnd,
                    alternativePriorityTag:this.permission.alternativePriorityTag,
                    alternativeHelpButtonText:this.permission.alternativeHelpButtonText,
                    alternativeHelpPhone:this.permission.alternativeHelpPhone,
                    alternativeRefreshMessage:this.permission.alternativeRefreshMessage,
                    alternativeEnableRefreshParkTile:this.permission.alternativeEnableRefreshParkTile,
                    alternativePersonalParkAutoBookAfterAvailability:this.permission.alternativePersonalParkAutoBookAfterAvailability,
                    alternativeEmailAlert:this.permission.alternativeEmailAlert,
                    alternativePickupEmail:this.permission.alternativePickupEmail,
                    alternativeRefreshInterval:this.permission.alternativeRefreshInterval,
                    alternativeTimeSlot:this.permission.alternativeTimeSlot,



                })
                //------checkBox-------//
                this.settingsFieldsList[0].check = this.permission.enableName,
                this.settingsFieldsList[1].check = this.permission.enableDescription,
                this.settingsFieldsList[2].check = this.permission.enableArea,
                this.settingsFieldsList[3].check = this.permission.enableFacility,
                this.settingsFieldsList[4].check = this.permission.enableLayout,
                this.settingsFieldsList[5].check = this.permission.enableAvailabilityStart,
                this.settingsFieldsList[6].check = this.permission.enableAvailabilityHours,
                this.settingsFieldsList[7].check = this.permission.enableMinimumReservedPool,
                this.settingsFieldsList[8].check = this.permission.enablePriorityStart,
                this.settingsFieldsList[9].check = this.permission.enablePriorityEnd,
                this.settingsFieldsList[10].check = this.permission.enablePriorityTag,
                this.settingsFieldsList[11].check = this.permission.enableHelpButtonText
                this.settingsFieldsList[12].check = this.permission.enableHelpPhone
                this.settingsFieldsList[13].check = this.permission.enableRefreshMessage
                this.settingsFieldsList[14].check = this.permission.enableEnableRefreshParkTile
                this.settingsFieldsList[15].check = this.permission.enablePersonalParkAutoBookAfterAvailability
                this.settingsFieldsList[16].check = this.permission.enableEmailAlert
                this.settingsFieldsList[17].check = this.permission.enablePickupEmail
                this.settingsFieldsList[18].check = this.permission.enableRefreshInterval
                this.settingsFieldsList[19].check = this.permission.enableTimeSlot

                //-----alternativeName-----//
                this.settingsFieldsList[0].alternativeName = this.permission.alternativeName
                this.settingsFieldsList[1].alternativeName = this.permission.alternativeDescription
                this.settingsFieldsList[2].alternativeName = this.permission.alternativeArea
                this.settingsFieldsList[3].alternativeName = this.permission.alternativeFacility
                this.settingsFieldsList[4].alternativeName = this.permission.alternativeLayout
                this.settingsFieldsList[5].alternativeName = this.permission.alternativeAvailabilityStart
                this.settingsFieldsList[6].alternativeName = this.permission.alternativeAvailabilityHours
                this.settingsFieldsList[7].alternativeName = this.permission.alternativeMinimumReservedPool
                this.settingsFieldsList[8].alternativeName = this.permission.alternativePriorityStart
                this.settingsFieldsList[9].alternativeName = this.permission.alternativePriorityEnd
                this.settingsFieldsList[10].alternativeName = this.permission.alternativePriorityTag
                this.settingsFieldsList[11].alternativeName = this.permission.alternativeHelpButtonText
                this.settingsFieldsList[12].alternativeName = this.permission.alternativeHelpPhone
                this.settingsFieldsList[13].alternativeName = this.permission.alternativeRefreshMessage
                this.settingsFieldsList[14].alternativeName = this.permission.alternativeEnableRefreshParkTile
                this.settingsFieldsList[15].alternativeName = this.permission.alternativePersonalParkAutoBookAfterAvailability
                this.settingsFieldsList[16].alternativeName = this.permission.alternativeEmailAlert
                this.settingsFieldsList[17].alternativeName = this.permission.alternativePickupEmail
                this.settingsFieldsList[18].alternativeName = this.permission.alternativeRefreshInterval
                this.settingsFieldsList[19].alternativeName = this.permission.alternativeTimeSlot

                this.settingsFieldsList[0].isRequired =this.permission.requiredName
                this.settingsFieldsList[1].isRequired =this.permission.requiredDescription
                this.settingsFieldsList[2].isRequired =this.permission.requiredArea
                this.settingsFieldsList[3].isRequired =this.permission.requiredFacility
                this.settingsFieldsList[4].isRequired =this.permission.requiredLayout
                this.settingsFieldsList[5].isRequired =this.permission.requiredAvailabilityStart
                this.settingsFieldsList[6].isRequired =this.permission.requiredAvailabilityHours
                this.settingsFieldsList[7].isRequired =this.permission.requiredMinimumReservedPool
                this.settingsFieldsList[8].isRequired =this.permission.requiredPriorityStart
                this.settingsFieldsList[9].isRequired =this.permission.requiredPriorityEnd
                this.settingsFieldsList[10].isRequired =this.permission.requiredPriorityTag
                this.settingsFieldsList[11].isRequired =this.permission.requiredHelpButtonText
                this.settingsFieldsList[12].isRequired =this.permission.requiredHelpPhone
                this.settingsFieldsList[13].isRequired =this.permission.requiredRefreshMessage
                this.settingsFieldsList[14].isRequired =this.permission.requiredEnableRefreshParkTile
                this.settingsFieldsList[15].isRequired =this.permission.requiredPersonalParkAutoBookAfterAvailability
                this.settingsFieldsList[16].isRequired =this.permission.requiredEmailAlert
                this.settingsFieldsList[17].isRequired =this.permission.requiredPickupEmail
                this.settingsFieldsList[18].isRequired =this.permission.requiredRefreshInterval
                this.settingsFieldsList[19].isRequired =this.permission.requiredTimeSlot
            }else {
                Swal.fire(
                    '',
                    this.translate.instant(res.reason),
                    'info'
                )
            }

        })
    }

}
