import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-survey',
  templateUrl: './add-edit-survey.component.html',
  styleUrls: ['./add-edit-survey.component.scss']
})
export class AddEditSurveyComponent implements OnInit {

  addSurveyForm: FormGroup;
  public QuestionFlowList: any[] = ['One at Time', 'At Together with Scrolling'];

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.addSurveyForm = this.formBuilder.group({
      titleName: ['', [Validators.required]],
      disclaimer: ['', [Validators.required]],
      QuestionFlow: ['',[Validators.required]],
      BriefDescription: ['',[Validators.required]],
      ServiceCategory: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
  }
  changeSupplier(): any {}

}
