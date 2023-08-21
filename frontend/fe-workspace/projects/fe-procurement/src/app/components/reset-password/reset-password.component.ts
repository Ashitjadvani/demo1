import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import swal from 'sweetalert2';
import {Router} from '@angular/router';
import {ApiService} from '../../service/api.service';
import {Subject} from 'rxjs';
import { HelperService } from '../../service/helper.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  hide = true;
  hide_1 = true;

  resetPasswordForm: FormGroup;
  private destroy$ = new Subject();

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private Api: ApiService,
              private translate: TranslateService) {
    this.resetPasswordForm = this.formBuilder.group({
        otp: [null, [Validators.required, Validators.minLength(6),HelperService.noWhitespaceValidator,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        password: [null, [Validators.required, Validators.minLength(6),HelperService.noWhitespaceValidator]],
        confirmPassword: [null, [Validators.required, Validators.minLength(6),HelperService.noWhitespaceValidator]]
      },
      {validator: this.ConfirmedValidator('password', 'confirmPassword')}
    );
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // this.router.navigate(['login']);
    if (this.resetPasswordForm.valid) {
      this.Api.resetPassword(this.resetPasswordForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe( (data) => {
          this.router.navigate(['/']);
          swal.fire(
            '',
            this.translate.instant(data.meta.message),
            'success'
          );
        }, (error) => {
          const e = error.error;
          swal.fire(
            'Info!',
            e.message,
            'info'
          );
        });
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


  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
