import { Person } from "./person";

export enum AUTH_PROVIDER {
    LOCAL = "local",
    ACTIVE_DIRECTORY = "ad",
    AZURE = "azure",
    NFS = "nfs",
    GOOGLE = "google",
    FACEBOOK = "facebook",
    MICROSOFT = "microsoft"
}

export class UserAccount {
    id: string;
    userId: string;
    personId: string;
    companyId: string;
    password: string;
    passwordValid: any = '1_hour';
    passwordMin: any = 3;
    passwordMax: any = 8;
    passwordPattern: any = 7;
    allowedPreviousPassword: any = 1;
    passwordDuration: any = 1;
    authProvider: AUTH_PROVIDER;
    registrationId: string;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    personInfo: Person;

    static filterMatch(data: UserAccount, filter: string): boolean {
        if (filter) {
            let lowerFilter = filter.toLocaleLowerCase();
            if (JSON.stringify(data).toLocaleLowerCase().includes(lowerFilter))
                return true;
        }
        return false;
    }

    static Empty(): UserAccount {
        let userAccount = new UserAccount();
        return userAccount;
    }

}
