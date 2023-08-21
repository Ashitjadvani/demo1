import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IrinaResourceBook, IrinaResourceBookTimeslot } from 'projects/fe-common/src/lib/models/bookable-assets';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';

@Component({
    selector: 'app-book-item-timeframes',
    templateUrl: './book-item-timeframes.component.html',
    styleUrls: ['./book-item-timeframes.component.scss']
})
export class BookItemTimeframesComponent implements OnInit {
    @Input() bookItem: IrinaResourceBook;
    @Input() enableDelete: boolean;
    @Output() deleteBookItemEvent: EventEmitter<{ bookId: string, timeframe: IrinaResourceBookTimeslot }> = new EventEmitter();

    currAccount: Person;

    constructor(private commonService: CommonService,
        private userManagementService: UserManagementService) {

    }

    ngOnInit() {
        this.currAccount = this.userManagementService.getAccount();
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

    isInProgress(timeframeItem: IrinaResourceBookTimeslot) {
        let now = new Date();
        let is = this.commonService.timeIsInTimeFrame(now, timeframeItem.startTime, timeframeItem.endTime);
        return is;
    }

    async onDeleteBookTimeframe(timeframeItem: IrinaResourceBookTimeslot) {
        this.deleteBookItemEvent.emit({ bookId: this.bookItem.id, timeframe: timeframeItem });
    }
}
