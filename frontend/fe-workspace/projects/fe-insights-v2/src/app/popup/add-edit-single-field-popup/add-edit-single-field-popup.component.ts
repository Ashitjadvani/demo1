import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {WhiteSpaceValidator} from '../../../../../fe-insights/src/app/store/whitespace.validator';
import {MCPHelperService} from '../../service/MCPHelper.service';

@Component({
    selector: 'app-add-edit-single-field-popup',
    templateUrl: './add-edit-single-field-popup.component.html',
    styleUrls: ['./add-edit-single-field-popup.component.scss']
})
export class AddEditSingleFieldPopupComponent implements OnInit {
    singleFieldForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<AddEditSingleFieldPopupComponent>,
        public _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.singleFieldForm = this._formBuilder.group({
            name: [data.name, [Validators.required, MCPHelperService.noWhitespaceValidator]]
        });
        if (data.heading === 'Edit Alternative Field') {
            this.singleFieldForm = this._formBuilder.group({
                name: [data.value, [Validators.required, MCPHelperService.noWhitespaceValidator]]
            });
        }
    }

    ngOnInit(): void {
        console.log("data",this.data)
    }

    onSave(result: any, data: any): void {
        this.dialogRef.afterOpened();
        this.dialogRef.close(result && data);
    }

    onClose(): void {
        this.dialogRef.close();
    }

    public spaceCheck(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }
}

