import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {AccountService} from "../../../../../../../fe-common-v2/src/lib/services/account.service";
import {EventManagementExternalVenuesService} from "../../../../../../../fe-common-v2/src/lib/services/event-management-external-venues.service";
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-add-edit-event-scopes',
  templateUrl: './add-edit-event-external-venues.component.html',
  styleUrls: ['./add-edit-event-external-venues.component.scss']
})
export class AddEditEventExternalVenuesComponent implements OnInit {
  title = 'Add';
  addEventExternalVenuesForm: FormGroup;
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public _formBuilder: FormBuilder,
    private ApiService: EventManagementExternalVenuesService,
    private helper: MCPHelperService,
    public translate: TranslateService,
  ) {
    this.addEventExternalVenuesForm = this._formBuilder.group({
      name: [null, [MCPHelperService.noWhitespaceValidator, Validators.required]],
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
      this.ApiService.editExternalVenuesType({id:id}).subscribe((res: any) => {
        if(res.statusCode === 200){
          this.addEventExternalVenuesForm.patchValue({
            name: res.data.name
          });
          this.helper.toggleLoaderVisibility(false);
        }
        this.helper.toggleLoaderVisibility(false);
      }, (err) => {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['event-management/event-external-venues']);
        swal.fire(
          '',
          this.translate.instant(err.error.message),
          'error'
        )
      });
    }
  }
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

  onEditConfirmClick():void{
    if (this.addEventExternalVenuesForm.valid){
      this.helper.toggleLoaderVisibility(true);
      const id = this.route.snapshot.paramMap.get('id');
      if (id !== '0'){
        const addUpdateDate = {
          id:id,
          name: this.addEventExternalVenuesForm.value.name
        }
        this.addUpdateScopeFuncation(addUpdateDate);
      }else {
        const addUpdateDate = {
          name: this.addEventExternalVenuesForm.value.name
        }
        this.addUpdateScopeFuncation(addUpdateDate);
      }
    }
  }

  addUpdateScopeFuncation(data):void{
    this.ApiService.addExternalVenuesType(data).subscribe((res: any) => {
      if(res.statusCode === 200){
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(res.meta.message),
          'success'
        )
        this.router.navigate(['event-management/event-external-venues']);
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
