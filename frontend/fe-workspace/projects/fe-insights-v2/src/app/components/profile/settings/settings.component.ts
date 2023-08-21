import { Component, OnInit } from '@angular/core';
import { MCPHelperService } from '../../../service/MCPHelper.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  sidebarMenuName:string;
  constructor(private helper:MCPHelperService) { }

  ngOnInit(): void {
    this.sideMenuName();
  }
  sideMenuName(){
    this.sidebarMenuName = 'Settings';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

}
