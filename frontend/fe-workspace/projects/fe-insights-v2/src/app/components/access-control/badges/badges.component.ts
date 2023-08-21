import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "projects/fe-common-v2/src/lib/services/common.service";

@Component({
    selector: 'app-access-control-badges',
    templateUrl: './badges.component.html',
    styleUrls: ['./badges.component.scss']
})
export class AccessControlBadgesComponent implements OnInit {
    companyId: any;
    selectedIndex: any = 0;
    tabParam = "";

    constructor(public dialog: MatDialog,
        public route: ActivatedRoute,
        private tr: TranslateService,
        private router: Router,
        private com: CommonService)
    { }

    async ngOnInit() {
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.companyId = authUser.person.companyId;
        }
        this.tabParam = this.route.snapshot.paramMap.get('tab');
        if(this.route.snapshot.paramMap.get('tab') == "user") this.selectedIndex = 0;
        else if(this.route.snapshot.paramMap.get('tab') == "ext") this.selectedIndex = 1;
    }

}

