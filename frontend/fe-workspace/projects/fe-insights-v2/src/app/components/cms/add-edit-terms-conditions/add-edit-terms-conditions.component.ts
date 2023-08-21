import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CMSManagementService } from 'projects/fe-common-v2/src/lib/services/cms-list.service';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-terms-conditions',
  templateUrl: './add-edit-terms-conditions.component.html',
  styleUrls: ['./add-edit-terms-conditions.component.scss']
})
export class AddEditTermsConditionsComponent implements OnInit {
  addTermsConditionsForm:FormGroup;
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


  constructor(private _formBuilder: FormBuilder,
    private cmsManagementService:CMSManagementService,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private router: Router) {
    this.addTermsConditionsForm = this._formBuilder.group({
      id:[''],
      descriptionEN: [''],
      descriptionIT: [''],
      descriptionES: [''],
      descriptionFR: ['']
    });
  }

  ngOnInit(): void {
    // this.getCmsListData();
    this.getTermsAndConditionCMS();
  }

   getTermsAndConditionCMS() {
    let typeName = 'terms_conditions';
    this.helper.toggleLoaderVisibility(true);
    this.helper.getCMSDetails({type : typeName}).subscribe((data:any) =>{
      this.privacyDataObj = data.data;
      this.addTermsConditionsForm.patchValue({
        id:this.privacyDataObj.id,
        descriptionEN: this.privacyDataObj.descriptionEN,
        descriptionIT: this.privacyDataObj.descriptionIT,
      });
    });
        // this.privacyDataObj = res.data;
        // this.addTermsConditionsForm.patchValue({
        //   id:this.privacyDataObj.id,
        //   descriptionEN: this.privacyDataObj.descriptionEN,
        //   descriptionIT: this.privacyDataObj.descriptionIT,
        // });
        // if(this.privacyDataObj.type === typeName){
        //   this.addTermsConditionsForm.patchValue({
        //     id:this.privacyDataObj.id,
        //     descriptionEN: this.privacyDataObj.descriptionEN,
        //     descriptionIT: this.privacyDataObj.descriptionIT,
        //   });
        // }
      this.helper.toggleLoaderVisibility(false);
   }


  // async getCmsListData(): Promise<void> {
  //   const cmsListData: any = await this.cmsManagementService.getCMSList();
  //   this.dataSource = cmsListData.data;

  //   if(this.dataSource.type === "privacy_policy"){
  //     this.addTermsConditionsForm.patchValue({
  //       termsConditionsEnglish: this.dataSource.descriptionEN,
  //       termsConditionsSpanish: this.dataSource.descriptionIT,
  //     });
  //   }
  // }


  async addTerms(): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.cmsManagementService.saveCMSList(this.addTermsConditionsForm.value)
      if(this.addTermsConditionsForm.valid){
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
