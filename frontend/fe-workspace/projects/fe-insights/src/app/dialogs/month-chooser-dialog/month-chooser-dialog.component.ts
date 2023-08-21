import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

class Month {
    name: string;
    value: number;
}

@Component({
    selector: 'app-month-chooser-dialog',
    templateUrl: './month-chooser-dialog.component.html',
    styleUrls: ['./month-chooser-dialog.component.scss']
})
export class MonthChooserDialogComponent implements OnInit {
    months: Month[] = [
        { name: 'Tutto l\'anno', value: -1 },
        { name: 'Gennaio', value: 1 },
        { name: 'Febbraio', value: 2 },
        { name: 'Marzo', value: 3 },
        { name: 'Aprile', value: 4 },
        { name: 'Maggio', value: 5 },
        { name: 'Giugno', value: 6 },
        { name: 'Luglio', value: 7 },
        { name: 'Agosto', value: 8 },
        { name: 'Settembre', value: 9 },
        { name: 'Ottobre', value: 10 },
        { name: 'Novembre', value: 11 },
        { name: 'Dicembre', value: 12 },
    ];

    selectedMonth: Month;

    constructor(public dialogRef: MatDialogRef<MonthChooserDialogComponent>,
        public translate: TranslateService) { }

    ngOnInit(): void {
        let now = new Date();
        this.selectedMonth = this.months[now.getMonth() + 1];
    }

    onCancelClick() {
        this.dialogRef.close(null);
    }

    onConfirmClick() {
        this.dialogRef.close(this.selectedMonth.value);
    }

}
