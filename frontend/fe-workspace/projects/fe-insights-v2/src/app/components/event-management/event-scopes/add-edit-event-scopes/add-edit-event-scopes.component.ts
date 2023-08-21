import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {AccountService} from "../../../../../../../fe-common-v2/src/lib/services/account.service";
import {EventManagementScopesService} from "../../../../../../../fe-common-v2/src/lib/services/event-management-scopes.service";
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-add-edit-event-scopes',
  templateUrl: './add-edit-event-scopes.component.html',
  styleUrls: ['./add-edit-event-scopes.component.scss']
})
export class AddEditEventScopesComponent implements OnInit {
  title = 'Add';
  addEventScopesForm: FormGroup;
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public _formBuilder: FormBuilder,
    private ApiService: EventManagementScopesService,
    private helper: MCPHelperService,
    public translate: TranslateService,
  ) {
    this.addEventScopesForm = this._formBuilder.group({
      name: [null, [MCPHelperService.noWhitespaceValidator,MCPHelperService.nameValidator, Validators.required]],
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
      this.ApiService.editScopeType({id:id}).subscribe((res: any) => {
        if(res.statusCode === 200){
          this.addEventScopesForm.patchValue({
            name: res.data.name
          });
          this.helper.toggleLoaderVisibility(false);
        }
        this.helper.toggleLoaderVisibility(false);
      }, (err) => {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['event-management/event-scopes']);
        swal.fire(
          '',
          this.translate.instant(err.error.message),
          'error'
        )
      });
    }
  }

  onEditConfirmClick():void{
    if (this.addEventScopesForm.valid){
      this.helper.toggleLoaderVisibility(true);
      const id = this.route.snapshot.paramMap.get('id');
      if (id !== '0'){
        const addUpdateDate = {
          id:id,
          name: this.addEventScopesForm.value.name
        }
        this.addUpdateScopeFuncation(addUpdateDate);
      }else {
        const addUpdateDate = {
          name: this.addEventScopesForm.value.name
        }
        this.addUpdateScopeFuncation(addUpdateDate);
      }
    }
  }

  addUpdateScopeFuncation(data):void{
    this.ApiService.addScopeType(data).subscribe((res: any) => {
      if(res.statusCode === 200){
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(res.meta.message),
          'success'
        )
        this.router.navigate(['event-management/event-scopes']);
      }
      this.helper.toggleLoaderVisibility(false);
    }, (err) => {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(err.error.message),
        'info'
      )
    });
  }


}
