import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Area, Company } from '../../../../../../fe-common-v2/src/lib/models/company';
import { PeopleDispute, Person } from '../../../../../../fe-common-v2/src/lib/models/person';
import { MatDialog } from '@angular/material/dialog';
import { AdminUserManagementService } from '../../../../../../fe-common-v2/src/lib/services/admin-user-management.service';
import { UserCapabilityService } from '../../../service/user-capability.service';
import { UserManagementService } from '../../../../../../fe-common-v2/src/lib/services/user-management.service';
import { AdminSiteManagementService } from '../../../../../../fe-common-v2/src/lib/services/admin-site-management.service';
import { Site } from '../../../../../../fe-common-v2/src/lib/models/admin/site';
import { CommonService } from '../../../../../../fe-common-v2/src/lib/services/common.service';
import { AccountService } from '../../../../../../fe-common-v2/src/lib/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import {MAT_MOMENT_DATE_FORMATS,MomentDateAdapter,MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AccessControlService } from 'projects/fe-common-v2/src/lib/services/access-control.service';
import CodiceFiscale  from 'codice-fiscale-js';

import { DataStorageManagementService } from 'projects/fe-common-v2/src/lib/services/data-storage-management.service';
import { MatStepper } from '@angular/material/stepper';

export const PICK_FORMATS = {
    parse: {
      parse: {dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'}},
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'D MMM YYYY',
    }
  };

@Component({
    selector: 'app-add-employee',
    templateUrl: './add-employee.component.html',
    styleUrls: ['./add-employee.component.scss'],
    providers: [
      {provide: MAT_DATE_LOCALE, useValue: 'it'},
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
      },
      {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    ],
})

export class AddEmployeeComponent implements OnInit {
    @ViewChild('peopleStepper') peopleStepper: MatStepper;
    
    finalValueForm: FormGroup;

    currentCompany: Company = new Company();
    userAccount: Person;
    scope: any;
    maxDate: any;
    
    areasAvailable: Area[];
    
    sortedAreas: Area[];
    sortedAreasAvailable: Area[];
    sortedRoles: string[];
    sortedJobTitles: string[];
    people: Person[];
    currManager: any;
    siteList: Site[];

    
    genderList = [
        {value:"Not Specified",viewValue:"Not Specified"},
        {value:"Male",viewValue:"Male"},
        {value:"Female",viewValue:"Female"},
        {value: 'Other',viewValue: 'Other'}
    ]

    typologyList = [
        {value:"Personale Diretto",viewValue:"Personale Diretto"},
        {value:"Personale Indiretto",viewValue:"Personale Indiretto"},
        {value:"Professionisti",viewValue:"Professionisti"}
    ]

    provList = [
        'AG', 'AL', 'AN', 'AO', 'AR ', 'AP', 'AT', 'AV',
            'BA', 'BT', 'BL', 'BN', 'BG', 'BI', 'BO', 'BZ', 'BS', 'BR',
            'CA', 'CL', 'CB', 'CE', 'CT', 'CZ', 'CH', 'CO', 'CS', 'CR', 'KR', 'CN',
            'EN',
            'FM', 'FE', 'FI', 'FG', 'FC', 'FR',
            'GE', 'GO', 'GR',
            'IM', 'IS',
            'SP', 'LT', 'LE', 'LC', 'LI', 'LO', 'LU',
            'MC', 'MC', 'MS', 'MT', 'VS', 'ME', 'MI', 'MO', 'MB',
            'NA', 'NO', 'NU',
            'OR',
            'PD', 'PA', 'PR', 'PV', 'PG', 'PU', 'PE', 'PC', 'PI', 'PT', 'PN', 'PZ', 'PO',
            'RG', 'RA', 'RC', 'RE', 'RI', 'RN', 'RM', 'RO',
            'SA', 'SS', 'SV', 'SI', 'SR', 'SO',
            'TA', 'TE', 'TR', 'TO', 'TP', 'TN', 'TV', 'TS',
            'UD',
            'VA', 'VE', 'VB', 'VC', 'VR', 'VV', 'VI', 'VT'
      ]

    constructor(private _formBuilder: FormBuilder,
        private dialog:MatDialog,
        private userManagementService: UserManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private userCapabilityService: UserCapabilityService,
        private adminSiteManagementService: AdminSiteManagementService,
        private accessControlApiService: AccessControlService,
        private commonService: CommonService,
        private ApiService: AccountService,
        private router: Router,
        private translate: TranslateService,
        private _adapter: DateAdapter<any>,
        private activitedRoute: ActivatedRoute,
        private dataStorageManagementService: DataStorageManagementService) {
        this.finalValueForm = this._formBuilder.group({
          id: [''],
          name: ['',Validators.required],
          surname: ['',Validators.required],
          cf: ['',Validators.required],
          gender: [''],
          birthDay: [''],
          birthPlace: [''],
          birthProv: [''],
          address: [''],
          city: [''],
          cap: [''],
          email: ['',Validators.required],
          phone: [''],
          personalEmail: [''],
          personalPhone: [''],
          prov: [''],
          areaID: [null],
          companyId: [''],
          scope: [''],
          badgeId: [''],
          restaurantCardId: [''],
          dateStart: [''],
          dateEnd: [''],
          workingHours: [],
          lunchOpen: [],
          enablePlan: [],
          enableGreenpass: [],
          enableKeys: [],
          typology: [''],
          area: [''],
          role: [''],
          jobTitle: [''],
          site: ['',Validators.required],
          identificationCode: [''],
          partTimePercentage: [''],
          managerId: [''],
          managerFullName: [''],
          salary: [''],
          mbo: [''],
          bonus: [''],
          contractLevel: [''],
          disputes: [''],
          accessControlLevel:[''],
          accessControlSystem:[''],
          accessControlGroupsId:[new Array()],
          accessControlPassagesId:[new Array()]
        });
    }
    
    async ngOnInit() {
        this.maxDate = new Date();
        this.userAccount = this.userManagementService.getAccount();
        await this.loadCompany();
    }

    async loadCompany(): Promise<void> {
        this.getLocalStorageValue();
        let res = await this.adminUserManagementService.getCompany(this.userAccount.companyId);
        this.currentCompany = res.company;
        this.areasAvailable = new Array();
        if (this.currentCompany.areas) {
            for (let area of this.currentCompany.areas) {
                for (let areaScope of area.scopes) {
                    if (areaScope == this.scope?.name) {
                        this.areasAvailable.push(area);
                        break;
                    }
                }
            }
        }
        this.sortLists();
    }

    getLocalStorageValue(){
        var scopeLocalValue : any = localStorage.getItem('ScopeValue');
        this.scope = JSON.parse(scopeLocalValue);
    }

    async saveAndExit() {   
        if(this.finalValueForm.valid) {
            this.finalValueForm.patchValue({
                scope: this.scope.name,
                companyId: this.currentCompany.id
            })
            let res = await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value);
            if(res.result) {
                this.router.navigate(['/people']);
                Swal.fire(
                '',
                this.translate.instant('PersonAdded'),
                'success'
                );
            }
            else {
                Swal.fire(
                '',
                this.translate.instant(res.reason),
                'info'
                );
            }
        }
    }

    streamOpened(){
        if (localStorage.getItem('currentLanguage') == 'it'){
            this._adapter.setLocale('it-IT');
        }else {
            this._adapter.setLocale('eg-EG');
        }
    }

    public space(event:any){
        if(event.target.selectionStart === 0 && event.code === 'Space'){
            event.preventDefault();
        }
    }

    checkCF() {
        try {
            let cf = new CodiceFiscale(this.finalValueForm.value.cf);
            let gender = "";
            if(cf.gender == "M") gender = "Male";
            else if(cf.gender == "F") gender = "Female";
            let birthday = new Date(cf.year, cf.month-1, cf.day);
            let birthProv = cf.birthplace.prov;
            let birthPlace = cf.birthplace.nome.charAt(0).toUpperCase() + cf.birthplace.nome.slice(1).toLowerCase();
            this.finalValueForm.patchValue({
                gender: gender,
                birthDay: birthday,
                birthProv: birthProv,
                birthPlace: birthPlace
            })
        }
        catch(e) {
            Swal.fire(
            '',
            this.translate.instant("NotValidCF"),
            'info'
            );
        }
    }

    sortLists() {
        this.adminSiteManagementService.getSites(this.userAccount.companyId).then((response) => {
            let responseValue : any = JSON.parse(JSON.stringify(response))
            this.siteList = responseValue.data
        });
    }
}