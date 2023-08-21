import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fullcalender-view',
  templateUrl: './fullcalender-view.component.html',
  styleUrls: ['./fullcalender-view.component.css']
})
export class FullcalenderViewComponent  {

  nothingToshowText: any = "Nothing to show"; // "By default" => There are no events scheduled that day.
  colors: any = {
    red: {
      primary: "#ad2121",
      secondary: "#FAE3E3"
    },
    yellow: {
      primary: "#e3bc08",
      secondary: "#FDF1BA"
    }
  };
  actions: any[] = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      name: "delete"
    },
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      name: "edit"
    }
  ];
  events: any = [
    {
      start: new Date(),
      end: new Date(),
      title: "title event 1",
      color: this.colors.red,
      actions: this.actions
    },
    {
      start: new Date(),
      end: new Date(),
      title: "title event 2",
      color: this.colors.yellow,
      actions: this.actions
    }
  ];
  viewDate: Date = new Date();
  themecolor: any = "#0a5ab3";
  constructor() {}

  eventClicked(event : any) {

  }
  actionClicked(event: any) {

  }
}
