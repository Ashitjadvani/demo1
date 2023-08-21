import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {JobApplicationService, JobOpeningService, UniversitaService} from '../../store/data.service';
import {BehaviorSubject, Observable, of, ReplaySubject} from 'rxjs';
import {
  CRUDMode, JobApplication, JobApplicationStatus,
  JobOpening,
  MandatoryField,
  Person, Universita
} from '../../../../../../../fe-common/src/lib/models/recruiting/models';
import {MatTabGroup} from '@angular/material/tabs';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Action} from '../../../../components/table-data-view/table-data-view.component';
import {TranslateService} from '@ngx-translate/core';
import {QueryParams} from '@ngrx/data';
import {Store} from '@ngrx/store';
import {IState} from '../../../../store/irina.reducer';
import {
  loadJobApplicationDetail, loadJobApplicationDetailSuccess,
  loadJobOpeningDetail,
  loadJobOpeningDetailSuccess,
  loadMandatoryFields
} from '../../store/actions';
import {
  selectChoices,
  selectCurrentJobApplication,
  selectCurrentJobOpening,
  selectMandatoryFields
} from '../../store/selectors';
import {skipWhile, takeUntil} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../../../../../fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnTemplate} from '../../../shared/components/models';
import {RecruitingService} from '../../../../../../../fe-common/src/lib/services/recruiting.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public choices$: Observable<any>;
  public choices: any = {};
  public showDetail = false;
  public titleCard: string;
  public currentElement$: Observable<JobApplication>;
  public currentElement: JobApplication;

  public currentOpening$: Observable<JobOpening>;
  public currentOpening: JobOpening;

  @ViewChild(MatTabGroup, {static: false}) tabgroup: MatTabGroup;
  public frmChangeStatus: FormGroup;

  public service$ = new BehaviorSubject<JobApplicationService>(null);

  constructor(
    public service: JobApplicationService,
    private jobOpeningService: JobOpeningService,
    private fb: FormBuilder,
    private store: Store<IState>,
    private translate: TranslateService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    // tslint:disable-next-line:variable-name
    private recruiting_service: RecruitingService,
    public universitaService: UniversitaService,
  ) {
    this.universitaService.getWithQuery({'limit': '1000'});
  }

  datePipe: DatePipe = new DatePipe('it-IT');

  tableColumnTemplates: ColumnTemplate[] = [
    {
      columnCaption: this.translate.instant('GENERAL.SURNAME'),
      columnName: 'Surname',
      columnDataField: 'person.cognome',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('GENERAL.NAME'),
      columnName: 'Name',
      columnDataField: 'person.nome',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('GENERAL.AGE'),
      columnName: 'Age',
      columnDataField: 'person.age',
      columnFormatter: null,
      context: this,
      filterWidget: null
    },
    {
      columnCaption: this.translate.instant('CANDIDATE.univ'),
      columnName: 'University',
      columnDataField: 'person.univ.description',
      columnFormatter: null,
      context: this,

      filterWidget: {
        widget: 'select',
        value_field: 'description',
        label_field: 'description',
        options: () => this.universitaService.entities$
      }
    },
    {
      columnCaption: this.translate.instant('CANDIDATE.degree_year'),
      columnName: 'Degree year',
      columnDataField: 'person.anno_laurea',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('CANDIDATE.voto_laurea'),
      columnName: 'Degree mark',
      columnDataField: 'person.voto_laurea',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('CANDIDATE.livello_studi'),
      columnName: 'Study level',
      columnDataField: 'person.livello_studi',
      columnFormatter: 'study_level_formatter',
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('JOB_APPLICATION.COMPLETION_DATE'),
      columnName: 'Completion Date',
      columnDataField: 'data_completamento',
      columnFormatter: 'dateColumnFormatter',
      context: this,
      filterWidget: {}
    },

    {
      columnCaption: this.translate.instant('JOB_APPLICATION.FIT_INDEX'),
      columnName: 'Fit Index',
      columnDataField: 'fitindex',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('JOB_APPLICATION.STATUS'),
      columnName: 'Status',
      columnDataField: 'status.description',
      columnFormatter: null,
      context: this,
      filterWidget: {
        widget: 'select',
        value_field: 'label',
        label_field: 'label',
        options: () => of(this.choices['application_status'])
      }
    },
    {columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, context: this}
  ];

  tableRowActions: Action[] = [
    {
      tooltip: this.translate.instant('GENERAL.View'),
      image: null,
      icon: 'remove_red_eye',
      color: '#000000',
      action: 'onViewElement',
      context: this
    },
    {
      tooltip: this.translate.instant('GENERAL.Edit'),
      image: './assets/images/account-edit.svg',
      icon: null,
      color: '#000000',
      action: 'onEditElement',
      context: this
    },
    {
      tooltip: this.translate.instant('GENERAL.Delete'),
      image: null,
      icon: 'delete',
      color: '#FF0000',
      action: 'onDeleteElement', // TODO how to make it conditional?
      context: this
    }
  ];
  tableMainActions: Action[] = [
    {
      tooltip: this.translate.instant('GENERAL.BACK'),
      image: null,
      icon: 'arrow_back',
      color: '#ffffff',
      action: 'onNavBackToChallenges',
      context: this
    },
  ];

  public forcedFilters = {};

  public historyDisplayedColumns = ['updated_at', 'to_state', 'notes', 'by']

  ngOnInit(): void {
    this.frmChangeStatus = this.fb.group({
      id: [null],
      status_id: [null, [Validators.required]],
      notes: [null, [Validators.required]]
    });

    this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      if (params.opening_id) {
        this.forcedFilters = {opening_id: params.opening_id};
        this.currentOpening$ = this.jobOpeningService.getByKey(params.opening_id);
        this.currentOpening$.subscribe(data => this.currentOpening = data);
      }
      this.service$.next(this.service);
    });
    this.choices$ = this.store.select(selectChoices());
    this.choices$.pipe(takeUntil(this.destroyed$)).subscribe(choices => this.choices = choices)
    this.currentElement$ = this.store.select(selectCurrentJobApplication());
    this.currentElement$.pipe(takeUntil(this.destroyed$), skipWhile(val => !val)).subscribe((element: JobApplication) => {
      this.frmChangeStatus.patchValue(element);
      this.currentElement = element;
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete()
  }


  async onViewElement(element: JobApplication) {
    this.loadElement(element, CRUDMode.VIEW);
  }

  async onEditElement(element: JobApplication) {
    this.loadElement(element, CRUDMode.EDIT);
  }

  loadElement(element: JobApplication, mode: CRUDMode): void {
    this.showDetail = true;
    this.titleCard = this.translate.instant('JOB_APPLICATION.VIEW_DETAIL');
    if (element.id) {
      this.store.dispatch(loadJobApplicationDetail({payload: {pk: element.id}}));
    } else {
      this.store.dispatch(loadJobApplicationDetailSuccess({payload: {detail: element}}));
    }
    if ([CRUDMode.EDIT, CRUDMode.ADD].indexOf(mode) > -1) {
      this.frmChangeStatus.enable();
    } else {
      this.frmChangeStatus.disable();
    }
    this.tabgroup.selectedIndex = 1;
  }

  onCancelClick(): void {
    this.tabgroup.selectedIndex = 0;
    this.showDetail = false;
    this.store.dispatch(loadJobApplicationDetailSuccess({payload: {detail: null}}));
  }

  onSubmit($event): void {
    $event.preventDefault();
    if (!this.frmChangeStatus.valid) {
      return;
    }
    const rec = this.frmChangeStatus.getRawValue();
    let sub$: Observable<any> = null;
    sub$ = this.recruiting_service.setApplicationStatus(rec);
    sub$.pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
          this.frmChangeStatus.reset()
          this.service.getByKey(rec.id)
          this.onCancelClick();
        },
        error => {
        }
      );
  }

  async onDeleteElement(opening: JobOpening) {
    let res = await this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: new ConfirmDialogData(this.translate.instant('JOB_OPENING.ToolTipDelete'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
    }).afterClosed().toPromise();
    if (res) {
      const res = await this.service.delete(opening.id)
      res.pipe(takeUntil(this.destroyed$)).subscribe(
        () => {
        },
        error => {
          alert(error.message)
        });
    }
  }

  dateColumnFormatter(fieldValue: any): string {
    try {
      if (fieldValue) {
        return this.datePipe.transform(new Date(fieldValue), 'dd/MM/yyyy');
      } else {
        return '';
      }
    } catch (ex) {
      console.error('dateColumnFormatter exception: ', ex);
    }

    return '#NA';
  }

  study_level_formatter(fieldValue: any): string {
    const decoded = this.choices['livello_studi']?.filter(item => item.id == fieldValue)
    if (decoded.length > 0) {
      return decoded[0].label;
    }
    return '';
  }

  onNavBackToChallenges() {
    this.router.navigate(['insights', 'main', 'recruiting', 'openings']);
  }

  parseApplicant(app: JobApplication): string {
    if (app.person !== undefined) {
      return `${app.person?.nome} ${app.person?.cognome}`;
    } else {
      return '-';
    }
  }

  isStatusEnabled(status: JobApplicationStatus): boolean {
    const matrix = this.choices.application_status_matrix[this.currentElement.status.status]
    if (matrix) {
      return matrix.indexOf(status.status) > -1 || status.status == this.currentElement.status.status;
    }
    return false;
  }
}
