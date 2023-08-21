import {ChangeDetectorRef, Component} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, Scroll} from '@angular/router';
import {Location, PopStateEvent, ViewportScroller} from "@angular/common";
import {CareerHelperService} from './service/careerHelper.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsManagementService } from 'projects/fe-common/src/lib/services/settings-management.service';
import {delay, filter} from "rxjs/operators";
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fe-career';

  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  asideVisible: boolean;

  constructor(
    private router: Router,
    private location: Location,
    private helper: CareerHelperService,
    private cdRef: ChangeDetectorRef,
    public translate: TranslateService,
    public viewportScroller: ViewportScroller,
    private settingManager: SettingsManagementService,
    private dateAdapter: DateAdapter<any>) {
    router.events
      .pipe(filter((e): e is Scroll => e instanceof Scroll))
      .pipe(delay(1))   // <--------------------------- This line
      .subscribe((e) => {
        if (e.position) {
          // backward navigation
          setTimeout(() => {
            viewportScroller.scrollToPosition(e.position);
          }, 500);
        } else if (e.anchor) {
          // anchor navigation
          setTimeout(() => {
            viewportScroller.scrollToAnchor(e.anchor);
          }, 500);
        } else {
          // forward navigation
          setTimeout(() => {
            viewportScroller.scrollToPosition([0, 0]);
          });
        }
      });
    this.asideVisible = helper.isSidebarVisible;
    translate.addLangs(['en', 'it']);
    translate.setDefaultLang('en');
    let userLanguage: string;
    userLanguage = this.settingManager.getSettingsValue('currentLanguage');
    if (userLanguage != null) {
        translate.use(userLanguage);
    } else {
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|it/) ? browserLang : 'en');
    }
  }

  switchLanguage(lang : string){
    this.translate.use(lang);
  }

  ngOnInit() {
    this.helper.setLocalStorage();
    /* scrolled to top start */
    /*this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationStart) {
        if (ev.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (ev instanceof NavigationEnd) {
        if (ev.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else
          window.scrollTo(0, 0);
      }
    });*/
    /* scrolled to top End */
    this.helper.sidebarVisibilityChange.subscribe((value) => {
      this.asideVisible = value;
      this.cdRef.detectChanges();
    });
  }
}

