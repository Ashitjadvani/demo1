import { Person } from "./person";
import { GreenPassSettings } from "./greenpass";

export enum EVENT_TYPE {
    NO_WORKING = "NoWorking",
    EXTRA_WORKING = "ExtraWorking"
};

export class Scope {
    name: string;
    enablePlan: boolean;
    enableGreenpass: boolean;
    enableTypology: boolean;
    enableArea: boolean;
    enableRole: boolean;
    enableJobTitle: boolean;
    enableIdentificationCode: boolean;
    enablePartTimePercentage: boolean;
    enableWorkingHours: boolean;
    enableDateStart: boolean;
    enableDateEnd: boolean;
    enableBadgeId: boolean;
    enableRestaurantCardId: boolean;
    enableDisputes: boolean;
    enableSalary: boolean;
    enableMbo: boolean;
    enableBonus: boolean;
    enableContractLevel: boolean;
    enableManager: boolean;
    areaAlternativeName: string;
    accessControlValidityDaysNum: number;

    static Empty(): Scope {
        let s = new Scope();

        s.name = "";
        s.enablePlan = true;
        s.enableGreenpass = true;
        s.enableTypology = true;
        s.enableArea = true;
        s.enableBadgeId = true;
        s.enableBonus = true;
        s.enableContractLevel = true;
        s.enableDateEnd = true;
        s.enableDateStart = true;
        s.enableIdentificationCode = true;
        s.enableJobTitle = true;
        s.enableManager = true;
        s.enableMbo = true;
        s.enablePartTimePercentage = true;
        s.enableRestaurantCardId = true;
        s.enableRole = true;
        s.enableSalary = true;
        s.enableWorkingHours = true;
        s.enableDisputes = true;
        s.areaAlternativeName = "";
        s.accessControlValidityDaysNum = 1;

        return s;
    }
}

export class JustificationApproval {
    id: string;
    figureArea: string;
    figureRole: string;
    figureDirection: string;
    personId: string;
    email: string;
    isUser: boolean;
    isEmail: boolean;
    isFigure: boolean;

    static Empty(): JustificationApproval {
        let ja = new JustificationApproval();

        ja.figureArea = "";
        ja.figureRole = "";
        ja.figureDirection = "";
        ja.personId = "";
        ja.email = "";
        ja.isUser = false;
        ja.isEmail = false;
        ja.isFigure = false;

        return ja;
    }
}

export class JustificationsSettings {
    sendMailForEveryRequest: boolean;
    sendAllMailEverydayAt: Date;
    mailStart: string;
    mailEnd: string;
    mailObject: string;
    enableAutoMergeRequests: boolean;

    constructor() {
        this.sendMailForEveryRequest = false;
        this.sendAllMailEverydayAt = new Date();
        this.sendAllMailEverydayAt.setHours(20, 0, 0);
        this.mailStart = "Buongiorno <NOME_DESTINATARIO>,<br>La informiamo che ci sono le seguenti richieste in attesa di approvazione:<br>";
        this.mailEnd = "La invitiamo ad accedere all'app nella sezione \"Gestione dipendenti\" per accettare o rifiutare le richieste in sospeso.<br>Cordiali saluti.";
        this.mailObject = "Irina Legance Approvazione";
        this.enableAutoMergeRequests = true;
    }
}

export class CompanyJustification {
    id: string;
    name: string;
    approvationAbilitation: boolean;
    scheduleAbilitation: boolean;
    silenceAssentAbilitation: boolean;
    silenceAssentTimeHours: number;
    daysToRequest: number;
    notifyCancellation: boolean;
    approvalResponsable: JustificationApproval;
    approvalAccountable: JustificationApproval;
    approvalConsulted: JustificationApproval;
    approvalInformed: JustificationApproval;
    sendEmail: boolean;
    enable: boolean;
    eventType: EVENT_TYPE;

    static Empty(): CompanyJustification {
        let cj = new CompanyJustification();
        cj.name = "";
        cj.approvationAbilitation = true;
        cj.scheduleAbilitation = true;
        cj.silenceAssentAbilitation = false;
        cj.silenceAssentTimeHours = 24;
        cj.daysToRequest = 2;
        cj.notifyCancellation = true;
        cj.approvalResponsable = JustificationApproval.Empty();
        cj.approvalAccountable = JustificationApproval.Empty();
        cj.approvalConsulted = JustificationApproval.Empty();
        cj.approvalInformed = JustificationApproval.Empty();
        cj.sendEmail = false;
        cj.enable = true;
        cj.eventType = EVENT_TYPE.NO_WORKING;

        return cj;
    }
}

export class Area {
    name: string;
    description: string;
    scopes: string[];
    id?: string;

    static Empty(): Area {
        let a = new Area();
        a.name = "";
        a.description = "";
        a.scopes = [];

        return a;
    }
}


export class Company {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    prov: string;
    cap: string;
    brandColor: string;
    logoID: string;

    mailHost: string;
    mailPort: string;
    mailUserName: string;
    mailPassword: string;
    mailFromName: string;
    mailEncryption: string;
    mailWebUrl: string;

    enableBeaconService: boolean;

    type: string;

    vatNumber: string;

    peopleAreas: string[];
    peopleRoles: string[];
    peopleDirections: string[];
    peopleJobTitles: string[];
    areas: Area[];
    peopleVacationTypes: string[];
    peopleDispute: string[];

    peopleJustificationTypes: CompanyJustification[];
    peopleJustificationsSettings: JustificationsSettings;

    lunchQuestEnabledForOffice: boolean;
    lunchQuestEnabledForSmartworking: boolean;

    lunchCronDays: number;
    enableLunchUpdaterCron: boolean;
    lunchUpdaterCronDueTime: string; // hh:mm

    scopes: Scope[];

    greenpassSettings: GreenPassSettings;

    constructor() {
        this.peopleAreas = [];
        this.peopleRoles = ["Director", "Area Manager"];
        this.peopleDirections = [];
        this.peopleJobTitles = [];
        this.peopleVacationTypes = [];
        this.peopleDispute = [];
        this.peopleJustificationTypes = [];
        this.peopleJustificationsSettings = new JustificationsSettings();
        this.lunchQuestEnabledForOffice = true;
        this.lunchQuestEnabledForSmartworking = true;
        this.lunchCronDays = 10;
        this.enableLunchUpdaterCron = true;
        this.lunchUpdaterCronDueTime = "23:00";
        this.scopes = [];
        this.greenpassSettings = GreenPassSettings.Empty();
    }
}
