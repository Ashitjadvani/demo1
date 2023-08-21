import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MCPHelperService} from '../../../../service/MCPHelper.service';
import {RecruitingCandidateManagementService} from '../../../../../../../fe-common-v2/src/lib/services/recruiting-candidate-management.service';
import {MatTableDataSource} from '@angular/material/table';
import swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import {TranslateService} from '@ngx-translate/core';
import { environment } from 'projects/fe-insights-v2/src/environments/environment';
import { RecruitingManagementService } from 'projects/fe-common-v2/src/lib/services/recruiting-management.service';
import { data } from 'jquery';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-candidates',
  templateUrl: './view-candidates.component.html',
  styleUrls: ['./view-candidates.component.scss']
})
export class ViewCandidatesComponent implements OnInit {
  candidateDetails: any = new MatTableDataSource([]);
  applicationStatus: any = new MatTableDataSource([]);
  id: any;
  noRecordFound = false;
  resumeId:any;
  fileName:'';
  url: string = '';
  videoURL:string = '';
  videoId:any;
  momentTime: any;
  baseURL = environment.api_host;
  baseImageUrl: string = this.baseURL+'/v2/data-storage/download/';
  constructor(
              private activitedRoute: ActivatedRoute,
              private router: Router,
              private helper: MCPHelperService,
              private ApiServices: RecruitingCandidateManagementService,
              private DocDetailsAPI:RecruitingManagementService,
              public translate: TranslateService,
              private location: Location ) { }

  public bussines_data: any[] =[];
  displayedColumns: string[] = ['appBy','jobOpeningType','DateTime', 'appNote','appStatus','action'];
  dataSource = this.bussines_data;
  resultsLength = 0;

  ngOnInit(): void {
    this.getCandidateDetails();
  }




  async getCandidateDetails(): Promise<void> {
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    this.helper.toggleLoaderVisibility(true);
    const res: any = await this.ApiServices.viewCandidate({person_id: this.id});
    const result: any = await this.ApiServices.viewCandidate1({person_id: this.id});
    if (res && result) {
      this.candidateDetails = res.data ;
      this.applicationStatus = result.data;
      this.noRecordFound = this.applicationStatus.length > 0;
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
    if (this.candidateDetails.resumeId !== ''){
      // pdf viewer
      this.ApiServices.downloadDocument(this.candidateDetails.resumeId).subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        this.url = window.URL.createObjectURL(blob);
        this.resumeId = this.candidateDetails.resumeId;
      });
    }

    if (this.candidateDetails.videoId !== ''){
      //video viewer
      this.ApiServices.downloadDocument(this.candidateDetails.videoId).subscribe((res:any) =>{
        this.videoId = this.candidateDetails.videoId;
      });
      const response = await this.DocDetailsAPI.getOpeningImage(this.candidateDetails.videoId)
      this.videoURL = this.baseImageUrl + response.data.id;
    }
  }



  downloadCv(): void {
    this.helper.toggleLoaderVisibility(true);
    this.ApiServices.downloadDocument(this.candidateDetails.resumeId).subscribe((res: any) => {

      const blob = new Blob([res], { type: 'application/pdf' });
      this.url = window.URL.createObjectURL(blob);
          this.resumeId = this.candidateDetails.resumeId,
          this.fileName = this.candidateDetails.nome
          FileSaver.saveAs(blob, this.candidateDetails.nome + '-cv-' + this.momentTime + '.pdf');
          this.helper.toggleLoaderVisibility(false);
    }, error => {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant('TABLE.No_record_found'),
        'info'
      );
    });
  }

  viewJobDetails(id){
    this.router.navigate(['recruiting/job-applications/view-job-applications/'+ id], { state: { id: id } });
  }

  downloadVideo(){
    this.helper.toggleLoaderVisibility(true);
    this.ApiServices.downloadDocument(this.candidateDetails.videoId).subscribe((res:any) =>{
      const blob = new Blob([res], { type: 'mp4' });
      this.videoURL = window.URL.createObjectURL(blob);
      this.videoId = this.candidateDetails.videoId,
      FileSaver.saveAs(blob, this.candidateDetails.nome + '-video-' + this.momentTime + '.mp4');
      this.helper.toggleLoaderVisibility(false);
    },error =>{
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        // err.error.message,
        this.translate.instant('TABLE.No_record_found'),
        'info'
      );
    });
  }

  back():void{
    this.location.back();
  }

  // viewMore(): any {
  //   this.id = this.aR.snapshot.paramMap.get('id');
  //   this.api.viewMore(this.id).subscribe((res: any) => {
  //     this.clientDetail = res;
  //   });
  // }
}
