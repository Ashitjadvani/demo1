import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AddFieldPopupComponent} from '../../../popups/add-field-popup/add-field-popup.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NSApiService} from '../../../service/NSApi.service';
import {HelperService} from '../../../../../../fe-procurement/src/app/service/helper.service';
import swal from "sweetalert2";
import {DBApiService} from "../../../service/dbapi.service";
import {element} from "protractor";
import {NSHelperService} from "../../../service/NSHelper.service";

export interface PeriodicElement {
    title: string;
    status: boolean;

}

@Component({
    selector: 'app-add-edit-client',
    templateUrl: './add-edit-client.component.html',
    styleUrls: ['./add-edit-client.component.scss'],
})
export class AddEditClientComponent implements OnInit {
    companyInformationForm: FormGroup;
    contactInformationForm: FormGroup;
    domainConfigurationForm: FormGroup;
    featuresForm: FormGroup;
    adminLoginForm: FormGroup;
    public files: any;
    documentData: any;
    document: any;
    editMode = 'Add';
    documentInput: any;
    documentInputWhite: any;
    documentName: any;
    documentNameWhite: any;
    isLinear: boolean = true;
    clientId: any;
    contact_info = [];
    fileToUpload: any;
    fileToUploadWhite: any;
    selectedFile: any;
    empImageName: any;
    url: any = "";
    uploadLogo: any;
    urlId: any;
    filterText: any;
    public ctrlColors = [
        {color: '#782B90'}
    ];

    contactTypes = [];

    displayedColumns: string[] = ['title', 'status'];
    dataSource = [];
    dataSourceMain = [];
    companyFeaturesArray = [];

    constructor(
        private _formBuilder: FormBuilder,
        public dialog: MatDialog,
        private router: Router,
        public route: ActivatedRoute,
        private APIservice: NSApiService,
        private DBApiService: DBApiService,
        public helper: NSHelperService
    ) {
    }

    ngOnInit(): void {
        this.getContactTypeData();
        this.files = [];
        const id = this.route.snapshot.paramMap.get('id');
        this.urlId = this.route.snapshot.paramMap.get('id');
        this.clientId = id;
        this.companyInformationForm = this._formBuilder.group({
            id: [],
            company_name: ['', Validators.required],
            company_address: ['', Validators.required],
            city: ['', Validators.required],
            cap: ['', Validators.required],
            vat: ['', Validators.required],
            brand_color: ['', Validators.required],
            tenant_type: ['', Validators.required],
            tva: ['', Validators.required],
            company_website: ['', Validators.required],
            applicationDesign: ['', Validators.required],
            company_logo: [''],
            company_logo_white: [''],
            step: '1'
        });
        this.contactInformationForm = this._formBuilder.group({
            id: [this.clientId],
            contact_name: [null],
            contact_type: [null],
            phone_no: [null],
            email: [null],
            contact_info: this._formBuilder.array([]),
            step: "2"
        });
        this.domainConfigurationForm = this._formBuilder.group({
            id: [this.clientId],
            mcp: [''],
            landing_page: [''],
            touchpoint: [''],
            companion_app: [''],
            moduloRecruiting: [''],
            moduloProcurement: [''],
            baseApiUrl: [''],
            coustom_field: this._formBuilder.array([]),
            step: "3"
        });
        this.adminLoginForm = this._formBuilder.group({
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            force_to_reset_password: [false, Validators.required],
        });
        this.APIservice.getFeaturesList('').subscribe((data: any) => {
            this.dataSource = data.data;
            this.dataSourceMain = this.dataSource;
        });

        if (id != '0') {
            this.helper.toggleLoaderVisibility(true);
            this.editMode = 'Edit';
            //   this.isLinear = false;
            this.APIservice.editClient({id: id}).subscribe((data: any) => {
                this.helper.toggleLoaderVisibility(false);
                const documentData = data.data;

                // Contact-Information Edit Form patch value
                const editControlContactInformation = this.contactInformationForm.get('contact_info') as FormArray;
                for (let i = 0; i < documentData.contact_info.length; i++) {
                    editControlContactInformation.push(this._formBuilder.group({
                        contact_type: documentData.contact_info[i].contact_type,
                        contact_name: documentData.contact_info[i].contact_name,
                        phone_no: documentData.contact_info[i].phone_no,
                        email: documentData.contact_info[i].email
                    }));
                }

                this.companyInformationForm.patchValue({
                    id: documentData.id,
                    company_name: documentData.company_name,
                    company_address: documentData.company_address,
                    city: documentData.city,
                    cap: documentData.cap,
                    vat: documentData.vat,
                    brand_color: documentData.brand_color,
                    applicationDesign: documentData.applicationDesign,
                    tenant_type: documentData.tenant_type,
                    tva: documentData.tva,
                    company_website: documentData.company_website,
                    company_logo: documentData.company_logo,
                    company_logo_white: documentData.company_logo_white,
                    contact_info: documentData.contact_info,
                    step: '1'
                });
                this.domainConfigurationForm.patchValue({
                    mcp: documentData.domain_configuration.mcp,
                    landing_page: documentData.domain_configuration.landing_page,
                    touchpoint: documentData.domain_configuration.touchpoint,
                    companion_app: documentData.domain_configuration.companion_app,
                    moduloRecruiting: documentData.domain_configuration.moduloRecruiting,
                    moduloProcurement: documentData.domain_configuration.moduloProcurement,
                    baseApiUrl: documentData.domain_configuration.baseApiUrl,
                    coustom_field: documentData.domain_configuration.coustom_field
                });
                this.adminLoginForm.patchValue({
                    name: documentData.company_admin.name,
                    lastName: documentData.company_admin.lastName,
                    username: documentData.company_admin.username,
                    password: '',
                    force_to_reset_password: documentData.company_admin.force_to_reset_password,
                })
                this.APIservice.imageDetails({id: documentData.company_logo}).subscribe((data: any) => {
                    this.documentName = data.data?.file;
                });
                this.APIservice.imageDetails({id: documentData.company_logo_white}).subscribe((data: any) => {
                    this.documentNameWhite = data.data?.file;
                });
                if (documentData.domain_configuration.coustom_field != null && documentData.domain_configuration.coustom_field.length !== 0) {
                    documentData.domain_configuration.coustom_field.forEach((b: any) => {
                        this.coustom_field.push(this._formBuilder.group({
                            title: [b.title],
                            titlevalue: [b.titlevalue]
                        }));
                    });
                }
                this.dataSource.forEach(element => {
                    var featuresSavedData = documentData.company_features;
                    featuresSavedData.forEach(featuesTrue => {
                        if (element.id == featuesTrue.featureId) {
                            element.status = featuesTrue.status
                        }
                    })
                });
            });
        } else {
            const controlContactInformation = this.contactInformationForm.get('contact_info') as FormArray;
            controlContactInformation.push(this._formBuilder.group({
                contact_type: ['', Validators.required],
                contact_name: ['', Validators.required],
                phone_no: [null, Validators.required],
                email: ['', [Validators.required, Validators.email]],
            }));
        }

    }

