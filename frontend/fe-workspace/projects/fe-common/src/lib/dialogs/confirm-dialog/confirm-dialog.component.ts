import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ConfirmDialogData {
    title: string;
    message: string;
    confirmButtonText: string;
    cancelButtonText: string;

    constructor(title, message, confirmButtonText, cancelButtonText) {
        this.title = title;
        this.message = message;
        this.confirmButtonText = confirmButtonText;
        this.cancelButtonText = cancelButtonText;
    }
}

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
    title: string;
    message: string;
    confirmButtonText: string;
    cancelButtonText: string;

    constructor (
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) {
        this.title = data.title;
        this.message = data.message;
        this.confirmButtonText = data.confirmButtonText;
        this.cancelButtonText = data.cancelButtonText;
    }

    onCancelClick() {
        this.dialogRef.close(false);
    }

    onConfirmClick() {
        this.dialogRef.close(true);
    }
}
