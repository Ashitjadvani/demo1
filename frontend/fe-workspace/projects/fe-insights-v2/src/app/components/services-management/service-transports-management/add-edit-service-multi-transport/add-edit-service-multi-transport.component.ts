import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServiceTransport, ServiceTransportEntry, SERVICE_REPOSITORY, TRANSPORT_REQUEST_TYPE, TRANSPORT_REQUEST_TYPE_ITEMS } from 'projects/fe-common-v2/src/lib/models/services/models';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { DataRepositoryManagementService } from 'projects/fe-common-v2/src/lib/services/data-repository-management.service';
import { ResourceManagementService } from 'projects/fe-common-v2/src/lib/services/resource-management.service';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import { v4 as uuidv4 } from 'uuid';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AddEditServiceTransportItemComponent } from 'projects/fe-insights-v2/src/app/popup/add-edit-service-transport-item/add-edit-service-transport-item.component';

enum WHEELCHAIR_TYPE {
    MANUAL,
    ELETRIC,
    NOT_NEEDED,
    NEEDED
}

enum TABLE_COLUMN_REF {
    DATE,
    USER,
    FROM,
    TO
}

class ArrayValidators {
    // max length
    public static maxLength(max: number): ValidatorFn | any {
        return (control: AbstractControl[]) => {
            if (!(control instanceof FormArray)) return;
            return control.length > max ? { maxLength: true } : null;
        }
    }

    // min length
    public static minLength(min: number): ValidatorFn | any {
        return (control: AbstractControl[]) => {
            if (!(control instanceof FormArray)) return;
            return control.length < min ? { minLength: true } : null;
        }
    }
}

@Component({
    selector: 'app-add-edit-service-multi-transport',
    templateUrl: './add-edit-service-multi-transport.component.html',
    styleUrls: ['./add-edit-service-multi-transport.component.scss']
})
export class AddEditServiceMultiTransportComponent implements OnInit {
    transportRequestType = TRANSPORT_REQUEST_TYPE_ITEMS;
    TABLE_COLUMN_REF = TABLE_COLUMN_REF;

    physicalStatus: string[] = [
        'Deambulante',
        'Deambulante con supporto',
        'Non deambulante'
    ]

    provList: string[] = [
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
    ];

    genderList: any[] = [
        { value: "Not Specified", viewValue: "Not Specified" },
        { value: "Male", viewValue: "Male" },
        { value: "Female", viewValue: "Female" }
    ];

    acceptItems: string[] = [
        'L\'assistito dovrà trovarsi in prossimità del punto di arrivo del mezzo di trasporto',
        'L\'eventuale disdetta del trasporto deve essere comunicata a UILDM sezione di Legnano entro le 24 ore precedenti al momento dell\'appuntamento',
        'La conferma del servizio e relativo appuntamento saranno comunicate al richiedente dopo aver appurato dal disponibilità del mezzo e dell\'autista'
    ];

    wheelchairTypes: any[] = [
        { value: WHEELCHAIR_TYPE.MANUAL, text: 'Si, manuale' },
        { value: WHEELCHAIR_TYPE.ELETRIC, text: 'Si, elettrica' },
        { value: WHEELCHAIR_TYPE.NOT_NEEDED, text: 'Non serve' },
        { value: WHEELCHAIR_TYPE.NEEDED, text: 'Necessita di carrozina' }
    ];

    transportRequestFormS1: FormGroup;
    transportRequestFormS2: FormGroup;
    transportRequestFormS3: FormGroup;

    showRequester: boolean = false;
    currentServiceTransportId: string;

    serviceTransport: ServiceTransport = ServiceTransport.Empty();

    transportPersons: ServiceTransportEntry[] = [];
    transportPersonsColumns: string[] = ['wheelAction', 'date', 'user', 'from', 'to'];

    constructor(private formBuilder: FormBuilder,
        private resourceManagementService: ResourceManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private translate: TranslateService,
        private dataRepositoryManagementService: DataRepositoryManagementService,
        private commonService: CommonService) {

        this.transportRequestFormS1 = this.formBuilder.group({
            requester: ['', Validators.required],
            requesterName: [''],
            requesterSurname: [''],
            requesterPhone: ['']
        });

        this.transportRequestFormS2 = this.formBuilder.group({
            accept1: ['', Validators.requiredTrue],
            accept2: ['', Validators.requiredTrue],
            accept3: ['', Validators.requiredTrue],
            wheelchairType: ['', Validators.required]
        });

        this.transportRequestFormS3 = new FormGroup({
            listTransportPersons: new FormArray([], ArrayValidators.minLength(1))
        });
        this.transportRequestFormS3.setValue({ listTransportPersons: [] });

    }

