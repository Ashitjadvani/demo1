import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {HelperService} from '../../../service/helper.service';
import swal from 'sweetalert2';
import {ApiService} from "../../../service/api.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  hide = true;
  hide1 = true;
  hide2 = true;
  changePasswordForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private Helper: HelperService,
    private Api: ApiService,
    private translate: TranslateService
  ) {
    this.changePasswordForm = this._formBuilder.group({
        old_password: ['', [HelperService.noWhitespaceValidator]],
        new_password: ['', Validators.compose([HelperService.noWhitespaceValidator, Validators.minLength(6)])],
        confirmPassword: ['', [HelperService.noWhitespaceValidator]],
      },
      {validator: this.ConfirmedValidator('new_password', 'confirmPassword')},
    );
  }

  changePassword(): void {
    if (this.changePasswordForm.valid) {
      this.Helper.toggleLoaderVisibility(true);
      this.Api.changePassword(this.changePasswordForm.value).subscribe((data: any) => {
        this.Helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant(data.meta.message),
          'success');
       }, (error) => {
         this.Helper.toggleLoaderVisibility(false);
         const e = error.error;
         swal.fire(
           'Info!',
           e.message,
           'info'
         );
       });
    }
  }

  ngOnInit(): void {
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


}
