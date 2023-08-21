import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {Dashboard} from 'projects/fe-common/src/lib/models/recruiting/models';
import {RecruitingManagementService} from 'projects/fe-common/src/lib/services/recruiting-management.service';
import {RecruitingApplicationManagementService} from 'projects/fe-common/src/lib/services/recruiting-application-management.service';
import {UserCapabilityService} from "../../services/user-capability.service";

class OverviewCard {
  id: number;
  image: string;
  title: string;
  data: string;
  mainColor: string;
  footerColor: string;
  footerText: string;
  totalCount: string;
  count: boolean;
  budgeCountKey: string;

  constructor(id: number,
              image: string,
              title: string,
              data: string,
              mainColor: string,
              footerColor: string,
              footerText: string,
              totalCount: string,
              count: boolean,
              budgeCountKey: string,
  ) {
    this.id = id;
    this.image = image;
    this.title = title;
    this.data = data;
    this.mainColor = mainColor;
    this.footerColor = footerColor;
    this.footerText = footerText;
    this.totalCount = totalCount;
    this.count = count;
    this.budgeCountKey = budgeCountKey;
  }
}

enum CardType {
  Openings,
  Candidates,
  JobApplication,
}

@Component({
  selector: 'app-recruiting-dashboard',
  templateUrl: './recruiting-dashboard-page.component.html',
  styleUrls: ['./recruiting-dashboard-page.component.scss']
})
export class RecruitingDashboardPageComponent implements OnInit {
  dashboardTableData: any = null;
  totalCandidatesFilter: any = null;
  public dashboard$: Observable<Dashboard>;
  dashboardResult: Dashboard;
  applicationBudgeCount = 0;

  overviewDataCards: any = [
    new OverviewCard(CardType.Openings, 'tile-survey', this.translate.instant('RECRUITING.JOB_OPENINGS'), '', '#F8EBCB', '#E7DABA', this.translate.instant('GENERAL.View'), 'totalJobOpening', true, 'totalUnreadApplication'),
    new OverviewCard(CardType.Candidates, 'tile-employee', this.translate.instant('RECRUITING.CANDIDATES'), '', '#FFE5DC', '#EED4CB', this.translate.instant('GENERAL.View'), 'totalCandidates', true, 'candidateBadge'),
    new OverviewCard(CardType.JobApplication, 'account-circle', this.translate.instant('RECRUITING.JOB_APPLICATIONS'), '', '#DDFFF5', '#CCEEE4', this.translate.instant('GENERAL.View'), 'totalJobApplications', true, 'applicationBadge')
  ];

  candidateDataFilter: any = [
    {
      title: this.translate.instant('RECRUITING.JobApplicationsFromMale'),
      count: 'maleCount',
      width: '',
      color: '#C5E1F9',
      background: '#A7CFF2',
      filter: {'person.sesso': 'Male'}
    },
    {
      title: this.translate.instant('RECRUITING.JobApplicationFromFemale'),
      count: 'femaleCount',
      width: '',
      color: '#FDBABA',
      background: '#F6ABAB',
      filter: {'person.sesso': 'Female'}
    },
    {
      title: this.translate.instant('RECRUITING.AgeAbove35'),
      count: 'aboveAge',
      width: '',
      color: '#FFE4A7',
      background: '#F5D488',
      filter: {'person.min_age': '35'}
    },
    {
      title: this.translate.instant('RECRUITING.AgeBelow35'),
      count: 'belowAge',
      width: '33.33%',
      color: '#A8F396',
      background: '#92E57F',
      filter: {'person.max_age': '35'}
    },
  ];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private recruitingManagementService: RecruitingManagementService,
    private recruitingManagementApplicationService: RecruitingApplicationManagementService,
    private userCapabilityService: UserCapabilityService,
  ) {
    //  this.loadRecruitingApplication();
  }

  /*async loadRecruitingApplication() {
      let jobsTableData: any = await this.recruitingManagementApplicationService.getApplicationBudgeCount();
      this.applicationBudgeCount = jobsTableData.reason;
  }*/

  async ngOnInit() {
    await this.loadDashbord();
  }

  async loadDashbord() {
    const getDataObject: any = await this.recruitingManagementService.getRecruitingDashBoard();
    this.dashboardTableData = (getDataObject && getDataObject.data.length > 0) ? getDataObject.data[0] : {};
    this.totalCandidatesFilter = (getDataObject && getDataObject.data.length > 0) ? getDataObject.data[0].totalCandidatesFilter : {};
    this.userCapabilityService.dashboardRecruitingCount(this.dashboardTableData.applicationBadge);
  }

  navigateTo(path: string[]): void {
    this.router.navigate(path);
  }

  onViewAll(id: CardType): void {
    if (id == CardType.Openings) {
      this.navigateTo(['insights', 'main', 'recruiting-mqs', 'openings']);
    } else if (id == CardType.Candidates) {
      this.navigateTo(['insights', 'main', 'recruiting-mqs', 'candidates']);
    } else if (id == CardType.JobApplication) {
      this.navigateTo(['insights', 'main', 'recruiting-mqs', 'applications']);
    }
  }

  onViewApplication(filter): void {
    localStorage.setItem('filterApplication', JSON.stringify(filter));
    this.navigateTo(['insights', 'main', 'recruiting-mqs', 'applications']);
  }

  getData(id: CardType) {
    if (id == CardType.Openings) {
      return this.dashboardResult ? this.dashboardResult.JobOpening : 0;
    } else if (id == CardType.Candidates) {
      return this.dashboardResult ? this.dashboardResult.Candidates.total : 0;
    } else if (id == CardType.JobApplication) {
      return this.dashboardResult ? this.dashboardResult.JobApplications.total : 0;
    }

    return 0;
  }

}
