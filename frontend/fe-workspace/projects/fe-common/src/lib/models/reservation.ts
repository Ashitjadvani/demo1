import { User } from './admin/user';

export class ReservationUser {
    userId: string;
    timestamp: Date;
    timeSlotId: string;
}

export class ReservationItem {
    id: string;
    siteId: string;
    resourceId: string;
    name: string;
    description: string;
    date: string;
    startTime: Date;
    endTime: Date;
    maxReservationCount: number;
    actualReservationCount: number;
    reservationUsers: ReservationUser[];
    timeSlots: any[];
    reservedUsers: User[];
}

export class ExtraSiteConfiguration {
    vaxAvailable: boolean = false;
    vaxPhoneReservation: boolean = false;
    dateStartAvailability: Date;
    dateEndAvailability: Date;
    additionalDescription: string;
}

export class ReservationSite {
    id: string;
    resourceDomain: string;
    name: string;
    address: string
    city: string;
    description: string;
    cap: string;
    phone: string;
    reference: string;
    maxCountPerSlot: number;
    reservationAvailability: ReservationItem[];
    reservationUserId: string[];
    reservationItems: ReservationItem[];
    userBookings: any[];
    openForBooking: boolean;
    extraConfiguration: any;
    reservedUsers: User[];

    static Empty(): ReservationSite {
        let rs = new ReservationSite();

        rs.reservationAvailability = [];
        
        return rs;
    }

    static Lite(source: ReservationSite): any {
        return {
            id: source.id,
            resourceDomain: source.resourceDomain,
            name: source.name,
            address: source.address,
            city: source.city,
            description: source.description,
            cap: source.cap,
            phone: source.phone,
            reference: source.reference,
            maxCountPerSlot: source.maxCountPerSlot,
            reservationAvailability: source.reservationAvailability,
            reservationItems: source.reservationItems,
            openForBooking: source.openForBooking,
            extraConfiguration: source.extraConfiguration
        };
    }
}