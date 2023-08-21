import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { DataStorageManagementService } from 'projects/fe-common-v2/src/lib/services/data-storage-management.service';
import { DialogData } from '../../components/recruiting/job-applications/job-applications.component';

@Component({
  selector: 'app-view-file-popup',
  templateUrl: './view-file-popup.component.html',
  styleUrls: ['./view-file-popup.component.scss']
})
export class ViewFilePopupComponent implements OnInit {

  fileName: string = "";
  fileId: string = "";

  documentPath: string;
  trustedUrl: any;
  url: string = '';

  docIsImage = false;
  docIsPdf = false;
  docIsUnknown = true;

  constructor(public dialogRef: MatDialogRef<ViewFilePopupComponent>,
    private dataStorageManagementService: DataStorageManagementService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(data) {
        this.fileId = data.fileId;
        this.fileName = data.fileName;
        this.getDocument();
      }
  }

  async ngOnInit() {
    let res = await this.dataStorageManagementService.downloadFile(this.fileId).toPromise();
    if(res) {

    }
  }

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }

  async getDocument() {
    let res = await this.dataStorageManagementService.downloadFile(this.fileId).toPromise();
    let blob = new Blob([res]);
    this.url = window.URL.createObjectURL(blob);
    this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(this.url);
    
    if(this.fileName.indexOf("pdf")>0)
    {
        this.docIsUnknown = false;
        this.docIsImage = false;
        this.docIsPdf = true;
    }
    else if(this.fileName.indexOf("png")>0 || this.fileName.indexOf("jpg")>0 || this.fileName.indexOf("jpeg")>0)
    { 
        this.docIsUnknown = false;
        this.docIsPdf = false;
        this.docIsImage = true;      
    }
}

}
