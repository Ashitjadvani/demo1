import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CareerHelperService} from "../../../service/careerHelper.service";
import {Router} from "@angular/router";
import { CareerApiService } from '../../../service/careerApi.service';
import swal  from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm : FormGroup;
  userDetails: any;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private helper: CareerHelperService,
    private apiService:CareerApiService,
    private translate: TranslateService
  ) {
    this.changePasswordForm = this._formBuilder.group({
      oldPassword: ['',Validators.required],
      newPassword: ['',Validators.required],
      confirmPassword: ['',Validators.required],
    },
    {validator: this.ConfirmedValidator('newPassword', 'confirmPassword')},
    );
  }
  changePassword(){
    if (this.changePasswordForm.valid) {
      this.helper.toggleSidebarVisibility(true);
       this.apiService.changePassword(this.changePasswordForm.value).subscribe((data: any) => {
        this.helper.toggleSidebarVisibility(false);
        if(data.result==true){
          swal.fire(
            '',
            this.translate.instant(data.reason),
          'success');
         // this.router.navigate(['/']);
        }else{
          swal.fire(
            this.translate.instant('GENERAL.Sorry'),
            this.translate.instant(data.reason),
          'info');
        }
      }
      );
    }

  }
  ngOnInit(): void {
    this.apiService.getUserdetail().subscribe((data: any) => {
      this.userDetails = data.user.type;
    });
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

  logout() {
    CareerHelperService.onLogOut();
    this.router.navigate(['/login']);
  }
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
