import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class NotifyManagementService {

    constructor(private _snackBar: MatSnackBar,
        private _dialog: MatDialog
    ) { 
        
    }

    displaySuccessSnackBar(message: string) {
        this._snackBar.open(message, "OK", {
            duration: 3000,
            panelClass: 'success'
        });
    }

    displayWarnSnackBar(message: string) {
        this._snackBar.open(message, "OK", {
            duration:3000,
            panelClass: 'warning'
        });
    }

    displayErrorSnackBar(message: string) {
        this._snackBar.open(message, "OK", {
            duration: 3000,
            panelClass: 'error'
        });
    }

    async openConfirmDialog(title: string, message: string) {
        return this._dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(title, message, 'YES', 'NO')
        }).afterClosed().toPromise();
    }

    async openMessageDialog(title: string, message: string) {
        return this._dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(title, message, 'OK', null)
        }).afterClosed().toPromise();
    }
}
