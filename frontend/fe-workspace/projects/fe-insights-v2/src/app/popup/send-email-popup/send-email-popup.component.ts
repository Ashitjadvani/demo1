import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WhiteSpaceValidator } from '../../../../../fe-insights/src/app/store/whitespace.validator';
import { DialogData } from '../../components/master-modules/dispute-types/dispute-types.component';
import {MCPHelperService} from "../../service/MCPHelper.service";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {MatInputModule} from '@angular/material/input';
@Component({
  selector: 'app-send-email-popup',
  templateUrl: './send-email-popup.component.html',
  styleUrls: ['./send-email-popup.component.scss']
})
export class SendEmailPopupComponent implements OnInit {
    sendMail: FormGroup;
    subitted=false
    config: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '24rem',
        minHeight: '4rem',
        sanitize: false,
        // placeholder: this.translate.instant('PEOPLE_MANAGEMENT.Enter text here'),
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        toolbarHiddenButtons: [
            ['insertImage'],
            ['insertVideo']
        ],
        customClasses: [
            {
                name: 'LineHeight-15px',
                class: 'LineHeight-15px',
            },
            {
                name: 'LineHeight-20px',
                class: 'LineHeight-20px',
            },
            {
                name: 'LineHeight-25px',
                class: 'LineHeight-25px',
            },
            {
                name: 'LineHeight-30px',
                class: 'LineHeight-30px',
            },
            {
                name: 'Text-justify',
                class: 'Text-justify',
            }
        ],
    };

    constructor(public dialogRef: MatDialogRef<SendEmailPopupComponent>,
              public _formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
        console.log("data",data)
      this.sendMail = this._formBuilder.group({
          subject: [data.subject,Validators.required],
          emailBody: [data.body,Validators.required]
      });

  }

  ngOnInit(): void {
  }

    onClick(result: any, data: any): void{
        this.subitted=true
        if (this.sendMail.valid){
            this.dialogRef.afterOpened();
            this.dialogRef.close(result && data);
        }

    }
    onClose(): void{
        this.dialogRef.close();
    }
    public space(event:any) {
        if (event.target.selectionStart === 0 && event.code === 'Space'){
            event.preventDefault();
        }
    }
}
