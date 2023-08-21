import { _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';

@Component({
  selector: 'app-extract-access-control-log-popup',
  templateUrl: './extract-access-control-log-popup.component.html',
  styleUrls: ['./extract-access-control-log-popup.component.scss']
})
export class ExtractAccessControlLogPopupComponent implements OnInit {

  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public dialogRef: MatDialogRef<ExtractAccessControlLogPopupComponent>,
    private router: Router,
    private commonService: CommonService,
    private _adapter: DateAdapter<any>

  ) { }

  ngOnInit(): void {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.startDate.getDate()-1);
    this._adapter.setLocale('it-IT');
  }

  onSave(): void{
    this.dialogRef.close({
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  onClose(): void{
    this.dialogRef.close(null);
  }


}
