
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table/table-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
@Component({
  selector: 'app-insert-survey',
  templateUrl: './insert-survey.component.html',
  styleUrls: ['./insert-survey.component.scss']
})
export class InsertSurveyComponent implements OnInit {
  insertSurveyForm:FormGroup;
  userColumns: string[] = ['order', 'question', 'addQuestion'];
  // userDataSource :any= new MatTableDataSource([]);
  // userId :string|null ="0";
  // @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  // @ViewChild(MatSort) sort: MatSort | undefined;

  @Input() currentEditPerson: Person;




  constructor(private _formBuilder: FormBuilder,
    private router: Router,
    public route: ActivatedRoute) {
      this.insertSurveyForm = this._formBuilder.group({
        title:['',Validators.required],
        subtitle: ['',Validators.required],
        startdate:['',Validators.required],
        oncompletion:['',Validators.required],
        disclaimer:['',Validators.required],
        enddate:['',Validators.required],
        privacy:['',Validators.required],
      });
    }

    ngOnInit(): void {

    }
    surveyPrivacy: any = [
      { value: 1, valueName: 'ALL' },
      { value: 2, valueName: 'Only_Manager'},
      { value: 3, valueName: 'Only_Coach'},
      { value: 4, valueName: 'Only_User'},
      { value: 5, valueName: 'Inherit'}
    ]

    onSaveInsertedData(){

    }
    addNewQuestion(){
      this.router.navigate([ '/quiz-survey-listing/addQuestion' ])
    }
}

