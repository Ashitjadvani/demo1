import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Company, Scope } from 'projects/fe-common/src/lib/models/company';
import { ACCESS_CONTROL_LEVEL, Person} from 'projects/fe-common/src/lib/models/person';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { UserCapabilityService } from '../../services/user-capability.service';
import { TranslateService } from '@ngx-translate/core';
import { Action, ColumnTemplate } from '../../components/table-data-view/table-data-view.component';
import { MatDialog } from '@angular/material/dialog';
import { GenerateAccessControlQrCodeDialogComponent } from '../sites-page/generate-access-control-qrcode-dialog/generate-access-control-qrcode-dialog.component';
import { ACCESS_CONTROL_LIMIT_TYPE, CustomACQrCode} from 'projects/fe-common/src/lib/models/custom-access-control-qr-code';
import { DatePipe } from '@angular/common';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AccessControlLog, ACLOG_TYPE } from 'projects/fe-common/src/lib/models/access-control-log';
import { I } from '@angular/cdk/keycodes';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { arraysAreNotAllowedMsg } from '@ngrx/store/src/models';
import { ViewAccessControlQrCodeDialogComponent } from './view-access-control-qrcode-dialog/view-access-control-qrcode-dialog.component';
import { AccessControlLogFilterDialogComponent } from './access-control-log-filter-dialog/access-control-log-filter-dialog.component';
import { async } from '@angular/core/testing';
import { identifierModuleUrl } from '@angular/compiler';
import { UserACQrCode} from 'projects/fe-common/src/lib/models/user-access-control-qr-code';
import { SendAccessControlQrCodeDialogComponent } from './send-access-control-qrcode-dialog/send-access-control-qrcode-dialog.component';
import { ViewCustomAccessControlQrCodeDialogComponent } from './view-custom-access-control-qrcode-dialog/view-custom-access-control-qrcode-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { loadMandatoryFields } from '../../features/recruiting/store/actions';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'app-access-control-page',
    templateUrl: './access-control-page.component.html',
    styleUrls: ['./access-control-page.component.scss'],
    providers: [
        //{ provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } }
    ]
})


export class AccessControlPageComponent implements OnInit {

    datePipe: DatePipe = new DatePipe('it-IT');
    userAccount: Person;
    sites: Site[];
    people: Person[];
    accessListTableData: AccessControlLog[] = new Array();
    qrCodesTableData: CustomACQrCode[] = new Array();
    qrCodesTableDataTransformed: any[] = new Array();
    qrCodesTableDataTransform: any[] = new Array();
    qrCodesUserTableData: UserACQrCode[] = new Array();
    qrCodesUserTableDataTransformed: any[] = new Array();
    qrCodesUserTableDataTransform: any[] = new Array();
    gatesTableData: any = new Array();

    filterByGate: boolean = false;
    filterByDate: boolean = false;
    filterBySite: boolean = false;

    selectedGatesId: string[] = new Array();
    selectedDateStart: Date = new Date();
    selectedDateEnd: Date = new Date();
    selectedSiteId: string = '';

    now = new Date();

    accessListTableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('ACCESS_CONTROL.LogType'), columnName: 'Type', columnDataField: 'logType', columnFormatter: null, columnRenderer: 'logTypeRenderer', columnTooltip: 'logTypeTooltip', context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Site'), columnName: 'Site', columnDataField: 'siteId', columnFormatter: null, columnRenderer: 'siteRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Gate'), columnName: 'Gate', columnDataField: 'centralUnitId', columnFormatter: null, columnRenderer: 'gateRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Timestamp'), columnName: 'Time', columnDataField: 'timestamp', columnFormatter: null, columnRenderer: 'dateRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Surname'), columnName: 'Surname', columnDataField: 'surname', columnFormatter: null, columnRenderer: 'surnameRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Name'), columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: 'nameRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Scope'), columnName: 'Scope', columnDataField: '', columnFormatter: null, columnRenderer: 'scopeRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Valid'), columnName: 'Valid', columnDataField: 'valid', columnFormatter: null, columnRenderer: 'validRenderer', columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    accessListTableRowActions: Action[] = [
        { tooltip: this.translate.instant('ACCESS_CONTROL.ViewLogQrCode'), image: null, icon: 'visibility', color: '#000000', action: 'onViewLogQrCode', context: this}
    ]

    accessListTableMainActions: Action[] = [
        { tooltip: this.translate.instant('ACCESS_CONTROL.Reload'), image: null, icon: 'sync', color: '#ffffff', action: 'refreshLogs', context: this },
        { tooltip: this.translate.instant('ACCESS_CONTROL.Filter'), image: null, icon: 'filter_alt', color: '#ffffff', action: 'onFilter', context: this },
    ]

    gatesTableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Gate'), columnName: 'Gate', columnDataField: 'name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Site'), columnName: 'Site', columnDataField: 'site', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: 'Online', columnName: 'Online', columnDataField: 'online', columnFormatter: null, columnRenderer: 'onlineRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.LastCheck'), columnName: 'LastConnection', columnDataField: 'lastcall', columnFormatter: null, columnRenderer: 'lastCallRenderer', columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    gatesTableRowActions: Action[] = [
        { tooltip: this.translate.instant('ACCESS_CONTROL.Open'), image: null, icon: 'lock_open', color: '#000000', action: 'onActivateRing', context: this }
    ]

    gatesTableMainActions: Action[] = [
        { tooltip: this.translate.instant('ACCESS_CONTROL.Reload'), image: null, icon: 'sync', color: '#ffffff', action: 'refreshGates', context: this },
    ]


    qrCodesTableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Surname'), columnName: 'Surname', columnDataField: 'surname', columnFormatter: null, columnRenderer: 'bSurnameRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Name'), columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: 'bNameRenderer', columnTooltip: null, context: this },
        { columnCaption: "Email", columnName: 'Email', columnDataField: 'email', columnFormatter: null, columnRenderer: 'emailRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Type'), columnName: 'BadgeType', columnDataField: 'type', columnFormatter: null, columnRenderer: 'typeRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Start Date'), columnName: 'StartDate', columnDataField: 'startDate', columnFormatter: null, columnRenderer: 'startDateRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.End Date'), columnName: 'EndDate', columnDataField: 'endDate', columnFormatter: null, columnRenderer: 'endDateRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Uses Number'), columnName: 'LimitNumber', columnDataField: 'limitNumber', columnFormatter: null, columnRenderer: 'useNumRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.State'), columnName: 'Blocked', columnDataField: 'blocked', columnFormatter: null, columnRenderer: 'activeRendererCustom', columnTooltip: 'activeTooltipCustom', context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, grow: '1.5',context: this }
    ]

    qrCodesTableRowActions: Action[] = [
        { tooltip: this.translate.instant('ACCESS_CONTROL.ViewQrCode'), image: null, icon: 'visibility', color: '#000000', action: 'onViewQrCode', context: this },
        { tooltip: this.translate.instant('ACCESS_CONTROL.RenewQrCode'), image: null, icon: 'autorenew', color: '#000000', action: 'onRenewQrCode', context: this },
        { tooltip: this.translate.instant('ACCESS_CONTROL.Block'), image: null, icon: 'block', color: '#FF0000', action: 'onBlockQrCode', context: this },
        { tooltip: this.translate.instant('ACCESS_CONTROL.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteQrCode', context: this }
    ]

    qrCodesTableMainActions: Action[] = [
        { tooltip: this.translate.instant('ACCESS_CONTROL.Reload'), image: null, icon: 'sync', color: '#ffffff', action: 'refreshQrCodes', context: this },
        { tooltip: this.translate.instant('ADMIN DIALOGS.GENERATEQRCODE'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onGenerateQrCode', context: this },
    ]

    qrCodesUserTableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Surname'), columnName: 'Surname', columnDataField: 'surname', columnFormatter: null, columnRenderer: 'bSurnameRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Name'), columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: 'bNameRenderer', columnTooltip: null, context: this },
        { columnCaption: "Email", columnName: 'Email', columnDataField: 'email', columnFormatter: null, columnRenderer: 'emailRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Type'), columnName: 'BadgeType', columnDataField: 'type', columnFormatter: null, columnRenderer: 'typeRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Start Date'), columnName: 'StartDate', columnDataField: 'startDate', columnFormatter: null, columnRenderer: 'startDateRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.End Date'), columnName: 'EndDate', columnDataField: 'endDate', columnFormatter: null, columnRenderer: 'endDateRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Uses Number'), columnName: 'LimitNumber', columnDataField: 'limitNumber', columnFormatter: null, columnRenderer: 'useNumRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.Scope'), columnName: 'Scope', columnDataField: 'scope', columnFormatter: null, columnRenderer: 'qrCodeScopeRenderer', columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('ACCESS_CONTROL.State'), columnName: 'Blocked', columnDataField: 'blocked', columnFormatter: null, columnRenderer: 'activeRenderer', columnTooltip: 'activeTooltip',context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    qrCodesUserTableRowActions: Action[] = [
        { tooltip: this.translate.instant('ACCESS_CONTROL.ViewQrCode'), image: null, icon: 'visibility', color: '#000000', action: 'onViewUserQrCode', context: this },
        { tooltip: this.translate.instant('ACCESS_CONTROL.Block'), image: null, icon: 'block', color: '#FF0000', action: 'onBlockUserQrCode', context: this }
    ]

    qrCodesUserTableMainActions: Action[] = [
        { tooltip: this.translate.instant('ACCESS_CONTROL.Reload'), image: null, icon: 'sync', color: '#ffffff', action: 'refreshUserQrCodes', context: this }
    ]



    constructor(private adminUserManagementService: AdminUserManagementService,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        public translate: TranslateService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private userCapabilityService: UserCapabilityService) {
    }

    async ngOnInit() {
        this.filterByDate = true;
        this.selectedDateStart = new Date();
        this.selectedDateEnd = new Date();

        this.userAccount = this.userManagementService.getAccount();
        await this.getSites();
        let peopleRes = await this.adminUserManagementService.getPeople(this.userAccount.companyId);
        if(peopleRes) this.people = peopleRes.people;
        await this.getLogs();
        await this.getCodes();
        await this.getUserCodes();
        await this.getGates();
        /*let res = await this.adminUserManagementService.getUserKeys(this.userAccount.id);
        console.log(res);*/
    }

    async getSites() {
        let siteRes = await this.adminSiteManagementService.getSites(this.userAccount.companyId);
        if(siteRes) this.sites = siteRes.sites;
        for(let ssite of this.sites) {
            await this.adminSiteManagementService.getAccessControlCentralUnits(ssite.id);
        }
    }

    async onViewQrCode(code: any) {
        let qrCode = this.qrCodesTableData.find(c => c.id == code.id);
        let result = await this.dialog.open(ViewCustomAccessControlQrCodeDialogComponent, {
            width: '1300px',
            panelClass: 'custom-dialog-container',
            data: {
                sites: this.sites,
                qrcode: qrCode
            }
        }).afterClosed().toPromise();
        await this.getCodes();
    }

    async onRenewQrCode(code: any) {
        let qrCode = this.qrCodesTableData.find(c => c.id == code.id);
        let codeEndDate = new Date(qrCode.codeData.endDate);
        let codeStartDate = new Date(qrCode.codeData.startDate);
        let dateGap = (codeEndDate.getTime() - codeStartDate.getTime())/(1000*60*60*24);
        let newCodeStartDate = new Date(codeEndDate);
        let newCodeEndDate = new Date();
        newCodeEndDate.setDate(newCodeStartDate.getDate()+dateGap);
        qrCode.codeData.startDate = newCodeStartDate;
        qrCode.codeData.endDate = newCodeEndDate;
        let result = await this.dialog.open(GenerateAccessControlQrCodeDialogComponent, {
            width: '1100px',
            panelClass: 'custom-dialog-container',
            data: {
                sites: this.sites,
                codeData: qrCode.codeData
            }
        }).afterClosed().toPromise();
        setTimeout(()=>{ this.getCodes() },500);
    }

    async onViewUserQrCode(code: any) {
        let qrCode = this.qrCodesUserTableData.find(c => c.id == code.id);
        let result = await this.dialog.open(ViewAccessControlQrCodeDialogComponent, {
            width: '1300px',
            panelClass: 'custom-dialog-container',
            data: {
                sites: this.sites,
                qrcode: qrCode
            }
        }).afterClosed().toPromise();
    }

    async refreshLogs() {
        this.getLogs();
        //await this.adminSiteManagementService.readAccessControlLogs();
        //setTimeout(()=>{ this.getLogs(); }, 2000);
    }

    async refreshGates() {
        await this.getSites();
        this.getGates();
        setTimeout(async ()=>{
            await this.getSites();
            this.getGates(); }, 1500);
    }

    async refreshQrCodes() {
        await this.getCodes();
    }

    async refreshUserQrCodes() {
        await this.getUserCodes();
    }

    async getLogs() {
        this.accessListTableData = new Array();
        let res = null;
        let tempStart = new Date(this.selectedDateStart);
        let tempEnd = new Date(this.selectedDateEnd);
        tempEnd.setDate(tempEnd.getDate()+1);
        if(this.filterByDate && this.filterByGate) {
            res = await this.adminSiteManagementService.listAccessControlLogsByUnitAndDate(
                this.selectedGatesId,
                this.commonService.toYYYYMMDDv2(tempStart),
                this.commonService.toYYYYMMDDv2(tempEnd)
            );
        }
        else if(this.filterByDate && this.filterBySite) {
            res = await this.adminSiteManagementService.listAccessControlLogsBySiteAndDate(
                this.selectedSiteId,
                this.commonService.toYYYYMMDDv2(tempStart),
                this.commonService.toYYYYMMDDv2(tempEnd)
            );
        }
        else if(this.filterByDate) {
            res = await this.adminSiteManagementService.listAccessControlLogsByDate(
                this.commonService.toYYYYMMDDv2(tempStart),
                this.commonService.toYYYYMMDDv2(tempEnd)
            );
        }
        else if(this.filterBySite) {
            res = await this.adminSiteManagementService.listAccessControlLogsBySite(
                this.selectedSiteId
            );
        }
        else if(this.filterByGate) {
            res = await this.adminSiteManagementService.listAccessControlLogsByUnit(
                this.selectedGatesId
            );
        }
        if(res){
            this.accessListTableData = res.logs;
        }
        this.sortArray();
    }


    sortArray() {
        this.accessListTableData.sort(function(a,b){ //ordina per data
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
    }

    sortUserQrCodes() {
        this.qrCodesUserTableDataTransform.sort(function(a,b){ //ordina per data
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
    }

    sortCustomQrCodes() {
        this.qrCodesTableDataTransform.sort(function(a,b){ //ordina per data
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
    }

    sortGates() {
        this.gatesTableData.sort(function(a,b){ //ordina per data
            let aDate = new Date(a.lastcall);
            let bDate = new Date(b.lastcall);
            if(((aDate.getFullYear()==1970) != (bDate.getFullYear()==1970))) return aDate.getFullYear() == 1970 ? 1 : -1;
            return aDate.getTime() - bDate.getTime();
        });
    }

    async getGates() {
        let now = new Date();
        now.setHours(now.getHours()-3);
        this.gatesTableData = new Array();
        for(let ssite of this.sites) {
            if(ssite.accessControlEnable && ssite.accessControlPassages) {
                for(let passage of ssite.accessControlPassages) {
                    let online = false;
                    let centralUnitId = passage.centralUnitId;
                    let centralUnit = ssite.availableAccessControlCentralUnits.find(cu => cu.centralUnitId == centralUnitId);
                    let lastCallDate = new Date(centralUnit.lastConnection);
                    if(lastCallDate.getTime()>now.getTime()) online = true;
                    this.gatesTableData.push({
                        name: passage.name,
                        site: ssite.name,
                        online: online,
                        lastcall: lastCallDate,
                        id: passage.centralUnitId
                    })
                }
            }
        }
        this.sortGates();
    }

    async onActivateRing(passage: any) {
        await this.adminSiteManagementService.activateAccessControlRing(passage.id);
    }

    async getCodes() {
        this.qrCodesTableData = new Array();
        this.qrCodesTableDataTransformed = new Array();
        this.qrCodesTableDataTransform = new Array();
        let res = await this.adminUserManagementService.listCustomAccessControlQrCode();
        if(res) this.qrCodesTableData = res.customQrCodes;
        for(let qrcode of this.qrCodesTableData) {
            this.qrCodesTableDataTransform.push({
                id: qrcode.id,
                name: qrcode.codeData.name,
                surname: qrcode.codeData.surname,
                email: qrcode.codeData.email,
                type: qrcode.codeData.type,
                startDate: qrcode.codeData.startDate,
                endDate: qrcode.codeData.endDate,
                blocked: qrcode.blocked,
                limitNumber: qrcode.codeData.limitNumber,
                limitType: qrcode.codeData.limitType,
                autoRenew: qrcode.autoRenew,
                renewDone: qrcode.renewDone
            });
        }
        this.qrCodesTableDataTransformed = this.qrCodesTableDataTransform;
        this.sortCustomQrCodes();
    }

    async getUserCodes() {
        this.qrCodesUserTableData = new Array();
        this.qrCodesUserTableDataTransformed = new Array();
        this.qrCodesUserTableDataTransform = new Array();
        let res = await this.adminUserManagementService.listUserAccessControlQrCode();
        if(res) this.qrCodesUserTableData = res.userQrCodes;
        for(let qrcode of this.qrCodesUserTableData) {
            this.qrCodesUserTableDataTransform.push({
                id: qrcode.id,
                name: qrcode.codeData.name,
                surname: qrcode.codeData.surname,
                email: qrcode.codeData.email,
                type: qrcode.codeData.type,
                startDate: qrcode.codeData.startDate,
                endDate: qrcode.codeData.endDate,
                blocked: qrcode.blocked,
                limitNumber: qrcode.codeData.limitNumber,
                limitType: qrcode.codeData.limitType,
                idutente: qrcode.codeData.idutente,
                number: qrcode.codeData.number,
                scope: this.qrCodeGetScope(qrcode)
            });
        }
        this.qrCodesUserTableDataTransformed = this.qrCodesUserTableDataTransform;
        this.sortUserQrCodes();
    }

    async onReloadLogs() {
        await this.getLogs();
    }

    async onFilter() {
        let result = await this.dialog.open(AccessControlLogFilterDialogComponent, {
            width: '620px',
            panelClass: 'custom-dialog-container',
            data: {
                sites: this.sites,
                gates: this.gatesTableData,

                filterByGate: this.filterByGate,
                filterByDate: this.filterByDate,
                filterBySite: this.filterBySite,
                selectedGatesId: this.selectedGatesId,
                selectedDateStart: this.selectedDateStart,
                selectedDateEnd: this.selectedDateEnd,
                selectedSiteId: this.selectedSiteId
            }
        }).afterClosed().subscribe(async(result) => {
            if (result) {
                this.filterByGate = result.filterByGate;
                this.filterBySite = result.filterBySite;
                this.filterByDate = result.filterByDate;
                this.selectedDateStart = result.selectedDateStart;
                this.selectedDateEnd = result.selectedDateEnd;
                this.selectedGatesId = result.selectedGatesId;
                this.selectedSiteId = result.selectedSiteId;
                await this.getLogs();
            }
        });
    }


    async onGenerateQrCode() {
        let result = await this.dialog.open(GenerateAccessControlQrCodeDialogComponent, {
            width: '1100px',
            panelClass: 'custom-dialog-container',
            data: {
                sites: this.sites
            }
        }).afterClosed().toPromise();
        setTimeout(()=>{ this.getCodes() },500);
    }

    async onDeleteQrCode(code: any) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ACCESS_CONTROL.ToolTipDeleteQrCode') + " "+code.name+ " "+code.surname, this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if(res) {
            let res = await this.adminUserManagementService.deleteCustomAccessControlQrCode(code.id);
            await this.getCodes();
        }
    }

    dateFormatter(fieldValue: any) {
        try {
            return this.datePipe.transform(new Date(fieldValue), 'dd/MM/yyyy HH:mm');
        } catch(ex) {
            console.error('dateFormatter exception: ', ex);
        }

        return '#NA'
    }

    gateFormatter(fieldValue: any) {
        try {
            if(this.sites) {
                for(let site of this.sites) {
                    if(site.accessControlPassages) {
                        for(let gate of site.accessControlPassages) {
                            if(gate.centralUnitId == fieldValue) return gate.name;
                        }
                    }
                }
            }
            return fieldValue;
        } catch(ex) {
            console.error('gateFormatter exception: ', ex);
        }

        return '#NA'
    }

    limitNumFormatter(fieldValue: any) {
        try {
            if(fieldValue.limitType==ACCESS_CONTROL_LIMIT_TYPE.NUMBER) return fieldValue.limitNumber;
            else return "";
        } catch(ex) {
            console.error('limitNumFormatter exception: ', ex);
        }

        return '#NA'
    }

    typeFormatter(fieldValue: any) {
        try {
            if(fieldValue==ACCESS_CONTROL_LEVEL.PASSEPARTOUT) return "Passepartout";
            else if(fieldValue==ACCESS_CONTROL_LEVEL.SINGLE_PASSAGES) return this.translate.instant('ACCESS_CONTROL.Single Gates');
            else if(fieldValue==ACCESS_CONTROL_LEVEL.GROUP) return this.translate.instant('ACCESS_CONTROL.Gates Groups');
        } catch(ex) {
            console.error('typeFormatter exception: ', ex);
        }

        return '#NA'
    }

    async onBlockQrCode(qrcode: any) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ACCESS_CONTROL.ToolTipBlockQrCode') + " "+qrcode.name+ " "+qrcode.surname, this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if(res) {
            await this.adminUserManagementService.blockCustomAccessControlQrCode(qrcode.id);
            setTimeout(()=>{ this.getCodes() },500);
        }

    }

    async onBlockUserQrCode(qrcode: any) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ACCESS_CONTROL.ToolTipBlockQrCode') + " "+qrcode.name+ " "+qrcode.surname, this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if(res) {
            await this.adminUserManagementService.blockUserAccessControlQrCode(qrcode.id);
            setTimeout(()=>{ this.getUserCodes() },500);
        }
    }

    activeRenderer(item: any) {
        try {
            if(item.blocked) {
                return "<i class=\"material-icons red\" >block</i>";
            }
            if(this.checkExpired(new Date(item.endDate))) {
                return "<i class=\"material-icons yellow\" >history</i>";
            }
            return "<i class=\"material-icons green\">done</i>";

        } catch (ex) {
            console.error('activeRenderer exception: ', ex);
        }

        return '';
    }

    onlineRenderer(item: any) {
        try {
            if(item.online) {
                return '<span class="dot green-bkg"></span>';
            }
            return '<span class="dot red-bkg"></span>';

        } catch (ex) {
            console.error('onlineRenderer exception: ', ex);
        }

        return '';
    }

    onlineTooltip(item: any) {
        try {
            return this.translate.instant('ACCESS_CONTROL.LastConnection') + ": "+ this.datePipe.transform(new Date(item.lastcall), 'dd/MM/yyyy HH:mm:ss')

        } catch (ex) {
            console.error('onlineTooltip exception: ', ex);
        }

        return '';
    }

    activeRendererCustom(item: any) {
        try {
            let start = "";
            if(item.blocked) {
                start = "<i class=\"material-icons red\" >block</i>";
            }
            else if(this.checkExpired(new Date(item.endDate))) {
                start = "<i class=\"material-icons yellow\" >history</i>";
            }
            else {
                start = "<i class=\"material-icons green\">done</i>";
            }

            if(item.renewDone) {
                return start+"<i class=\"material-icons grey\" >autorenew</i>";
            }
            else if(item.autoRenew) {
                return start+"<i class=\"material-icons\" >autorenew</i>";
            }
            return start;

        } catch (ex) {
            console.error('activeRenderer exception: ', ex);
        }

        return '';
    }

    activeTooltip(item: any) {
        try {
            if(item.blocked) {
                return this.translate.instant('ACCESS_CONTROL.Blocked');
            }
            if(this.checkExpired(new Date(item.endDate))) {
                return this.translate.instant('ACCESS_CONTROL.Expired');
            }
            return this.translate.instant('ACCESS_CONTROL.Active');

        } catch (ex) {
            console.error('activeTooltip exception: ', ex);
        }

        return '';
    }

    activeTooltipCustom(item: any) {
        try {
            let start = "";
            if(item.blocked) {
                start = this.translate.instant('ACCESS_CONTROL.Blocked');
            }
            else if(this.checkExpired(new Date(item.endDate))) {
                start = this.translate.instant('ACCESS_CONTROL.Expired');
            }
            else {
                start = this.translate.instant('ACCESS_CONTROL.Active');
            }

            if(item.renewDone) {
                return start+" - "+this.translate.instant('ACCESS_CONTROL.AutoRenewDoneTooltip');
            }
            else if(item.autoRenew) {
                return start+" - "+this.translate.instant('ACCESS_CONTROL.AutoRenewTooltip');
            }
            return start;

        } catch (ex) {
            console.error('activeTooltip exception: ', ex);
        }

        return '';
    }

    logTypeTooltip(item: any) {
        try {
            return item.logType;
        } catch (ex) {
            console.error('logTypeTooltip exception: ', ex);
        }

        return "";
    }

    validRenderer(item: any) {
        try {
            if(item.valid==true) {
                return "<i class=\"material-icons green\">done</i>";
            }
            else if(item.valid==false) {
                return "<i class=\"material-icons red\">close</i>";
            }
        } catch (ex) {
            console.error('validRenderer exception: ', ex);
        }

        return "<i class=\"material-icons green\">done</i>";
    }

    logTypeRenderer(item: any) {
        try {
            if(item.logType==ACLOG_TYPE.BEACON) {
                if(item.valid==true) {
                    return "<i class=\"material-icons green\">contactless</i>";
                }
                else {
                    return "<i class=\"material-icons red\">contactless</i>";
                }
            }
            else if(item.logType==ACLOG_TYPE.RING) {
                if(item.valid==true) {
                    return "<i class=\"material-icons green\">touch_app</i>";
                }
                else {
                    return "<i class=\"material-icons red\">touch_app</i>";
                }
            }
            else if(item.logType==ACLOG_TYPE.QRCODE) {
                if(item.valid==true) {
                    return "<i class=\"material-icons green\">qr_code_scanner</i>";
                }
                else {
                    return "<i class=\"material-icons red\">qr_code_scanner</i>";
                }
            }
        } catch (ex) {
            console.error('logTypeRenderer exception: ', ex);
        }

        return "";
    }

    gateRenderer(item: any) {
        try {
            if(this.sites) {
                for(let site of this.sites) {
                    if(site.accessControlPassages) {
                        for(let gate of site.accessControlPassages) {
                            if(gate.centralUnitId == item.centralUnitId) {
                                return this.colorRender(item.valid, gate.name);
                            }
                        }
                    }
                }
            }
            return this.colorRender(item.valid, item.centralUnitId);
        } catch(ex) {
            console.error('gateFormatter exception: ', ex);
        }

        return '#NA'
    }

    dateRenderer(item: any) {
        try {
            return this.colorRender(item.valid, this.datePipe.transform(new Date(item.timestamp), 'dd/MM/yyyy HH:mm:ss'));
        } catch(ex) {
            console.error('dateFormatter exception: ', ex);
        }

        return '#NA'
    }

    lastCallRenderer(item: any) {
        try {
            let lastcall = new Date(item.lastcall);
            if(lastcall.getFullYear()==1970) return '-';
            return this.datePipe.transform(new Date(item.lastcall), 'dd/MM/yyyy HH:mm:ss');
        } catch(ex) {
            console.error('lastCallRenderer exception: ', ex);
        }

        return ''
    }

    colorRender(valid: boolean, value: String) {
        if(valid) return "<div class=\"green\">"+value+"</div>";
        return "<div class=\"red\">"+value+"</div>";
    }

    bColorRender(blocked: Boolean, expired: Boolean, value: String) {
        if(blocked) return "<div class=\"red small\">"+value+"</div>";
        else if(expired) return "<div class=\"yellow small\">"+value+"</div>";
        return "<div class=\"green small\">"+value+"</div>";
    }

    nameRenderer(item: any) {
        try {
            return this.colorRender(item.valid, item.name);
        } catch(ex) {
            console.error('nameRenderer exception: ', ex);
        }

        return '#NA'
    }

    surnameRenderer(item: any) {
        try {
            return this.colorRender(item.valid, item.surname);
        } catch(ex) {
            console.error('surnameRenderer exception: ', ex);
        }

        return '#NA'
    }

    siteRenderer(item: any) {
        try {
            let siteName = '';
            if(item.siteId) {
                let site = this.sites.find(site => site.id == item.siteId);
                if(site) siteName = site.name;
            }
            return this.colorRender(item.valid, siteName);
        } catch(ex) {
            console.error('siteRenderer exception: ', ex);
        }

        return ''
    }

    scopeRenderer(item: any) {
        try {
            let scopeName = '';
            let person: Person = null;
            if(this.people.find(person => person.id == item.number)) {
                person = this.people.find(person => person.id == item.number);
                scopeName = person.scope;
            }
            else if(this.people.find(person => person.id == item.idutente)) {
                person = this.people.find(person => person.id == item.idutente);
                scopeName = person.scope;
            }
            else if(this.qrCodesTableData.find(qrcode => qrcode.codeData.name== item.name && qrcode.codeData.surname == item.surname && qrcode.codeData.email == item.email)) {
                let code = this.qrCodesTableData.find(qrcode => qrcode.codeData.name== item.name && qrcode.codeData.surname == item.surname && qrcode.codeData.email == item.email);
                if(code.codeData.notes!="") scopeName = code.codeData.notes;
                else scopeName = code.codeData.number;
            }
            return this.colorRender(item.valid, scopeName);
        } catch(ex) {
            console.error('scopeRenderer exception: ', ex);
        }

        return ''
    }

    qrCodeGetScope(item: any) {
        try {
            let scopeName = '';
            let person: Person = null;
            if(this.people.find(person => person.id == item.codeData.idutente)) {
                person = this.people.find(person => person.id == item.codeData.idutente);
                scopeName = person.scope;
            }
            else if(this.people.find(person => person.id == item.codeData.number)) {
                person = this.people.find(person => person.id == item.codeData.number);
                scopeName = person.scope;
            }
            return scopeName;
        } catch(ex) {
            console.error('qrCodeGetScope exception: ', ex);
        }

        return ''
    }

    qrCodeScopeRenderer(item: any) {
        try {
            try {
                return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), item.scope);
            } catch(ex) {
                console.error('qrCodeScopeRenderer exception: ', ex);
            }
            return '#NA'

        } catch(ex) {
            console.error('qrCodeScopeRenderer exception: ', ex);
        }
        return ''
    }

    checkExpired(date: Date) {
        try {
            if(date.getTime()<this.now.getTime()) return true;
            return false;
        } catch(ex) {
            console.error('checkExpired exception: ', ex);
        }

        return false;
    }


    typeRenderer(item: any) {
        try {
            try {
                if(item.type==ACCESS_CONTROL_LEVEL.PASSEPARTOUT) return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), "Passepartout");
                else if(item.type==ACCESS_CONTROL_LEVEL.SINGLE_PASSAGES) return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), this.translate.instant('ACCESS_CONTROL.Single Gates'));
                else if(item.type==ACCESS_CONTROL_LEVEL.GROUP) return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), this.translate.instant('ACCESS_CONTROL.Gates Groups'));
            } catch(ex) {
                console.error('typeRenderer exception: ', ex);
            }
            return '#NA'

        } catch(ex) {
            console.error('typeRenderer exception: ', ex);
        }
        return ''
    }

    bNameRenderer(item: any) {
        try {
            try {
                return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), item.name);
            } catch(ex) {
                console.error('bNameRenderer exception: ', ex);
            }
            return '#NA'

        } catch(ex) {
            console.error('bNameRenderer exception: ', ex);
        }
        return ''
    }

    bSurnameRenderer(item: any) {
        try {
            try {
                return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), item.surname);
            } catch(ex) {
                console.error('bSurnameRenderer exception: ', ex);
            }
            return '#NA'

        } catch(ex) {
            console.error('bSurnameRenderer exception: ', ex);
        }
        return ''
    }

    emailRenderer(item: any) {
        try {
            try {
                return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), item.email);
            } catch(ex) {
                console.error('emailRenderer exception: ', ex);
            }
            return '#NA'

        } catch(ex) {
            console.error('emailRenderer exception: ', ex);
        }
        return ''
    }

    startDateRenderer(item: any) {
        try {
            try {
                return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), this.dateFormatter(item.startDate));
            } catch(ex) {
                console.error('startDateRenderer exception: ', ex);
            }
            return '#NA'

        } catch(ex) {
            console.error('startDateRenderer exception: ', ex);
        }
        return ''
    }

    endDateRenderer(item: any) {
        try {
            try {
                return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), this.dateFormatter(item.endDate));
            } catch(ex) {
                console.error('endDateRenderer exception: ', ex);
            }
            return '#NA'

        } catch(ex) {
            console.error('endDateRenderer exception: ', ex);
        }
        return ''
    }

    useNumRenderer(item: any) {
        try {
            try {
                if(item.limitType==ACCESS_CONTROL_LIMIT_TYPE.INFINITE) return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), this.translate.instant('ACCESS_CONTROL.Infinite'));
                else if(item.limitType==ACCESS_CONTROL_LIMIT_TYPE.ONCE) return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), "1");
                return this.bColorRender(item.blocked, this.checkExpired(new Date(item.endDate)), item.limitNumber.toString());
            } catch(ex) {
                console.error('useNumRenderer exception: ', ex);
            }
            return '#NA'

        } catch(ex) {
            console.error('useNumRenderer exception: ', ex);
        }
        return ''
    }

    AccessListFunctionAvailable() {
        return this.userCapabilityService.isFunctionAvailable('AccessControl/AccessList');
    }
    ExternalBadgeFunctionAvailable() {
        return this.userCapabilityService.isFunctionAvailable('AccessControl/ExternalBadge');
    }
    UserBadgeFunctionAvailable() {
        return this.userCapabilityService.isFunctionAvailable('AccessControl/UserBadge');
    }
    GatesFunctionAvailable() {
        return this.userCapabilityService.isFunctionAvailable('AccessControl/Gates');
    }

    async onSendQrCode(code: any) {
        let qrCode = this.qrCodesTableData.find(c => c.id == code.id);
        let result = await this.dialog.open(SendAccessControlQrCodeDialogComponent, {
            width: '350px',
            panelClass: 'custom-dialog-container',
            data: {
                qrcode: qrCode
            }
        }).afterClosed().toPromise();
    }

    async onViewLogQrCode(log: any) {
        let code: any = null;
        let isPerson = false;
        if(this.people.find(person => person.id == log.idutente)) {
            code = this.qrCodesUserTableData.find(qrcode => qrcode.codeData.idutente == log.idutente && !qrcode.blocked && !this.checkExpired(qrcode.codeData.endDate));
            isPerson = true;
        }
        else if(this.people.find(person => person.id == log.number)) {
            code = this.qrCodesUserTableData.find(qrcode => qrcode.codeData.idutente == log.number && !qrcode.blocked && !this.checkExpired(qrcode.codeData.endDate));
            isPerson = true;
        }
        else if(this.qrCodesTableData.find(qrcode => qrcode.codeData.name==log.name && qrcode.codeData.surname==log.surname && qrcode.codeData.email==log.email && !qrcode.blocked && !this.checkExpired(qrcode.codeData.endDate))) {
            code = this.qrCodesTableData.find(qrcode => qrcode.codeData.name==log.name && qrcode.codeData.surname==log.surname && qrcode.codeData.email==log.email && !qrcode.blocked && !this.checkExpired(qrcode.codeData.endDate));
        }
        if(code) {
            if(isPerson) {
                await this.onViewUserQrCode(code);
            }
            else {
                await this.onViewQrCode(code);
            }
        }
        else {
            this.snackBar.open(this.translate.instant('ACCESS_CONTROL.CodeNotFound'), this.translate.instant('GENERAL.OK'), {
                duration: 3000
            });
        }
    }


}
