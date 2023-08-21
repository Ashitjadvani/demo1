import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { AUTH_PROVIDER, UserAccount } from 'projects/fe-common/src/lib/models/user-account';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export class AccountDialogData {
    isModify: boolean;
    userAccount: UserAccount;
}

@Component({
    selector: 'app-account-management-dialog',
    templateUrl: './account-management-dialog.component.html',
    styleUrls: ['./account-management-dialog.component.scss']
})
export class AccountManagementDialogComponent implements OnInit {
    availableAuthProviders = [
        { provider: AUTH_PROVIDER.LOCAL, name: 'Local', need_password: true },
        { provider: AUTH_PROVIDER.ACTIVE_DIRECTORY, name: 'Active Directory', need_password: false }
    ]

    currentData: AccountDialogData = new AccountDialogData();
    showPassword: boolean = false;
    confirmPassword: string = '';

    allPeople: Person[];
    people: Observable<Person[]>;
    peopleFC: FormControl = new FormControl();

    selectedPerson: Person;
    selectedAuthMethod: any;

    userAccount: Person;

    constructor(public dialogRef: MatDialogRef<AccountManagementDialogComponent>,
        private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        private snackBar: MatSnackBar,
        public translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) data: AccountDialogData) {
        this.currentData.isModify = data.isModify;
        this.currentData.userAccount = data.isModify ? Object.assign({}, data.userAccount) : UserAccount.Empty();
    }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();
        let res = await this.adminUserManagementService.getPeople(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.allPeople = res.people;
            this.people = this.peopleFC.valueChanges.pipe(
                startWith(''),
                map(p => this.filterUsers(p))
            )

            if (this.currentData.isModify) {
                this.selectedPerson = this.allPeople.find(p => p.id == this.currentData.userAccount.personId);
                this.selectedAuthMethod = this.availableAuthProviders.find(ap => ap.provider == this.currentData.userAccount.authProvider);
            }
        }
    }

    onToggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    filterUsers(value: string) {
        return this.allPeople.filter(p => Person.filterMatch(p, value));
    }

    displaySelectedUser(person: Person) {
        return person ? person.name + ' ' + person.surname : '';
    }

    needPassword(): boolean {
        return (!this.selectedAuthMethod || this.selectedAuthMethod.need_password);
    }

    isConfirmEnabled() {
        if (this.needPassword())
            return this.selectedPerson &&
                this.currentData.userAccount.userId &&
                this.selectedAuthMethod &&
                this.confirmPassword == this.currentData.userAccount.password;
        else
            return this.selectedPerson &&
                this.currentData.userAccount.userId &&
                this.selectedAuthMethod;
    }

    onCancelClick() {
        this.dialogRef.close(false);
    }

    async onConfirmClick() {
        this.currentData.userAccount.personId = this.selectedPerson.id;
        this.currentData.userAccount.companyId = this.userAccount.companyId;
        this.currentData.userAccount.authProvider = this.selectedAuthMethod.provider;

        let res = await this.adminUserManagementService.addAccount(this.currentData.userAccount);
        if (this.commonService.isValidResponse(res))
            this.dialogRef.close(true);
        else
            this.snackBar.open('Error: ' + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
    }
}
