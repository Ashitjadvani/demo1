import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {CMSManagementService} from "../../../../../../fe-common-v2/src/lib/services/cms-list.service";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: 'app-add-edit-supplier-terms-conditions',
  templateUrl: './add-edit-supplier-terms-conditions.component.html',
  styleUrls: ['./add-edit-supplier-terms-conditions.component.scss']
})
export class AddEditSupplierTermsConditionsComponent implements OnInit {
  addSupplierTermsConditionsForm:FormGroup;
  privacyDataObj: any;

  dataSource:any;
  cmsObject:any;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '13rem',
    minHeight: '4rem',
    // placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['insertImage'],
      ['insertVideo']
    ],
    customClasses: [
      {
        name: 'LineHeight-15px',
        class: 'LineHeight-15px',
      },
      {
        name: 'LineHeight-20px',
        class: 'LineHeight-20px',
      },
      {
        name: 'LineHeight-25px',
        class: 'LineHeight-25px',
      },
      {
        name: 'LineHeight-30px',
        class: 'LineHeight-30px',
      },
      {
        name:'Text-justify',
        class:'Text-justify',
      }
    ],
  };


  constructor(
    private _formBuilder: FormBuilder,
    private cmsManagementService:CMSManagementService,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.addSupplierTermsConditionsForm = this._formBuilder.group({
      id:[''],
      descriptionEN: [''],
      descriptionIT: [''],
      descriptionES: [''],
      descriptionFR: ['']
    });
  }

  ngOnInit(): void {
    // this.getCmsListData();
    this.getSupplierTermsAndConditionCMS();
  }

  getSupplierTermsAndConditionCMS() {
    let typeName = 'procurement_terms_conditions';
    this.helper.toggleLoaderVisibility(true);
    this.helper.getCMSDetails({type : typeName}).subscribe((data:any) =>{
      this.privacyDataObj = data.data;
      this.addSupplierTermsConditionsForm.patchValue({
        id:this.privacyDataObj.id,
        descriptionEN: this.privacyDataObj.descriptionEN,
        descriptionIT: this.privacyDataObj.descriptionIT,
      });
    });
    this.helper.toggleLoaderVisibility(false);
  }

  async addTerms(): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.cmsManagementService.saveCMSList(this.addSupplierTermsConditionsForm.value)
    if(this.addSupplierTermsConditionsForm.valid){
      this.helper.toggleLoaderVisibility(false);
      this.router.navigate([`cms`]);
      swal.fire(
        '',
        this.translate.instant('Swal_Message.cms_save_successfully'),
        'success'
      );
    }else{
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant( res.error.message),
        'info'
      );
    }
  }

}
