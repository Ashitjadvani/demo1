import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CareerApiService } from '../../service/careerApi.service';
import {CareerHelperService} from "../../service/careerHelper.service";
import {Location} from '@angular/common';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  profileImg ="./assets/image/job-profile.png";
  socialicon_1 = "./assets/image/share-1.svg";
  socialicon_2 = "./assets/image/share-2.svg";
  socialicon_3 = "./assets/image/share-3.svg";
  socialicon_4 = "./assets/image/share-4.svg";
  jobDetailsData:any = {};
  jobId:any;
  baseImageUrl: any;
  ApplicationTypeArray: any = CareerHelperService.ApplicationTypeArray;
  imageBase64 = './assets/image/job-profile.png';
  defaultImageInfo: any;

  constructor(private apiService: CareerApiService, public helper: CareerHelperService,
              private translate: TranslateService,
    public route: ActivatedRoute, private router: Router, private location: Location ) {
     this.jobId = this.route.snapshot.paramMap.get('id');
      this.baseImageUrl = apiService.baseImageUrl;
   }


  ngOnInit(): void {

  this.apiService.getDefaultImage({type: 'job_default'}).subscribe( resImage => {
    this.defaultImageInfo = resImage.data;
    if (this.defaultImageInfo) {
      this.apiService.getImage({id: this.defaultImageInfo.fileId}).subscribe((image: any) => {
        if (image.data) {
          this.imageBase64 = image.data;
        }
      });
    }
  });
  this.getpostionData();
  }

  onImgError(event): void{
    event.target.src = this.imageBase64;
  }

  getpostionData(): void {
    this.apiService.detailsOfPostion({jobId: this.jobId}).subscribe((data: any) => {
      if (data.data && !this.helper.isEmpty(data.data)) {
        this.jobDetailsData = data.data;
      } else {
        swal.fire(
          this.translate.instant('GENERAL.Sorry'),
          this.translate.instant('JOBDETAILS.JobOpeningCouldNotFound'),
          'info'
        );
        this.router.navigate(['/']);
      }
    });
  }

  jobApplyNow(id: any): any {
    if (CareerHelperService.loginUserToken) {
      this.router.navigate(['/job-application/' + id]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  back(): void {
    this.location.back();
  }


}
