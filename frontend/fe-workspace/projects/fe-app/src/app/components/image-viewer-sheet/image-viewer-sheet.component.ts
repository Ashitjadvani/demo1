import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { DataStorageManagementService } from 'projects/fe-common/src/lib/services/data-storage-management.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-image-viewer-sheet',
  templateUrl: './image-viewer-sheet.component.html',
  styleUrls: ['./image-viewer-sheet.component.scss']
})
export class ImageViewerSheetComponent implements OnInit {
    imageId: string = null;
    imageFileName: string;
    mapImageURL: SafeUrl = null;
    imageBlob: Blob = null;

    constructor(private dataStorageManagementService: DataStorageManagementService,
        private sanitizer: DomSanitizer,
        private commonService: CommonService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
        console.log('bottom sheet data: ', data);
        this.imageId = data.imageId;
    }

    async ngOnInit() {
        if (this.imageId) {
            this.mapImageURL = await this.downloadImageMap(this.imageId);
        } else {
            this.mapImageURL = null;
        }
    }

    async downloadImageMap(fileId) {
        let res = await this.dataStorageManagementService.downloadFile(fileId).toPromise();

        this.imageBlob = new Blob([res]);
        return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.imageBlob));
    }

    async onDownloadMapClick() {
        if (this.imageBlob){
            saveAs(this.imageBlob, this.imageFileName);
        }
    }
}
