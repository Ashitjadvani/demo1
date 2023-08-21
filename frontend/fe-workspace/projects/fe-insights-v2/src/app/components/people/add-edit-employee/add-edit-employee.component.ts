import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Company} from '../../../../../../fe-common-v2/src/lib/models/company';
import {PeopleDispute, Person} from '../../../../../../fe-common-v2/src/lib/models/person';
import {Scope} from '../../../../../../fe-common-v2/src/lib/models/company';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatDialog} from '@angular/material/dialog';
import {AddEditDisputePopupComponent} from '../../../popup/add-edit-dispute-popup/add-edit-dispute-popup.component';
import {AdminUserManagementService} from '../../../../../../fe-common-v2/src/lib/services/admin-user-management.service';
import {UserCapabilityService} from '../../../service/user-capability.service';
import {UserManagementService} from '../../../../../../fe-common-v2/src/lib/services/user-management.service';
import {Area} from '../../../../../../fe-common-v2/src/lib/models/company';
import {AdminSiteManagementService} from '../../../../../../fe-common-v2/src/lib/services/admin-site-management.service';
import {Site} from '../../../../../../fe-common-v2/src/lib/models/admin/site';
import {CommonService} from '../../../../../../fe-common-v2/src/lib/services/common.service';
import {AccountService} from '../../../../../../fe-common-v2/src/lib/services/account.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatStepper} from "@angular/material/stepper";
import * as moment from 'moment';
import {ACCESS_CONTROL_LEVEL} from 'projects/fe-common/src/lib/models/person';
import {AccessControlService} from 'projects/fe-common-v2/src/lib/services/access-control.service';
import {Document, UserDocument} from 'projects/fe-common-v2/src/lib/models/user-document';
import {YesNoPopupComponent} from '../../../popup/yesno-popup/yesno-popup.component';
import {UserBadgeHistoryPopupComponent} from '../../../popup/user-badge-history-popup/user-badge-history-popup.component';

import {UploadUserDocumentPopupComponent} from '../../../popup/upload-user-document-popup/upload-user-document-popup.component';
import {DataStorageManagementService} from 'projects/fe-common-v2/src/lib/services/data-storage-management.service';
import {ModifyUserDocumentPopupComponent} from '../../../popup/modify-user-document-popup/modify-user-document-popup.component';
import {ViewFilePopupComponent} from '../../../popup/view-file-popup/view-file-popup.component';
import swal from "sweetalert2";
import {MasterModulesUniversityService} from "../../../../../../fe-common-v2/src/lib/services/master-modules-university.service";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {MatTable} from "@angular/material/table";

