import { Component, OnInit } from '@angular/core';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-edit-rfq',
  templateUrl: './add-edit-rfq.component.html',
  styleUrls: ['./add-edit-rfq.component.scss']
})
export class AddEditRFQComponent implements OnInit {

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '13rem',
    minHeight: '4rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold'],
      ['insertImage'],
      ['insertVideo']
    ],
  };

  addRFQForm: FormGroup;
  public priorityList: any[] = ['High', 'Low'];
  public statusList: any[] = ['Open', 'Close'];

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.addRFQForm = this.formBuilder.group({
      RFQNameEnglish: ['', [Validators.required]],
      RFQNameItalian: ['', [Validators.required]],
      longDescriptionENG: [''],
      longDescriptionIT: [''],
      RFQPriority: [''],
      RFQDueDate: [''],
      RFQStatus: [''],
      RFQBudget : ['']
    });

  }


  ngOnInit(): void {
  }

  changeRFQ(): any {

  }

}
