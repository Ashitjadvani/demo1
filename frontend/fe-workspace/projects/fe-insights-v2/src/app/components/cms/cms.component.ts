import { Component, OnInit } from '@angular/core';
import { CMSManagementService } from 'projects/fe-common-v2/src/lib/services/cms-list.service';
import { MCPHelperService } from '../../service/MCPHelper.service';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {
  page: any = 1;
  itemsPerPage: any = '10';
  totalItems: any = 0;
  limit: any = 10;
  search: any = '';
  sortKey: any = '-1';
  sortBy = null;
  sortClass: any = 'down';
  noRecordFound = false;
  filter: any;
  sidebarMenuName:string;
  cmsList = [
    {title:"RECRUITINGTXT.PRIVACYPOLICY",actionLink:"add-edit-privacy-policy"},
    {title:"RECRUITINGTXT.TERMANDCONDITION",actionLink:"add-edit-terms-conditions"},
    {title:"INSIGHTS_MENU.RECRUITING",actionLink:"add-edit-recruiting"},
    {title:"RECRUITINGTXT.SupplierPrivacyPolicy",actionLink:"supplier-privacy-policy"},
    {title:"RECRUITINGTXT.SupplierTermsAndConditions",actionLink:"supplier-terms-conditions"}
  ];

  cmsDisplayedColumns: string[]= ['action', 'title'];

  constructor(private cmsManagementService:CMSManagementService,
    private helper: MCPHelperService) { }

  ngOnInit(): void {
    this.sideMenuName();
    // this.getCmsListData();
  }

  // async getCmsListData(): Promise<void> {
  //   const cmsListData: any = await this.cmsManagementService.getCMSList();
  //   // this.cmsList = cmsListData.data;
  // }


  // onClickCMS(data: any) {
  //   this.cmsObject = data;
  //   if (this.cmsObject.type === 'privacy_policy') {
  //     this.cmsTitle = 'RECRUITINGTXT.PRIVACYPOLICY';
  //   } else {
  //     this.cmsTitle = 'RECRUITINGTXT.TERMANDCONDITION';
  //   }
  //   this.frmDetail.patchValue({
  //     id: this.cmsObject.id,
  //     descriptionEN: this.cmsObject.descriptionEN,
  //     descriptionIT: this.cmsObject.descriptionIT
  //   });
  //   this.tabgroup.selectedIndex = 1;
  //   this.showPrivacyDetail = true;
  // }

  changeItemsPerPage(){}
  sideMenuName(){
    this.sidebarMenuName = 'CMS';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }
}
