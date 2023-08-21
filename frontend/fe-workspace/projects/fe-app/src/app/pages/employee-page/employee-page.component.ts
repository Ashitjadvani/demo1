import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core"; 
import { Request, REQUEST_STATE, REQUEST_TYPE } from 'projects/fe-common/src/lib/models/requests';
import { RequestManagementService } from 'projects/fe-common/src/lib/services/request-management.service';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { MatTabGroup } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFiltersDialogComponent, EmployeeFiltersDialogData} from './employee-filters-dialog/employee-filters-dialog.component';
import { Company } from 'projects/fe-common/src/lib/models/company';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
    selector: 'app-employee-page',
    templateUrl: './employee-page.component.html',
    styleUrls: ['./employee-page.component.scss'],
})
export class EmployeePageComponent implements OnInit {
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;
    
    allRequestAcceptedListEmpty: boolean;
    allRequestRejectedListEmpty: boolean;
    allRequestPendingListEmpty: boolean;
    requestAccList : Request[];
    requestResList : Request[];
    requestConsList : Request[];
    requestInfoList : Request[];
    requestAccPendingList : Request[];
    requestAccAcceptedList : Request[];
    requestAccRejectedList : Request[];
    requestResPendingList : Request[];
    requestResAcceptedList : Request[];
    requestResRejectedList : Request[];
    requestConsPendingList : Request[];
    requestConsAcceptedList : Request[];
    requestConsRejectedList : Request[];
    requestInfoPendingList : Request[];
    requestInfoAcceptedList : Request[];
    requestInfoRejectedList : Request[];
    selectedRequest: Request = new Request();
    currAccount: Person;
    currCompany: Company;
    people: Person[];
    tabIndex: number;
    tabFiltersVisible: boolean = true;
    filterData: EmployeeFiltersDialogData = new EmployeeFiltersDialogData();

    constructor(private _common: CommonService,
        private router: Router,
        public translate: TranslateService,
        private requestManagementService: RequestManagementService,
        private _userManagementService: UserManagementService,
        private _adminUserManagementService: AdminUserManagementService,
        private _dialog: MatDialog
    ){}

    async ngOnInit() {
        this.tabIndex=0;
        this.currAccount = this._userManagementService.getAccount();
        this.initCompany();
        this.initFilters();
        this.loadRequestList();
    }

    async initCompany() {
        let res = await this._adminUserManagementService.getCompany(this.currAccount.companyId);
        if(res.result) {
            this.currCompany = res.company;
        }
        let res2 = await this._adminUserManagementService.getPeople(this.currAccount.companyId);
        if(res2.result) {
            this.people = res2.people;
        }
    }

    initFilters() {     // INIZIALMENTE FILTRA X DATA ( 1 SETT PRIMA E 1 SETT DOPO )
        this.filterData.dataSelected = true;
        let startDate = this.filterData.dataEnd.getDate()-7;
        let endDate = this.filterData.dataEnd.getDate()+7;
        this.filterData.dataStart.setDate(startDate);
        this.filterData.dataEnd.setDate(endDate);
    }

