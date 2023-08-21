import {Injectable} from '@angular/core';
import {Subject, Observable, BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedDataService {

    private sharedData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    sharedData$: Observable<any> = this.sharedData.asObservable();

    constructor() {
    }

    setData(updatedData) {
        this.sharedData.next(updatedData);
    }
}
