import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LaureaService, PersonService, UniversitaService } from '../../store/data.service';
import { Observable } from 'rxjs';
import { IState, Laurea, Person, Universita } from '../../../../../../../fe-common/src/lib/models/recruiting/models';
import { QueryParams } from '@ngrx/data';
import { Action, ColumnTemplate } from '../../../../components/table-data-view/table-data-view.component';
import { TranslateService } from '@ngx-translate/core';
import {
    ConfirmDialogComponent,
    ConfirmDialogData
} from '../../../../../../../fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { loadPersonDetail } from '../../store/actions';
import { selectCurrentPerson } from '../../store/selectors';
import { RecruitingService } from '../../../../../../../fe-common/src/lib/services/recruiting.service';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-candidates',
    templateUrl: './candidates.component.html',
    styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {

    public univ$: Observable<Universita[]>;
    public laurea$: Observable<Laurea[]>;


    public showPersonDetail = false;
    public titleCard: string;
    public currentPerson$: Observable<Person>;
    public currentPerson: Person;
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;

    public frmCandidate: FormGroup;

    public applicationsDisplayedColumns = ['description', 'data_completamento', 'fitindex', 'status'];


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
            columnRenderer: null,
            columnTooltip: null,
            columnFormatter: null,
            context: this
        },
        {
            columnCaption: this.translate.instant('RECRUITING.Laurea'),
            columnName: 'Laurea',
            columnDataField: 'laurea.description',
            columnFormatter: null,
            columnRenderer: null,
            columnTooltip: null,
            context: this
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
        {
            tooltip: this.translate.instant('GENERAL.Delete'),
            image: null,
            icon: 'delete',
            color: '#FF0000',
            action: 'onDeleteUser',
            context: this
        }
    ]

    tableMainActions: Action[] = [
        {
            tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add User'),
            image: null,
            icon: 'add_circle',
            color: '#ffffff',
            action: 'onAddUser',
            context: this
        },
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
        }
    ]

    constructor(
        public service: PersonService,
        public laureaService: LaureaService,
        public universitaService: UniversitaService,
        private translate: TranslateService,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private store: Store<IState>,
        private recruiting_service: RecruitingService
    ) {
        this.laurea$ = this.laureaService.entities$;
        this.univ$ = this.universitaService.entities$;
        this.laureaService.getWithQuery({ 'limit': '1000' });
        this.universitaService.getWithQuery({ 'limit': '1000' });
    }

    ngOnInit(): void {
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
            univ_id: [null],
            laurea_id: [null],
            voto_laurea: [null],
        });

        this.currentPerson$ = this.store.select(selectCurrentPerson());
        this.currentPerson$.subscribe(person => {
            this.currentPerson = person
            this.frmCandidate.patchValue(person);
        });
    }


    getFilteredElements(filter?: string, data?: any): boolean {
        if (filter !== undefined) {
            const params: QueryParams = {
                filter
            };
            this.service.clearCache();
            this.service.getWithQuery(params);
        }
        return true;
    }

    async onDeleteUser(person: Person) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteUser'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            const res = await this.service.delete(person.id)

        }
    }

    async onViewUser(person: Person) {
        this.showPersonDetail = true;
        this.titleCard = this.translate.instant('RECRUITING.VIEW_CANDIDATE');
        this.store.dispatch(loadPersonDetail({ payload: { pk: person.id } }));
        this.tabgroup.selectedIndex = 1;
        this.frmCandidate.disable();
    }

    onViewUserCancelClick() {
        this.tabgroup.selectedIndex = 0;
        this.showPersonDetail = false
    }

    onAddUser() {
        this.tabgroup.selectedIndex = 1;
        this.showPersonDetail = false;
    }

    downloadCv(): void {
        this.recruiting_service.downloadCv(this.currentPerson.id).subscribe((res: any) => {
            const blob = new Blob([res], { type: 'application/pdf' });
            FileSaver.saveAs(blob, this.currentPerson.cognome + "_" + this.currentPerson.nome + ".pdf");
        });
    }

}
