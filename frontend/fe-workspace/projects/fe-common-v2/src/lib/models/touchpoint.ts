export class TouchPoint {
    id: string;
    deviceId: string;
    companyId: string;
    name: string;
    description: string;
    userAgent: string;
    startedAt: Date;
    lastKeepAlive: Date;
    officeInCount: number;
    officeOutCount: number;
    showAlert: boolean;
}

export class TouchPointSettings {
    keepAliveInterval: number;
    alertMailList: string;
}