export const PICK_FORMATS = {
    parse: {
        parse: {dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'}},
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'D MMM YYYY',
    }
};

export interface tagsName {
    name: string;
}

@Component({
    selector: 'app-add-edit-employee',
    templateUrl: './add-edit-employee.component.html',
    styleUrls: ['./add-edit-employee.component.scss'],
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
export class AddEditEmployeeComponent implements OnInit {
    @ViewChild('peopleStepper') peopleStepper: MatStepper;
    @ViewChild('table') table: MatTable<any>;
    currentCompany: Company = new Company();
    userAccount: Person;
    scopesAvailable: Scope[];
    areasAvailable: Area[];
    id: any;
    AccountId: any;
    personCustomId: any;
    maxDate: any;

    sortedAreas: Area[];
    sortedAreasAvailable: Area[];
    sortedRoles: string[];
    sortedJobTitles: string[];
    people: Person[];
    currManager: any;

    currentDispute: PeopleDispute;
    currentEditPerson: Person = Person.Empty();
    scope: any;

    hide = true;
    hide1 = true;
    formSubmitted: boolean = false;

    finalValueForm: FormGroup;
    generalDetailsForm: FormGroup;
    contactInformationForm: FormGroup;
    settingsForm: FormGroup;
    disputeFieldsForm: FormGroup;
    disputeFieldsFormNew: FormGroup;
    economicsFieldsForm: FormGroup;
    accessControlForm: FormGroup;
    addAccountForm: FormGroup;
    dispute: FormArray;

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    public Tags: tagsName[] = [];

    page = 1;
    limit = '10';
    totalItems = null;
    search = '';
    sortKey = 1;
    sortBy = '';
    sortClass = 'down';
    siteList: Site[];
    submitCheck: boolean = false;

    pageD: any = 1;
    itemsPerPageD: any = '10';
    totalItemsD: any = 0;
    limitD: any = 10;
    searchD: any = '';
    sortKeyD: any = '1';
    sortByD = 'timestamp';
    sortClassD: any = 'down';
    noRecordFoundD = false;
    filterD: any;

    accessControlLevels = ACCESS_CONTROL_LEVEL;
    accessControlSystemsList = new Array();
    accessControlGatesList = new Array();
    accessControlGatesListFull = new Array();
    accessControlGatesGroupsList = new Array();
    accessControlGroupsList = new Array();

    badgeModified = false;

    selectedLevel: string;

    userDocumentList: UserDocument[] = new Array();
    userDocumentListTransformed: any[] = new Array();
    documentList: Document[] = new Array();
    userDocumentsDisplayedColumns: string[] = ['wheelAction', 'docType', 'fileName', 'timestamp', 'expirationDate'];
    documentUploaded: UserDocument = null;
    universityList: any = [];
    public requestPara = {search: '', page: 1, limit: 'full', sortBy: '', sortKey: ''};

    settingsFieldsList = [
        {title: 'Badge No.'},
        {title: 'Restaurant Card No.'},
        {title: 'Hire Date'},
        {title: 'Area'},
        {title: 'Working Hours'},
        {title: 'Typology'}
    ];

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
    genderList = [
        {value: "Not Specified", viewValue: "Not Specified"},
        {value: "Male", viewValue: "Male"},
        {value: "Female", viewValue: "Female"},
        {value: 'Other', viewValue: 'Other'}
    ]
    typologyList = [
        {value: "Personale Diretto", viewValue: "Personale Diretto"},
        {value: "Personale Indiretto", viewValue: "Personale Indiretto"},
        {value: "Professionisti", viewValue: "Professionisti"}
    ]

    authenticationMethodList = [
        {value: "local", viewValue: "Local"},
        {value: "Azure", viewValue: "Azure"},
        {value: "Active Directory", viewValue: "Active Directory"},
    ]


    passwordValidity = [
        {type: 'hour', viewValue: '1 hour', value: 1, id: '1_hour'},
        {type: 'hour', viewValue: '8 hour', value: 8, id: '8_hour'},
        {type: 'day', viewValue: '1 day', value: 1, id: '1_day'},
        {type: 'day', viewValue: '30 days', value: 30, id: '30_day'},
        {type: 'day', viewValue: '60 days', value: 60, id: '60_day'},
        {type: 'day', viewValue: '120 days', value: 120, id: '120_day'},
        {type: 'day', viewValue: '160 days', value: 160, id: '160_day'},
        {type: 'day', viewValue: '200 days', value: 200, id: '200_day'},
        {type: 'day', viewValue: '260 days', value: 260, id: '260_day'},
        {type: 'day', viewValue: '360 days', value: 360, id: '360_day'},
        {type: 'never', viewValue: 'Never Expired', value: 'never_expired', id: 'never_expired'}
    ]

    passwordMinList = [
        {value: 1, viewValue: 1},
        {value: 2, viewValue: 2},
        {value: 3, viewValue: 3},
        {value: 4, viewValue: 4},
        {value: 5, viewValue: 5},
        {value: 6, viewValue: 6},
    ]
    passwordMaxList = [
        {value: 15, viewValue: 15},
        {value: 16, viewValue: 16},
        {value: 17, viewValue: 17},
        {value: 18, viewValue: 18},
        {value: 19, viewValue: 19},
        {value: 20, viewValue: 20},
    ]
    passwordPatternList = [
        {viewValue: 'At least one upper case', value: 1},
        {viewValue: 'At least one lower case', value: 2},
        {viewValue: 'At least one digit', value: 3},
        {viewValue: 'At least one special character', value: 4},
        {viewValue: 'At least one letter, one number and one special character', value: 5},
        {viewValue: 'At least one uppercase letter, one lowercase letter and one number', value: 6},
        {
            viewValue: 'At least one uppercase letter, one lowercase letter, one number and one special character',
            value: 7
        }
    ]
    previousPassword = [
        {value: 1, viewValue: 'GENERAL.Yes'},
        {value: 2, viewValue: 'GENERAL.No'}
    ]
    settingsFieldsDisplayedColumns: string[] = ['title', 'isRequired', 'alternativeName'];


    constructor(private _formBuilder: FormBuilder,
                private dialog: MatDialog,
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
                private dataStorageManagementService: DataStorageManagementService,
                private masterApiService: MasterModulesUniversityService,
                private  helper: MCPHelperService
    ) {
        this.finalValueForm = this._formBuilder.group({
            id: [''],
            name: [''],
            surname: [''],
            cf: [''],
            gender: [''],
            birthDay: [''],
            birthPlace: [''],
            birthProv: [''],
            address: [''],
            city: [''],
            cap: [''],
            email: [''],
            phone: [''],
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
            site: [''],
            identificationCode: [''],
            partTimePercentage: [''],
            managerId: [''],
            managerFullName: [''],
            salary: [''],
            mbo: [''],
            bonus: [''],
            contractLevel: [''],
            disputes: [''],
            accessControlLevel: [''],
            accessControlSystem: [''],
            accessControlGroupsId: [new Array()],
            accessControlPassagesId: [new Array()],
            numeroMatricola: [''],
            tutor: [''],
            patrocinante: [''],
            ccnl: [''],
        })
        this.generalDetailsForm = this._formBuilder.group({
            name: ['', Validators.required],
            surname: ['', Validators.required],
            fiscalCode: [''],
            gender: [''],
            birthday: [''],
            birthPlace: [''],
            prov: [''],
            // tags: ['']
        });
        this.contactInformationForm = this._formBuilder.group({
            address: [''],
            city: [''],
            prov: [''],
            cap: [''],
            phone: [''],
            email: ['', [Validators.required, Validators.email]],
        });
        this.settingsForm = this._formBuilder.group({
            badgeNo: [''],
            restaurantCardNo: [''],
            hireDate: [''],
            resignationDate: [''],
            workingStartTime: [''],
            lunchStartTime: [''],
            lunchEndTime: [''],
            workingEndTime: [''],
            openLunch: [false],
            enablePlan: [false],
            greenPass: [false],
            keys: [false],
            typology: [''],
            area: [''],
            role: [''],
            jobTitle: [''],
            site: [''],
            codeIdentity: [''],
            partTime: [''],
            manager: [''],
            numeroMatricola: [''],
            tutor: [''],
            patrocinante: [''],
        });
        this.disputeFieldsForm = this._formBuilder.group({
            dispute: this._formBuilder.array([]),
        });
        this.disputeFieldsFormNew = this._formBuilder.group({
            date: ['', Validators.required],
            dispute: ['', Validators.required],
            note: ['', Validators.required],
            notificationDate: ['']
        });
        this.economicsFieldsForm = this._formBuilder.group({
            salary: [''],
            mbo: [''],
            bonus: [''],
            contractLevel: [''],
            ccnl: [''],
        });
        this.accessControlForm = this._formBuilder.group({
            accessControlLevel: [''],
            accessControlSystem: [''],
            accessControlGroupsId: [new Array()],
            accessControlPassagesId: [new Array()]
        });
        this.addAccountForm = this._formBuilder.group({
                id: [],
                companyId: [''],
                person: [],
                personId: [],
                userId: ['', Validators.required],
                newPassword: ['', Validators.required],
                confirmPassword: ['', Validators.required],
                authProvider: ['', Validators.required],
                passwordValid: ['', Validators.required],
                passwordMin: ['', Validators.required],
                passwordMax: ['', Validators.required],
                passwordPattern: ['', Validators.required],
                allowedPreviousPassword: ['', Validators.required]
            },
            {validator: this.ConfirmedValidator('newPassword', 'confirmPassword')},
        );
    }

    ConfirmedValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({confirmedValidator: true});
            } else {
                matchingControl.setErrors(null);
            }
        }
    }

    async ngOnInit() {
        this.maxDate = new Date();
        this.scopesAvailable = new Array();
        this.userAccount = this.userManagementService.getAccount();
        await this.loadCompany();
        this.setRequired();
        this.id = this.activitedRoute.snapshot.paramMap.get('id');
        if (this.id) {
            this.editPeopleView(this.id);
        }
        this.addDispute();
        this.getSystemList();
        await this.getDocumentsList()
        await this.getUserDocumentList();
        await this.getUniversityList(this.requestPara);
        if (this.id) {
            this.peopleStepper.linear = false;
        }
    }

    ngAfterViewInit() {
        if (this.id) {
            this.peopleStepper.linear = false;
        }
    }


    getLocalStorageValue() {
        var scopeLocalValue: any = localStorage.getItem('ScopeValue');
        this.scope = JSON.parse(scopeLocalValue);
        // localStorage.removeItem('ScopeValue');
    }


    async loadCompany(): Promise<void> {
        this.getLocalStorageValue();
        let res = await this.adminUserManagementService.getCompany(this.userAccount.companyId);
        this.currentCompany = res.company;
        this.sortedAreas = this.currentCompany.areas;
        for (const scope of this.currentCompany.scopes) {
            if (this.userCapabilityService.isFunctionAvailable('People/' + scope.name)) {
                this.scopesAvailable.push(scope);
            }
        }
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
        const request = {
            scope: this.scope?.name,
            search: '',
            page: this.page,
            limit: this.limit,
            sortBy: '',
            sortKey: ''
        };
        await this.loadUserList(request);
    }

    async getSystemList() {
        try {
            this.accessControlApiService.getCompanySystems(null, this.userAccount.companyId).subscribe((res: any) => {
                this.accessControlSystemsList = res.data;
            });
        } catch (e) {
        }
    }

    async getSystemGates() {
        try {
            if (this.accessControlForm.value.accessControlSystem) {
                this.accessControlApiService.getFullSystemGatesListBySite(this.accessControlForm.value.accessControlSystem).subscribe((res: any) => {
                    this.accessControlGatesList = res.data;
                });
                this.accessControlApiService.getFullSystemGatesList(this.accessControlForm.value.accessControlSystem).subscribe((res: any) => {
                    this.accessControlGatesListFull = res.data;
                });
            }
        } catch (e) {
        }
    }

    async getSystemGatesGroups() {
        try {
            if (this.accessControlForm.value.accessControlSystem) {
                this.accessControlApiService.getFullSystemGatesGroupsList(this.accessControlForm.value.accessControlSystem).subscribe((res: any) => {
                    this.accessControlGroupsList = res.data;
                    this.populateGatesGroupList();
                });
            }
        } catch (e) {
        }
    }

    async gateCheckEvent(gateId: string, event) {
        this.badgeModified = true;
        let idx = this.accessControlForm.value.accessControlPassagesId.indexOf(gateId);
        if (event.checked && idx < 0) this.accessControlForm.value.accessControlPassagesId.push(gateId);
        else if (idx >= 0) this.accessControlForm.value.accessControlPassagesId.splice(idx, 1);
    }

    checkGate(gateId: string) {
        return this.accessControlForm.value.accessControlPassagesId.indexOf(gateId) >= 0;
    }

    checkGateGroup(gateId: string) {
        return this.accessControlGatesGroupsList.indexOf(gateId) >= 0;
    }

    async groupCheckEvent(groupId: string, event) {
        this.badgeModified = true;
        let idx = this.accessControlForm.value.accessControlGroupsId.indexOf(groupId);
        if (event.checked && idx < 0) this.accessControlForm.value.accessControlGroupsId.push(groupId);
        else if (idx >= 0) this.accessControlForm.value.accessControlGroupsId.splice(idx, 1);
        this.accessControlGatesGroupsList = new Array();
        this.populateGatesGroupList();
    }

    populateGatesGroupList() {
        for (let groupId of this.accessControlForm.value.accessControlGroupsId) {
            let group = this.accessControlGroupsList.find(group => group.id == groupId);
            if (group) {
                for (let gateId of group.gatesId) {
                    if (this.accessControlGatesGroupsList.indexOf(gateId) < 0) this.accessControlGatesGroupsList.push(gateId);
                }
            }
        }
    }

    checkGroup(groupId: string) {
        return this.accessControlForm.value.accessControlGroupsId.indexOf(groupId) >= 0;
    }

    onLevelChange(event: any) {
        this.badgeModified = true;
        if (this.selectedLevel == this.accessControlLevels.GROUP && event.value == this.accessControlLevels.SINGLE_PASSAGES) {
            this.accessControlForm.value.accessControlPassagesId = this.accessControlGatesGroupsList;
        }
    }

    async onSystemChange(event: any) {
        this.getSystemGates();
        this.getSystemGatesGroups();
    }

    async getDocumentsList() {
        try {
            let res = await this.adminUserManagementService.getDocuments(this.userAccount.companyId);
            if (res.result) {
                this.documentList = res.documents;
            }
        } catch (e) {
        }
    }

    async getUserDocumentList() {
        try {
            let res = await this.adminUserManagementService.getUserDocuments({
                page: this.pageD,
                limit: this.limitD,
                search: this.searchD,
                sortBy: this.sortKeyD,
                sortKey: this.sortByD,
                userId: this.id
            });
            if (res) {
                this.userDocumentList = res.data;
                this.userDocumentListTransformed = res.data;
                this.totalItemsD = res.meta.totalCount;
                // if (this.documentUploaded) {
                //     this.userDocumentList.push(this.documentUploaded);
                //     this.totalItemsD = this.totalItemsD + 1;
                // }
                this.transformUserDocumentList();
                this.noRecordFoundD = this.userDocumentList.length > 0;
            }
        } catch (e) {
        }
    }

    async transformUserDocumentList() {
        for (let userDoc of this.userDocumentListTransformed) {

            // DOC NAME
            let doc = this.documentList.find(doc => doc.id == userDoc.documentId);
            userDoc.documentTypeName = doc?.name;

            // EXPIRED
            let now = new Date();
            userDoc.isExpired = this.commonService.compareOnlyDateGreater(now, userDoc.expirationDate);
        }
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.Tags.push({name: value.trim()});
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(Tags: tagsName): void {
        const index = this.Tags.indexOf(Tags);

        if (index >= 0) {
            this.Tags.splice(index, 1);
        }
    }

    openAddAlternativeFieldDialog() {
        const dialogRef = this.dialog.open(AddEditDisputePopupComponent, {
            data: {
                placeholder: 'Alternative Area Name',
                heading: 'Add Alternative Field',
                validation: 'Enter your alternative area name'
            }
        });
    }

    onFileChanged(input: HTMLInputElement): void {
    }

    onKeyUp(event: any) {
    }

    onTabChanged($event) {
        let clickedIndex = $event.selectedIndex;
        let previouslySelectedIndex = $event.previouslySelectedIndex + 1;
        this.submitCheck = false;
        this.onSubmit(previouslySelectedIndex, false)
        if (clickedIndex === 4) {
            this.viewAccountDetail(this.id);
        }
    }

    submitCheckFunc(submitStatus): void {
        this.submitCheck = submitStatus;
    }

    async savegeneralDetailsData(stepper: MatStepper): Promise<void> {
        if (this.generalDetailsForm.valid) {
            let values = this.generalDetailsForm.value
            this.finalValueForm.patchValue({
                name: values.name,
                surname: values.surname,
                cf: values.fiscalCode,
                gender: values.gender,
                birthDay: values.birthday,
                birthPlace: values.birthPlace,
                birthProv: values.prov,
                companyId: this.userAccount.companyId,
                scope: this.scope?.name,
            });
            if (this.generalDetailsForm.status == "VALID" && this.submitCheck != true) {
                await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value).then((response) => {
                    let responseValue: any = JSON.parse(JSON.stringify(response))
                    this.personCustomId = responseValue.user;
                    if (!this.id) {
                        this.finalValueForm.patchValue({
                            id: responseValue.user.id
                        })
                    }
                    if (this.id) {
                        this.finalValueForm.patchValue({
                            id: this.id
                        });
                        this.viewAccountDetail(this.id);
                    }
                });
            }
            //stepper.next();
        }
    }

    async saveContactInformationdata(stepper: MatStepper): Promise<void> {
        if (this.contactInformationForm.valid) {
            let values = this.contactInformationForm.value
            this.finalValueForm.patchValue({
                address: values.address,
                city: values.city,
                cap: values.cap,
                phone: values.phone,
                email: values.email,
                prov: values.prov,
            });
            if (this.contactInformationForm.status == "VALID") {
                await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value);
            }
            //stepper.next();
        }
    }

    async saveSettingsData(stepper: MatStepper): Promise<void> {

        if (this.settingsForm.valid) {
            const findAreaUID = this.sortedAreas.find((b) => {
                return b.name === this.settingsForm.value.area;
            });
            if (!this.id) {
                this.currManager = this.people.find(x => x.id == this.settingsForm.value.manager);
            }
            this.finalValueForm.patchValue({
                badgeId: this.settingsForm.value.badgeNo,
                restaurantCardId: this.settingsForm.value.restaurantCardNo,
                dateStart: this.settingsForm.value.hireDate,
                dateEnd: this.settingsForm.value.resignationDate,
                workingHours: this.currentEditPerson.workingHours,
                lunchOpen: this.settingsForm.value.openLunch,
                enablePlan: this.settingsForm.value.enablePlan,
                enableGreenpass: this.settingsForm.value.greenPass,
                enableKeys: this.settingsForm.value.keys,
                typology: this.settingsForm.value.typology,
                area: this.settingsForm.value.area,
                areaID: findAreaUID?.id,
                role: this.settingsForm.value.role,
                jobTitle: this.settingsForm.value.jobTitle,
                site: this.settingsForm.value.site,
                identificationCode: this.settingsForm.value.codeIdentity,
                partTimePercentage: this.settingsForm.value.partTime,
                managerId: this.currManager ? this.currManager.id : '',
                managerFullName: this.currManager ? (this.currManager.name + this.currManager.surname) : '',
                numeroMatricola: this.settingsForm.value.numeroMatricola,
                tutor: this.settingsForm.value.tutor,
                patrocinante: this.settingsForm.value.patrocinante,
                ccnl: this.settingsForm.value.ccnl,
            });
            //stepper.next();
        }
    }

    async saveAccessControlData(): Promise<void> {
        if (this.accessControlForm.valid) {
            this.finalValueForm.patchValue({
                accessControlLevel: this.accessControlForm.value.accessControlLevel,
                accessControlSystem: this.accessControlForm.value.accessControlSystem,
                accessControlPassagesId: this.accessControlForm.value.accessControlPassagesId,
                accessControlGroupsId: this.accessControlForm.value.accessControlGroupsId
            });
            //stepper.next();
        }
    }

    async saveDisputeFieldsdata(stepper: MatStepper) {
        if (this.disputeFieldsForm.valid) {
            // this.addDisputeItem();
            if (this.id) {
                this.viewAccountDetail(this.id);
            }
            this.finalValueForm.patchValue({
                disputes: this.currentEditPerson.disputes
            });
            this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value)
            //stepper.next();
        } else {
            this.formSubmitted = true;
            //stepper.next();
        }
    }

    async saveDocumentsData(): Promise<void> {

    }

    async saveEconomicsFieldsData(stepper: MatStepper): Promise<void> {
        let values = this.economicsFieldsForm.value
        this.finalValueForm.patchValue({
            salary: values.salary,
            mbo: values.mbo,
            bonus: values.bonus,
            contractLevel: values.contractLevel,
            ccnl: values.ccnl,
        });
        await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value)
        //stepper.next();
    }

    async saveAddAccountData(stepper: MatStepper): Promise<void> {
        if (this.addAccountForm.valid) {
            let values = this.generalDetailsForm.value
            if (this.id) {
                this.addAccountForm.patchValue({
                    person: values.name + ' ' + values.surname,
                    id: this.id,
                    companyId: this.userAccount.companyId,
                    //personId: this.userAccount.id
                    personId: this.personCustomId ? this.personCustomId.id : null
                });
                if (this.addAccountForm.value.personId !== null) {
                    this.ApiService.updateAccount(this.addAccountForm.value).subscribe((data: any) => {
                        if (data.result) {
                            this.router.navigate(['/people']);
                            Swal.fire(
                                '',
                                this.translate.instant('People updated successfully'),
                                'success');
                        } else {
                            Swal.fire('', this.translate.instant(data.reason), 'info');
                        }
                    });
                } else {
                    Swal.fire(
                        '',
                        this.translate.instant('Person already exists'),
                        'info',
                    );
                }
            }
            if (!this.id) {
                this.addAccountForm.patchValue({
                    person: values.name + ' ' + values.surname,
                    id: this.finalValueForm.value.id,
                    companyId: this.userAccount.companyId,
                    //personId: this.userAccount.id
                    personId: this.personCustomId ? this.personCustomId.id : null
                });
                if (this.addAccountForm.value.personId !== null) {
                    this.ApiService.addAccount(this.addAccountForm.value).subscribe((data: any) => {
                        if (data.result) {
                            this.router.navigate(['/people']);
                            Swal.fire(
                                '',
                                this.translate.instant('People created successfully'),
                                'success');
                        } else {
                            Swal.fire('', this.translate.instant(data.reason), 'info');
                            // (err) => {
                            //   Swal.fire('', this.translate.instant(err.error.message), 'info');
                            // }
                        }
                    });
                } else {
                    Swal.fire(
                        '',
                        this.translate.instant('Person already exists'),
                        'info',
                    );
                }
            }
        }
    }

    async onSubmit(step: number, isSubmit = false) {
        if (step == 1) {
            let values = this.generalDetailsForm.value
            this.finalValueForm.patchValue({
                name: values.name,
                surname: values.surname,
                cf: values.fiscalCode,
                gender: values.gender,
                birthDay: values.birthday,
                birthPlace: values.birthPlace,
                birthProv: values.prov,
                companyId: this.userAccount.companyId,
                scope: this.scope?.name,
            });
            if (this.generalDetailsForm.status == "VALID" && this.submitCheck != true) {
                await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value).then((response) => {
                    let responseValue: any = JSON.parse(JSON.stringify(response))
                    this.personCustomId = responseValue.user;
                    if (!this.id) {
                        this.finalValueForm.patchValue({
                            id: responseValue.user.id
                        })
                    }
                    if (this.id) {
                        this.finalValueForm.patchValue({
                            id: this.id
                        });
                        this.viewAccountDetail(this.id);
                    }
                });
            }
        }
        if (step == 2) {
            let values = this.contactInformationForm.value
            this.finalValueForm.patchValue({
                address: values.address,
                city: values.city,
                cap: values.cap,
                phone: values.phone,
                email: values.email,
                prov: values.prov,
            });
            if (this.contactInformationForm.status == "VALID") {
                await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value);
            }
        }
        if (step == 3) {
            const findAreaUID = this.sortedAreas.find((b) => {
                return b.name === this.settingsForm.value.area;
            });
            if (!this.id) {
                this.currManager = this.people.find(x => x.id == this.settingsForm.value.manager);
            }
            this.finalValueForm.patchValue({
                badgeId: this.settingsForm.value.badgeNo,
                restaurantCardId: this.settingsForm.value.restaurantCardNo,
                dateStart: this.settingsForm.value.hireDate,
                dateEnd: this.settingsForm.value.resignationDate,
                workingHours: this.currentEditPerson.workingHours,
                lunchOpen: this.settingsForm.value.openLunch,
                enablePlan: this.settingsForm.value.enablePlan,
                enableGreenpass: this.settingsForm.value.greenPass,
                enableKeys: this.settingsForm.value.keys,
                typology: this.settingsForm.value.typology,
                area: this.settingsForm.value.area,
                areaID: findAreaUID?.id,
                role: this.settingsForm.value.role,
                jobTitle: this.settingsForm.value.jobTitle,
                site: this.settingsForm.value.site,
                identificationCode: this.settingsForm.value.codeIdentity,
                partTimePercentage: this.settingsForm.value.partTime,
                managerId: this.currManager ? this.currManager.id : '',
                managerFullName: this.currManager ? (this.currManager.name + this.currManager.surname) : '',
                numeroMatricola: this.settingsForm.value.numeroMatricola,
                tutor: this.settingsForm.value.tutor,
                patrocinante: this.settingsForm.value.patrocinante,
                ccnl: this.settingsForm.value.ccnl,
            })
            //await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value);
            if (this.settingsForm.status == "VALID") {
                this.savePeople(isSubmit, 3);
            }
        }
        if (step == 4) {

            if (this.badgeModified) {
                let message1 = this.translate.instant("ACCESS_CONTROL.RegenerateBadgeMessage1") + this.finalValueForm.value.surname + " " + this.finalValueForm.value.name;
                const dialogRef = this.dialog.open(YesNoPopupComponent, {
                    data: {
                        title: this.translate.instant("ACCESS_CONTROL.RegenerateBadge"),
                        message1: message1,
                        message2: this.translate.instant("ACCESS_CONTROL.Sure"),
                        icon: "qr_code"
                    }
                });
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result) {
                        if (this.accessControlForm.valid) {
                            this.finalValueForm.patchValue({
                                accessControlLevel: this.accessControlForm.value.accessControlLevel,
                                accessControlSystem: this.accessControlForm.value.accessControlSystem,
                                accessControlPassagesId: this.accessControlForm.value.accessControlPassagesId,
                                accessControlGroupsId: this.accessControlForm.value.accessControlGroupsId
                            })
                            await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value)
                            this.savePeople(isSubmit, 4);
                        } else {
                            this.formSubmitted = true;
                        }
                        let res = await this.adminUserManagementService.generateAccessControlQrCode(this.id);
                        if (res.result) {
                            Swal.fire(
                                '',
                                this.translate.instant('ACCESS_CONTROL.BadgeRegenerated'),
                                'success'
                            );
                        }
                    }
                });
            } else {
                if (this.accessControlForm.valid) {
                    this.finalValueForm.patchValue({
                        accessControlLevel: this.accessControlForm.value.accessControlLevel,
                        accessControlSystem: this.accessControlForm.value.accessControlSystem,
                        accessControlPassagesId: this.accessControlForm.value.accessControlPassagesId,
                        accessControlGroupsId: this.accessControlForm.value.accessControlGroupsId
                    })
                    await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value)
                    this.savePeople(isSubmit, 4);
                } else {
                    this.formSubmitted = true;
                }
            }
        }
        if (step == 5) {
            if (this.documentUploaded) {
                let message1 = this.translate.instant("ACCESS_CONTROL.RegenerateBadgeMessage1") + this.finalValueForm.value.surname + " " + this.finalValueForm.value.name;
                const dialogRef = this.dialog.open(YesNoPopupComponent, {
                    data: {
                        title: this.translate.instant("ACCESS_CONTROL.RegenerateBadge"),
                        message1: message1,
                        message2: this.translate.instant("ACCESS_CONTROL.Sure"),
                        icon: "qr_code"
                    }
                });
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result) {
                        let res = await this.adminUserManagementService.addUpdateUserDocument(this.documentUploaded);
                        console.log("000000000000000000000============>",res)
                        let res2 = await this.adminUserManagementService.generateAccessControlQrCode(this.id);
                        if (res2.result) {
                            Swal.fire(
                                '',
                                this.translate.instant('ACCESS_CONTROL.BadgeRegenerated'),
                                'success'
                            );
                        }
                    }
                });
            } else {
                this.formSubmitted = true;
            }
        }
        if (step == 6) {
            if (this.disputeFieldsForm.valid) {
                this.addDisputeItem(-1);
                this.viewAccountDetail(this.id);
                this.finalValueForm.patchValue({})
                await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value)
                this.savePeople(isSubmit, 6);
            } else {
                this.formSubmitted = true;
            }
        }
        if (step == 7) {
            let values = this.economicsFieldsForm.value
            this.finalValueForm.patchValue({
                salary: values.salary,
                mbo: values.mbo,
                bonus: values.bonus,
                contractLevel: values.contractLevel,
                ccnl: values.ccnl,
            })
            await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value)
            if (isSubmit) {
                this.savePeople(isSubmit, 7);
            }
        }
        if (step == 7) {
            if (this.addAccountForm.valid) {
                let values = this.generalDetailsForm.value
                if (this.id) {
                    this.addAccountForm.patchValue({
                        person: values.name + ' ' + values.surname,
                        id: this.id,
                        companyId: this.userAccount.companyId,
                        //personId: this.userAccount.id
                        personId: this.personCustomId ? this.personCustomId.id : null
                    });
                    if (this.addAccountForm.value.personId !== null) {
                        this.ApiService.updateAccount(this.addAccountForm.value).subscribe((data: any) => {
                            if (data.result) {
                                this.router.navigate(['/people']);
                                Swal.fire(
                                    '',
                                    this.translate.instant('People updated successfully'),
                                    'success');
                            } else {
                                Swal.fire('', this.translate.instant(data.reason), 'info');
                            }
                        });
                    } else {
                        Swal.fire(
                            '',
                            this.translate.instant('Person already exists'),
                            'info',
                        );
                    }
                }
                if (!this.id) {
                    this.addAccountForm.patchValue({
                        person: values.name + ' ' + values.surname,
                        id: this.finalValueForm.value.id,
                        companyId: this.userAccount.companyId,
                        //personId: this.userAccount.id
                        personId: this.personCustomId ? this.personCustomId.id : null
                    });
                    if (this.addAccountForm.value.personId !== null) {
                        this.ApiService.addAccount(this.addAccountForm.value).subscribe((data: any) => {
                            if (data.result) {
                                this.router.navigate(['/people']);
                                Swal.fire(
                                    '',
                                    this.translate.instant('People created successfully'),
                                    'success');
                            } else {
                                Swal.fire('', this.translate.instant(data.reason), 'info');
                                // (err) => {
                                //   Swal.fire('', this.translate.instant(err.error.message), 'info');
                                // }
                            }
                        });
                    } else {
                        Swal.fire(
                            '',
                            this.translate.instant('Person already exists'),
                            'info',
                        );
                    }
                }
            }
        }

        // if(isSubmit){
        //   this.router.navigate(['/people']);
        // }
    }

    async savePeople(isSubmit, step) {
        await this.adminUserManagementService.addOrUpdatePerson(this.finalValueForm.value).then((response) => {
            let responseValue: any = JSON.parse(JSON.stringify(response));
            if (responseValue.result && isSubmit) {
                this.router.navigate(['/people']);
                if (!this.id) {
                    Swal.fire(
                        '',
                        this.translate.instant('People created successfully'),
                        'success'
                    );
                } else {
                    Swal.fire(
                        '',
                        this.translate.instant('People updated successfully'),
                        'success'
                    );
                }
            } else {
                if (isSubmit) {
                    Swal.fire('', this.translate.instant(responseValue.reason), 'info');
                }
            }
        });
    }

    setRequired() {
        if (this.scope?.requiredBadgeId && this.scope?.enableBadgeId) {
            this.settingsForm.controls.badgeNo.setValidators([Validators.required]);
        }
        if (this.scope?.requiredRestaurantCardId && this.scope?.enableRestaurantCardId) {
            this.settingsForm.controls.restaurantCardNo.setValidators([Validators.required]);
        }
        if (this.scope?.requiredDateStart && this.scope?.enableDateStart) {
            this.settingsForm.controls.hireDate.setValidators([Validators.required]);
        }
        if (this.scope?.requiredArea && this.scope?.enableArea) {
            this.settingsForm.controls.area.setValidators([Validators.required]);
        }
        if (this.scope?.requiredWorkingHours && this.scope?.enableWorkingHours) {
            this.settingsForm.controls.workingStartTime.setValidators([Validators.required]);
            this.settingsForm.controls.lunchStartTime.setValidators([Validators.required]);
            this.settingsForm.controls.lunchEndTime.setValidators([Validators.required]);
            this.settingsForm.controls.workingEndTime.setValidators([Validators.required]);
            // this.settingsForm.controls.openLunch.setValidators([Validators.required]);
            // this.settingsForm.controls.enablePlan.setValidators([Validators.required]);
            // this.settingsForm.controls.greenPass.setValidators([Validators.required]);
        }
        if (this.scope?.requiredTopology && this.scope?.enableTypology) {
            this.settingsForm.controls.typology.setValidators([Validators.required]);
        }
        if (this.scope?.requiredDateEnd && this.scope?.enableDateEnd) {
            this.settingsForm.controls.resignationDate.setValidators([Validators.required]);
        }
        if (this.scope?.requiredRole && this.scope?.enableRole) {
            this.settingsForm.controls.role.setValidators([Validators.required]);
        }
        if (this.scope?.requiredJobTitle && this.scope?.enableJobTitle) {
            this.settingsForm.controls.jobTitle.setValidators([Validators.required]);
        }
        if (this.scope?.requiredIdentificationCode && this.scope?.enableIdentificationCode) {
            this.settingsForm.controls.codeIdentity.setValidators([Validators.required]);
        }
        if (this.scope?.requiredPartTimePercentage && this.scope?.enablePartTimePercentage) {
            this.settingsForm.controls.partTime.setValidators([Validators.required]);
        }
        if (this.scope?.requiredManager && this.scope?.enableManager) {
            this.settingsForm.controls.manager.setValidators([Validators.required]);
        }
        // this.settingsForm.controls.site.setValidators([Validators.required]);
    }

    sortLists() {
        this.sortedRoles = this.currentCompany.peopleRoles.sort(function (a, b) {
            return ('' + a).localeCompare(b);
        });
        this.sortedJobTitles = this.currentCompany.peopleJobTitles.sort(function (a, b) {
            return ('' + a).localeCompare(b);
        });
        // this.sortedAreas = this.currentCompany.areas.sort(function(a, b){
        //     return ('' + a.name).localeCompare(b.name);
        // });
        this.sortedAreasAvailable = this.areasAvailable.sort(function (a, b) {
            return ('' + a.name).localeCompare(b.name);
        });
        this.adminSiteManagementService.getSites(this.userAccount.companyId).then((response) => {
            let responseValue: any = JSON.parse(JSON.stringify(response))
            this.siteList = responseValue.data
        });

    }

    async loadUserList(request) {
        //const res: any = await this.adminUserManagementService.getPeople(this.userAccount.companyId, request);
        const res: any = await this.adminUserManagementService.getPeopleList(this.userAccount.companyId);
        this.people = res.people;
    }

    getWorkingTime(index) {
        if (this.currentEditPerson.workingHours[index]) {
            return this.commonService.timeFormat(this.currentEditPerson.workingHours[index]); // this.currentEditPerson.workingHours[index].getHours() + ':' + this.currentEditPerson.workingHours[index].getMinutes();
        }
        return '';
    }

    setWorkingTime(index, time) {
        this.currentEditPerson.workingHours[index] = this.commonService.buildDateTimeFromHHMM(new Date(), time);
    }

    onWorkingTimeChange(index, value) {
        if (this.commonService.isValidHHMM(value)) {
            this.setWorkingTime(index, value);
        } else {
            this.currentEditPerson.workingHours[index] = null;
        }
    }

    addDisputeItem(index: number) {

        this.currentDispute = PeopleDispute.Empty();
        if (this.disputeFieldsForm.valid) {
            /*this.currentDispute.author = this.userAccount.name + ' ' + this.userAccount.surname;
            this.currentDispute.date = this.disputeFieldsForm.value.disputeDate;
            this.currentDispute.dispute = this.disputeFieldsForm.value.dispute;
            this.currentDispute.note = this.disputeFieldsForm.value.note;
            this.currentDispute.notificationDate = this.disputeFieldsForm.value.notificationDate;*/
            //this.currentEditPerson.disputes.push(PeopleDispute.Empty());
            //this.currentEditPerson.disputes.push(PeopleDispute.Empty());

            if (index == -1) {
                this.currentEditPerson.disputes = this.disputeFieldsForm.value.dispute;

                if (this.currentEditPerson.disputes && this.currentEditPerson.disputes.length > 0) {
                    for (let ind = 0; ind < this.disputeFieldsForm.value.dispute.length; ind++) {
                        const element = this.disputeFieldsForm.value.dispute[ind];
                        element.author = this.userAccount.name + ' ' + this.userAccount.surname;
                        element.date = this.disputeFieldsForm.value.dispute[ind].date._d ? this.disputeFieldsForm.value.dispute[ind].date._d : this.disputeFieldsForm.value.dispute[ind].date;
                        element.notificationDate = this.disputeFieldsForm.value.dispute[ind].notificationDate._d ? this.disputeFieldsForm.value.dispute[ind].notificationDate._d : this.disputeFieldsForm.value.dispute[ind].notificationDate;
                    }
                }

            }
            // this.addDispute();

            // this.resetForm();

        } else {
            this.disputeFieldsForm.markAllAsTouched();
            this.formSubmitted = true;
        }
    }

    viewAccountDetail(id) {
        this.ApiService.editAccount({id: id}).subscribe((res: any) => {
            const documentData = res.accountData;
            if (documentData) {
                this.addAccountForm.patchValue({
                    peopleFC: documentData.personId ? documentData.personId : '',
                    userId: documentData.userId,
                    authProvider: documentData.authProvider,
                    passwordDuration: documentData.passwordDuration,
                    passwordValid: documentData.passwordValid,
                    passwordMin: documentData.passwordMin,
                    passwordMax: documentData.passwordMax,
                    passwordPattern: documentData.passwordPattern,
                    allowedPreviousPassword: documentData.allowedPreviousPassword ? documentData.allowedPreviousPassword.toString() : ''
                });
            }
        });
    }

    resetForm() {
        this.disputeFieldsFormNew.reset();
        (Object as any).values(this.disputeFieldsFormNew.controls).forEach((control: FormControl) => {
            control.markAsUntouched();
        });
    }

    removeDisputeItem(index: any) {
        this.dispute.removeAt(index);
    }

    editPeopleView(id) {
        this.adminUserManagementService.getPeopleForEdit(id).then((response) => {
            let responseData: any = JSON.parse(JSON.stringify(response));
            let values = responseData.user;
            try {
                this.currManager = this.people.find(x => x.id == responseData.user.managerId);
            } catch (e) {
                console.log(e)
            }
            //this.currManager = responseData.user;
            let disputes = responseData.user.disputes;
            this.finalValueForm.patchValue({
                id: values.id,
                name: values.name,
                surname: values.surname,
                cf: values.cf,
                gender: values.gender,
                birthDay: values.birthDay,
                birthPlace: values.birthPlace,
                birthProv: values.birthProv,
                address: values.address,
                city: values.city,
                cap: values.cap,
                email: values.email,
                phone: values.phone,
                prov: values.prov,
                areaID: values.areaID,
                companyId: values.companyId,
                scope: values.scope,
                badgeId: values.badgeId,
                restaurantCardId: values.restaurantCardId,
                dateStart: values.dateStart,
                dateEnd: values.dateEnd,
                workingHours: values.workingHours,
                lunchOpen: values.lunchOpen,
                enablePlan: values.enablePlan,
                enableGreenpass: values.enableGreenpass,
                enableKeys: values.enableKeys,
                typology: values.typology,
                area: values.area,
                role: values.role,
                jobTitle: values.jobTitle,
                site: values.site,
                identificationCode: values.identificationCode,
                partTimePercentage: values.partTimePercentage,
                managerId: values.managerId,
                managerFullName: values.managerFullName,
                salary: values.salary,
                mbo: values.mbo,
                bonus: values.bonus,
                contractLevel: values.contractLevel,
                disputes: values.disputes,
                accessControlLevel: values.accessControlLevel,
                accessControlSystem: values.accessControlSystem,
                accessControlPassagesId: values.accessControlPassagesId ? values.accessControlPassagesId : new Array(),
                accessControlGroupsId: values.accessControlGroupsId ? values.accessControlGroupsId : new Array(),
                numeroMatricola: values.numeroMatricola,
                tutor: values.tutor,
                patrocinante: values.patrocinante,
                ccnl: values.ccnl,
            });
            this.generalDetailsForm.patchValue({
                name: values.name,
                surname: values.surname,
                fiscalCode: values.cf,
                gender: values.gender,
                birthday: values.birthDay,
                birthPlace: values.birthPlace,
                prov: values.birthProv,
            });
            this.contactInformationForm.patchValue({
                address: values.address,
                city: values.city,
                prov: values.prov,
                cap: values.cap,
                phone: values.phone,
                email: values.email,
            });
            this.settingsForm.patchValue({
                badgeNo: values.badgeId,
                restaurantCardNo: values.restaurantCardId,
                hireDate: values.dateStart,
                resignationDate: values.dateEnd,
                // workingStartTime: values.workingHours[0],
                // lunchStartTime: values.workingHours[1],
                // lunchEndTime: values.workingHours[2],
                // workingEndTime: values.workingHours[3],
                openLunch: values.lunchOpen,
                enablePlan: values.enablePlan,
                greenPass: values.enableGreenpass,
                keys: values.enableKeys,
                typology: values.typology,
                area: values.area,
                role: values.role,
                jobTitle: values.jobTitle,
                site: values.site,
                codeIdentity: values.identificationCode,
                partTime: values.partTimePercentage,
                manager: values.managerId,
                numeroMatricola: values.numeroMatricola,
                tutor: values.tutor,
                patrocinante: values.patrocinante,
                ccnl: values.ccnl,
            });
            this.accessControlForm.patchValue({
                accessControlLevel: values.accessControlLevel,
                accessControlSystem: values.accessControlSystem,
                accessControlPassagesId: values.accessControlPassagesId ? values.accessControlPassagesId : new Array(),
                accessControlGroupsId: values.accessControlGroupsId ? values.accessControlGroupsId : new Array(),
            })
            this.selectedLevel = values.accessControlLevel;
            this.getSystemList();
            this.getSystemGates();
            this.getSystemGatesGroups();
            this.populateGatesGroupList();
            if (disputes && disputes.length > 0) {
                let ctrl = <FormArray>this.disputeFieldsForm.controls.dispute;
                ctrl.removeAt(0);
                disputes.forEach((ds, index) => {
                    ctrl.push(
                        this._formBuilder.group({
                            date: [ds.date, Validators.required],
                            dispute: [ds.dispute, Validators.required],
                            note: [ds.note, Validators.required],
                            notificationDate: ds.notificationDate,
                        })
                    );
                });
            }

            //this.disputeFieldsForm.controls['dispute'].setValue(disputes);


            this.currentEditPerson.workingHours[0] = values.workingHours[0];
            this.currentEditPerson.workingHours[1] = values.workingHours[1];
            this.currentEditPerson.workingHours[2] = values.workingHours[2];
            this.currentEditPerson.workingHours[3] = values.workingHours[3];
            this.currentEditPerson.disputes = values.disputes;
            this.economicsFieldsForm.patchValue({
                salary: values.salary,
                mbo: values.mbo,
                bonus: values.bonus,
                contractLevel: values.contractLevel,
                ccnl: values.ccnl,
            });
        });
        /*this.adminUserManagementService.getPeopleAccountForEdit(this.id).then((response) => {
          let responseData: any = JSON.parse(JSON.stringify(response));
          let values = responseData.accountData
          if(this.id){
            this.addAccountForm.patchValue({
              id: values.id,
              person: this.finalValueForm.value.name + ' ' + this.finalValueForm.value.surname,
              userId: values.userId,
              newPassword: values.newPassword,
              confirmPassword: values.confirmPassword,
              authProvider: values.authProvider,
              passwordValid: values.passwordValid,
              passwordMin: values.passwordMin,
              passwordMax: values.passwordMax,
              passwordPattern: values.passwordPattern,
              allowedPreviousPassword: values.allowedPreviousPassword ? values.allowedPreviousPassword.toString() : ''
            });
          }
        })*/
    }

    saveAndFinish(step: number) {
        this.onSubmit(step, true);
    }

    createDispute(): FormGroup {
        return this._formBuilder.group({
            date: [null, Validators.required],
            dispute: [null, Validators.required],
            note: [null, Validators.required],
            notificationDate: [null]
        });
    }

    addDispute() {
        this.dispute = this.disputeFieldsForm.get('dispute') as FormArray;
        this.dispute.push(this.createDispute());
    }

    getLastIndex() {
        return this.dispute.length - 1
    }

    streamOpened() {
        if (localStorage.getItem('currentLanguage') == 'it') {
            this._adapter.setLocale('it-IT');
        } else {
            this._adapter.setLocale('eg-EG');
        }
    }


    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

    changeItemsPerPageD(): void {
        this.limitD = this.itemsPerPageD;
        console.log("this.limit",this.limit)
        this.pageD = 1;
        this.getUserDocumentList();
    }

    pageChangedD(page): void {
        this.pageD = page;
        console.log("this.page",this.pageD)
        this.getUserDocumentList();
    }

    changeSortingD(sortBy, sortKey): void {
        if (this.sortByD == sortBy) {
            this.sortKeyD = (this.sortKeyD === '-1') ? '1' : '-1';
        } else this.sortKeyD = '-1'
        this.sortByD = sortBy;
        this.page = 1;
        this.getUserDocumentList();
    }

    editUserDocument(document: any) {
        let doc = this.userDocumentList.find(doc => doc.id == document.id);
        const dialogRef = this.dialog.open(ModifyUserDocumentPopupComponent, {
            data: {userDoc: doc}
        });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                let res = await this.adminUserManagementService.addUpdateUserDocument(result);
                Swal.fire(
                    '',
                    this.translate.instant('DOCUMENTS.Staff document updated successfully'),
                    'success'
                );
                await this.getUserDocumentList();
            }
        });
    }

    viewUserDocument(doc: any) {
        const dialogRef = this.dialog.open(ViewFilePopupComponent, {
            data: {fileName: doc.fileName, fileId: doc.fileId}
        });
    }

    async downloadUserDocument(doc: any) {
        try {
            let res = await this.dataStorageManagementService.downloadFile(doc.fileId).toPromise();
            if (res) {
                let blob = new Blob([res]);
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display: none');
                a.href = url;
                a.download = doc.fileName;
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                Swal.fire(
                    '',
                    this.translate.instant('DOCUMENTS.Staff document downloaded successfully'),
                    'success'
                );
            } else {
                Swal.fire(
                    '',
                    this.translate.instant('DOCUMENTS.FileNotFound'),
                    'error'
                );
            }
        } catch (e) {
            Swal.fire(
                '',
                this.translate.instant('DOCUMENTS.FileNotFound'),
                'error'
            );
        }
    }

    async deleteUserDocument(document: any) {
        let doc = this.userDocumentList.find(doc => doc.id == document.id);
        if (doc) {
            doc.deleted = true;
            let res = await this.adminUserManagementService.addUpdateUserDocument(doc);
            if (res) {
                Swal.fire(
                    '',
                    this.translate.instant('DOCUMENTS.Staff document deleted successfully'),
                    'success'
                );
                setTimeout(() => {
                    if ((this.documentList.length) == 0) {
                        let pageNumber = this.pageD - 1
                        console.log("pageNumber",pageNumber)
                        this.pageChangedD(pageNumber)
                        // that.getRole(this.requestParaR);
                        this.table.renderRows();
                    } else {
                       this.getUserDocumentList()
                    }
                }, 100);

            }
        }
    }

    onBadgeHistory() {
        const dialogRef = this.dialog.open(UserBadgeHistoryPopupComponent, {
            data: {userId: this.id, gatesListBySite: this.accessControlGatesList}
        });
    }

    async onRegenerateBadge() {
        let message1 = this.translate.instant("ACCESS_CONTROL.RegenerateBadgeMessage1") + this.finalValueForm.value.surname + " " + this.finalValueForm.value.name;
        const dialogRef = this.dialog.open(YesNoPopupComponent, {
            data: {
                title: this.translate.instant("ACCESS_CONTROL.RegenerateBadge"),
                message1: message1,
                message2: this.translate.instant("ACCESS_CONTROL.Sure"),
                icon: "qr_code"
            }
        });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                let res = await this.adminUserManagementService.generateAccessControlQrCode(this.id);
                if (res.result) {
                    Swal.fire(
                        '',
                        this.translate.instant('ACCESS_CONTROL.BadgeRegenerated'),
                        'success'
                    );
                }
            }
        });
    }

    async onUploadDoc() {
        const dialogRef = this.dialog.open(UploadUserDocumentPopupComponent, {
            data: {personId: this.id}
        });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                console.log("result",result)
                if (result) {
                    Swal.fire(
                        '',
                        this.translate.instant('DOCUMENTS.Staff document added successfully'),
                        'success'
                    );
                }
                this.documentUploaded = result;
                await this.getUserDocumentList();
            }
        });
    }

    async getUniversityList(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.masterApiService.getUniverstiy(request);
        if (res.statusCode === 200) {
            this.universityList = res.data;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant(res.reason),
                'info'
            );
        }
        this.helper.toggleLoaderVisibility(false);
    }

}

