import {Component, OnInit, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SettingsManagementService} from 'projects/fe-common/src/lib/services/settings-management.service';
import {HelperService} from '../../service/helper.service';
import {takeUntil} from "rxjs/operators";
import {ApiService} from "../../service/api.service";
import {Subject} from "rxjs";
import { CareerHelperService } from 'projects/fe-career/src/app/service/careerHelper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit , OnDestroy {
  englishFlag = './assets/images/english.png';
  italianFlag = './assets/images/italian.png';
  downArrow = './assets/images/down-arrow.svg';
  flagEng = './assets/images/flag-eng.png';
  loginUser: boolean = true;
  userLanguageSelect: string;
  lanuageData:any = null;
  lanuageName:any = null;
  private destroy$ = new Subject();
  getSupplierAgreement: any = {};
 
  constructor(
    private helper: HelperService,
    public translate: TranslateService,
    private settingManager: SettingsManagementService,
    private Api: ApiService,
    private router: Router

  ) {  }

  ngOnInit(): void {
    document.body.classList.add('application-dropdown')
    this.userLanguageSelect = HelperService.getLanguageName();
    if (!this.userLanguageSelect) {
      this.translate.use('it');
      this.settingManager.setSettingsValue('currentLanguage', 'it');
    } else {
      this.translate.use(this.userLanguageSelect);
      this.settingManager.setSettingsValue('currentLanguage', this.userLanguageSelect);
    }
    this.loginUser = (HelperService.loginUserToken) ? false : true;
    this.helper.loaderVisibilityChange.subscribe((value) => {
    });
    this.userLanguageSelect = this.settingManager.getSettingsValue('currentLanguage');

    this.Api.getEditProfile().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.getSupplierAgreement = data.data;
    });
  }

  openMenuBox(){
    document.body.classList.add('openMenuBox')
  }
  closeMenuBox(){
    document.body.classList.remove('openMenuBox')
  }
  onLanguageChange(valueLanguage: any) {
    this.helper.languageTranslator(valueLanguage.value);
    this.translate.use(valueLanguage.value);
    this.settingManager.setSettingsValue('currentLanguage', valueLanguage.value);
  }

  redirectPage(){}

  logout(): void {
    document.body.classList.remove('openMenuBox')
    CareerHelperService.onLogOut();
    this.router.navigate(['']);
  }

  ngOnDestroy(){
    document.body.classList.remove('application-dropdown')
  }

}
