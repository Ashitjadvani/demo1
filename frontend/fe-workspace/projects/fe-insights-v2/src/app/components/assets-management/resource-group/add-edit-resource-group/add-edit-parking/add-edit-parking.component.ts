import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-parking',
  templateUrl: './add-edit-parking.component.html',
  styleUrls: ['./add-edit-parking.component.scss']
})
export class AddEditParkingComponent implements OnInit {

  addResourceGroupForm:FormGroup



  constructor(private _formBuilder: FormBuilder,) { 
    this.addResourceGroupForm = this._formBuilder.group({
      availabilityStartTime: ['',[Validators.required]],
      visibilityHours: ['',[Validators.required]],
      reservePool:['',[Validators.required]],
      priorityStart:['',[Validators.required]],
      priorityEnd:['',[Validators.required]],
      priorityTag:['',[Validators.required]],
      helpButtonText: ['',[Validators.required]],
      helpPhoneNo: ['',[Validators.required]],
      refreshMessage: ['',[Validators.required]],
      enableEventRefreshPark: [''],
      refreshInterval: ['',[Validators.required]],
      enableEventAutoBook: ['']

    });
  }

  ngOnInit(): void {
  }

  changeRole(){}
}
