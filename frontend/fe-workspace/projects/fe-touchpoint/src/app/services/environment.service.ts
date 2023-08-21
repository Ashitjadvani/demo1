import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { VERSION } from '../../environments/version';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {

    constructor() { }

    getTimeZoneInfoId() {
        return environment.zone.time_zone_info_id;
    }

    getLocale() {
        return environment.zone.locale;
    }

    getUITypeId() {
        return environment.api.ui_type_id;
    }

    debugEnabled() {
        return environment.debug;
    }

    getHttpRetryCount() {
        return environment.connection.retry_count;
    }

    getQrInstantBookHoursOffset() {
        return environment.api.qr_instantbook_hours_offset;
    }

    getQrExtendsbookMinutesOffset() {
        return environment.api.qr_extendsbook_minutes_offset;
    }

    getBookingsByResourceHoursDuration() {
        return environment.api.bookings_by_resource_hours_duration;
    }

    getVersion() {
        return environment.production ? 'v' + VERSION : 'v' + VERSION + '(TEST)';
    }
}
