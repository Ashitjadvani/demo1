export enum UserTravelReason {
    NORMAL_TRIP = "NormalTrip",
    SITE_TRIP = "DifferentSite",
    BUSINESS_TRIP = "BusinessTrip"
};

export class TransportType {
    id: string;
    name: string
    description: string;
    engineType: string;
    wheelType: string;
    co2emission: number;
}

export class UserTransportTrack {
    id: string;
    transportType: TransportType;
    distance: number;
}

export class UserTransportHabit {
    userId: string;
    transportTracks: UserTransportTrack[];
    travelReason: UserTravelReason;
    startArea: string;
    destArea: string;
    note: string;

    constructor() {
        this.travelReason = UserTravelReason.NORMAL_TRIP;
        this.transportTracks = [];
    }
}

export class TransportTrackStat {
    id: string;
    name: string;
    engineType: string;
    co2emissions: number;
    count: number;
    totalDistance: number;
}

export class UserTransportHabitStatistic {
    userCount: number;
    transportStats: TransportTrackStat[];
}

export class SustainabilityViewSummary {
    transportTypeCount: number;
    userHabitCount: number;
    statisticsCount: number;
}
