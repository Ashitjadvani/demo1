import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from 'projects/fe-insights-v2/src/app/popup/delete-popup/delete-popup.component';
import swal from "sweetalert2";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {QuizMatrixService} from "../../../../../../../fe-common-v2/src/lib/services/quiz-matrix.service";

@Component({
  selector: 'app-view-metrics',
  templateUrl: './view-metrics.component.html',
  styleUrls: ['./view-metrics.component.scss']
})
export class ViewMetricsComponent implements OnInit {
  matrixDetails: any = new MatTableDataSource([]);
  constructor(public dialog:MatDialog,
              private router: Router,
              private activitedRoute: ActivatedRoute,
              private ApiService: QuizMatrixService,
              private helper: MCPHelperService,
              public translate: TranslateService) {}

  ngOnInit(): void {
    this.getdetails();
  }
  async getdetails(): Promise<void> {
    const id = this.activitedRoute.snapshot.paramMap.get('id');
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiService.viewMatrix({id: id});
    if (res.result === true) {
      this.matrixDetails = res.data;
      this.helper.toggleLoaderVisibility(false);
    }else {
      this.helper.toggleLoaderVisibility(false);
      // const e = err.error;
      swal.fire(
        '',
        // err.error.message,
        this.translate.instant(res.reason),
        'info'
      );
    }
    this.helper.toggleLoaderVisibility(false);
  }

  metricsDeleteDialog(id: any): any{
    const that = this;
    const dialogRef = this.dialog.open(DeletePopupComponent,{
      data: {message: 'Are you sure you want to delete this Metric', heading: 'Delete Metric'}
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.helper.toggleLoaderVisibility(true);
          that.ApiService.deleteMatrix(id).then((data: any) => {
            const metaData: any = data.reason;
            // this.getMatrixList(this.requestPara);
            this.router.navigate(['/quiz-survey/metrics']);
            swal.fire(
              '',
              this.translate.instant('Swal_Message.Matrices deleted successfully'),
              'success'
            );
            this.helper.toggleLoaderVisibility(false);
            // that.getMatrixList(this.requestPara);
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
  edit(id: string): void {
    this.router.navigate([`/quiz-survey/metrics/add-edit-metrics/` + id]);
  }
}
