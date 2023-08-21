import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

import {Observable, of, ReplaySubject} from 'rxjs';
import {
    IState,
    JobOpening,
    Laurea,
    Person,
    Universita
} from '../../../../../../fe-common/src/lib/models/recruiting/models';
import { QueryParams } from '@ngrx/data';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';
import { TranslateService } from '@ngx-translate/core';
import {
    ConfirmDialogComponent,
    ConfirmDialogData
} from '../../../../../../fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as FileSaver from 'file-saver';
import { FiltersDialogMqsComponent } from '../components/filtering/filters-dialog/filters-dialog.component';
import { skipWhile, takeUntil } from 'rxjs/operators';
import { Configurations } from 'projects/fe-common/src/lib/configurations';
import { RecruitingCandidateManagementService } from 'projects/fe-common/src/lib/services/recruiting-candidate-management.service';
import { RecruitingApplicationManagementService } from 'projects/fe-common/src/lib/services/recruiting-application-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { saveAs } from 'file-saver';
import {RecruitingManagementService} from "fe-common/services/recruiting-management.service";
import {UserManagementService} from "fe-common/services/user-management.service";
import {UserCapabilityService} from "../../../services/user-capability.service";
import {Router} from "@angular/router";
import { DownloadPreviewDialogComponent } from '../recruiting-applications/download-preview-dialog/download-preview-dialog.component';


@Component({
    selector: 'app-recruiting-candidates',
    templateUrl: './recruiting-candidates.component.html',
    styleUrls: ['./recruiting-candidates.component.scss']
})
export class RecruitingCandidatesComponent implements OnInit {

    public univ$: Observable<Universita[]>;
    public laurea$: Observable<Laurea[]>;


    public showPersonDetail = false;
    public titleCard: string;
    public currentPerson$: Observable<Person>;
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    public applicationsDisplayedColumns = ['description','jobOpeningType', 'data_completamento', 'fitindex', 'status', 'viewDetail'];
    public frmCandidate: FormGroup;
    candidatesTableData: any = [];
    filterCandidatesTableData: any = [];
    candidatesApplicationData: any = [];
    currentPerson: any = {};
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    filteredValueTxt: any;
    queryParams: any;
    baseImageUrl: any;
    config: Configurations;
    momentTime: any = new Date().getTime();
    url: string = '';

    tableColumnTemplates: ColumnTemplate[] = [
        {
            columnCaption: this.translate.instant('RECRUITING.Surname'),
            columnName: 'Surname',
            columnDataField: 'cognome',
            columnFormatter: null,
            columnRenderer: null,
            columnTooltip: null,
            context: this,
            filterWidget: {}
        },
        {
            columnCaption: this.translate.instant('RECRUITING.Name'),
            columnName: 'Name',
            columnDataField: 'nome',
            columnFormatter: null,
            columnRenderer: null,
            columnTooltip: null,
            context: this,
            filterWidget: {}
        },
        {
            columnCaption: this.translate.instant('RECRUITING.Email'),
            columnName: 'Email',
            columnDataField: 'email',
            columnFormatter: null,
            columnRenderer: null,
            columnTooltip: null,
            context: this,
            filterWidget: {}
        },
        {
            columnCaption: this.translate.instant('RECRUITING.Laurea'),
            columnName: 'Laurea',
            columnDataField: 'laurea.description',
            columnFormatter: null,
            columnRenderer: null,
            columnTooltip: null,
            context: this,
          filterWidget: {
            widget: 'select',
            value_field: 'description',
            label_field: 'description',
            options: () => of(this.degreeListData)
          }
        },
        {
            columnCaption: this.translate.instant('RECRUITING.Voto_laurea'),
            columnName: 'Voto Laurea',
            columnDataField: 'voto_laurea',
            columnFormatter: null,
            columnRenderer: null,
            columnTooltip: null,
            context: this,
            filterWidget: {}
        },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ];

    tableRowActions: Action[] = [
        {
            tooltip: this.translate.instant('GENERAL.View'),
            image: null,
            icon: 'remove_red_eye',
            dots: true,
            color: '#000000',
            action: 'onViewUser',
            context: this
        },
        /*{
          tooltip: this.translate.instant('GENERAL.Edit'),
          image: './assets/images/account-edit.svg',
          icon: null,
          color: '#000000',
          action: 'onModifyUser',
          context: this
        },*/
    ];

