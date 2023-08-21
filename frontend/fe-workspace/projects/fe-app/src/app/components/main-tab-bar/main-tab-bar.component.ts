import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { QrCodeDialogComponent } from '../../dialogs/qr-code-dialog/qr-code-dialog.component';
import { MainActionService } from '../../services/main-action.service';
import { HelpdeskServiceSheetComponent } from '../helpdesk-service-sheet/helpdesk-service-sheet.component';

@Component({
    selector: 'app-main-tab-bar',
    templateUrl: './main-tab-bar.component.html',
    styleUrls: ['./main-tab-bar.component.scss']
})
export class MainTabBarComponent implements OnInit {
    @Input() ShowBack: boolean;
    
    @Output() HomeEvent: EventEmitter<void> = new EventEmitter();
    @Output() BackEvent: EventEmitter<void> = new EventEmitter();
    @Output() QrScanEvent: EventEmitter<void> = new EventEmitter();
    @Output() MenuEvent: EventEmitter<void> = new EventEmitter();

    constructor(private router: Router,
        private mainActionService: MainActionService, 
        private _bottomSheet: MatBottomSheet,
        private dialog: MatDialog) { }

    ngOnInit(): void {
    }

    onHomeClick() {
        this.HomeEvent.emit();
        this.router.navigate(["home"]);
    }

    onBackClick() {
        if (this.BackEvent.observers.length > 0)
            this.BackEvent.emit();
        else
            this.router.navigate(["home"]);
    }

    async onQrScanClick() {
        await this.dialog.open(QrCodeDialogComponent, {
            maxWidth: '250px',
            panelClass: 'custom-dialog-container'
        }).afterClosed().toPromise();
    }

    onInformationClick() {
        this.router.navigate(["information"]);
    }

    onProfileClick() {
        this.router.navigate(["user-profile"]);
    }

    onMenuClick() {
        this._bottomSheet.open(HelpdeskServiceSheetComponent, {
            data: { serviceActions: [] },
            panelClass: 'bottom-sheet'
        });

    }

    async onMainActionClick() {
        await this.mainActionService.doMainAction();
        this.QrScanEvent.emit();
    }
}
