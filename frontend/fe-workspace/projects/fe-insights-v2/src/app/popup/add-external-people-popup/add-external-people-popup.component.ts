import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MCPHelperService} from "../../service/MCPHelper.service";

@Component({
    selector: 'app-add-external-people-popup',
    templateUrl: './add-external-people-popup.component.html',
    styleUrls: ['./add-external-people-popup.component.scss']
})
export class AddExternalPeoplePopupComponent implements OnInit {
    addExternalForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<AddExternalPeoplePopupComponent>,
        public _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.addExternalForm = this._formBuilder.group({
            firstName: ['',Validators.required],
            surname: ['',Validators.required],
            email: ['', Validators.compose([Validators.required,Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$')])],
            invitataion: 'pending'
        });
    }

    ngOnInit(): void {
    }

    onSave(result: any, data: any): void {
        if (this.addExternalForm.valid && result === true){
            this.dialogRef.afterOpened();
            this.dialogRef.close(result && data);
        }else if (result === false){
            this.dialogRef.close(result && data);
        }
    }

    public spaceCheck(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

}
