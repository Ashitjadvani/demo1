import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-edit-attendee-user-credit-popup',
    templateUrl: './edit-attendee-user-credit-popup.component.html',
    styleUrls: ['./edit-attendee-user-credit-popup.component.scss']
})
export class EditAttendeeUserCreditPopupComponent implements OnInit {
    editUserCreditForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<EditAttendeeUserCreditPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        public _formBuilder: FormBuilder
    ) {
        this.editUserCreditForm = this._formBuilder.group({
            userCredit: data.userCredit ? data.userCredit : 0,
        });
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.dialogRef.close();
    }

    saveUserCreditForm(){
        this.dialogRef.close(true && this.editUserCreditForm.value);
    }

}
