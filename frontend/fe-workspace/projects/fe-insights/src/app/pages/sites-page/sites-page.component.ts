import { I } from '@angular/cdk/keycodes';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { AccessControlPassage, AccessControlPassageGroup, AvailableAccessControlCentralUnit, Site, SITE_STATE, SITE_TYPE } from 'projects/fe-common/src/lib/models/admin/site';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { UserAccount } from 'projects/fe-common/src/lib/models/user-account';
import { AdminSiteManagementService } from 'projects/fe-common/src/lib/services/admin-site-management.service';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Action, ColumnTemplate } from '../../components/table-data-view/table-data-view.component';
import { UserCapabilityService } from '../../services/user-capability.service';
import { GenerateAccessControlCentralUnitsDialogComponent } from './generate-access-control-centralunits-dialog/generate-access-control-centralunits-dialog.component';
import { GenerateAccessControlQrCodeDialogComponent } from './generate-access-control-qrcode-dialog/generate-access-control-qrcode-dialog.component';
import { ModifyAccessControlGroupDialogComponent } from './modify-access-control-group-dialog/modify-access-control-group-dialog.component';
import { SendAccessControlCommandDialogComponent } from './send-access-control-command-dialog/send-access-control-command-dialog.component';
import { ViewAccessControlCentralUnitsQrCodeDialogComponent } from './view-access-control-centralunits-qrcode-dialog/view-access-control-centralunits-qrcode-dialog.component';
import { ViewAccessControlResponseDialogComponent } from './view-access-control-response-dialog/view-access-control-response-dialog.component';
import { Document } from 'projects/fe-common/src/lib/models/user-document';

