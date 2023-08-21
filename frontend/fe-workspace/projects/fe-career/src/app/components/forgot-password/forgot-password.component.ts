import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CareerApiService} from '../../service/careerApi.service';
import {CareerHelperService} from '../../service/careerHelper.service';
import swal from "sweetalert2";
import {ElementAst} from '@angular/compiler';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  logoImage = './assets/image/lagacy-logo.svg';
  //loginImg = './assets/image/login-signup.svg';
  loginImg = './assets/image/login-signup.svg';
  forgotPasswordForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: CareerApiService,
    private router: Router,
    private helper: CareerHelperService,
    private translate: TranslateService
  ) {
    this.forgotPasswordForm = _formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email, Validators.maxLength(50)])],
    });
  }

  onForgotPassword(): void {
    if (this.forgotPasswordForm.valid) {
      this.helper.toggleSidebarVisibility(true);
      this.apiService.forgotPassword(this.forgotPasswordForm.value).subscribe((data: any) => {
        this.helper.toggleSidebarVisibility(false);
        if (data.result == true) {
          /*swal.fire(
            'success',
            data.reason,
          'success');*/
          this.router.navigate(['/reset-password']);
        } else {
          swal.fire(
            'Sorry',
            this.translate.instant(data.reason),
            'info');
        }
      });
    }
  }

  ngOnInit(): void {
  }

}
