import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MonthChooserDialogComponent } from '../month-chooser-dialog/month-chooser-dialog.component';

@Component({
    selector: 'app-people-dashboard-dialog',
    templateUrl: './people-dashboard-dialog.component.html',
    styleUrls: ['./people-dashboard-dialog.component.scss']
})
export class PeopleDashboardDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<MonthChooserDialogComponent>,
        public translate: TranslateService) { }

    ngOnInit(): void {
    }

    onCloseClick() {
        this.dialogRef.close();
    }
}
