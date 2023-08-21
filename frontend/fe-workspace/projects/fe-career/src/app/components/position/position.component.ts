import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CareerApiService} from '../../service/careerApi.service';
import {CareerHelperService} from '../../service/careerHelper.service';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {
  heroImg = './assets/image/hero-img.svg';
  joinTeamImg = './assets/image/join-team-img.svg';
  profileImg = "./assets/image/job-profile.png";
  locationIcon = "./assets/image/location.png";
  linkdinIcon = './assets/image/linkdin.svg';
  twitterIcon = './assets/image/twitter.svg';
  searchIcon = './assets/image/search-icon.svg';

  filterDataForm: FormGroup;
  postiondata: any;
  departmentData: any;
  scopeData: any = [];
  resultsLength = 0;
  pageNumber = 1;
  public current_page = 0;
  public per_page = 10;
  public total = 0;
  public limit=10;
  public requestPara = {};
  ApplicationTypeArray: any = CareerHelperService.ApplicationTypeArray;
  imageBlob: Blob = null;
  mapImageURL: any;
  baseImageUrl: any;

  constructor(private apiService: CareerApiService,
              private sanitizer: DomSanitizer,
              private router: Router,
              public _formBuilder: FormBuilder,private helper: CareerHelperService) {
    this.filterDataForm = this._formBuilder.group({
      searchKey: null,
      department: null,
      applicationType: null,
      sortBy: null,
      scopeBy: null,
    });
    this.baseImageUrl = apiService.baseImageUrl;
  }

  ngOnInit(): void {
    this.positonListing({page: 1,limit:10});
    this.departmentListing();
  }

  // On Searching
  onSearch() {
    if (this.filterDataForm.valid) {
      this.apiService.searchPostionData(this.filterDataForm.value).subscribe((data: any) => {
        this.postiondata = data.data;
        let totalRecords = (data.totalCount) ? data.totalCount : 0;
        this.postiondata = data.data;
        this.total = totalRecords;
      })
    }
  }

  onResetForm(){
    this.positonListing({page: 1,limit:10});
    this.departmentListing();
  }

  sendYourCV() {
    this.router.navigate(['/login/']);
  }

  // Api calling for position listing
  positonListing(req: any) {
    this.apiService.listOfPostion(req).subscribe((data: any) => {

      this.helper.toggleSidebarVisibility(false);
      let totalRecords = (data.totalCount) ? data.totalCount : 0;
      this.postiondata = data.data;
      /*this.postiondata.forEach( async (b: any) => {
        if(b.jobImageId) {
          this.mapImageURL = await this.downloadImageMap(b.jobImageId);
          //console.log("$%$%$%$%$%$%$%$%$QQQQQQQQ", this.mapImageURL);
        }
      })*/


      this.total = totalRecords;
     }, err => {
      this.helper.toggleSidebarVisibility(false);
    })
  }

  async downloadImageMap(fileId) {
    let res = await this.apiService.getImageData(fileId).toPromise();
    this.imageBlob = new Blob([res]);
    return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.imageBlob));
  }

  /*async onDownloadMapClick() {
    if (this.imageBlob){
      let fileName = `Mappa Parcheggio ${this.currentResource.reservedParking.code} prenotato il ${this.commonService.formatYYYYMMDD(this.currentResource.reservationDate, '-')}.png`;
      saveAs(this.imageBlob, fileName);
    }
  }*/

  // Naviagte to Job-details page with id
  jobDetails(id: any): any {
    this.router.navigate(['/job-details/' + id]);
  }
 // Naviagte to job-application page with id
  jobApplyNow(id: any): any {
    this.router.navigate(['/job-application/' + id]);
  }
 // department listing
  departmentListing() {
    this.apiService.listOfDepartment().subscribe((data: any) => {
      this.departmentData = data.data;
    });

    this.apiService.listOfScope().subscribe((data: any) => {
      this.scopeData = data.reason;
    });
  }

  // application type
  applicationType: any = [
    {value: '', valueName: 'OTHERS.SelectPosition'},
    {value: '1', valueName: 'OTHERS.OpenPositions'},
    {value: '2', valueName: 'OTHERS.SpontaneousApplication'}
  ]
  // sort by value data
  sortBy: any = [
    {value: null, valueName: 'OTHERS.SelectSortType'},
    {value: 1, valueName: 'OTHERS.Newest'},
    {value: -1, valueName: 'OTHERS.Oldest'}
  ]


   /**
   * Pagination function for page change event
   * @param event
   */
    handlePage(event: any): void {
      this.current_page = event;
      this.requestPara = {
        page: this.current_page,
        limit:this.limit
      };
      this.positonListing(this.requestPara);
      window.scrollTo(0, 0);
    }

}
