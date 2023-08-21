import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-edit-province',
  templateUrl: './add-edit-province.component.html',
  styleUrls: ['./add-edit-province.component.scss']
})
export class AddEditProvinceComponent implements OnInit {

  addProvinceFrom: FormGroup;
  country: any [] = [];
  region: any [] = [];

  constructor(private _formBuilder: FormBuilder,) {
    this.addProvinceFrom = this._formBuilder.group({
      country: ['', [Validators.required]],
      region: ['', [Validators.required]],
      province: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  changeRole(){}

}
