import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import {ApiService} from '../../service/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-supplier-decline',
  templateUrl: './supplier-decline.component.html',
  styleUrls: ['./supplier-decline.component.scss']
})
export class SupplierDeclineComponent implements OnInit {

  supplierId: any;

  constructor(
    private Api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.paramMap.get('id');
    this.Api.declineByUser({id: this.supplierId}).subscribe((data) => {
      
      if( data.meta.message == 'declineSuccessfully'){
        swal.fire(
          '',
          this.translate.instant(data.meta.message),
          'success'
        );
      }else if(data.meta.message == 'userNotAbleToDecline'){
        swal.fire(
          '',
          this.translate.instant(data.meta.message),
          'info'
        );
      } else{
        swal.fire(
          '',
          this.translate.instant(data.meta.message),
          'info'
        );
      }
      
      this.router.navigate(['']);
    }, (error) => {
      const e = error.error;
      swal.fire(
        '',
        e.message,
        'info'
      );
    });
  }
}
