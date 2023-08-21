import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Company} from 'projects/fe-common/src/lib/models/company';
import {AdminUserManagementService} from 'projects/fe-common/src/lib/services/admin-user-management.service';
import {CommonService} from 'projects/fe-common/src/lib/services/common.service';
import {CompanyPageComponent} from '../company-page.component';

@Component({
  selector: 'app-email-configuration',
  templateUrl: './email-configuration-section.component.html',
  styleUrls: ['./email-configuration-section.component.scss']
})
export class EmailConfigurationComponent implements OnInit {
  @Input() currentCompany: Company;

  @Output() UpdateEvent: EventEmitter<void> = new EventEmitter<void>();

  newAreaName: string;
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

  constructor(private adminUserManagementService: AdminUserManagementService,
              private commonService: CommonService,
              public translate: TranslateService) {
  }

  ngOnInit(): void {
  }

  async onUpdateClick() {
    this.UpdateEvent.emit();
  }
}
