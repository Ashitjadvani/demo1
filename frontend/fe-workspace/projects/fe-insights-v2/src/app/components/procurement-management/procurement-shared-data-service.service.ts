import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProcurementSharedDataServiceService {

    private sharedData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    sharedData$: Observable<any> = this.sharedData.asObservable();

    constructor() {
    }

    setData(updatedData) {
        this.sharedData.next(updatedData);
    }
}
