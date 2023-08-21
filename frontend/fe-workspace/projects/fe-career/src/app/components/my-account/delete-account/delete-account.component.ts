import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CareerHelperService} from "../../../service/careerHelper.service";
import {Router} from "@angular/router";
import { CareerApiService } from '../../../service/careerApi.service';
import Swal  from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { PopupConfirmDeleteComponent } from '../../../popup/popup-confirm-delete/popup-confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {
  logintype = "";
  authUser:any={};
  userDetails: any;
  constructor(
    private apiService: CareerApiService,
    private router: Router,
    private translate: TranslateService,
    public dialog : MatDialog) {
    let authUser: any = localStorage.getItem('loggedInUser');
    if (authUser) {
      this.authUser = JSON.parse(authUser);
      this.logintype=this.authUser.user.user.type;
    }
  }

  ngOnInit(): void {
    this.apiService.getUserdetail().subscribe((data: any) => {
      this.userDetails = data.user.type;
    });
  }

  deleteAccount(){
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: "500px",
      data: {
        message: 'MYACCOUNT.DeleteAccountPermanentlyTXT'
      }
    });
    let that =  this;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.apiService.deleteUser().subscribe((data: any) => {
          CareerHelperService.onLogOut();
          that.router.navigate(['/']);
          Swal.fire(
            this.translate.instant('OTHERS.Deleted'),
            that.translate.instant(data.reason),
            'success'
          );
        }, (err: any) => {
          const e = err.error;
          Swal.fire(
            'Error!',
            err.error.message,
            'info'
          );
        });
      }
    });

  }

  logout() {
    CareerHelperService.onLogOut();
    this.router.navigate(['/login']);
  }
}
