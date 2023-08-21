import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {QuizQuizService} from "../../../../../../../fe-common-v2/src/lib/services/quiz-quiz.service";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddEditSideEffectComponent } from 'projects/fe-insights-v2/src/app/popup/add-edit-side-effect/add-edit-side-effect.component';
import Swal from "sweetalert2";
import {DeletePopupComponent} from "../../../../popup/delete-popup/delete-popup.component";
// import { Answer } from 'projects/fe-insights/src/app/features/tklab-mqs/store/models';


export class Answer {
  id: number;
  value: any;
  order: number;
  question_id: number;
}

export interface PeriodicElement {
 id: any; order: any;  value: any;
}

export class Config {
  currentElement: any;
  // mode: CRUDMode;
  // service: EntityCollectionServiceBase<any>;
  service: any;
}
@Component({
  selector: 'app-add-edit-question',
  templateUrl: './add-edit-question.component.html',
  styleUrls: ['./add-edit-question.component.scss']
})
export class AddEditQuestionComponent implements OnInit {
  addQuestionForm: FormGroup;
  editQuestion = [];
  title = 'Add';
  public _form_answers: FormGroup;
  public currentElement;
  optionTable: any;
  minutesSelect = [];
  secondsSelect = [];
  visibleTimeOption: boolean =  false;
  count = 0;
  length:any;
  document: any;
  documentData: any;
  documentName: any;
  quizList:any;
  totalCount:any;
  draggedList:boolean = false;
  id: any;
  paramsID:any;



  questionTypeList = [
    {value:'SingleRadio',viewValue:'SingleRadio'},
    {value:'SingleCheck',viewValue:'SingleCheck'},
    {value:'FreeText',viewValue:'FreeText'},
  ]
  privacyList = [
    {value:'All',viewValue:'All'},
    {value:'Only Manager',viewValue:'Only Manager'},
    {value:'Only Coach',viewValue:'Only Coach'},
    {value:'Only User',viewValue:'Only User'},
    {value:'Inherit',viewValue:'Inherit'},
  ]
  minutes = [
    {value:1,viewValue:1},
    {value:2,viewValue:2},
    {value:3,viewValue:3},
    {value:4,viewValue:4},
    {value:5,viewValue:5},
    {value:6,viewValue:6},
    {value:7,viewValue:7},
    {value:8,viewValue:8},
    {value:9,viewValue:9},
    {value:10,viewValue:10}
  ]
  seconds = [
    {value:1,viewValue:1},
    {value:2,viewValue:2},
    {value:3,viewValue:3},
    {value:4,viewValue:4},
    {value:5,viewValue:5},
    {value:6,viewValue:6},
    {value:7,viewValue:7},
    {value:8,viewValue:8},
    {value:9,viewValue:9},
    {value:10,viewValue:10}
  ]


  constructor(public formBuilder: FormBuilder,
              private router: Router,
              public route: ActivatedRoute,
              public dialog: MatDialog,
              private ApiService: QuizQuizService,
              private helper: MCPHelperService,
              public translate: TranslateService) {

    const count:any =  localStorage.getItem('totalQuestionCount');
      this.totalCount = count;


    for (let i = 0; i <= 59; i++){
      this.minutesSelect.push(i);
      this.secondsSelect.push(i) ;
    }

    this.addQuestionForm = this.formBuilder.group({
      question: ['', [Validators.required]],
      code: ['', [Validators.required]],
      minutes: [''],
      seconds: [''],
      subtitle: [''],
      category: [''],
      privacy: ['', [Validators.required]],
      type: ['', [Validators.required]],
      mandatory: [false],
      question_timer_status: [false],
      answers: this.formBuilder.array([]),
      value:[''],
      order:['']
    });
    // this._form_answers = this.formBuilder.group({
    //   value: [null, [Validators.required]],
    //   order: [null, []]
    // });
  }

  get answersFields(): FormArray {
    return this.addQuestionForm.get('answers') as FormArray;
  }



