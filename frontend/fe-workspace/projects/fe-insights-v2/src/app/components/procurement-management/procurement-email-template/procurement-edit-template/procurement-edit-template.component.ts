import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {ActivatedRoute, Router} from "@angular/router";
import {EventManagementSettingService} from "../../../../../../../fe-common-v2/src/lib/services/event-management-setting.service";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ProcurementSharedDataServiceService} from "../../procurement-shared-data-service.service";
import swal from "sweetalert2";

@Component({
  selector: 'app-procurement-edit-template',
  templateUrl: './procurement-edit-template.component.html',
  styleUrls: ['./procurement-edit-template.component.scss']
})
export class ProcurementEditTemplateComponent implements OnInit {

    emailUpdateForm: FormGroup;
    config: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '24rem',
        minHeight: '4rem',
        sanitize: false,
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
                name: 'Text-justify',
                class: 'Text-justify',
            }
        ],
    };
    sharedData: any;
    panelOpenState = false;

    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        public route: ActivatedRoute,
        private ApiService: EventManagementSettingService,
        private helper: MCPHelperService,
        public translate: TranslateService,
        public sharedService: ProcurementSharedDataServiceService) {
        this.emailUpdateForm = this._formBuilder.group({
            id: [''],
            template: [''],
            subject:['',Validators.required],
        });

    }

    ngOnInit(): void {
        this.sharedService.sharedData$.subscribe((sharedData: any) => {
            this.sharedData = sharedData
        });
        // this.emailUpdateForm.controls['description'].setValue(this.sharedData.template);
        this.emailUpdateForm.controls['id'].setValue(this.sharedData?.id);
        this.emailUpdateForm.controls['subject'].setValue(this.sharedData?.subject);

    }

    clearData() {
        this.sharedService.setData(null);
    }

    updateEmailTemplate() {
        this.ApiService.updateProcurementEmailTemplate(this.emailUpdateForm.value).subscribe((res: any) => {
            if (res.statusCode === 200) {
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant(res.meta.message),
                    'success'
                )
                this.sharedService.setData(null);
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
