import { User } from './admin/user';
import { UserRequestBook } from './user-request-book';
import { Site } from './admin/site';
import { UserDailyActivity } from './admin/user-daily-activity';
import { SiteCapacity } from './admin/site-capacity';
import { SitePresenceStat } from './site-presence-stat';
import { SiteDailyStatus } from './site-daily-status';
import { USER_ACTIVITY_TYPE } from '../services/user-action.service';
import { UserCalendarData } from './user-calendar-data';
import { CalendarDay, CalendarEventDate } from './calendar';
import { Person } from './person';

export class MainTileStatus {
    mainTileBackground: string;
    mainTileTextColor: string;
    mainTileTextActionColor: string;
    mainTileTextSite: string;
    mainTileIcon: string;
}

export class MainTileAction {
    mainTileIconAction: string;
    mainTileIcon: string;
    mainTileTextAction: string;
    mainTileTextSiteInfo: string;
    mainTileTextDesk: string;
    mainTileAction: USER_ACTIVITY_TYPE;
    mainTileLastAction: string;
}

export class MainTile {
    status: MainTileStatus;
    action: MainTileAction;
}

export class HomeData {
    user: Person;
    userCalendar: CalendarDay;
    calendarEventDate: CalendarEventDate;
    userActivity: UserDailyActivity;
    site: Site;
    siteDailyStatus: SiteDailyStatus;
    siteCapacity: SiteCapacity;
    siteStats: SitePresenceStat;
    mainTile: MainTile;
    showLunchQuestion: boolean;
    currentUserCalendarEvent: CalendarEventDate;

    static getUserDailyPlan(homeData: HomeData) {
        return homeData.calendarEventDate ? homeData.calendarEventDate.eventData.plan.activityType : null;
    }
}