  // orderList = [{order: 1, answer: ''}];
  @ViewChild('table') table: MatTable<PeriodicElement>;
  addOptionList: PeriodicElement[] = [
    //  {order: '' , value: ''}
  ];
  optionDisplayedColumns: string[] = ['drag','order', 'answer', 'sideEffect', 'action'];
  sortingOptionList : any = []

 async ngOnInit(): Promise<void>  {
     this.id = this.route.snapshot.paramMap.get('id');
     this.paramsID = this.route.snapshot.paramMap.get('id')
    if ( this.id !== '0' ) {
      this.title = 'Edit';
      // this.helper.toggleLoaderVisibility(true);
      const res: any = await this.ApiService.viewQuiz({id: this.id});
      if (res.result === true) {
        this.helper.toggleLoaderVisibility(false);
        this.editQuestion = res.reason;
        this.documentData = res.reason;
        this.optionTable = res.reason.type !== 'FreeText';
        this.addQuestionForm.patchValue({
          id: this.documentData.id,
          question: this.documentData.question,
          code: this.documentData.code,
          question_timer_status: this.documentData.question_timer_status,
          minutes: this.documentData.minutes,
          seconds: this.documentData.seconds,
          subtitle: this.documentData.subtitle,
          category: this.documentData.category,
          privacy: this.documentData.privacy,
          type: this.documentData.type,
          mandatory: this.documentData.mandatory,
          order:this.documentData.order,
          value:this.documentData.value
        });

        this.documentData.answers.forEach((b: any) => {
          this.addOptionList.push({id: b.id, order : b.order, value:b.value});
          this.answersFields.push(this.formBuilder.group(b));
        });
        this.table.renderRows();
        // let answers = this.addQuestionForm.get('answers') as FormArray;
        // answers.push(this.documentData.answers)
        // this.jobOpeningMandatory.forEach((b: any) => {
        //   this.mandatoryFields.push(this.formBuilder.group(b));
        // });
        this.helper.toggleLoaderVisibility(false);
      } else {
        this.helper.toggleLoaderVisibility(false);
        // const e = err.error;
        swal.fire(
          '',
          // err.error.message,
          this.translate.instant(res.reason),
          'info'
        );
      }
    }
   this.getQuizList({});
  }
  async getQuizList(request): Promise<void> {
    // let err: any;
    // this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getQuiz({limit: this.totalCount});
    if (res.statusCode === 200) {
      this.quizList = res.data;
      this.helper.toggleLoaderVisibility(false);
    }else {
      this.helper.toggleLoaderVisibility(false);
      // const e = err.error;
      swal.fire(
        '',
        // err.error.message,
        this.translate.instant(res.reason),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }
  // checkScope(number: Number) {
  //   for(var i = 0; i < this.quizList.length; i++){
  //     if(this.documentData.code == this.addQuestionForm.value.code){
  //       this.addQuestionForm.valid;
  //     }else{
  //       if(this.quizList[i].code !== this.addQuestionForm.value.code){
  //         this.addQuestionForm.valid;
  //       }else{
  //         this.addQuestionForm.patchValue({
  //           code:null
  //         });
  //         this.addQuestionForm.invalid;
  //         Swal.fire(
  //           '',
  //           this.translate.instant('This code is already exist.'),
  //           'info'
  //         );
  //       }
  //     }
  //   }
  // }

  async addQuestion(): Promise<void>{
    if (this.addQuestionForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.addQuestionForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const question = this.addQuestionForm.value.question;
      const code = this.addQuestionForm.value.code;
      const minutes = this.addQuestionForm.value.minutes;
      const seconds = this.addQuestionForm.value.seconds;
      const subtitle = this.addQuestionForm.value.subtitle;
      const category = this.addQuestionForm.value.category;
      const privacy = this.addQuestionForm.value.privacy;
      const type = this.addQuestionForm.value.type;
      const question_timer_status = this.addQuestionForm.value.question_timer_status;
      const mandatory = this.addQuestionForm.value.mandatory;
      const value = this.addQuestionForm.value.value;
      const order = this.addQuestionForm.value.order;
      // const answers = [{
      //   value:this.addQuestionForm.value.value,
      //   order:this.addQuestionForm.value.order
      // }]

        if (this.id === '0') {
          const res: any = await this.ApiService.addQuestion(this.addQuestionForm.value);
          if (res.result == true) {
            this.helper.toggleLoaderVisibility(false);
            this.router.navigate(['/quiz-survey/questions/']);
            swal.fire('',
              this.translate.instant('Swal_Message.Question has been added successfully'),
              'success');
          } else {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
              '',
              this.translate.instant(res.reason),
              'info'
            );
          }
        }else {
          if (this.draggedList){
            this.addQuestionForm.value.answers = this.addOptionList;
          }
          const res: any = await this.ApiService.addQuestion({
          category: category,
          code: code,
          content: '',
          id: this.id,
          mandatory: mandatory,
          minutes: minutes,
          numeric_range_max: '',
          numeric_range_min: '',
          numeric_step: '',
          privacy: privacy,
          question: question,
          question_timer_status: question_timer_status,
          seconds: seconds,
          subtitle: subtitle,
          type: type,
          widget: '',
          // order:order,
          value:value,
          //answers: this.addQuestionForm.value.answers,
          answers: this.addQuestionForm.value.answers
        });

        if (res) {
          if(res.result == true){
            this.helper.toggleLoaderVisibility(false);
            this.router.navigate(['/quiz-survey/questions/']);
            if(this.paramsID === '0'){
              swal.fire('',
                this.translate.instant('Swal_Message.Question has been added successfully'),
              'success');
            }else{
              swal.fire('',
                  this.translate.instant('Swal_Message.Question has been edited successfully'),
              'success');
            }
          }else{
            this.helper.toggleLoaderVisibility(false);
            swal.fire('',
              this.translate.instant(res.reason),
              'info'
            );
          }

        } else {
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant(res.reason),
            'info'
          );
        }
      }
    }
  }


