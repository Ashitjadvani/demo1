import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserCapabilityService} from '../../../../services/user-capability.service';
import {RecruitingApplicationManagementService} from 'fe-common/services/recruiting-application-management.service';
import * as FileSaver from 'file-saver';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-download-preview-dialog',
  templateUrl: './download-preview-dialog.component.html',
  styleUrls: ['./download-preview-dialog.component.scss']
})
export class DownloadPreviewDialogComponent implements OnInit {
  urlPDF = '';
  momentTime: any = new Date().getTime();
  constructor(
    public dialogRef: MatDialogRef<DownloadPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public logData: any,
    private userCapabilityService: UserCapabilityService,
    private recruitingManagementApplicationService: RecruitingApplicationManagementService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.urlPDF = this.logData.url;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  downloadCv(): void{
    this.userCapabilityService.toggleLoaderVisibility(true);
    this.recruitingManagementApplicationService.downloadDocument(this.logData.resumeId).subscribe((res: any) => {
      this.userCapabilityService.toggleLoaderVisibility(false);
      const blob = new Blob([res], { type: 'application/pdf' });
      FileSaver.saveAs(blob, this.logData.fileName + '-cv-' + this.momentTime + '.pdf');
    }, error => {
      this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.NOT FOUND'), this.translate.instant('GENERAL.OK'), {duration: 3000});
      this.userCapabilityService.toggleLoaderVisibility(false);
    });
  }
}
