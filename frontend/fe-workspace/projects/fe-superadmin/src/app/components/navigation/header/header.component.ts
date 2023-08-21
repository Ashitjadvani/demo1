import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import {Router} from '@angular/router';
import { NSApiService } from '../../../service/NSApi.service';
import {NSHelperService} from "../../../service/NSHelper.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  toggleIcon='assets/images/toggle-icon.svg';
  profileIMG='';
  public config: any = {};
  panelOpenState = false;
  loginUserData: any = {};
  loginIncidentsData: any = {};
  sideListMenuName: string = 'Dashboard';

  logoId:any;
  profileDetails:any;
  firstName:string;
  lastName:string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private helper: NSHelperService,
    private APIservice: NSApiService
  ) {
    this.helper.invokeFirstComponentFunction.subscribe((name:string) => {
      this.firstChangeImageFunction();
    });
    this.helper.sideMenuListName.subscribe((name: any) => {
      this.sideListMenuName = name;
    });
    this.helper.profileFirstName.subscribe((namefirst:any)=>{
      this.firstName = namefirst;
    });
    this.helper.profileLastName.subscribe((nameLast:any)=>{
      this.lastName = nameLast
    });
   }

  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }

  ngOnInit(): void {
    this.firstChangeImageFunction();
  }

  firstChangeImageFunction(){
    const NSLoggedInUser = JSON.parse(localStorage.getItem('NSLoggedInUser'))
    this.APIservice.editViewProfile(NSLoggedInUser.id).subscribe((data:any)=>{
      this.firstName = data.data.first_name;
      this.lastName = data.data.last_name;
      this.logoId = data.data.profile_id;
      if(this.logoId){
        this.APIservice.editViewProfileImg(this.logoId).subscribe((data:any)=>{
          this.profileIMG = data.data;
        });
      }
    });
  }

  logOUT() {
    NSHelperService.onLogOut();
    this.router.navigate(['/']);
  }

  sideMenuName(){
    this.sideListMenuName = 'Settings';
  }

}
