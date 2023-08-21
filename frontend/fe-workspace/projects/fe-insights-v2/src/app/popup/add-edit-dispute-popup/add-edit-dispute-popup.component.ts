import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WhiteSpaceValidator } from '../../../../../fe-insights/src/app/store/whitespace.validator';
import { DialogData } from '../../components/master-modules/dispute-types/dispute-types.component';
import {MCPHelperService} from "../../service/MCPHelper.service";

@Component({
  selector: 'app-add-edit-dispute-popup',
  templateUrl: './add-edit-dispute-popup.component.html',
  styleUrls: ['./add-edit-dispute-popup.component.scss']
})
export class AddEditDisputePopupComponent implements OnInit {
  addDisputeForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddEditDisputePopupComponent>,
      public _formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    // console.log('data>>>>>', data.heading);
    this.addDisputeForm = this._formBuilder.group({
      description: [data.description, [Validators.required, MCPHelperService.noWhitespaceValidator]]
    });
    if (data.heading == 'Edit Alternative Field'){
      this.addDisputeForm = this._formBuilder.group({
        description: [data.value, [Validators.required, MCPHelperService.noWhitespaceValidator]]
      });
    }
  }

  ngOnInit(): void {
  }

  onClick(result: any, data: any): void{
      if (this.addDisputeForm.valid){
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

