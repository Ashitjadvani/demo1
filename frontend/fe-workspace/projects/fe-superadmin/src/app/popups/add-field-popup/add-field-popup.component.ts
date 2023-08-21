import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-field-popup',
  templateUrl: './add-field-popup.component.html',
  styleUrls: ['./add-field-popup.component.scss']
})
export class AddFieldPopupComponent implements OnInit {

  addFieldPopup : FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddFieldPopupComponent>,
    private _formBuilder : FormBuilder
  ) { }


  ngOnInit(): void {
    this.addFieldPopup = this._formBuilder.group({
      title : ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveField(): void {
    if (this.addFieldPopup.valid) {
      this.dialogRef.close({data: this.addFieldPopup.value.title});
    }
  }

}
