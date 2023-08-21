import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../service/api.service';
import {HelperService} from '../../service/helper.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  public privacyData: string;
  public privacyDataObj: any = {};
  constructor(
    private helper: HelperService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const typeName = 'procurement_privacy_policy';
    const language = HelperService.getLanguageName();
    this.apiService.getCMSDetails({type : typeName}).subscribe((data: any) => {
      this.privacyDataObj = data.data;
      this.privacyData = (language === 'it') ? this.privacyDataObj.descriptionIT : this.privacyDataObj.descriptionEN;
    });
    this.helper.languageTranslatorChange.subscribe((value) => {
      this.privacyData = value === 'it' ? this.privacyDataObj.descriptionIT : this.privacyDataObj.descriptionEN;
    });
  }
}
