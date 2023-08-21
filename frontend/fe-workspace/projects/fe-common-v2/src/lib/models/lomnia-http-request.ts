export class LomniaHttpRequest {
    id: string;
    requestUrl: string;
    response: string;
    responseReceived: boolean;
    requestTimestamp: Date;
    responseTimestamp: Date;
    responseAccepted: boolean;
    connectionTimedOut: boolean;
}
