import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SettingsManagementService {

    constructor() { }

    getSettingsValue(key: string) {
        return localStorage.getItem(key);
    }

    setSettingsValue(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    removeSettings(key: string) {
        localStorage.removeItem(key);
    }
}
