import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import {NSApiService} from '../../../service/NSApi.service';

interface Mode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-features',
  templateUrl: './add-features.component.html',
  styleUrls: ['./add-features.component.scss']
})


export class AddFeaturesComponent implements OnInit {
  featuresForm: FormGroup;
  public files: any;
  documentData: any;
  document: any;
  documentName: any;
  editMode = 'Add';

  modes: Mode[] = [
    {value: 'In Development', viewValue: 'In Development'},
    {value: 'In QA', viewValue: 'In QA'},
    {value: 'In Staging', viewValue: 'In Staging'},
    {value: 'In Production', viewValue: 'In Production'},
  ];



  constructor(private fb: FormBuilder,
              private router: Router,
              public route: ActivatedRoute,
              private api: NSApiService)
  {
    this.files = [];

    // get id from route
    const id = this.route.snapshot.paramMap.get('id');

    // form data
    this.featuresForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      mode: ['', Validators.required],
      status_id: ['1', Validators.required],
    });


    if (id !== '0') {
      this.editMode = 'Edit';
      this.api.editRec({id: id}).subscribe((data: any) => {
        const documentData = data.data;
        this.featuresForm.patchValue({
          id: documentData.id,
          name: documentData.name,
          mode: documentData.mode,
          status_id: documentData.status_id});
        this.documentName = 'you have to select document again';
      });
    }
  }


  ngOnInit(): void {
  }

  addRec(): any {
    if (this.featuresForm.valid) {


      this.documentData = new FormData();
      const getInputsValues = this.featuresForm.value;

      for (const key in getInputsValues) {


        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }

      this.documentData.append('document', this.document);

      this.api.addFeatures(this.featuresForm.value).subscribe((data: any) => {
          this.router.navigate(['/features']);
          swal.fire('', data.meta.message, 'success');
        }, (err) => {
          swal.fire('Error!', err.error.message, 'info');
        }
      );

    }

  }

}
