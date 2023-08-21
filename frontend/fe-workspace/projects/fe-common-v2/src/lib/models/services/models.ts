import { IrinaResource } from "../bookable-assets";
import { Person } from "../person";

export enum SERVICE_REPOSITORY {
    USERS = 'service-users',
    TRANSPORTS = 'service-transports',
}

export enum TRANSPORT_REQUEST_TYPE {
    PRIVATE_SELF,
    PRIVATE_OTHER,
    UILDM,
    ST_ERASMO,
    COMUNE_LG,
    COMUNE_CS,
    FIORELLONE
}

export const TRANSPORT_REQUEST_TYPE_ITEMS: any[] = [
    { value: TRANSPORT_REQUEST_TYPE.PRIVATE_SELF, text: 'Privato, l\'interessato in persona' },
    { value: TRANSPORT_REQUEST_TYPE.PRIVATE_OTHER, text: 'Privato, tramite un intermediario' },
    { value: TRANSPORT_REQUEST_TYPE.UILDM, text: 'UILDM Legnano call center' },
    { value: TRANSPORT_REQUEST_TYPE.ST_ERASMO, text: 'Sant\'Erasmo' },
    { value: TRANSPORT_REQUEST_TYPE.COMUNE_LG, text: 'Comune di Legnano' },
    { value: TRANSPORT_REQUEST_TYPE.COMUNE_CS, text: 'Comune di Cerro Maggiore' },
    { value: TRANSPORT_REQUEST_TYPE.FIORELLONE, text: 'Fiorellone' }
];

export class ServiceUser {
    name: string;
    surname: string;
    cf: string;
    birthDay: Date;
    birthPlace: string;
    birthProv: string;

    gender: string;

    address: string;
    city: string;
    prov: string;
    cap: string;

    phone: string;
    email: string;

    note: string;

    static Empty(): ServiceUser {
        let su = new ServiceUser();

        su.name = '';
        su.surname = '';
        su.cf = '';
        su.birthDay = null;
        su.birthPlace = '';
        su.birthProv = '';
        su.gender = '';
        su.address = '';
        su.city = '';
        su.prov = '';
        su.cap = '';
        su.phone = '';
        su.email = '';
        su.note = '';

        return su;
    }
}

export class ServiceTransportEntry {
    userName: string;
    userSurname: string;
    userGender: string;
    userAddress: string;
    userCity: string;
    userCap: string;
    userProv: string;
    userPhone: string;
    userPhysicStatus: string;

    startAddress: string;

    arrivalPlace: string;
    arrivalAddress: string;
    arrivalCity: string;
    arrivalProv: string;

    arrivalDate: Date;
    arrivalTime: Date;

    returnalDate: Date;
    returnalTime: Date;

    returnalAddress: string;

    static Empty(): ServiceTransportEntry {
        let trans = new ServiceTransportEntry();
    
        trans.userName = '';
        trans.userSurname = '';
        trans.userGender = '';
        trans.userAddress = '';
        trans.userCity = '';
        trans.userCap = '';
        trans.userProv = '';
        trans.userPhone = '';
        trans.userPhysicStatus = '';
    
        trans.startAddress = '';
    
        trans.arrivalPlace = '';
        trans.arrivalAddress = '';
        trans.arrivalCity = '';
        trans.arrivalProv = '';
    
        trans.arrivalDate = new Date();
        trans.arrivalTime = new Date();
    
        trans.returnalDate = new Date();
        trans.returnalTime = new Date();
    
        trans.returnalAddress = '';

        return trans;
    }
}

export class ServiceTransport {
    requester: TRANSPORT_REQUEST_TYPE;

    requesterName: string;
    requesterSurname: string;
    requesterPhone: string;

    accept1: boolean;
    accept2: boolean;
    accept3: boolean;
    wheelchairType: string;

    creationDate: Date;

    transportEntries: ServiceTransportEntry[];
 
    note: string;

    static Empty(): ServiceTransport {
        let trans = new ServiceTransport();

        trans.requester = TRANSPORT_REQUEST_TYPE.PRIVATE_SELF;

        trans.requesterName = '';
        trans.requesterSurname = '';
        trans.requesterPhone = '';

        trans.accept1 = false;
        trans.accept2 = false;
        trans.accept3 = false;
        trans.wheelchairType = '';
    
        trans.creationDate = new Date();
    
        trans.transportEntries = [];

        trans.note = '';
    
        return trans;
    }

    static TranslateRequestType(transportReqType: TRANSPORT_REQUEST_TYPE): string {
        let item = TRANSPORT_REQUEST_TYPE_ITEMS.find(i => i.value == transportReqType);
        return item ? item.text : '';
    }

}