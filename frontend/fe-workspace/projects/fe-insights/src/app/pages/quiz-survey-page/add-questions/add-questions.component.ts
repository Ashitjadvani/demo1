import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table/table-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {
  insertSurveyForm:FormGroup;
  userColumns: string[] = ['order', 'answer','sideEffect' ,'action'];
  // userDataSource :any= new MatTableDataSource([]);
  // userId :string|null ="0";
  // @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  // @ViewChild(MatSort) sort: MatSort | undefined;

  @Input() currentEditPerson: Person;
  constructor(private _formBuilder: FormBuilder,
    private router: Router,
    public route: ActivatedRoute) {

      this.insertSurveyForm = this._formBuilder.group({
        question:['',Validators.required],
        subtitle: ['',Validators.required],
        privacy:['',Validators.required],
        questionType:['',Validators.required]
       });

     }

  ngOnInit() {
  }
  surveyPrivacy: any = [
    { value: 1, valueName: 'ALL' },
    { value: 2, valueName: 'Only_Manager'},
    { value: 3, valueName: 'Only_Coach'},
    { value: 4, valueName: 'Only_User'},
    { value: 5, valueName: 'Inherit'}
  ]
  questionTypes:any=[
    { value: 1, valueName: 'singleList' },
    { value: 2, valueName: 'multipleList'},
    { value: 3, valueName: 'singleRadio'},
  ]
  onSaveInsertedData(){

  }

}
