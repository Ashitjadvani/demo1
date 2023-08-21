import { Component, OnInit } from '@angular/core';
import { CareerApiService } from '../../service/careerApi.service';
import { CareerHelperService } from '../../service/careerHelper.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  public privacyData : string;
  public privacyDataObj: any = {};
  constructor(
    private helper: CareerHelperService,
    private apiService: CareerApiService,
  ) { }

  ngOnInit(): void {

    let typeName = 'terms_conditions';
    let language = CareerHelperService.getLanguageName();
    this.apiService.getCMSDetails({type : typeName}).subscribe((data:any)=>{
      this.privacyDataObj = data.data;
      this.privacyData = (language === 'it') ? this.privacyDataObj.descriptionIT : this.privacyDataObj.descriptionEN;
    });
    this.helper.languageTranslatorChange.subscribe((value) => {
      this.privacyData = value === 'it' ? this.privacyDataObj.descriptionIT : this.privacyDataObj.descriptionEN;
    });
  }
 
}
