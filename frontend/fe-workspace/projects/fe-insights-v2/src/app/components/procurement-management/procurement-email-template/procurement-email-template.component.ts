import { Component, OnInit } from '@angular/core';
// import {SharedDataService} from '';
import {ActivatedRoute} from '@angular/router';
import {ProcurementSharedDataServiceService} from '../procurement-shared-data-service.service';

@Component({
  selector: 'app-procurement-email-template',
  templateUrl: './procurement-email-template.component.html',
  styleUrls: ['./procurement-email-template.component.scss']
})
export class ProcurementEmailTemplateComponent implements OnInit {

    sharedData: any = null;
    scopeId: any = null;
    constructor(
        private sharedService: ProcurementSharedDataServiceService,
        private activatedRoute: ActivatedRoute
    ) {
        this.sharedService.setData(null);
    }

    ngOnInit(): void {
        this.scopeId = this.activatedRoute.snapshot.paramMap.get('scopeId');
        this.sharedService.sharedData$.subscribe(sharedData => this.sharedData = sharedData);
    }


}
