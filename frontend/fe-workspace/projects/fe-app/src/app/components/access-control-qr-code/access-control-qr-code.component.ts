import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
  selector: 'app-access-control-qr-code',
  templateUrl: './access-control-qr-code.component.html',
  styleUrls: ['./access-control-qr-code.component.scss']
})

export class AccessControlQrCodeComponent implements OnInit {

    userQrCode: string = "";
    qrLevel: string = 'Q';
    name: string = '';
    endDate: Date = new Date();
    endDateDDMMYYYY: string = '';
    startDateDDMMYYYY: string = '';

    constructor(private bottomSheetRef: MatBottomSheetRef<AccessControlQrCodeComponent>,
        private common: CommonService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
            this.userQrCode = data.qrcode;
            this.name = data.name;
            this.endDate = data.endDate;
            this.endDateDDMMYYYY = common.toDDMMYYYY(data.endDate);
            this.startDateDDMMYYYY = common.toDDMMYYYY(data.startDate);
    }


    ngOnInit() {
        
    }


}
