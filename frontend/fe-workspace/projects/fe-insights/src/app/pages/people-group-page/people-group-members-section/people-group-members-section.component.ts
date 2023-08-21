import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { PersonProfileGroup } from 'projects/fe-common/src/lib/models/person-profile-group';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Component({
    selector: 'app-people-group-members-section',
    templateUrl: './people-group-members-section.component.html',
    styleUrls: ['./people-group-members-section.component.scss']
})
export class PeopleGroupMembersSectionComponent implements OnInit {
    @Input() currentGroup: PersonProfileGroup;

    peopleFullList: Person[];
    people: Person[];
    userAccount: Person;

    showSelectedOnly: boolean;
    currentFilter: string;

    constructor(private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService) { }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();
        await this.loadUserList();
    }

    async loadUserList() {
        const res = await this.adminUserManagementService.getPeople(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.peopleFullList = res.people;
            this.buildPeopleList();
        } else {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR USERS'), this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }

    buildPeopleList() {
        let filteredPeople = [];
        if (this.currentFilter) {
            filteredPeople = this.peopleFullList.filter(data => {
                return JSON.stringify(data).toLocaleLowerCase().includes(this.currentFilter.toLocaleLowerCase())
            });
        } else
            filteredPeople = this.peopleFullList;

        this.people = filteredPeople.filter(p => this.showSelectedOnly ? this.currentGroup.persons.includes(p.id) : true);
    }

    applyFilter(filterValue: string) {
        if (filterValue && (filterValue.length > 2))
            this.currentFilter = filterValue;
        else
            this.currentFilter = null;

        this.buildPeopleList();
    }

    onChangeShowSelected($event) {
        this.buildPeopleList();
    }

    isPersonSelected(person: Person) {
        return this.currentGroup.persons.includes(person.id);
    }

    onPersonSelected(person: Person) {
        if (this.currentGroup.persons.includes(person.id))
            this.currentGroup.persons = this.currentGroup.persons.filter(p => p != person.id);
        else
            this.currentGroup.persons.push(person.id);
        this.buildPeopleList();
    }
}
