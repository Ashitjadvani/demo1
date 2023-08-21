import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { IrinaResource, IrinaResourceBook, IrinaResourceBookTimeslot } from 'projects/fe-common-v2/src/lib/models/bookable-assets';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { BookableAssetsManagementService } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { ImageViewerSheetComponent } from '../../../components/image-viewer-sheet/image-viewer-sheet.component';

@Component({
    selector: 'app-my-bookings-page',
    templateUrl: './my-bookings-page.component.html',
    styleUrls: ['./my-bookings-page.component.scss']
})
export class MyBookingsPageComponent implements OnInit {
    myBookings: IrinaResourceBook[] = [];

    constructor(private notifyManagementService: NotifyManagementService,
        private bottomSheet: MatBottomSheet,
        private commonService: CommonService,
        private changeDetectorRef: ChangeDetectorRef,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private bookableAssetsManagementService: BookableAssetsManagementService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService
    ) { }

    async ngOnInit() {
        await this.loadMyBooking();
    }

    async loadMyBooking() {
        let now = new Date();
        let end = this.commonService.dateHoursOffset(now, 24 * 7);

        let res = await this.bookableAssetsManagementService.getUserResourceReservations(this.commonService.toYYYYMMDD(now), this.commonService.toYYYYMMDD(end));
        if (this.commonService.isValidResponse(res)) {
            this.myBookings = res.reservations;
        } else {
            this.myBookings = []
        }
    }

    async onDeleteBookItem(args) {
        console.log('delete timeframe: ', args.bookId, args.timeframeItem);
        let reply = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData('Cancella prenotazione', this.translate.instant('GENERAL.ARE YOU SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (reply) {
            let res = await this.bookableAssetsManagementService.resourceRemoveTimeframe(args.bookId, args.timeframe.id);
            if (this.commonService.isValidResponse(res)) {
                this.loadMyBooking();
            }
        }
    }

    onShowResourceMap(resource: IrinaResource) {
        try {
            let imageId = resource.custom.mapImageURL;
            let imageFileName = `Meeting Room ${resource.code}.png`;

            this.bottomSheet.open(ImageViewerSheetComponent, {
                data: {
                    imageId: imageId,
                    imageFileName: imageFileName
                },
                panelClass: 'map-bottom-sheet'
            });
        } catch (ex) {

        }
    }
}
