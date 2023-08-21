import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-wheel-action',
    templateUrl: './wheel-action.component.html',
    styleUrls: ['./wheel-action.component.scss']
})
export class WheelActionComponent implements OnInit {
    @Input() element: any;
    // @Input() name: any;
    @Input() icons: string;
    @Input() viewOn: boolean = false;
    @Input() defaultView: boolean = false;
    @Input() cancelOn: boolean = false;
    @Input() activeOn: boolean = false;
    @Input() editOn: boolean = false;
    @Input() deleteOn: boolean = false;
    @Input() logOn: boolean = false;
    @Input() commentOn: boolean = false;
    @Input() lockOn: boolean = false;
    @Input() qrOn: boolean = false;
    @Input() dissOn: boolean = false;
    @Input() planOn: boolean = false;
    @Input() route: string;
    @Input() editCreditOn:boolean = false;
    @Input() reservationOn:boolean = false;

    @Output() view = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<any>();
    @Output() active = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();
    @Output() log = new EventEmitter<any>();
    @Output() comment = new EventEmitter<any>();
    @Output() lock = new EventEmitter<any>();
    @Output() qr = new EventEmitter<any>();
    @Output() plan = new EventEmitter<any>();
    @Output() editCredit = new EventEmitter<any>();
    @Output() reservation = new EventEmitter<any>();

    // @Input() id: any;

    constructor() {
    }

    ngOnInit(): void {
    }

    viewDetail() {
        this.view.emit(this.element)
    }

    cancelEvent() {
        this.cancel.emit(this.element)
    }

    editEvent() {
        this.edit.emit(this.element)
    }

   activeEvent() {
      this.active.emit(this.element)
   }

    deleteEvent() {
        this.delete.emit(this.element)
    }

    changeDetails() {
        this.log.emit(this.element)
    }

    commentAction() {
        this.comment.emit(this.element)
    }

    openUnlock() {
        this.lock.emit(this.element)
    }

    openQR() {
        this.qr.emit(this.element)
    }

    planAction() {
        this.plan.emit(this.element)
    }
    editEventCredit(){
        this.editCredit.emit(this.element)
    }
    reservationResource(){
        this.reservation.emit(this.element)
    }
}
