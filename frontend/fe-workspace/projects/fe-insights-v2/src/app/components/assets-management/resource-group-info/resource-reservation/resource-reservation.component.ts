import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";
import {BookableAssetsManagementService} from "../../../../../../../fe-common-v2/src/lib/services/bookable-assets-management.service";
import {CommonService} from "../../../../../../../fe-common-v2/src/lib/services/common.service";
import {IrinaResource,BookableResource} from "../../../../../../../fe-common-v2/src/lib/models/bookable-assets";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-resource-reservation',
  templateUrl: './resource-reservation.component.html',
  styleUrls: ['./resource-reservation.component.scss']
})
export class ResourceReservationComponent implements OnInit {
    resourceType: any;
    resourceTypeAdd: any;
    allResources: IrinaResource[] = [];
    resources: BookableResource[];
    editResource: any
    currentReservationDate = new Date();
    sidebarMenuName: string;
  constructor(
      private router: Router,
      public route: ActivatedRoute,
      private bookableAssetsManagementService: BookableAssetsManagementService,
      private commonService: CommonService,
      private helper: MCPHelperService,
      public translate: TranslateService,
  ) { }

  ngOnInit(): void {
      this.resourceType = this.route.snapshot.queryParams.resource;
      this.resourceTypeAdd = this.route.snapshot.queryParams.type;
      this.sideMenuName()
  }

    sideMenuName() {
        this.sidebarMenuName = 'INSIGHTS_MENU.Resource_Group';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }
    back(){
        let param = this.editResource?.type ? this.editResource?.type : this.resourceTypeAdd
        this.router.navigate([`/assets-management/resource-group/resource-group-info`],{ queryParams: { type:param}})
    }
    async loadReourceList() {
        let res = await this.bookableAssetsManagementService.getBookableResources(this.resourceTypeAdd);

        if (this.commonService.isValidResponse(res)) {
            this.allResources = res.data;
            this.resources = res.data; // TODO Optimize this
            this.editResource = this.resources.find(res => res.code === this.resourceType)
        } else {
            this.helper.toggleLoaderVisibility(false);
            // const e = err.error;
            swal.fire(
                '',
                // err.error.message,
                this.translate.instant("Data not found"),
                'info'
            );
        }
    }

}
