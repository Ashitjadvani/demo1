import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WhiteSpaceValidator } from '../../../../../fe-insights/src/app/store/whitespace.validator';
import { DialogData } from '../../components/master-modules/dispute-types/dispute-types.component';
import {MCPHelperService} from "../../service/MCPHelper.service";
@Component({
  selector: 'app-add-cost-center-type',
  templateUrl: './add-cost-center-type.component.html',
  styleUrls: ['./add-cost-center-type.component.scss']
})
export class AddCostCenterTypeComponent implements OnInit {
  addCostCenterTypeform: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddCostCenterTypeComponent>,
              public _formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.addCostCenterTypeform = this._formBuilder.group({
      name: [data.description, [Validators.required, MCPHelperService.noWhitespaceValidator]]
    });
  }

  ngOnInit(): void {
  }
  onClick(result: any, data: any): void{
    this.dialogRef.afterOpened();
    this.dialogRef.close(result && data);
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
