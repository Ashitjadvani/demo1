import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {ApiService} from '../../service/api.service';
import {takeUntil} from 'rxjs/operators';
import swal from 'sweetalert2';
import {HelperService} from '../../service/helper.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-email-varification',
  templateUrl: './email-varification.component.html',
  styleUrls: ['./email-varification.component.scss']
})
export class EmailVarificationComponent implements OnInit {
  hide = true;
  emailVerificationForm: FormGroup;
  companyReference = HelperService.companyReferenceEmail;
  private destroy$ = new Subject();

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private Helper: HelperService,
              private Api: ApiService,
              private translate: TranslateService,) {

    if (!this.companyReference){
      this.router.navigate(['signup']);
    }
    this.emailVerificationForm = this.formBuilder.group({
      companyReferenceEmail: [this.companyReference],
      otp: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6),HelperService.noWhitespaceValidator, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });
  }

  onSubmit(): void {
    if (this.emailVerificationForm.valid) {
      this.Helper.toggleLoaderVisibility(true);
      this.Api.signupVerification(this.emailVerificationForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.Helper.toggleLoaderVisibility(false);
          this.router.navigate(['signup-submit']);
        }, (error) => {
          this.Helper.toggleLoaderVisibility(false);
          const e = error.error;
          swal.fire(
            this.translate.instant('GENERAL.Sorry'),
            // e.message,
            this.translate.instant('swal_text.OTPinvalid'),
            'info'
          );
        });
    }
  }

  resendCode(): void {
    this.Api.resendVerification({companyReferenceEmail: this.emailVerificationForm.value.companyReferenceEmail})
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        swal.fire(
          '',
          // data.meta.message,
          this.translate.instant('swal_text.OTP re-sent successfully'),
          'success'
        );
      }, (error) => {
        const e = error.error;
        swal.fire(
          this.translate.instant('GENERAL.Sorry'),
          // e.message,
          this.translate.instant('swal_text.Supplier not exist or OTP verified'),
          'info'
        );
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

}
