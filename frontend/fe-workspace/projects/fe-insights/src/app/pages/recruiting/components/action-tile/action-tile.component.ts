import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-action-tile',
  templateUrl: './action-tile.component.html',
  styleUrls: ['./action-tile.component.scss']
})
export class ActionTileComponent {
    setdashboardCount: any
    @Input() id: number;
    @Input() caption: string;
    @Input() info: string;
    @Input() scrollInfo: string;
    @Input() icon: string;
    @Input() iconAction: string;
    @Input() backgroundColor: string;
    @Input() textColor: string;
    @Input() topText: string;
    @Input() borderColor: string;
    // @Input() dashboardCount: any;
    @Input() set dashboardCount(data: any) {
      if (data) {
        this.setdashboardCount = data;
      }
    }

    @Output() clickEvent: EventEmitter<void> = new EventEmitter();

    onClick() {
        this.clickEvent.emit();
    }
}
