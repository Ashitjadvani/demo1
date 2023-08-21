import {Component, OnInit, ViewChild} from '@angular/core';
import {CareerApiService} from '../../service/careerApi.service';
import {CareerHelperService} from '../../service/careerHelper.service';
import {Router} from '@angular/router';
import {PopupConfirmDeleteComponent} from '../../popup/popup-confirm-delete/popup-confirm-delete.component';
import Swal from 'sweetalert2';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';

export interface myAccountData {
  jobTitle: string;
  applicationType: string;
  site: string;
  department: string;
  submissionDate: string;
  status: string;
  actions: string;
}

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  logintype = '';
  authUser: any = {};
  userDetails: any;

  constructor(private apiService: CareerApiService, private router: Router, public dialog: MatDialog, private translate: TranslateService) {
    let authUser: any = localStorage.getItem('loggedInUser');
    if (authUser) {
      this.authUser = JSON.parse(authUser);
      this.logintype = this.authUser.user.user.type;
    }
  }

  displayedColumns: string[] = ['jobTitle', 'applicationType', 'site', 'department', 'submissionDate', 'status', 'actions'];
  dataSource: any;

  ngOnInit(): void {
    this.getApplicationData();
    this.apiService.getUserdetail().subscribe((data: any) => {
      this.userDetails = data.user;
    });
  }

  getApplicationData(): any {
    this.apiService.applicationDataListing().subscribe((data: any) => {
      this.dataSource = data.data;
    });
  }

  logout(): void {
    CareerHelperService.onLogOut();
    this.router.navigate(['/login']);
  }

  redirectJobApp(opening_id: any, status: any): any {
    let id = opening_id;
    if (status === 'Draft') {
      this.router.navigate(['/job-application/' + id]);
    } else {
      this.router.navigate(['/job-application-details/' + id]);
    }
  }

  handleActionsClick(event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  deleteMyApplication(id: any, index: number, event: any): any {
    event.stopPropagation();
    event.preventDefault();
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: '500px',
      data: {
        message: 'MYACCOUNT.DeleteConfirmation'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteJobApplication({id}).subscribe(data => {
          this.getApplicationData();
          Swal.fire(
            this.translate.instant('OTHERS.Deleted'),
            this.translate.instant(data.reason),
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
}
