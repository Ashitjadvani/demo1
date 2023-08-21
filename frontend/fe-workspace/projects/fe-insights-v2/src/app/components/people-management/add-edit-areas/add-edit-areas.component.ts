import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import swal from "sweetalert2";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {MatTableDataSource} from "@angular/material/table";
import {PeopleManagementService} from "../../../../../../fe-common-v2/src/lib/services/people-management.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-edit-areas',
  templateUrl: './add-edit-areas.component.html',
  styleUrls: ['./add-edit-areas.component.scss']
})
export class AddEditAreasComponent implements OnInit {
  scopesList: any = [];
  public files: any;
  documentData: any;
  document: any;
  documentName: any;
  editMode = 'Add';
  button = 'Save';
  token: any;
  companyId: any;
  public requestPara = {search: '', page: 1, limit: 10, sortBy: '', sortKey: ''};

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '13rem',
    minHeight: '4rem',
    // placeholder: this.translate.instant('PEOPLE_MANAGEMENT.Enter text here'),
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

  addAreasForm: FormGroup;
  public scopeList: any[] = ['Select All', 'Employees', 'System', 'Professional'];

  constructor(private _formBuilder: FormBuilder,
              private router: Router,
              public route: ActivatedRoute,
              private ApiService: PeopleManagementService,
              private helper: MCPHelperService,
              public translate: TranslateService) {


    this.addAreasForm = this._formBuilder.group({
      name: ['', [Validators.required,MCPHelperService.nameValidator]],
      // areaNameItalian: ['', [Validators.required]],
      scopes: ['', [Validators.required]],
      description: ['']
    });

    // get name from route
    const name = this.route.snapshot.paramMap.get('areaName');
    const id = this.route.snapshot.queryParamMap.get('id');
    if (name && id) {
      this.editMode = 'Edit';
      this.button = 'Update';
      this.ApiService.editArea(name).subscribe((data: any) => {
        const documentData = data.reason[0];
        this.addAreasForm.patchValue({
          id: documentData.id,
          name: documentData.name,
          scopes: documentData.scopes,
          description: documentData.description
        });
        this.documentName = 'you have to select document again';
      });
    }
  }


  ngOnInit(): void {
    this.getScopesList({});
  }

  async getScopesList(request): Promise<void> {
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.getAreaScope({});
    if (res) {
      this.scopesList = res.reason;
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
    this.helper.toggleLoaderVisibility(false);
  }

  async addArea(): Promise<void> {
    if (this.addAreasForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.addAreasForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const id = this.route.snapshot.queryParamMap.get('id');
      const name = this.addAreasForm.value.name;
      const scopes = this.addAreasForm.value.scopes;
      const description = this.addAreasForm.value.description;
      if (id === null || 0) {
        const res: any = await this.ApiService.addArea(this.addAreasForm.value);
        if (res) {
          this.helper.toggleLoaderVisibility(false);
          this.router.navigate(['/people-management']);
          swal.fire('',
            this.translate.instant('Swal_Message.Areaaddedsuccessfully'),
            'success');
        } else {
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant(res.reason),
            'info'
          );
        }
      } else {
        const res: any = await this.ApiService.addArea({name: name, id: id, scopes: scopes, description: description});
        if (res) {
          this.helper.toggleLoaderVisibility(false);
          this.router.navigate(['/people-management']);
          swal.fire('',
            this.translate.instant('Swal_Message.Areaeditedsuccessfully'),
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
  }
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
