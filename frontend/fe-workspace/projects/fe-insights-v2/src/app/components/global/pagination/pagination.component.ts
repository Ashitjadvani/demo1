import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  @Input() noRecordFound: boolean;
  @Input() itemsPerPage: any;
  @Input() page: any;
  @Input() totalItems: Number;
  @Input() id: string;

  @Output() changeItem = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<any>();
  // @Input itemsPerPage: boolean;

  constructor() { }

  changeItemsPerPage(){
    this.changeItem.emit(this.itemsPerPage)
  }

  pageChanged(event){
    this.pageChange.emit(event)
  }

}
