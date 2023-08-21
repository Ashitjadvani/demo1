import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Person, PersonHistory } from 'projects/fe-common/src/lib/models/person';

@Component({
    selector: 'app-people-change-log-popup',
    templateUrl: './people-change-log-popup.component.html',
    styleUrls: ['./people-change-log-popup.component.scss']
})
export class PeopleChangeLogPopupComponent implements OnInit {
    @Input() currentPersonHistory: PersonHistory[];

    @Output() RestoreData: EventEmitter<PersonHistory> = new EventEmitter<PersonHistory>();

    constructor() { }

    ngOnInit(): void {

    }

    getItemDate(element: PersonHistory) {
        try {
            return new Date(element.t)
        } catch(ex) {

        }
        return null;
    }
    onModifyHistory(element) {
        this.RestoreData.emit(element);
    }
}
