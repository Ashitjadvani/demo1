import { Component, Input, OnInit } from '@angular/core';
import { PersonProfileGroup } from 'projects/fe-common/src/lib/models/person-profile-group';
import { PeopleGroupResponse } from 'projects/fe-common/src/lib/services/admin-user-management.service';

@Component({
    selector: 'app-people-group-general-section',
    templateUrl: './people-group-general-section.component.html',
    styleUrls: ['./people-group-general-section.component.scss']
})
export class PeopleGroupGeneralSectionComponent implements OnInit {
    @Input() currentGroup: PersonProfileGroup;
    @Input() isModify: boolean;

    constructor() { }

    ngOnInit(): void {
    }

}