  loadQuestion(result): void {
    //this.tklabMqsService.loadQuestionByID({id: this.config.currentElement.id}).then((data: any) => {
      this.currentElement = result;
      // this.currentElement = this.config.currentElement
      // this.last_question_type = this.currentElement?.type;
      const answers = this.addQuestionForm.get('answers') as FormArray;
      while (answers.controls.length > 0) {
        answers.removeAt(0);
      }
      for (const answer of this.currentElement.answers) {
        const config = {};
        for (const key of Object.keys(answer)) {
          config[key] = [answer[key], []];
        }
        const group = this.formBuilder.group(config);
        answers.push(group);
      }
      this.refreshAnswersList(answers);
      this.addQuestionForm.patchValue(this.currentElement);
      this.addOptionList = this.currentElement.answers
      this.table.renderRows();
    //});
  }
  refreshAnswersList(answers: FormArray = null): void {
    if (answers === null) {
      answers = this.addQuestionForm.get('answers') as FormArray;
    }
    answers.controls.sort((a, b) => a['controls']['order'].value - b['controls']['order'].value);
    //this.addOptionList.next(answers.controls);
  }

  // async edit(): Promise<void> {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if ( id !== '0' ) {
  //     this.title = 'Edit';
  //     this.helper.toggleLoaderVisibility(true);
  //     const res: any = await this.ApiService.viewQuiz({id: id});
  //     if (res.result === true) {
  //       this.helper.toggleLoaderVisibility(false);
  //       this.editQuestion = res.reason;
  //
  //     } else {
  //       this.helper.toggleLoaderVisibility(false);
  //       // const e = err.error;
  //       swal.fire(
  //         'Error!',
  //         // err.error.message,
  //         this.translate.instant('Question not found (server error)'),
  //         'info'
  //       );
  //     }
  //   }
  //   this.helper.toggleLoaderVisibility(false);
  // }


