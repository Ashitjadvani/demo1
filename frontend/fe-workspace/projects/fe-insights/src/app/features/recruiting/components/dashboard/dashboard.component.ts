import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadDashboard } from '../../store/actions';
import { selectDashboard } from '../../store/selectors';
import { Observable } from 'rxjs';
import { Dashboard } from '../../../../../../../fe-common/src/lib/models/recruiting/models';
import { TranslateService } from '@ngx-translate/core';

class OverviewCard {
    id: number;
    image: string;
    title: string;
    data: string;
    mainColor: string;
    footerColor: string;
    footerText: string;

    constructor(id: number,
        image: string,
        title: string,
        data: string,
        mainColor: string,
        footerColor: string,
        footerText: string) {
        this.id = id;
        this.image = image;
        this.title = title;
        this.data = data;
        this.mainColor = mainColor;
        this.footerColor = footerColor;
        this.footerText = footerText;
    }
}

enum CardType {
    Openings,
    Candidates,
    JobApplication
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    public dashboard$: Observable<Dashboard>;
    dashboardResult: Dashboard;

    overviewDataCards: OverviewCard[] = [
        new OverviewCard(CardType.Openings, 'tile-survey', this.translate.instant('RECRUITING.JOB_OPENINGS'), '', '#F8EBCB', '#E7DABA', this.translate.instant('GENERAL.View')),
        new OverviewCard(CardType.Candidates, 'tile-employee', this.translate.instant('RECRUITING.CANDIDATES'), '', '#FFE5DC', '#EED4CB', this.translate.instant('GENERAL.View')),
        new OverviewCard(CardType.JobApplication, 'account-circle', this.translate.instant('RECRUITING.JOB_APPLICATIONS'), '', '#DDFFF5', '#CCEEE4', this.translate.instant('GENERAL.View'))
    ]

    constructor(private translate: TranslateService,
        private router: Router,
        private store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(loadDashboard());
        this.dashboard$ = this.store.select(selectDashboard());
        this.dashboard$.subscribe(dashboard => this.dashboardResult = dashboard);
    }

    navigateTo(path: string[]): void {
        this.router.navigate(path);
    }

    onViewAll(id: CardType) {
        if (id == CardType.Openings)
            this.navigateTo(['insights', 'main', 'recruiting', 'openings'])
        else if (id == CardType.Candidates)
            this.navigateTo(['insights', 'main', 'recruiting', 'candidates']);
        else if (id == CardType.JobApplication)
            this.navigateTo(['insights', 'main', 'recruiting', 'applications']);
    }

    getData(id: CardType) {
        if (id == CardType.Openings)
            return this.dashboardResult ? this.dashboardResult.JobOpening : 0;
        else if (id == CardType.Candidates)
            return this.dashboardResult ? this.dashboardResult.Candidates.total : 0;
        else if (id == CardType.JobApplication)
            return this.dashboardResult ? this.dashboardResult.JobApplications.total : 0;

        return 0;
    }
}
