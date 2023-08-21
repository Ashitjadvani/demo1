import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CareerApiService } from '../../service/careerApi.service';
import swal  from 'sweetalert2';
import { CareerHelperService } from '../../service/careerHelper.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  logoImage = "./assets/image/lagacy-logo.svg";
  loginImg = "./assets/image/login-signup.svg";
  resetPasswordForm:FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private apiService:CareerApiService,
    private router:Router,
    private activeRouter: ActivatedRoute,
    private helper: CareerHelperService,
    private translate: TranslateService
  ) {
    this.resetPasswordForm=this.formBuilder.group({
      resetCode: ['',Validators.required],
      password:['',Validators.required],
      confirmPassword:['',Validators.required]
    },
    {validator: this.ConfirmedValidator('password', 'confirmPassword')},
    );


  }

  ngOnInit(): void {
  }
  OnResetPass(){
    if (this.resetPasswordForm.valid) {
      this.helper.toggleSidebarVisibility(true);
       this.apiService.resetPassword(this.resetPasswordForm.value).subscribe((data: any) => {
        this.helper.toggleSidebarVisibility(false);
        if(data.result==true){
          swal.fire(
            '',
            this.translate.instant(data.reason),
          'success');
          this.router.navigate(['/']);
        }else{
          swal.fire(
            this.translate.instant('GENERAL.Sorry'),
            this.translate.instant(data.reason),
          'info');
        }
      }
      );
    }

  }
  //check password and confirmpassword is same or not
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


}
