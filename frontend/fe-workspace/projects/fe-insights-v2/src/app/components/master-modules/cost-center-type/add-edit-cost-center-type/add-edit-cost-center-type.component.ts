import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import swal from "sweetalert2";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MasterModulesCostCenterTypeService} from "../../../../../../../fe-common-v2/src/lib/services/master-modules-cost-center-type.service";

@Component({
  selector: 'app-add-edit-cost-center-type',
  templateUrl: './add-edit-cost-center-type.component.html',
  styleUrls: ['./add-edit-cost-center-type.component.scss']
})
export class AddEditCostCenterTypeComponent implements OnInit {
  title = 'Add';
  costCenterTypeForm: FormGroup;
  editMode = 'Add';
  button = 'Save';
  formData: FormData;
  documentData: FormData;
  document: any;

  constructor(
    private _formBuilder: FormBuilder,
    private ApiService: MasterModulesCostCenterTypeService,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private router: Router,
    public route: ActivatedRoute,
  ) {

    this.costCenterTypeForm = this._formBuilder.group({
      id: [],
      // name: ['', [MCPHelperService.nameValidator,Validators.required]]
      name: ['', [MCPHelperService.noWhitespaceValidator, Validators.required]]
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
          this.costCenterTypeForm.patchValue({
            id:res.data.id,
            name: res.data.name
          });
          this.helper.toggleLoaderVisibility(false);
        }
        this.helper.toggleLoaderVisibility(false);
      });
    }
  }

  async addCostCenterType(): Promise<any> {
    if (this.costCenterTypeForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.costCenterTypeForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      await this.ApiService.addCostCenterType(this.costCenterTypeForm.value).then(res => {
        const response:any = res
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/master-modules/cost-center-type']);
        swal.fire('',
          this.translate.instant(response.meta.message),
          'success');
      },(err =>{
        this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant(err.error.message),
            'info'
          );
      }));


    }
  }

  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }



}
