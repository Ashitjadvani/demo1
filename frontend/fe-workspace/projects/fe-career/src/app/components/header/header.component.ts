import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CareerHelperService} from '../../service/careerHelper.service';
import {Router} from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import { MatSelectChange } from '@angular/material/select';
import { CareerApiService } from '../../service/careerApi.service';
import { data } from 'jquery';
import { DateAdapter } from '@angular/material/core'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

})
export class HeaderComponent implements OnInit , OnDestroy {
  logoImage = './assets/image/lagacy-logo.svg';
  englishFlag = './assets/image/english.png';
  italianFlag = './assets/image/italian.png';
  downArrow = './assets/image/down-arrow.svg';
  flagEng = './assets/image/flag-eng.png';
  loginUser: boolean = true;
  userLanguageSelect: string;
  lanuageData:any = null;
  lanuageName:any = null;
  userName :any[] = [];

  constructor(
    private helper: CareerHelperService,
    private apiService:CareerApiService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public translate: TranslateService,
    private settingManager: SettingsManagementService,
    private dateAdapter: DateAdapter<any>) {

  }

  ngOnInit(): void {
    document.body.classList.add('application-dropdown');
    this.userLanguageSelect = CareerHelperService.getLanguageName();
    if (!this.userLanguageSelect) {
      this.translate.use('it');
      this.settingManager.setSettingsValue('currentLanguage', 'it');
    }
    this.loginUser = (CareerHelperService.loginUserToken) ? false : true;
    this.helper.loginVisibilityChange.subscribe((value) => {
    });
    this.userLanguageSelect = this.settingManager.getSettingsValue('currentLanguage');
    
    if(this.loginUser !== true){
      this.apiService.getUserdetail().subscribe((data) =>{
        this.userName = data.user
      } , (err) =>{
        this.userName = []
      })
    }
    
  }

  ngOnDestroy() {
    document.body.classList.remove('application-dropdown');
  }


  redirectPage() {
    this.router.navigate(['/']);
    /*if (CareerHelperService.loginUserToken) {
      this.router.navigate(['/position']);
    } else {
      this.router.navigate(['/']);
    }*/
  }

  onLanguageChange(valueLanguage: any) {
    this.helper.languageTranslator(valueLanguage.value);
    this.translate.use(valueLanguage.value);
    this.settingManager.setSettingsValue('currentLanguage', valueLanguage.value);
  }

  itLocale(){
    this.dateAdapter.setLocale('it');
  }
  enLocale(){
    this.dateAdapter.setLocale('en');
  }

  logout() {
    CareerHelperService.onLogOut();
    this.router.navigate(['/login']);
  }


}
