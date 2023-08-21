import { Component, OnInit } from '@angular/core';
import { CareerApiService } from '../../service/careerApi.service';
import { CareerHelperService } from '../../service/careerHelper.service';

@Component({
  selector: 'app-private-policy',
  templateUrl: './private-policy.component.html',
  styleUrls: ['./private-policy.component.scss']
})
export class PrivatePolicyComponent implements OnInit {
  public privacyData: string;
  public privacyDataObj: any = {};
  constructor(
    private helper: CareerHelperService,
    private apiService: CareerApiService
  ) { }

  

  ngOnInit(): void {
    let typeName = 'privacy_policy';
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
