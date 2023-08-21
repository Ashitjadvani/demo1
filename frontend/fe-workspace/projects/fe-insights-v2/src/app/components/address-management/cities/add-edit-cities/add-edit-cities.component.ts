import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import swal from "sweetalert2";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AddressManagementService} from "../../../../../../../fe-common-v2/src/lib/services/address-management.service";

@Component({
  selector: 'app-add-edit-cities',
  templateUrl: './add-edit-cities.component.html',
  styleUrls: ['./add-edit-cities.component.scss']
})
export class AddEditCitiesComponent implements OnInit {
  addCitiesFrom: FormGroup;
  country: any [] = [];
  countryRecordFiltered:any[] = [];
  region: any [] = [];
  regionRecordFiltered:any[]=[];
  public files: any;
  documentData: any;
  document: any;
  documentName: any;
  editMode = 'Add';
  button = 'Save';
  selectedRegion:any
  provListRecordFiltered:any;
  provList = [
    // 'AG', 'AL', 'AN', 'AO', 'AR ', 'AP', 'AT', 'AV',
    // 'BA', 'BT', 'BL', 'BN', 'BG', 'BI', 'BO', 'BZ', 'BS', 'BR',
    // 'CA', 'CL', 'CB', 'CE', 'CT', 'CZ', 'CH', 'CO', 'CS', 'CR', 'KR', 'CN',
    // 'EN',
    // 'FM', 'FE', 'FI', 'FG', 'FC', 'FR',
    // 'GE', 'GO', 'GR',
    // 'IM', 'IS',
    // 'SP', 'LT', 'LE', 'LC', 'LI', 'LO', 'LU',
    // 'MC', 'MC', 'MS', 'MT', 'VS', 'ME', 'MI', 'MO', 'MB',
    // 'NA', 'NO', 'NU',
    // 'OR',
    // 'PD', 'PA', 'PR', 'PV', 'PG', 'PU', 'PE', 'PC', 'PI', 'PT', 'PN', 'PZ', 'PO',
    // 'RG', 'RA', 'RC', 'RE', 'RI', 'RN', 'RM', 'RO',
    // 'SA', 'SS', 'SV', 'SI', 'SR', 'SO',
    // 'TA', 'TE', 'TR', 'TO', 'TP', 'TN', 'TV', 'TS',
    // 'UD',
    // 'VA', 'VE', 'VB', 'VC', 'VR', 'VV', 'VI', 'VT'
  ]

  selectedProv:any;
  constructor(private _formBuilder: FormBuilder,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              public route: ActivatedRoute,
              private ApiService: AddressManagementService) {
    this.addCitiesFrom = this._formBuilder.group({
      country_id: ['',[Validators.required]],
      state_id: ['',[Validators.required]],
      provinceFlag: [false,[Validators.required]],
      province: ['',[Validators.required,Validators.minLength(2)]],
      name: ['',[Validators.required]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if(id !== '0'){
      this.editMode = 'Edit';
      this.button = 'Update';
      this.ApiService.editCity({id:id}).subscribe((res: any) => {
        this.documentData = res.data[0];
        if(res){
          this.ApiService.getSelectedCountryRegion(res.data[0].country_id).subscribe((data:any)=>{
            if (data) {
              this.region = data.data;

              for (var i = 0; i < this.region.length; i++){
                    if(this.region[i].id === this.documentData.state_id){
                      this.selectedRegion = this.documentData.state_id;
                    }
              }
              this.regionRecordFiltered = this.region.slice();
              this.ApiService.getSelectedProvince({id:res.data[0].state_id}).subscribe((result:any)=>{
                if(result){
                  this.provList = result.data;
                  for (var i = 0; i < this.provList.length; i++){
                    if(this.provList[i] === this.documentData.province){
                      this.selectedProv = this.documentData.province;
                    }
                  }
                  this.provListRecordFiltered = this.provList.slice();
                  this.addCitiesFrom.patchValue({
                    country_id: this.documentData.country_id,
                    state_id: this.selectedRegion,
                    provinceFlag: this.documentData.provinceFlag,
                    province: this.selectedProv,
                    name: this.documentData.name
                  });
                }
              });


              // this.regionRecordFiltered = this.region.slice();
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
        }
      });
    }

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
/*  getRegionList(request) {
    this.helper.toggleLoaderVisibility(true);
    this.ApiService.getRegionDropdown({}).subscribe((res:any)=>{
      if (res) {
        this.region = res.data;
        this.regionRecordFiltered = this.region.slice();
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
  }*/

  regionSelect(id: any){
    this.helper.toggleLoaderVisibility(true);
    this.ApiService.getSelectedCountryRegion(id).subscribe((res:any)=>{
      if (res) {
        this.region = res.data;
        this.regionRecordFiltered = this.region.slice();
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


  provinceSelect(id:any){
    this.helper.toggleLoaderVisibility(true);
    this.ApiService.getSelectedProvince({id:id}).subscribe((result:any)=>{
      if(result){
        this.provList = result.data;
        this.provListRecordFiltered = this.provList.slice();
        console.log('this.proveList',this.provList)
        this.helper.toggleLoaderVisibility(false);
      }else{
        this.helper.toggleLoaderVisibility(false);
        // const e = err.error;
        swal.fire(
          '',
          // err.error.message,
          this.translate.instant(result.reason),
          'info'
        );
      }
    })
  }
  changeRole(){}
  addCity(): any {
    if (this.addCitiesFrom.valid) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === '0') {
      this.ApiService.addCity(this.addCitiesFrom.value).subscribe(
        (data: any) => {
          if (data.statusCode === 200) {
            this.router.navigate(['/address-management/cities']);
            swal.fire(
              '',
              this.translate.instant('City added successfully'),
              'success'
            );
          } else {
            this.router.navigate(['/address-management/cities']);
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
        country_id: this.addCitiesFrom.value.country_id,
        state_id: this.addCitiesFrom.value.state_id,
        provinceFlag: this.addCitiesFrom.value.provinceFlag,
        province: this.addCitiesFrom.value.province,
        name: this.addCitiesFrom.value.name
      };
      this.ApiService.addCity(formsubmitdata).subscribe(
        (data: any) => {
          if (data.statusCode === 200) {
            this.router.navigate(['/address-management/cities']);
            swal.fire(
              '',
              this.translate.instant('City edited successfully'),
              'success'
            );
          } else {
            this.router.navigate(['/address-management/cities']);
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
