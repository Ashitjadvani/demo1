import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-collapse-expand-row',
  templateUrl: './event-collapse-expand-row.component.html',
  styleUrls: ['./event-collapse-expand-row.component.scss']
})
export class EventCollapseExpandRowComponent implements OnInit {

  // @Input() rowElement: any;
  // @Input() expandedElement : any;
  @Input() activityLog : any;

  constructor() { }

  ngOnInit(): void {
  }

}
