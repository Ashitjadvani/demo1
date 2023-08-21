import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Person } from 'projects/fe-common/src/lib/models/person';

@Component({
    selector: 'app-people-picker',
    templateUrl: './people-picker.component.html',
    styleUrls: ['./people-picker.component.scss']
})
export class PeoplePickerComponent implements OnInit, OnChanges {
    @Input() people: Person[];

    @Output() selectedPerson: EventEmitter<Person> = new EventEmitter<Person>();

    filteredPeople: Person[];

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['people']) {
            this.filteredPeople = this.people;
            this.applyFilter('');
        }
    }

    applyFilter(filterValue: string) {
        this.filteredPeople = this.people;
        if (filterValue && (filterValue.length > 2)) {
            this.filteredPeople = this.people.filter(data => {
                return JSON.stringify(data).toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
            });
        }
    }

    onSelectPerson(person: Person) {
        this.selectedPerson.emit(person);
    }
}
