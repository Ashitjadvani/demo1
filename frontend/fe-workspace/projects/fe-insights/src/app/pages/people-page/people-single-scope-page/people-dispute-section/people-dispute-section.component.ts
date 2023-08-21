import { Component, Input, OnInit } from '@angular/core';
import { Company } from 'projects/fe-common/src/lib/models/company';
import { PeopleDispute, Person } from 'projects/fe-common/src/lib/models/person';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Component({
    selector: 'app-people-dispute-section',
    templateUrl: './people-dispute-section.component.html',
    styleUrls: ['./people-dispute-section.component.scss']
})
export class PeopleDisputeSectionComponent implements OnInit {
    @Input() currentEditPerson: Person;
    @Input() currentCompany: Company;

    currentAccount: Person;
    currentDispute: PeopleDispute;

    constructor(private userManagementService: UserManagementService,
        private commonService: CommonService) {
    }

    ngOnInit(): void {
        this.resetInputField();
        this.currentAccount = this.userManagementService.getAccount();
    }

    isAddVisible() {
        return this.currentDispute.date && this.currentDispute.dispute && this.currentDispute.note;
    }

    resetInputField() {
        this.currentDispute = PeopleDispute.Empty();
    }

    onAddDispute() {
        if (!this.currentEditPerson.disputes)
            this.currentEditPerson.disputes = [];

        this.currentDispute.author = this.currentAccount.name + ' ' + this.currentAccount.surname;

        // remove for update (if any)
        this.currentEditPerson.disputes = this.currentEditPerson.disputes.filter(d => d.key != this.currentDispute.key);

        // update dispute array
        this.currentEditPerson.disputes = this.currentEditPerson.disputes.concat([this.currentDispute]);
        this.currentEditPerson.disputes = this.currentEditPerson.disputes.sort((a, b) => {
            let dateA = new Date(a.date);
            let dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
        }); // refresh table

        this.resetInputField();
    }

    onModifyDispute(element: PeopleDispute) {
        this.currentDispute = this.commonService.cloneObject(element);
    }

    onDeleteDispute(element) {
        this.currentEditPerson.disputes = this.currentEditPerson.disputes.filter(d => d.date != element.date);
    }
}
