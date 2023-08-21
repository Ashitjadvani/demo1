import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HelperService} from "../../../service/helper.service";
import {ApiService} from "../../../service/api.service";
import {map, startWith, takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {fileTypeValidator} from "../../supplier-registration/supplier-registration.component";
import {MatStepper} from "@angular/material/stepper";
import swal from "sweetalert2";
import {ValidatorService} from 'angular-iban';
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {TranslateService} from "@ngx-translate/core";
import {Person} from "../../../../../../fe-common/src/lib/models/person";

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
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss'],
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
export class EditProfileComponent implements OnInit {
    selectedValue: any;
    searchTxt: any;

    getSupplierAgreement: any = {};
    administrativeContactsForm: FormGroup;
    paymentForm: FormGroup;
    documentForm: FormGroup;

    personalDetailsForm: FormGroup;
    documentationForm: FormGroup;
    termsOfPaymentForm: FormGroup;
    conditionsOfConformityForm: FormGroup;
    contactInformationForm: FormGroup;
    administrativeContactForm: FormGroup;
    contactShippingForm: FormGroup;
    adminLoginForm: FormGroup;

    selectedFile: any;
    imageType: any;

    url: any = 'assets/images/defualt-templete.png';
    empImageName: string;
    supplierId = '';
    generalContacts = [];
    administrativeContact = [];
    contactShipping = [];
    supplierAgreement = [];
    serviceMandatory = [];
    serviceIds = [];
    fileToUpload: any;
    companyBrochureName: any;
    minDate: Date;
    countryRecord = [];
    statesRecord = [];
    statesRecordFiltered = [];
    citiesRecord = [];
    citiesRecordFiltered = [];
    statesRecord2 = [];
    statesRecord2Filtered = [];
    citiesRecord2 = [];
    citiesRecord2Filtered = [];
    public countryRecord2 = [];
    public countryRecordFiltered = [];
    public countryRecord2Filtered = [];
    provList = [];
    provListRecordFiltered = [];
    provList2 = [];
    provListRecordFiltered2 = [];
    selectedCountryId: any;
    selectedCountryName: any;
    selectedStatesId: any;
    selectedCountryId2: any;
    selectedCountryName2: any;
    selectedStatesId2: any;
    selectedProv: any;
    selectedProv2: any;
    nation: FormControl = new FormControl();
    filteredOptions: Observable<string[]>;

    private destroy$ = new Subject();

    constructor(
        private _formBuilder: FormBuilder,
        private Helper: HelperService,
        private Api: ApiService,
        private translate: TranslateService,
        private _adapter: DateAdapter<any>,
    ) {
        //this.minDate =  new Date();
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + 1);
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

    documentName: string;

    changePersonalDetails() {
    }

    public empProfileImage: any;
    documentInput: any;
    documentInput2: any;
    documentName2: string = null;
    documentInput3 = null;
    documentName3 = null;
    documentInput4 = null;
    documentName4 = null;
    documentValidation = false
    documentList: any;
    atecoRecords = [];
    disableDURC = true;
    disableDURF = true;
    disableVisura = true;
    vatCodeNumber: any = 'IT';

    public paymentConditionIBAN: FormControl;

    ngOnInit(): void {
        this.paymentConditionIBAN = new FormControl(
            null,
            [
                HelperService.noWhitespaceValidator,
                ValidatorService.validateIban
            ]
        );


        this.Api.getSupplierAteco()
            .pipe(takeUntil(this.destroy$))
            .subscribe((atecoData) => {
                const atecoRecords = atecoData.records;
                this.atecoRecords = atecoRecords.map((b) => {
                    return {id: b[0], code: b[1], description: b[2]};
                });
            });

        this.personalDetailsForm = this._formBuilder.group({
            stepNumber: [1],
            supplierId: [this.supplierId],
            companyName: ['', HelperService.noWhitespaceValidator],
            // fiscalAddress: ['', HelperService.noWhitespaceValidator],
            // VATCode: ['', [HelperService.noWhitespaceValidator, Validators.pattern('^[IT]{2,2}(?=.{11,11}$)[-_ 0-9]*(?:[a-zA-Z][-_ 0-9]*){0,2}$')]],
            VATCode: ['', [HelperService.noWhitespaceValidator, Validators.pattern('^[IT]{2}([0-9]{11}$)')]],
            //fiscalCode: ['', Validators.required],
            //fiscalCode: ['',[ HelperService.noWhitespaceValidator,Validators.pattern('^([A-Za-z]{6}[lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1})$|([0-9]{11})$')]],
            //fiscalCode: ['', [HelperService.noWhitespaceValidator,Validators.pattern('^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$|([0-9]{11})$')]],
            fiscalCode: ['', [HelperService.noWhitespaceValidator, Validators.pattern('^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$|([0-9])$')]],
            duns: [''],
            pec: ['', HelperService.noWhitespaceValidator],
            atecoCode: ['', Validators.required],
            atecoCodeSearch: [''],
            address: ['', HelperService.noWhitespaceValidator],
            city: [''],
            state: [''],
            province: [''],
            nation: ['', HelperService.noWhitespaceValidator],
            ZipCode: ['', [HelperService.noWhitespaceValidator, Validators.minLength(5), Validators.pattern(/^-?([0-9]\d*)?$/)]],
            operationalAddress: ['', HelperService.noWhitespaceValidator],
            operationalCity: [''],
            operationalState: [''],
            operationalProvince: [''],
            operationalNation: ['', HelperService.noWhitespaceValidator],
            operationalZipCode: ['', [HelperService.noWhitespaceValidator, Validators.minLength(5), Validators.pattern(/^-?([0-9]\d*)?$/)]],
            edit: true
        });

        this.documentationForm = this._formBuilder.group({
            stepNumber: [2],
            DURC: ['', [fileTypeValidator()]],
            DURF: ['', [fileTypeValidator()]],
            visuraCamerale: ['', [fileTypeValidator()]],
            condizioniDocumento: ['', [fileTypeValidator()]],
            scadenzaDURC: ['', [fileTypeValidator()]],
            scadenzaDURF: ['', [fileTypeValidator()]],
            declarationDURC: [false],
            declarationDURF: [false],
            declarationChamberOfCommerce: [false],
            isDocument: true,
            edit: true
        });
        this.termsOfPaymentForm = this._formBuilder.group({
            stepNumber: [3],
            //supplierId: [this.supplierId],
            supplierId: localStorage.getItem('NPLoginId'),
            paymentConditionIBAN: this.paymentConditionIBAN,
            paymentConditionScadenzaPagamenti: ['', Validators.required],
            edit: true
        });
        this.conditionsOfConformityForm = this._formBuilder.group({
            stepNumber: [4],
            // supplierId: [this.supplierId],
            supplierId: localStorage.getItem('NPLoginId'),
            declarationsConformity1: [false],
            declarationsConformity2: [false],
            edit: true
        });
        this.contactInformationForm = this._formBuilder.group({
            stepNumber: [6],
            // supplierId: [this.supplierId],
            supplierId: localStorage.getItem('NPLoginId'),
            generalContacts: this._formBuilder.array([]),
            edit: true
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
            //supplierId: [this.supplierId],
            supplierId: localStorage.getItem('NPLoginId'),
            administrativeContact: this._formBuilder.array([]),
            edit: true
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
            //supplierId: [this.supplierId],
            supplierId: localStorage.getItem('NPLoginId'),
            contactShipping: this._formBuilder.array([]),
            edit: true
        });

        const controlContactShipping = this.contactShippingForm.get('contactShipping') as FormArray;
        controlContactShipping.push(this._formBuilder.group({
            id: [null],
            firstName: [null],
            lastName: [null],
            email: [null],
            contactNumber: [null],
        }));
        this.callEditinfo();


    }

    updateLateData(): void {
        this.Api.signupSupplierAgreement({id: this.supplierId})
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.supplierAgreement = data?.data ? data.data : null;
                if (this.supplierAgreement) {
                    this.supplierAgreement.forEach((b) => {
                        this.serviceMandatory = [...new Set(this.serviceMandatory.concat(b.mandatory))];
                        this.serviceIds.push(b.id);
                    });
                }
                // this.updateValidationDocuments();
                this.Helper.toggleLoaderVisibility(false);
            }, (error) => {
                this.Helper.toggleLoaderVisibility(false);
            });
    }

    noRequiredDURCField(event) {
        if (event.checked && this.documentName) {
            event.checked = false
        } else {
            this.disableDURC = event.checked
        }

        this.documentationForm.patchValue({
            declarationDURC: event.checked
        })
        const DURCValidation = this.serviceMandatory.find((b) => b === 'DURC');
        if (DURCValidation) {
            this.setDURCValidation()
            if (this.documentationForm.value.declarationDURC) {
                this.clearDURCValidation();
                this.clearDURCDateValidation();
            } else {
                this.setDURCValidation();
            }

            if (this.documentName) {
                this.clearDURCValidation();
            }
            if (this.documentationForm.value.scadenzaDURC) {
                this.clearDURCDateValidation();
            }
        } else {
            this.clearDURCValidation();
            this.clearDURCDateValidation();
        }
    }

    setDURCValidation() {
        this.documentationForm.get('DURC').setValidators([Validators.required, fileTypeValidator()]);
        this.documentationForm.get('DURC').updateValueAndValidity();
        this.documentationForm.get('scadenzaDURC').setValidators(Validators.required);
        this.documentationForm.get('scadenzaDURC').updateValueAndValidity();
    }

    clearDURCValidation() {
        this.documentationForm.get('DURC').clearValidators();
        this.documentationForm.get('DURC').updateValueAndValidity();
    }

    clearDURCDateValidation() {
        this.documentationForm.get('scadenzaDURC').clearValidators();
        this.documentationForm.get('scadenzaDURC').updateValueAndValidity();
    }

    noRequiredDURFField(event) {
        if (event.checked && this.documentName2) {
            event.checked = false
        } else {
            this.disableDURF = event.checked
        }


        this.documentationForm.patchValue({
            declarationDURF: event.checked
        })
        const DURFValidation = this.serviceMandatory.find((b) => b === 'DURF');

        if (DURFValidation) {
            this.setDURFValidation()
            if (this.documentationForm.value.declarationDURF) {
                this.clearDURFValidation();
                this.clearDURFDateValidation();
            } else {
                this.setDURFValidation()
            }

            if (this.documentName2) {
                this.clearDURFValidation();
            }
            if (this.documentationForm.value.scadenzaDURF) {
                this.clearDURFDateValidation();
            }
        } else {
            this.clearDURFValidation();
            this.clearDURFDateValidation();
        }
    }

    setDURFValidation() {
        this.documentationForm.get('DURF').setValidators([Validators.required, fileTypeValidator()]);
        this.documentationForm.get('DURF').updateValueAndValidity();
        this.documentationForm.get('scadenzaDURF').setValidators(Validators.required);
        this.documentationForm.get('scadenzaDURF').updateValueAndValidity();
    }

    clearDURFValidation() {
        this.documentationForm.get('DURF').clearValidators();
        this.documentationForm.get('DURF').updateValueAndValidity();

    }

    clearDURFDateValidation() {
        this.documentationForm.get('scadenzaDURF').clearValidators();
        this.documentationForm.get('scadenzaDURF').updateValueAndValidity();
    }

    noRequiredChamberOfCommerceField(event) {

        if (event.checked && this.documentName3) {
            event.checked = false
        } else {
            this.disableVisura = event.checked
        }

        this.documentationForm.patchValue({
            declarationChamberOfCommerce: event.checked
        })
        const VisuraValidation = this.serviceMandatory.find((b) => b === 'VisuraCamerale');

        if (VisuraValidation) {
            this.setValidationChamberOfCommerceField();
            if (this.documentationForm.value.declarationChamberOfCommerce) {
                this.clearValidationChamberOfCommerceField();
            } else {
                this.setValidationChamberOfCommerceField();
            }

            if (this.documentName3) {
                this.clearValidationChamberOfCommerceField();
            }
        } else {
            this.clearValidationChamberOfCommerceField();
        }


    }

    setValidationChamberOfCommerceField() {
        this.documentationForm.get('visuraCamerale').clearValidators();
        this.documentationForm.get('visuraCamerale').setValidators([Validators.required, fileTypeValidator()]);
        this.documentationForm.get('visuraCamerale').updateValueAndValidity();
    }

    clearValidationChamberOfCommerceField() {
        this.documentationForm.get('visuraCamerale').clearValidators();
        this.documentationForm.get('visuraCamerale').setValidators(fileTypeValidator());
        this.documentationForm.get('visuraCamerale').updateValueAndValidity();
    }

    async updateValidationDocuments(): Promise<void> {

        const condizioniValidation = this.serviceMandatory.find((b) => b === 'CondizioniPrestazione');
        if (condizioniValidation) {
            this.documentationForm.get('condizioniDocumento').setValidators([Validators.required, fileTypeValidator()]);
            if (this.getSupplierAgreement.condizioniFileId != "") {
                this.documentationForm.get('condizioniDocumento').setValidators(fileTypeValidator())
            } else {
                this.documentationForm.get('condizioniDocumento').setValidators([Validators.required, fileTypeValidator()]);
            }
        } else {
            this.documentationForm.get('condizioniDocumento').setValidators(fileTypeValidator());
        }
        this.documentationForm.get('condizioniDocumento').updateValueAndValidity();
    }

    callEditinfo(): void {
        this.Helper.toggleLoaderVisibility(true);
        this.Api.getEditProfile()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.getSupplierAgreement = data.data;
                this.supplierId = this.getSupplierAgreement.id;
                this.updateLateData();
                this.generalContacts = (Array.isArray(this.getSupplierAgreement.generalContacts)) ? this.getSupplierAgreement.generalContacts : [];
                this.administrativeContact = (Array.isArray(this.getSupplierAgreement.administrativeContact)) ? this.getSupplierAgreement.administrativeContact : [];
                this.contactShipping = (Array.isArray(this.getSupplierAgreement.contactShipping)) ? this.getSupplierAgreement.contactShipping : [];
                this.Api.signupSupplierDocument({supplier_id: this.supplierId})
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((dataDocument) => {
                        this.documentList = dataDocument.data;
                        const DURCFileId = this.documentList.find((b) => b.filename === 'DURCFileId');
                        if (DURCFileId) {
                            this.documentName = DURCFileId.file;
                        }
                        const DURFFileId = this.documentList.find((b) => b.filename === 'DURFFileId');
                        if (DURFFileId) {
                            this.documentName2 = DURFFileId.file;
                        }

                        const visuraCameraleFileId = this.documentList.find((b) => b.filename === 'visuraCameraleFileId');
                        if (visuraCameraleFileId) {
                            this.documentName3 = visuraCameraleFileId.file;
                        }

                        const condizioniFileId = this.documentList.find((b) => b.filename === 'condizioniFileId');
                        if (condizioniFileId) {
                            this.documentName4 = condizioniFileId.file;
                        }

                        const ComBrochureFileId = this.documentList.find((b) => b.filename === 'companyBroucher');
                        if (ComBrochureFileId) {
                            this.companyBrochureName = ComBrochureFileId.file;
                        }
                    });

                this.Api.getCountryList().subscribe((data) => {
                    this.countryRecord = data.data;
                    this.countryRecord2 = data.data;
                    this.countryRecordFiltered = this.countryRecord.slice();
                    this.countryRecord2Filtered = this.countryRecord.slice();
                    this.filteredOptions = this.nation.valueChanges.pipe(
                        startWith(''),
                        map(value => this._filter(value)),
                    );
                    this.selecedCountryFunction(this.getSupplierAgreement.nation);
                    this.selectedStateFunction(this.getSupplierAgreement.nation, this.getSupplierAgreement.state);
                    this.selecedCountryFunction2(this.getSupplierAgreement.operationalNation);
                    this.selectedStateFunction2(this.getSupplierAgreement.operationalNation, this.getSupplierAgreement.operationalState);
                    this.selectedProvinceFunction(this.getSupplierAgreement.nation, this.getSupplierAgreement.state, this.getSupplierAgreement.province);
                    this.selectedProvinceFunction2(this.getSupplierAgreement.operationalNation, this.getSupplierAgreement.operationalState, this.getSupplierAgreement.operationalProvince);
                });

                if (Array.isArray(this.getSupplierAgreement.survey) && this.getSupplierAgreement.survey.length > 0) {
                    this.Api.signupSupplierSurvey({survey: this.getSupplierAgreement.survey})
                        .pipe(takeUntil(this.destroy$))
                        .subscribe((dataSurvey) => {
                            // this.supplierSurvey = dataSurvey.data;
                        }, (err) => {
                        });
                }
                const controlContactInformation = this.contactInformationForm.get('generalContacts') as FormArray;
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

                const controlAdministrativeContact = this.administrativeContactForm.get('administrativeContact') as FormArray;
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

                const controlContactShipping = this.contactShippingForm.get('contactShipping') as FormArray;
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

                if (this.getSupplierAgreement) {
                    let VATcode = this.getSupplierAgreement.VATCode;
                    let character = VATcode?.charAt(0) + VATcode?.charAt(1);
                    character === 'IT' ? this.vatCodeNumber = this.getSupplierAgreement.VATCode : this.vatCodeNumber = 'IT'
                    this.personalDetailsForm.patchValue({
                        supplierId: this.supplierId,
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
                        state: this.getSupplierAgreement.state,
                        province: this.getSupplierAgreement.province,
                        nation: this.getSupplierAgreement.nation,
                        operationalAddress: this.getSupplierAgreement.operationalAddress,
                        operationalCity: this.getSupplierAgreement.operationalCity,
                        operationalState: this.getSupplierAgreement.operationalState,
                        operationalProvince: this.getSupplierAgreement.operationalProvince,
                        operationalNation: this.getSupplierAgreement.operationalNation,
                        operationalZipCode: this.getSupplierAgreement.operationalZipCode,
                    });

                    this.termsOfPaymentForm.patchValue({
                        supplierId: this.supplierId,
                        paymentConditionIBAN: this.getSupplierAgreement.paymentConditionIBAN,
                        paymentConditionScadenzaPagamenti: this.getSupplierAgreement.paymentConditionScadenzaPagamenti,
                    });

                    this.termsOfPaymentForm.patchValue({
                        supplierId: this.supplierId,
                        paymentConditionIBAN: this.getSupplierAgreement.paymentConditionIBAN,
                        paymentConditionScadenzaPagamenti: this.getSupplierAgreement.paymentConditionScadenzaPagamenti,
                    });


                    this.conditionsOfConformityForm = this._formBuilder.group({
                        supplierId: this.supplierId,
                        declarationsConformity1: this.getSupplierAgreement.declarationsConformity1,
                        declarationsConformity2: this.getSupplierAgreement.declarationsConformity2,
                    });
                    this.documentationForm.patchValue({
                        supplierId: this.supplierId,
                        // DURC: this.documentName,
                        // DURF: this.documentName2,
                        // DURC: this.getSupplierAgreement.DURCFileId,
                        // DURF: this.getSupplierAgreement.DURFFileId,
                        scadenzaDURC: this.getSupplierAgreement.scadenzaDURC,
                        scadenzaDURF: this.getSupplierAgreement.scadenzaDURF,
                        declarationDURC: this.getSupplierAgreement.declarationDURC,
                        declarationDURF: this.getSupplierAgreement.declarationDURF,
                        declarationChamberOfCommerce: this.getSupplierAgreement.declarationChamberOfCommerce,
                        isDocument: true
                    });

                    setTimeout(() => {
                        this.noRequiredDURCField({checked: this.documentationForm.value.declarationDURC})
                        this.noRequiredDURFField({checked: this.documentationForm.value.declarationDURF})
                        this.noRequiredChamberOfCommerceField({checked: this.documentationForm.value.declarationChamberOfCommerce})

                    }, 500);


                }
                this.Helper.toggleLoaderVisibility(false);
            }, (error) => {
                this.Helper.toggleLoaderVisibility(false);
            });
    }

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

    onFileChanged(input: HTMLInputElement, number: number): void {
        if (input.files.length > 0) {

            if (number === 1) {
                const file = input.files[0];
                this.documentInput = file;
                this.documentName = `${file.name} (${this.formatBytes(file.size)})`;
                this.noRequiredDURCField({checked: this.documentationForm.value.declarationDURC})
            } else if (number === 2) {
                const file = input.files[0];
                this.documentInput2 = file;
                this.documentName2 = `${file.name} (${this.formatBytes(file.size)})`;
                this.noRequiredDURFField({checked: this.documentationForm.value.declarationDURF})
            } else if (number === 3) {
                const file = input.files[0];
                this.documentInput3 = file;
                this.documentName3 = `${file.name} (${this.formatBytes(file.size)})`;
                this.noRequiredChamberOfCommerceField({checked: this.documentationForm.value.declarationChamberOfCommerce})

            } else if (number === 4) {
                const file = input.files[0];
                this.documentInput4 = file;
                this.documentName4 = `${file.name} (${this.formatBytes(file.size)})`;
            }
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

    resetCoverValue(parameter): void {
        if (parameter == 'DURC') {
            this.noRequiredDURCField({checked: this.documentationForm.value.declarationDURC})
        }
        if (parameter == 'DURF') {
            this.noRequiredDURFField({checked: this.documentationForm.value.declarationDURF})
        }
        if (parameter == 'visuraCamerale') {
            this.noRequiredChamberOfCommerceField({checked: this.documentationForm.value.declarationChamberOfCommerce})
        }
        this.documentationForm.patchValue({
            [parameter]: ""
        });
    }

    savePersonalData(): void {
        if (this.personalDetailsForm.valid) {
            this.uplodeFile(this.fileToUpload).then((fileId) => {
                if (this.fileToUpload == null && !this.companyBrochureName) {
                    this.personalDetailsForm.value.companyBroucher = null;
                }
                if (this.fileToUpload) {
                    this.personalDetailsForm.value.companyBroucher = fileId;
                }
                // this.fileToUpload = null
                this.saveSupplierRegistration(this.personalDetailsForm.value);
                //this.updateSupplierRegistration(this.personalDetailsForm.value);
                // swal.fire(
                //   'Info',
                //   'Save successfully!',
                //   'success'
                // );
            });
        }
    }

    saveContactInformation(): void {
        if (this.contactInformationForm.valid) {
            this.saveSupplierRegistration(this.contactInformationForm.value);
            // swal.fire(
            //   'Info',
            //   'Save successfully!',
            //   'success'
            // );
        }
    }

    saveAdministrativeContact(): void {
        if (this.administrativeContactForm.valid) {
            this.saveSupplierRegistration(this.administrativeContactForm.value);
            // swal.fire(
            //   'Info',
            //   'Save successfully!',
            //   'success'
            // );
        }
    }

    saveContactShipping(): void {
        if (this.contactShippingForm.valid) {
            this.saveSupplierRegistration(this.contactShippingForm.value);
            // swal.fire(
            //   'Info',
            //   'Save successfully!',
            //   'success'
            // );
        }
    }

    saveTermsOfPayment(): void {
        if (this.termsOfPaymentForm.valid) {
            this.saveSupplierRegistration(this.termsOfPaymentForm.value);
            // swal.fire(
            //   'Info',
            //   'Save successfully!',
            //   'success'
            // );
        }
    }

    saveSupplierRegistration(requestData): void {
        this.Helper.toggleLoaderVisibility(true);
        this.Api.signupSupplier(requestData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.Helper.toggleLoaderVisibility(false);
                // const user = data.data;
                swal.fire(
                    '',
                    this.translate.instant(data.meta.message),
                    'success'
                ).then(res => {
                    if (this.documentValidation == false) {
                        // setTimeout(() => {
                        this.callEditinfo();
                        // }, 200);
                    }
                });
            }, (error) => {
                this.Helper.toggleLoaderVisibility(false);
                const e = error.error;
                swal.fire(
                    'Info!',
                    e.message,
                    'info'
                );
            });
    }

    updateSupplierRegistration(requestData): void {
        this.Helper.toggleLoaderVisibility(true);
        this.Api.updateSignupSupplier(requestData)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.Helper.toggleLoaderVisibility(false);
                // const user = data.data;
                swal.fire(
                    '',
                    this.translate.instant(data.meta.message),
                    'success');
            }, (error) => {
                this.Helper.toggleLoaderVisibility(false);
                const e = error.error;
                swal.fire(
                    'Info!',
                    e.message,
                    'info'
                );
            });
    }

    async saveDocumentation(): Promise<void> {
        this.documentValidation = true;
        await this.checkFormValid();

    }

    async checkFormValid(): Promise<void> {
        if (this.documentationForm.status == "VALID") {
            this.Helper.toggleLoaderVisibility(true);
            this.Api.uploadSupplierFiles(this.documentInput, this.documentInput2, this.documentInput3, this.documentInput4, null).subscribe((data: any) => {
                // this.Helper.toggleLoaderVisibility(false);
                const fileDocument = (data) ? Object.assign.apply({}, data) : {};
                if (this.documentName == null) {
                    fileDocument.DURCFileId = ''
                }
                if (this.documentName2 == null) {
                    fileDocument.DURFFileId = ''
                }
                if (this.documentName3 == null) {
                    fileDocument.visuraCameraleFileId = ''
                }
                if (this.documentName4 == null) {
                    fileDocument.condizioniFileId = ''
                }
                fileDocument.supplierId = this.supplierId;
                // fileDocument.scadenzaDURC = '';
                fileDocument.scadenzaDURC = this.documentationForm.value.scadenzaDURC;
                fileDocument.scadenzaDURF = this.documentationForm.value.scadenzaDURF;
                fileDocument.declarationDURC = this.documentationForm.value.declarationDURC;
                fileDocument.declarationDURF = this.documentationForm.value.declarationDURF;
                fileDocument.declarationChamberOfCommerce = this.documentationForm.value.declarationChamberOfCommerce;
                fileDocument.isDocument = true;
                fileDocument.edit = true;
                fileDocument.stepNumber = 2;
                this.saveSupplierRegistration(fileDocument);
                this.documentValidation = false;
                // swal.fire(
                //   'Info',
                //   'Save successfully!',
                //   'success'
                // );
            }, (err) => {
                // this.Helper.toggleLoaderVisibility(false);
            });
        }
        // if(this.documentValidation == false){
        //   setTimeout(() => {
        //     this.callEditinfo();
        //   }, 200);
        // }
    }

    ngOnDestroy(): void {
        this.destroy$.next();  // trigger the unsubscribe
        this.destroy$.complete(); // finalize & clean up the subject stream
    }

    onFileUpload(input: HTMLInputElement): void {
        if (input.files?.length > 0) {
            if (input.files[0]?.type === 'application/pdf') {
                this.fileToUpload = input.files[0];
                this.documentInput = this.fileToUpload;
                this.companyBrochureName = `${this.fileToUpload.name} (${this.formatBytes(this.fileToUpload.size)})`;
            } else {
                swal.fire(
                    'Info!',
                    'Please upload the PDF file!',
                    'info'
                );
            }
        }
    }

    uplodeFile(fileToUpload): any {
        return new Promise((resolve, reject) => {
            if (fileToUpload) {
                const formData: FormData = new FormData();
                formData.append('file', fileToUpload);
                this.Api.uploadFile(formData).subscribe((data: any) => {
                    resolve(data.fileId);
                }, (error) => {
                    resolve(null);
                });
            } else {
                resolve(null);
            }
        });
    }


    resetFileUpload(): void {
        this.documentInput = null;
        this.companyBrochureName = null;
        this.fileToUpload = null
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

    changeCountry(countryName) {
        this.statesRecord = [];
        this.citiesRecord = [];
        this.personalDetailsForm.get('state').reset();
        this.personalDetailsForm.get('city').reset();
        this.selecedCountryFunction(countryName);
    }

    changeState(stateName) {
        const stateData = this.statesRecord;
        for (let i = 0; i < stateData.length; i++) {
            if (stateData[i].id == stateName) {
                this.selectedStatesId = stateData[i].id;
                this.Api.getSelectedProvince({id: stateName}).subscribe((data) => {
                    this.provList = data.data;
                    this.provListRecordFiltered = this.provList.slice();
                });
            }
        }
    }


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
                this.Api.getSelectedProvince({id: stateName}).subscribe((data) => {
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
                this.Api.getCitiesList({province: provinceName}).subscribe((data) => {
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
                this.Api.getCitiesList({province: provinceName}).subscribe((data) => {
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
                this.Api.getStatesList({countryID: this.selectedCountryId}).subscribe((data) => {
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
                this.Api.getStatesList({countryID: this.selectedCountryId}).subscribe((data) => {
                    this.statesRecord = data.data;
                    const stateData = this.statesRecord;
                    for (let i = 0; i < stateData.length; i++) {
                        if (stateData[i].id == selectedState) {
                            this.selectedStatesId = stateData[i].id;
                            this.Api.getSelectedProvince({id: this.selectedStatesId}).subscribe((data) => {
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
                this.Api.getStatesList({countryID: this.selectedCountryId}).subscribe((data) => {
                    this.statesRecord = data.data;
                    const stateData = this.statesRecord;
                    for (let i = 0; i < stateData.length; i++) {
                        if (stateData[i].id == selectedState) {
                            this.selectedStatesId = stateData[i].id;
                            this.Api.getSelectedProvince({id: this.selectedStatesId}).subscribe((data) => {
                                this.provList = data.data;
                                this.provListRecordFiltered = this.provList.slice();
                                const selectedProvinceData = this.provList;
                                for (let i = 0; i < selectedProvinceData.length; i++) {
                                    if (selectedProvinceData[i] == selectedProvince) {
                                        this.selectedProv = selectedProvinceData[i]
                                        this.Api.getCitiesList({province: this.selectedProv}).subscribe((data) => {
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
                this.Api.getStatesList({countryID: this.selectedCountryId2}).subscribe((data) => {
                    this.statesRecord2 = data.data;
                    this.statesRecord2Filtered = this.statesRecord2.slice();
                });
            }
        }
    }

    async selectedStateFunction2(selectedCountry, selectedState) {
        const countryData = this.countryRecord;
        for (let i = 0; i < countryData.length; i++) {
            if (countryData[i].id == selectedCountry) {
                this.selectedCountryId = countryData[i].id;
                this.Api.getStatesList({countryID: this.selectedCountryId}).subscribe((data) => {
                    this.statesRecord2 = data.data;
                    const stateData = this.statesRecord2;
                    for (let i = 0; i < stateData.length; i++) {
                        if (stateData[i].id == selectedState) {
                            this.selectedStatesId2 = stateData[i].id;
                            this.Api.getSelectedProvince({id: this.selectedStatesId2}).subscribe((data) => {
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
                this.Api.getStatesList({countryID: this.selectedCountryId2}).subscribe((data) => {
                    this.statesRecord2 = data.data;
                    const stateData = this.statesRecord2;
                    for (let i = 0; i < stateData.length; i++) {
                        if (stateData[i].id == selectedState) {

                            this.selectedStatesId2 = stateData[i].id;
                            this.Api.getSelectedProvince({id: this.selectedStatesId2}).subscribe((data) => {
                                this.provList2 = data.data;
                                this.provListRecordFiltered2 = this.provList2.slice();
                                const selectedProvinceData = this.provList2;
                                for (let i = 0; i < selectedProvinceData.length; i++) {
                                    if (selectedProvinceData[i] == selectedProvince) {

                                        this.selectedProv2 = selectedProvinceData[i]
                                        this.Api.getCitiesList({province: this.selectedProv2}).subscribe((data) => {
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

    triggerEvent(event, matFilter: any) {
        if (event === false) {
            // matFilter.searchForm.reset();
            // matFilter.searchForm.value.value = '';
        }
    }

    streamOpened() {
        if (localStorage.getItem('currentLanguage') == 'it') {
            this._adapter.setLocale('it-IT');
        } else {
            this._adapter.setLocale('eg-EG');
        }
    }

}
