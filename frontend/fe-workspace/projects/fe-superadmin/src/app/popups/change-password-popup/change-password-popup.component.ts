import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import swal from "sweetalert2";
import {NSApiService} from "../../service/NSApi.service";

@Component({
  selector: 'app-change-password-popup',
  templateUrl: './change-password-popup.component.html',
  styleUrls: ['./change-password-popup.component.scss']
})
export class ChangePasswordPopupComponent implements OnInit {
  hide = true;
  hide1 = true;
  changePasswordPopupForm: FormGroup;
  clientId : any;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordPopupComponent>,
    private changePasswordFormBuilder: FormBuilder,
    private api : NSApiService,
    @Inject(MAT_DIALOG_DATA) public data : any
  ){
    this.changePasswordPopupForm = this.changePasswordFormBuilder.group({
      newPassword: [null, [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: [null, [Validators.required, Validators.minLength(6)]]
    },
    {validator: this.checkIfMatchingPasswords('newPassword', 'confirmNewPassword')}
    );
    this.clientId = this.data.id;
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (resetPasswordForm: FormGroup) => {
      let password = resetPasswordForm.controls[passwordKey],
      confirmPassword = resetPasswordForm.controls[passwordConfirmationKey];
      if (password.value !== confirmPassword.value) {
        return confirmPassword.setErrors({notEquivalent: true});
      }
      else {
        return confirmPassword.setErrors(null);
      }
    }
  }

  ngOnInit(): void {
    console.log('data>>>>>', this.clientId)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changePasswordFormSubmit():void{
    if (this.changePasswordPopupForm.valid){
      const clientChangePassData = {
        id : this.clientId,
        newPassword : this.changePasswordPopupForm.value.confirmNewPassword
      }
      this.api.changePasswordAPI(clientChangePassData).subscribe((data: any) => {
        const metaData: any = data.meta.message;
        swal.fire(
          'Deleted!',
          metaData,
          'success'
        );
        this.dialogRef.close();
      }, (err: any) => {
        const e = err.error;
        swal.fire(
          'Error!',
          err.error.message,
          'info'
        );
      });
    }
  }
}
