import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { ServerSettingsManagementService } from 'projects/fe-common-v2/src/lib/services/server-settings-management.service';
import { MCPHelperService } from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';

@Component({
    selector: 'app-edit-candidate-remainder',
    templateUrl: './edit-candidate-remainder.component.html',
    styleUrls: ['./edit-candidate-remainder.component.scss']
})
export class EditCandidateRemainderComponent implements OnInit {
    config: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '13rem',
        minHeight: '4rem',
        // placeholder: 'Enter text here...',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        toolbarHiddenButtons: [['insertVideo']],
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
        ],
    };

    editRemainderForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private serverSettingsManagementService: ServerSettingsManagementService,
        private commonService: CommonService,
        public helper: MCPHelperService,
        public translate: TranslateService
    ) {
        this.editRemainderForm = this.formBuilder.group({
            subject: [null, Validators.required],
            body: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.serverSettingsManagementService.getById('recruiting-candidate-mail-remainder').then(res => {
            if (res.result) {
                this.commonService.mapObjectToFormGroup(this.editRemainderForm, res.value);
            }
        });

    }

    space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

    async onSubmit() {
        if (this.editRemainderForm.valid) {
            this.helper.toggleLoaderVisibility(true);

            let data = this.commonService.mapFormGroupToObject(this.editRemainderForm, { subject: null, body: null });
            let res = await this.serverSettingsManagementService.setById('recruiting-candidate-mail-remainder', data);

            this.helper.toggleLoaderVisibility(false);

            if (res) {
                // swal.fire('', this.translate.instant('Swal_Message.Email configuration has been updated successfully'), 'success');
                this.router.navigate([`/recruiting/candidates`]);
            } else {
                // swal.fire('', this.translate.instant(''), 'info');
            }
        }
    }
}
