import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceTransportEntry } from 'projects/fe-common-v2/src/lib/models/services/models';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';

@Component({
    selector: 'app-add-edit-service-transport-item',
    templateUrl: './add-edit-service-transport-item.component.html',
    styleUrls: ['./add-edit-service-transport-item.component.scss']
})
export class AddEditServiceTransportItemComponent implements OnInit {
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

    transportEntryFormS1: FormGroup;
    transportEntryFormS2: FormGroup;

    serviceTransportEntry: ServiceTransportEntry = ServiceTransportEntry.Empty();

    constructor(private formBuilder: FormBuilder,
        private commonService: CommonService,
        public dialogRef: MatDialogRef<AddEditServiceTransportItemComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ServiceTransportEntry) {

        this.transportEntryFormS1 = this.formBuilder.group({
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

        this.transportEntryFormS2 = this.formBuilder.group({
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

        this.serviceTransportEntry = data;
    }

    ngOnInit(): void {

    }

    onCheckStartAddessUser(args: MatCheckboxChange) {
        console.log(args);
        if (args.checked) {
            let currAddress = `${this.transportEntryFormS1.controls.userAddress.value}, ${this.transportEntryFormS1.controls.userCap.value} - ${this.transportEntryFormS1.controls.userCity.value} (${this.transportEntryFormS1.controls.userProv.value})`;
            this.transportEntryFormS2.controls.startAddress.setValue(currAddress);
        } else {
            this.transportEntryFormS2.controls.startAddress.setValue('');
        }
    }


    onCheckReturnalAddessUser(args: MatCheckboxChange) {
        console.log(args);
        if (args.checked) {
            let currAddress = `${this.transportEntryFormS1.controls.userAddress.value}, ${this.transportEntryFormS1.controls.userCap.value} - ${this.transportEntryFormS1.controls.userCity.value} (${this.transportEntryFormS1.controls.userProv.value})`;
            this.transportEntryFormS2.controls.returnalAddress.setValue(currAddress);
        } else {
            this.transportEntryFormS2.controls.returnalAddress.setValue('');
        }
    }

    getTransportTime(isArrival: boolean) {
        if (isArrival) {
            return this.serviceTransportEntry.arrivalTime ? this.commonService.timeFormat(this.serviceTransportEntry.arrivalTime) : '';
        } else {
            return this.serviceTransportEntry.returnalTime ? this.commonService.timeFormat(this.serviceTransportEntry.returnalTime) : '';
        }
    }

    setTransportTime(isArrival, value) {
        if (!this.commonService.isValidHHMM(value))
            return;

        if (isArrival) {
            this.transportEntryFormS2.controls.arrivalTime.setValue(value);
        } else {
            this.transportEntryFormS2.controls.returnalTime.setValue(value);
        }
    }

    onCancel() {
        this.dialogRef.close(null);
    }

    async onSubmit(go: boolean) {
        if (!go || !this.transportEntryFormS1.valid || !this.transportEntryFormS2.valid)
            return;

        this.serviceTransportEntry = this.commonService.mapFormGroupToObject(this.transportEntryFormS1, this.serviceTransportEntry);
        this.serviceTransportEntry = this.commonService.mapFormGroupToObject(this.transportEntryFormS2, this.serviceTransportEntry);

        this.dialogRef.close(this.serviceTransportEntry);
    }

}
