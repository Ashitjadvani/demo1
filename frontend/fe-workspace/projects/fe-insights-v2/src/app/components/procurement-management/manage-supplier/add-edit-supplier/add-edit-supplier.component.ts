import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MCPHelperService} from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import {ProcurementService} from '../../../../../../../fe-common-v2/src/lib/services/procurement.service';
import swal from 'sweetalert2';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-edit-supplier',
  templateUrl: './add-edit-supplier.component.html',
  styleUrls: ['./add-edit-supplier.component.scss']
})
export class AddEditSupplierComponent implements OnInit {
  addSupplierForm: FormGroup;
  authorId : any;
  public serviceCategoryList = [];

  constructor(
    private formBuilder: FormBuilder,
    private Api: MCPHelperService,
    private router: Router,
    private procurementService: ProcurementService,
    public helper: MCPHelperService,
    public translate: TranslateService
  ) {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.authorId = authUser.person.id;
    }
    this.addSupplierForm = this.formBuilder.group({
      id: [null],
      companyName: [null, Validators.required],
      companyReferenceEmail: [null, Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$'), ])],
      //companyWebsiteURL: [null, Validators.required],
      //companyDescription: [null, Validators.required],
      briefDescription: [null, Validators.required],
      serviceCategory: [[], Validators.required],
      authorId : this.authorId
    });
  }

  ngOnInit(): void {
    this.procurementService.loadServiceSupplierList().then( (data) => {
        this.serviceCategoryList = data.data;
      }, (error) => {

      });
  }

  onSubmit(): any {
    if (this.addSupplierForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.procurementService.saveSupplier(this.addSupplierForm.value).then((data: any) => {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['manage-supplier']);
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
