import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { IrinaResource, IrinaResourceBook, IrinaResourceBookTimeslot } from 'projects/fe-common-v2/src/lib/models/bookable-assets';
import { BookableAssetsManagementService, CurrentResourceStatusResponse } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { timer } from 'rxjs';
import { ResourceServicesSheetComponent } from './resource-services-sheet/resource-services-sheet.component';

@Component({
    selector: 'app-resource-panel-page',
    templateUrl: './resource-panel-page.component.html',
    styleUrls: ['./resource-panel-page.component.scss']
})
export class ResourcePanelPageComponent implements OnInit {

    resourceQR: string;
    qrLevel: string = 'Q';

    resourceId: string;
    resource: IrinaResource = IrinaResource.Empty();
    resourceReservation: IrinaResourceBook = IrinaResourceBook.Empty();

    currentDateTime: Date;
    tickCounter: number = 0;

    constructor(private commonService: CommonService,
        private activatedRoute: ActivatedRoute,
        private bottomSheet: MatBottomSheet,
        private bookableAssetsManagementService: BookableAssetsManagementService,
    ) { }

    async ngOnInit() {
        this.resourceId = this.activatedRoute.snapshot.params['id'];

        await this.refreshResourceStatus();

        this.currentDateTime = new Date();
        timer(1000, 1000).subscribe(async val => {
            this.currentDateTime = new Date();

            let refreshRate = this.commonService.valueOrDefault(this.resource.custom.panelRefreshRate, 5);
            if (++this.tickCounter > refreshRate) {
                await this.refreshResourceStatus();
                this.tickCounter = 0;
            }
        });
    }

    safeNameDisplay() {
        return this.resource ? this.resource.code + ' - ' + this.resource.description : '';
    }

    safeAddressDisplay() {
        return this.resource ? this.resource.custom.layout + ' - ' + this.resource.site : '';
    }

    async refreshResourceStatus() {
        let today = this.commonService.toYYYYMMDD(new Date());
        let res = await this.bookableAssetsManagementService.getCurrentResourceStatus(this.resourceId, today);
        if (this.commonService.isValidResponse(res)) {
            this.resourceQR = window.origin + '/resource/room/' + res.resource.code;
            this.resource = res.resource;
            this.resourceReservation = res.reservation ? res.reservation : IrinaResourceBook.Empty();
        }
    }


    formatTimeframeTime(dateTime) {
        return this.commonService.toHHMM(dateTime);
    }

    getMyTimeframes() {
        return this.resourceReservation.timeframeReservations;
    }

    getTimeframeCaption(tf) {
        return tf.users[0].name + ' ' + tf.users[0].surname + ' - ' + tf.extraData.title;
    }

    isInProgress(timeframeItem: IrinaResourceBookTimeslot) {
        let now = new Date();
        return this.commonService.timeIsInTimeFrame(now, timeframeItem.startTime, timeframeItem.endTime);
    }

    getStatusColor() {
        let isMeetingInProgress = false;
        this.resourceReservation.timeframeReservations.forEach(tf => isMeetingInProgress = isMeetingInProgress || this.isInProgress(tf));

        return isMeetingInProgress ? '#ff0000aa' : '#00ff0066';
    }

    getStatusText() {
        let isMeetingInProgress = false;
        this.resourceReservation.timeframeReservations.forEach(tf => isMeetingInProgress = isMeetingInProgress || this.isInProgress(tf));

        return isMeetingInProgress ? 'ROOM BUSY' : 'ROOM AVAILABLE';
    }

    onServiceClick() {
        let bottomSheetRef = this.bottomSheet.open(ResourceServicesSheetComponent, {
            data: {
            },
            panelClass: 'bottom-sheet'
        });

    }
}
