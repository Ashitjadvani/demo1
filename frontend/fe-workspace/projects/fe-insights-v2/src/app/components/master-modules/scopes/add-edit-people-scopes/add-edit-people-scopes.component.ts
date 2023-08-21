import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-add-edit-people-scopes',
  templateUrl: './add-edit-people-scopes.component.html',
  styleUrls: ['./add-edit-people-scopes.component.scss'],
})
export class AddEditPeopleScopesComponent implements OnInit {
  currentCompany: any;
  companyId: any;
  scopeId: any;
  scopeName: any;
  name: any;
  scopeData: any;
  submitted = false;
  breadcrumb = "Add"

  currentScope: Scope;
  peopleScopeDetailsForm: FormGroup;
  contactInformationForm: FormGroup;
  disputeFieldsForm: FormGroup;
  economicsFieldsForm: FormGroup;
  ScopeValueForm: FormGroup;

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
      title: 'Badge Number',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 1,
      title: 'Restaurant Card Number',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 2,
      title: 'Hire Date',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 3,
      title: 'Area',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 4,
      title: 'Working Hours',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 5,
      title: 'Typology',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 6,
      title: 'Resignation Date',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 7,
      title: 'Role',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 8,
      title: 'Job Title',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 9,
      title: 'Identification Code',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 10,
      title: 'Part Time Percentage',
      check: false,
      isRequired: false,
      alternativeName: '',
    },
    {
      id: 11,
      title: 'MANAGER',
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

  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private adminUserManagementService: AdminUserManagementService,
    private router: Router,
    public translate: TranslateService,
    private activitedRoute: ActivatedRoute,
    private ApiService: MasterModulesScopesService
  ) {
    this.peopleScopeDetailsForm = this._formBuilder.group({
      scope: [null, [MCPHelperService.noWhitespaceValidator,MCPHelperService.nameValidator, Validators.required]],
      enablePlanCheckbox: [false],
      enableGreenpassForScope: [false],
      accessControlNumber: [1, [Validators.min(1), Validators.required]],
    });
    this.contactInformationForm = this._formBuilder.group({
      settingFields: this._formBuilder.array([]),
    });
    this.disputeFieldsForm = this._formBuilder.group({
      dispute: [false],
    });
    this.settingsFieldsList.forEach((b: any) => {
      this.settingFields.push(this._formBuilder.group(b));
    });
    this.economicsFieldsForm = this._formBuilder.group({
      salary: [false],
      mbo: [false],
      bonus: [false],
      contractLeval: [false],
    });
    this.ScopeValueForm = this._formBuilder.group({
      name: [null],
      enablePlan: [false],
      enableGreenpass: [false],
      accessControlValidityDaysNum: [1],
      enableBadgeId: [false],
      enableRestaurantCardId: [false],
      enableDateEnd: [false],
      enableArea: [false],
      enableWorkingHours: [false],
      enableTypology: [false],
      enableDateStart: [false],
      enableRole: [false],
      enableJobTitle: [false],
      enableIdentificationCode: [false],
      enablePartTimePercentage: [false],
      enableManager: [false],
      enableDisputes: [false],
      enableSalary: [false],
      enableMbo: [false],
      enableBonus: [false],
      enableContractLevel: [false],
      requiredArea: [false],
      requiredBadgeId: [false],
      requiredWorkingHours: [false],
      requiredDateEnd: [false],
      requiredDateStart: [false],
      requiredIdentificationCode: [false],
      requiredJobTitle: [false],
      requiredPartTimePercentage: [false],
      requiredTopology : [false],
      requiredRestaurantCardId: [false],
      requiredRole: [false],
      requiredManager: [false],
      requiredContractLevel: [false],
      alternativeRoleName: [""],
      alternativeJobTitleName: [""],
      alternativeIdentificationCodeName: [""],
      alternativePartTimePercentageName: [""],
      alternativeWorkingHoursName: [""],
      alternativeDateStartName: [""],
      alternativeDateEndName: [""],
      alternativeBadgeName: [""],
      alternativeRestaurantCardName: [""],
      areaAlternativeName: [""],
      topologyAlternativeName: [""],
      managerAlternativeName: [""],
    });


  }

  ngOnInit(): void {
    this.currentCompany = localStorage.getItem('credentials');
    var json = JSON.parse(this.currentCompany);
    this.companyId = json.person.companyId;
    this.name = this.activitedRoute.snapshot.paramMap.get('name');
    if (this.name) {
      this.breadcrumb = "Edit"
      this.getScope();
    }
    this.getScopeListData();

    for(var i = 0; i<this.scopesList.length;i++){
      if(this.scopesList[i] !== this.peopleScopeDetailsForm.value.scope){
        this.isAddEdit = true;
      }else{
        this.isAddEdit = false;
        Swal.fire(
          '',
          this.translate.instant('This scope name is already exist.'),
          'info'
        )

      }
    }
  }

  async getScopeListData(){
    const res: any = await this.ApiService.getAreaScope({});
      if (res){
        this.scopesList = res.reason;
        console.log('this.scopesList',this.scopesList);
      }
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

  checkScope(number: Number) {
    for(var i = 0; i<this.scopesList.length;i++){
      if(this.scopesList[i] !== this.peopleScopeDetailsForm.value.scope){
        this.isAddEdit = true;
      }else{
        if(this.scopeData.name == this.peopleScopeDetailsForm.value.scope){
          this.isAddEdit = true;
        }else{
          this.isAddEdit = false;
          Swal.fire(
            '',
            this.translate.instant('This scope name is already exist.'),
            'info'
          );
        }
        // this.isAddEdit = false;
        // this.peopleScopeDetailsForm.patchValue({
        //   scope:[null]
        // });
        // Swal.fire(
        //   '',
        //   this.translate.instant('This scope name is already exist.'),
        //   'info'
        // );
      }
    }
  }

  scopesList:any;
  isAddEdit = false;


  onSubmit(number: Number) {

      // for(var i = 0; i<this.scopesList.length;i++){
      //   if(this.scopesList[i].name !== this.peopleScopeDetailsForm.value.scope){
      //     this.isAddEdit = true;
      //   }else{
      //     this.isAddEdit = false;
      //     Swal.fire(
      //       '',
      //       this.translate.instant('This scope name is already exist.'),
      //       'info'
      //     )
      //   }
      // }



    // if(this.isAddEdit){

      if (number == 1 ) {
        this.submitted = true;
        if (this.peopleScopeDetailsForm.invalid) {
          return;
        }
        this.ScopeValueForm.patchValue({
          name: this.peopleScopeDetailsForm.value.scope.trim(),
          enablePlan: this.peopleScopeDetailsForm.value.enablePlanCheckbox,
          enableGreenpass:
            this.peopleScopeDetailsForm.value.enableGreenpassForScope,
          accessControlValidityDaysNum:
            this.peopleScopeDetailsForm.value.accessControlNumber,
        });
        if (this.name) {
          this.adminUserManagementService.updateCompanyScope(
            this.companyId,
            this.name,
            this.ScopeValueForm.value
          );
        } else {
          this.adminUserManagementService
            .addCompanyScope(this.companyId, this.ScopeValueForm.value)
            .subscribe((event) => {
              var jsonResponseData = JSON.parse(JSON.stringify(event.reason));
              this.scopeName = jsonResponseData.name;
            });
        }
      }
      if (number == 2) {
        this.ScopeValueForm.patchValue({
          enableBadgeId: this.settingsFieldsList[0].check,
          enableRestaurantCardId: this.settingsFieldsList[1].check,
          enableDateStart: this.settingsFieldsList[2].check,
          enableArea: this.settingsFieldsList[3].check,
          enableWorkingHours: this.settingsFieldsList[4].check,
          enableTypology: this.settingsFieldsList[5].check,
          enableDateEnd: this.settingsFieldsList[6].check,
          enableRole: this.settingsFieldsList[7].check,
          enableJobTitle: this.settingsFieldsList[8].check,
          enableIdentificationCode: this.settingsFieldsList[9].check,
          enablePartTimePercentage: this.settingsFieldsList[10].check,
          enableManager: this.settingsFieldsList[11].check,
          alternativeBadgeName: this.settingsFieldsList[0].alternativeName,
          alternativeRestaurantCardName:
            this.settingsFieldsList[1].alternativeName,
            alternativeDateStartName: this.settingsFieldsList[2].alternativeName,
          areaAlternativeName: this.settingsFieldsList[3].alternativeName,
          alternativeWorkingHoursName: this.settingsFieldsList[4].alternativeName,
          topologyAlternativeName: this.settingsFieldsList[5].alternativeName,
          alternativeDateEndName: this.settingsFieldsList[6].alternativeName,
          alternativeRoleName: this.settingsFieldsList[7].alternativeName,
          alternativeJobTitleName: this.settingsFieldsList[8].alternativeName,
          alternativeIdentificationCodeName:
            this.settingsFieldsList[9].alternativeName,
          alternativePartTimePercentageName:
            this.settingsFieldsList[10].alternativeName,
            managerAlternativeName:
            this.settingsFieldsList[11].alternativeName,
          requiredBadgeId: this.settingsFieldsList[0].isRequired,
          requiredRestaurantCardId: this.settingsFieldsList[1].isRequired,
          requiredDateStart: this.settingsFieldsList[2].isRequired,
          requiredArea: this.settingsFieldsList[3].isRequired,
          requiredWorkingHours: this.settingsFieldsList[4].isRequired,
          requiredTopology : this.settingsFieldsList[5].isRequired,
          requiredDateEnd: this.settingsFieldsList[6].isRequired,
          requiredRole: this.settingsFieldsList[7].isRequired,
          requiredJobTitle: this.settingsFieldsList[8].isRequired,
          requiredIdentificationCode: this.settingsFieldsList[9].isRequired,
          requiredPartTimePercentage: this.settingsFieldsList[10].isRequired,
          requiredManager: this.settingsFieldsList[11].isRequired,
        });
        if (this.name) {
          this.scopeName = this.name;
        }
        this.adminUserManagementService.updateCompanyScope(
          this.companyId,
          this.scopeName,
          this.ScopeValueForm.value
        );
      }
      if (number == 3) {
        this.ScopeValueForm.patchValue({
          enableDisputes: this.disputeFieldsForm.value.dispute,
        });
        if (this.name) {
          this.scopeName = this.name;
        }
        this.adminUserManagementService.updateCompanyScope(
          this.companyId,
          this.scopeName,
          this.ScopeValueForm.value
        );
      }
      if (number == 4) {
        this.ScopeValueForm.patchValue({
          enableSalary: this.economicsFieldsForm.value.salary,
          enableMbo: this.economicsFieldsForm.value.mbo,
          enableBonus: this.economicsFieldsForm.value.bonus,
          enableContractLevel: this.economicsFieldsForm.value.contractLeval,
        });
        if (this.name) {
          this.scopeName = this.name;
        }
        this.adminUserManagementService
          .updateCompanyScope(
            this.companyId,
            this.scopeName,
            this.ScopeValueForm.value
          )
          .then((event) =>
            Swal.fire( '', this.name ? this.translate.instant('Scope edited successfully') : this.translate.instant('Scope added successfully'), 'success')
          );
        this.router.navigate(['master-modules/scopes']);
      }

    // }


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
    }
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

  getScope() {
    this.adminUserManagementService
      .getScopeByName(this.companyId, this.name)
      .subscribe((response) => {
        this.scopeData = response.reason[0];

        this.ScopeValueForm.patchValue({
          name: this.scopeData.name,
          enablePlan: this.scopeData.enablePlan,
          enableGreenpass: this.scopeData.enableGreenpass,
          accessControlValidityDaysNum:
            this.scopeData.accessControlValidityDaysNum,
          enableBadgeId: this.scopeData.enableBadgeId,
          enableRestaurantCardId: this.scopeData.enableRestaurantCardId,
          enableDateStart: this.scopeData.enableDateStart,
          enableArea: this.scopeData.enableArea,
          enableWorkingHours: this.scopeData.enableWorkingHours,
          enableTypology: this.scopeData.enableTypology,
          enableDateEnd: this.scopeData.enableDateEnd,
          enableRole: this.scopeData.enableRole,
          enableJobTitle: this.scopeData.enableJobTitle,
          enableIdentificationCode: this.scopeData.enableIdentificationCode,
          enablePartTimePercentage: this.scopeData.enablePartTimePercentage,
          enableManager: this.scopeData.enableManager,
          areaAlternativeName: this.scopeData.areaAlternativeName,
          enableDisputes: this.scopeData.enableDisputes,
          enableSalary: this.scopeData.enableSalary,
          enableMbo: this.scopeData.enableMbo,
          enableBonus: this.scopeData.enableBonus,
          enableContractLevel: this.scopeData.enableContractLevel,


          requiredArea: this.scopeData.requiredArea,
          requiredBadgeId: this.scopeData.requiredBadgeId,
          requiredWorkingHours: this.scopeData.requiredWorkingHours,
          requiredDateEnd: this.scopeData.requiredDateEnd,
          requiredDateStart: this.scopeData.requiredDateStart,
          requiredIdentificationCode: this.scopeData.requiredIdentificationCode,
          requiredJobTitle: this.scopeData.requiredJobTitle,
          requiredPartTimePercentage: this.scopeData.requiredPartTimePercentage,
          requiredTopology : this.scopeData.requiredTopology ,
          requiredRestaurantCardId: this.scopeData.requiredRestaurantCardId,
          requiredRole: this.scopeData.requiredRole,
          requiredManager: this.scopeData.requiredManager,
          requiredContractLevel: this.scopeData.requiredContractLevel,


          alternativeRoleName: this.scopeData.alternativeRoleName ? this.scopeData.alternativeRoleName : '',
          alternativeJobTitleName: this.scopeData.alternativeJobTitleName ? this.scopeData.alternativeJobTitleName : '',
          managerAlternativeName: this.scopeData.managerAlternativeName ? this.scopeData.managerAlternativeName : '',
          topologyAlternativeName: this.scopeData.topologyAlternativeName ? this.scopeData.topologyAlternativeName : '',
          alternativeIdentificationCodeName:
            this.scopeData.alternativeIdentificationCodeName ? this.scopeData.alternativeIdentificationCodeName : '',
          alternativePartTimePercentageName:
            this.scopeData.alternativePartTimePercentageName ? this.scopeData.alternativePartTimePercentageName : '',
          alternativeWorkingHoursName:
            this.scopeData.alternativeWorkingHoursName ? this.scopeData.alternativeWorkingHoursName : '',
          alternativeDateStartName: this.scopeData.alternativeDateStartName ? this.scopeData.alternativeDateStartName : '',
          alternativeDateEndName: this.scopeData.alternativeDateEndName ? this.scopeData.alternativeDateEndName : '',
          alternativeBadgeName: this.scopeData.alternativeBadgeName ? this.scopeData.alternativeBadgeName : '',
          alternativeRestaurantCardName:
            this.scopeData.alternativeRestaurantCardName ? this.scopeData.alternativeRestaurantCardName : '',
            alternativeTypologyName:
            this.scopeData.alternativeTypologyName ? this.scopeData.alternativeTypologyName : '',
            alternativeManagerName:
            this.scopeData.alternativeManagerName ? this.scopeData.alternativeManagerName : '',
        });

        this.peopleScopeDetailsForm.patchValue({
          scope: this.scopeData.name,
          enablePlanCheckbox: this.scopeData.enablePlan,
          enableGreenpassForScope: this.scopeData.enableGreenpass,
          accessControlNumber: this.scopeData.accessControlValidityDaysNum,
        });

        this.disputeFieldsForm.patchValue({
          dispute: this.scopeData.enableDisputes,
        });

        this.economicsFieldsForm.patchValue({
          salary: this.scopeData.enableSalary,
          mbo: this.scopeData.enableMbo,
          bonus: this.scopeData.enableBonus,
          contractLeval: this.scopeData.enableContractLevel,
        });

        //check value
        this.settingsFieldsList[0].check = this.scopeData.enableBadgeId;
        this.settingsFieldsList[1].check =
          this.scopeData.enableRestaurantCardId;
        this.settingsFieldsList[2].check = this.scopeData.enableDateStart;
        this.settingsFieldsList[3].check = this.scopeData.enableArea;
        this.settingsFieldsList[4].check = this.scopeData.enableWorkingHours;
        this.settingsFieldsList[5].check = this.scopeData.enableTypology;
        this.settingsFieldsList[6].check = this.scopeData.enableDateEnd;
        this.settingsFieldsList[7].check = this.scopeData.enableRole;
        this.settingsFieldsList[8].check = this.scopeData.enableJobTitle;
        this.settingsFieldsList[9].check =
          this.scopeData.enableIdentificationCode;
        this.settingsFieldsList[10].check =
          this.scopeData.enablePartTimePercentage;
        this.settingsFieldsList[11].check = this.scopeData.enableManager;

        //isRequired
        this.settingsFieldsList[0].isRequired = this.scopeData.requiredBadgeId;
        this.settingsFieldsList[1].isRequired =
          this.scopeData.requiredRestaurantCardId;
        this.settingsFieldsList[2].isRequired = this.scopeData.requiredDateStart;
        this.settingsFieldsList[3].isRequired = this.scopeData.requiredArea;
        this.settingsFieldsList[4].isRequired =this.scopeData.requiredWorkingHours;
        this.settingsFieldsList[5].isRequired = this.scopeData.requiredTopology ;
        this.settingsFieldsList[6].isRequired =
          this.scopeData.requiredDateEnd;
        this.settingsFieldsList[7].isRequired = this.scopeData.requiredRole;
        this.settingsFieldsList[8].isRequired = this.scopeData.requiredJobTitle;
        this.settingsFieldsList[9].isRequired =
          this.scopeData.requiredIdentificationCode;
        this.settingsFieldsList[10].isRequired =
          this.scopeData.requiredPartTimePercentage;
        this.settingsFieldsList[11].isRequired = this.scopeData.requiredManager;

        //alternativeName
        this.settingsFieldsList[0].alternativeName =
          this.scopeData.alternativeBadgeName;
        this.settingsFieldsList[1].alternativeName =
          this.scopeData.alternativeRestaurantCardName;
        this.settingsFieldsList[2].alternativeName =
          this.scopeData.alternativeDateStartName;
        this.settingsFieldsList[3].alternativeName =
          this.scopeData.areaAlternativeName;
        this.settingsFieldsList[4].alternativeName =
          this.scopeData.alternativeWorkingHoursName;
        this.settingsFieldsList[5].alternativeName = this.scopeData.topologyAlternativeName
        this.settingsFieldsList[6].alternativeName =
          this.scopeData.alternativeDateEndName;
        this.settingsFieldsList[7].alternativeName =
          this.scopeData.alternativeRoleName;
        this.settingsFieldsList[8].alternativeName =
          this.scopeData.alternativeJobTitleName;
        this.settingsFieldsList[9].alternativeName =
          this.scopeData.alternativeIdentificationCodeName;
        this.settingsFieldsList[10].alternativeName =
          this.scopeData.alternativePartTimePercentageName;
        this.settingsFieldsList[11].alternativeName = this.scopeData.managerAlternativeName
      });
  }
}
