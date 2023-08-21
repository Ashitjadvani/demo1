import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Company } from 'projects/fe-common/src/lib/models/company';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Component({
    selector: 'app-work-settings-section',
    templateUrl: './work-settings-section.component.html',
    styleUrls: ['./work-settings-section.component.scss']
})
export class WorkSettingsSectionComponent implements OnInit {
    @Input() currentCompany: Company;

    @Output() UpdateEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor(private commonService: CommonService,
        private notifyManagementService: NotifyManagementService,
        private userManagementService: UserManagementService,
        public translate: TranslateService) {

    }

    ngOnInit(): void {
    }

    async onUpdateClick() {
        if (!this.commonService.isValidHHMM(this.currentCompany.lunchUpdaterCronDueTime)) {
            this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('INSIGHTS_PEOPLE_PAGE.InvalidTime'));
            return;
        }

        this.UpdateEvent.emit();
    }

    setLunchUpdaterCronDueTime(time) {
        this.currentCompany.lunchUpdaterCronDueTime = time;
    }

}