    async loadRequestList() {
        let requestAccListTemp = new Array();
        let requestConsListTemp = new Array();
        let requestInfoListTemp = new Array();

        if(this.filterData.dataSelected) {
            let start = this._common.toYYYYMMDDv2(this.filterData.dataStart);
            let end = this._common.toYYYYMMDDv2(this.filterData.dataEnd);    
            this.requestResList = await this.requestManagementService.getResponsableRequestsByDate(this.currAccount.id, start, end);
            requestAccListTemp = await this.requestManagementService.getAccountableRequestsByDate(this.currAccount.id, start, end);
            requestConsListTemp = await this.requestManagementService.getConsultedRequestsByDate(this.currAccount.id, start, end);
            requestInfoListTemp = await this.requestManagementService.getInformedRequestsByDate(this.currAccount.id, start, end);
            if(this.filterData.justificativeSelected) {
                this.requestResList = this.requestResList.filter(u => u.justificative == this.filterData.justificative);
                requestAccListTemp = requestAccListTemp.filter(u => u.justificative == this.filterData.justificative);
                requestConsListTemp = requestConsListTemp.filter(u => u.justificative == this.filterData.justificative);
                requestInfoListTemp = requestInfoListTemp.filter(u => u.justificative == this.filterData.justificative);
            }
            if(this.filterData.userSelected) {
                this.requestResList = this.requestResList.filter(u => u.userId == this.filterData.user.id);
                requestAccListTemp = requestAccListTemp.filter(u => u.userId == this.filterData.user.id);
                requestConsListTemp = requestConsListTemp.filter(u => u.userId == this.filterData.user.id);
                requestInfoListTemp = requestInfoListTemp.filter(u => u.userId == this.filterData.user.id);               
            }
        }
        else if(this.filterData.justificativeSelected) {
            let justificative = this.filterData.justificative;
            this.requestResList = await this.requestManagementService.getResponsableRequestsByJustificative(this.currAccount.id, justificative);
            requestAccListTemp = await this.requestManagementService.getAccountableRequestsByJustificative(this.currAccount.id, justificative);
            requestConsListTemp = await this.requestManagementService.getConsultedRequestsByJustificative(this.currAccount.id, justificative);
            requestInfoListTemp = await this.requestManagementService.getInformedRequestsByJustificative(this.currAccount.id, justificative);                  
            if(this.filterData.userSelected) {
                this.requestResList = this.requestResList.filter(u => u.userId == this.filterData.user.id);
                requestAccListTemp = requestAccListTemp.filter(u => u.userId == this.filterData.user.id);
                requestConsListTemp = requestConsListTemp.filter(u => u.userId == this.filterData.user.id);
                requestInfoListTemp = requestInfoListTemp.filter(u => u.userId == this.filterData.user.id);               
            }
        }
        else if(this.filterData.userSelected) {
            let userId = this.filterData.user.id;
            this.requestResList = await this.requestManagementService.getResponsableRequestsByUser(this.currAccount.id, userId);
            requestAccListTemp = await this.requestManagementService.getAccountableRequestsByUser(this.currAccount.id, userId);
            requestConsListTemp = await this.requestManagementService.getConsultedRequestsByUser(this.currAccount.id, userId);
            requestInfoListTemp = await this.requestManagementService.getInformedRequestsByUser(this.currAccount.id, userId);
            if(this.filterData.justificativeSelected) {
                this.requestResList = this.requestResList.filter(u => u.justificative == this.filterData.justificative);
                requestAccListTemp = requestAccListTemp.filter(u => u.justificative == this.filterData.justificative);
                requestConsListTemp = requestConsListTemp.filter(u => u.justificative == this.filterData.justificative);
                requestInfoListTemp = requestInfoListTemp.filter(u => u.justificative == this.filterData.justificative);
            }
        }
        else {
            this.requestResList = await this.requestManagementService.getResponsableRequests(this.currAccount.id);
            requestAccListTemp = await this.requestManagementService.getAccountableRequests(this.currAccount.id);
            requestConsListTemp = await this.requestManagementService.getConsultedRequests(this.currAccount.id);
            requestInfoListTemp = await this.requestManagementService.getInformedRequests(this.currAccount.id);
        }

        this.requestAccList = new Array();
        this.requestConsList = new Array();
        this.requestInfoList = new Array();        
        for(let req of requestAccListTemp) {
            let found = false;
            for(let reqRes of this.requestResList) {
                if(req.id==reqRes.id) {
                    found=true;
                    break;
                }
            }
            if(!found)  this.requestAccList.push(req);
        }
        for(let req of requestConsListTemp) {
            let found = false;
            for(let reqRes of this.requestResList) {
                if(req.id==reqRes.id) {
                    found=true;
                    break;
                }
            }
            if(!found) {
                for(let reqAcc of this.requestAccList) {
                    if(req.id==reqAcc.id) {
                        found=true;
                        break;
                    }
                }
            }
            if(!found)  this.requestConsList.push(req);
        }
        for(let req of requestInfoListTemp) {
            let found = false;
            for(let reqRes of this.requestResList) {
                if(req.id==reqRes.id) {
                    found=true;
                    break;
                }
            }
            if(!found) {
                for(let reqAcc of this.requestAccList) {
                    if(req.id==reqAcc.id) {
                        found=true;
                        break;
                    }
                }
            }
            if(!found) {
                for(let reqCons of this.requestConsList) {
                    if(req.id==reqCons.id) {
                        found=true;
                        break;
                    }
                }
            }
            if(!found)  this.requestInfoList.push(req);
        }
        this.requestAccPendingList = new Array();
        this.requestAccAcceptedList = new Array();
        this.requestAccRejectedList = new Array();
        this.requestResPendingList = new Array();
        this.requestResAcceptedList = new Array();
        this.requestResRejectedList = new Array();
        this.requestConsPendingList = new Array();
        this.requestConsAcceptedList = new Array();
        this.requestConsRejectedList = new Array();
        this.requestInfoPendingList = new Array();
        this.requestInfoAcceptedList = new Array();
        this.requestInfoRejectedList = new Array();
        for(let request of this.requestResList) {
            
            if(request.requestState==REQUEST_STATE.PENDING || request.requestState==REQUEST_STATE.INITIALIZED || request.requestState==REQUEST_STATE.ACC_ACCEPTED) {
                this.requestResPendingList.push(request);
            }
            else if(request.requestState==REQUEST_STATE.RES_ACCEPTED || request.requestState==REQUEST_STATE.AUTO_ACCEPTED){
                this.requestResAcceptedList.push(request);
            }
            else if(request.requestState==REQUEST_STATE.ACC_REJECTED || request.requestState==REQUEST_STATE.RES_REJECTED){
                this.requestResRejectedList.push(request);
            }
        }

        for(let request of this.requestAccList) {
            
            if(request.requestState==REQUEST_STATE.PENDING || request.requestState==REQUEST_STATE.INITIALIZED) {
                this.requestAccPendingList.push(request);
            }
            else if(request.requestState==REQUEST_STATE.RES_ACCEPTED  || request.requestState==REQUEST_STATE.ACC_ACCEPTED || request.requestState==REQUEST_STATE.AUTO_ACCEPTED){
                this.requestAccAcceptedList.push(request);
            }
            else if(request.requestState==REQUEST_STATE.RES_REJECTED || request.requestState==REQUEST_STATE.ACC_REJECTED){
                this.requestAccRejectedList.push(request);
            }
        }

        for(let request of this.requestConsList) {
            if(request.requestState==REQUEST_STATE.PENDING || request.requestState==REQUEST_STATE.INITIALIZED) {
                this.requestConsPendingList.push(request);
            }
            else if(request.requestState==REQUEST_STATE.RES_ACCEPTED  || request.requestState==REQUEST_STATE.ACC_ACCEPTED || request.requestState==REQUEST_STATE.AUTO_ACCEPTED){
                this.requestConsAcceptedList.push(request);
            }
            else if(request.requestState==REQUEST_STATE.RES_REJECTED || request.requestState==REQUEST_STATE.ACC_REJECTED){
                this.requestConsRejectedList.push(request);
            }
        }

        for(let request of this.requestInfoList) {
            if(request.requestState==REQUEST_STATE.PENDING || request.requestState==REQUEST_STATE.INITIALIZED) {
                this.requestInfoPendingList.push(request);
            }
            else if(request.requestState==REQUEST_STATE.RES_ACCEPTED  || request.requestState==REQUEST_STATE.ACC_ACCEPTED || request.requestState==REQUEST_STATE.AUTO_ACCEPTED){
                this.requestInfoAcceptedList.push(request);
            }
            else if(request.requestState==REQUEST_STATE.RES_REJECTED || request.requestState==REQUEST_STATE.ACC_REJECTED){
                this.requestInfoRejectedList.push(request);
            }
        }

        this.allRequestPendingListEmpty = this.requestAccPendingList.length == 0 && this.requestResPendingList.length == 0 && this.requestConsPendingList.length == 0 && this.requestInfoPendingList.length == 0; 
        this.allRequestAcceptedListEmpty = this.requestAccAcceptedList.length == 0 && this.requestResAcceptedList.length == 0 && this.requestConsAcceptedList.length == 0 && this.requestInfoAcceptedList.length == 0; 
        this.allRequestRejectedListEmpty = this.requestAccRejectedList.length == 0 && this.requestResRejectedList.length == 0 && this.requestConsRejectedList.length == 0 && this.requestInfoRejectedList.length == 0; 

        this.sortLists();

    }

