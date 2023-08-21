import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from "rxjs/operators";
import swal from "sweetalert2";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {NSApiService} from "../../service/NSApi.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  hide = true;

  resetPasswordForm: FormGroup;
  private destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private Api: NSApiService,
  ) {
    this.resetPasswordForm = this.formBuilder.group({
        otp: [null, [Validators.required]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        conf_password: [null, [Validators.required, Validators.minLength(6)]]
      },
      {validator: this.checkIfMatchingPasswords('password', 'conf_password')}
    );
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.Api.resetPassword(this.resetPasswordForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe( (data) => {
          this.router.navigate(['login']);
          swal.fire(
            'Info!',
            data.meta.message,
            'error'
          );
        }, (error) => {
          const e = error.error;
          swal.fire(
            'Info!',
            e.message,
            'error'
          );
        });
    }
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string): any {
    return (resetPasswordForm: FormGroup) => {
      const password = resetPasswordForm.controls[passwordKey],
        conf_password = resetPasswordForm.controls[passwordConfirmationKey];
      if (password.value !== conf_password.value) {
        return conf_password.setErrors({notEquivalent: true});
      } else {
        return conf_password.setErrors(null);
      }
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

}
