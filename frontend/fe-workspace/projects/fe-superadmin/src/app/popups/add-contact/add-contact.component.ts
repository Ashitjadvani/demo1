import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/contact-type/contact-type.component';
import swal from 'sweetalert2';
import {NSApiService} from '../../service/NSApi.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {

  addContactdPopup: FormGroup;
  documentData: any;
  document: any;
  documentName: any;
  editMode: string = 'Add';
  id:any;

  constructor(
    public dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private api: NSApiService,
    public route: ActivatedRoute
  ) {

    this.addContactdPopup = this.formBuilder.group({
      id: [data.id],
      name : [data.name, Validators.required],
      status_id : [data.statusId, Validators.required]
    });
  }

  ngOnInit(): void {
// this.getContactType();
  }

  // getContactType(): any {
  //   this.api.contactType({}).subscribe((res: any) => {
  //     this.addContactdPopup = res.data;
  //   });
  // }

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

  savedDta(): void{
    // const id = this.route.snapshot.paramMap.get('id');
    this.id = this.data.id;
     if(this.id === '' || null ) {
      if (this.addContactdPopup.valid) {
        this.documentData = new FormData();
        const getInputsValues = this.addContactdPopup.value;

        for (const key in getInputsValues) {


          this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
        }

        this.documentData.append('document', this.document);

        this.api.addContact(this.addContactdPopup.value).subscribe((data: any) => {
            // this.router.navigate(['/features']);
            // this.getContactType();
            swal.fire('', data.meta.message, 'success');
          }, (err) => {
            swal.fire('Error!', err.error.message, 'info');
          }
        );

      }
     }else {
       if (this.addContactdPopup.valid) {
         this.documentData = new FormData();
         const getInputsValues = this.addContactdPopup.value;

         for (const key in getInputsValues) {


           this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
         }

         this.documentData.append('document', this.document);

         this.api.addContact(this.addContactdPopup.value).subscribe((data: any) => {
             // this.router.navigate(['/features']);
             // this.getContactType();
             swal.fire('', data.meta.message, 'success');
           }, (err) => {
             swal.fire('Error!', err.error.message, 'info');
           }
         );

       }
     }

  }

}
