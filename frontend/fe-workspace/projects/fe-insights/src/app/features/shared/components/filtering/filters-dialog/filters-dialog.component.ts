import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss']
})
export class FiltersDialogComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  _filterForm: FormGroup;
  formConfig: any;

  constructor(public dialogRef: MatDialogRef<FiltersDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { filters: any },
              public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.processColumns();
  }

  public get availableFilters(): any {
    return this.data.filters.filter(item => item.filterWidget);
  }

  processColumns(): void {
    this.formConfig = {};
    for (const col of this.availableFilters) {
      if (col.columnDataField === '') {
        continue;
      }
      this.formConfig[col.columnDataField] = [col.filterValue, []];
    }
    this._filterForm = this.fb.group(this.formConfig);
  }

}
