import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-wheel-action',
    templateUrl: './wheel-action.component.html',
    styleUrls: ['./wheel-action.component.scss'],
})
export class WheelActionComponent implements OnInit {
    @Input() icons: string;
    @Input() element: any;
    @Input() editOn: boolean = false;
    @Input() viewOn: boolean = false;
    @Input() changePassword: boolean = false;
    @Input() deleteOn: boolean = false;
    @Output() edit = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();
    @Output() callChangePassword = new EventEmitter<any>();
    @Output() view = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit(): void {
    }

    editEvent() {
        this.edit.emit(this.element);
    }

    viewDetail() {
        this.view.emit(this.element);
    }

    deleteEvent() {
        this.delete.emit(this.element);
    }

    changePasswordEvent() {
        this.callChangePassword.emit(this.element);
    }

}
