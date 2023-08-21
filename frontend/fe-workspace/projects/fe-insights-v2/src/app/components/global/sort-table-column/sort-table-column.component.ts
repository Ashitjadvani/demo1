import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sort-table-column',
  templateUrl: './sort-table-column.component.html',
  styleUrls: ['./sort-table-column.component.scss']
})
export class SortTableColumnComponent implements OnInit {

  @Input() sortColumnName : any;
  @Input() sortColumnBy : any;
  @Input() sortColumnKey : any;
  @Input() eventManagementName : any;
  @Input() visibleSortingIcon: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }
}
