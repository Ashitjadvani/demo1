import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/procurement-management/manage-supplier/manage-supplier.component';
import {ProcurementService} from '../../../../../fe-common-v2/src/lib/services/procurement.service';
import swal from "sweetalert2";
import {MCPHelperService} from "../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-add-edit-supplier-email',
  templateUrl: './add-edit-supplier-email.component.html',
  styleUrls: ['./add-edit-supplier-email.component.scss']
})
export class AddEditSupplierEmailComponent implements OnInit {
  supplierEmailForm: FormGroup;
  id: any = 0;
  getEmail: any;
  authorId: any;

  constructor(
    public dialogRef: MatDialogRef<AddEditSupplierEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _formBuilder: FormBuilder,
    private procurementService: ProcurementService,
    public helper: MCPHelperService,
    private translate: TranslateService,
  ) {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.authorId = authUser.person.id;
    }
    this.id = data.id;
    this.supplierEmailForm = this._formBuilder.group({
      supplierEmail: [ '', [Validators.required,MCPHelperService.noWhitespaceValidator]]
    });
  }

  ngOnInit(): void {
    this.procurementService.getSupplier({id: this.id}).then( (data) => {
      this.getEmail = data.data.companyReferenceEmail;
      this.supplierEmailForm.patchValue({
        supplierEmail : this.getEmail
      });
    }, err => {
      swal.fire(
        '',
        this.translate.instant(err.error.message),
        'info'
      );
    });
  }

  onSubmit(): void{
    if (this.supplierEmailForm.value){
      this.helper.toggleLoaderVisibility(true);
      this.procurementService.editEmail({id : this.id, companyReferenceEmail : this.supplierEmailForm.value.supplierEmail, authorId : this.authorId}).then( (data: any) => {
        swal.fire(
          '',
          //data.meta.message,
          this.translate.instant('Email updated successfully'),
          'success'
        );
        this.helper.toggleLoaderVisibility(false);
        this.dialogRef.close();
      }, err => {
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          'Sorry!',
          this.translate.instant(err.error.message),
          'info'
        );
      });
    }
  }

  onClick(result): void{
    this.dialogRef.close(result);
  }

}
