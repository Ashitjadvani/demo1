import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NSApiService} from '../../service/NSApi.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  private destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private Api: NSApiService,
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required,Validators.email,Validators.maxLength(50)])]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.Api.forgotPassword(this.forgotPasswordForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe( (data) => {
          this.router.navigate(['reset-password']);
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

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }
}
