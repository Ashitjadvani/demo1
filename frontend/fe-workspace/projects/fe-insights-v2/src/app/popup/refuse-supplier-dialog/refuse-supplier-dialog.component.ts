import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../../components/dashboard/dashboard.component';
import {ProcurementService} from '../../../../../fe-common-v2/src/lib/services/procurement.service';
import swal from 'sweetalert2';
import {MCPHelperService} from '../../service/MCPHelper.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-refuse-supplier-dialog',
  templateUrl: './refuse-supplier-dialog.component.html',
  styleUrls: ['./refuse-supplier-dialog.component.scss']
})
export class RefuseSupplierDialogComponent implements OnInit {
  addSupplierForm: FormGroup;
  authorId: any;
  constructor(
    public dialogRef: MatDialogRef<RefuseSupplierDialogComponent>,
    private formBuilder: FormBuilder,
    private procurementService: ProcurementService,
    public helper: MCPHelperService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.authorId = authUser.person.id;
    }
    this.addSupplierForm = this.formBuilder.group({
      id: [this.data.id],
      status: [this.data.status],
      reason: [null],
      authorId : this.authorId
    });
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.helper.toggleLoaderVisibility(true);
    this.procurementService.serviceAcceptReject(this.addSupplierForm.value).then((data: any) => {
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
