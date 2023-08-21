import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {PeopleManagementService} from '../../../../../../fe-common-v2/src/lib/services/people-management.service';
import {DeletePopupComponent} from '../../../popup/delete-popup/delete-popup.component';
import swal from 'sweetalert2';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-view-area-details',
  templateUrl: './view-area-details.component.html',
  styleUrls: ['./view-area-details.component.scss']
})
export class ViewAreaDetailsComponent implements OnInit {
  areaDetails: any = new MatTableDataSource([]);

  constructor(public dialog: MatDialog,
              private router: Router,
              private activitedRoute: ActivatedRoute,
              private ApiService: PeopleManagementService,
              private helper: MCPHelperService,
              public translate: TranslateService) { }

  ngOnInit(): void {
    this.getdetails();
  }
  async getdetails(): Promise<void> {
    const name: any = this.activitedRoute.snapshot.queryParams.name;
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.viewArea(name);
    if (res.result === true) {
      this.areaDetails = res.reason[0];
      this.helper.toggleLoaderVisibility(false);
    }else {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(res.reason),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }

  areaDeleteDialog(): void{
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'PEOPLE_MANAGEMENT.Are you sure you want to delete this Area ?', heading: 'Delete Area'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteArea(this.areaDetails.name).then((data: any) => {
            const metaData: any = data.reason;
            this.router.navigate(['people-management']);
            swal.fire(
              '',
              this.translate.instant('Swal_Message.AreaHasBeenDeletedSuccessfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);

          }, (err) => {
            this.helper.toggleLoaderVisibility(false);
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
  editArea(): void {
    this.router.navigate([`people-management/add-edit-areas/` + this.areaDetails.name], { queryParams: {id: this.areaDetails.id},
      //skipLocationChange: true
    });
  }
}
