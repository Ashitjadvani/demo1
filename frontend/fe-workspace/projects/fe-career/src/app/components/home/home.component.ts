import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CareerApiService } from '../../service/careerApi.service';
import { CareerHelperService } from '../../service/careerHelper.service';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  heroImg = './assets/image/hero-img-new.png';
  joinTeamImg = './assets/image/join-team-img.svg';
  profileImg = './assets/image/job-profile.png';
  locationIcon = './assets/image/location.png';
  twitterIcon = './assets/image/twitter-circle-icon.svg';
  linkdinIcon = './assets/image/linkedin-circle-icon.svg';
  // linkdinIcon = './assets/image/linkdin.svg';
  // twitterIcon = './assets/image/twitter.svg';
  searchIcon = './assets/image/search-icon.svg';

  // application type
  applicationType: any = [
    { value: null, valueName: 'OTHERS.SelectPosition' },
    { value: '1', valueName: 'OTHERS.OpenPositions' },
    { value: '2', valueName: 'OTHERS.SpontaneousApplication' },
  ];
  //sort by value data
  sortBy: any = [
    { value: null, valueName: 'OTHERS.SelectSortType' },
    { value: 1, valueName: 'OTHERS.Newest' },
    { value: -1, valueName: 'OTHERS.Oldest' },
  ];

  recruitingDataObj:any;
  Career:string;
  BannerTitle:string;
  BannerContent:string;


  postiondata: any = [];
  departmentData: any;
  scopeData: any = [];
  filterDataForm: FormGroup;
  resultsLength = 0;
  pageNumber = 1;
  public current_page = 1;
  public per_page = 10;
  public total = 0;
  public limit = 10;
  public requestPara = {};
  ApplicationTypeArray: any = CareerHelperService.ApplicationTypeArray;
  baseImageUrl: any;
  isLoginUser: boolean = true;
  public spt:any;
  public spl:any;
  defaultImageInfo: any;

  constructor(
    private apiService: CareerApiService,
    private translate: TranslateService,
    private router: Router,
    public _formBuilder: FormBuilder,
    private helper: CareerHelperService
  ) {
    this.filterDataForm = this._formBuilder.group({
      searchKey: null,
      department: null,
      applicationType: null,
      sortBy: null,
      scopeBy: null,
    });
    this.baseImageUrl = apiService.baseImageUrl;
    this.isLoginUser = (!CareerHelperService.loginUserToken);
  }

  onScroll(event: any) {
    sessionStorage.setItem('scroll',JSON.stringify({
      st:event.srcElement.scrollTop,
      sl:event.srcElement.scrollLeft
    }));
  }

  imageBase64 = './assets/image/job-profile.png';

  ngOnInit(): void {

    let typeName = 'recruiting';
    let language = CareerHelperService.getLanguageName();
    this.apiService.getCMSDetails({type : typeName}).subscribe((data:any)=>{
      this.recruitingDataObj = data.data;

      console.log('data>>>>', this.recruitingDataObj);
      this.Career = (language === 'it') ? this.recruitingDataObj.recruiting_titleIT : this.recruitingDataObj.recruiting_titleEN;
      this.BannerTitle = (language === 'it') ? this.recruitingDataObj.recruiting_subtitleIT : this.recruitingDataObj.recruiting_subtitleEN;
      this.BannerContent = (language === 'it') ? this.recruitingDataObj.descriptionIT : this.recruitingDataObj.descriptionEN;
    });
    this.helper.languageTranslatorChange.subscribe((value) => {
      this.Career = value === 'it' ? this.recruitingDataObj.recruiting_titleIT : this.recruitingDataObj.recruiting_titleEN;
      this.BannerTitle = value === 'it' ? this.recruitingDataObj.recruiting_subtitleIT : this.recruitingDataObj.recruiting_subtitleEN;
      this.BannerContent = value === 'it' ? this.recruitingDataObj.descriptionIT : this.recruitingDataObj.descriptionEN;

    });


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

    this.positonListing({ page: 1, limit: this.limit });
    this.departmentListing();
    // if (CareerHelperService.loginUserToken) {
    //   this.router.navigate(['/position']);
    // }
    if(sessionStorage.getItem('scroll'))
    {
      //console.log("scrollTop available")
      var sp=JSON.parse(sessionStorage.getItem('scroll'));
      this.spt=sp.st;
      this.spl=sp.sl;
    }
  }

  onImgError(event): void{
    event.target.src = this.imageBase64;
  }
  // On Searching
  onSearch(): void {
    if (this.filterDataForm.valid) {
      this.apiService
        .searchPostionData(this.filterDataForm.value)
        .subscribe((data: any) => {
          this.postiondata = data.data;
        });
    }
  }

  onResetForm(): void {
    this.positonListing({ page: 1, limit: this.limit });
    this.departmentListing();
  }

  // Api calling for position listing
  positonListing(req: any): void {
    this.apiService.listOfPostion(req).subscribe(
      (data: any) => {
        this.helper.toggleSidebarVisibility(false);
        const totalRecords = data.totalCount ? data.totalCount : 0;
        this.postiondata = data.data;
        this.total = totalRecords;
      },
      (err) => {
        this.helper.toggleSidebarVisibility(false);
      }
    );
  }
  // Naviagte to Job-details page with id
  jobDetails(id: any): any {
    this.router.navigate(['/job-details/' + id]);
  }

  jobApplyNow(id: any): any {
    if (CareerHelperService.loginUserToken) {
      this.router.navigate(['/job-application/' + id]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  sendYourCV(): void {
    this.router.navigate(['/login']);
  }

  // department listing
  departmentListing(): void {
    this.apiService.listOfDepartment().subscribe((data: any) => {
      this.departmentData = data.data;
    });

    this.apiService.listOfScope().subscribe((data: any) => {
      this.scopeData = data.data;
    });
  }

  /**
   * Pagination function for page change event
   * @param event
   */
  handlePage(event: any): void {
    this.current_page = event;
    this.requestPara = {
      page: this.current_page,
      limit: this.limit,
    };
    this.positonListing(this.requestPara);
  }
}
