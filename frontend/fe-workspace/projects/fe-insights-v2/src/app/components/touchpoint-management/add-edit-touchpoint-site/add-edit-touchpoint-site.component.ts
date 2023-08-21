import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { TouchPoint } from 'projects/fe-common-v2/src/lib/models/touchpoint';
import swal from "sweetalert2";
import {TouchpointManagementService} from "../../../../../../fe-common-v2/src/lib/services/touchpoint-management.service";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import { Person } from 'projects/fe-common-v2/src/lib/models/person';
import {CommonService} from '../../../../../../fe-common-v2/src/lib/services/common.service';
import {AdminSiteManagementService} from "../../../../../../fe-common-v2/src/lib/services/admin-site-management.service";
@Component({
  selector: 'app-add-edit-touchpoint-site',
  templateUrl: './add-edit-touchpoint-site.component.html',
  styleUrls: ['./add-edit-touchpoint-site.component.scss']
})
export class AddEditTouchpointSiteComponent implements OnInit {
  addTouchpointForm: FormGroup
  touchPoint: TouchPoint = new TouchPoint();
  userAccount: Person;
  documentData: any;
  document: any;
  sitelist: any;
  currentCompany: any;

  constructor(private _formBuilder: FormBuilder,
              private ApiService: TouchpointManagementService,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute,
              private userManagementService: UserManagementService,
              private commonService: CommonService,
              private sitelists: AdminSiteManagementService
              ) {
    this.addTouchpointForm = this._formBuilder.group({
      touchPointID: ['',[Validators.required]],
      touchpointSite: ['',[Validators.required]],
      description: ['',[Validators.required]]
    });

  }

  ngOnInit(): void {
    this.touchPoint.id = uuidv4();
    this.userAccount = this.userManagementService.getAccount();
    this.loadCompany();
  }

  async loadCompany() {
    const res = await this.sitelists.getFullSites(
      this.userAccount.companyId
    );
    this.sitelist = res.data;
  }

  addTouchpoint(): any{
    if (this.addTouchpointForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.addTouchpointForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const res: any =  this.ApiService.touchPointRegister( this.touchPoint.id, this.addTouchpointForm.value.touchpointSite, this.addTouchpointForm.value.description, this.userAccount.companyId);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/touchpoint-management']);
        swal.fire('',
          this.translate.instant('Swal_Message.TouchPoint Registerd successfully')
          , 'success');
      } else {
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(res.reason),
          'info'
        );
      }
    }
  }

}
