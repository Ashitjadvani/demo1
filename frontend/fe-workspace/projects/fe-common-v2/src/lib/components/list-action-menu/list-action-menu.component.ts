import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-action-menu',
  templateUrl: './list-action-menu.component.html',
  styleUrls: ['./list-action-menu.component.scss']
})
export class ListActionMenuComponent implements OnInit {

  @Input() createEventText: string;
  @Input() deleteText: any;
  @Input() scopeId: any;

  @Output() onFilter = new EventEmitter<any>();
  @Output() deleteMultiple = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onFilterListOfEvent(){
    this.onFilter.emit();
  }

  deleteMultipleListOfEvent(){
    this.deleteMultiple.emit();
  }
}