    getContactTypeData(): any {
        this.APIservice.contactType({}).subscribe((res: any) => {
            if (res.statusCode === 200) {
                this.contactTypes = res.data;
            }
        });
    }

    get coustom_field(): FormArray {
        return this.domainConfigurationForm.get('coustom_field') as FormArray;
    }

    onFileChanged(input: HTMLInputElement): void {
        function formatBytes(bytes: number): string {
            const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const factor = 1024;
            let index = 0;
            while (bytes >= factor) {
                bytes /= factor;
                index++;
            }
            return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
        }

        const file = input.files[0];
        this.fileToUpload = input.files[0];
        this.documentInput = file;
        this.documentName = `${file.name} (${formatBytes(file.size)})`;
    }

    onFileChangedWhite(input: HTMLInputElement): void {

        function formatBytes(bytes: number): string {
            const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const factor = 1024;
            let index = 0;
            while (bytes >= factor) {
                bytes /= factor;
                index++;
            }
            return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
        }

        const whiteFile = input.files[0];
        console.log('input', input);
        console.log(whiteFile);

        this.fileToUploadWhite = input.files[0];
        console.log('fileToUploadWhite', this.fileToUploadWhite);

        this.documentInputWhite = whiteFile;
        console.log('fileToUploadWhite', this.documentInputWhite);
        this.documentNameWhite = `${whiteFile.name} (${formatBytes(whiteFile.size)})`;
        console.log('fileToUploadWhite', this.documentNameWhite);
    }

    resetCoverValue() {
        this.documentInput = null;
        this.documentName = null;
    }

    resetCoverValueWhite() {
        this.documentInputWhite = null;
        this.documentNameWhite = null;
    }

    createItem(data: any): FormGroup {
        return this._formBuilder.group({
            title: [data],
            titlevalue: ''
        });
    }

    openAddFieldPopup() {
        const dialogRef = this.dialog.open(AddFieldPopupComponent, {
            width: '648px'
        });
        dialogRef.afterClosed().subscribe(result => {
            this.coustom_field.push(this.createItem(result.data));
        });
    }

    applyFilter(filterValue: any) {
        filterValue = filterValue.trim().toLowerCase();
        if (filterValue != "") {
            this.dataSource = this.dataSourceMain.filter(o => o.name.toLowerCase().includes(filterValue));
        } else {
            this.dataSource = this.dataSourceMain;
        }
    }

    async saveCompanyInformation(): Promise<void> {
        if (this.fileToUpload || this.fileToUploadWhite) {
            await this.companyFileUploadFunc();
        } else {
            await this.companyInfoFunc();
        }
    }

