import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ProfileSettingsService} from "../../../../../../../fe-common-v2/src/lib/services/profile-settings.service";
import swal from "sweetalert2";

@Component({
    selector: 'app-event-management-secret-code',
    templateUrl: './event-management-secret-code.component.html',
    styleUrls: ['./event-management-secret-code.component.scss']
})
export class EventManagementSecretCodeComponent implements OnInit {
    secretCodeForm: FormGroup;
    documentData: any;
    token: any;
    companyId: any;
    document: any;

    constructor(
        private _formBuilder: FormBuilder,
        private helper: MCPHelperService,
        public translate: TranslateService,
        private ApiService: ProfileSettingsService
    ) {
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.token = authUser.token;
            this.companyId = authUser.person.companyId;
        }
        this.secretCodeForm = this._formBuilder.group({
            id: [''],
            secretCode: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]]
        });
    }

    ngOnInit(): void {
        this.ApiService.getCompany({}).subscribe((res: any) => {
            this.documentData = res.company;
            this.secretCodeForm.patchValue({
                id: this.companyId,
                secretCode: this.documentData?.secretCode,
            });
        });
    }

    async savesecretCode() {
        if (this.secretCodeForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            this.documentData = new FormData();
            const getInputsValues = this.secretCodeForm.value;
            for (const key in getInputsValues) {
                this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
            }
            this.documentData.append('document', this.document);
            const res: any = await this.ApiService.set(this.secretCodeForm.value);
            if (res) {
                this.helper.toggleLoaderVisibility(false);
                swal.fire('',
                    this.translate.instant('Swal_Message.Event Management secret code has been updated successfully'),
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
