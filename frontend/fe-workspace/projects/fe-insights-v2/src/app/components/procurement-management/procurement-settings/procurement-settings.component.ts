import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ProcurementService} from 'projects/fe-common-v2/src/lib/services/procurement.service';
import Swal from 'sweetalert2';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import swal from "sweetalert2";

@Component({
    selector: 'app-procurement-settings',
    templateUrl: './procurement-settings.component.html',
    styleUrls: ['./procurement-settings.component.scss']
})
export class ProcurementSettingsComponent implements OnInit {
    expiredDocumentForm: FormGroup;
    expiringDocumentForm: FormGroup;
    finalForm: FormGroup;
    viewSettingsData: any = [];
    activeDayList = [];
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
    noticeList = ["one email every day", "every two days", "every three days", "onlyOnce", "never"];
    noticeListExpired = ["one email every day", "every two days", "every three days", "onlyOnceAfterOneWeekFromExpiringDate", "onExpirationDay"];
    emailConfigForm: FormGroup;

    constructor(private _formBuilder: FormBuilder,
                private helper: MCPHelperService,
                public translate: TranslateService,
                private APIservice: ProcurementService) {

        this.expiredDocumentForm = this._formBuilder.group({
            id: [null],
            expiredDocSendNoticeEmail: [false],
            expiringDocSendNoticeEmail: [false],
            expiredDocumentDays: ['', Validators.required],
            expiringDocumentDays: [null],
            expiringDocumentTime: [''],
        });
        this.expiringDocumentForm = this._formBuilder.group({
            id: [null],
            expiringDocSendNoticeEmail: [false],
            expiredDocSendNoticeEmail: [false],
            expiringDocumentDays: [null, Validators.required],
            expiringDocumentTime: ['', Validators.required],
            expiredDocumentDays: [''],
        })
        this.emailConfigForm = this._formBuilder.group({
            id: [''],
            host: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            port: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            userName: [''],
            password: [''],
            emailFrom: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            encryption: ['']
        });
    }

    ngOnInit(): void {
        for (var i = 0; i < 15; i++) {
            this.activeDayList[i] = i + 1;
        }
        this.viewProcurementSettings();
        this.patchDataEmailConfig()
    }

    viewProcurementSettings() {
        this.helper.toggleLoaderVisibility(true);
        this.APIservice.viewProcurementSetting({}).then((data: any) => {
            if (data.statusCode == 200) {
                this.viewSettingsData = data.data;
                this.expiringDocumentForm.patchValue({
                    id: this.viewSettingsData.id,
                    expiringDocSendNoticeEmail: this.viewSettingsData?.expiringDocSendNoticeEmail ? this.viewSettingsData.expiringDocSendNoticeEmail : false,
                    expiringDocumentDays: (this.viewSettingsData?.expiringDocumentDays ? this.viewSettingsData?.expiringDocumentDays : '').toString(),
                    expiringDocumentTime: this.viewSettingsData.expiringDocumentTime,
                });
                this.expiredDocumentForm.patchValue({
                    expiredDocSendNoticeEmail: this.viewSettingsData?.expiredDocSendNoticeEmail ? this.viewSettingsData.expiredDocSendNoticeEmail : false,
                    id: this.viewSettingsData.id,
                    expiredDocumentDays: this.viewSettingsData.expiredDocumentDays
                });
                this.helper.toggleLoaderVisibility(false);
            } else {
                this.helper.toggleLoaderVisibility(false);
                Swal.fire('', this.translate.instant(data.meta.message), 'info');
            }
        }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            Swal.fire('', this.translate.instant(err.error.message), 'error')
        });
    }

    saveExpiringDoc() {
        if (this.expiringDocumentForm.valid) {
            this.expiringDocumentForm.patchValue({
                id: this.viewSettingsData.id,
                expiringDocSendNoticeEmail: this.expiringDocumentForm.value.expiringDocSendNoticeEmail,
                expiredDocSendNoticeEmail: this.expiredDocumentForm.value.expiredDocSendNoticeEmail,
                expiringDocumentDays: this.expiringDocumentForm.value.expiringDocumentDays,
                expiringDocumentTime: this.expiringDocumentForm.value.expiringDocumentTime,
                expiredDocumentDays: this.viewSettingsData.expiredDocumentDays
            })
            this.helper.toggleLoaderVisibility(true);
            this.APIservice.saveProcurementSetting(this.expiringDocumentForm.value).then((data: any) => {
                this.helper.toggleLoaderVisibility(false);
                Swal.fire('', this.translate.instant('ProcurementSettingSavedSuccessfully'), 'success');
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                Swal.fire('', this.translate.instant(err.error.message), 'info');
            });
        }
    }

    async updateEmailConfig(): Promise<any> {
        if (this.emailConfigForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            await this.APIservice.updateEmailConfig(this.emailConfigForm.value).then(res => {
                const response: any = res
                this.helper.toggleLoaderVisibility(false);
                swal.fire('',
                    this.translate.instant(response.meta.message),
                    'success');
                this.patchDataEmailConfig();
            }, (err => {
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant(err.error.message),
                    'info'
                );
            }));


        }
    }

    patchDataEmailConfig() {
        this.APIservice.getListEmailConfig({}).subscribe((data: any) => {
            const documentData = data.data[0];
            this.emailConfigForm.patchValue({
                id: documentData.id,
                host: documentData.host,
                emailFrom: documentData.emailFrom,
                port: documentData.port,
                userName: documentData.userName,
                password: documentData.password,
                encryption: documentData.encryption
            });
        });
    }

    saveExpiredDoc() {
        if (this.expiredDocumentForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            this.expiredDocumentForm.patchValue({
                id: this.viewSettingsData.id,
                expiringDocumentDays: this.expiringDocumentForm.value.expiringDocumentDays,
                expiringDocumentTime: this.expiringDocumentForm.value.expiringDocumentTime,
                expiredDocumentDays: this.expiredDocumentForm.value.expiredDocumentDays,
                expiredDocSendNoticeEmail: this.expiredDocumentForm.value.expiredDocSendNoticeEmail,
                expiringDocSendNoticeEmail: this.expiringDocumentForm.value.expiringDocSendNoticeEmail,
            })
            this.APIservice.saveProcurementSetting(this.expiredDocumentForm.value).then((data: any) => {
                this.helper.toggleLoaderVisibility(false);
                Swal.fire('', this.translate.instant('ProcurementSettingSavedSuccessfully'), 'success');
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                Swal.fire('', this.translate.instant(err.error.message), 'info');
            });
        }
    }

}
