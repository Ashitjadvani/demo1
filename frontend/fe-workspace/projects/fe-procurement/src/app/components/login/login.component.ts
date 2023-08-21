import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {HelperService} from '../../service/helper.service';
import {ApiService} from '../../service/api.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {Subject} from 'rxjs';
import { WhiteSpaceValidator } from '../../store/whitespace.validator';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  loginForm: FormGroup;
  private destroy$ = new Subject();

  constructor(private formBuilder: FormBuilder,
              private Api: ApiService,
              private Helper: HelperService,
              private router: Router,
              private translate:TranslateService
  ) {
    let RememberMe: any = localStorage.getItem('RememberMe');
    let isRemberMeChecked = false;
    let email = null;
    let password = null;

    if (RememberMe) {
      RememberMe = JSON.parse(RememberMe);
      if (RememberMe && RememberMe.isRemberMeChecked){
        isRemberMeChecked = true;
        email = RememberMe.username;
        password = RememberMe.password;
      }
    }

    this.loginForm = this.formBuilder.group({
      email: [email, Validators.compose([Validators.required, Validators.maxLength(50)])], // ,Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$')])],
      password: [password, Validators.compose([Validators.required,HelperService.noWhitespaceValidator])]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.Helper.toggleLoaderVisibility(true);
      this.Api.login(this.loginForm.value).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.Helper.toggleLoaderVisibility(false);
        const user = data.data;
        HelperService.saveLocalStorage(user);
        if (this.loginForm.value.isRemberMeChecked) {
          localStorage.setItem('RememberMe', JSON.stringify(this.loginForm.value));
        } else {
          localStorage.removeItem('RememberMe');
        }
        this.router.navigate(['my-account/edit-profile']);
      }, (error) => {
        this.Helper.toggleLoaderVisibility(false);
        const e = error.error;
        // console.log('',error.error.message);
        swal.fire(
          '',
          this.translate.instant(error.error.message),
          'info'
        );
      });
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
