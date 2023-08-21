import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MasterStaffDocumentService} from "../../../../../../../fe-common-v2/src/lib/services/staff-document.service";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: 'app-add-edit-staff-document',
  templateUrl: './add-edit-staff-document.component.html',
  styleUrls: ['./add-edit-staff-document.component.scss']
})
export class AddEditStaffDocumentComponent implements OnInit {
  title = 'Add';
  editMode = 'Add';
  button = 'Save';
  formData: FormData;
  documentData: FormData;
  document: any;
  staffDocumentForm: FormGroup;
    companyId: any;
  constructor(
    private _formBuilder: FormBuilder,
    private ApiService: MasterStaffDocumentService,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private router: Router,
    public route: ActivatedRoute,
  ) {
      const credentials = localStorage.getItem('credentials');
      if (credentials) {
          const authUser: any = JSON.parse(credentials);
          this.companyId = authUser.person.companyId;
      }
    this.staffDocumentForm = this._formBuilder.group({
        companyId:this.companyId,
        id: [],
      name: ['', [MCPHelperService.nameValidator,Validators.required]],
        isMandatory:[false]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getDetails(id)
  }

    async getDetails(id) {
        if (id !== '0') {
            this.title = 'Edit';
            this.helper.toggleLoaderVisibility(true);
            const res: any = await this.ApiService.viewStaffDocument({id: id});
            if(res.result === true){
                this.staffDocumentForm.patchValue({
                    id:res?.document.id,
                    name: res?.document.name,
                    isMandatory:res?.document.isMandatory
                });
                this.helper.toggleLoaderVisibility(false);
            }else{
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant(res.reason),
                    'error'
                );
            }
        }
    }

  /*getDetails(id){
    if(id !== '0'){
      this.title = 'Edit';
      this.helper.toggleLoaderVisibility(true);
      this.ApiService.getSingleRecord({id:id}).subscribe((res: any) => {
        if(res.result === true){
          this.staffDocumentForm.patchValue({
            id:res?.data.id,
            name: res?.data.name,
            isMandatory:res?.data.isMandatory
          });
          this.helper.toggleLoaderVisibility(false);
        }
        this.helper.toggleLoaderVisibility(false);
      });
    }
  }*/

  async addStaffDocument(): Promise<any> {
    if (this.staffDocumentForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.staffDocumentForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      await this.ApiService.addStaffDocument(this.staffDocumentForm.value).then((res:any)=>{
          this.helper.toggleLoaderVisibility(false);
          if (res.result){
              this.router.navigate(['/master-modules/staff-documents']);
              swal.fire('',
                  this.translate.instant(res.message),
                  'success');
          }else {
              swal.fire('',
                  this.translate.instant(res.reason),
                  'info');
          }
       },(err) =>{
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(err.reason),
          'info'
        )
       });

    }
  }

  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

}