    tableMainActions: Action[] = [
        {
            tooltip: this.translate.instant('CANDIDATE.Filter'),
            image: null,
            icon: 'filter_alt',
            color: '#ffffff',
            action: 'onFilterOpening',
            context: this
        },
        /*{
          tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add User'),
          image: null,
          icon: 'add_circle',
          color: '#ffffff',
          action: 'onAddUser',
          context: this
        },*/
        {
            tooltip: this.translate.instant('SURVEY.DOWNLOADREPORT'),
            image: null,
            icon: 'file_download',
            color: '#ffffff',
            action: 'onDownloadUserPresenceReport',
            context: this
        },
        {
            tooltip: this.translate.instant('Dashboard'),
            image: null,
            icon: 'analytics',
            color: '#ffffff',
            action: 'onShowPeopleDashboard',
            context: this
        },
        {
            tooltip: this.translate.instant('GENERAL.BACK'),
            image: null,
            icon: 'arrow_back',
            color: '#ffffff',
            action: 'onNavBackToChallenges',
            context: this
        },
    ];
    degreeListData: any = [];
    isAdminUser = false;

    constructor(
        @Inject(Configurations) config: Configurations,
        private translate: TranslateService,
        private recruitingCandidatesManagementService: RecruitingCandidateManagementService,
        private recruitingManagementApplicationService: RecruitingApplicationManagementService,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private commonService: CommonService,
        private userManagementService: UserManagementService,
        private userCapabilityService: UserCapabilityService,
        private recruitingManagementService: RecruitingManagementService,
        private store: Store<IState>,
        private router: Router
    ) {
        this.config = this.commonService.cloneObject(config);
        this.baseImageUrl = this.config.env.api_host + '/v1/data-storage/download/';

        const arcadiaLoggedUser = this.userManagementService.getAccount();
        const isRecruitingAll = this.userCapabilityService.isFunctionAvailable('Recruiting/all');
        this.isAdminUser = this.arrayEquals(arcadiaLoggedUser.profile, [ 'System', 'Admin']);

        if (this.isAdminUser || isRecruitingAll) {
          this.tableRowActions.push({
            tooltip: this.translate.instant('GENERAL.Delete'),
            image: null,
            icon: 'delete',
            color: '#FF0000',
            action: 'onDeleteUser',
            context: this
          });
        }
    }

    onNavBackToChallenges() {
        this.router.navigate(['insights', 'main', 'recruiting-mqs']);
    }

    arrayEquals(a, b): any {
      return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
    }

    async ngOnInit() {
        await this.loadRecruitingCandidate();
        this.frmCandidate = this.fb.group({
            id: [null],
            nome: [null],
            cognome: [null],
            email: [null],
            telefono: [null],
            data_nascita: [null],
            azienda: [null],
            titolo: [null],
            sesso: [null],
            indirizzo: [null],
            livello_studi: [null],
            univ: [null],
            laurea: [null],
            voto_laurea: [null],
            cityName: [null],
            countryName: [null],
            stateName: [null],
            nationality: [null],
            age: [null],
            doctorateDescription: [null],
            materDescription: [null],
            stateExamination: [false],
            scoreAverage: [null],
            isReadDoctorate: [false],
            isReadMaster: [false],
            isReadState: [false],
            degreeYear:[null],
            lode:[false]
        });
        this.recruitingManagementService.degreeList().then((data: any) => {
          this.degreeListData = data.data;
        });
    }

    viewJobDetails(id){
      this.router.navigate(['/insights/main/recruiting-mqs/applications'], { state: { id: id } });
    }

    async loadRecruitingCandidate() {
        const candidatesTableData: any = await this.recruitingCandidatesManagementService.getCandidateList();
        this.candidatesTableData = candidatesTableData.data;
        this.filterCandidatesTableData = candidatesTableData.data;
    }


    getFilteredElements(filter?: string, data?: any): boolean {
        if (filter !== undefined) {
            const params: QueryParams = {
                filter
            };
            // this.service.clearCache();
            // this.service.getWithQuery(params);
        }
        return true;
    }

    async onDeleteUser(person: any) {
        const res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteUser'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            const resDelete: any = await this.recruitingCandidatesManagementService.deleteDocument({ id: person.id });
            if (resDelete.result) {
                this.snackBar.open(this.translate.instant('GENERAL.CANDIDATE_DELETE_MSG'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
                await this.loadRecruitingCandidate();
            } else {
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + resDelete.message, this.translate.instant('GENERAL.OK'), { duration: 3000 });
            }
        }
    }

    onFilterOpening(element: any) {
        const config = new MatDialogConfig();
        config.width = '30%';
        config.data = {
            filters: this.filters
        };
        const dialogRef = this.dialog.open(FiltersDialogMqsComponent, config);
        dialogRef.afterClosed()
            .pipe(skipWhile(res => !res), takeUntil(this.destroyed$))
            .subscribe(filters => {
                this.tableColumnTemplates = this.tableColumnTemplates.map(col => {
                    if (Object.keys(filters).indexOf(col.columnDataField) > -1) {
                        return {
                            ...col,
                            filterValue: filters[col.columnDataField]
                        };
                    } else {
                        return col;
                    }
                });
                this.queryParams = {
                    ...filters
                };
                this.filteredValueTxt = this.queryParams;
            });
    }

