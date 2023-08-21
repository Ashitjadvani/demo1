import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MCPHelperService } from '../../service/MCPHelper.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  sidebarMenuName:string;
  constructor(private location:Location,
    private helper:MCPHelperService) { }

  ngOnInit(): void {
    this.sideMenuName();
  }
  sideMenuName(){
    this.sidebarMenuName = 'Page not found';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

  back(){
    this.location.back();
  }

}
