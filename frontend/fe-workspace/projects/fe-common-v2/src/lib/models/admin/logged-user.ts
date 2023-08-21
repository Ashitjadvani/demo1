import { UserProfile } from './user';

export class LoggedUser {
    id: string;
    profile: UserProfile;
    token: string;
}