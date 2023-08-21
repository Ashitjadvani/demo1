import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import swal from 'sweetalert2';
import {Router} from '@angular/router';
import {ApiService} from '../../service/api.service';
import {Subject} from 'rxjs';
import {HelperService} from '../../service/helper.service';
import {TranslateService} from '@ngx-translate/core';

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
    private Helper: HelperService,
    private Api: ApiService,
    private translate: TranslateService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      companyReferenceEmail: [null, Validators.compose([Validators.required, Validators.email, Validators.maxLength(50) ])]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // this.router.navigate(['reset-password']);
    if (this.forgotPasswordForm.valid) {
      this.Helper.toggleLoaderVisibility(true);
      this.Api.forgotPassword(this.forgotPasswordForm.value).pipe(takeUntil(this.destroy$)).subscribe( (data) => {
          this.Helper.toggleLoaderVisibility(false);
          if (data.data === 1){
            this.router.navigate(['reset-password']);
          }else {
            swal.fire(
              '',
              this.translate.instant('RESETPASSWORDFORM.Unauthorized_User'),
              'error'
            );
          }
        }, (error) => {
          this.Helper.toggleLoaderVisibility(false);
          const e = error.error;
          swal.fire(
            '',
            this.translate.instant(e.message),
            'info'
          );
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }
  // tslint:disable-next-line:typedef
  public space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
