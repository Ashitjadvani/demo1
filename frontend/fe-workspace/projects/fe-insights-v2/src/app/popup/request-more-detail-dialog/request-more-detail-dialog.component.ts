import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import swal from 'sweetalert2';
import {ProcurementService} from '../../../../../fe-common-v2/src/lib/services/procurement.service';
import {MCPHelperService} from '../../service/MCPHelper.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-request-more-detail-dialog',
  templateUrl: './request-more-detail-dialog.component.html',
  styleUrls: ['./request-more-detail-dialog.component.scss']
})
export class RequestMoreDetailDialogComponent implements OnInit {
  addRequestDetailsForm: FormGroup;
  authorId: any;
  constructor(
    public dialogRef: MatDialogRef<RequestMoreDetailDialogComponent>,
    private formBuilder: FormBuilder,
    private procurementService: ProcurementService,
    public helper: MCPHelperService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any ) {
      const credentials = localStorage.getItem('credentials');
      if (credentials) {
        const authUser: any = JSON.parse(credentials);
        this.authorId = authUser.person.id;
      }
    }

  ngOnInit(): void {
    this.addRequestDetailsForm = this.formBuilder.group({
      id: [this.data.id],
      status: [this.data.status],
      reason: ['', [Validators.required]],
      authorId : this.authorId
    });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.addRequestDetailsForm.valid){
      this.helper.toggleLoaderVisibility(true);
      this.procurementService.requestMoreDetailAPI(this.addRequestDetailsForm.value).then((data: any) => {
        this.helper.toggleLoaderVisibility(false);
        this.dialogRef.close(true);
        swal.fire(
          '',
          this.translate.instant(data.meta.message),
          'success'
        );
      }, (err) => {
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(err.error.message),
          'info'
        );
      });
    }
  }
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
