import { stringify } from "querystring";

export enum REQUEST_TYPE {
    NO_WORKING = "NoWorking",
    EXTRA_WORKING = "ExtraWorking"
};

export enum REQUEST_STATE {
    INITIALIZED = "Initialized",
    PENDING = "Pending",
    ACC_ACCEPTED = "AccAccepted",
    ACC_REJECTED = "AccRejected",
    RES_REJECTED = "ResRejected",
    RES_ACCEPTED = "ResAccepted",
    AUTO_ACCEPTED = "AutoAccepted"

}

export class RequestPersonSchema {
    isInternal: boolean;
    isExternal: boolean;
    personId: string;
    email: string;

    constructor() {    }

    static Empty(): RequestPersonSchema {
        let person = new RequestPersonSchema();
        person.isInternal = false;
        person.isExternal = false;
        person.personId = "";
        person.email = "";
        return person;
    }
}

export class RequestNoteSchema {
    name: string;
    date: Date;
    note: string;

    constructor() {    }

    static Empty(): RequestNoteSchema {
        let note = new RequestNoteSchema();
        note.name = "";
        note.date = new Date();
        note.note = "";
        return note;
    }
}

export class Request {

    id: string;
    userId: string;
    userName: string;
    userSurname: string;
    accountable: RequestPersonSchema;
    responsable: RequestPersonSchema;
    consulted: RequestPersonSchema;
    informed: RequestPersonSchema;
    requestType: REQUEST_TYPE;
    dateTimeStart: Date;
    dateTimeEnd: Date;
    justificative: string;
    silenceAssent: boolean;
    additionalNotes: RequestNoteSchema[];
    practiceId: string;
    requestState: REQUEST_STATE;
    lastActionName: string;
    lastActionDate: Date;
    type:string;

    constructor() {    }

    static Empty(): Request {
        let request = new Request();

        request.userId = '';
        request.userName = '';
        request.userSurname = '';
        request.accountable = RequestPersonSchema.Empty();
        request.responsable = RequestPersonSchema.Empty();
        request.consulted = RequestPersonSchema.Empty();
        request.informed = RequestPersonSchema.Empty();
        request.requestType = REQUEST_TYPE.NO_WORKING;
        request.dateTimeStart = new Date();
        request.dateTimeEnd = new Date();
        request.justificative = '';
        request.silenceAssent = false;
        request.additionalNotes = [];
        request.requestState = REQUEST_STATE.INITIALIZED;
        request.practiceId = '';
        request.type = '';

        return request;
    }

}