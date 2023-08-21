import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import {ServerSettingsManagementService} from "../../../../../../fe-common-v2/src/lib/services/server-settings-management.service";
import {CommonService} from "../../../../../../fe-common-v2/src/lib/services/common.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {EventHelper, EventRequestParams, PaginationModel} from 'projects/fe-common-v2/src/lib';
import {EventManagementListOfEventService} from "../../../../../../fe-common-v2/src/lib/services/event-management-list-of-event.service";
import {EventManagementSettingService} from "../../../../../../fe-common-v2/src/lib/services/event-management-setting.service";
import swal from "sweetalert2";
import {SharedDataService} from "./shared-data.service";
import {RecruitingManagementService} from 'projects/fe-common-v2/src/lib/services/recruiting-management.service';

@Component({
    selector: 'app-event-setting',
    templateUrl: './event-setting.component.html',
    styleUrls: ['./event-setting.component.scss']
})
export class EventSettingComponent implements OnInit {
    paginationModel: PaginationModel = new PaginationModel();
    emailList: any = new MatTableDataSource([]);
    emailConfigForm: FormGroup;
    generalSettingForm: FormGroup;
    noRecordFound: boolean = false;
    public requestPara: EventRequestParams = new EventRequestParams(this.paginationModel.page, this.paginationModel.limit, null, '', '', 'allEvents', null);
    search: any = '';
    sortBy: any;
    sortKey: any;
    primaryColor: any = "#003045";
    token: any;
    companyId: any;
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
    emailTemplateColumns: string[];

    constructor(
        private _formBuilder: FormBuilder,
        private helper: MCPHelperService,
        private serverSettingsManagementService: ServerSettingsManagementService,
        private commonService: CommonService,
        public translate: TranslateService,
        private router: Router,
        private ApiService: EventManagementSettingService,
        public route: ActivatedRoute,
        private sharedService: SharedDataService,
        private reloadBaseURL: RecruitingManagementService
    ) {
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.token = authUser.token;
            this.companyId = authUser.person.companyId;
        }
        this.sharedService.setData(null);
        this.emailConfigForm = this._formBuilder.group({
            id: [''],
            host: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            port: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            userName: [''],
            password: [''],
            emailFrom: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            encryption: ['']
        });
        this.generalSettingForm = this._formBuilder.group({
            id: [''],
            companyId: this.companyId,
            baseURL: ['', Validators.required],
            emailTemplateColor: '#003045'
        })


    }

    ngOnInit(): void {
        this.sideMenuName();
        this.patchDataEmailConfig();
        this.patchDataGeneralSettings();
    }

    sidebarMenuName: any;

    sideMenuName() {
        this.sidebarMenuName = 'Settings';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    patchDataEmailConfig() {
        this.ApiService.getListEmailConfig({}).subscribe((data: any) => {
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

    patchDataGeneralSettings() {
        this.ApiService.getListForGeneralSettings({}).subscribe((data: any) => {
            const documentData = data.data;
            this.primaryColor = documentData?.emailTemplateColor ? documentData?.emailTemplateColor : "#003045";
            this.generalSettingForm.patchValue({
                id: documentData.id,
                baseURL: documentData.baseURL,
                emailTemplateColor: documentData?.emailTemplateColor ? documentData?.emailTemplateColor : "#003045"
            });
        });
    }

    async updateEmailConfig(): Promise<any> {
        if (this.emailConfigForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            await this.ApiService.updateEmailConfig(this.emailConfigForm.value).then(res => {
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


    async updateGeneralSetting(): Promise<any> {
        if (this.generalSettingForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            await this.ApiService.updateGeneralSetting(this.generalSettingForm.value).then(res => {
                const response: any = res
                this.helper.toggleLoaderVisibility(false);
                this.reloadBaseURL.reloadBaseURL();
                swal.fire('',
                    this.translate.instant(response.meta.message),
                    'success');
                this.patchDataGeneralSettings();
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


}
