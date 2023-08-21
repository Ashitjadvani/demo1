import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { User } from 'projects/fe-common/src/lib/models/admin/user';
import { Company } from 'projects/fe-common/src/lib/models/company';
import { Person, PersonHistory, PERSON_PROPERTY , PERSON_SCOPE, PERSON_TYPOLOGY} from 'projects/fe-common/src/lib/models/person';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';
import { UserManagementDialogComponent } from '../../../dialogs/user-management-dialog/user-management-dialog.component';
import { SatPopover } from '@ncstate/sat-popover';
import { DatePipe } from '@angular/common';
import { UserCapabilityService } from '../../../services/user-capability.service';
import { saveAs } from 'file-saver';
import { ReportManagementService } from 'projects/fe-common/src/lib/services/report-management.service';
import { MonthChooserDialogComponent } from '../../../dialogs/month-chooser-dialog/month-chooser-dialog.component';
import { PeopleDashboardDialogComponent } from '../../../dialogs/people-dashboard-dialog/people-dashboard-dialog.component';
import * as XLSX from 'ts-xlsx';
import { ActivatedRoute } from '@angular/router';
import { ExcelService } from '../../../services/excel.service';
@Component({
  selector: 'app-quiz-survey-listing-page',
  templateUrl: './quiz-survey-listing-page.component.html',
  styleUrls: ['./quiz-survey-listing-page.component.scss'],
  animations: [
    trigger('flipState', [
        state('active', style({
            transform: 'rotateY(179deg)'
        })),
        state('inactive', style({
            transform: 'rotateY(0)'
        })),
        transition('active => inactive', animate('500ms ease-out')),
        transition('inactive => active', animate('500ms ease-in'))
    ])
]
})
export class QuizSurveyListingPageComponent implements OnInit {

  @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
  @ViewChild(MatTabGroup, { static: false }) tabgroupeditor: MatTabGroup;
  @ViewChild(SatPopover, { static: false }) changeLogPopover: SatPopover;

  @ViewChild('file', { static: true }) file: ElementRef;

  PERSON_PROPERTY = PERSON_PROPERTY;
  PERSON_SCOPE = PERSON_SCOPE;

  area = [
      'Amministrazione',
      'Biblioteca',
      'Marketing',
      'Nucleo servizi generali',
      'Centralino',
      'Reception',
      'Segreteria',
      'Paralegal'
  ];

  workingHours = [
      'ML 9-18 9/13 - 14/18',
      'MLB 9-18 9/13.30-14.30/18'
  ];

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

  people: Person[];
  currentEditPerson: Person = Person.Empty();
  currentCompany: Company = new Company();
  currentPersonHistory: PersonHistory[] = [];

  isSafetyUsers: boolean;
  titleCard: string;

  sites: Site[];

