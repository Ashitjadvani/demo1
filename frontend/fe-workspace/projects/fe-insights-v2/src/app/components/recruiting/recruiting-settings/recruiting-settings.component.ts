import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { ServerSettingsManagementService } from 'projects/fe-common-v2/src/lib/services/server-settings-management.service';
import { SettingsManagementService } from 'projects/fe-common-v2/src/lib/services/settings-management.service';
import swal from "sweetalert2";
import { MCPHelperService } from '../../../service/MCPHelper.service';

@Component({
    selector: 'app-recruiting-settings',
    templateUrl: './recruiting-settings.component.html',
    styleUrls: ['./recruiting-settings.component.scss']
})
export class RecruitingSettingsComponent implements OnInit {

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
        private serverSettingsManagementService: ServerSettingsManagementService,
        private commonService: CommonService,
        public translate: TranslateService,
        private router: Router,
        public route: ActivatedRoute) {
        this.emailConfigForm = this._formBuilder.group({
            host: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            port: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            user: [''],
            password: [''],
            from: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]]
        });
    }

    ngOnInit(): void {
        this.serverSettingsManagementService.getById('recruiting-mail-settings').then(res => {
            if (res.result) {
                this.commonService.mapObjectToFormGroup(this.emailConfigForm, res.value);
            }
        });
    }

    async changeEmailConfig() {
        if (this.emailConfigForm.valid) {
            this.helper.toggleLoaderVisibility(true);

            let data = this.commonService.mapFormGroupToObject(this.emailConfigForm, { host: null, port: 0, user: null, password: null, from: null});
            let res = await this.serverSettingsManagementService.setById('recruiting-mail-settings', data);

            this.helper.toggleLoaderVisibility(false);

            if (res) {
                swal.fire('', this.translate.instant('Swal_Message.Email configuration has been updated successfully'), 'success');
                this.router.navigate([`/recruiting/recruiting-dashboard`]);
            } else {
                swal.fire('', this.translate.instant(''), 'info');
            }
        }
    }
}
