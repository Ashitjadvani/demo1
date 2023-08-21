import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Company } from 'projects/fe-common/src/lib/models/company';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-general-types',
    templateUrl: './general-types.component.html',
    styleUrls: ['./general-types.component.scss']
})
export class GeneralTypesComponent implements OnInit {
    @Input() currentCompany: Company;

    @Output() UpdateEvent: EventEmitter<void> = new EventEmitter<void>();

    newVacationType: string;
    newDisputeType: string;

    constructor(private adminUserManagementService: AdminUserManagementService,
        private commonService: CommonService,
        public translate: TranslateService) { }

    ngOnInit(): void {
    }

    async onUpdateClick() {
        this.UpdateEvent.emit();
    }

    onAddVacationTypeClick() {
        if (!this.currentCompany.peopleVacationTypes.includes(this.newVacationType))
            this.currentCompany.peopleVacationTypes.push(this.newVacationType);
    }

    onDeleteVacationTypeClick(vacationType) {
        this.currentCompany.peopleVacationTypes = this.currentCompany.peopleVacationTypes.filter(vt => vt != vacationType);
    }

    onAddDisputeTypeClick() {
        if (!this.currentCompany.peopleDispute.includes(this.newDisputeType))
            this.currentCompany.peopleDispute.push(this.newDisputeType);
    }

    onDeleteDisputeTypeClick(disputeType) {
        this.currentCompany.peopleDispute = this.currentCompany.peopleDispute.filter(vt => vt != disputeType);
    }

}