  questionTimerChange(event){
    if (event.checked){
      this.visibleTimeOption = true;
      this.addQuestionForm.patchValue({minutes: 1});
      this.addQuestionForm.patchValue({seconds: 0});
    }else {
      this.visibleTimeOption = false;
      this.addQuestionForm.patchValue({minutes: ''});
      this.addQuestionForm.patchValue({seconds: ''});
    }
  }
  // @ViewChild(MatTable) table: MatTable<PeriodicElement>;

  optionTables(): void{
    if(this.addQuestionForm.valid){
    this.optionTable = true;
    this.draggedList = false;
    this.count++;
    //if (this.count !== 1) {
      this.optionTable = true;
      const i = Math.floor(Math.random());

      this.addOptionList.push({
        value:'',
        id:'',
        order: this.addOptionList.length
      });
      // this.table.renderRows();
    //}
    let answers  = this.addQuestionForm.get('answers') as FormArray;
      const answer = new Answer();
      // answer.id = answers[]
      answer.value = '';
      answer.order = answers.length + 1;
      const config = {};
      for (const key of Object.keys(answer)) {
        config[key] = [answer[key], []];
      }
      const group = this.formBuilder.group(config);
      answers.push(group);
      this.refreshAnswersList(answers);
      if(this.id == 0){
        this.ApiService.addQuestion(this.addQuestionForm.value).then((data: any) => {
          if(data.result){
            this.id = data.data.id
            this.loadQuestion(data.data)
          }
          else{
            for (let index = 0; index < answers.value.length; index++) {
              const element = answers.value[index];
              if(!answers.value[index].id){
                answers.removeAt(index)
              }
            }
          }
        });
      }
      else{
        this.addQuestionForm.value.id = this.id
        this.ApiService.addQuestion(this.addQuestionForm.value).then((data: any) => {
          if(data.result){
            this.loadQuestion(data.data)
          }
          else{
            for (let index = 0; index < answers.value.length; index++) {
              const element = answers.value[index];
              if(!answers.value[index].id){
                answers.removeAt(index)
              }
            }
          }
        });
      }
    }
    else{
    this.addQuestionForm.markAllAsTouched();
    }


      // this.addQuestion();
      // this.loadQuestion(this.currentElement)

  }
  changeQuestion(){}

  removeData(index) {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        message: 'Are you sure do delete this item?',
        heading: 'Quiz/Survey.deleteOption'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        (this.addQuestionForm.get('answers') as FormArray).removeAt(index);
        this.addOptionList.splice(index, 1);
        this.table.renderRows();
      }
    });
  }

  drop(event: CdkDragDrop<Element[]>) {
    // const prevIndex = this.addOptionList.findIndex((d) => d === event.item.data);
    this.draggedList = true;
    moveItemInArray(this.addOptionList, event.previousIndex, event.currentIndex);
    this.addOptionList = this.addOptionList;
    if(this.id == 0){
      this.addQuestionForm.value.answers = this.addOptionList
      this.ApiService.addQuestion(this.addQuestionForm.value).then((data: any) => {
        if(data.result){
          this.id = data.data.id
          this.loadQuestion(data.data)
        }
      });
    }
    else{
      this.addQuestionForm.value.answers = this.addOptionList
      this.addQuestionForm.value.id = this.id
      this.ApiService.addQuestion(this.addQuestionForm.value).then((data: any) => {
        if(data.result){
          this.loadQuestion(data.data)
        }
      });
    }
    setTimeout(()=>{
      this.table.renderRows();
    },100);
    //this.sortingOptionList._updateChangeSubscription();
  }

  addEditSideEffect(element){
    const id = this.route.snapshot.paramMap.get('id');
    const dialogRef = this.dialog.open(AddEditSideEffectComponent, {
      data : {
        currentElement: element,
        questionId: id,
      }
    });
  }
  changeTableValue(event: any, index){
    this.addOptionList[index].value = this.addQuestionForm.value.answers[index].value
  }

  public space(event:any){
    if(event.target.selectionStart === 0 && event.code === 'Space'){
        event.preventDefault();
    }
  }

}
