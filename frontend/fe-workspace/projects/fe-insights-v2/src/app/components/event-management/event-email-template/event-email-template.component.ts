import {Component, OnInit} from '@angular/core';
import {SharedDataService} from '../event-setting/shared-data.service';
import {ActivatedRoute} from '@angular/router';
import { MCPHelperService } from '../../../service/MCPHelper.service';

@Component({
    selector: 'app-event-email-template',
    templateUrl: './event-email-template.component.html',
    styleUrls: ['./event-email-template.component.scss']
})
export class EventEmailTemplateComponent implements OnInit {
    sharedData: any = null;
    scopeId: any = null;
    constructor(
        private sharedService: SharedDataService,
        private activatedRoute: ActivatedRoute,
        private helper:MCPHelperService
    ) {
        this.sharedService.setData(null);
    }

    ngOnInit(): void {
        this.sideMenuName();
        this.scopeId = this.activatedRoute.snapshot.paramMap.get('scopeId');
        this.sharedService.sharedData$.subscribe(sharedData => this.sharedData = sharedData);
    }
    sidebarMenuName:any;
    sideMenuName(){
        this.sidebarMenuName = this.scopeId === null ? 'Email Template': 'Settings Template';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

}
