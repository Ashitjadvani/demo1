import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import swal from "sweetalert2";
import {AddressManagementService} from "../../../../../../../fe-common-v2/src/lib/services/address-management.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-add-edit-region',
  templateUrl: './add-edit-region.component.html',
  styleUrls: ['./add-edit-region.component.scss']
})
export class AddEditRegionComponent implements OnInit {

  addRegionFrom:FormGroup
  country:any[]= []
  countryRecordFiltered:any[] = []
  public files: any;
  documentData: any;
  document: any;
  documentName: any;
  editMode = 'Add';
  button = 'Save';
  token: any;
  companyId: any;

  constructor(private _formBuilder: FormBuilder,
              private ApiService: AddressManagementService,
              private router: Router,
              private helper: MCPHelperService,
              public translate: TranslateService,
              public route: ActivatedRoute) {

    const id = this.route.snapshot.paramMap.get('id');
    if(id !== '0'){
      this.editMode = 'Edit';
      this.button = 'Update';
      this.ApiService.editRegion({id:id}).subscribe((res: any) => {
        this.documentData = res.data;
        if(res){
          this.addRegionFrom.patchValue({
            country_id: this.documentData.country_id,
            name: this.documentData.name
          });
        }
      });
    }

    this.addRegionFrom = this._formBuilder.group({
      country_id: ['',[Validators.required]],
      name: ['',[Validators.required]]

    });
  }

  ngOnInit(): void {
     this.getcountryList({});
  }
   getcountryList(request) {
    this.helper.toggleLoaderVisibility(true);
   this.ApiService.getCountryDropdown({}).subscribe((res:any)=>{
     if (res) {
       this.country = res.data;
       this.countryRecordFiltered = this.country.slice();
       this.helper.toggleLoaderVisibility(false);
     } else {
       this.helper.toggleLoaderVisibility(false);
       // const e = err.error;
       swal.fire(
         '',
         // err.error.message,
         this.translate.instant(res.reason),
         'info'
       );
     }
   })

    this.helper.toggleLoaderVisibility(false);
  }
  changeRole(){}
  addRegion(): any {
    if(this.addRegionFrom.valid){
    const id = this.route.snapshot.paramMap.get('id');
    if (id === '0') {
      this.ApiService.addRegion(this.addRegionFrom.value).subscribe(
        (data: any) => {
          if (data.statusCode === 200) {
            this.router.navigate(['/address-management/region']);
            swal.fire(
              '',
              this.translate.instant('Region added successfully'),
              'success'
            );
          } else {
            this.router.navigate(['/address-management/region']);
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
        country_id: this.addRegionFrom.value.country_id,
        name: this.addRegionFrom.value.name
      };
      this.ApiService.addRegion(formsubmitdata).subscribe(
        (data: any) => {
          if (data.statusCode === 200) {
            this.router.navigate(['/address-management/region']);
            swal.fire(
              '',
              this.translate.instant('Region edited successfully'),
              'success'
            );
          } else {
            this.router.navigate(['/address-management/region']);
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
