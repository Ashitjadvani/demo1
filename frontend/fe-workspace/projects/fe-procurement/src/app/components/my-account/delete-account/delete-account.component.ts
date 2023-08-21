import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../popups/delete-popup/delete-popup.component';
import {HelperService} from '../../../service/helper.service';
import {ApiService} from '../../../service/api.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

  constructor( public dialog: MatDialog,
               private Api: ApiService,
               private router: Router,
               private Helper: HelperService,
               public translate: TranslateService
               ) { }

  ngOnInit(): void {
  }

  deleteAccount(): void {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '692px',
      data: {
        message: 'MYACCOUNT.DeleteAccountPermanentlyTXT',
      }
    });
    const that =  this;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.Api.deleteUser({id : localStorage.getItem('NPLoginId')}).subscribe((data: any) => {
          HelperService.onLogOut();
          that.router.navigate(['/']);
          swal.fire(
            '',
            this.translate.instant(data.meta.message),
            'success'
          );
        }, (err: any) => {
          const e = err.error;
          swal.fire(
            '',
            this.translate.instant(err.error.message),
            'info'
          );
        });
      }
    });
  }

}
