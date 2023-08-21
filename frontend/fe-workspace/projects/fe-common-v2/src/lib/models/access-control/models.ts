import { ACCESS_CONTROL_LEVEL } from "../person";

export enum ACLOG_TYPE {
    QRCODE = "Qrcode",
    RING = "Ring",
    BEACON = "Beacon",
    MANUAL = "Manual"
};

export enum ACCESS_CONTROL_LIMIT_TYPE {
    INFINITE = "Infinite",
    ONCE = "Once",
    NUMBER = "Number"
};

export enum AC_SYSTEM_TYPE {
    LOMNIA = "Lomnia"
};

export enum AC_SYSTEM_STATE {
    OFFLINE = "Offline",                 // non è raggiungibile / le chiamate POST non rispondono
    ONLINE_VALID = "Online Valid",       // è raggiungibile, le chiamate POST rispondono, token valido, gruppo valido
    ONLINE_INVALID = "Online Invalid"    // è raggiungibile, le chiamate POST rispondono ma non è valido il token o il gruppo
};

export class AccessControlGatesGroup {
    id: string;
    systemId: string;
    companyId: string;
    name: string;
    deleted: boolean;
    timestamp: Date;
    gatesId: string[];
    disableDocuments: boolean;

    static Empty(companyId: string): AccessControlGatesGroup {
        let group = new AccessControlGatesGroup();
        
        group.companyId = companyId;
        group.name = "";
        group.deleted = false;
        group.systemId = "";
        group.timestamp = new Date();
        group.gatesId = new Array();
        group.disableDocuments = false;

        return group;
    }
}

export class AccessControlGate {
    id: string;
    systemId: string;
    companyId: string;
    siteId: string;
    centralUnitId: number;
    isAvailable: boolean;
    isOnline: boolean;
    name: string;
    tokenWifi: string;
    lastConnection: Date;
    centralUnitName: string;
    wifiSSID: string;
    wifiPassword: string;
    groupId: number;
    groupName: string;
    createQrCode: string;
    setWifiQrCode: string;
    setPathQrCode: string;
    resetKeypadQrCode: string;
    resetBlacklistQrCode: string;
    documentId: string;
    deleted: boolean;
    timestamp: Date;
    beaconAlias: string;
    type: string;

    static Empty(companyId: string): AccessControlGate {
        let gate = new AccessControlGate();
        
        gate.companyId = companyId;
        gate.name = "";
        gate.deleted = false;
        gate.systemId = "";
        gate.siteId = "";
        gate.centralUnitId = 0;
        gate.isAvailable = false;
        gate.isOnline = false;
        gate.tokenWifi = "";
        gate.lastConnection = null;
        gate.centralUnitName = "";
        gate.wifiSSID = "";
        gate.wifiPassword = "";
        gate.groupId = 0;
        gate.groupName = "";
        gate.createQrCode = "";
        gate.setWifiQrCode = "";
        gate.setPathQrCode = "";
        gate.resetKeypadQrCode = "";
        gate.resetBlacklistQrCode = "";
        gate.documentId = "";
        gate.type = "In";
        gate.timestamp = new Date();

        return gate;
    }
}

export class AccessControlSystem {
    id: string;
    companyId: string;
    name: string;
    type: AC_SYSTEM_TYPE;
    url: string;
    token: string;
    groupId: number;
    groupName: string;
    state: AC_SYSTEM_STATE;
    deleted: boolean;
    timestamp: Date;

    static Empty(companyId: string): AccessControlSystem {
        let system = new AccessControlSystem();
        
        system.companyId = companyId;
        system.name = "";
        system.type = AC_SYSTEM_TYPE.LOMNIA;
        system.url = "";
        system.token = "";
        system.groupId = 0;
        system.groupName = "";
        system.state = AC_SYSTEM_STATE.OFFLINE;
        system.deleted = false;

        return system;
    }
}

export class AccessControlLog {
    id: string;
    siteId: string;
    logType: ACLOG_TYPE;
    isRing: boolean;
    isBeacon: boolean;
    centralUnitName: string;
    centralUnitId: number;
    groupName: string;
    timestamp: Date;
    name: string;
    surname: string;
    email: string;
    valid: boolean;
    number: string;
    idutente: string;
    gateName: string;
    userScope: string;
    addedByUserName: string;
    addedByUserId: string;
}

export class UserACQrCodeData {
    type: string;
    groupsId: string[];
    passageIds: string[];
    effectivePassagesId: string[];
    startDate: Date;
    endDate: Date;
    name: string;
    surname: string;
    email: string;
    number: string;
    idutente: string;
    notes: string;
    userScope: string;
    limitType: ACCESS_CONTROL_LIMIT_TYPE;
    limitNumber: number;

    static Empty(): UserACQrCodeData {
        let codeData = new UserACQrCodeData();
        
        codeData.type = ACCESS_CONTROL_LEVEL.SINGLE_PASSAGES;
        codeData.groupsId = new Array();
        codeData.passageIds = new Array();
        codeData.effectivePassagesId = new Array();
        codeData.startDate = new Date();
        codeData.endDate = new Date();
        codeData.endDate.setDate(codeData.endDate.getDate()+1);
        codeData.name = "";
        codeData.surname = "";
        codeData.email = "";
        codeData.number = "";
        codeData.notes = "";
        codeData.idutente = "";
        codeData.limitType = ACCESS_CONTROL_LIMIT_TYPE.INFINITE;
        codeData.limitNumber = 2;
        return codeData;
    }
}

export class UserACQrCode {

    id: string;
    qrcode: string;
    blockQrCode: string;
    timestamp: Date;
    blockedTimestamp: Date;
    lomniaIdCode: string;
    blocked: boolean;
    codeData: UserACQrCodeData;
    deleted: boolean;

    static Empty(): UserACQrCode {
        let code = new UserACQrCode();
        code.codeData = new UserACQrCodeData();
        return code;
    }
}

export class CustomACQrCodeData {
    type: string;
    groupsId: string[];
    passageIds: string[];
    startDate: Date;
    endDate: Date;
    name: string;
    surname: string;
    email: string;
    number: string;
    notes: string;
    limitType: ACCESS_CONTROL_LIMIT_TYPE;
    limitNumber: number;

    static Empty(): CustomACQrCodeData {
        let codeData = new CustomACQrCodeData();
        
        codeData.type = ACCESS_CONTROL_LEVEL.SINGLE_PASSAGES;
        codeData.groupsId = new Array();
        codeData.passageIds = new Array();
        codeData.startDate = new Date();
        codeData.endDate = new Date();
        codeData.endDate.setDate(codeData.endDate.getDate()+1);
        codeData.name = "";
        codeData.surname = "";
        codeData.email = "";
        codeData.number = "";
        codeData.notes = "";
        codeData.limitType = ACCESS_CONTROL_LIMIT_TYPE.INFINITE;
        codeData.limitNumber = 2;
        return codeData;
    }
}

export class CustomACQrCode {

    id: string;
    qrcode: string;
    siteId: string;
    blockQrCode: string;
    timestamp: Date;
    lomniaIdCode: string;
    blocked: boolean;
    codeData: CustomACQrCodeData;

    static Empty(): CustomACQrCode {
        let code = new CustomACQrCode();

        return code;
    }
}

export class AccessControlRequest {
    id: string;
    accessControlId: string;
    requestUrl: string;
    response: string;
    responseReceived: boolean;
    requestTimestamp: Date;
    responseTimestamp: Date;
    responseAccepted: boolean;
    connectionTimedOut: boolean;
}
