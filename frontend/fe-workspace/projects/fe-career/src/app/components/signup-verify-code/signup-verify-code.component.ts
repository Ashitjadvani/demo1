import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {CareerApiService} from '../../service/careerApi.service';
import swal from 'sweetalert2';
import {CareerHelperService} from '../../service/careerHelper.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-signup-verify-code',
  templateUrl: './signup-verify-code.component.html',
  styleUrls: ['./signup-verify-code.component.scss']
})
export class SignupVerifyCodeComponent implements OnInit {
  logoImage = './assets/image/lagacy-logo.svg';
  loginImg = './assets/image/login-signup.svg';
  verifyForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: CareerApiService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private helper: CareerHelperService,
    private translate: TranslateService
  ) {
    const signUPEmailID = CareerHelperService?.signUPEmailID ? CareerHelperService.signUPEmailID : null;
    if (!signUPEmailID) {
      this.router.navigate(['/login']);
    }
    this.verifyForm = this.formBuilder.group({
        verificationCode: ['', Validators.compose([Validators.required,CareerHelperService.noWhitespaceValidator])],
        email: [signUPEmailID, Validators.required]
      }
    );
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.verifyForm.valid) {
      this.helper.toggleSidebarVisibility(true);
      this.apiService.verifyOTP(this.verifyForm.value).subscribe((data: any) => {
          this.helper.toggleSidebarVisibility(false);
          if (data.result === true) {
              this.helper.saveLocalStorage(data);
              this.router.navigate(['/']);
          } else {
            swal.fire(
              this.translate.instant('GENERAL.Sorry'),
              this.translate.instant('VERIFYSIGNUPFORM.' + data.reason),
              'info');
          }
        }, (err) => {
          this.helper.toggleSidebarVisibility(false);
      });
    }
  }

  resendVerificationCode(): void {
    this.helper.toggleSidebarVisibility(true);
    this.apiService.resendOTP({email: this.verifyForm.value.email}).subscribe((data: any) => {
      this.helper.toggleSidebarVisibility(false);
      if (data.result === true) {
        swal.fire(
          '',
          this.translate.instant('VERIFYSIGNUPFORM.' + data.reason),
          'info'
        );
      } else {
        swal.fire(
          this.translate.instant('GENERAL.Sorry'),
          this.translate.instant(data.reason),
          'info');
      }
    }, (err) => {
      this.helper.toggleSidebarVisibility(false);
    });
  }
}
