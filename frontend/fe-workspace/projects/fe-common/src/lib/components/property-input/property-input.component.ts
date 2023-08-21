import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'fco-property-input',
    templateUrl: './property-input.component.html',
    styleUrls: ['./property-input.component.scss']
})
export class PropertyInputComponent implements OnInit {
    @Input() context: any;  // TODO use an interface
    @Input() propertyName: string; 
    @Input() placeholder: string; 

    constructor() { }

    ngOnInit(): void {
    }

    getProperty() {
        return this.context.getProperty(this.propertyName);
    }

    setProperty($event) {
        console.log('event ', $event);
    }
}