    public get filters(): any {
        return this.tableColumnTemplates.filter(col => col.filterWidget);
    }

    public get activeFilters(): any {
        return this.filters.filter(col => col.filterValue);
    }

    async onViewUser(person: Person) {
        this.showPersonDetail = true;
        this.titleCard = this.translate.instant('RECRUITING.VIEW_CANDIDATE');
        this.currentPerson = person;
        person.isReadCandidate = false;
        this.frmCandidate.patchValue({
            id: person.id,
            nome: person.nome,
            cognome: person.cognome,
            email: person.email,
            telefono: person.telefono,
            data_nascita: person.data_nascita,
            azienda: person.azienda,
            titolo: person.titolo,
            sesso: this.currentPerson.sesso,
            indirizzo: person.indirizzo,
            livello_studi: person.livello_studi,
            univ: (person.univ) ? person.univ.description : null,
            laurea: (person.laurea) ? person.laurea.description : null,
            voto_laurea: person.voto_laurea,
            cityName: this.currentPerson.cityName,
            countryName: this.currentPerson.countryName,
            stateName: this.currentPerson.stateName,
            nationality: this.currentPerson.nationality,
            age: this.currentPerson.age,
            doctorateDescription: this.currentPerson.doctorateDescription,
            materDescription: this.currentPerson.materDescription,
            stateExamination: this.currentPerson.stateExamination,
            scoreAverage: this.currentPerson.scoreAverage,
            isReadDoctorate: this.currentPerson.isReadDoctorate,
            isReadMaster: this.currentPerson.isReadMaster,
            isReadState: this.currentPerson.isReadState,
            degreeYear:this.currentPerson.degreeYear,
            lode:this.currentPerson.lode
        });
        await this.loadRecruitingCandidateApplication(person.id);
        await this.recruitingCandidatesManagementService.readCandidate({id: person.id});
        this.tabgroup.selectedIndex = 1;
        this.frmCandidate.disable();
    }

    async loadRecruitingCandidateApplication(person_id) {
        const applicationsData: any = await this.recruitingManagementApplicationService.getApplicationCandidateList({ person_id });
        this.candidatesApplicationData = applicationsData.data;

    }

    onViewUserCancelClick() {
        this.tabgroup.selectedIndex = 0;
        this.showPersonDetail = false;
    }

    onAddUser() {
        this.tabgroup.selectedIndex = 1;
        this.showPersonDetail = false;
    }

    // downloadCv(): void {
    //   this.userCapabilityService.toggleLoaderVisibility(true);
    //   this.recruitingManagementApplicationService.downloadDocument(this.currentPerson.resumeId).subscribe((res: any) => {
    //         this.userCapabilityService.toggleLoaderVisibility(false);
    //         const blob = new Blob([res], { type: 'application/pdf' });
    //         FileSaver.saveAs(blob, this.currentPerson.nome + '-cv-' + this.momentTime + '.pdf');
    //     }, error => {
    //         this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.NOT FOUND'), this.translate.instant('GENERAL.OK'), {duration: 3000});
    //         this.userCapabilityService.toggleLoaderVisibility(false);
    //     });

    // }

    downloadCv(): void {
        this.userCapabilityService.toggleLoaderVisibility(true);
        this.recruitingManagementApplicationService.downloadDocument(this.currentPerson.resumeId).subscribe((res: any) => {
          this.userCapabilityService.toggleLoaderVisibility(false);
          const blob = new Blob([res], { type: 'application/pdf' });
          this.url = window.URL.createObjectURL(blob);
          this.dialog.open(DownloadPreviewDialogComponent, {
            width: "100%",
            data: {
              url: this.url,
              resumeId: this.currentPerson.resumeId,
              fileName: this.currentPerson.nome
            },
          });
        }, error => {
          this.userCapabilityService.toggleLoaderVisibility(false);
          this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.NOT FOUND'), this.translate.instant('GENERAL.OK'), {duration: 3000});
        });
    }

    downloadVideo(){
        this.userCapabilityService.toggleLoaderVisibility(true);
        this.recruitingManagementApplicationService.downloadDocument(this.currentPerson.videoId).subscribe((res: any) => {
            this.userCapabilityService.toggleLoaderVisibility(false);
        }, error => {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.NOT FOUND'), this.translate.instant('GENERAL.OK'), {duration: 3000});
            this.userCapabilityService.toggleLoaderVisibility(false);
        });

    }
  onDownloadUserPresenceReport(): void {
    let data = this.filterCandidatesTableData;
    const replacer = (key, value) => value === null ? '-' : value; // specify how you want to handle null values here
    const header = [
      'nome',
      'cognome',
      'email'
    ];
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv' });
    saveAs(blob, 'candidate-report-' + this.momentTime + '.csv');
  }

  GetChildData($event): void {
      this.filterCandidatesTableData = $event;
  }

}
