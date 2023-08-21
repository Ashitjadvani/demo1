import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { IrinaResource } from 'projects/fe-common/src/lib/models/bookable-assets';
import { ResourceAction, UserResourceInteractionResponse } from 'projects/fe-common-v2/src/lib/services/bookable-assets-management.service';


@Component({
    selector: 'app-qr-scanner-action-sheet',
    templateUrl: './qr-scanner-action-sheet.component.html',
    styleUrls: ['./qr-scanner-action-sheet.component.scss']
})
export class QrScannerActionSheetComponent implements OnInit {
    ResourceAction = ResourceAction;

    currentResourceInteraction: UserResourceInteractionResponse;
    availableActions: ResourceAction[];
    doneEvent: Function;
    closeEvent: Function;

    constructor(private bottomSheetRef: MatBottomSheetRef<QrScannerActionSheetComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
        this.currentResourceInteraction = data.currentResourceInteraction;
        this.availableActions = data.availableActions;
        this.doneEvent = data.doneEvent;
        this.closeEvent = data.closeEvent;
    }

    ngOnInit() {

    }

    isActionAvailable(action: ResourceAction) {
        return this.availableActions.find(a => a == action);
    }

    async onUserAction(action: ResourceAction) {
        await this.doneEvent(this.currentResourceInteraction, action);
        this.bottomSheetRef.dismiss(null);
    }

    getActionStyle(action: ResourceAction) {
        return {
            'background': (action == ResourceAction.None) ? '#ff0000aa' : '#007BB9',
            'color': '#0640A9'
        }
    }

    onCloseDrawer() {
        this.closeEvent();
        this.bottomSheetRef.dismiss(null);
    }
}
