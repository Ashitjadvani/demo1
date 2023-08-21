import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-informations-page',
    templateUrl: './informations-page.component.html',
    styleUrls: ['./informations-page.component.scss']
})
export class InformationsPageComponent implements OnInit {
    
    constructor(
        public translate: TranslateService) { }

    ngOnInit() {
    }
}