import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Area, Company, Scope} from 'projects/fe-common/src/lib/models/company';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-new-jobtitle-dialog',
    templateUrl: './new-jobtitle-dialog.component.html',
    styleUrls: ['./new-jobtitle-dialog.component.scss']
})
export class NewJobTitleDialogComponent implements OnInit {
    jobTitle: string;
    isNew: boolean;

    constructor(public dialogRef: MatDialogRef<NewJobTitleDialogComponent>,
        public translate: TranslateService,
        public common: CommonService,
        @Inject(MAT_DIALOG_DATA) data: any) { 
            this.jobTitle = data.jobTitle;
            this.isNew = data.isNew;
    }

    async ngOnInit() {

    }

    onCancel() {
        this.dialogRef.close(null);
    }

    async onSave() {
        this.dialogRef.close(this.jobTitle);
    }


}
