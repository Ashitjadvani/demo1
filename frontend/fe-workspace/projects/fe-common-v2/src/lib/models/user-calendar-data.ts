import { User } from './admin/user';
import { Site, SiteDailyStatus } from './admin/site';
import { UserRequestBook } from './user-request-book';
import { SiteCapacity } from './admin/site-capacity';
import { UserDailyAccess } from './admin/user-daily-access';
import { SiteDailyCalendarStatistics } from './site-daily-calendar-statistic';

export class UserCalendarData {
    user: User;
    site: Site;
    userMonthPlan: UserRequestBook[];
    userDailyAccess: UserDailyAccess[];
    siteMonthStatus: SiteDailyStatus[];
    siteCapacity: SiteCapacity;
    siteDailyStats: SiteDailyCalendarStatistics[];
}