    sortLists() {
        if(this.requestResPendingList.length != 0) {
            this.requestResPendingList = this.sortSingleListReverse(this.requestResPendingList);
        }
        if(this.requestAccPendingList.length != 0) {
            this.requestAccPendingList = this.sortSingleListReverse(this.requestAccPendingList);
        }
        if(this.requestConsPendingList.length != 0) {
            this.requestConsPendingList = this.sortSingleListReverse(this.requestConsPendingList);
        }
        if(this.requestInfoPendingList.length != 0) {
            this.requestInfoPendingList = this.sortSingleListReverse(this.requestInfoPendingList);
        }
        if(this.requestResAcceptedList.length != 0) {
            this.requestResAcceptedList = this.sortSingleList(this.requestResAcceptedList);
        }
        if(this.requestAccAcceptedList.length != 0) {
            this.requestAccAcceptedList = this.sortSingleList(this.requestAccAcceptedList);
        }
        if(this.requestConsAcceptedList.length != 0) {
            this.requestConsAcceptedList = this.sortSingleList(this.requestConsAcceptedList);
        }
        if(this.requestInfoAcceptedList.length != 0) {
            this.requestInfoAcceptedList = this.sortSingleList(this.requestInfoAcceptedList);
        }
        if(this.requestResRejectedList.length != 0) {
            this.requestResRejectedList = this.sortSingleList(this.requestResRejectedList);
        }
        if(this.requestAccRejectedList.length != 0) {
            this.requestAccRejectedList = this.sortSingleList(this.requestAccRejectedList);
        }
        if(this.requestConsRejectedList.length != 0) {
            this.requestConsRejectedList = this.sortSingleList(this.requestConsRejectedList);
        }
        if(this.requestInfoRejectedList.length != 0) {
            this.requestInfoRejectedList = this.sortSingleList(this.requestInfoRejectedList);
        }
    }

