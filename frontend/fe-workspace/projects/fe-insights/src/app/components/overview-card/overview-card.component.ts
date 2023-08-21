import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss']
})
export class OverviewCardComponent implements OnInit {
    @Input() id: number;
    @Input() image: string;
    @Input() title: string;
    @Input() data: string;
    @Input() mainColor: string;
    @Input() footerColor: string;
    @Input() footerText: string;

    @Output() onFooterClick: EventEmitter<number> = new EventEmitter<number>();

    constructor() { }

    ngOnInit(): void {
    }

    onFooterButtonClick() {
        this.onFooterClick.emit(this.id);
    }
}
