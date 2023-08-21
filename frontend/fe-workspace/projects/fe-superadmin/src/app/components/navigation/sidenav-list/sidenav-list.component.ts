import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ElementRef, Inject, Renderer2 } from '@angular/core';
import { NSHelperService } from '../../../service/NSHelper.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  navList:any[] = [
    {routLink:'dashboard',listIcon:'assets/images/dashboard-icon.svg',listIconHover:'assets/images/dashboard-hover.svg',caption:'Dashboard'},
    {routLink:'features',listIcon:'assets/images/features-icon.svg',listIconHover:'assets/images/features-hover.svg',caption:'Features'},
    {routLink:'contact-type',listIcon:'assets/images/contact-icon.svg',listIconHover:'assets/images/contact-hover.svg',caption:'Contact Type'},
    {routLink:'client-management',listIcon:'assets/images/client-icon.svg',listIconHover:'assets/images/client-hover.svg',caption:'Client Management'},
    {routLink:'activity-log',listIcon:'assets/images/activity-icon.svg',listIconHover:'assets/images/activity-hover.svg',caption:'Activity Log'}
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public elementRef: ElementRef,
    private renderer: Renderer2,
    private helper: NSHelperService
  ) { }

  ngOnInit(): void {
  }
  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  sidebarMenuName:any;
  sideMenuName(name: any){
    this.sidebarMenuName = name;
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

}
