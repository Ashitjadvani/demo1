import { Component, DebugElement, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TklabMqsService } from 'projects/fe-common-v2/src/lib/services/tklab.mqs.service';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';

// import { AnswerSideEffect } from '../../../../../fe-insights/src/app/features/tklab/store/models';

export class AnswerSideEffect {
  id: any;
  answer: any;
  question: any;
  effect: string;
  var_name: string;
  val_txt: string;
  val_numeric: number;
  val_bool: boolean;
  scope: string;
  metric: number;

  constructor(answer_id: any, qustion_Id: any) {
    this.id = null;
    this.answer = answer_id;
    this.question = qustion_Id;
    this.effect = null;
    this.var_name = '';
    this.val_txt = '';
    this.val_numeric = null;
    this.val_bool = false;
    this.scope = '';
    this.metric = null;
  }
}
class Config {
	currentElement: any;
  questionId: any;
  service: any;
  readonly: boolean = false;
}
@Component({
  selector: 'app-add-edit-side-effect',
  templateUrl: './add-edit-side-effect.component.html',
  styleUrls: ['./add-edit-side-effect.component.scss']
})
export class AddEditSideEffectComponent implements OnInit, OnDestroy {
  addSideEffectForm:FormGroup;
  // public side_effects$: Observable<AnswerSideEffect[]>;
  public side_effects$: AnswerSideEffect[];
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  public _form: FormGroup;
	public _form_row_config: any;

  public scopeTypes = [
    {id: 'session', label: 'Session'},
    {id: 'global', label: 'Global'},
  ];
  public sideEffectTypes = [
    {id: 'increase_by', label: 'increase_by'},
    // {id: 'set', label: 'set'},
  ];
  metricsData: any = [];
  sideEffects: any = [];
  dataSource = new MatTableDataSource<any>();
  value: any = ""
  public sideEffectDataSource$ = new BehaviorSubject<AbstractControl[]>([]);

  constructor(public dialogRef: MatDialogRef<AddEditSideEffectComponent>,
    private _formBuilder: FormBuilder,
    private tklabMqsService: TklabMqsService,
    public dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public config: Config) {

      this._form = this._formBuilder.group({
        id: [null],
        side_effects: this._formBuilder.array([])
      });

      this._form_row_config = {
        id: [],
        answer: [null, []],
        effect: [null, [Validators.required]],
        question: [null],
        val_txt: [null, []],
        val_numeric: [null, []],
        val_bool: [null, []],
        scope: [null, [Validators.required]],
        metric: [null, [Validators.required]]
      };
      this.addSideEffectForm = this._formBuilder.group({
        sideeffect: this._formBuilder.array([])
      });
    }

  ngOnDestroy(): void {
    // this._form.reset()
  }
    get sideEffectFields(): FormArray {
      return this.addSideEffectForm.get('sideeffect') as FormArray;
    }


  ngOnInit(): void {
    this.tklabMqsService.loadAppMetric().then( (data: any) => {
      this.metricsData = data.result;
    });
    if(this.config.currentElement.id)
    {
      this.tklabMqsService.loadAppMetricAnswer({answer_id: this.config.currentElement.id})
    .then(res =>{
      if(res){
        this.side_effects$ = res.result;
        console.log('this._form.get(\'side_effects\') as FormArray>>>>>', this._form.get('side_effects') as FormArray)
        const effects = this._form.get('side_effects') as FormArray;
				while (effects.controls.length > 0) {
					effects.removeAt(0);
				}
				for (const effect of this.side_effects$) {
					const config = this.rec_to_form(effect, this._form_row_config);
					const group = this._formBuilder.group(config);
					effects.push(group);
				}
				this.refreshEffectList(effects);
        this._form.patchValue(this.config.currentElement);
        console.log('this.sideEffectDataSource$>>>>>>', this.sideEffectDataSource$);
      }
    });
    }

  }
  sideEffectDisplayedColumns: string[] = ['metrics', 'sideEffect','values','scopes', 'action'];

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

  submit(){
    console.log(this._form.value)
    if(this._form.valid){
      for (let index = 0; index < this._form.value.side_effects.length; index++) {
        console.log(this._form.value.side_effects[index])
        if(this._form.value.side_effects[index].id){
          this.tklabMqsService.saveAppMetricAnswer(this._form.value.side_effects[index]).then(res => {
            console.log(res)
          })
        }
        else{
          this.tklabMqsService.saveAppMetricAnswer(this._form.value.side_effects[index]).then(res => {
            console.log(res)
          })
        }
      }
    }
    this.dialogRef.close(false);
  }

  refreshEffectList(effects: FormArray = null) {
		if (effects === null) {
			effects = this._form.get('side_effects') as FormArray;
		}
		// effects.controls.sort((a, b) => a['controls']['order'].value - b['controls']['order'].value);
		this.sideEffectDataSource$.next(effects.controls);
	}

  addSideEffect($event) {
		$event.preventDefault();
		const effects = this._form.get('side_effects') as FormArray;
		const effect = new AnswerSideEffect(this.config.currentElement.id, this.config.questionId);
		const config = {};
		// TODO Enforce reactive form validation
		for (const key of Object.keys(effect)) {
			config[key] = [effect[key], []];
		}
		const group = this._formBuilder.group(config);
		effects.push(group);
		this.refreshEffectList(effects);
	}

  getMetrixByID(id:string): any {
    return this.metricsData.filter(b => b.id === id)[0];
  }

  deleteSideEffect($event, element, index): void {
		$event.preventDefault();
    const dialogRef = this.dialog.open(DeletePopupComponent,{
      data: {message: 'Are you sure you want to delete this Side effect?', heading: 'Delete Side effect'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const comps = this._form.get('side_effects') as FormArray;
		      comps.removeAt(index);
		      this.refreshEffectList();
          if(element.value.id){
            this.tklabMqsService.deleteAppMetricAnswer(element.value.id)
          }
        }
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



}
