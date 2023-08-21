import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServiceTransport, SERVICE_REPOSITORY } from 'projects/fe-common-v2/src/lib/models/services/models';
import { AdminSiteManagementService } from 'projects/fe-common-v2/src/lib/services/admin-site-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { DataRepositoryManagementService } from 'projects/fe-common-v2/src/lib/services/data-repository-management.service';
import { ResourceManagementService } from 'projects/fe-common-v2/src/lib/services/resource-management.service';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import { v4 as uuidv4 } from 'uuid';
import swal from 'sweetalert2';

enum TRANSPORT_REQUEST_TYPE {
    PRIVATE_SELF,
    PRIVATE_OTHER,
    UILDM,
    ST_ERASMO,
    COMUNE_LG,
    COMUNE_CS,
    FIORELLONE
}

enum WHEELCHAIR_TYPE {
    MANUAL,
    ELETRIC,
    NOT_NEEDED,
    NEEDED
}

@Component({
    selector: 'app-add-edit-service-transport',
    templateUrl: './add-edit-service-transport.component.html',
    styleUrls: ['./add-edit-service-transport.component.scss']
})
export class AddEditServiceTransportComponent implements OnInit {
    transportRequestType: any[] = [
        { value: TRANSPORT_REQUEST_TYPE.PRIVATE_SELF, text: 'Privato, l\'interessato in persona' },
        { value: TRANSPORT_REQUEST_TYPE.PRIVATE_OTHER, text: 'Privato, tramite un intermediario' },
        { value: TRANSPORT_REQUEST_TYPE.UILDM, text: 'UILDM Legnano call center' },
        { value: TRANSPORT_REQUEST_TYPE.ST_ERASMO, text: 'Sant\'Erasmo' },
        { value: TRANSPORT_REQUEST_TYPE.COMUNE_LG, text: 'Comune di Legnano' },
        { value: TRANSPORT_REQUEST_TYPE.COMUNE_CS, text: 'Comune di Cerro Maggiore' },
        { value: TRANSPORT_REQUEST_TYPE.FIORELLONE, text: 'Fiorellone' }
    ];

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

    acceptItems: string [] = [
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
    transportRequestFormS4: FormGroup;

    showRequester: boolean = false;
    currentServiceTransportId: string;

    serviceTransport: ServiceTransport = ServiceTransport.Empty();

    constructor(private formBuilder: FormBuilder,
        private resourceManagementService: ResourceManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private router: Router,
        private route: ActivatedRoute,
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

        this.transportRequestFormS3 = this.formBuilder.group({
            userName: ['', Validators.required],
            userSurname: ['', Validators.required],
            userGender: ['', Validators.required],
            userAddress: ['', Validators.required],
            userCity: ['', Validators.required],
            userCap: ['', Validators.required],
            userProv: ['', Validators.required],
            userPhone: ['', Validators.required],
            userPhysicStatus: ['', Validators.required]
        });

        this.transportRequestFormS4 = this.formBuilder.group({
            startAddress: ['', Validators.required],
            arrivalPlace: ['', Validators.required],
            arrivalAddress: ['', Validators.required],
            arrivalCity: ['', Validators.required],
            arrivalProv: ['', Validators.required],
            arrivalDate: ['', Validators.required],
            arrivalTime: ['', Validators.required],
            returnalDate: ['', Validators.required],
            returnalTime: ['', Validators.required],
            returnalAddress: ['', Validators.required],
            note: ['']
        });
    }

    ngOnInit(): void {
        this.currentServiceTransportId = this.route.snapshot.paramMap.get('id');
        if (this.currentServiceTransportId != '0') {
            this.dataRepositoryManagementService.getDataRepositorySingleEntry(SERVICE_REPOSITORY.TRANSPORTS, this.currentServiceTransportId).then((response) => {
                if (response.result) {
                    this.transportRequestFormS1.patchValue(response.data.entityObject)
                    this.transportRequestFormS2.patchValue(response.data.entityObject)
                    this.transportRequestFormS3.patchValue(response.data.entityObject)
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

    getTransportTime(isArrival: boolean) {
        if (isArrival) {
            return ''; // this.serviceTransport.arrivalTime ? this.commonService.timeFormat(this.serviceTransport.arrivalTime) : '';
        } else {
            return ''; // this.serviceTransport.returnalTime ? this.commonService.timeFormat(this.serviceTransport.returnalTime) : '';
        }
    }

    setTransportTime(isArrival, value) {
        if (!this.commonService.isValidHHMM(value))
            return;

        if (isArrival) {
            this.transportRequestFormS3.controls.arrivalTime.setValue(value);
        } else {
            this.transportRequestFormS3.controls.returnalTime.setValue(value);
        }
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

}
