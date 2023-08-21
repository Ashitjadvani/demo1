export enum UserProfile {
    SYSTEM = "System",
    ADMIN = "Admin",
    HR = "HR",
    EMPLOYEE = "Employee",
    MAINTENANCE = "Maintenance",
    SERVICE = "Service",
    CLEANING = "Cleaning",
    CONSULTANT = "Consultant",
    BOARDASSISTANT = "BoardAssistant",
    DIRECTOR = "Director",
    SPOC_APM = "SpocTeamPandemic",
    TESTER = "Tester",
    STAGING_ACCESS = "StagingAccess"
}

export enum UserSafetyGroup {
    SAF_PREP = "SAF_PREP",
    SAF_ADDETTO = "SAF_ADDETTO",
    SAF_TUT = "SAF_TUT"
}

export class User {
    id: string;
    name: string;
    surname: string;
    company: string;
    codeArea: string;
    descrArea: string;
    codDivision: string;
    descrDivision: string;
    unit: string;
    site: string;
    referenceSite: string;
    managerId: string;
    officeManagerId: string;
    managerSurname: string;
    managerName: string;
    directorSurname: string;
    directorName: string;
    profile: string[];
    phone: string;
    email: string;
    password: string;
    deleted: boolean;
    safetyGroups: string[];
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    planRestrictions: string[];

    constructor() {

    }

    static Empty(): User {
        return new User();
    }

    static Clone(user: User): User {
        let newUser = new User();

        newUser.id = user.id;
        newUser.name = user.name;
        newUser.surname = user.surname;
        newUser.company = user.company;
        newUser.codeArea = user.codeArea;
        newUser.descrArea = user.descrArea;
        newUser.codDivision = user.codDivision;
        newUser.descrDivision = user.descrDivision;
        newUser.unit = user.unit;
        newUser.site = user.site;
        newUser.managerId = user.managerId;
        newUser.managerSurname = user.managerName;
        newUser.managerName = user.managerSurname;
        newUser.directorSurname = user.directorSurname;
        newUser.directorName = user.directorName;
        newUser.profile = user.profile;
        newUser.phone = user.phone;
        newUser.email = user.email;
        newUser.password = user.password;
        newUser.deleted = user.deleted;
        newUser.lastLoginAt = user.lastLoginAt;
        newUser.createdAt = user.createdAt;
        newUser.updatedAt = user.updatedAt;

        return newUser;
    }

    static filterMatch(data: User, filter: string): boolean {
        if (filter) {
            let lowerFilter = filter.toLocaleLowerCase();
            let isSafety = data.safetyGroups && (data.safetyGroups.length > 0) && (data.safetyGroups.find(saf => saf.toLocaleLowerCase().includes(lowerFilter)) != null);

            return (data.id && data.id.toLocaleLowerCase().includes(lowerFilter)) ||
                (data.name && data.name.toLocaleLowerCase().includes(lowerFilter)) ||
                (data.surname && data.surname.toLocaleLowerCase().includes(lowerFilter)) ||
                (data.profile && data.profile.find(p => p.toLocaleLowerCase().includes(lowerFilter)) != null) ||
                (data.descrArea && data.descrArea.toLocaleLowerCase().includes(lowerFilter)) ||
                isSafety;
        }
        return false;
    }

    static mapUserSafetyGroup(saf: string): string {
        if (saf == UserSafetyGroup.SAF_PREP)
            return 'Preposto';
        else if (saf == UserSafetyGroup.SAF_ADDETTO)
            return 'Addetto';
        else if (saf == UserSafetyGroup.SAF_TUT)
            return 'Tutor';
        else
            return '';
    }

    static isDirector(user: User) {
        return (user != null) && (user.name == user.directorName) && (user.surname == user.directorSurname);
    }

    static toString(user: User) {
        return user.surname + ' ' + user.name;
    }

}