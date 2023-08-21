import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Person } from '../../models/person';

@Component({
    selector: 'fco-person-input-autocomplete',
    templateUrl: './person-input-autocomplete.component.html',
    styleUrls: ['./person-input-autocomplete.component.scss']
})
export class PersonInputAutocompleteComponent implements OnInit {
    @Input() peopleList: Person[];
    @Input() selectedPerson: Person;
    @Input() placeholder: string;
    @Output() onValueChange: EventEmitter<Person> = new EventEmitter<Person>();

    people: Observable<Person[]>;
    peopleFC: FormControl = new FormControl();

    constructor() {

    }

    ngOnInit(): void {
        this.people = this.peopleFC.valueChanges.pipe(
            startWith(''),
            map(p => this.filterUsers(p))
        )
    }

    onPersonSelected(selEvent: MatAutocompleteSelectedEvent) {
        console.log('onPersonSelected: ', selEvent.option.value);
        this.onValueChange.emit(selEvent.option.value);
    }

    filterUsers(value: string) {
        try {
            return this.peopleList ? this.peopleList.filter(p => Person.filterMatch(p, value)) : [];
        } catch (ex) {

        }
    }

    displaySelectedPerson(person: Person) {
        return person ? person.name + ' ' + person.surname : '';
    }
}
