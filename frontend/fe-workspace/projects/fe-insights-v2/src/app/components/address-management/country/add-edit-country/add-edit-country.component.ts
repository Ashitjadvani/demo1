import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AddressManagementService} from "../../../../../../../fe-common-v2/src/lib/services/address-management.service";
import swal from "sweetalert2";

@Component({
  selector: 'app-add-edit-country',
  templateUrl: './add-edit-country.component.html',
  styleUrls: ['./add-edit-country.component.scss']
})
export class AddEditCountryComponent implements OnInit {

  addCountryFrom:FormGroup
  public files: any;
  documentData: any;
  document: any;
  documentName: any;
  editMode = 'Add';
  button = 'Save';
  token: any;
  companyId: any;

  constructor(private _formBuilder: FormBuilder,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              public route: ActivatedRoute,
              private ApiService: AddressManagementService) {

    const id = this.route.snapshot.paramMap.get('id');
    if(id !== '0'){
      this.editMode = 'Edit';
      this.button = 'Update';
      this.ApiService.editCountry({id:id}).subscribe((res: any) => {
        this.documentData = res.data;
        if(res){
          this.addCountryFrom.patchValue({
            id: this.documentData.id,
            name: this.documentData.name
          });
        }
      });
    }

    this.addCountryFrom = this._formBuilder.group({
      name: ['',[Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  addAccount(): any {
    const id = this.route.snapshot.paramMap.get('id');
    if(this.addCountryFrom.valid){
    if (id === '0') {
      this.ApiService.addCountry(this.addCountryFrom.value).subscribe(
        (data: any) => {
          if (data.statusCode === 200) {
            this.router.navigate(['/address-management/country']);
            swal.fire(
              '',
              this.translate.instant('Country added successfully'),
              'success'
            );
          } else {
            this.router.navigate(['/address-management/country']);
            swal.fire(
              '',
              this.translate.instant(data.meta.message),
              'info'
            );
          }
        },
        (err) => {
          swal.fire(
            '',
            this.translate.instant(err.error.message),
            'info'
          );
        }
      );

    } else {
      let formsubmitdata = {
        id: id,
        name: this.addCountryFrom.value.name
      };
      this.ApiService.addCountry(formsubmitdata).subscribe(
        (data: any) => {
          if (data.statusCode === 200) {
            this.router.navigate(['/address-management/country']);
            swal.fire(
              '',
              this.translate.instant('Country edited successfully'),
              'success'
            );
          } else {
            this.router.navigate(['/address-management/country']);
            swal.fire(
              '',
              this.translate.instant(data.meta.message),
              'info'
            );
          }
        },
        (err) => {
          swal.fire(
            '',
            this.translate.instant(err.error.message),
            'info'
          );
        }
      );
    }
  }
  }
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
