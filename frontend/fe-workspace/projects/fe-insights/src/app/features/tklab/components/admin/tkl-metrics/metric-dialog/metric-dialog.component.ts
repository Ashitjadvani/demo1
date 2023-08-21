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

	constructor(public dialogRef: MatDialogRef<MetricDialogComponent>,
	            private dialog: MatDialog,
	            private fb: FormBuilder,
	            private store: Store,
	            @Inject(MAT_DIALOG_DATA) public config: Config) {
		this._form = this.fb.group({
			id: [null],
			code: [null, [Validators.required]],
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
		this.metric_type$ = this.store.pipe(select(selectChoices, {choice: 'metric_type'}));
		this.metric_aggregation$ = this.store.pipe(select(selectChoices, {choice: 'metric_aggregation'}));
	}



	submit($event): void {
		$event.preventDefault();
		if (!this._form.valid) {
			return;
		}
		const rec = this._form.getRawValue();
		if (rec.id) {
			this.config.service.update(rec);
		} else {
			this.config.service.add(rec);
		}
		this.dialogRef.close();
	}

	delete(do_delete: boolean) {
		if (do_delete) {
			this.config.service.delete(this.currentElement.id);
		}
		this.dialogRef.close();
	}


	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
