import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';


export interface tagsName {
  name: string;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public Tags: tagsName[] = [];

  generalInformationForm: FormGroup;
  contactInformationForm: FormGroup;
  domainConfigurationForm: FormGroup;
  featuresForm: FormGroup;
  adminLoginForm: FormGroup;

  public ctrlColors = [
    {color: "#782B90"}
  ];

  constructor(private _formBuilder: FormBuilder) { 
    this.generalInformationForm = this._formBuilder.group({
      userName: ['', Validators.required],
      surname: ['', Validators.required],
      fiscalCode: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: ['', Validators.required],
      prov: ['', Validators.required],
    });
    this.contactInformationForm = this._formBuilder.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      prov: ['', Validators.required],
      cap: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.domainConfigurationForm = this._formBuilder.group({
      mcp: ['', Validators.required],
      userLandingPage: ['', Validators.required],
      touchpoints: ['', Validators.required],
      companionApp: ['', Validators.required],
      moduloRecruiting: ['', Validators.required],
    });
    this.featuresForm = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.adminLoginForm = this._formBuilder.group({
      adminName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.Tags.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  remove(Tags: tagsName): void {
    const index = this.Tags.indexOf(Tags);

    if (index >= 0) {
      this.Tags.splice(index, 1);
    }
  }


  onFileChanged(input: HTMLInputElement): void {
  }
 
  onKeyUp(event : any){
}

}