    async companyFileUploadFunc(): Promise<void> {
        const formData: FormData = new FormData();
        const formDataWhite: FormData = new FormData();
        if (this.fileToUpload || this.fileToUploadWhite) {
            formData.append('file', this.fileToUpload);
            formDataWhite.append('file', this.fileToUploadWhite);
            this.APIservice.updateProfileImg(formData).subscribe((data: any) => {
                this.uploadLogo = data.fileId
                console.log('uploaddddd', this.uploadLogo);
                this.companyInformationForm.patchValue({company_logo: this.uploadLogo});
                this.companyInfoFunc();
            });
            this.APIservice.updateProfileImg(formDataWhite).subscribe((data: any) => {
                this.uploadLogo = data.fileId
                this.companyInformationForm.patchValue({company_logo_white: data.fileId});
                this.companyInfoFunc();
            });
        }
    }

    async companyInfoFunc(): Promise<void> {
        if (this.companyInformationForm.valid) {
            const companyData = this.companyInformationForm.value;
            if (this.clientId !== '0') {

                this.APIservice.addClient(companyData).subscribe((data: any) => {
                    this.contact_info = (Array.isArray(data.data.contact_info)) ? data.data.contact_info : [];
                    const controlContactInformation = this.contactInformationForm.get('contact_info') as FormArray;
                    if (this.contact_info.length > 0) {
                        controlContactInformation.clear();
                        this.contact_info.forEach((b) => {
                            controlContactInformation.push(this._formBuilder.group({
                                contact_type: [b.contact_type, Validators.required],
                                contact_name: [b.contact_name, Validators.required],
                                phone_no: [b.phone_no, Validators.required],
                                email: [b.email, [Validators.required, Validators.email]],
                            }));
                        });
                    }
                });
            } else {
                delete companyData.id;
                this.APIservice.addClient(companyData).subscribe((data: any) => {
                    this.clientId = data?.data && data.data?.id ? data.data?.id : '0';
                    this.contactInformationForm.patchValue({
                        id: this.clientId
                    });
                });
            }
        }
    }

    saveContactInformation(): void {
        const contactData = {
            id: this.contactInformationForm.value.id,
            contact_info: this.contactInformationForm.value.contact_info,
            step: this.contactInformationForm.value.step
        };
        if (this.contactInformationForm.valid) {
            this.APIservice.addClient(contactData).subscribe((data: any) => {
            });
        }
    }

    get formContactInformationArr(): any {
        return this.contactInformationForm.get('contact_info') as FormArray;
    }

    addContactInformationRow(): void {
        this.formContactInformationArr.push(this.initContactInformationRows());
    }

    deleteContactInformationRow(index: number): void {
        this.formContactInformationArr.removeAt(index);
    }

    initContactInformationRows(): any {
        return this._formBuilder.group({
            contact_type: ['', Validators.required],
            contact_name: ['', Validators.required],
            phone_no: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
        });
    }

    submitDomainConfigurationForm(): void {
        const contactData = {
            id: this.clientId,
            domain_configuration: {
                mcp: this.domainConfigurationForm.value.mcp,
                landing_page: this.domainConfigurationForm.value.landing_page,
                touchpoint: this.domainConfigurationForm.value.touchpoint,
                companion_app: this.domainConfigurationForm.value.companion_app,
                moduloRecruiting: this.domainConfigurationForm.value.moduloRecruiting,
                moduloProcurement: this.domainConfigurationForm.value.moduloProcurement,
                baseApiUrl: this.domainConfigurationForm.value.baseApiUrl,
                coustom_field: this.domainConfigurationForm.value.coustom_field,
            },
            step: this.domainConfigurationForm.value.step
        };
        if (this.domainConfigurationForm.valid) {
            this.APIservice.addClient(contactData).subscribe((data: any) => {
            });
        }
    }

    removeFields(i: any): any {
        this.coustom_field.removeAt(i);
    }

    featuresFormSubmit(): void {
        this.companyFeaturesArray = [];
        for (let i = 0; i < this.dataSource.length; i++) {
            this.companyFeaturesArray.push({
                featureId: this.dataSource[i].id,
                status: this.dataSource[i].status === true ? true : false
            })
        }
        const featuresData = {
            id: this.clientId,
            company_features: this.companyFeaturesArray,
            step: "4"
        }
        this.APIservice.addClient(featuresData).subscribe((data: any) => {
        });
    }

    submitAdminLoginForm(): void {
        const adminLoginData = {
            id: this.clientId,
            company_admin: {
                name: this.adminLoginForm.value.name,
                lastName: this.adminLoginForm.value.lastName,
                username: this.adminLoginForm.value.username,
                password: this.adminLoginForm.value.password,
                force_to_reset_password: this.adminLoginForm.value.force_to_reset_password
            },
            step: "5"
        }
        if (this.adminLoginForm.valid) {
            this.APIservice.addClient(adminLoginData).subscribe((data: any) => {
                if (data.statusCode === 200) {
                    if (this.urlId != 0) {
                        swal.fire(
                            '',
                            'Client Management edited successfully!',
                            'success'
                        )
                    } else {
                        swal.fire(
                            '',
                            'Client Management added successfully!',
                            'success'
                        )
                    }
                    this.router.navigate(['client-management']);
                }
            });
        }
    }
}
