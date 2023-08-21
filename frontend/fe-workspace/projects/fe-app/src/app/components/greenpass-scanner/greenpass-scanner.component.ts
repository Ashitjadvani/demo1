import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { QrScannerComponent } from 'projects/fe-common/src/lib/components/qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-greenpass-scanner',
  templateUrl: './greenpass-scanner.component.html',
  styleUrls: ['./greenpass-scanner.component.scss']
})

export class GreenpassScannerComponent implements OnInit {

    @ViewChild('scanner') qrScanner: QrScannerComponent;
    currentCamera: any;

    constructor(private bottomSheetRef: MatBottomSheetRef<GreenpassScannerComponent>,
        public translate: TranslateService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
            this.currentCamera = data.currentCamera;

    }


    ngOnInit() {
        //
    }


    async onCodeResult(resultString: string) {
        if (resultString == null)
            return;
        else {
            this.qrScanner.closeVideoStream();
            this.bottomSheetRef.dismiss(resultString);
        }
    }

}
