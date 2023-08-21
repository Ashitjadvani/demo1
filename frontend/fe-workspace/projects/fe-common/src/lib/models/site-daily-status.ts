import { SITE_STATE } from './admin/site';

export class SiteDailyStatus {
    siteKey: string;
    date: string;
    maxCapacity: number;
    currentCapacity: number;
    status: SITE_STATE;
}