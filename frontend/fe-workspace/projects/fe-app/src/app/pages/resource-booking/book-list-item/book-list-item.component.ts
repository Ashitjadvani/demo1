import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IrinaResource, IrinaResourceBook, IrinaResourceBookTimeslot } from 'projects/fe-common/src/lib/models/bookable-assets';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Component({
    selector: 'app-book-list-item',
    templateUrl: './book-list-item.component.html',
    styleUrls: ['./book-list-item.component.scss']
})
export class BookListItemComponent implements OnInit {
    @Input() bookItem: IrinaResourceBook;
    @Output() deleteBookItemEvent: EventEmitter<{ bookId: string, timeframe: IrinaResourceBookTimeslot }> = new EventEmitter();
    @Output() showResourceMapEvent: EventEmitter<IrinaResource> = new EventEmitter();

    imageUrl: string = null;
    isExpired: boolean;

    currAccount: Person;

    constructor(private commonService: CommonService,
        private userManagementService: UserManagementService
    ) {

    }

    ngOnInit() {
        this.currAccount = this.userManagementService.getAccount();
    }

    displayBookAddress() {
        return '';
    }

    displayBookingDate() {
        return this.bookItem ? this.commonService.formatYYYYMMDD(this.bookItem.date) : '';
    }

    displayRoomOrDeskName() {
        return this.bookItem ? this.bookItem.resource.code : 'N/A';
    }

    displayBookTitle() {
        return this.bookItem ? this.bookItem.resource.description : '';
    }

    displayBookTimeframe() {
        return '';
    }

    formatTimeframeTime(dateTime) {
        return this.commonService.toHHMM(dateTime);
    }

    getMyTimeframes() {
        try {
            return this.bookItem.timeframeReservations.filter(tf => {
                return tf.users.find(u => u.id == this.currAccount.id);
            });
        } catch (ex) {
            return [];
        }
    }

    async onDeleteBookTimeframe(timeframeItem: IrinaResourceBookTimeslot) {
        this.deleteBookItemEvent.emit({ bookId: this.bookItem.id, timeframe: timeframeItem });
    }

    hasMap() {
        try {
            return this.bookItem.resource.custom.mapImageURL != null;
        } catch (ex) {
            return false;
        }
    }

    onShowResourceMap() {
        this.showResourceMapEvent.emit(this.bookItem.resource);
    }
}