    ngOnInit(): void {
        this.currentServiceTransportId = this.route.snapshot.paramMap.get('id');
        if (this.currentServiceTransportId != '0') {
            this.dataRepositoryManagementService.getDataRepositorySingleEntry(SERVICE_REPOSITORY.TRANSPORTS, this.currentServiceTransportId).then((response) => {
                if (response.result) {
                    this.transportRequestFormS1.patchValue(response.data.entityObject);
                    this.transportRequestFormS2.patchValue(response.data.entityObject);

                    this.serviceTransport = response.data.entityObject;
                    this.serviceTransport.transportEntries.forEach(it => this.updatePersonFormArray(true));
                }
            })
        }
    }

    onRequesterChange($event) {
        this.showRequester = (this.transportRequestFormS1.controls.requester.value != TRANSPORT_REQUEST_TYPE.PRIVATE_SELF);
    }

    onCheckStartAddessUser(args: MatCheckboxChange) {
        console.log(args);
        if (args.checked) {
            let currAddress = `${this.transportRequestFormS2.controls.userAddress.value}, ${this.transportRequestFormS2.controls.userCap.value} - ${this.transportRequestFormS2.controls.userCity.value} (${this.transportRequestFormS2.controls.userProv.value})`;
            this.transportRequestFormS3.controls.startAddress.setValue(currAddress);
        } else {
            this.transportRequestFormS3.controls.startAddress.setValue('');
        }
    }

    onCheckReturnalAddessUser(args: MatCheckboxChange) {
        console.log(args);
        if (args.checked) {
            let currAddress = `${this.transportRequestFormS2.controls.userAddress.value}, ${this.transportRequestFormS2.controls.userCap.value} - ${this.transportRequestFormS2.controls.userCity.value} (${this.transportRequestFormS2.controls.userProv.value})`;
            this.transportRequestFormS3.controls.returnalAddress.setValue(currAddress);
        } else {
            this.transportRequestFormS3.controls.returnalAddress.setValue('');
        }
    }

    getAcceptValidStatus() {
        return this.transportRequestFormS2.controls.accept1.value &&
            this.transportRequestFormS2.controls.accept2.value &&
            this.transportRequestFormS2.controls.accept3.value;
    }

    async onSubmit(go: boolean) {
        if (!go || !this.transportRequestFormS1.valid || !this.transportRequestFormS2.valid || !this.transportRequestFormS3.valid)
            return;

        this.serviceTransport = this.commonService.mapFormGroupToObject(this.transportRequestFormS1, this.serviceTransport);
        this.serviceTransport = this.commonService.mapFormGroupToObject(this.transportRequestFormS2, this.serviceTransport);
        this.serviceTransport = this.commonService.mapFormGroupToObject(this.transportRequestFormS3, this.serviceTransport);

        console.log(this.serviceTransport);
        let id = this.currentServiceTransportId != '0' ? this.currentServiceTransportId : uuidv4();
        let res = await this.dataRepositoryManagementService.addOrUpdateDataRepositoryEntry(SERVICE_REPOSITORY.TRANSPORTS, id, this.serviceTransport);
        if (this.commonService.isValidResponse(res)) {
            swal.fire(
                '',
                'Resource type updated successfully',
                'success'
            );
        } else {
            swal.fire(
                '',
                res.reason,
                'info'
            );
        }
        this.router.navigate(['/services-management/srv-transports-management']);
    }

    renderTableColumn(columnRef: TABLE_COLUMN_REF, serviceTransportEntry: ServiceTransportEntry) {

        if (columnRef == TABLE_COLUMN_REF.DATE) {
            return this.commonService.formatDateTime(serviceTransportEntry.arrivalDate, 'dd/MM/yyyy');
        } else if (columnRef == TABLE_COLUMN_REF.USER) {
            return `${serviceTransportEntry.userName} ${serviceTransportEntry.userSurname}`;
        } else if (columnRef == TABLE_COLUMN_REF.FROM) {
            return `${serviceTransportEntry.startAddress}`
        } else if (columnRef == TABLE_COLUMN_REF.TO) {
            return `${serviceTransportEntry.arrivalPlace} ${serviceTransportEntry.arrivalAddress} ${serviceTransportEntry.arrivalCity}`
        }
    }

    updatePersonFormArray(isAdd: boolean) {
        const control = new FormControl('null', Validators.required);
        const personFormArray = this.transportRequestFormS3.get('listTransportPersons') as FormArray;

        if (isAdd)
            personFormArray.push(control);
        else
            personFormArray.removeAt(0);
    }

    async onAddTransportPerson() {
        const dialogRef = this.dialog.open(AddEditServiceTransportItemComponent, {
            data: ServiceTransportEntry.Empty()
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.updatePersonFormArray(true);
                this.serviceTransport.transportEntries.push(result);
                this.serviceTransport.transportEntries = [...this.serviceTransport.transportEntries];   // force change detection
            }
        });
    }

    async onModifyTransportPerson(serviceTransportEntry: ServiceTransportEntry) {
        const dialogRef = this.dialog.open(AddEditServiceTransportItemComponent, {
            data: serviceTransportEntry
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.updatePersonFormArray(true);
                this.serviceTransport.transportEntries.push(result);
                this.serviceTransport.transportEntries = [...this.serviceTransport.transportEntries];   // force change detection
            }
        });
    }

}
