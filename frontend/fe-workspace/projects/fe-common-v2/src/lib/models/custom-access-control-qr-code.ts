import { ACCESS_CONTROL_LEVEL } from "./person";

export enum ACCESS_CONTROL_LIMIT_TYPE {
    INFINITE = "Infinite",
    ONCE = "Once",
    NUMBER = "Number"
};

export class CustomACQrCodeData {
    type: String;
    groupsId: String[];
    passageIds: String[];
    startDate: Date;
    endDate: Date;
    name: String;
    surname: String;
    email: String;
    number: String;
    notes: String;
    limitType: ACCESS_CONTROL_LIMIT_TYPE;
    limitNumber: Number;

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
    blocked: Boolean;
    codeData: CustomACQrCodeData;

    static Empty(): CustomACQrCode {
        let code = new CustomACQrCode();

        return code;
    }
}

