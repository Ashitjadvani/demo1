import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { AUTH_PROVIDER, UserAccount } from 'projects/fe-common/src/lib/models/user-account';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Action, ColumnTemplate } from '../../components/table-data-view/table-data-view.component';
import { AccountManagementDialogComponent } from '../../dialogs/account-management-dialog/account-management-dialog.component';

@Component({
    selector: 'app-accounts-page',
    templateUrl: './accounts-page.component.html',
    styleUrls: ['./accounts-page.component.scss']
})
export class AccountsPageComponent implements OnInit {
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    @ViewChild('file', { static: true }) file: ElementRef;

    availableAuthProviders = [
        { provider: AUTH_PROVIDER.LOCAL, name: 'Local', need_password: true },
        { provider: AUTH_PROVIDER.AZURE, name: 'Azure', need_password: false },
        { provider: AUTH_PROVIDER.ACTIVE_DIRECTORY, name: 'Active Directory', need_password: false }
    ];

    passwordValidArray = [
      {type: 'hour', name: '1 hour', value: 1, id: '1_hour'},
      {type: 'hour', name: '8 hour', value: 8, id: '8_hour'},
      {type: 'day', name: '1 day', value: 1, id: '1_day' },
      {type: 'day', name: '30 days', value: 30, id: '30_day' },
      {type: 'day', name: '60 days', value: 60, id: '60_day' },
      {type: 'day', name: '120 days', value: 120, id: '120_day' },
      {type: 'day', name: '160 days', value: 160, id: '160_day' },
      {type: 'day', name: '200 days', value: 200, id: '200_day' },
      {type: 'day', name: '260 days', value: 260, id: '260_day' },
      {type: 'day', name: '360 days', value: 360, id: '360_day' },
      {type: 'never', name: 'Never Expired', value: 360, id: 'never_expired' }
    ];

    passwordValidMinMax: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    passwordValidPattern: any = [
        {name: 'At least one upper case', value: '1'},
        {name: 'At least one lower case', value: '2'},
        {name: 'At least one digit', value: '3'},
        {name: 'At least one special character', value: '4'},
        {name: 'At least one letter, one number and one special character', value: '5'},
        {name: 'At least one uppercase letter, one lowercase letter and one number', value: '6'},
        {name: 'At least one uppercase letter, one lowercase letter, one number and one special character', value: '7'}
    ];

    passwordDuration: any = [
      {name: '1 Month', value: 1},
      {name: '2 Month', value: 2},
      {name: '3 Month', value: 3},
      {name: '4 Month', value: 4},
      {name: '5 Month', value: 5},
      {name: '6 Month', value: 6},
      {name: '7 Month', value: 7},
      {name: '8 Month', value: 8},
      {name: '9 Month', value: 9},
      {name: '10 Month', value: 10},
      {name: '11 Month', value: 11},
      {name: '12 Month', value: 12},
    ];

