import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-action-tile',
  templateUrl: './main-action-tile.component.html',
  styleUrls: ['./main-action-tile.component.scss']
})
export class MainActionTileComponent {
    @Input() id: number;

    @Input() icon: string;
    @Input() iconAction: string;
    @Input() backgroundColor: string;
    
    @Input() textColor: string;
    @Input() textActionColor: string;
    @Input() textSiteColor: string;

    @Input() textAction: string;    
    @Input() textSite: string;
    @Input() textSizeInfo: string;
    @Input() textDesk: string;

    @Input() textLastAction: string;

    @Input() topText: string;

    @Input() qrCode: string;
    qrLevel: string = 'Q';

    @Output() clickEvent: EventEmitter<void> = new EventEmitter();

    state = 0;

    constructor() { 

    }

    onClick() {
        this.clickEvent.emit();
    }

    scrollDone() {
        this.state++;
    }

}
