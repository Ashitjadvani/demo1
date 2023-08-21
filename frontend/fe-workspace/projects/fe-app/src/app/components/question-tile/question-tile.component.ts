import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-question-tile',
  templateUrl: './question-tile.component.html',
  styleUrls: ['./question-tile.component.scss']
})
export class QuestionTileComponent implements OnInit {
    @Input() questionMessage: string;
    @Output() onConfirmQuestion: EventEmitter<boolean> = new EventEmitter<boolean>();

    public canvasWidth = 150
    public needleValue = 10
    public centralLabel = '10'
    public options = {
        hasNeedle: true,
        arcColors: ["rgb(44,151,222)","lightgray"],
        arcDelimiters: [80],
        rangeLabel: ["0%","100%"],
    }
    message: string;

    constructor() { }

    ngOnInit(): void {
        
    }

    onConfimAction(confirm: boolean) {
        this.onConfirmQuestion.emit(confirm);
    }
}
