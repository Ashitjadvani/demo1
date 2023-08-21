export class AreaReservationInfo {
    areaCode: string;
    reservationCount: number;
}

export class SiteDailyCalendarStatistics {
    date: string;
    reservationCount: number;
    departmentStats: AreaReservationInfo[];
}