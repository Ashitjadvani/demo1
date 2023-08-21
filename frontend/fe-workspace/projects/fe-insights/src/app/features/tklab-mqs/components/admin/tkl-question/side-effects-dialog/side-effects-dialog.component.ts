import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EntityCollectionServiceBase} from '@ngrx/data';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {selectChoices} from '../../../../store/selectors';
import {Answer, AnswerSideEffect, CRUDMode, Metric, MetricType, QuestionType} from '../../../../store/models';
import {takeUntil} from 'rxjs/operators';
import {DialogconfirmComponent} from '../../../dialogconfirm/dialogconfirm.component';
import {MetricService} from '../../../../store/data.service';
import {TklabMqsService} from "../../../../../../../../../fe-common/src/lib/services/tklab.mqs.service";


class Config {
	currentElement: any;
	mode: CRUDMode;
	// service: EntityCollectionServiceBase<any>;
  service: any;
  question: any;
}

@Component({
	selector: 'app-side-effects-dialog',
	templateUrl: './side-effects-dialog.component.html',
	styleUrls: ['./side-effects-dialog.component.scss']
})
export class SideEffectsDialogComponent implements OnInit, OnDestroy {
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
	public _form: FormGroup;
	public _form_row_config: any;
	public side_effects$: Observable<AnswerSideEffect[]>;
	public loading$: Observable<boolean>;
	public readonly = false;
	public currentElement;
	public scope_types$: Observable<any>;
	public side_effect_types$: Observable<any>;
  public scopeTypes = [
    {id: 'session', label: 'Session'},
    {id: 'global', label: 'Global'},
  ];
  public sideEffectTypes = [
    {id: 'increase_by', label: 'increase_by'},
    // {id: 'set', label: 'set'},
  ];
	public metrics$: Observable<Metric[]>;
	public metrics: { [id: string]: Metric } = {};
	public sideEffectDataSource$ = new BehaviorSubject<AbstractControl[]>([]);
	public sideEffectDisplayedColumns = ['actions', 'metric', 'effect', 'val', 'scope'];
	public metric_types = MetricType;
  metricsData: any = [];
  sideEffects: any = [];
  question: any;

	constructor(public dialogRef: MatDialogRef<SideEffectsDialogComponent>,
	            private dialog: MatDialog,
	            private fb: FormBuilder,
	            private store: Store,
	            // private metricService: MetricService,
              private tklabMqsService: TklabMqsService,
	            @Inject(MAT_DIALOG_DATA) public config: Config) {
		this._form = this.fb.group({
			id: [null, [Validators.required]],
			side_effects: this.fb.array([])
		});

		this._form_row_config = {
			id: [null, []],
			answer: [null, []],
			effect: [null, [Validators.required]],
			val_txt: [null, []],
			val_numeric: [null, []],
			val_bool: [null, []],
			scope: [null, [Validators.required]],
			metric: [null, [Validators.required]]
		};
		// this.scope_types$ = this.store.pipe(select(selectChoices, {choice: 'scope'}));
		// this.side_effect_types$ = this.store.pipe(select(selectChoices, {choice: 'side_effect'}));
		// this.metrics$ = this.metricService.entities$;
		/*this.metrics$
			.pipe(takeUntil(this.destroyed$))
			.subscribe((metrics) => {
				for (const metric of metrics) {
					this.metrics[metric.id] = metric;
				}
			});*/
	}

	ngOnInit(): void {
    this.tklabMqsService.loadAppMetric().then( (data: any) => {
      this.metricsData = data.result;
    });
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
		this.question = this.config.question;
    this.tklabMqsService.loadAppMetricAnswer({answer_id: this.currentElement.id}).then( (data: any) => {
      let side_effects = data.result;
      const effects = this._form.get('side_effects') as FormArray;
      while (effects.controls.length > 0) {
        effects.removeAt(0);
      }
      for (const effect of side_effects) {
        const config = this.rec_to_form(effect, this._form_row_config);
        const group = this.fb.group(config);
        effects.push(group);
      }
      this.refreshEffectList(effects);
      this._form.patchValue(this.config.currentElement);
    });
	}

	rec_to_form(rec: any, master_config: any): any {
		const config = {};
		for (const key of Object.keys(rec)) {
			if (master_config[key]) {
				config[key] = [rec[key], master_config[key][1]];
			}
		}
		return config;
	}

	refreshEffectList(effects: FormArray = null) {
		if (effects === null) {
			effects = this._form.get('side_effects') as FormArray;
		}
		// effects.controls.sort((a, b) => a['controls']['order'].value - b['controls']['order'].value);
		this.sideEffectDataSource$.next(effects.controls);
	}

  async submit($event): Promise<void> {
    $event.preventDefault();
    if (!this._form.valid) {
      return;
    }
    const data = this._form.getRawValue();
    for (const effect of data.side_effects) {

      if (effect.id) {

        effect.question = this.question;
        await this.tklabMqsService.saveAppMetricAnswer(effect);
      } else {
        delete effect.id;

        effect.question = this.question;
        await this.tklabMqsService.saveAppMetricAnswer(effect);
      }
    }
    this.dialogRef.close(true);
  }

	async delete(do_delete: boolean) {
		if (do_delete) {
			// this.config.service.delete(this.currentElement.id);
      await this.tklabMqsService.deleteAppQuizQuestion({id: this.currentElement.id});
		}
		this.dialogRef.close(true);
	}

  getMetrixByID(id:string): any {
    return this.metricsData.filter(b => b.id === id)[0];
  }

	// Answers
	addSideEffect($event) {
		$event.preventDefault();
		const effects = this._form.get('side_effects') as FormArray;
		const effect = new AnswerSideEffect(this.currentElement.id);
		const config = {};
		// TODO Enforce reactive form validation
		for (const key of Object.keys(effect)) {
			config[key] = [effect[key], []];
		}
		const group = this.fb.group(config);
		effects.push(group);
		this.refreshEffectList(effects);
	}

	deleteAnswer($event, element, index): void {
		$event.preventDefault();
		const message = 'TKLAB.CONFIRM_DELETE';
		const manualRef = this.dialog.open(DialogconfirmComponent, {
			width: '30%',
			data: message
		});
		manualRef
			.afterClosed()
			.pipe(takeUntil(this.destroyed$))
			.subscribe(result => {
				if (result) {
					// const index = this.currentElement.answers.indexOf(element);
					const comps = this._form.get('side_effects') as FormArray;
					comps.removeAt(index);
					this.refreshEffectList();
				}
			});

	}

	deleteSideEffect($event, element, index): void {
		$event.preventDefault();
		const message = 'TKLAB.CONFIRM_DELETE';
		const manualRef = this.dialog.open(DialogconfirmComponent, {
			width: '30%',
			data: message
		});
		manualRef
			.afterClosed()
			.pipe(takeUntil(this.destroyed$))
			.subscribe(result => {
				if (result) {
					// const index = this.currentElement.answers.indexOf(element);
					const effects = this._form.get('side_effects') as FormArray;
					effects.removeAt(index);
					this.refreshEffectList();
					const id = element.get('id').value;
					if (id) {
             this.tklabMqsService.deleteAppMetricAnswer({id});
					}
				}
			});
	}

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
