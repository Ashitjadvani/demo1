import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { data } from 'jquery';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import {SettingsManagementService} from "../../../fe-common-v2/src/lib/services/settings-management.service";
import {MCPHelperService} from "./service/MCPHelper.service";
import {SessionManagementService} from "../../../fe-common-v2/src/lib/services/session-management.service";
import {UserManagementService} from "../../../fe-common-v2/src/lib/services/user-management.service";
import {NotifyManagementService} from "../../../fe-common-v2/src/lib/services/notify-management.service";
import {Router, RoutesRecognized} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'fe-insights-v2';
  loaderVisible: boolean;

  constructor(
    public translate: TranslateService,
    public helper: MCPHelperService,
    private settingManager: SettingsManagementService,
    private sessionManagementService: SessionManagementService,
    private adminUserManagementService: AdminUserManagementService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private userManagementService: UserManagementService,
    private notifyManagementService: NotifyManagementService,

  ) {
      // @ts-ignore
      router.events.subscribe((event: Event) => {
          if (event instanceof RoutesRecognized) {
              // * RoutesRecognized: When the router parses the URL and the routes are recognized.
              // console.log('RoutesRecognized --- ', event.url);
              const check = event.url.includes('/event/event-checkin/');
              if (check) {
                  translate.setDefaultLang('it');
                  const browserLang = translate.getBrowserLang();
                  translate.use('it');
              } else {
                  MCPHelperService.getLocalStorage();
                  translate.addLangs(['en', 'es', 'it', 'fr']);
                  translate.setDefaultLang('it');
                  let userLanguage: string;
                  userLanguage = this.settingManager.getSettingsValue('currentLanguage');
                  if (userLanguage != null) {
                      translate.use(userLanguage);
                  } else {
                      const browserLang = translate.getBrowserLang();
                      translate.use(browserLang.match(/en|es|it|fr/) ? browserLang : 'en');
                  }
              }
          }
      });

    this.helper.loaderVisibilityChange.subscribe((value) => {
      this.loaderVisible = value;
      this.cdRef.detectChanges();
    });
    sessionManagementService.onSessionExpired.subscribe(async () => {
      this.userManagementService.invalidateToken();
      this.helper.toggleLoaderVisibility(false);
      //await this.notifyManagementService.openMessageDialog(this.translate.instant('GENERAL.PAY ATTENTION'), this.translate.instant('LOGIN PAGE.USER SESSION EXPIRED'));
      Swal.fire(
        this.translate.instant('GENERAL.PAY ATTENTION'),
        this.translate.instant('LOGIN PAGE.USER SESSION EXPIRED'),
        'info'
      );
      this.router.navigate(['']);
    });
  }
  ngOnInit(data): void {
    // this.helper.getColorCode(data)
    //document.documentElement.style.setProperty("--primary-color",data.brandColor)
  }
  ngAfterViewInit() {
      this.helper.toggleLoaderVisibility(true);
      this.helper.httpProgress().subscribe((status: boolean) => {
          if (status) {
              this.helper.toggleLoaderVisibility(true);
          } else {
              this.helper.toggleLoaderVisibility(false);
          }
      });
  }
}
