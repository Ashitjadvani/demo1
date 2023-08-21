import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
class Month {
  name: string;
  value: number;
}
@Component({
  selector: 'app-show-user-activity-popup',
  templateUrl: './show-user-activity-popup.component.html',
  styleUrls: ['./show-user-activity-popup.component.scss']
})
export class ShowUserActivityPopupComponent implements OnInit {
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

  constructor(
    public dialogRef: MatDialogRef<ShowUserActivityPopupComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {
    let now = new Date();
    this.selectedMonth = this.months[now.getMonth() + 1];
  }

  onSave(): void{
    this.dialogRef.close(this.selectedMonth.value);
  }
  onClose(): void{
    this.dialogRef.close(null);
  }
  onModifyHistory(element): void{

  }

}
