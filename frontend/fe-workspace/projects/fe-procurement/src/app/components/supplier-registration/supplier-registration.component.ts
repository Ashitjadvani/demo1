import { Component, OnInit, ViewChild, AfterViewInit, DebugEventListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { HelperService } from '../../service/helper.service';
import swal from 'sweetalert2';
import { ApiService } from '../../service/api.service';
import { EMPTY, Observable, Subject, ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DeletePopupComponent } from "../../popups/delete-popup/delete-popup.component";
import { ValidatorService } from 'angular-iban';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { WhiteSpaceValidator } from '../../store/whitespace.validator';
import { TranslateService } from "@ngx-translate/core";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { tap, distinctUntilChanged, switchMap, } from 'rxjs/operators';
import { MatSelect } from "@angular/material/select";
import Swal from 'sweetalert2';

export const PICK_FORMATS = {
    parse: {
        parse: { dateInput: { month: 'numeric', year: 'numeric', day: 'numeric' } },
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'D MMM YYYY',
    }
};

@Component({
    selector: 'app-supplier-registration',
    templateUrl: './supplier-registration.component.html',
    styleUrls: ['./supplier-registration.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'it' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    ],
})
export class SupplierRegistrationComponent implements OnInit {
    public isSameAddressControl: FormControl = new FormControl(false);

    selectedValue: any;
    searchTxt: any;
    searchNation: any;

    quizOneForm: FormGroup;
    quizTwoForm: FormGroup;
    quizThreeForm: FormGroup;
    DURCUploadInput: any;
    hide = true;
    personalDetailsForm: FormGroup;
    documentationForm: FormGroup;
    termsOfPaymentForm: FormGroup;
    quizStepSaveForm: FormGroup;
    conditionsOfConformityForm: FormGroup;
    contactInformationForm: FormGroup;
    administrativeContactForm: FormGroup;
    contactShippingForm: FormGroup;
    adminLoginForm: FormGroup;
    supplierId = '';
    supplierAgreement: any = [];
    getSupplierAgreement: any = {};
    serviceMandatory = [];
    serviceIds = [];
    DURCUploadName: any;
    DURFUploadName = null;
    visuraCameraleUploadInput = null;
    visuraCameraleUploadName = null;
    generalConditionsUploadNameInput = null;
    companyBrochureInput = null;
    generalContacts = [];
    administrativeContact = [];
    contactShipping = [];
    atecoRecords = [];
    public countryRecord = [];
    public countryRecord2 = [];
    public countryRecordFiltered = [];
    public countryRecord2Filtered = [];
    statesRecord = [];
    statesRecordFiltered = [];
    citiesRecord = [];
    citiesRecordFiltered = [];
    statesRecord2 = [];
    statesRecord2Filtered = [];
    citiesRecord2 = [];
    citiesRecord2Filtered = [];
    provList = [];
    provListRecordFiltered = [];
    provList2 = [];
    provListRecordFiltered2 = [];
    supplierSurvey = [];
    questionView: any = {};
    surveyIndex = 0;
    questionIndex = 0;
    lastQuestion = false;
    documentValidation = false;
    myInterval: number;
    documentList = [];
    minDate: Date;
    activeStep: any;
    isLinear: boolean = true;
    selectedCountryId: any;
    selectedCountryName: any;
    selectedStatesId: any;
    selectedCountryId2: any;
    selectedCountryName2: any;
    selectedStatesId2: any;
    selectedProv: any;
    selectedProv2: any;
    //nation = new FormControl('');
    nation: FormControl = new FormControl();
    filteredOptions: Observable<string[]>;
    disclaimerText: any;
    instructionText: any;
    contactCopy = true
    disableDURC = true
    disableDURF = true
    disableVisura = true

    private destroy$ = new Subject();
    @ViewChild('stepper2') myStepper: MatStepper;
    @ViewChild('stepperSupplier') myStepperSupplier: MatStepper;
    public countryCtrl: FormControl = new FormControl();
    public countryFilterCtrl: FormControl = new FormControl();
    // @ts-ignore
    public filteredCountries: ReplaySubject = new ReplaySubject(1);
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

    DURFUploadInput = null;
    generalConditionsUploadName = null;
    companyBrochureName = null;
    protected _onDestroy = new Subject();

    showSupplierGeneralConditionsUpload: boolean = false;
    vatCodeNumber: any = 'IT';
    constructor(
        private _formBuilder: FormBuilder,
        private Helper: HelperService,
        private Api: ApiService,
        private router: Router,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private translate: TranslateService
    ) {
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + 1);
        this.supplierId = this.route.snapshot.paramMap.get('id');
        this.Api.getSupplierAgreement({ supplierId: this.supplierId }).pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.getSupplierAgreement = data.data;
            if (this.getSupplierAgreement.stepNumber != null) {
                this.activeStep = this.getSupplierAgreement.stepNumber;
            }
            // if (this.activeStep > 0) {
            //   this.isLinear = false
            //   this.myStepperSupplier.selectedIndex = this.activeStep;
            // }
            if (this.activeStep == 8) {
                this.isLinear = false
                this.router.navigate(['']);
            }
        });
        this.getCountryListAPICall();
    }

    get formContactInformationArr(): any {
        return this.contactInformationForm.get('generalContacts') as FormArray;
    }

    get formAdministrativeContactArr(): any {
        return this.administrativeContactForm.get('administrativeContact') as FormArray;
    }

    get formContactShippingArr(): any {
        return this.contactShippingForm.get('contactShipping') as FormArray;
    }

    addContactInformationRow(): void {
        this.formContactInformationArr.push(this.initContactInformationRows());
    }

    deleteContactInformationRow(index: number): void {
        this.formContactInformationArr.removeAt(index);
    }

    initContactInformationRows(): any {
        return this._formBuilder.group({
            id: [null],
            firstName: [null, HelperService.noWhitespaceValidator],
            lastName: [null, HelperService.noWhitespaceValidator],
            email: [null, HelperService.noWhitespaceValidator],
            contactNumber: [null, HelperService.noWhitespaceValidator],
        });
    }

    addAdministrativeContactRow(): void {
        this.formAdministrativeContactArr.push(this.initAdministrativeContactRows());
    }

    deleteAdministrativeContactRow(index: number): void {
        this.formAdministrativeContactArr.removeAt(index);
    }

    initAdministrativeContactRows(): any {
        return this._formBuilder.group({
            id: [null],
            firstName: [null, HelperService.noWhitespaceValidator],
            lastName: [null, HelperService.noWhitespaceValidator],
            email: [null, HelperService.noWhitespaceValidator],
            contactNumber: [null, HelperService.noWhitespaceValidator],
        });
    }

    addContactShippingRow(): void {
        this.formContactShippingArr.push(this.initContactShippingRows());
    }

    deleteContactShippingRow(index: number): void {
        this.formContactShippingArr.removeAt(index);
    }

    initContactShippingRows(): any {
        return this._formBuilder.group({
            id: [null],
            firstName: [null],
            lastName: [null],
            email: [null],
            contactNumber: [null],
        });
    }
    public paymentConditionIBAN: FormControl;

    async ngOnInit() {
        this.paymentConditionIBAN = new FormControl(
            null,
            [
                HelperService.noWhitespaceValidator,
                ValidatorService.validateIban
            ]
        );

        this.supplierId = this.route.snapshot.paramMap.get('id');

        this.personalDetailsForm = this._formBuilder.group({
            supplierId: [this.supplierId],
            stepNumber: [1],
            companyName: ['', HelperService.noWhitespaceValidator],
            // fiscalAddress: ['', HelperService.noWhitespaceValidator],
            VATCode: ['', [HelperService.noWhitespaceValidator, Validators.pattern('^[IT]{2}([0-9]{11}$)')]],
            //fiscalCode: ['', Validators.required],
            //fiscalCode: ['', [HelperService.noWhitespaceValidator,Validators.pattern('^([A-Za-z]{6}[lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1})$|([0-9]{11})$')]],
            //fiscalCode: ['', [HelperService.noWhitespaceValidator,Validators.pattern('^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$|([0-9]{11})$')]],
            fiscalCode: ['', [HelperService.noWhitespaceValidator, Validators.pattern('^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$|([0-9])$' || '^([0-9])$')]],
            duns: [''],
            pec: ['', HelperService.noWhitespaceValidator],
            atecoCode: ['', Validators.required],
            atecoCodeSearch: [''],
            address: ['', HelperService.noWhitespaceValidator],
            city: [''],
            state: [''],
            nation: ['', HelperService.noWhitespaceValidator],
            province: [''],
            nationSearch: [''],
            ZipCode: ['', [HelperService.noWhitespaceValidator, Validators.minLength(5), Validators.pattern(/^-?([0-9]\d*)?$/)]],
            operationalAddress: ['', HelperService.noWhitespaceValidator],
            operationalCity: [''],
            operationalState: [''],
            operationalNation: ['', HelperService.noWhitespaceValidator],
            operationalZipCode: ['', [HelperService.noWhitespaceValidator, Validators.minLength(5), Validators.pattern(/^-?([0-9]\d*)?$/)]],
            email: [{ value: '', disabled: true }, Validators.required],
            operationalProvince: [''],
            password: ['', [Validators.required, HelperService.noWhitespaceValidator]],
            sameAddress: [false]
        });

        if (this.showSupplierGeneralConditionsUpload) {
            this.documentationForm = this._formBuilder.group({
                stepNumber: [2],
                DURC: ['', [fileTypeValidator()]],
                DURF: ['', [fileTypeValidator()]],
                visuraCamerale: ['', [fileTypeValidator()]],
                condizioniDocumento: ['', [fileTypeValidator()]],
                scadenzaDURC: [''],
                scadenzaDURF: [''],
                declarationDURC: [false],
                declarationDURF: [false],
                declarationChamberOfCommerce: [false],
                companyBroucher: ['', [fileTypeValidator()]],
            });
        } else {
            this.documentationForm = this._formBuilder.group({
                stepNumber: [2],
                DURC: ['', [fileTypeValidator()]],
                DURF: ['', [fileTypeValidator()]],
                visuraCamerale: ['', [fileTypeValidator()]],
                scadenzaDURC: [''],
                scadenzaDURF: [''],
                declarationDURC: [false],
                declarationDURF: [false],
                declarationChamberOfCommerce: [false],
                companyBroucher: ['', [fileTypeValidator()]],
            });
        }

        this.quizStepSaveForm = this._formBuilder.group({
            stepNumber: [5],
            supplierId: [this.supplierId]
        });
        this.termsOfPaymentForm = this._formBuilder.group({
            stepNumber: [3],
            supplierId: [this.supplierId],
            // paymentConditionIBAN: ['', HelperService.noWhitespaceValidator,ValidatorService.validateIban],
            paymentConditionIBAN: this.paymentConditionIBAN,
            paymentConditionScadenzaPagamenti: ['', Validators.required]
        });
        this.conditionsOfConformityForm = this._formBuilder.group({
            stepNumber: [4],
            supplierId: [this.supplierId],
            declarationsConformity1: [false],
            declarationsConformity2: [false],
        });
        this.contactInformationForm = this._formBuilder.group({
            stepNumber: [6],
            supplierId: [this.supplierId],
            firstName: [null],
            lastName: [null],
            email: [null],
            contactNumber: [null],
            generalContacts: this._formBuilder.array([])
        });

        const controlContactInformation = this.contactInformationForm.get('generalContacts') as FormArray;
        controlContactInformation.push(this._formBuilder.group({
            id: [null],
            firstName: [null, HelperService.noWhitespaceValidator],
            lastName: [null, HelperService.noWhitespaceValidator],
            email: [null, [Validators.email, HelperService.noWhitespaceValidator]],
            contactNumber: [null, HelperService.noWhitespaceValidator],
        }));

        this.administrativeContactForm = this._formBuilder.group({
            stepNumber: [7],
            supplierId: [this.supplierId],
            firstName: [null],
            lastName: [null],
            contactEmail: [null],
            contactNumber: [null],
            administrativeContact: this._formBuilder.array([])
        });

        const controlAdministrativeContact = this.administrativeContactForm.get('administrativeContact') as FormArray;
        controlAdministrativeContact.push(this._formBuilder.group({
            id: [null],
            firstName: [null, HelperService.noWhitespaceValidator],
            lastName: [null, HelperService.noWhitespaceValidator],
            email: [null, [Validators.email, HelperService.noWhitespaceValidator]],
            contactNumber: [null, HelperService.noWhitespaceValidator],
        }));

        this.contactShippingForm = this._formBuilder.group({
            stepNumber: [8],
            supplierId: [this.supplierId],
            firstName: [null],
            lastName: [null],
            email: [null],
            contactNumber: [null],
            contactShipping: this._formBuilder.array([])
        });

        const controlContactShipping = this.contactShippingForm.get('contactShipping') as FormArray;
        controlContactShipping.push(this._formBuilder.group({
            id: [null],
            firstName: [null],
            lastName: [null],
            email: [null],
            contactNumber: [null],
        }));
        this.Api.signupSupplierAgreement({ id: this.supplierId })
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.supplierAgreement = data?.data ? data.data : null;
                if (this.supplierAgreement) {
                    this.supplierAgreement.forEach((b) => {
                        this.serviceMandatory = [...new Set(this.serviceMandatory.concat(b.mandatory))];
                        this.serviceIds.push(b.id);
                        b.selected = false
                    });
                }

                /*
                this.serviceIds = ["390fc3a3-8d3b-4065-9cd5-40ce11ae5d85", "5ef60d48-4b3b-44f3-ad65-38d86f017de4"];
                if (this.serviceIds.length > 0 ) {
                  this.Api.getSupplierSurvey({survey: this.serviceIds})
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((agreementData) => {
                    });
                }*/

                this.Helper.toggleLoaderVisibility(false);
            }, (error) => {
                this.Helper.toggleLoaderVisibility(false);
                /*const e = error.error;
                swal.fire(
                  'Info!',
                  e.message,
                  'info'
                );*/
            });
        this.Api.getSupplierAteco()
            .pipe(takeUntil(this.destroy$))
            .subscribe((atecoData) => {
                const atecoRecords = atecoData.records;
                this.atecoRecords = atecoRecords.map((b) => {
                    return { id: b[0], code: b[1], description: b[2] };
                });
            });

        this.Api.signupSupplierDocument({ supplier_id: this.supplierId })
            .pipe(takeUntil(this.destroy$))
            .subscribe((dataDocument) => {
                this.documentList = dataDocument.data;
                const DURCFileId = this.documentList.find((b) => b.filename === 'DURCFileId');
                if (DURCFileId) {
                    this.DURCUploadName = DURCFileId.file;
                }
                const DURFFileId = this.documentList.find((b) => b.filename === 'DURFFileId');
                if (DURFFileId) {
                    this.DURFUploadName = DURFFileId.file;
                }

                /*
                const condizioniFileId = this.documentList.find((b) => b.filename === 'condizioniFileId');
                if (condizioniFileId) {
                    this.generalConditionsUploadName = condizioniFileId.file;
                }
                */

                const visuraCameraleFileId = this.documentList.find((b) => b.filename === 'visuraCameraleFileId');
                if (visuraCameraleFileId) {
                    this.visuraCameraleUploadName = visuraCameraleFileId.file;
                }

                const companyBroucher = this.documentList.find((b) => b.filename === 'companyBroucher');
                if (companyBroucher) {
                    this.companyBrochureName = companyBroucher.file;
                }
            });



        // Select second coutry list
        // this.personalDetailsForm.get('operationalNation').valueChanges.subscribe(countryName => {
        //   this.statesRecord2 = [];
        //   this.citiesRecord2 = [];
        //   this.personalDetailsForm.get('operationalState').reset();
        //   this.personalDetailsForm.get('operationalCity').reset();
        //   this.selectedCountryName2 = countryName;
        //   const countryData = this.countryRecord;
        //   for (let i = 0;i < countryData.length; i++){
        //     if (countryData[i].name == countryName){
        //       this.selectedCountryId2 = countryData[i].iso2;
        //       this.Api.getStatesList({countryID : this.selectedCountryId2}).subscribe((data) => {
        //         this.statesRecord2 = data.data;
        //       });
        //     }
        //   }
        // });
        // this.personalDetailsForm.get('operationalState').valueChanges.subscribe(stateName => {
        //   const stateData = this.statesRecord2;
        //   for(let i=0; i< stateData.length;i++){
        //     if ( stateData[i].country_name == this.selectedCountryName2 && stateData[i].name == stateName){
        //       this.selectedStatesId2 = stateData[i].state_code;
        //       this.Api.getCitiesList({countryID : this.selectedCountryId2, stateCode: this.selectedStatesId2}).subscribe((data) => {
        //         this.citiesRecord2 = data.data;
        //       });
        //     }
        //   }
        // });

        this.Api.getSupplierAgreement({ supplierId: this.supplierId })
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.getSupplierAgreement = data.data;
                if (this.getSupplierAgreement.stepNumber != null) {
                    this.activeStep = this.getSupplierAgreement.stepNumber;
                }
                if (this.activeStep > 0) {
                    this.isLinear = false;
                    if( this.myStepperSupplier.selectedIndex){

                        this.myStepperSupplier.selectedIndex = this.activeStep;
                    }
                }
                this.generalContacts = (Array.isArray(this.getSupplierAgreement.generalContacts)) ? this.getSupplierAgreement.generalContacts : [];
                this.administrativeContact = (Array.isArray(this.getSupplierAgreement.administrativeContact)) ? this.getSupplierAgreement.administrativeContact : [];
                this.contactShipping = (Array.isArray(this.getSupplierAgreement.contactShipping)) ? this.getSupplierAgreement.contactShipping : [];

                if (Array.isArray(this.getSupplierAgreement.survey) && this.getSupplierAgreement.survey.length > 0) {
                    this.Api.signupSupplierSurvey({ survey: this.getSupplierAgreement.survey, supplier_id: this.supplierId })
                        .pipe(takeUntil(this.destroy$))
                        .subscribe((dataSurvey) => {
                            this.supplierSurvey = dataSurvey.data;
                            // this.removeSurveyQuestion();
                            this.disclaimerText = this.supplierSurvey[this.surveyIndex].disclaimer;
                            this.instructionText = this.supplierSurvey[this.surveyIndex].instruction;
                            setTimeout(() => {
                                this.findSurvey();
                            }, 1000);

                        }, (err) => {
                        });
                }

                if (this.generalContacts.length > 0) {
                    controlContactInformation.clear();
                    this.generalContacts.forEach((b) => {
                        controlContactInformation.push(this._formBuilder.group({
                            firstName: [b.firstName, HelperService.noWhitespaceValidator],
                            lastName: [b.lastName, HelperService.noWhitespaceValidator],
                            email: [b.email, [Validators.email, HelperService.noWhitespaceValidator]],
                            contactNumber: [b.contactNumber, HelperService.noWhitespaceValidator],
                        }));
                    });
                }

                if (this.administrativeContact.length > 0) {
                    controlAdministrativeContact.clear();
                    this.administrativeContact.forEach((b) => {
                        controlAdministrativeContact.push(this._formBuilder.group({
                            firstName: [b.firstName, HelperService.noWhitespaceValidator],
                            lastName: [b.lastName, HelperService.noWhitespaceValidator],
                            email: [b.email, [Validators.email, HelperService.noWhitespaceValidator]],
                            contactNumber: [b.contactNumber, HelperService.noWhitespaceValidator],
                        }));
                    });
                }

                if (this.contactShipping.length > 0) {
                    controlContactShipping.clear();
                    this.contactShipping.forEach((b) => {
                        controlContactShipping.push(this._formBuilder.group({
                            firstName: [b.firstName],
                            lastName: [b.lastName],
                            email: [b.email],
                            contactNumber: [b.contactNumber],
                        }));
                    });
                }
                if(this.administrativeContact.length > 0 || this.contactShipping.length > 0){
                    this.contactCopy = false
                }
                else{
                    this.contactCopy = true
                }
                if (this.getSupplierAgreement) {
                    if (this.getSupplierAgreement.atecoCode.length != 0) {
                        let selectedrecords = []
                        let nonselectedrecords = []
                        nonselectedrecords = this.atecoRecords
                        this.atecoRecords.forEach(element => {
                            for (let index = 0; index < this.getSupplierAgreement.atecoCode.length; index++) {
                                if (element.description == this.getSupplierAgreement.atecoCode[index]) {
                                    selectedrecords.push(element)
                                }
                            }
                        });
                        for (let index = 0; index < selectedrecords.length; index++) {
                            nonselectedrecords = nonselectedrecords.filter(x => x.description != selectedrecords[index].description)
                        }
                        this.atecoRecords = []
                        this.atecoRecords = selectedrecords.concat(nonselectedrecords)
                    }
                    let VATcode = this.getSupplierAgreement.VATCode;
                    let character = VATcode?.charAt(0) + VATcode?.charAt(1);
                    character === 'IT' ? this.vatCodeNumber =this.getSupplierAgreement.VATCode:this.vatCodeNumber = 'IT'
                    this.personalDetailsForm.patchValue({
                        stepNumber: 1,
                        supplierId: this.getSupplierAgreement.supplierId,
                        companyName: this.getSupplierAgreement.companyName ? this.getSupplierAgreement.companyName : this.getSupplierAgreement.businessName,
                        fiscalAddress: this.getSupplierAgreement.fiscalAddress,
                        VATCode: this.vatCodeNumber,
                        fiscalCode: this.getSupplierAgreement.fiscalCode,
                        duns: this.getSupplierAgreement.duns,
                        pec: this.getSupplierAgreement.pec,
                        atecoCode: this.getSupplierAgreement.atecoCode,
                        address: this.getSupplierAgreement.address,
                        city: this.getSupplierAgreement.city,
                        ZipCode: this.getSupplierAgreement.ZipCode,
                        province: this.getSupplierAgreement.province,
                        state: this.getSupplierAgreement.state,
                        nation: this.getSupplierAgreement.nation,
                        operationalAddress: this.getSupplierAgreement.operationalAddress,
                        operationalCity: this.getSupplierAgreement.operationalCity,
                        operationalState: this.getSupplierAgreement.operationalState,
                        operationalNation: this.getSupplierAgreement.operationalNation,
                        operationalProvince: this.getSupplierAgreement.operationalProvince,
                        operationalZipCode: this.getSupplierAgreement.operationalZipCode,
                        email: this.getSupplierAgreement.email,

                    });

                    this.termsOfPaymentForm.patchValue({
                        stepNumber: 3,
                        supplierId: this.getSupplierAgreement.supplierId,
                        paymentConditionIBAN: this.getSupplierAgreement.paymentConditionIBAN,
                        paymentConditionScadenzaPagamenti: this.getSupplierAgreement.paymentConditionScadenzaPagamenti,
                    });

                    this.conditionsOfConformityForm = this._formBuilder.group({
                        stepNumber: 4,
                        supplierId: this.supplierId,
                        declarationsConformity1: this.getSupplierAgreement.declarationsConformity1,
                        declarationsConformity2: this.getSupplierAgreement.declarationsConformity2,
                    });
                    if (this.conditionsOfConformityForm.value.declarationsConformity1 == true) {
                        this.supplierAgreement.forEach(b => b.selected = true)
                    }
                    else {
                        this.supplierAgreement.forEach(b => b.selected = false)

                    }

                    this.documentationForm.patchValue({
                        // DURC:this.documentList.file,
                        // DURF: this.getSupplierAgreement.DURF,
                        // visuraCamerale: this.getSupplierAgreement.visuraCamerale,
                        // condizioniDocumento: this.getSupplierAgreement.condizioniDocumento,
                        scadenzaDURC: this.getSupplierAgreement.scadenzaDURC,
                        scadenzaDURF: this.getSupplierAgreement.scadenzaDURF,
                        declarationDURC: this.getSupplierAgreement.declarationDURC,
                        declarationDURF: this.getSupplierAgreement.declarationDURF,
                        declarationChamberOfCommerce: this.getSupplierAgreement.declarationChamberOfCommerce
                    });
                    this.disableDURC = this.getSupplierAgreement.declarationDURC
                    this.disableDURF = this.getSupplierAgreement.declarationDURF
                    this.disableVisura = this.getSupplierAgreement.declarationChamberOfCommerce
                }
                this.Helper.toggleLoaderVisibility(false);
            }, (error) => {
                this.Helper.toggleLoaderVisibility(false);
                this.router.navigate(['']);
                const e = error.error;
                swal.fire(
                    'Info!',
                    this.translate.instant(e.message),
                    'info'
                );
            });


    }

    copySameAddress(event) {
        this.Helper.toggleLoaderVisibility(true);
        if (event.checked) {
            this.personalDetailsForm.patchValue({
                operationalAddress: this.personalDetailsForm.value.address,
                operationalCity: this.personalDetailsForm.value.city,
                operationalState: this.personalDetailsForm.value.state,
                operationalNation: this.personalDetailsForm.value.nation,
                operationalProvince: this.personalDetailsForm.value.province,
                operationalZipCode: this.personalDetailsForm.value.ZipCode,
            })
            this.selecedCountryFunction2(this.personalDetailsForm.value.operationalNation);
            this.selectedStateFunction2(this.personalDetailsForm.value.operationalNation, this.personalDetailsForm.value.operationalState);
            this.selectedProvinceFunction2(this.personalDetailsForm.value.operationalNation, this.personalDetailsForm.value.operationalState, this.personalDetailsForm.value.operationalProvince);
            this.Helper.toggleLoaderVisibility(false);
        } else {
            this.personalDetailsForm.patchValue({

                operationalAddress: this.getSupplierAgreement.operationalAddress,
                operationalCity: this.getSupplierAgreement.operationalCity,
                operationalState: this.getSupplierAgreement.operationalState,
                operationalNation: this.getSupplierAgreement.operationalNation,
                operationalProvince: this.getSupplierAgreement.operationalProvince,
                operationalZipCode: this.getSupplierAgreement.operationalZipCode,

            })
            this.selecedCountryFunction2(this.getSupplierAgreement.operationalNation);
            this.selectedStateFunction2(this.getSupplierAgreement.operationalNation, this.getSupplierAgreement.operationalState);
            this.selectedProvinceFunction2(this.getSupplierAgreement.operationalNation, this.getSupplierAgreement.operationalStat, this.getSupplierAgreement.operationalProvince);
            this.Helper.toggleLoaderVisibility(false);
        }
    }

    async getCountryListAPICall() {
        setTimeout(() => {
            this.Api.getCountryList().pipe(takeUntil(this.destroy$)).subscribe((data) => {
                this.filteredCountries.next(this.countryRecord.slice());
                this.countryFilterCtrl.valueChanges
                    .pipe(takeUntil(this._onDestroy))
                    .subscribe(() => {
                        this.filterBanks();
                    });
                this.countryRecord = data.data;
                this.countryRecord2 = data.data;
                this.countryRecordFiltered = this.countryRecord.slice();
                this.countryRecord2Filtered = this.countryRecord2.slice();
                /*const countryRecords = data.data;
                this.countryRecord = countryRecords.map( (b) => {
                  return { name: b.name};
                });*/
                this.filteredOptions = this.nation.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value)),
                );
                this.selecedCountryFunction(this.getSupplierAgreement.nation);
                this.selectedStateFunction(this.getSupplierAgreement.nation, this.getSupplierAgreement.state);
                this.selecedCountryFunction2(this.getSupplierAgreement.operationalNation);
                this.selectedStateFunction2(this.getSupplierAgreement.operationalNation, this.getSupplierAgreement.operationalStat);
                this.selectedProvinceFunction(this.getSupplierAgreement.nation, this.getSupplierAgreement.state, this.getSupplierAgreement.province);
                this.selectedProvinceFunction2(this.getSupplierAgreement.operationalNation, this.getSupplierAgreement.operationalState, this.getSupplierAgreement.operationalProvince);

            });
        }, 2000);
    }
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.countryRecord.filter(coutry => coutry.name.includes(filterValue));
        // return this.countryRecord.filter(coutry => coutry.map(
        //   function (s){
        //     return s.toLowerCase().includes(filterValue)
        //   })
        // )
    }

    protected filterBanks() {
        if (!this.countryRecord) {
            return;
        }

        let search = this.countryFilterCtrl.value;
        if (!search) {
            this.filteredCountries.next(this.countryRecord.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredCountries.next(
            this.countryRecord.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
        );
    }

    changeCountry(countryName) {
        this.statesRecord = [];
        this.citiesRecord = [];
        this.personalDetailsForm.get('state').reset();
        this.personalDetailsForm.get('city').reset();
        this.selecedCountryFunction(countryName);
    }

    triggerEvent(event, matFilter: any) {
        if (event === false) {
            // matFilter.searchForm.reset();
            // matFilter.searchForm.value.value = '';
        }
    }

    changeState(stateName) {
        const stateData = this.statesRecord;
        for (let i = 0; i < stateData.length; i++) {
            if (stateData[i].id == stateName) {
                this.selectedStatesId = stateData[i].id;
                this.Api.getSelectedProvince({ id: stateName }).subscribe((data) => {
                    this.provList = data.data;
                    this.provListRecordFiltered = this.provList.slice();
                });
            }
        }
    }

    // provinceSelect(id:any){
    //   this.Api.getSelectedProvince({id:id}).subscribe((result:any)=>{
    //     if(result){
    //       this.provList = result.data;
    //       this.provListRecordFiltered = this.provList.slice();
    //     }else{
    //       // const e = err.error;
    //       swal.fire(
    //         '',
    //         // err.error.message,
    //         this.translate.instant(result.reason),
    //         'info'
    //       );
    //     }
    //   })
    // }


    changeCountry2(countryName) {
        this.statesRecord2 = [];
        this.citiesRecord2 = [];
        this.personalDetailsForm.get('operationalState').reset();
        this.personalDetailsForm.get('operationalCity').reset();
        this.selecedCountryFunction2(countryName);
    }


    changeState2(stateName) {
        const stateData = this.statesRecord2;
        for (let i = 0; i < stateData.length; i++) {
            if (stateData[i].id == stateName) {
                this.selectedStatesId2 = stateData[i].id;
                this.Api.getSelectedProvince({ id: stateName }).subscribe((data) => {
                    this.provList2 = data.data;
                    this.provListRecordFiltered2 = this.provList2.slice();
                });
            }
        }
    }

    changeProvince(provinceName) {
        const provData = this.provList;
        for (let i = 0; i < provData.length; i++) {
            if (provData[i] == provinceName) {
                this.selectedStatesId = provData[i];
                this.Api.getCitiesList({ province: provinceName }).subscribe((data) => {
                    this.citiesRecord = data.data;
                    this.citiesRecordFiltered = this.citiesRecord.slice();
                });
            }
        }
    }


    changeProvince2(provinceName) {
        const provData = this.provList2;
        for (let i = 0; i < provData.length; i++) {
            if (provData[i] == provinceName) {
                this.selectedStatesId2 = provData[i];
                this.Api.getCitiesList({ province: provinceName }).subscribe((data) => {
                    this.citiesRecord2 = data.data;
                    this.citiesRecord2Filtered = this.citiesRecord2.slice();
                });
            }
        }
    }


    async selecedCountryFunction(selectedCountry) {
        this.selectedCountryName = selectedCountry;
        const countryData = this.countryRecord;
        for (let i = 0; i < countryData.length; i++) {
            if (countryData[i].id == selectedCountry) {
                this.selectedCountryId = countryData[i].id;
                this.Api.getStatesList({ countryID: this.selectedCountryId }).subscribe((data) => {
                    this.statesRecord = data.data;
                    this.statesRecordFiltered = this.statesRecord.slice();
                });
            }
        }
    }

    async selectedStateFunction(selectedCountry, selectedState) {
        const countryData = this.countryRecord;
        for (let i = 0; i < countryData.length; i++) {
            if (countryData[i].id == selectedCountry) {
                this.selectedCountryId = countryData[i].id;
                this.Api.getStatesList({ countryID: this.selectedCountryId }).subscribe((data) => {
                    this.statesRecord = data.data;
                    const stateData = this.statesRecord;
                    for (let i = 0; i < stateData.length; i++) {
                        if (stateData[i].id == selectedState) {
                            this.selectedStatesId = stateData[i].id;
                            this.Api.getSelectedProvince({ id: this.selectedStatesId }).subscribe((data) => {
                                this.provList = data.data;
                                this.provListRecordFiltered = this.provList.slice();

                            });
                        }
                    }
                });
            }
        }
    }

    async selectedProvinceFunction(selectedCountry, selectedState, selectedProvince) {
        const countryData = this.countryRecord;
        for (let i = 0; i < countryData.length; i++) {
            if (countryData[i].id == selectedCountry) {
                this.selectedCountryId = countryData[i].id;
                this.Api.getStatesList({ countryID: this.selectedCountryId }).subscribe((data) => {
                    this.statesRecord = data.data;
                    const stateData = this.statesRecord;
                    for (let i = 0; i < stateData.length; i++) {
                        if (stateData[i].id == selectedState) {
                            this.selectedStatesId = stateData[i].id;
                            this.Api.getSelectedProvince({ id: this.selectedStatesId }).subscribe((data) => {
                                this.provList = data.data;
                                this.provListRecordFiltered = this.provList.slice();
                                const selectedProvinceData = this.provList;
                                for (let i = 0; i < selectedProvinceData.length; i++) {
                                    if (selectedProvinceData[i] == selectedProvince) {
                                        this.selectedProv = selectedProvinceData[i]
                                        this.Api.getCitiesList({ province: this.selectedProv }).subscribe((data) => {
                                            this.citiesRecord = data.data;
                                            this.citiesRecordFiltered = this.citiesRecord.slice();
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    async selecedCountryFunction2(selectedCountry) {
        this.selectedCountryName2 = selectedCountry;
        const countryData = this.countryRecord;
        for (let i = 0; i < countryData.length; i++) {
            if (countryData[i].id == selectedCountry) {
                this.selectedCountryId2 = countryData[i].id;
                this.Api.getStatesList({ countryID: this.selectedCountryId2 }).subscribe((data) => {
                    this.statesRecord2 = data.data;
                    this.statesRecord2Filtered = this.statesRecord2.slice()
                });
            }
        }
    }

    async selectedStateFunction2(selectedCountry, selectedState) {
        const countryData = this.countryRecord2;
        for (let i = 0; i < countryData.length; i++) {
            if (countryData[i].id == selectedCountry) {
                this.selectedCountryId = countryData[i].id;
                this.Api.getStatesList({ countryID: this.selectedCountryId }).subscribe((data) => {
                    this.statesRecord2 = data.data;
                    const stateData = this.statesRecord2;
                    for (let i = 0; i < stateData.length; i++) {
                        if (stateData[i].id == selectedState) {
                            this.selectedStatesId2 = stateData[i].id;
                            this.Api.getSelectedProvince({ id: this.selectedStatesId2 }).subscribe((data) => {
                                this.provList2 = data.data;
                                this.provListRecordFiltered2 = this.provList2.slice();

                            });
                        }
                    }
                });
            }
        }
    }

    async selectedProvinceFunction2(selectedCountry, selectedState, selectedProvince) {
        const countryData = this.countryRecord2;
        for (let i = 0; i < countryData.length; i++) {
            if (countryData[i].id == selectedCountry) {
                this.selectedCountryId2 = countryData[i].id;
                this.Api.getStatesList({ countryID: this.selectedCountryId2 }).subscribe((data) => {
                    this.statesRecord2 = data.data;
                    const stateData = this.statesRecord2;
                    for (let i = 0; i < stateData.length; i++) {
                        if (stateData[i].id == selectedState) {

                            this.selectedStatesId2 = stateData[i].id;
                            this.Api.getSelectedProvince({ id: this.selectedStatesId2 }).subscribe((data) => {
                                this.provList2 = data.data;
                                this.provListRecordFiltered2 = this.provList2.slice();
                                const selectedProvinceData = this.provList2;
                                for (let i = 0; i < selectedProvinceData.length; i++) {
                                    if (selectedProvinceData[i] == selectedProvince) {

                                        this.selectedProv2 = selectedProvinceData[i]
                                        this.Api.getCitiesList({ province: this.selectedProv2 }).subscribe((data) => {
                                            this.citiesRecord2 = data.data;
                                            this.citiesRecord2Filtered = this.citiesRecord2.slice();
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    findSurvey(isStart = true): void {
        const getSurvey = this.supplierSurvey[this.surveyIndex];
        const surveyIndex = this.surveyIndex;
        const lastQuestion = this.supplierSurvey[surveyIndex + 1];
        // clearInterval(this.myInterval);
        if (this.supplierSurvey[this.surveyIndex]?.questionData[this.questionIndex]) {
            const getQuestion = this.supplierSurvey[this.surveyIndex].questionData[this.questionIndex];
            // this.questionIndex = this.questionIndex + 1;
            this.questionView = getQuestion;
            const totalQuestion = getSurvey.questionData.length;
            const totalQuestionLimit = getSurvey.numberOfQuestion >= getSurvey.questionData.length ? getSurvey.numberOfQuestion : getSurvey.questionData.length;

            this.questionView.numberOfQuestion = totalQuestionLimit - totalQuestion;
            this.questionView.numberOfQuestion = this.questionView.numberOfQuestion + 1;
            this.questionView.totalQuestion = totalQuestionLimit;

            this.questionView.disclaimer = getSurvey.disclaimer;
            this.questionView.givenAnswer = null;
            this.questionView.survey_id = getSurvey.surveyId;
            this.questionView.survey_name = getSurvey.surveyName;
            // this.viewTimer = false;
            if (getQuestion && !this.questionView.isShowDisclaimer) {
                // this.serverQuestionCountDown(isStart);
            }
            return getQuestion;
        } else if (lastQuestion) {
            this.myStepper.next();
            this.surveyIndex = this.surveyIndex + 1;
            this.questionIndex = 0;
            this.findSurvey(isStart);
        } else {
            this.myStepper.next();
            this.lastQuestion = true;
            return null;
        }
    }

    surveyButton(): void {
        //if (!this.questionView.isShowDisclaimer) {
        const getAnswerData = this.questionView.answers.find((b) => {
            return b.id === this.questionView.givenAnswer;
        });
        const answerData = {
            supplier_id: this.supplierId,
            survey_id: this.questionView.survey_id,
            survey_name: this.questionView.survey_name,
            question: {
                id: this.questionView.id,
                value: this.questionView.question
            },
            answer: {
                id: this.questionView.givenAnswer,
                value: (getAnswerData) ? getAnswerData.value : this.questionView.givenAnswer
            }
        };

        this.removeSurveyQuestion();
        this.Api.saveSupplierSurvey(answerData).subscribe((data: any) => {
            this.findSurvey();
        });
        // } else {
        //   this.questionView.isShowDisclaimer = false;
        //   // this.serverQuestionCountDown(true);
        // }
    }

    removeSurveyQuestion(): void {
        this.disclaimerText = this.supplierSurvey[this.surveyIndex].disclaimer;
        this.instructionText = this.supplierSurvey[this.surveyIndex].instruction;
        if (this.supplierSurvey[this.surveyIndex]?.questionData && this.supplierSurvey[this.surveyIndex].questionData.length > 0) {
            this.supplierSurvey[this.surveyIndex].questionData.splice(0, 1);
            setTimeout(() => {
                this.disclaimerText = this.supplierSurvey[this.surveyIndex].disclaimer;
                this.instructionText = this.supplierSurvey[this.surveyIndex].instruction;
            }, 300);
        }
    }

    onFileChanged(input: HTMLInputElement, number: number): void {
        if(input.files.length > 0){

            if (number === 1) {
                const file = input.files[0];
                this.DURCUploadInput = file;
                this.DURCUploadName = `${file.name} (${this.formatBytes(file.size)})`;
            } else if (number === 2) {
                const file = input.files[0];
                this.DURFUploadInput = file;
                this.DURFUploadName = `${file.name} (${this.formatBytes(file.size)})`;
            } else if (number === 3) {
            const file = input.files[0];
            this.visuraCameraleUploadInput = file;
            this.visuraCameraleUploadName = `${file.name} (${this.formatBytes(file.size)})`;
        } else if (number === 4) {
            const file = input.files[0];
            this.generalConditionsUploadNameInput = file;
            this.generalConditionsUploadName = `${file.name} (${this.formatBytes(file.size)})`;
        } else if (number === 5) {
            const file = input.files[0];
            this.companyBrochureInput = file;
            this.companyBrochureName = `${file.name} (${this.formatBytes(file.size)})`;
        }
    }

    this.updateValidationDocuments();
}

    declineUser() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            width: '500px',
            data: {
                //message: 'Are you sure you want to decline your collaboration?',
                message: 'Sei sicuro di voler rifiutare la tua collaborazione?',
            }
        });
        const that = this;
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.Api.declineByUser({ id: this.supplierId }).subscribe((data) => {
                    swal.fire(
                        '',
                        'Hai rifiutato con successo la tua collaborazione.',
                        //'You have successfully declined your collaboration.',
                        'success'
                    );
                    that.router.navigate(['']);
                }, (error) => {
                    const e = error.error;
                    swal.fire(
                        'Info!',
                        this.translate.instant(e.message),
                        'info'
                    );
                });
            }
        });

    }

    noRequiredDURCField(event) {

        if(this.DURCUploadName &&  event.checked){
            event.checked = false
            this.documentationForm.patchValue({
                declarationDURC : false
            })
            return
        }
        else{
            this.disableDURC =  event.checked
        }
        if (event.checked) {
            this.documentationForm.get('DURC').clearValidators();
            this.documentationForm.get('DURC').updateValueAndValidity();
            this.documentationForm.get('DURC').setValidators(fileTypeValidator());
            this.documentationForm.get('scadenzaDURC').clearValidators();
            this.documentationForm.get('scadenzaDURC').updateValueAndValidity();
        }
        this.documentationForm.get('DURC').updateValueAndValidity();
        this.documentationForm.get('scadenzaDURC').updateValueAndValidity();
    }
    noRequiredDURFField(event) {
        if(this.DURFUploadName &&  event.checked){
            // swal.fire(
            //     'Info!',
            //     'Please remove DURF Document',
            //     'info'
            // );
            event.checked = false
            this.documentationForm.patchValue({
                declarationDURF : false
            })
            return
        }
        else{
            this.disableDURF =  event.checked
        }
        if (event.checked) {
            this.documentationForm.get('DURF').clearValidators();
            this.documentationForm.get('DURF').updateValueAndValidity();
            this.documentationForm.get('DURF').setValidators(fileTypeValidator());
            this.documentationForm.get('scadenzaDURF').clearValidators();
            this.documentationForm.get('scadenzaDURF').updateValueAndValidity();
        }
        this.documentationForm.get('DURF').updateValueAndValidity();
        this.documentationForm.get('scadenzaDURF').updateValueAndValidity();
    }
    noRequiredChamberOfCommerceField(event) {
        if(this.visuraCameraleUploadName &&  event.checked){
            event.checked = false
            this.documentationForm.patchValue({
                declarationChamberOfCommerce : false
            })
            return
        }
        else{
            this.disableVisura =  event.checked
        }
        if (event.checked) {
            this.documentationForm.get('visuraCamerale').clearValidators();
            this.documentationForm.get('visuraCamerale').updateValueAndValidity();
            this.documentationForm.get('visuraCamerale').setValidators(fileTypeValidator());
        }
        this.documentationForm.get('visuraCamerale').updateValueAndValidity();
    }


    updateValidationDocuments(): void {
        const DURCValidation = this.serviceMandatory.find((b) => b === 'DURC');
        if (DURCValidation) {
            this.documentationForm.get('DURC').setValidators([Validators.required, fileTypeValidator()]);
            if (this.getSupplierAgreement.DURCFileId || this.DURCUploadName) {
                this.documentationForm.get('DURC').setValidators(fileTypeValidator());
            } else {
                this.documentationForm.get('DURC').setValidators([Validators.required, fileTypeValidator()]);
            }
            if (!this.documentationForm.value.DURC && !this.DURCUploadName) {
                this.documentationForm.get('DURC').setValidators([Validators.required, fileTypeValidator()]);
            }
            if (this.documentationForm.value.declarationDURC) {
                this.documentationForm.get('DURC').clearValidators();
            }
        } else {
            this.documentationForm.get('DURC').setValidators(fileTypeValidator());
        }
        this.documentationForm.get('DURC').updateValueAndValidity();

        const scadenzaDURCValidation = this.serviceMandatory.find((b) => b === 'ScadenzaDURC');
        if (DURCValidation) {
            this.documentationForm.get('scadenzaDURC').setValidators(Validators.required);
            if (this.documentationForm.value.scadenzaDURC === null) {
                this.documentationForm.get('scadenzaDURC').setValidators(Validators.required);
            }
        } else {
            this.documentationForm.get('scadenzaDURC').clearValidators();
        }
        if (this.documentationForm.value.declarationDURC) {
            this.documentationForm.get('scadenzaDURC').clearValidators();
        }
        this.documentationForm.get('scadenzaDURC').updateValueAndValidity();

        const DURFValidation = this.serviceMandatory.find((b) => b === 'DURF');

        if (DURFValidation) {
            this.documentationForm.get('DURF').setValidators([Validators.required, fileTypeValidator()]);
            if (this.getSupplierAgreement.DURFFileId || this.DURFUploadName) {
                this.documentationForm.get('DURF').setValidators(fileTypeValidator())
            } else {
                this.documentationForm.get('DURF').setValidators([Validators.required, fileTypeValidator()]);
            }
            if (!this.documentationForm.value.DURF && !this.DURFUploadName) {
                this.documentationForm.get('DURF').setValidators([Validators.required, fileTypeValidator()]);
            }
            if (this.documentationForm.value.declarationDURF) {
                this.documentationForm.get('DURF').clearValidators();
            }
            if(this.DURCUploadName){

            }
        } else {
            this.documentationForm.get('DURF').setValidators(fileTypeValidator());
        }
        this.documentationForm.get('DURF').updateValueAndValidity();

        const scadenzaDURFValidation = this.serviceMandatory.find((b) => b === 'ScadenzaDURF');
        if (DURFValidation) {
            this.documentationForm.get('scadenzaDURF').setValidators(Validators.required);
            if (this.documentationForm.value.scadenzaDURF === null) {
                this.documentationForm.get('scadenzaDURF').setValidators(Validators.required);
            }
        } else {
            this.documentationForm.get('scadenzaDURF').clearValidators();
        }
        if (this.documentationForm.value.declarationDURF) {
            this.documentationForm.get('scadenzaDURF').clearValidators();
        }
        this.documentationForm.get('scadenzaDURF').updateValueAndValidity();

        const VisuraValidation = this.serviceMandatory.find((b) => b === 'VisuraCamerale');
        if (VisuraValidation) {
            this.documentationForm.get('visuraCamerale').setValidators([Validators.required, fileTypeValidator()]);
            if (this.getSupplierAgreement.visuraCameraleFileId || this.visuraCameraleUploadName) {
                this.documentationForm.get('visuraCamerale').setValidators(fileTypeValidator())
            } else {
                this.documentationForm.get('visuraCamerale').setValidators([Validators.required, fileTypeValidator()]);
            }
            if (!this.documentationForm.value.visuraCamerale && !this.visuraCameraleUploadName) {
                this.documentationForm.get('visuraCamerale').setValidators([Validators.required, fileTypeValidator()]);
            }
            if (this.documentationForm.value.declarationChamberOfCommerce) {
                this.documentationForm.get('visuraCamerale').clearValidators();
            }
        } else {
            this.documentationForm.get('visuraCamerale').setValidators(fileTypeValidator());
        }
        this.documentationForm.get('visuraCamerale').updateValueAndValidity();

        if (this.showSupplierGeneralConditionsUpload) {
            const condizioniValidation = this.serviceMandatory.find((b) => b === 'CondizioniPrestazione');
            if (condizioniValidation) {
                this.documentationForm.get('condizioniDocumento').setValidators([Validators.required, fileTypeValidator()]);
                if (this.getSupplierAgreement.condizioniFileId) {
                    this.documentationForm.get('condizioniDocumento').setValidators(fileTypeValidator())
                } else {
                    this.documentationForm.get('condizioniDocumento').setValidators([Validators.required, fileTypeValidator()]);
                }
                if (!this.documentationForm.value.condizioniDocumento) {
                    this.documentationForm.get('condizioniDocumento').setValidators([Validators.required, fileTypeValidator()]);
                }
            } else {
                this.documentationForm.get('condizioniDocumento').setValidators(fileTypeValidator());
            }
            this.documentationForm.get('condizioniDocumento').updateValueAndValidity();
        }
    }

    formatBytes(bytes: number): string {
        const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const factor = 1024;
        let index = 0;
        while (bytes >= factor) {
            bytes /= factor;
            index++;
        }
        return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    saveDocumentation(stepper: MatStepper): void {
        this.documentValidation = true;
        this.updateValidationDocuments();
        if (this.documentationForm.valid) {
            this.Helper.toggleLoaderVisibility(true);
            this.Api.uploadSupplierFiles(this.DURCUploadInput, this.DURFUploadInput, this.visuraCameraleUploadInput, this.generalConditionsUploadNameInput, this.companyBrochureInput).subscribe((data: any) => {
                this.Helper.toggleLoaderVisibility(false);
                const fileDocument = (data) ? Object.assign.apply({}, data) : {};
                fileDocument.supplierId = this.supplierId;
                fileDocument.stepNumber = 2;
                fileDocument.scadenzaDURC = this.documentationForm.value.scadenzaDURC;
                fileDocument.scadenzaDURF = this.documentationForm.value.scadenzaDURF;
                fileDocument.declarationDURC = this.documentationForm.value.declarationDURC;
                fileDocument.declarationDURF = this.documentationForm.value.declarationDURF;
                fileDocument.declarationChamberOfCommerce = this.documentationForm.value.declarationChamberOfCommerce;
                if (this.DURCUploadName == null) {
                    fileDocument.DURCFileId = ''
                }
                if (this.DURFUploadName == null) {
                    fileDocument.DURFFileId = ''
                }
                if (this.visuraCameraleUploadName == null) {
                    fileDocument.visuraCameraleFileId = ''
                }
                /*if (this.generalConditionsUploadName == null) {
                    fileDocument.condizioniFileId = ''
                }*/
                if (this.companyBrochureName == null) {
                    fileDocument.companyBroucher = ''
                }
                this.saveSupplierRegistration(fileDocument, stepper);
            }, (err) => {
                this.Helper.toggleLoaderVisibility(false);
            });
        }
    }

    savePersonalData(stepper: MatStepper): void {
        if (this.personalDetailsForm.valid) {
            this.saveSupplierRegistration(this.personalDetailsForm.value, stepper);
        }
    }

    saveConformityForm(stepper: MatStepper): void {
        if (this.conditionsOfConformityForm.valid) {
            //if (this.supplierAgreement.length === this.supplierAgreement.filter( (b) => b.selected).length) {
            var totalLength = this.supplierAgreement.length;
            var selectedAgrrementLength = 0;
            var selectedAgrrement = this.supplierAgreement.filter(a => a.selected);
            if (selectedAgrrement) {
                selectedAgrrementLength = selectedAgrrement.length;
            }
            if (totalLength == selectedAgrrementLength && this.conditionsOfConformityForm.value.declarationsConformity1) {
                // if ( this.conditionsOfConformityForm.value.declarationsConformity1) {

                this.saveSupplierRegistration(this.conditionsOfConformityForm.value, stepper);

            } else {
                swal.fire(
                    'Info!',
                    //'You should select all the Conditions of Conformity',
                    'Dovresti selezionare tutte le Condizioni di servizio',
                    'info'
                );
            }
        }
    }

    selectionChange(event: StepperSelectionEvent): void {
        const stepLabel = event.selectedStep.label;
        if (stepLabel === 'Quiz Step Supplier') {
            this.findSurvey(false);
        }
    }

    /*serverQuestionCountDown(isStart): void {
      this.progress = 100;
      this.viewTimer = true;
      const minutes = (this.questionView?.minutes) ? this.questionView.minutes * 60 : 0;
      const seconds = this.questionView?.seconds ? this.questionView.seconds : 0;
      this.leftTime = minutes + seconds;
      this.myInterval = setInterval(() => this.ProgressBar(), 2000);
      if (this.countdown) {
        this.countdown.restart();
      }
    }*/

    goBack(stepper: MatStepper): void {
        stepper.previous();
    }

    goForward(stepper: MatStepper): void {
        //stepper.next();
        const getAnswerData = this.questionView.answers.find((b) => {
            return b.id === this.questionView.givenAnswer;
        });
        const answerData = {
            supplier_id: this.supplierId,
            survey_id: this.questionView.survey_id,
            survey_name: this.questionView.survey_name,
            stepNumber: 5,
            question: {
                id: this.questionView.id,
                value: this.questionView.question
            },
            answer: {
                id: this.questionView.givenAnswer,
                value: (getAnswerData) ? getAnswerData.value : this.questionView.givenAnswer
            }
        };

        this.removeSurveyQuestion();
        this.Api.saveSupplierSurvey(answerData).subscribe((data: any) => {
            this.findSurvey();
        });
        this.saveSupplierRegistration(this.quizStepSaveForm.value, stepper);

    }

    goForwardNext(stepper: MatStepper): void {
        //stepper.next();
        this.saveSupplierRegistration(this.quizStepSaveForm.value, stepper);
    }
    saveTermsOfPayment(stepper: MatStepper): void {
        if (this.termsOfPaymentForm.valid) {
            this.saveSupplierRegistration(this.termsOfPaymentForm.value, stepper);
        }
    }

    prefillContact(formData) {
        this.administrativeContactForm.get('administrativeContact').patchValue(formData.generalContacts);
        this.contactShippingForm.get('contactShipping').patchValue(formData.generalContacts);
        this.contactCopy = false
    }

    saveContactInformation(stepper: MatStepper): void {
        if (this.contactInformationForm.valid) {
            this.saveSupplierRegistration(this.contactInformationForm.value, stepper);
            if(this.contactCopy){
                this.prefillContact(this.contactInformationForm.value);
            }
        }
    }

    saveAdministrativeContact(stepper: MatStepper): void {
        if (this.administrativeContactForm.valid) {
            this.saveSupplierRegistration(this.administrativeContactForm.value, stepper);
        }
    }

    saveContactShipping(stepper: MatStepper): void {
        if (this.contactShippingForm.valid) {
            this.saveSupplierRegistration(this.contactShippingForm.value, stepper, 0);
        }
    }

    saveSupplierRegistration(requestData, stepper: MatStepper, redirect = 1): void {
        this.Helper.toggleLoaderVisibility(true);
        const that = this;
        that.Api.signupSupplier(requestData).pipe(takeUntil(that.destroy$)).subscribe((data) => {
            that.Helper.toggleLoaderVisibility(false);
            if (redirect) {
                stepper.next();
            } else {
                const user = data.data;
                HelperService.saveLocalStorage(user);
                //that.router.navigate(['my-account/edit-profile']);
                //that.router.navigate(['']);
                swal.fire(
                    'Info!',
                    'Grazie mille per aver completato il processo di onboarding per la collaborazione. Convalideremo la tua documentazione e ti ricontatteremo il prima possibile.',
                    'info'
                ).then(function (isConfirm) {
                    if (isConfirm) {
                        that.router.navigate(['']);
                    }
                });
            }
        }, (error) => {
            that.Helper.toggleLoaderVisibility(false);
            const e = error.error;
            swal.fire(
                'Info!',
                this.translate.instant(e.message),
                'info'
            );
        });
    }

    resetCoverValue(parameter): void {
        this.documentationForm.patchValue({
            [parameter]: null
        });
        // this.DURCUploadInput = null;
        // this.DURCUploadName = null;
    }

    openAddFieldPopup() {
        // this.dialog.open();
    }

    onKeyUp(event: any) {

    }

    ngOnDestroy(): void {
        this.destroy$.next();  // trigger the unsubscribe
        this.destroy$.complete(); // finalize & clean up the subject stream
    }

    ngAfterViewInit() {
        this.setInitialValue();
    }
    protected setInitialValue() {
        this.filteredCountries
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                //this.singleSelect.compareWith = (a: Website, b: Website) => a && b && a.id === b.id;
            });
    }

    checkAllSelected() {
        var data: any = this.supplierAgreement.forEach((b) => b == true)
        if (data) {
            return true
        }
        else {
            return false
        }
    }
    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

    changeStatus(event, index) {
        if (event.checked) {
            this.supplierAgreement[index].selected = true
        }
        else {
            this.supplierAgreement[index].selected = false
        }
    }

    // sortFunc(a, b) {
    //   return 1;
    // }

    // openChanged(isOpen: boolean) {
    //   this.atecoRecords.sort(function(x, y) {
    //     // true values first
    //     // return (x === y)? 0 : x? -1 : 1;
    //     // false values first
    //     return (x === y)? 0 : x? 1 : -1;
    //   });
    // }

    bindVATValue(event: KeyboardEvent) {
        if (this.vatCodeNumber.length < 2) {
            this.vatCodeNumber = 'IT'
        } else if (this.vatCodeNumber?.charAt(0) !== 'I') {
            this.vatCodeNumber = this.setCharAt(this.vatCodeNumber, 0, 'IT');
        } else if (this.vatCodeNumber?.charAt(1) !== 'T') {
            this.vatCodeNumber = this.setCharAt(this.vatCodeNumber, 1, 'IT');
        }
    }

    setCharAt(str, index, chr) {
        if (index > str.length - 1) return str;
        return str.substring(0, index) + chr + str.substring(index + 1);
    }
}

export function fileTypeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const fileName = control.value;
        const ext = (fileName) ? fileName.substring(fileName.lastIndexOf('.') + 1) : null;
        return (ext === 'pdf' || !fileName) ? null : { invalidFile: true };
    };

}
/*export function fileTypeValidator(control: AbstractControl) {
  let fileName = control.value;
  let ext = fileName.substring(fileName.lastIndexOf('.') + 1);
  return (ext === 'pdf') ? null : {'invalidFile': true};
}*/
