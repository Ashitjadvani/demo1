import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router} from "@angular/router";
import { LoginResult } from 'projects/fe-common-v2/src/lib/models/api/login-result';
import { TranslateService } from '@ngx-translate/core';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common-v2/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import swal from "sweetalert2";
import {VERSION} from "../../../../../fe-insights/src/environments/version";
import {MCPHelperService} from "../../service/MCPHelper.service";
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {


  registerAdmin: boolean;
  username: string;
  email: string;
  password: string;
  confPassword: string;
  version: string;
  forgotPasswordForm: FormGroup;
  showLoader: boolean = false;
  forgotPasswordPage: boolean = true;
  primaryColor:any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private userManagementService: UserManagementService,
    private adminUserManagementService: AdminUserManagementService,
    private commonService: CommonService,
    public translate: TranslateService,
    private helper: MCPHelperService,
    private location: Location
  ) {
    this.version = VERSION;
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required ])],
      // email: [' ', Validators.required]
    });
  }

  //emailFormControl = new FormControl('',[Validators.required,Validators.email, Validators.maxLength(50),Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$')]);

  async ngOnInit() {
    let res = await this.adminUserManagementService.getAdminConfigured();
    if (!this.commonService.isValidResponse(res)) {
      this.registerAdmin = true;
    }
    this.changeTheme("#4B6BA2");
  }


  async onSubmit() {
    if (this.forgotPasswordForm.valid){
      try {
        this.helper.toggleLoaderVisibility(true);
        this.showLoader = true;
        let res: LoginResult = await this.userManagementService.forgotPassword(this.forgotPasswordForm.value.email);
        if (res.result == true) {
          localStorage.setItem('resetPassword', JSON.stringify(this.forgotPasswordForm.value));
          this.helper.toggleLoaderVisibility(false);
          this.showLoader = false;
          this.forgotPasswordPage = !this.forgotPasswordPage;
          this.router.navigate(['/reset-password']);
          //this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.FORGOT SEND OTP SUCCESS'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
          swal.fire(
            '',
            this.translate.instant('ADMIN LOGIN PAGE.FORGOT SEND OTP SUCCESS'),
            'success',
          );
        } else {
          this.helper.toggleLoaderVisibility(false);
          this.showLoader = false;
          //this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.LOGIN FAILED') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
          swal.fire(
            '',
            this.translate.instant(res.reason),
            'info'
          );
        }
      } catch (ex) {
        this.helper.toggleLoaderVisibility(false);
        this.showLoader = false;
        //this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
        swal.fire(
          '',
          this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'),
          'info'
        )
      }
    }
  }
  changeTheme(primaryColor:string){
    document.documentElement.style.setProperty("--primary-color",primaryColor)
  }

  back():void{
    this.location.back();
  }

}
