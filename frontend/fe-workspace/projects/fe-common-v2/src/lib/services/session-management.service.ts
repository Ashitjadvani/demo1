import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionManagementService {
    @Output() onSessionExpired: EventEmitter<void> = new EventEmitter();
    
    constructor() { }

    fireSessionExpired() {
        this.onSessionExpired.emit();
    }
}