    allowedPreviousPassword: any = [
      {name: 'yes', value: 1},
      {name: 'no', value: 0}
    ];

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.ACCOUNT ID'), columnName: 'ID', columnDataField: 'userId', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Name'), columnName: 'Name', columnDataField: 'personInfo.name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Surname'), columnName: 'Surname', columnDataField: 'personInfo.surname', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.AUTHENTICATION'), columnName: 'Auth', columnDataField: 'authProvider', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.FIRSTLOGIN'), columnName: 'FirstLogin', columnDataField: 'firstLoginAt', columnFormatter: 'dateColumnFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.LASTLOGIN'), columnName: 'LastLogin', columnDataField: 'lastLoginAt', columnFormatter: 'dateColumnFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        // { tooltip: 'User site daily access', image: './assets/images/calendar-month-outline.svg', icon: null, color: '#000000', action: 'onModifyUserSiteDailyAccess', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.EDIT'), image: './assets/images/account-edit.svg', icon: null, color: '#000000', action: 'onModifyAccount', context: this },
        // { tooltip: 'Show user activity', image: null, icon: 'comment', color: '#000000', action: 'onShowUserActivity', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteAccount', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.ADD ACCOUNT'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddAccount', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.IMPORT ACCOUNT'), image: null, icon: 'cloud_upload', color: '#ffffff', action: 'onImportUser', context: this },
        // { tooltip: 'Add Safety Users', image: null, icon: 'health_and_safety', color: '#ffffff', action: 'onImportSafetyUser', context: this },
        // { tooltip: 'Clear Users', image: './assets/images/cloud-delete.svg', icon: null, color: '#ffffff', action: 'onClearUsers', context: this },
    ]

    filterCallback: Function;
    showPassword: boolean = false;
    confirmPassword: string = '';

    accounts: UserAccount[];
    titleCard: string;
    currentAccount: UserAccount = UserAccount.Empty();

    isSafetyUsers: boolean;

    allPeople: Person[];
    people: Observable<Person[]>;
    peopleFC: FormControl = new FormControl();

    userAccount: Person;

    selectedPerson: Person;
    selectedAuthMethod: any;
    passwordValid: any = "8hour";
    isModify: boolean;

    datePipe: DatePipe = new DatePipe('it-IT');

    constructor(private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        private notifyManagementService: NotifyManagementService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService) {
        this.filterCallback = this.filterAccount.bind(this);
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
        }

        await this.loadAccountList();
    }

    filterAccount(filterValue: string, data: any) {
        return UserAccount.filterMatch(data, filterValue);
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

    async loadAccountList() {
        const userAccount = this.userManagementService.getAccount();
        let res = await this.adminUserManagementService.getAccounts(userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.accounts = res.accounts;
        } else {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR USERS'), this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    async onAddAccount() {
        this.isModify = false;
        this.selectedPerson = null;
        this.selectedAuthMethod = null;
        this.confirmPassword = '';
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.ADD ACCOUNT');
        this.currentAccount = UserAccount.Empty();
        this.tabgroup.selectedIndex = 1;
    }

    async onDeleteAccount(account: UserAccount) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteUser'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.adminUserManagementService.deleteAccount(account.id);
            if (res.result) {
                this.accounts = this.accounts.filter(u => u.id != account.id);
            } else
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    async onModifyAccount(account: UserAccount) {
        this.isModify = true;
        this.selectedPerson = this.allPeople.find(p => p.id == account.personId);
        this.selectedAuthMethod = this.availableAuthProviders.find(ap => ap.provider == account.authProvider);
        this.confirmPassword = '';
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.MODIFY ACCOUNT');
        this.currentAccount = this.commonService.cloneObject(account);
        this.tabgroup.selectedIndex = 1;
    }

    onImportUser() {
        this.chooseFile(false);
    }

    onImportSafetyUser() {
        this.chooseFile(true);
    }

    chooseFile(isSafetyUsers: boolean) {
        this.isSafetyUsers = isSafetyUsers;
        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }

        this.file.nativeElement.click();
    }

    async onUploadFile() {
        let fileChoosen = this.file.nativeElement.files[0];
        if (!fileChoosen)
            return;

        if (fileChoosen.size > (10 * 1024 * 1024)) {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.FILE SIZE BIG'), this.translate.instant('GENERAL.OK'), { duration: 2000 });
            return;
        }

        let file = this.file.nativeElement.files[0];
        await this.adminUserManagementService.uploadUsers(file, this.isSafetyUsers);
        await this.loadAccountList();

        this.notifyManagementService.displaySuccessSnackBar(this.translate.instant('ADMIN COMPONENTS.DATA IMPORT COMPLETE'));
    }

    isEditConfirmEnabled() {
        if (this.needPassword())
            return this.selectedPerson &&
                this.currentAccount.userId &&
                this.selectedAuthMethod &&
                this.confirmPassword == this.currentAccount.password;
        else
            return this.selectedPerson &&
                this.currentAccount.userId &&
                this.selectedAuthMethod;

    }

    onEditCancelClick() {
        this.tabgroup.selectedIndex = 0;
    }

    async onEditConfirmClick() {
        this.currentAccount.personId = this.selectedPerson.id;
        this.currentAccount.companyId = this.userAccount.companyId;
        this.currentAccount.authProvider = this.selectedAuthMethod.provider;
       // this.currentAccount.passwordValid = this.passwordValidArray.filter( (b) => b.id === this.currentAccount.passwordValid)[0];
        let res;
        if (this.isModify)
            res = await this.adminUserManagementService.updateAccount(this.currentAccount);
        else
            res = await this.adminUserManagementService.addAccount(this.currentAccount);
        if (this.commonService.isValidResponse(res)) {
            await this.loadAccountList();
            this.tabgroup.selectedIndex = 0;
        } else
            this.snackBar.open(this.translate.instant('INSIGHTS_PEOPLE_PAGE.Error') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
    }

    dateColumnFormatter(fieldValue: any) {
        try {
            return this.datePipe.transform(new Date(fieldValue), 'dd/MM/yyyy HH:mm:ss');
        } catch(ex) {
            console.error('dateColumnFormatter exception: ', ex);
        }

        return '#NA'
    }
}
