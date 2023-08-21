import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {prodEnvironment} from '../../../../environments/environment.prod';

@Component({
    selector: 'app-mobile-app-qr',
    templateUrl: './mobile-app-qr.component.html',
    styleUrls: ['./mobile-app-qr.component.scss']
})
export class MobileAppQrComponent implements OnInit {

    enviorment: any = environment;
    prodEnvironment: any = prodEnvironment;
    qrData: string;
    companyId: any;
    baseUrl: any;

    constructor() {
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.companyId = authUser.person.companyId;
        }
        if (prodEnvironment.productionEnvironment === true) {
            this.baseUrl = this.prodEnvironment.ENV + '/v2/';
        } else {
            this.baseUrl = this.enviorment.api_host + '/v2/';
        }
        const obj = {baseURL: this.baseUrl, companyId: this.companyId};
        this.qrData = JSON.stringify(obj);
    }

    ngOnInit(): void {
    }

}
