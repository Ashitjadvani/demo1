import { User } from './admin/user';

export class SafetyUser extends User {
    deskUsed: string = '';
}

export class SiteSafetyUsers {
    users: User[];
    safetyPrep: SafetyUser[];
    safetyAdd: SafetyUser[];
    safetyTutor: SafetyUser[];
}