import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { EnvironmentService } from 'projects/fe-touchpoint/src/app/services/environment.service';
import { QrCodeDialogComponent } from '../../dialogs/qr-code-dialog/qr-code-dialog.component';

@Component({
    selector: 'app-main-toolbar',
    templateUrl: './main-toolbar.component.html',
    styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
    @Input() ShowBack: boolean;
    @Output() HomeEvent: EventEmitter<void> = new EventEmitter();
    @Output() BackEvent: EventEmitter<void> = new EventEmitter();
    @Output() LogoEvent: EventEmitter<void> = new EventEmitter();

    loggedUserName: string = "";
    bookingMessage: string;

    constructor(private adminUserManagerService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        private router: Router,
        private _dialog: MatDialog,
        private _notifyManagementService: NotifyManagementService,
        private _env: EnvironmentService,
        private _common: CommonService,
        public translate: TranslateService
    ) {
        this.bookingMessage = this.translate.instant('MAIN TOOLBAR.NO UPCOMING MEETINGS');
        let userAccount = this.userManagementService.getAccount()
        if (userAccount)
            this.loggedUserName = userAccount.name; // + ' ' + userAccount.surname;
    }

    ngOnInit() {
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

    onProfileClick() {
        this.router.navigate(["user-profile"]);
    }

    onLogoClick() {
        this.LogoEvent.emit();
    }

    async onQrScanClick() {
        await this._dialog.open(QrCodeDialogComponent, {
            maxWidth: '250px',
            panelClass: 'custom-dialog-container'
        }).afterClosed().toPromise();
    }

    async onLogoutClick() {
        let result = await this._notifyManagementService.openConfirmDialog(this.translate.instant('COMPONENTS.LOGOUT'), this.translate.instant('COMPONENTS.WANT LOGOUT'));
        if (result) {
            this.userManagementService.logout();
            this.router.navigate([""]);
        }
    }
}
