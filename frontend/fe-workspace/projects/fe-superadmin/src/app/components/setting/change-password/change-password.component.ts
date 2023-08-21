import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { NSApiService } from '../../../service/NSApi.service';
import { NSHelperService } from '../../../service/NSHelper.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  hide = true;
  hide1 = true;
  hide2 = true;
  changePasswordForm : FormGroup;
  sidebarMenuName:string;
  constructor(private _formBuilder: FormBuilder,
    private APIservice : NSApiService,
    private helper:NSHelperService) {
    this.changePasswordForm = this._formBuilder.group({
      old_password: [''],
      new_password: [''],
      confirmPassword: [''],
    },
    {validator: this.checkIfMatchingPasswords('new_password', 'confirmPassword')},
    );

  }

  ngOnInit(): void {
    this.sideMenuName();
  }

  sideMenuName(){
    this.sidebarMenuName = 'Settings';
    this.helper.sideMenuListName.next(this.sidebarMenuName);
  }

  changePassword(){
    if(this.changePasswordForm.valid){
      this.APIservice.chnagePassword(this.changePasswordForm.value).subscribe((data:any)=>{
        if(data.statusCode=='200'){
          Swal.fire(
            '',
            data.meta.message,
          'success');
        }else{
          Swal.fire(
            '',
            data.meta.message,
            'info'
          );
        }
      },(err) => {
        Swal.fire('Error!', err.error.meta.message, 'info');
      }
      );
    }
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

}
