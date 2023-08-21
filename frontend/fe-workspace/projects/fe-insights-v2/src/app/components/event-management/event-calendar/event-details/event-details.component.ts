import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class CalenderEventDetailsComponent implements OnInit {

  constructor() { }
  @Input() event: any

  ngOnInit(): void {
  }

}
