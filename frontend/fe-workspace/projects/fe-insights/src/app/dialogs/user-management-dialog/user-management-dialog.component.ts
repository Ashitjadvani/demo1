import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { UserProfile } from 'projects/fe-common/src/lib/models/admin/user';
import { Person, PERSON_PROPERTY } from 'projects/fe-common/src/lib/models/person';
import { PersonProfileGroup } from 'projects/fe-common/src/lib/models/person-profile-group';
import { UserAccount } from 'projects/fe-common/src/lib/models/user-account';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


export class UserDialogData {
    isModify: boolean;
    user: Person;
}

@Component({
    selector: 'app-user-management-dialog',
    templateUrl: './user-management-dialog.component.html',
    styleUrls: ['./user-management-dialog.component.scss']
})
export class UserManagementDialogComponent implements OnInit {
    PERSON_PROPERTY = PERSON_PROPERTY;

    genderList = [
        'Not specified',
        'Male',
        'Female'
    ];

    provITA = [
        'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Aquila ', 'Arezzo', 'Ascoli Piceno', 'Asti', 'Avellino',
        'Bari', 'Belluno', 'Benevento', 'Bergamo', 'Biella', 'B ologna', 'Bolzano', 'Brescia', 'Brindisi',
        'Cagliari', 'Caltanissetta', 'Campobasso', 'Caserta', 'Catania', 'Catanzaro', 'Chieti', 'Como', 'Cosenza', 'C remona', 'Crotone', 'Cuneo',
        'Enna',
        'Ferrara', 'Firenze', 'Foggia', 'Forlì e Cesena', 'Frosinone',
        'Genova', 'Gorizia', 'Grosseto',
        'Imperia', 'Isernia',
        'La Spezia', 'Latina', 'Lecce', 'Lecco', 'Livorno', 'Lodi', 'Lucca',
        'Macerata', 'Mantova', 'Massa-Carrara', 'Matera', 'Messina', 'Milano', 'Modena',
        'Napoli', 'Novara', 'Nuoro',
        'Oristano',
        'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia', 'Pesa ro e Urbino', 'Pescara', 'Piacenza', 'Pisa', 'Pistoia', 'Por denone', 'Potenza', 'Prato',
        'Ragusa', 'Ravenna', 'Reggio Calabria', 'Reggio Emilia', 'Rieti', 'Rimini', 'Roma', 'Rovigo',
        'Salerno', 'Sassari', 'Savona', 'Siena', 'Siracusa', 'S ondrio',
        'Taranto', 'Teramo', 'Terni', 'Torino', 'Trapani', 'Tre nto', 'Treviso', 'Trieste',
        'Udine',
        'Varese', 'Venezia', 'Verbano-Cusio-Ossola', 'Vercelli', 'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo'];

    userProfiles = UserProfile;

    availableProfiles: any;
    currentData: UserDialogData = new UserDialogData();
    confirmPassword: string;

    allSites: Site[];
    siteFC: FormControl = new FormControl();
    userSites: Observable<Site[]>;
    personProfileGroups: PersonProfileGroup[];

    allPersons: Person[];
    partnerManagerFC: FormControl = new FormControl();
    partnerManagerUsers: Observable<Person[]>;
    officeManagerFC: FormControl = new FormControl();
    officeManagerUsers: Observable<Person[]>;

    showPassword: boolean = false;
    userAccount: Person;

    constructor(public dialogRef: MatDialogRef<UserManagementDialogComponent>,
        private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        public commonService: CommonService,
        public translate: TranslateService,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) data: UserDialogData) {

        this.availableProfiles = Object.values(this.userProfiles);
        this.currentData.isModify = data.isModify;
        this.currentData.user = data.isModify ? Object.assign({}, data.user) : Person.Empty();
    }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();

        this.allSites = await this.adminSiteManagementService.siteList();
        this.userSites = this.siteFC.valueChanges.pipe(startWith(''), map(s => this.filterSites(s)));

        await this.loadPeople();
        await this.loadPeopleProfileGroups();

        this.partnerManagerUsers = this.partnerManagerFC.valueChanges.pipe(startWith(''), map(u => this.filterUsers(u)));
        this.officeManagerUsers = this.officeManagerFC.valueChanges.pipe(startWith(''), map(u => this.filterUsers(u)));
    }

    async loadPeople() {
        let res = await this.adminUserManagementService.getPeople(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res))
            this.allPersons = res.people;
        else
            this.allPersons = [];
    }

    async loadPeopleProfileGroups() {
        let res = await this.adminUserManagementService.getPeopleGroups(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res))
            this.personProfileGroups = res.groups;
        else
            this.personProfileGroups = [];
    }

    filterSites(value: string) {
        return this.allSites.filter(s => Site.filterMatch(s, value));
    }

    filterUsers(value: string) {
        return this.allPersons.filter(u => Person.filterMatch(u, value));
    }

    isConfirmEnabled() {
        return this.currentData.user.name &&
            this.currentData.user.surname &&
            this.currentData.user.email;
    }

    onProfileChange($event) {

    }

    onToggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    onCancelClick() {
        this.dialogRef.close(false);
    }

    async onConfirmClick() {
        // TODO Update person



        // await this.adminUserManagementService.updateUser(this.currentData.user);
        this.dialogRef.close(true);
    }
}
