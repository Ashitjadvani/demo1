import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss']
})

export class CropImageComponent implements OnInit {

    imageChangedEvent: any = '';
    croppedImage: any = '';
    croppedFile: any;
    
    constructor(private bottomSheetRef: MatBottomSheetRef<CropImageComponent>,
        public translate: TranslateService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
            this.fileChangeEvent(data.file);
    }


    ngOnInit() {

    }

    onConfirmClick() {
        this.bottomSheetRef.dismiss(this.croppedFile);
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.croppedFile = base64ToFile(this.croppedImage);
    }

    getActionStyle() {
        return {
            'background': '#008000',
            'color': null
        }
    }

}
