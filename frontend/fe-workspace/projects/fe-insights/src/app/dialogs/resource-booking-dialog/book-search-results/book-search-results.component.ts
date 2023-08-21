import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IrinaResource } from 'projects/fe-common/src/lib/models/bookable-assets';

@Component({
    selector: 'app-book-search-results',
    templateUrl: './book-search-results.component.html',
    styleUrls: ['./book-search-results.component.scss']
})
export class BookSearchResultsComponent implements OnInit {
    @Input() searchResults: IrinaResource[];
    @Output() selected = new EventEmitter<IrinaResource>();

    constructor() { }

    async ngOnInit() {
    }

    onResourceSelected(resource: IrinaResource) {
        this.selected.emit(resource);
    }
}
