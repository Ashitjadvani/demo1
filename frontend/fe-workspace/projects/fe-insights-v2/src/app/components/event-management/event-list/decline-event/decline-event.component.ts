import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import {MCPHelperService} from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';

@Component({
    selector: 'app-decline-event',
    templateUrl: './decline-event.component.html',
    styleUrls: ['./decline-event.component.scss']
})
export class DeclineEventComponent implements OnInit, OnDestroy {
    eventName: string;
    id: string;
    attendeeId: number;
    oppsError: boolean = false;
    invitationMessage: any;
    errorMessage: any;

    constructor(public eventAPI: EventManagementListOfEventService,
                public route: ActivatedRoute,
                public translate: TranslateService,
                public helper: MCPHelperService,) {
    }

    ngOnInit(): void {
        document.body.classList.add('full-page');
        this.id = this.route.snapshot.paramMap.get('id');
        this.attendeeId = Number (this.route.snapshot.paramMap.get('attendeeId'));
        this.getDeclineEventData();
    }

    async getDeclineEventData() {
        this.helper.toggleLoaderVisibility(true);
        const eventData = {id: this.id, attendeeId: this.attendeeId, invitationStatus: 'declined'}
        await this.eventAPI.declineEventByMail(eventData).then((res: any) => {
            this.oppsError = true;
            this.eventName = res.data.name;
            this.invitationMessage = res.meta.message
            this.helper.toggleLoaderVisibility(false);
        }, (err) => {
            this.oppsError = false;
            this.errorMessage = err.error.message
            this.helper.toggleLoaderVisibility(false);
        });
        this.helper.toggleLoaderVisibility(false);
    }

    ngOnDestroy(): void {
        document.body.classList.remove('full-page');
    }


}
