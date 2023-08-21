import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import swal from 'sweetalert2';
import {PeopleManagementService} from '../../../../../../fe-common-v2/src/lib/services/people-management.service';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-edit-roles',
  templateUrl: './add-edit-roles.component.html',
  styleUrls: ['./add-edit-roles.component.scss']
})
export class AddEditRolesComponent implements OnInit {
  addRolesForm: FormGroup;
  public files: any;
  documentData: any;
  document: any;
  documentName: any;
  editMode = 'Add';
  button = 'Save';
  token: any;
  companyId: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private ApiServices: PeopleManagementService,
    private helper: MCPHelperService,
    public translate: TranslateService) {

    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this.companyId = authUser.person.companyId;
    }

    // get name from route
    const roleName = this.route.snapshot.paramMap.get('roleName');

    this.addRolesForm = this.fb.group({
      name: [],
      roleNameEnglish: ['', [Validators.required,MCPHelperService.nameValidator]],
      // roleNameItalian: ['', [Validators.required]],
    });

    if (roleName !== '0') {
      this.editMode = 'Edit';
      this.button = 'Update';
      const documentData = roleName;
      this.addRolesForm.patchValue({
        roleNameEnglish: documentData,
      });
      this.documentName = 'you have to select document again';
    }
  }

  ngOnInit(): void {
  }

  async addRole(): Promise<void> {
    if (this.addRolesForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.addRolesForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const res: any = await this.ApiServices.addRole(this.addRolesForm.value.roleNameEnglish);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/people-management']);
        swal.fire('',
          this.translate.instant('Swal_Message.Roleaddedsuccessfully'),
          'success');
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

  async editRole(): Promise<void> {
    if (this.addRolesForm.valid) {
      const roleName = this.route.snapshot.paramMap.get('roleName');
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.addRolesForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const role = this.addRolesForm.value.roleNameEnglish;
      const res: any = await this.ApiServices.editRole(roleName, role);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/people-management']);
        swal.fire('',
          this.translate.instant('Swal_Message.Role edited successfully'),
          'success');
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
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