@Component({
    selector: 'app-sites-page',
    templateUrl: './sites-page.component.html',
    styleUrls: ['./sites-page.component.scss']
})
export class SitesPageComponent implements OnInit {
    @ViewChild("tabgroup", { static: false }) tabgroup: MatTabGroup;
    @ViewChild("tabgroupmod", { static: false }) tabgroupmod: MatTabGroup;
    @ViewChild('file', { static: true }) file: ElementRef;

    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Key'), columnName: 'Key', columnDataField: 'key', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Name'), columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Status'), columnName: 'Status', columnDataField: 'globalStatus', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        // { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.OfficeReservations'), columnName: 'OfficeReservations', columnDataField: 'reservationCount', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.OfficeIn'), columnName: 'OfficeIn', columnDataField: 'officeInCount', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.OfficeOut'), columnName: 'OfficeOut', columnDataField: 'officeOutCount', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Edit'), image: './assets/images/pencil.svg', icon: null, color: '#000000', action: 'onModifySite', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteSite', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add Site'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddSite', context: this },
        // { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Import Sites'), image: null, icon: 'cloud_upload', color: '#ffffff', action: 'onImportSites', context: this },
    ]

    siteStatus = SITE_STATE;
    availableSiteStatus: any;

    siteTypes = Object.values(SITE_TYPE);

    sites: Site[];
    sitesTableData: any;

    userAccount: Person;
    titleCard: string;
    currentSite: Site = Site.Empty();

    allPeople: Person[];
    people: Observable<Person[]>;
    peopleFC: FormControl = new FormControl();

    selectedPerson: Person;
    selectedAuthMethod: any;
    isModify: boolean;

    allUsers: Person[];

    facilityManagerFC: FormControl = new FormControl();
    facilityManagerUsers: Observable<Person[]>;
    officeManagerFC: FormControl = new FormControl();
    officeManagerUsers: Observable<Person[]>;

    currentFacilityManager: Person;
    currentOfficeManager: Person;

    highlightInvalidPassages: boolean = false;

    viewConnection = false;

    companyDocuments: Document[];

    areaGap1: number = 0.0005;
    areaGap2: number = 0.001;
    areaGap3: number = 0.003;
    areaGap4: number = 0.006;
    areaGap5: number = 0.009;
    areaGap6: number = 0.012;

    constructor(private adminSiteManagementService: AdminSiteManagementService,
        private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        public commonService: CommonService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService,
        private userCapabilityService: UserCapabilityService) {

        this.displaySelectedFacilityManager = this.displaySelectedFacilityManager.bind(this);
        this.displaySelectedOfficeManager = this.displaySelectedOfficeManager.bind(this);
    }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();

        this.availableSiteStatus = Object.values(this.siteStatus); // .filter(s => s != SITE_STATE.RESTRICTED_MODE);

        await this.loadUsers();
        await this.loadSiteList();
    }

    async loadUsers() {
        let res = await this.adminUserManagementService.getPeople(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.allUsers = res.people;
            this.facilityManagerUsers = this.facilityManagerFC.valueChanges.pipe(startWith(''), map(u => this.filterUsers(u)));
            this.officeManagerUsers = this.officeManagerFC.valueChanges.pipe(startWith(''), map(u => this.filterUsers(u)));
        }
    }

    async loadDocuments() {
        let res = await this.adminUserManagementService.getCompanyDocuments(this.currentSite.companyId);
        if (res.result) {
            this.companyDocuments = res.documents;
        }
    }

    filterUsers(value: string) {
        return this.allUsers.filter(u => Person.filterMatch(u, value));
    }

    async loadSiteList() {
        let res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.sites = res.sites;

            let todayYYYYMMDD = this.commonService.toYYYYMMDD(new Date());
            let sitesStats: any[] = await Promise.all(this.sites.map(site => {
                return new Promise(async (resolve, reject) => {
                    let res = await this.adminSiteManagementService.getSitePresenceStatistics(site.key, todayYYYYMMDD, todayYYYYMMDD);
                    if (res.result) {
                        resolve({
                            siteKey: site.key,
                            stats: res.stats[0]
                        });
                    } else {
                        resolve({
                            siteKey: site.key,
                            stats: null
                        });
                    }
                });
            }));

            this.sitesTableData = this.sites.map(site => {
                let siteStats = sitesStats.find(ss => ss.siteKey == site.key);
                return Object.assign({
                    reservationCount: siteStats ? siteStats.stats.resevationCount : -1,
                    officeInCount: siteStats ? siteStats.stats.officeInCount : -1,
                    officeOutCount: siteStats ? siteStats.stats.officeOutCount : -1
                }, site)
            });
        }
    }

    async onAddSite() {
        this.isModify = false;
        this.currentFacilityManager = null;
        this.currentOfficeManager = null;
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add Site');
        this.currentSite = Site.Empty();

        this.tabgroup.selectedIndex = 1;
    }

    async onModifySite(site: Site) {
        this.isModify = true;
        this.currentFacilityManager = this.allUsers.find(u => u.id == site.facilityManagerId);
        this.currentOfficeManager = this.allUsers.find(u => u.id == site.officeManagerId);
        this.titleCard = this.translate.instant('INSIGHTS_PEOPLE_PAGE.Modify Site')+ " " + site.name;
        this.currentSite = site;
        await this.loadDocuments();
        if(!this.currentSite.availableAccessControlCentralUnits) this.currentSite.availableAccessControlCentralUnits = new Array();
        if(!this.currentSite.accessControlPassages) this.currentSite.accessControlPassages = new Array();
        if(!this.currentSite.accessControlPassageGroups) this.currentSite.accessControlPassageGroups = new Array();


        await this.adminSiteManagementService.getAccessControlCentralUnits(this.currentSite.id);

        this.tabgroup.selectedIndex = 1;
    }

    async readAccessControlPassages() {
        await this.loadSiteList();
        let readedSite = this.sites.find(site => site.id == this.currentSite.id);
        this.currentSite.availableAccessControlCentralUnits = readedSite.availableAccessControlCentralUnits;
        this.currentSite.accessControlConnected = readedSite.accessControlConnected;
        await this.adminSiteManagementService.addOrUpdateSite(this.currentSite);
        await this.adminSiteManagementService.getAccessControlCentralUnits(this.currentSite.id);
        await this.loadSiteList();
        this.currentSite = this.sites.find(site => site.id == this.currentSite.id);
        this.viewConnection = false;
    }

    async onTryToConnectClick() {
        await this.adminSiteManagementService.getAccessControlCentralUnits(this.currentSite.id);
        await this.loadSiteList();
        let readedSite = this.sites.find(site => site.id == this.currentSite.id);
        this.currentSite.availableAccessControlCentralUnits = readedSite.availableAccessControlCentralUnits;
        this.currentSite.accessControlConnected = readedSite.accessControlConnected;
        this.viewConnection = true;
    }

    async onDeleteSite(site: Site) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('ADMIN COMPONENTS.ToolTipDeleteSite'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let res = await this.adminSiteManagementService.deleteSite(site.id);
            if (res.result) {
                this.loadSiteList();
            } else
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    onImportSites() {
        if (this.file.nativeElement.files.length > 0) {
            this.file.nativeElement.value = '';
        }
        this.file.nativeElement.click();
    }

    async onUploadFile() {
        let fileChoosen = this.file.nativeElement.files[0];
        if (!fileChoosen)
            return;

        if (fileChoosen.size > (10 * 1024 * 1024)) {
            this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.FILE SIZE BIG'), this.translate.instant('GENERAL.OK'), { duration: 2000 });
            return;
        }

        let file = this.file.nativeElement.files[0];
        await this.adminSiteManagementService.uploadSites(file);

        await this.loadSiteList();
    }


    isEditConfirmEnabled() {
        return this.commonService.isValidField(this.currentSite.key);
    }

    onEditCancelClick() {
        this.tabgroup.selectedIndex = 0;
        this.highlightInvalidPassages = false;
        this.loadSiteList();
    }

    async onEditConfirmClick() {

        let valid = true;
        for(let passage of this.currentSite.accessControlPassages) {
            if(!this.checkValidPassage(passage)) {
                valid = false;
                this.tabgroupmod.selectedIndex = 4;
            }
        }
        for(let group of this.currentSite.accessControlPassageGroups) {
            if(!this.checkValidGroup(group)) {
                valid = false;
                this.tabgroupmod.selectedIndex = 5;
            }
        }
        if(valid) {
            this.currentSite.companyId = this.userAccount.companyId;
            let res = await this.adminSiteManagementService.addOrUpdateSite(this.currentSite);
            if (this.commonService.isValidResponse(res)) {
                this.loadSiteList();
                this.tabgroup.selectedIndex = 0;
                this.highlightInvalidPassages = false;
            } else {
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + res.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
            }
        }
        else {
            this.highlightInvalidPassages = true;
        }
    }

    displaySelectedFacilityManager(id: string) {
        if(this.allUsers) {
            let person = this.allUsers.find(p => p.id == id);
            return person ? person.name + ' ' + person.surname : id;
        }
    }

    displaySelectedOfficeManager(id: string) {
        if(this.allUsers) {
            let person = this.allUsers.find(p => p.id == id);
            return person ? person.name + ' ' + person.surname : id;
        }
    }

    async onAddPassageClick() {
        let newPassage = AccessControlPassage.Empty();
        this.currentSite.accessControlPassages.push(newPassage);
    }

    onRemovePassageClick(passageToRemove: AccessControlPassage) {
        this.currentSite.accessControlPassages = this.currentSite.accessControlPassages.filter(passage => passage.id != passageToRemove.id);
    }

    onRemoveGroupClick(groupToRemove: AccessControlPassageGroup) {
        this.currentSite.accessControlPassageGroups = this.currentSite.accessControlPassageGroups.filter(group => group.id != groupToRemove.id);
    }

    checkValidPassage(passage: AccessControlPassage) {
        if(passage.name!="" && passage.centralUnitId && passage.releNumber) return true;
        else return false;
    }

    checkValidGroup(group: AccessControlPassageGroup) {
        if(group.name!="") return true;
        else return false;
    }

    async onAddGroupClick() {
        let newGroup = AccessControlPassageGroup.Empty();
        let result = await this.dialog.open(ModifyAccessControlGroupDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                group: newGroup,
                site: this.currentSite,
                isNew: true
            }
        }).afterClosed().toPromise();

        if(result) {
            this.currentSite.accessControlPassageGroups.push(result);
            await this.adminSiteManagementService.addOrUpdateSite(this.currentSite);
        }
        await this.loadSiteList();
        this.currentSite = this.sites.find(site => site.id == this.currentSite.id);
    }

    async onAddCentralUnitClick() {
        let result = await this.dialog.open(GenerateAccessControlCentralUnitsDialogComponent, {
            width: '800px',
            panelClass: 'custom-dialog-container',
            data: {
                site: this.currentSite
            }
        }).afterClosed().toPromise();
    }

    async onModifyGroupClick(groupToMod: AccessControlPassageGroup) {
        let result = await this.dialog.open(ModifyAccessControlGroupDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                group: groupToMod,
                site: this.currentSite,
                isNew: false
            }
        }).afterClosed().toPromise();

        if(result) {
            await this.adminSiteManagementService.addOrUpdateSite(this.currentSite);
        }
        await this.loadSiteList();
        this.currentSite = this.sites.find(site => site.id == this.currentSite.id);

    }

    async onGenerateQrCode() {
        let res = await this.adminSiteManagementService.getSites(this.currentSite.companyId);
        if(res) {
            let result = await this.dialog.open(GenerateAccessControlQrCodeDialogComponent, {
                width: '1100px',
                panelClass: 'custom-dialog-container',
                data: {
                    sites: res.sites
                }
            }).afterClosed().toPromise();
        }

    }

    disableAccessControl() {
        if(this.currentSite.accessControlEnable && this.currentSite.accessControlConnected) return false
        return true;
    }

    async onCentralUnitQrCodesClick(unit: AvailableAccessControlCentralUnit) {
        let currUnit = null;
        for(let generatedUnit of this.currentSite.generatedAccessControlCentralUnits) {
            if(generatedUnit.centralUnitId == unit.centralUnitId && generatedUnit.name == unit.name) currUnit = generatedUnit;
        }
        if(currUnit!=null) {
            let result = await this.dialog.open(ViewAccessControlCentralUnitsQrCodeDialogComponent, {
                width: '1000px',
                panelClass: 'custom-dialog-container',
                data: {
                    unit: currUnit
                }
            }).afterClosed().toPromise();
        }
    }

    async onCreateGroup() {
        if(this.currentSite.accessControlGroupId && this.currentSite.accessControlGroupName) {
            let res = await this.adminSiteManagementService.createAccessControlGroup(this.currentSite.id, this.currentSite.accessControlGroupName);
        }
    }

    disableCreateGroupButton() {
        if(!this.currentSite.accessControlEnable || !this.currentSite.accessControlConnected) return true;
        /*if(this.currentSite.availableAccessControlGroups) {
            let correctGroups = this.currentSite.availableAccessControlGroups.filter(group => group.groupId == this.currentSite.accessControlGroupId && group.name == this.currentSite.accessControlGroupName);
            if(correctGroups.length>0) return true;
        }*/
        return false;
    }

    async onViewLastResponse() {
        await this.loadSiteList();
        let readedSite = this.sites.find(site => site.id == this.currentSite.id);
        let result = await this.dialog.open(ViewAccessControlResponseDialogComponent, {
            width: '1000px',
            panelClass: 'custom-dialog-container',
            data: {
                response: readedSite.lastAccessControlAnswer
            }
        }).afterClosed().toPromise();

    }

    async onSendCommand() {
        let result = await this.dialog.open(SendAccessControlCommandDialogComponent, {
            width: '1000px',
            panelClass: 'custom-dialog-container',
            data: {
                site: this.currentSite
            }
        }).afterClosed().toPromise();
    }

    ACSettingsFunctionAvailable() {
        return this.userCapabilityService.isFunctionAvailable('Sites/AccessControlSettings');
    }
    ACCentralUnitsFunctionAvailable() {
        return this.userCapabilityService.isFunctionAvailable('Sites/AccessControlCentralUnits');
    }
    ACGatesFunctionAvailable() {
        return this.userCapabilityService.isFunctionAvailable('Sites/AccessControlGates');
    }
    ACGroupsFunctionAvailable() {
        return this.userCapabilityService.isFunctionAvailable('Sites/AccessControlGroups');
    }

    async onActivateRing(passage: AccessControlPassage) {
        await this.adminSiteManagementService.activateAccessControlRing(passage.centralUnitId);
    }
}