    sortSingleList(data: Request[]) {
        return data.sort((a, b) => {
            return <any>new Date(b.dateTimeStart) - <any>new Date(a.dateTimeStart);
        });
    }

    sortSingleListReverse(data: Request[]) {
        return data.sort((a, b) => {
            return <any>new Date(a.dateTimeStart) - <any>new Date(b.dateTimeStart);
        });
    }

    onTabSelected(tabIndex: number) {
        this.loadRequestList();
        this.tabIndex=tabIndex;
        this.tabgroup.selectedIndex=tabIndex;
    }

    async onQrScanEvent() {

    }

    async onToggleFilters() {
        let dialogResponse: EmployeeFiltersDialogData = await this._dialog.open(EmployeeFiltersDialogComponent, {
            width: '350px',
            panelClass: 'custom-dialog-container',
            data: {
                filterData: this.filterData,
                company: this.currCompany,
                people: this.people
            }
        }).afterClosed().toPromise();
        if (dialogResponse) {
            this.filterData = dialogResponse;
            this.checkFiltersTabVisible();
            this.loadRequestList();
        }
    }

    checkFiltersTabVisible() {
        if(this.filterData.dataSelected || this.filterData.justificativeSelected || this.filterData.userSelected) {
            this.tabFiltersVisible = true;
        }
        else this.tabFiltersVisible = false;
    }

    async onRemoveFilter(filter: string) {
        if(filter == "data") {
            this.filterData.dataSelected = false;
        }
        else if(filter == "justificative") {
            this.filterData.justificativeSelected = false;
        }
        else if(filter == "user") {
            this.filterData.userSelected = false;
        }
        this.checkFiltersTabVisible();
        this.loadRequestList();
    }

    getOnlyData(date: Date) {
        return this._common.dateDisplayFormat(date);
    }

    onBack() {
        this.router.navigate(["home"]);
    }

}
