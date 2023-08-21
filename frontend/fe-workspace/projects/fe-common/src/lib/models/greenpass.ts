export enum GREENPASS_LEVEL {
    NONE = "NONE",
    BASE = "BASE",
    SUPER = "SUPER",
    BOOSTER = "BOOSTER"
};

export class GreenPass {
    id: string;
    userId: string;
    qrCode: string;
    name: string;
    dateOfBirth: string;
    startDate: Date;
    endDate: Date;
    level: GREENPASS_LEVEL;
    timestamp: Date;
    

    static Empty(): GreenPass {
        let greenpass = new GreenPass();
        return greenpass;
    }

}

export class GreenPassValidation {
    id: string;
    userId: string;
    valid: boolean;
    timestamp: Date;
    

    static Empty(): GreenPass {
        let greenpassValidation = new GreenPass();
        return greenpassValidation;
    }

}

export class GreenPassSettings {
    abilitation: boolean;
    ageRangeLevel: GreenPassAgeRangeLevel[];
    storeGreenpass: boolean;
    requestedForCheckIn: boolean;
    checkName: boolean;
    checkDate: boolean;

    static Empty(): GreenPassSettings {
        let greenpassSettings = new GreenPassSettings();
        greenpassSettings.abilitation = true;
        greenpassSettings.ageRangeLevel = [];
        greenpassSettings.requestedForCheckIn = false;
        greenpassSettings.storeGreenpass = false;
        greenpassSettings.checkName = false;
        greenpassSettings.checkDate = false;
        return greenpassSettings;
    }

}

export class GreenPassAgeRangeLevel {
    lowerBound: number;
    upperBound: number;
    level: GREENPASS_LEVEL;

    static Empty(): GreenPassAgeRangeLevel {
        let greenpassAgeRangeLevel = new GreenPassAgeRangeLevel();
        greenpassAgeRangeLevel.lowerBound = 0;
        greenpassAgeRangeLevel.upperBound = 1;
        greenpassAgeRangeLevel.level = GREENPASS_LEVEL.SUPER;
        return greenpassAgeRangeLevel;
    }
}
