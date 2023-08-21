import { Component, Input, OnInit } from '@angular/core';
import { Scope } from 'projects/fe-common/src/lib/models/company';
import { Person } from 'projects/fe-common/src/lib/models/person';

@Component({
    selector: 'app-people-economics-section',
    templateUrl: './people-economics-section.component.html',
    styleUrls: ['./people-economics-section.component.scss']
})
export class PeopleEconomicsSectionComponent implements OnInit {
    @Input() currentEditPerson: Person;
    @Input() scope: Scope;

    constructor() { }

    ngOnInit(): void {
    }

}
