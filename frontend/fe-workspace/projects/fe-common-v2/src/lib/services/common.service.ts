import { Inject, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Bookings } from '../models/api/booking';
import { ResourceTypeNames } from '../models/api/resource';
import { SITE_STATE } from '../models/admin/site';
import { User } from '../models/admin/user';
import { BaseResponse } from './base-response';
import { Configurations } from '../configurations';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    private datePipe: DatePipe;
    private environment: any;

    constructor(@Inject(Configurations) config: Configurations,
    private translate: TranslateService) {
        this.environment = config.env;
        this.datePipe = new DatePipe(this.environment.zone.locale);
    }

    public convertBase64ToBlob(Base64Image: any) {
        const parts = Base64Image.split(';base64,');
        const imageType = parts[0].split(':')[1];
        const decodedData = window.atob(parts[1]);
        const uInt8Array = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; ++i) {
            uInt8Array[i] = decodedData.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: imageType });
    }

    toUtcDate(date: Date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }

    timeFormat(date: Date) {
        return this.datePipe.transform(date, this.environment.format.time_display, this.environment.zone.time_zone_info_id);
    }

    dateFormat(date: Date) {
        return this.datePipe.transform(date, this.environment.format.date, this.environment.zone.time_zone_info_id);
    }

    dateExclusiveFormat(date: Date) {
        return this.datePipe.transform(date, this.environment.format.date_exclusive, this.environment.zone.time_zone_info_id);
    }

    dateDisplayFormat(date: Date | string) {
        return this.datePipe.transform(date, this.environment.format.date_display, this.environment.zone.time_zone_info_id);
    }

    dateTimeFormat(date: Date, time: string) {
        return this.dateExclusiveFormat(date) + "T" + time;
    }

    getDisplayFormatTimeFromDate(date: Date) {
        return this.datePipe.transform(date, this.environment.format.time_display, this.environment.zone.time_zone_info_id);
    }

    dateMinutesOffset(date: Date, offset: number) {
        return new Date(date.getTime() + (offset * 60000));
    }

    dateHoursOffset(date: Date, offset: number) {
        return new Date(date.getTime() + (offset * 3600000));
    }

    dateYearOffset(date: Date, offset: number) {
        return new Date(date.getTime() + (offset * 31556952000))
    }

    dateFromString(date: string) {
        return new Date(date);
    }

    dateIsInRange(dateIn: Date, dateRef: Date, minGap: number, maxGap: number) {
        let minDate: Date = this.dateMinutesOffset(dateRef, -minGap);
        let maxDate: Date = this.dateMinutesOffset(dateRef, maxGap);

        return (dateIn.getTime() - minDate.getTime() >= 0) && (dateIn.getTime() - maxDate.getTime() <= 0);
    }

    dateIsInTimeFrame(dateIn: Date, dateStart: Date, dateEnd: Date) {
        if (!(dateIn instanceof Date))
            dateIn = new Date(dateIn);

        return (dateIn.getTime() - dateStart.getTime() >= 0) && (dateIn.getTime() - dateEnd.getTime() <= 0);
    }

    dateIsInTimeFrameOnlyData(dateIn: Date, dateStart: Date, dateEnd: Date) {
        let dateInYYYYMMDD = this.toYYYYMMDD(dateIn);
        let dateStartYYYYMMDD = this.toYYYYMMDD(dateStart);
        let dateEndYYYYMMDD = this.toYYYYMMDD(dateEnd);
        return (dateInYYYYMMDD >= dateStartYYYYMMDD) && (dateInYYYYMMDD <= dateEndYYYYMMDD);
    }

    dateRagesOverlap(startR1: Date, endR1: Date, startR2: Date, endR2: Date) {
        return ((startR1.getTime() > startR2.getTime()) && (startR1.getTime() < endR2.getTime())) ||
            ((endR1.getTime() > startR2.getTime()) && (endR1.getTime() < endR2.getTime())) ||
            ((startR2.getTime() > startR1.getTime()) && (startR2.getTime() < endR1.getTime())) ||
            ((endR2.getTime() > startR1.getTime()) && (endR2.getTime() < endR1.getTime()));
    }

    timeRagesOverlap(startR1: Date, endR1: Date, startR2: Date, endR2: Date) {
        return ((this.compareOnlyTime(startR1, startR2) > 0) && (this.compareOnlyTime(startR1, endR2) < 0)) || // overlap
            ((this.compareOnlyTime(endR1, startR2) > 0) && (this.compareOnlyTime(endR1, endR2) < 0)) ||     //overlap
            ((this.compareOnlyTime(startR1, startR2) > 0) && (this.compareOnlyTime(endR1, endR2) < 0)) ||   // R1 included in R2
            ((this.compareOnlyTime(startR1, startR2) < 0) && (this.compareOnlyTime(endR1, endR2) > 0));     // R1 contains R2
    }

    normalizeDate(dateIn: string) {
        return dateIn.replace(/-/g, "/").replace(/T/g, " ");
    }

    toYYYYMMDD(dateIn: string | Date) {
        return this.datePipe.transform(dateIn, 'yyyyMMdd');
    }

    toYYYYMMDDv2(dateIn: string | Date) {
        return this.datePipe.transform(dateIn, 'yyyy-MM-dd');
    }

    toDDMMYYYY(dateIn: string | Date) {
        return this.datePipe.transform(dateIn, 'dd/MM/yyyy');
    }

    toDDMMYYYYv2(dateIn: string | Date) {
        return this.datePipe.transform(dateIn, 'dd-MM-yyyy');
    }

    toHHMM(dateIn: string | Date) {
        if (!(dateIn instanceof Date))
            dateIn = new Date(dateIn);

        return this.datePipe.transform(dateIn, 'HH:mm');
    }

    dateFromHHMM(time, sep = ':') {
        let split = time.split(sep);
        let dd = new Date();
        dd.setHours(split[0]);
        dd.setMinutes(split[1]);

        return dd;
    }

    fromYYYYMMDD(yyyymmdd: string): Date {
        let year = yyyymmdd.substring(0, 4);
        let month = yyyymmdd.substring(4, 6);
        let day = yyyymmdd.substring(6, 8);
        return new Date(+year, (+month - 1), +day);
    }

    formatYYYYMMDD(yyyymmdd: string, sep: string = '/') {
        let year = yyyymmdd.substring(0, 4);
        let month = yyyymmdd.substring(4, 6);
        let day = yyyymmdd.substring(6, 8);

        return day + sep + month + sep + year;
    }

    formatDateTime(dateIn: Date, format: string) {
        return this.datePipe.transform(dateIn, format);
    }

    isCalendarValidDate(date: Date, enableToday: boolean = true): boolean {
        let today = new Date();
        let day = date.getDay();
        let isWE = (day == 0) || (day == 6);
        let dateDiff = (date.getTime() - today.getTime());

        let isToday = enableToday && (date.getDate() == today.getDate());

        return !isWE; // && (dateDiff >= 0) || (isToday && !isWE);
    }

    scanBookingForResourceType(userBookings: Bookings, resourceTypeName: ResourceTypeNames) {
        if (userBookings.Bookings.length != 0) {
            let resBooked = userBookings.Bookings.map(book => {
                let hasDesk = book.Resources.ResourceItems.find(res => res.ResourceTypeName == resourceTypeName);
                return hasDesk;
            });

            console.log('Booked Desk: ', resBooked);
            return resBooked;
        }

        return null;
    }

    getUserQrString(userName: string) {
        return 'irina-user/' + userName;
    }

    downloadImageBase64(imgSource, name) {
        let blobData = this.convertBase64ToBlob(imgSource);
        /*if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blobData, name);
        } else {*/
        const blob = new Blob([blobData], { type: "image/png" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.click();
        //}
    }

    getSiteDailyMaxCapacity(siteDaily: any) {
        return (siteDaily.siteDailyStatus && (siteDaily.siteDailyStatus.length > 0)) ?
            siteDaily.siteDailyStatus[0].maxCapacity :
            siteDaily.maxCapacity;
    }

    getSiteDailyCurrentPresence(siteDaily: any) {
        return (siteDaily.siteDailyActivities && (siteDaily.siteDailyActivities.length > 0)) ?
            siteDaily.siteDailyActivities[0].presenceCount :
            0;
    }

    mapSiteStatusString(todaySiteStatus: SITE_STATE) {
        switch (todaySiteStatus) {
            case SITE_STATE.FREE:
                return "OPEN";
            case SITE_STATE.CLOSED:
                return "CLOSED";
            case SITE_STATE.MAINTENANCE:
                return "MAINTENANCE";
            case SITE_STATE.RESTRICTED_MODE:
                return "RESTRICTED";
        }
    }

    dateDiffInHours(date1, date2) {
        let diff = date1.getTime() - date2.getTime();
        return Math.floor(diff / 36e5);
    }

    dateDiffInMinutes(date1, date2) {
        if (!(date1 instanceof Date))
            date1 = new Date(date1);
        if (!(date2 instanceof Date))
            date2 = new Date(date2);

        let diff = date1.getTime() - date2.getTime();
        return Math.floor(diff / (60 * 1000));
    }

    dateDiffInDays(date1, date2) {
        let diff = date1.getTime() - date2.getTime();
        return Math.round(diff / (1000 * 60 * 60 * 24));
    }

    isWorkingTime() {
        let today = new Date();
        let day = today.getDay();
        let isWE = (day == 0) || (day == 6);
        let dayHour = today.getHours();
        let isWorkingTime = (dayHour >= 7) && (dayHour <= 22);

        console.log('isWorkingTime: ', isWE, day, dayHour);

        return !isWE && isWorkingTime;
    }

    calcPercent(value: number, percentage: number) {
        return Math.floor((value * percentage) / 100);
    }

    calcPercentFromTotal(total: number, value: number) {
        return Math.round((value / total) * 100);
    }

    isMobileDevice() {
        let check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
        return check;
    };

    getValueOrEmpty(value) {
        return (value != null) && (value != undefined) ? value : '';
    }

    isUserSafety(user: User, safety: string) {
        if (user.safetyGroups && (user.safetyGroups.length > 0))
            return user.safetyGroups.find(s => s == safety) != null;
        else
            return false;
    }

    buildDateTimeFromHHMM(itemDate: Date, time: string) {
        let timeSplit = time.split(':');
        return new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate(), +timeSplit[0], +timeSplit[1]);
    }

    compareOnlyDate(date1: Date, date2: Date) {
        if (!(date1 instanceof Date))
            date1 = new Date(date1);
        if (!(date2 instanceof Date))
            date2 = new Date(date2);

        return (date1.getFullYear() == date2.getFullYear()) && (date1.getMonth() == date2.getMonth()) && (date1.getDate() == date2.getDate());
    }

    compareOnlyDateGreater(date1: Date, date2: Date) {
        if (!(date1 instanceof Date))
            date1 = new Date(date1);
        if (!(date2 instanceof Date))
            date2 = new Date(date2);

        if (date1.getFullYear() > date2.getFullYear()) {
            return true;
        }
        else if (date1.getFullYear() == date2.getFullYear()) {
            if (date1.getMonth() > date2.getMonth()) {
                return true;
            }
            else if (date1.getMonth() == date2.getMonth()) {
                if (date1.getDate() > date2.getDate()) {
                    return true;
                }
                else return false;
            }
            else return false;
        }
        else return false;
    }

    compareOnlyTime(date1: Date, date2: Date) {
        if (!(date1 instanceof Date))
            date1 = new Date(date1);
        if (!(date2 instanceof Date))
            date2 = new Date(date2);

        let diffHours = date1.getHours() - date2.getHours();
        let diffMinutes = date1.getMinutes() - date2.getMinutes();
        if (diffHours == 0)
            return diffMinutes;
        return diffHours;
    }

    timeIsInTimeFrame(dateIn: Date, dateStart: Date, dateEnd: Date) {
        if (!(dateIn instanceof Date))
            dateIn = new Date(dateIn);
        if (!(dateStart instanceof Date))
            dateStart = new Date(dateStart);
        if (!(dateEnd instanceof Date))
            dateEnd = new Date(dateEnd);

        return (this.compareOnlyTime(dateIn, dateStart) >= 0) && (this.compareOnlyTime(dateIn, dateEnd) <= 0);
    }

    isDateExpired(date: Date) {
        let today = new Date();
        let due = new Date(date);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        return (due < today);
    }

    isValidResponse(res: BaseResponse): boolean {
        return res && res.result;
    }

    isValidField(field: string): boolean {
        return field && (field.length > 0);
    }

    isValidFile(file: File): boolean {
        return file && (file.size > 0);
    }

    isValidHHMM(value: string): boolean {
        let date = this.buildDateTimeFromHHMM(new Date(), value);
        return !isNaN(date.getTime());
    }

    cloneObject(source: any): any {
        let json = JSON.stringify(source);
        return JSON.parse(json);
    }

    createDateWithTime(hh: number, mm: number) {
        let today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDay(), hh, mm, 0);
    }

    firstOrDefault(items) {
        if (items && (items.length > 0))
            return items[0];
        return null;
    }

    valueOrDefault(data, def) {
        return data != null ? data : def;
    }

    first(array, predicate) {
        for (const item of array) {
            if (predicate(item))
                return item;
        }
        return null;
    }

    last(array, predicate) {
        for (const item of array.reverse()) {
            if (predicate(item))
                return item;
        }
        return null;
    }

    safePush(array, value) {
        if (!array)
            array = [];
        array.push(value);
        return array;
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    checkDateExpired(date: Date) {
        let now = new Date();
        try {
            if (date.getTime() < now.getTime()) return true;
            return false;
        } catch (ex) {
            console.error('common.service.checkDateExpired exception: ', ex);
        }

        return false;
    }

    mapFormGroupToObject(formGroup: FormGroup, objectInstance: any) {
        Object.getOwnPropertyNames(objectInstance).forEach(field => {
            let formFieldValue = formGroup.get(field);
            if (formFieldValue && formFieldValue.value)
                objectInstance[field] = formFieldValue.value;
        })
        return objectInstance;
    }

    mapObjectToFormGroup(formGroup: FormGroup, objectInstance: any) {
        Object.getOwnPropertyNames(objectInstance).forEach(field => {
            let formFieldValue = formGroup.get(field);
            if (formFieldValue)
                formFieldValue.patchValue(objectInstance[field]);
        })
        return objectInstance;
    }

    getDayOfWeekTranslatedFromDate(date: Date) {
        try {
            if (!(date instanceof Date)) date = new Date(date);
            let dayNum = date.getDay();
            let dayString = "Unknown";
            if(dayNum == 0) dayString = this.translate.instant("Sunday");
            else if(dayNum == 1) dayString = this.translate.instant("Monday");
            else if(dayNum == 2) dayString = this.translate.instant("Tuesday");
            else if(dayNum == 3) dayString = this.translate.instant("Wednesday");
            else if(dayNum == 4) dayString = this.translate.instant("Thursday");
            else if(dayNum == 5) dayString = this.translate.instant("Friday");
            else if(dayNum == 6) dayString = this.translate.instant("Saturday");
            return dayString;
        }
        catch(e){
            return date;
        }
    }

    getDayOfWeekTranslatedFromString(dateDDMMYYYY: String) {
        try {
            let dateParts = dateDDMMYYYY.split("/");
            let date = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
            let dayNum = date.getDay();
            let dayString = "Unknown";
            if(dayNum == 0) dayString = this.translate.instant("Sunday");
            else if(dayNum == 1) dayString = this.translate.instant("Monday");
            else if(dayNum == 2) dayString = this.translate.instant("Tuesday");
            else if(dayNum == 3) dayString = this.translate.instant("Wednesday");
            else if(dayNum == 4) dayString = this.translate.instant("Thursday");
            else if(dayNum == 5) dayString = this.translate.instant("Friday");
            else if(dayNum == 6) dayString = this.translate.instant("Saturday");
            return dayString;
        }
        catch(e){
            return dateDDMMYYYY;
        }
    }

}

