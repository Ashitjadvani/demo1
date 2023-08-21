import { Site } from './admin/site';
import { SiteCapacity } from './admin/site-capacity';
import { User } from './admin/user';
import { UserDailyActivity } from './admin/user-daily-activity';
import { USER_BOOK_TYPE } from './user-request-book';

export enum STATISTICS_PERIOD {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year'
}

export class UserPlanDay {
    date: string; // date in YYYYMMDD
    bookType: USER_BOOK_TYPE;
}

export class UserCommittedDay {
    deskCheckInAt: Date;
    deskCheckOutAt: Date;
    officeInAt: Date;
    officeOutAt: Date;
    smartWorkingInAt: Date;
    smartWorkingOutAt: Date;
    site: string;
}

export class UserPlan {
    planCounters: number[];
    planDetailsByDay: UserPlanDay[];
}

export class UserPlanCommitted {
    activityCounters: number[];
    activityDetailsByDay: UserCommittedDay[];
}

export class UserWorkflowStat {
    date: string; // date in YYYYMMDD
    unplanned: number;
    errors: number;
}

export class UserStatistics {
    user: User;
    dateOffsetStartPeriod: Date;
    dateOffsetFirstPeriod: Date;
    dateOffsetSecondPeriod: Date;
    dateOffsetEndPeriod: Date;
    smartWorkingPlanned: UserPlan;
    officeWorkingPlanned: UserPlan;
    smartWorkingCommited: UserPlanCommitted;
    officeWorkingCommited: UserPlanCommitted;
    workflowStats: Array<Array<UserWorkflowStat>>;
}

export class DateRangeStatistics {
    dateOffsetStartPeriod: Date;
    dateOffsetFirstPeriod: Date;
    dateOffsetSecondPeriod: Date;
    dateOffsetEndPeriod: Date;
}

export class AggregateUserStatistics {
    date: string;
    smartWorkingPlanned: number;
    smartWorkingCommited: number;
    officeWorkingPlanned: number;
    officeWorkingCommited: number;
    notWorkingCount: number;
    businessTripCount: number;
    unplanned: number;
    error: number;
}

export class UserDailyStatistics {
    id: string;
    date: string;
    siteKey: string;
    bookType: USER_BOOK_TYPE;
    deleted: boolean;
    userInfo: User[];
    userActivity: UserDailyActivity[];
    siteInfo: Site[];
    siteCapacities: SiteCapacity[];
}
