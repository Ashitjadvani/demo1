import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EntityCollectionServiceBase} from '@ngrx/data';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {selectChoices} from '../../../../store/selectors';
import {takeUntil} from 'rxjs/operators';
import {DialogconfirmComponent} from '../../../dialogconfirm/dialogconfirm.component';
import {CRUDMode, MetricType} from '../../../../store/models';
import {TklabMqsService} from "../../../../../../../../../fe-common/src/lib/services/tklab.mqs.service";



class Config {
	currentElement: any;
	mode: CRUDMode;
	// service: EntityCollectionServiceBase<any>;
  service: any;
}

@Component({
	selector: 'app-metric-dialog',
	templateUrl: './metric-dialog.component.html',
	styleUrls: ['./metric-dialog.component.scss']
})
export class MetricDialogComponent implements OnInit, OnDestroy {
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
	public DELETE_MODE = CRUDMode.DELETE;
	public METRIC_TYPE = MetricType;
	public _form: FormGroup;
	public readonly = false;
	public currentElement;
	public metric_type$: Observable<any>;
	public metric_aggregation$: Observable<any>;
  public metricType = [
    // {id: 'flag', label: 'flag' },
    // {id: 'text', label: 'text' },
	{id: 'numeric', label: 'numeric' }
  ];
  public metricAggregation = [
    /*{id: 'noop', label: 'no_aggregation' },*/
    {id: 'avg', label: 'avg' },
    {id: 'acc', label: 'acc' },
  ];

	constructor(public dialogRef: MatDialogRef<MetricDialogComponent>,
              private tklabMqsService: TklabMqsService,
	            private dialog: MatDialog,
	            private fb: FormBuilder,
	            private store: Store,
	            @Inject(MAT_DIALOG_DATA) public config: Config) {
		this._form = this.fb.group({
			id: [null],
			name: [null, [Validators.required]],
			description: [null, [Validators.required]],
			type: [null, [Validators.required]],
			aggregation_strategy: [null, [Validators.required]],
		});

	}

	ngOnInit(): void {
		switch (this.config.mode) {
			case CRUDMode.ADD:
			case CRUDMode.EDIT:
				this.readonly = false;
				this._form.enable();
				break;
			case CRUDMode.VIEW:
				this.readonly = true;
				this._form.disable();
				break;
		}
		this.currentElement = this.config.currentElement;
		this._form.patchValue(this.config.currentElement);
		// this.metric_type$ = this.store.pipe(select(selectChoices, {choice: 'metric_type'}));
		// this.metric_aggregation$ = this.store.pipe(select(selectChoices, {choice: 'metric_aggregation'}));
	}


  async submit($event): Promise<void> {
    $event.preventDefault();
    if (!this._form.valid) {
      return;
    }
    const rec = this._form.getRawValue();

    await this.tklabMqsService.saveAppMetric(rec);
    this.dialogRef.close(true);
  }

	async delete(do_delete: boolean): Promise<void> {
		if (do_delete) {
      await this.tklabMqsService.deleteAppMetric({id: this.currentElement.id});
		}
		this.dialogRef.close(true);
	}


	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
