import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MasterDocumentTypeService} from "../../../../../../../fe-common-v2/src/lib/services/master-document-type.service";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: 'app-add-edit-document-type',
  templateUrl: './add-edit-document-type.component.html',
  styleUrls: ['./add-edit-document-type.component.scss']
})
export class AddEditDocumentTypeComponent implements OnInit {
  title = 'Add';
  editMode = 'Add';
  button = 'Save';
  formData: FormData;
  documentData: FormData;
  document: any;
  documentTypeForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private ApiService: MasterDocumentTypeService,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private router: Router,
    public route: ActivatedRoute,
  ) {
    this.documentTypeForm = this._formBuilder.group({
      id: [],
      name: ['', [MCPHelperService.nameValidator,Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getDetails(id)
  }
  getDetails(id){
    if(id !== '0'){
      this.title = 'Edit';
      this.helper.toggleLoaderVisibility(true);
      this.ApiService.getSingleRecord({id:id}).subscribe((res: any) => {
        console.log(res)
        if(res.statusCode === 200){
          this.documentTypeForm.patchValue({
            id:res.data.id,
            name: res.data.name
          });
          this.helper.toggleLoaderVisibility(false);
        }
        this.helper.toggleLoaderVisibility(false);
      });
    }
  }

  async addDocumentType(): Promise<any> {
    if (this.documentTypeForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.documentTypeForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      await this.ApiService.addDocumentType(this.documentTypeForm.value).then(res=>{
        const response:any = res
          this.helper.toggleLoaderVisibility(false);
          this.router.navigate(['/event-management/document-type']);
          swal.fire('',
            this.translate.instant(response.meta.message),
            'success');

       },(err) =>{
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(err.error.message),
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
