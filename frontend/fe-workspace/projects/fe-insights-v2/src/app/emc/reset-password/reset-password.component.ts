import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { LoginResult } from 'projects/fe-common-v2/src/lib/models/api/login-result';
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import Swal from 'sweetalert2';
import { MCPHelperService } from '../../service/MCPHelper.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class EMCResetPasswordComponent implements OnInit {
  hide = true;
  resetPasswordForm: any =  FormGroup ;
  primaryColor:any;
  loginResetPassword:true;
  resetPasswordMethod:any;
  otpDisabled:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router : Router,
    private translate: TranslateService,
    private userManagementService: UserManagementService,
    private helper:MCPHelperService,
    private location: Location
  ) {
    this.resetPasswordForm = this.formBuilder.group({
        otp: [null, [Validators.required, Validators.minLength(6)]],
        newPassword: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
        confPassword: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      },
      {validator: this.ConfirmedValidator('newPassword', 'confPassword')},
    );
  }

  // this.newPasswordFormControl = new FormControl('',[Validators.required,Validators.minLength(6)]);
  // this.confirmPasswordFormControl = new FormControl('',[Validators.required,Validators.minLength(6)]);

  ngOnInit(): void {
    this.changeTheme("#4B6BA2");
    const loginData = localStorage.getItem('reset-otp');
    console.log(loginData)
    if(loginData != "undefined") {
      this.otpDisabled = true;
      this.resetPasswordForm.patchValue({
        otp: loginData
      })
    } else {
      this.otpDisabled = false;
      this.resetPasswordForm.patchValue({
        otp: [null]
      })
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  async onSubmit(){
    if (this.resetPasswordForm.valid){
      try {
        this.helper.toggleLoaderVisibility(true);
        const loginPasswordData = localStorage.getItem('reset-password');
        console.log('loginPasswordData',loginPasswordData);

        // this.loginResetPassword =
        if(loginPasswordData){
          let res: LoginResult = await this.userManagementService.resetPasswordLogin(this.resetPasswordForm.value.otp,this.resetPasswordForm.value.newPassword,this.resetPasswordForm.value.confPassword);
          this.resetPasswordMethod = res;
        }else{
          let res: LoginResult = await this.userManagementService.resetPassword(this.resetPasswordForm.value.otp,this.resetPasswordForm.value.newPassword,this.resetPasswordForm.value.confPassword);
          this.resetPasswordMethod = res;
        }

        if (this.resetPasswordMethod.result == true) {
          this.helper.toggleLoaderVisibility(false);
          this.router.navigate(['']);
          Swal.fire(
            '',
            this.translate.instant('Your password has been reset successfully'),
            'success',
          );
        } else {
          this.helper.toggleLoaderVisibility(false);
          Swal.fire(
            '',
            this.translate.instant(this.resetPasswordMethod.reason),
            'info'
          );
        }
      } catch (ex) {
        this.helper.toggleLoaderVisibility(false);
        Swal.fire(
          '',
          this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'),
          'info'
        )
      }
    }

  }

  async resendOTP(){
    const resendOTP: any = localStorage.getItem('resetPassword');
    let email =  JSON.parse(resendOTP);
    console.log('resendOTP', email);

    try {
      this.helper.toggleLoaderVisibility(true);
      let res: LoginResult = await this.userManagementService.forgotPassword(email.email);
      if (res.result == true) {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/reset-password']);
        Swal.fire(
          '',
          this.translate.instant('ADMIN LOGIN PAGE.FORGOT SEND OTP SUCCESS'),
          'success',
        );
      } else {
        this.helper.toggleLoaderVisibility(false);
        Swal.fire(
          '',
          this.translate.instant(res.reason),
          'info'
        );
      }
    } catch (ex) {
      this.helper.toggleLoaderVisibility(false);
      //this.snackBar.open(this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
      Swal.fire(
        '',
        this.translate.instant('ADMIN LOGIN PAGE.ERROR CONNECTING SERVER'),
        'info'
      )
    }
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
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
