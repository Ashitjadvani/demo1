import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'fco-fe-common',
    template: `
    <p *ngIf='true'>
      {{ text }} SUKA PUPPA PINO XXX YYY fe-common works! {{ gong }} 

    </p>
  `,
    styles: [
    ]
})
export class FeCommonComponent implements OnInit {
    @Input() text: string;
    @Input() gong: string;

    constructor() { }

    ngOnInit(): void {
    }

}
