import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../components/recruiting/job-applications/job-applications.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import swal from "sweetalert2";
import {ProcurementService} from "../../../../../fe-common-v2/src/lib/services/procurement.service";
import { TranslateService } from '@ngx-translate/core';
import { MCPHelperService } from '../../service/MCPHelper.service';

@Component({
  selector: 'app-add-edit-service-agreement-popup',
  templateUrl: './add-edit-service-agreement-popup.component.html',
  styleUrls: ['./add-edit-service-agreement-popup.component.scss']
})
export class AddEditServiceAgreementPopupComponent implements OnInit {

  serviceAgreementForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private procurementService: ProcurementService,
    public dialogRef: MatDialogRef<AddEditServiceAgreementPopupComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
    this.serviceAgreementForm = this.formBuilder.group({
      id : [this.data.id],
      serviceId : [this.data.serviceId, Validators.required],
      serviceAgreement : [this.data.serviceAgreement,[Validators.required,MCPHelperService.noWhitespaceValidator]]
    });
  }

  ngOnInit(): void {
  }

  onNoClick(): void{
    this.dialogRef.close({result: false});
  }

  onSubmit(): void {
    if (this.serviceAgreementForm.valid) {
      this.procurementService.saveServiceAgreementByID(this.serviceAgreementForm.value).then((data: any) => {
        const serviceData = data.data;
        this.dialogRef.close({result: true, data: serviceData});
        swal.fire(
          '',
          // data.meta.message,
          this.translate.instant('Swal_Message.Service agreement added successfully'),
          'success'
        );
      }, (err) => {
        swal.fire(
          '',
          this.translate.instant(err.error.message),
          'info'
        );
      });
    }
  }
}