  tableColumnTemplates: ColumnTemplate[] = [
      { columnCaption: 'Survey', columnName: 'Survey', columnDataField: 'Survey', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
      { columnCaption: 'Question', columnName: 'Question', columnDataField: 'Question', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
      { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
  ]

  tableRowActions: Action[] = [
      // { tooltip: 'User site daily access', image: './assets/images/calendar-month-outline.svg', icon: null, color: '#000000', action: 'onModifyUserSiteDailyAccess', context: this },
      { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Change Log'), image: null, icon: 'checklist_rtl', color: '#000000', action: 'onShowChangeLog', context: this },
      { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Edit'), image: './assets/images/account-edit.svg', icon: null, color: '#000000', action: 'onModifyUser', context: this },
      { tooltip: 'Show user activity', image: null, icon: 'comment', color: '#000000', action: 'onShowUserActivity', context: this },
      { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteUser', context: this }
  ]

  tableMainActions: Action[] = [
      { tooltip: this.translate.instant('Home'), image: null, icon: 'home_icon', color: '#ffffff', action: '', context: this },
      { tooltip: this.translate.instant('Survey'), image: null, icon: 'queue', color: '#ffffff', action: 'onInsertSurvey', context: this },
      { tooltip: this.translate.instant('Quesion'), image: null, icon: 'question_answer', color: '#ffffff', action: 'onInsertQuestion', context: this },


  ]

  filterCallback: Function;
  userAccount: Person;
  disputeAvailable: boolean = false;
  economicsAvailable: boolean = false;
  settingsAvailable: boolean = false;

  showCard: boolean = true;
  sub: any;
  scope: PERSON_SCOPE;

  constructor(private adminUserManagementService: AdminUserManagementService,
      private adminSiteManagementService: AdminSiteManagementService,
      private userManagementService: UserManagementService,
      private commonService: CommonService,
      private notifyManagementService: NotifyManagementService,
      private userCapabilityService: UserCapabilityService,
      private snackBar: MatSnackBar,
      private dialog: MatDialog,
      private reportManagementService: ReportManagementService,
      private route: ActivatedRoute,
      private excelService: ExcelService,
      public translate: TranslateService) {
      this.filterCallback = this.filterPerson.bind(this);
  }

  async ngOnInit() {
      this.sub = this.route.data.subscribe(v => this.scope = v.scope);
      this.userAccount = this.userManagementService.getAccount();
      let res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);
      if (this.commonService.isValidResponse(res)) {
          this.sites = res.sites;
      }

      this.disputeAvailable = this.userCapabilityService.isFunctionAvailable('Employees/Dispute');
      this.economicsAvailable = this.userCapabilityService.isFunctionAvailable('Employees/Economics');

      await this.loadCompany();
      await this.loadUserList();
  }

  ngOnDestroy() {
      this.sub.unsubscribe();
  }

  filterPerson(filterValue: string, data: any) {
      return Person.filterMatch(data, filterValue);
  }

  async loadUserList() {
      const res = await this.adminUserManagementService.getPeople(this.userAccount.companyId);
      this.people = new Array();
      if (this.commonService.isValidResponse(res)) {
          for(let person of res.people) {
              if(person.scope == this.scope)  this.people.push(person);
          }
          //this.people = res.people;
      } else {
          this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR USERS'), this.translate.instant('GENERAL.OK'), {
              duration: 3000
          })
          ;
      }
  }

  async loadCompany() {
      let res = await this.adminUserManagementService.getCompany(this.userAccount.companyId);
      if (this.commonService.isValidResponse(res)) {
          this.currentCompany = res.company;
      }
  }

  async onInsertSurvey() {
      this.showCard = true;
      this.titleCard = this.translate.instant('Insert-Survey');
      this.currentEditPerson = Person.Empty();
      this.currentEditPerson.scope = this.scope;
      this.tabgroupeditor.selectedIndex = 0;
      this.tabgroup.selectedIndex = 1;
  }

  async onInsertQuestion() {
    this.showCard = true;
    this.titleCard = this.translate.instant('Add-Question');
    this.currentEditPerson ;
    this.currentEditPerson.scope = this.scope;
    this.tabgroupeditor.selectedIndex = 0;
    this.tabgroup.selectedIndex = 1;
}

  async onModifyUser(person: Person) {
      this.showCard = true;
      this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Modify Person') + ' - '+ person.name + " " + person.surname;
      this.currentEditPerson = this.commonService.cloneObject(person);
      this.tabgroupeditor.selectedIndex = 0;
      this.tabgroup.selectedIndex = 1;
  }

  async onShowUserActivity(person: Person) {
      let csv = '';
      let saveCSV = (fileName) => {
          if (csv) {
              var blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
              saveAs(blob, fileName);
          }
      };

      let res = await this.dialog.open(MonthChooserDialogComponent, {
          width: '400px',
          panelClass: 'custom-dialog-container'
      }).afterClosed().toPromise();
      if (res) {
          let now = new Date();
          let year = now.getFullYear();
          let startDate = this.commonService.toYYYYMMDD(new Date(year, res - 1, 1));
          let endDate = this.commonService.toYYYYMMDD(new Date(year, res, 0));

          csv = await this.reportManagementService.getUserActivitiesCSV('', person.id, startDate, endDate);
          saveCSV(`irina-activity-report-${person.name}-${person.surname}-${year}-${res}.csv`);
      }
  }

  async onRestorePreson(personHistory: PersonHistory) {
      this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Modify Person From History');
      this.currentEditPerson = this.commonService.cloneObject(personHistory.d);
      this.tabgroupeditor.selectedIndex = 0;
      this.tabgroup.selectedIndex = 1;
  }

  async onDeleteUser(person: Person) {
      let res = await this.dialog.open(ConfirmDialogComponent, {
          width: '400px',
          panelClass: 'custom-dialog-container',
          data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteUser'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
      }).afterClosed().toPromise();
      if (res) {
          let res = await this.adminUserManagementService.deletePerson(person.id);
          if (res.result) {
              this.people = this.people.filter(u => u.id != person.id);
          } else
              this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
      }
  }

  getUserSafetyGroups(user: User) {
      if (user.safetyGroups && (user.safetyGroups.length > 0)) {
          let result = '';
          user.safetyGroups.forEach(val => result += ' ' + User.mapUserSafetyGroup(val) + ' ');
          return result;
      }
      return '';
  }
  isEditConfirmEnabled() {

      // return this.commonService.isValidField(this.currentEditPerson.name) &&
      //     this.commonService.isValidField(this.currentEditPerson.surname) &&
      //     this.commonService.isValidField(this.currentEditPerson.email);
  }

  onEditCancelClick() {
      this.tabgroup.selectedIndex = 0;
  }

  async onShowChangeLog(person: Person) {
      let res = await this.adminUserManagementService.getPersonHistory(person.id);
      if (this.commonService.isValidResponse(res)) {
          this.currentPersonHistory = res.history;
          this.changeLogPopover.open();
      }
  }

  async onEditConfirmClick() {
      this.currentEditPerson.companyId = this.userAccount.companyId;
      let res = await this.adminUserManagementService.addOrUpdatePerson(this.currentEditPerson);
      if (this.commonService.isValidResponse(res)) {
          await this.loadUserList();
          this.tabgroup.selectedIndex = 0;
      } else {
          // TODO SHOW ERROR
      }
  }



  async onShowPeopleDashboard() {
      // await this.dialog.open(PeopleDashboardDialogComponent, {
      //     width: '1000px',
      //     panelClass: 'custom-dialog-container'
      // }).afterClosed().toPromise();

      this.showCard = false;
      this.tabgroup.selectedIndex = 1;
  }

  async onInitScope() {
      const res = await this.adminUserManagementService.getPeople(this.userAccount.companyId);
      for(let person of res.people) {
          person.scope = this.scope;
          await this.adminUserManagementService.addOrUpdatePerson(person);
      }

      await this.loadUserList();
  }


  async onExportUser() {
      let data = await this.adminUserManagementService.downloadUsersList(this.currentCompany.id, this.scope);
      if(data.result) {
          let people = data.people;
          let colsWidth = [
              {wch:20},{wch:8},{wch:18},{wch:18},
              {wch:14},{wch:18},{wch:18},{wch:9},
              {wch:38},{wch:20},{wch:20},{wch:8},
              {wch:17},{wch:30},{wch:14},{wch:24},
              {wch:24},{wch:14},{wch:22},{wch:18},
              {wch:18},{wch:20},{wch:20},{wch:14},
              {wch:10},{wch:20},{wch:20},{wch:20},
              {wch:20},{wch:16},{wch:16},{wch:16},
              {wch:18},{wch:24},{wch:24},{wch:20}
          ];
          let filename = "Irina_" + this.currentCompany.name;
          if(this.scope == PERSON_SCOPE.EMPLOYEE) filename = "Irina_" + this.currentCompany.name + "_Dipendenti";
          else if(this.scope == PERSON_SCOPE.PARTNER) filename = "Irina_" + this.currentCompany.name + "_Partner";
          else if(this.scope == PERSON_SCOPE.ADVISOR) filename = "Irina_" + this.currentCompany.name + "_Consulenti";
          else if(this.scope == PERSON_SCOPE.OTHER) filename = "Irina_" + this.currentCompany.name + "_Altri";
          this.excelService.exportAsExcelFile(people, filename,colsWidth);
      }
      else {
          this.snackBar.open(this.translate.instant('INSIGHTS_PEOPLE_PAGE.ERROR DOWNLOADING'), 'OK', {
              duration: 3000,
              panelClass: 'success'
          })
      }
  }

}

