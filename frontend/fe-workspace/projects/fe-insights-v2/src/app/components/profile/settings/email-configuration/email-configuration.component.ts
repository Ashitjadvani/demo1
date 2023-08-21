import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from "sweetalert2";
import { MCPHelperService } from "../../../../service/MCPHelper.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProfileSettingsService } from "../../../../../../../fe-common-v2/src/lib/services/profile-settings.service";

@Component({
    selector: 'app-email-configuration',
    templateUrl: './email-configuration.component.html',
    styleUrls: ['./email-configuration.component.scss']
})
export class EmailConfigurationComponent implements OnInit {
    documentData: any;
    document: any;
    mailEncryption: any = [{
        name: "None",
        value: "0",
    }, {
        name: "SSL",
        value: "1",
    }, {
        name: "TLS",
        value: "2",
    }];
    emailConfigForm: FormGroup;
    values: any;
    token: any;
    companyId: any;

    constructor(private _formBuilder: FormBuilder,
        private helper: MCPHelperService,
        public translate: TranslateService,
        private router: Router,
        public route: ActivatedRoute,
        private ApiService: ProfileSettingsService) {
        this.emailConfigForm = this._formBuilder.group({
            id: [''],
            mailHost: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            mailPort: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            mailUserName: [''],
            mailPassword: [''],
            mailFromName: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            mailEncryption: ['', [Validators.required]],
            mailWebUrl: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
        });


        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.token = authUser.token;
            this.companyId = authUser.person.companyId;
        }
    }

    ngOnInit(): void {
        this.ApiService.getCompany({}).subscribe((res: any) => {
            this.documentData = res.company;
            this.emailConfigForm.patchValue({
                id: this.companyId,
                mailHost: this.documentData.mailHost,
                mailPort: this.documentData.mailPort,
                mailUserName: this.documentData.mailUserName,
                mailPassword: this.documentData.mailPassword,
                mailFromName: this.documentData.mailFromName,
                mailEncryption: this.documentData.mailEncryption,
                mailWebUrl: this.documentData.mailWebUrl,
            });
        });

    }
    async changeEmailConfig() {
        if (this.emailConfigForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            this.documentData = new FormData();
            const getInputsValues = this.emailConfigForm.value;
            for (const key in getInputsValues) {
                this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
            }
            this.documentData.append('document', this.document);
            const res: any = await this.ApiService.set(this.emailConfigForm.value);
            if (res) {
                this.helper.toggleLoaderVisibility(false);
                swal.fire('',
                    this.translate.instant('Swal_Message.Email configuration has been updated successfully'),
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
