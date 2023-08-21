import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActionTile } from 'projects/fe-common/src/lib/models/app';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';

enum ActionType {
    atPhone,
    atMail
}

@Component({
  selector: 'app-helpdesk-service-sheet',
  templateUrl: './helpdesk-service-sheet.component.html',
  styleUrls: ['./helpdesk-service-sheet.component.scss']
})
export class HelpdeskServiceSheetComponent implements OnInit {
    helpDeskAction: ActionTile[];
    helpDeskNumber: string = '0287178859';
    helpDeskMail: string = 'irina@nunow.net';

    constructor(private bottomSheetRef: MatBottomSheetRef<HelpdeskServiceSheetComponent>,
        private notifyManagementService: NotifyManagementService,
        private common: CommonService) {
        this.helpDeskAction = [
            new ActionTile('Help Desk: invia una mail', 'mail', ActionType.atMail, null, '#1AAEB7', null, null, null, null, null),
            new ActionTile('Help Desk: chiamata telefonica', 'phone', ActionType.atPhone, null, '#FF0000', null, null, null, null, null)
        ];
    }

    ngOnInit() {

    }

    getActionStyle(serviceAction: ActionTile) {
        return {
            'background': serviceAction.BackgroundColor,
            'color': serviceAction.TextColor
        }
    }

    async onServiceAction(serviceAction: ActionTile) {
        console.log('onServiceAction: ', serviceAction);

        switch (serviceAction.Action) {
            case ActionType.atPhone: {
                if (this.common.isMobileDevice()) {
                    document.location.href = "tel:" + this.helpDeskNumber;
                } else {
                    this.notifyManagementService.openMessageDialog('Helpdesk', 'Chiama il numero: ' + this.helpDeskNumber);
                }    
                break;
            }

            case ActionType.atMail: {
                document.location.href = "mailto:" + this.helpDeskMail;
                break;
            }
        }

        this.bottomSheetRef.dismiss();
    }
}
