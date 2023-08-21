import { Component, OnInit } from '@angular/core';
import {EventHelper, EventRequestParams, PaginationModel} from "../../../../../../../fe-common-v2/src/lib";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {ServerSettingsManagementService} from "../../../../../../../fe-common-v2/src/lib/services/server-settings-management.service";
import {CommonService} from "../../../../../../../fe-common-v2/src/lib/services/common.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {EventManagementSettingService} from "../../../../../../../fe-common-v2/src/lib/services/event-management-setting.service";
import {SharedDataService} from "../../event-setting/shared-data.service";

@Component({
  selector: 'app-list-email-template',
  templateUrl: './list-email-template.component.html',
  styleUrls: ['./list-email-template.component.scss']
})
export class ListEmailTemplateComponent implements OnInit {
    paginationModel: PaginationModel = new PaginationModel();

    emailConfigForm: FormGroup;
    noRecordFound: boolean = false;
    search: any = '';
    sortBy: any;
    sortKey: any;
    emailTemplateColumns: string[];
    emailTemplateList: any = new MatTableDataSource([]);
    visibleList:boolean=true;
    visibleEditor:boolean=false
    public requestPara = {sortBy: '', sortKey: ''};
    sharedData: string;
  constructor(private _formBuilder: FormBuilder,
              private helper: MCPHelperService,
              private serverSettingsManagementService: ServerSettingsManagementService,
              private commonService: CommonService,
              public translate: TranslateService,
              private router: Router,
              private ApiService: EventManagementSettingService,
              public route: ActivatedRoute,
              private sharedService: SharedDataService) {
              this.emailConfigForm = this._formBuilder.group({
              host: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
              port: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
              user: ['', [Validators.nullValidator]],
              password: ['', [Validators.nullValidator]],
              from: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]]
      });
  }

  ngOnInit(): void {
      this.emailTemplateColumns = EventHelper.emailTemplateDisplayedColumns();
      this.getTemplateListData({})
      this.sharedService.sharedData$
          .subscribe(sharedData => this.sharedData = sharedData);
  }
    editEmailTemplate(element){
        this.sharedService.setData(element);
    }
    pageChanged(page): void {
        this.paginationModel.page = page;
        this.getTemplateListData(this.requestPara = {
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }
    changeItemsPerPage(event): void {
        this.paginationModel.page = 1;
        this.paginationModel.itemsPerPage = event;
        this.paginationModel.limit = this.paginationModel.itemsPerPage;
        this.getTemplateListData(this.requestPara = {
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }
    changeSorting(sortKey, sortBy): void {
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.paginationModel.page = 1;
        this.getTemplateListData(this.requestPara = {
            sortBy: this.sortBy,
            sortKey: this.sortKey
        });
    }
    async getTemplateListData(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiService.getTemplateList(this.requestPara);
        if (res.statusCode === 200) {
            this.emailTemplateList =  res.data;
            this.paginationModel.totalItems = res.meta.totalCount;
            this.noRecordFound = this.emailTemplateList.length > 0;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('',this.translate.instant(res.reason),'info');
        }
        this.helper.toggleLoaderVisibility(false);
    }

}
