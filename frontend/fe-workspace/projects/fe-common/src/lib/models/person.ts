
import { Guid } from 'guid-typescript';

export const PERSON_PROPERTY = {
    PP_JOB_SITE: "JobSite",
    PP_CONTRACT_TYPE: "ContractType",
    PP_EMPLOYEE_TYPE: "EmployeeType",  // dirigente, impiegato, etc.
    PP_BADGE_NUMBER: "BadgeNumber",
    PP_WORKING_HOURS: "WorkingHours"
}

export enum PERSON_TYPOLOGY {
    DIRECT = "Personale diretto",
    INDIRECT = "Personale indiretto",
    PROFESSIONALS = "Professionisti"
};

export enum PERSON_SCOPE {
    EMPLOYEE = "Dipendente",
    PARTNER = "Partner",
    ADVISOR = "Consulente",
    OTHER = "Altro"
};

export enum ACCESS_CONTROL_LEVEL {
    PASSEPARTOUT = "PASSEPARTOUT",
    GROUP = "GROUP",
    SINGLE_PASSAGES = "SINGLE_PASSAGES",
    NONE = "NONE"
};

export class PersonPropertyValue {
    timestamp: Date;
    author: string;
    value: string;

    constructor(value: string) {
        this.timestamp = new Date();
        this.author = '';
        this.value = value;
    }
}

export class PersonProperty {
    name: string;
    values: PersonPropertyValue[];

    constructor(name: string) {
        this.name = name;
        this.values = [];
    }

    getValue() {
        return (this.values && this.values.length > 0) ? this.values[this.values.length].value : '';
    }

    setValue(value: string) {
        this.values.push(new PersonPropertyValue(value));
    }
}

export class PersonHistory {
    id: string;
    a: string; // author
    cf: string[]; // changed fields
    d: Person; // data
    o: string; // operation
    t: Date; // timestamp;
}

export class PeopleDispute {
    key: string;
    date: Date;
    dispute: string;
    note: string;
    author: string;
    notificationDate: Date;

    constructor(date, dispute, note, author, notDate) {
        this.key = Guid.create().toString();
        this.date = date;
        this.dispute = dispute;
        this.note = note;
        this.author = author;
        this.notificationDate = notDate;
    }

    static Empty(): PeopleDispute {
        return new PeopleDispute(null, null, null, null, null);
    }
}

export class Person {
    id: string;
    companyId: string;
    legacyId: string;

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

    addressDomicilio: string;
    cityDomicilio: string;
    provDomicilio: string;
    capDomicilio: string;
    residenceAsDomicilio: boolean;

    phone: string;
    email: string;

    deleted: boolean;
    profile: string[];
    properties: PersonProperty[];

    site: string;
    direction: string;
    area: string;
    jobTitle: string;
    role: string;
    function: string;

    identificationCode: string; // matricola
    partTimePercentage: number;

    workingHours: Date[];

    badgeId: string;
    restaurantCardId: string;

    dateStart: Date;
    dateEnd: Date;

    disputes: PeopleDispute[];

    salary: number;
    mbo: number;
    bonus: number;
    contractLevel: string;

    managerId: string;
    managerFullName: string;

    functionalManagerId: string;
    functionalManagerFullName: string;

    lunchOpen: boolean;
    importDate: Date;

    typology: PERSON_TYPOLOGY;

    scope: string;

    enablePlan: boolean;
    enableGreenpass: boolean;
    areaID?: string;

    enableBeaconService: boolean;

    accessControlLevel: ACCESS_CONTROL_LEVEL;
    accessControlGroupsId: string[];
    accessControlPassagesId: string[];
    accessControlQrCode: string;
    accessControlQrCodeValidityEnd: Date;

    enableKeys: boolean;

    ccnl: string;
    patrocinante: string;
    tutor: string;
    nomeroMatricola: string;

    static filterMatch(data: Person, filter: string): boolean {
        if (filter) {
            let lowerFilter = filter.toLocaleLowerCase();
            if (JSON.stringify(data).toLocaleLowerCase().includes(lowerFilter))
                return true;
        }
        return false;
    }

    static Empty(): Person {
        let person = new Person();

        person.workingHours = [null, null, null, null];
        person.disputes = [];

        return person;
    }

    static getFullName(person: Person): string {
        return person.name + ' ' + person.surname;
    }

    getProperty(name: string) {
        if (this.properties) {
            let propertyValue = this.properties.find(p => p.name == name);
            return propertyValue.getValue();
        } else
            return '';
    }

    setProperty(name: string, value: string) {
        if (!this.properties)
            this.properties = [];

        let propertyValue = this.properties.find(p => p.name == name);
        if (!propertyValue)
            propertyValue = new PersonProperty(name);

        propertyValue.setValue(value);
    }
}
