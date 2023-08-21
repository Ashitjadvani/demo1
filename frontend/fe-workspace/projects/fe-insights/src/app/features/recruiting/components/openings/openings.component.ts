import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {JobOpeningService} from '../../store/data.service';
import {Observable, ReplaySubject} from 'rxjs';
import {
  CRUDMode,
  JobOpening,
  MandatoryField,
  Person
} from '../../../../../../../fe-common/src/lib/models/recruiting/models';
import {MatTabGroup} from '@angular/material/tabs';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Action, ColumnTemplate} from '../../../../components/table-data-view/table-data-view.component';
import {TranslateService} from '@ngx-translate/core';
import {QueryParams} from '@ngrx/data';
import {Store} from '@ngrx/store';
import {IState} from '../../../../store/irina.reducer';
import {loadJobOpeningDetail, loadJobOpeningDetailSuccess, loadMandatoryFields} from '../../store/actions';
import {selectChoices, selectCurrentJobOpening, selectMandatoryFields} from '../../store/selectors';
import {filter, skipWhile, takeUntil, tap} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../../../../../fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-openings',
  templateUrl: './openings.component.html',
  styleUrls: ['./openings.component.scss']
})
export class OpeningsComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public elements$: Observable<JobOpening[]>;
  public elementFilter = '';
  public loading$: Observable<boolean>;
  public choices$: Observable<any>;
  public showDetail = false;
  public titleCard: string;
  public currentElement$: Observable<JobOpening>;
  public currentElement: JobOpening;
  @ViewChild(MatTabGroup, {static: false}) tabgroup: MatTabGroup;


  public frmDetail: FormGroup;
  public mandatoryFields$: Observable<MandatoryField[]>;
  private mandatoryFieldsConf: any = {};
  public Editor = ClassicEditor;

  constructor(
    public service: JobOpeningService,
    private fb: FormBuilder,
    private store: Store<IState>,
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.loading$ = this.service.loading$;
    this.elements$ = this.service.entities$;
  }

  datePipe: DatePipe = new DatePipe('it-IT');

  tableColumnTemplates: ColumnTemplate[] = [
    {
      columnCaption: this.translate.instant('JOB_OPENING.code'),
      columnName: 'Code',
      columnDataField: 'code',
      columnFormatter: null,
      context: this
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.description'),
      columnName: 'Description',
      columnDataField: 'description',
      columnFormatter: null,
      context: this,
      filterWidget: {}
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.start'),
      columnName: 'Start',
      columnDataField: 'start',
      columnFormatter: 'dateColumnFormatter',
      context: this
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.end'),
      columnName: 'End',
      columnDataField: 'end',
      columnFormatter: 'dateColumnFormatter',
      context: this
    },
    {
      columnCaption: this.translate.instant('JOB_OPENING.STATUS'),
      columnName: 'Status',
      columnDataField: 'status',
      columnFormatter: null,
      context: this
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
    },
    {
      tooltip: this.translate.instant('JOB_OPENING.Inspect'),
      image: null,
      icon: 'manage_search',
      color: '#0000FF',
      action: 'onInpsectOpening',
      context: this
    }
  ];
  tableMainActions: Action[] = [
    {
      tooltip: this.translate.instant('JOB_OPENING.ADD'),
      image: null,
      icon: 'add_circle',
      color: '#ffffff',
      action: 'onAddOpening',
      context: this
    },
  ];

  ngOnInit(): void {
    // this.service.getWithQuery({});

    this.currentElement$ = this.store.select(selectCurrentJobOpening());
    this.currentElement$.pipe(takeUntil(this.destroyed$), filter(val => val && val !== null)).subscribe((element: JobOpening) => {
      if (element.mandatory_fields === null) {
        element.mandatory_fields = {}
        for (const field in this.mandatoryFieldsConf) {
          element.mandatory_fields[field] = false;
        }
      }
      this.frmDetail?.patchValue(element);
      this.currentElement = element;
    });
    this.choices$ = this.store.select(selectChoices());

    this.store.dispatch(loadMandatoryFields());
    this.mandatoryFields$ = this.store.select(selectMandatoryFields());
    this.mandatoryFields$.pipe(takeUntil(this.destroyed$)).subscribe(fields => {
      this.mandatoryFieldsConf = {};
      for (const field of fields) {
        this.mandatoryFieldsConf[field.field] = [null];
      }
      this.frmDetail = this.fb.group({
        id: [null],
        code: [null],
        description: [null, [Validators.required]],
        start: [null, [this.validateStart.bind(this)]],
        end: [null, [this.validateEnd.bind(this)]],
        status: [null],
        site: [null, [Validators.required]],
        mandatory_fields: this.fb.group(this.mandatoryFieldsConf)
      });
    })
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete()
  }

  validateStart(formControl: AbstractControl) {
    return null;
    if (formControl && formControl.parent) {
      const frmgrp = formControl.parent.controls;
      if (frmgrp['end'].value !== null && formControl.value > frmgrp['end'].value) {
        return {startGtEnd: true};
      }
    }
    return null;
  }

  validateEnd(formControl: AbstractControl) {
    return null;
    if (formControl && formControl.parent) {
      const frmgrp = formControl.parent.controls;
      if (frmgrp['start'].value !== null && formControl.value < frmgrp['start'].value) {
        return {endLtStart: true};
      }
    }
    return null;
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

  async onAddOpening() {
    const element = new JobOpening();
    this.loadElement(element, CRUDMode.ADD);
  }

  async onViewElement(element: JobOpening) {
    this.loadElement(element, CRUDMode.VIEW);
  }

  async onEditElement(element: JobOpening) {
    this.loadElement(element, CRUDMode.EDIT);
  }

  loadElement(element: JobOpening, mode: CRUDMode) {
    this.showDetail = true;
    this.titleCard = this.translate.instant('JOB_OPENING.VIEW_DETAIL');
    if (element.id) {
      this.store.dispatch(loadJobOpeningDetail({payload: {pk: element.id}}));
    } else {
      this.store.dispatch(loadJobOpeningDetailSuccess({payload: {detail: element}}));
    }
    if ([CRUDMode.EDIT, CRUDMode.ADD].indexOf(mode) > -1) {
      this.frmDetail.enable();
    } else {
      this.frmDetail.disable();
    }
    this.tabgroup.selectedIndex = 1;
  }

  onCancelClick(): void {
    this.tabgroup.selectedIndex = 0;
    this.showDetail = false;
    this.store.dispatch(loadJobOpeningDetailSuccess({payload: {detail: null}}));
  }

  onSubmit($event) {
    $event.preventDefault();
    if (!this.frmDetail.valid) {
      return;
    }
    const rec = this.frmDetail.getRawValue();
    let sub$: Observable<any> = null
    if (rec.id) {
      sub$ = this.service.update(rec);
    } else {
      sub$ = this.service.add(rec);
    }
    sub$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
      this.onCancelClick();
    });
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

  onInpsectOpening(opening: JobOpening) {
    this.router.navigate(['insights', 'main', 'recruiting', 'applications', opening.id]);
  }
}
