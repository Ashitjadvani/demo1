import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {EventCreditDialogData} from '../../components/event-management/event-list/event-list.component';

@Component({
    selector: 'app-edit-event-credit-popup',
    templateUrl: './edit-event-credit-popup.component.html',
    styleUrls: ['./edit-event-credit-popup.component.scss']
})
export class EditEventCreditPopupComponent implements OnInit {
    addEventCreditForm: FormGroup;
    eventCreditValue: boolean;
    eventCreditCountValue: boolean;

    constructor(
        public dialogRef: MatDialogRef<EditEventCreditPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EventCreditDialogData,
        public _formBuilder: FormBuilder
    ) {
        this.addEventCreditForm = this._formBuilder.group({
            eventCredit: data.eventCreditPopValue ? data.eventCreditPopValue : false,
            eventCreditCount: data.eventCreditCountPopValue,
            isEditEventCredit: true
        });
        // this.eventCreditValue = data.eventCreditPopValue;
        // this.eventCreditCountValue = data.eventCreditCountPopValue;
    }

    ngOnInit(): void {
    }

    onClick(result: any, data: any): void {
        this.dialogRef.afterOpened();
        this.dialogRef.close(result && data);
    }

    onClose(): void {
        this.dialogRef.close();
    }

    saveEventCreditForm(){
        if (this.addEventCreditForm.value.eventCredit) {
            this.addEventCreditForm.get('eventCreditCount').setValidators([Validators.required]);
        } else {
            this.addEventCreditForm.get('eventCreditCount').clearValidators();
        }
        this.addEventCreditForm.controls['eventCreditCount'].updateValueAndValidity();
        this.addEventCreditForm.updateValueAndValidity();

        if (this.addEventCreditForm.status == 'VALID'){
            this.dialogRef.close(true && this.addEventCreditForm.value);
        }
    }
}
