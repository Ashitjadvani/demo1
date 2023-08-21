import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CareerHelperService } from '../../../service/careerHelper.service';
import {CareerApiService} from "../../../service/careerApi.service";
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-download-document',
  templateUrl: './download-document.component.html',
  styleUrls: ['./download-document.component.scss']
})
export class DownloadDocumentComponent implements OnInit {
  userDetails:any;
  id : any;
  user: any
  videoUrl : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  baseImageUrl: any;
  momentTimestamp: any = new Date().getTime();

  constructor(
    private router: Router,
    private helper: CareerHelperService,
    private apiService : CareerApiService,
    private fileSaverService: FileSaverService
  ) {
    this.baseImageUrl = apiService.baseImageUrl;
  }

  ngOnInit() {

    this.apiService.getUserdetail().subscribe((data: any) => {
      this.user = data.user;
      this.userDetails = data.user.type;
    });
  }

  downloadCV(){
    this.helper.toggleSidebarVisibility(true);
    this.apiService.getImageData(this.user.resumeId).subscribe((data: any) => {
      this.helper.toggleSidebarVisibility(false);
      this.apiService.saveActivityLog({description: "download_cv"}).subscribe();
      var mediaType = 'application/pdf';
      var file = new Blob([data], {type: mediaType});
      var filename = this.user.nome + '-cv-' + this.momentTimestamp;
      saveAs(file, filename);
    });
  }

  downloadVideo(){
    this.helper.toggleSidebarVisibility(true);
    this.apiService.getUploadedfileDetails({id: this.user.videoId}).subscribe( (videoDetails: any) =>{
      if (videoDetails) {
        this.apiService.getImageData(this.user.videoId).subscribe((data: any) => {
          this.helper.toggleSidebarVisibility(false);
          this.apiService.saveActivityLog({description: "download_video"}).subscribe();
          var mediaType = videoDetails.data.contentType;
          var file = new Blob([data], {type: mediaType});
          var filename = this.user.nome + '-video-' + this.momentTimestamp;
          saveAs(file, filename);
        });
      } else {
        this.helper.toggleSidebarVisibility(false);
      }
    });
  }

  downloadCSVFile() {
    this.apiService.saveActivityLog({description: "download_user_csv_file"}).subscribe();
    let data = [this.user];
    const replacer = (key, value) => value === null ? '-' : value; // specify how you want to handle null values here
    const headerText = [
      'nome',
      'cognome',
      'email',
      'telefono',
      'data_nascita',
      'azienda',
      "azienda",
      "titolo",
      'sesso',
      "indirizzo",
      "livello_studi",
      "lastLoggedIn",
      "nationality",
      "cityName",
      "stateName",
      "countryName",
      "degreeYear",
      "scoreAverage",
      "materDescription",
      "doctorateDescription",
      "degreeMark",
      "degreeLoadName",
    ];
    const header = headerText;
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, this.user.nome + '-personal-detail-' + this.momentTimestamp + '.csv');
  }

  logout() {
    CareerHelperService.onLogOut();
    this.router.navigate(['/login']);
  }
}
