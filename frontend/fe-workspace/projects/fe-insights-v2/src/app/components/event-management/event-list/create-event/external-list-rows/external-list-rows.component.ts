import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { PeriodicElement } from '../../../../quiz-survey/questions/add-edit-question/add-edit-question.component';

@Component({
  selector: 'app-external-list-rows',
  templateUrl: './external-list-rows.component.html',
  styleUrls: ['./external-list-rows.component.scss']
})
export class ExternalListRowsComponent implements OnInit, OnChanges {

  @ViewChild('externalListTable') externalListTable: MatTable<PeriodicElement>;
  
  @Input() externalPeopleDisplayedColumns: string[];
  @Input() externalList: string[];
  @Output() externalRemove: EventEmitter<any> = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
    // if(this.externalOrganizeTable){
    //   this.externalOrganizeTable.renderRows();
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.externalListTable){
      this.externalListTable.renderRows();
    }
  }
  
  removeExternal(element:any){
    this.externalRemove.emit(element);
  }
}
