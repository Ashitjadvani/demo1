export enum ACLOG_TYPE {
    QRCODE = "Qrcode",
    RING = "Ring",
    BEACON = "Beacon"
};

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
}
