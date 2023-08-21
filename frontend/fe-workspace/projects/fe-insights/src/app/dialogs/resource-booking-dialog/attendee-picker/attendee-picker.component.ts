import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { AttendeeSelected } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Component({
  selector: 'app-attendee-picker',
  templateUrl: './attendee-picker.component.html',
  styleUrls: ['./attendee-picker.component.scss']
})
export class AttendeePickerComponent implements OnInit {
    @Output() selectedAttendee: EventEmitter<AttendeeSelected> = new EventEmitter<AttendeeSelected>();

    people: Person[];
    filteredPeople: Person[];

    personOrEmail: string = '';
    selectedPerson: Person = null;

    constructor(private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        public dialogRef: MatDialogRef<AttendeePickerComponent>,
        private commonService: CommonService) {

    }

    async ngOnInit() {
        let userAccount = this.userManagementService.getAccount();
        let res = await this.adminUserManagementService.getPeople(userAccount.companyId);
        if (this.commonService.isValidResponse(res))
            this.people = res.people;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['people']) {
            this.filteredPeople = this.people;
            this.applyFilter('');
        }
    }

    applyFilter(filterValue: string) {
        this.filteredPeople = []; // this.people;
        if (this.personOrEmail && (this.personOrEmail.length > 2)) {
            this.filteredPeople = this.people.filter(data => {
                return JSON.stringify(data).toLocaleLowerCase().includes(this.personOrEmail.toLocaleLowerCase())
            });
        }
    }

    onSelectPerson(person: Person) {
        this.filteredPeople = [];
        this.selectedPerson = person;

        this.personOrEmail = person.name + ' ' + person.surname;
    }

    isConfirmEnabled() {
        let isValidEmail = false;
        if (this.personOrEmail && this.personOrEmail.includes('@')) {
            isValidEmail = this.commonService.validateEmail(this.personOrEmail);
        }

        return this.selectedPerson || isValidEmail;
    }

    onConfirmClick() {
        let as: AttendeeSelected = new AttendeeSelected(this.personOrEmail, this.personOrEmail);
        if (this.selectedPerson)
            as.email = this.selectedPerson.email;

        this.selectedAttendee.emit(as);

        this.selectedPerson = null;
        this.personOrEmail = null;

        this.dialogRef.close(as);
    }
}
