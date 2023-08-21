import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CareerApiService } from '../../../service/careerApi.service';
import { CareerHelperService } from '../../../service/careerHelper.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-linkedin-login-response',
  templateUrl: './linkedin-login-response.component.html',
  styleUrls: ['./linkedin-login-response.component.scss']
})
export class LinkedinLoginResponseComponent implements OnInit {
  linkedInToken = "";
  access_token="";
  token="";
  baseUrlLink : any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private apiService:CareerApiService,
    private helper: CareerHelperService,
    private translate: TranslateService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.linkedInToken = this.route.snapshot.queryParams["code"];
    this.baseUrlLink = this.document.location.origin + '/linkedinLoginResponse'
  }

  ngOnInit() {
    this.helper.toggleSidebarVisibility(true);
    this.apiService.loginwithlinkedin({token:this.linkedInToken, redirectUrl: this.baseUrlLink}).subscribe((data: any) => {
      console.log("res----->",data)
      let signup = data.reason;
      if (signup){
      signup.type = 'linkedin';
      this.apiService.signup(signup).subscribe(
        (data: any) => {
          this.helper.toggleSidebarVisibility(false);
          let loginUser: any = data;
          if (loginUser.result) {
            this.helper.saveLocalStorage(loginUser);
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/login']);
            swal.fire(
              this.translate.instant('GENERAL.Sorry'),
              this.translate.instant(loginUser.reason),
              'info'
            );
          }
        },
        (err) => {
          this.helper.toggleSidebarVisibility(false);
          const e = this.translate.instant(err.result.reson);
          swal.fire(this.translate.instant('GENERAL.Sorry'), e, 'info');
        }
      );
      } else {

      }
      // if(data){
      // this.router.navigate(['/login' + data]);
      // this.helper.toggleSidebarVisibility(false);
      // }else{
      //   this.helper.toggleSidebarVisibility(false);
      //   swal.fire(
      //     'Sorry!',

      //     'info'
      //   );
      // }
    });


}


}
