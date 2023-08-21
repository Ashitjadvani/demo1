import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';
import { ActionTile } from 'projects/fe-common/src/lib/models/app';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { NotifyManagementService } from 'projects/fe-common/src/lib/services/notify-management.service';

enum ActionType {
    atScanner,
    atImage
}

@Component({
  selector: 'app-greenpass-choose',
  templateUrl: './greenpass-choose.component.html',
  styleUrls: ['./greenpass-choose.component.scss']
})
export class GreenpassChooseComponent implements OnInit {
    greenpassAction: ActionTile[];
    @ViewChild('imageInput', { static: false }) file: ElementRef;
    
    constructor(private bottomSheetRef: MatBottomSheetRef<GreenpassChooseComponent>,
        public translate: TranslateService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
        this.greenpassAction = [
            new ActionTile("Utilizza la fotocamera", 'photo_camera', ActionType.atScanner, null, '#1AAEB7', null, null, null, null, null),
            new ActionTile("Carica un'immagine", 'image', ActionType.atImage, null, '#FF0000', null, null, null, null, null)
        ];
    }

    ngOnInit() {

    }

    getActionStyle(id: number) {
        return {
            'background': this.greenpassAction[id].BackgroundColor,
            'color': this.greenpassAction[id].TextColor
        }
    }

    async onUpload(file: any) {
        let data = {
            action: ActionType.atImage,
            file: file
        }
        this.bottomSheetRef.dismiss(data);
    }

    async onScan() {
        let data = {
            action: ActionType.atScanner,
            file: null
        }
        this.bottomSheetRef.dismiss(data);
    }

}
