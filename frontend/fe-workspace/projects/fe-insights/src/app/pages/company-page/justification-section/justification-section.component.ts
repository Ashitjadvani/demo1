import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Company, CompanyJustification, JustificationApproval } from 'projects/fe-common/src/lib/models/company';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { Action, ColumnTemplate } from '../../../components/table-data-view/table-data-view.component';
import { JustificationsSettingsDialogComponent } from './justification-settings-dialog/justifications-settings-dialog.component';

enum APPROVAL_TYPE {
    RESPONSABLE,
    ACCOUNTABLE,
    CONSULTED,
    INFORMED
}


@Component({
    selector: 'app-justification-section',
    templateUrl: './justification-section.component.html',
    styleUrls: ['./justification-section.component.scss']
})
export class JustificationSectionComponent implements OnInit {
    @ViewChild(MatTabGroup, { static: false }) tabgroup: MatTabGroup;


    @Input() currentCompany: Company;
    @Output() UpdateEvent: EventEmitter<void> = new EventEmitter<void>();

    APPROVAL_TYPE = APPROVAL_TYPE;


    tableColumnTemplates: ColumnTemplate[] = [
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Name'), columnName: 'Name', columnDataField: 'name', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Enable'), columnName: 'Enable', columnDataField: 'enable', columnFormatter: 'booleanFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Approvation Abilitation'), columnName: 'ApprovationNeeded', columnDataField: 'approvationAbilitation', columnFormatter: 'booleanFormatter', columnRenderer: null, columnTooltip: null, context: this },
        //{ columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Scheduling Abilitation'), columnName: 'ScheduleAbilitation', columnDataField: 'scheduleAbilitation', columnFormatter: 'booleanFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Days For Request'), columnName: 'DaysToRequest', columnDataField: 'daysToRequest', columnFormatter: 'numberFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Silence Assent'), columnName: 'SilenceAssent', columnDataField: 'silenceAssentAbilitation', columnFormatter: 'booleanFormatter', columnRenderer: null, columnTooltip: null, context: this },
        // { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Silence Assent Time'), columnName: 'SilenceAssentHours', columnDataField: 'silenceAssentTimeHours', columnFormatter: 'numberFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Responsable'), columnName: 'Responsable', columnDataField: 'approvalResponsable', columnFormatter: 'justificationApprovalFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Accountable'), columnName: 'Accountable', columnDataField: 'approvalAccountable', columnFormatter: 'justificationApprovalFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Consulted'), columnName: 'Consulted', columnDataField: 'approvalConsulted', columnFormatter: 'justificationApprovalFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Informed'), columnName: 'Informed', columnDataField: 'approvalInformed', columnFormatter: 'justificationApprovalFormatter', columnRenderer: null, columnTooltip: null, context: this },
        { columnCaption: '', columnName: 'Action', columnDataField: '', columnFormatter: null, columnRenderer: null, columnTooltip: null, context: this }
    ]

    tableRowActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Edit'), image: './assets/images/pencil.svg', icon: null, color: '#000000', action: 'onModifyJustification', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Delete'), image: null, icon: 'delete', color: '#FF0000', action: 'onDeleteJustification', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Enable'), image: '', icon: '', color: '#000000', action: 'onChangeEnable', context: this }
    ]

    tableMainActions: Action[] = [
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Add justification'), image: null, icon: 'add_circle', color: '#ffffff', action: 'onAddJustification', context: this },
        { tooltip: this.translate.instant('INSIGHTS_PEOPLE_PAGE.Settings'), image: "./assets/images/settings.svg", icon: null, color: '#ffffff', action: 'onSettings', context: this },
    ]

    filterCallback: Function;

    userAccount: Person;

    isModify: boolean;
    justifications: CompanyJustification[] = [];
    currentJustification: CompanyJustification;

    allPeople: Person[];

    allAreas: string[];
    allRoles: string[];
    allDirections: string[];
    allJobTitles: string[];

    currResponsable: Person;
    currAccountable: Person;
    currConsulted: Person;
    currInformed: Person;

    allFigures: string[];
    selectedAccFigure: string = "";
    selectedRespFigure: string = "";
    selectedConsFigure: string = "";
    selectedInfoFigure: string = "";

    constructor(private adminUserManagementService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        private commonService: CommonService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        public translate: TranslateService) { }

    async ngOnInit() {
        this.userAccount = this.userManagementService.getAccount();
        await this.getJustifications();
        let res = await this.adminUserManagementService.getPeople(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.allPeople = res.people;
        }
    }

    buildEntity() {
        this.allFigures = new Array();
        this.allFigures.push("-");
        this.allFigures.push("User");
        this.allFigures.push("Email");
        this.allFigures.push("Director");
        this.allFigures.push("Area Manager");
        for (let area of this.currentCompany.areas) {
            this.allFigures.push("Manager " + area.name);
        }
        for (let dir of this.currentCompany.peopleDirections) {
            this.allFigures.push("Director " + dir);
        }
    }

    onFigureChange(event: MatSelectChange, approvalType: APPROVAL_TYPE) {
        let figure = event.value;
        if (approvalType == APPROVAL_TYPE.RESPONSABLE) {
            if (figure == "User") {
                this.currentJustification.approvalResponsable.isEmail = false;
                this.currentJustification.approvalResponsable.isFigure = false;
                this.currentJustification.approvalResponsable.isUser = true;
            }
            else if (figure == "Email") {
                this.currentJustification.approvalResponsable.isUser = false;
                this.currentJustification.approvalResponsable.isFigure = false;
                this.currentJustification.approvalResponsable.isEmail = true;
            }
            else if (figure == "-") {
                this.currentJustification.approvalResponsable.isUser = false;
                this.currentJustification.approvalResponsable.isFigure = false;
                this.currentJustification.approvalResponsable.isEmail = false;
            }
            else {
                this.currentJustification.approvalResponsable.isUser = false;
                this.currentJustification.approvalResponsable.isEmail = false;
                this.currentJustification.approvalResponsable.isFigure = true;
                if (figure == "Area Manager") {
                    this.currentJustification.approvalResponsable.figureArea = "";
                    this.currentJustification.approvalResponsable.figureDirection = "";
                    this.currentJustification.approvalResponsable.figureRole = "Area Manager";
                }
                else if (figure == "Director") {
                    this.currentJustification.approvalResponsable.figureArea = "";
                    this.currentJustification.approvalResponsable.figureDirection = "";
                    this.currentJustification.approvalResponsable.figureRole = "Director";
                }
                else if (figure.includes("Director")) {
                    this.currentJustification.approvalResponsable.figureArea = "";
                    this.currentJustification.approvalResponsable.figureRole = "Director";
                    this.currentJustification.approvalResponsable.figureDirection = figure.replace("Director ", "");
                }
                else if (figure.includes("Manager")) {
                    this.currentJustification.approvalResponsable.figureDirection = "";
                    this.currentJustification.approvalResponsable.figureRole = "Area Manager";
                    this.currentJustification.approvalResponsable.figureArea = figure.replace("Manager ", "");
                }
                else {
                    this.currentJustification.approvalResponsable.isUser = false;
                    this.currentJustification.approvalResponsable.isEmail = false;
                    this.currentJustification.approvalResponsable.isFigure = false;
                }
            }
        }
        if (approvalType == APPROVAL_TYPE.ACCOUNTABLE) {
            if (figure == "User") {
                this.currentJustification.approvalAccountable.isEmail = false;
                this.currentJustification.approvalAccountable.isFigure = false;
                this.currentJustification.approvalAccountable.isUser = true;
            }
            else if (figure == "Email") {
                this.currentJustification.approvalAccountable.isUser = false;
                this.currentJustification.approvalAccountable.isFigure = false;
                this.currentJustification.approvalAccountable.isEmail = true;
            }
            else if (figure == "-") {
                this.currentJustification.approvalAccountable.isUser = false;
                this.currentJustification.approvalAccountable.isFigure = false;
                this.currentJustification.approvalAccountable.isEmail = false;
            }
            else {
                this.currentJustification.approvalAccountable.isUser = false;
                this.currentJustification.approvalAccountable.isEmail = false;
                this.currentJustification.approvalAccountable.isFigure = true;
                if (figure == "Area Manager") {
                    this.currentJustification.approvalAccountable.figureArea = "";
                    this.currentJustification.approvalAccountable.figureDirection = "";
                    this.currentJustification.approvalAccountable.figureRole = "Area Manager";
                }
                else if (figure == "Director") {
                    this.currentJustification.approvalAccountable.figureArea = "";
                    this.currentJustification.approvalAccountable.figureDirection = "";
                    this.currentJustification.approvalAccountable.figureRole = "Director";
                }
                else if (figure.includes("Director")) {
                    this.currentJustification.approvalAccountable.figureArea = "";
                    this.currentJustification.approvalAccountable.figureRole = "Director";
                    this.currentJustification.approvalAccountable.figureDirection = figure.replace("Director ", "");
                }
                else if (figure.includes("Manager")) {
                    this.currentJustification.approvalAccountable.figureDirection = "";
                    this.currentJustification.approvalAccountable.figureRole = "Area Manager";
                    this.currentJustification.approvalAccountable.figureArea = figure.replace("Manager ", "");
                }
                else {
                    this.currentJustification.approvalAccountable.isUser = false;
                    this.currentJustification.approvalAccountable.isEmail = false;
                    this.currentJustification.approvalAccountable.isFigure = false;
                }
            }
        }
        if (approvalType == APPROVAL_TYPE.CONSULTED) {
            if (figure == "User") {
                this.currentJustification.approvalConsulted.isEmail = false;
                this.currentJustification.approvalConsulted.isFigure = false;
                this.currentJustification.approvalConsulted.isUser = true;
            }
            else if (figure == "Email") {
                this.currentJustification.approvalConsulted.isUser = false;
                this.currentJustification.approvalConsulted.isFigure = false;
                this.currentJustification.approvalConsulted.isEmail = true;
            }
            else if (figure == "-") {
                this.currentJustification.approvalConsulted.isUser = false;
                this.currentJustification.approvalConsulted.isFigure = false;
                this.currentJustification.approvalConsulted.isEmail = false;
            }
            else {
                this.currentJustification.approvalConsulted.isUser = false;
                this.currentJustification.approvalConsulted.isEmail = false;
                this.currentJustification.approvalConsulted.isFigure = true;
                if (figure == "Area Manager") {
                    this.currentJustification.approvalConsulted.figureArea = "";
                    this.currentJustification.approvalConsulted.figureDirection = "";
                    this.currentJustification.approvalConsulted.figureRole = "Area Manager";
                }
                else if (figure == "Director") {
                    this.currentJustification.approvalConsulted.figureArea = "";
                    this.currentJustification.approvalConsulted.figureDirection = "";
                    this.currentJustification.approvalConsulted.figureRole = "Director";
                }
                else if (figure.includes("Director")) {
                    this.currentJustification.approvalConsulted.figureArea = "";
                    this.currentJustification.approvalConsulted.figureRole = "Director";
                    this.currentJustification.approvalConsulted.figureDirection = figure.replace("Director ", "");
                }
                else if (figure.includes("Manager")) {
                    this.currentJustification.approvalConsulted.figureDirection = "";
                    this.currentJustification.approvalConsulted.figureRole = "Area Manager";
                    this.currentJustification.approvalConsulted.figureArea = figure.replace("Manager ", "");
                }
                else {
                    this.currentJustification.approvalConsulted.isUser = false;
                    this.currentJustification.approvalConsulted.isEmail = false;
                    this.currentJustification.approvalConsulted.isFigure = false;
                }
            }
        }
        if (approvalType == APPROVAL_TYPE.INFORMED) {
            if (figure == "User") {
                this.currentJustification.approvalInformed.isEmail = false;
                this.currentJustification.approvalInformed.isFigure = false;
                this.currentJustification.approvalInformed.isUser = true;
            }
            else if (figure == "Email") {
                this.currentJustification.approvalInformed.isUser = false;
                this.currentJustification.approvalInformed.isFigure = false;
                this.currentJustification.approvalInformed.isEmail = true;
            }
            else if (figure == "-") {
                this.currentJustification.approvalInformed.isUser = false;
                this.currentJustification.approvalInformed.isFigure = false;
                this.currentJustification.approvalInformed.isEmail = false;
            }
            else {
                this.currentJustification.approvalInformed.isUser = false;
                this.currentJustification.approvalInformed.isEmail = false;
                this.currentJustification.approvalInformed.isFigure = true;
                if (figure == "Area Manager") {
                    this.currentJustification.approvalInformed.figureArea = "";
                    this.currentJustification.approvalInformed.figureDirection = "";
                    this.currentJustification.approvalInformed.figureRole = "Area Manager";
                }
                else if (figure == "Director") {
                    this.currentJustification.approvalInformed.figureArea = "";
                    this.currentJustification.approvalInformed.figureDirection = "";
                    this.currentJustification.approvalInformed.figureRole = "Director";
                }
                else if (figure.includes("Director")) {
                    this.currentJustification.approvalInformed.figureArea = "";
                    this.currentJustification.approvalInformed.figureRole = "Director";
                    this.currentJustification.approvalInformed.figureDirection = figure.replace("Director ", "");
                }
                else if (figure.includes("Manager")) {
                    this.currentJustification.approvalInformed.figureDirection = "";
                    this.currentJustification.approvalInformed.figureRole = "Area Manager";
                    this.currentJustification.approvalInformed.figureArea = figure.replace("Manager ", "");
                }
                else {
                    this.currentJustification.approvalInformed.isUser = false;
                    this.currentJustification.approvalInformed.isEmail = false;
                    this.currentJustification.approvalInformed.isFigure = false;
                }
            }
        }
    }

    getJustificationApprovalPerson(ja: JustificationApproval) {
        //return ja ? this.allPeople.find(p => p.id == ja.personId) : null;
    }

    async getJustifications() {
        let res = await this.adminUserManagementService.getCompany(this.userAccount.companyId);
        if (this.commonService.isValidResponse(res)) {
            this.currentCompany = res.company;
        }
        this.justifications = this.currentCompany.peopleJustificationTypes;
        this.buildEntity();
    }

    async onAddJustification() {
        await this.getJustifications();
        this.isModify = false;
        this.currentJustification = CompanyJustification.Empty();
        this.currentJustification.approvalAccountable.isFigure = true;
        this.currentJustification.approvalAccountable.figureRole = "Area Manager";
        this.currentJustification.approvalResponsable.isFigure = true;
        this.currentJustification.approvalResponsable.figureRole = "Director";
        this.currentJustification.approvalConsulted.isFigure = false;
        this.currentJustification.approvalConsulted.figureRole = "";
        this.currentJustification.approvalInformed.isFigure = false;
        this.currentJustification.approvalInformed.figureRole = "";
        this.selectedAccFigure = "Area Manager";
        this.selectedRespFigure = "Director";
        this.selectedConsFigure = "";
        this.selectedInfoFigure = "";
        this.tabgroup.selectedIndex = 1;
    }


    async onModifyJustification(justification: CompanyJustification) {
        this.isModify = true;
        this.currentJustification = this.commonService.cloneObject(justification);
        this.getJustifications();
        if (this.currentJustification.approvalAccountable.isEmail) {
            this.selectedAccFigure = "Email";
        }
        else if (this.currentJustification.approvalAccountable.isUser) {
            this.selectedAccFigure = "User";
            for (let person of this.allPeople) {
                if (this.currentJustification.approvalAccountable.personId == person.id) {
                    this.currAccountable = person;
                    break;
                }
            }
        }
        else if (this.currentJustification.approvalAccountable.isFigure) {
            if (this.currentJustification.approvalAccountable.figureRole == "Director") {
                if (this.currentJustification.approvalAccountable.figureDirection == "") {
                    this.selectedAccFigure = "Director";
                }
                else {
                    this.selectedAccFigure = "Director " + this.currentJustification.approvalAccountable.figureDirection;
                }
            }
            else if (this.currentJustification.approvalAccountable.figureRole == "Area Manager") {
                if (this.currentJustification.approvalAccountable.figureArea == "") {
                    this.selectedAccFigure = "Area Manager";
                }
                else {
                    this.selectedAccFigure = "Manager " + this.currentJustification.approvalAccountable.figureArea;
                }
            }
        }
        else {
            this.selectedAccFigure = "";
        }

        if (this.currentJustification.approvalResponsable.isEmail) {
            this.selectedRespFigure = "Email";
        }
        else if (this.currentJustification.approvalResponsable.isUser) {
            this.selectedRespFigure = "User";
            for (let person of this.allPeople) {
                if (this.currentJustification.approvalResponsable.personId == person.id) {
                    this.currResponsable = person;
                    break;
                }
            }
        }
        else if (this.currentJustification.approvalResponsable.isFigure) {
            if (this.currentJustification.approvalResponsable.figureRole == "Director") {
                if (this.currentJustification.approvalResponsable.figureDirection == "") {
                    this.selectedRespFigure = "Director";
                }
                else {
                    this.selectedRespFigure = "Director " + this.currentJustification.approvalResponsable.figureDirection;
                }
            }
            else if (this.currentJustification.approvalResponsable.figureRole == "Area Manager") {
                if (this.currentJustification.approvalResponsable.figureArea == "") {
                    this.selectedRespFigure = "Area Manager";
                }
                else {
                    this.selectedRespFigure = "Manager " + this.currentJustification.approvalResponsable.figureArea;
                }
            }
        }
        else {
            this.selectedRespFigure = "";
        }

        if (this.currentJustification.approvalConsulted.isEmail) {
            this.selectedConsFigure = "Email";
        }
        else if (this.currentJustification.approvalConsulted.isUser) {
            this.selectedConsFigure = "User";
            for (let person of this.allPeople) {
                if (this.currentJustification.approvalConsulted.personId == person.id) {
                    this.currConsulted = person;
                    break;
                }
            }
        }
        else if (this.currentJustification.approvalConsulted.isFigure) {
            if (this.currentJustification.approvalConsulted.figureRole == "Director") {
                if (this.currentJustification.approvalConsulted.figureDirection == "") {
                    this.selectedConsFigure = "Director";
                }
                else {
                    this.selectedConsFigure = "Director " + this.currentJustification.approvalConsulted.figureDirection;
                }
            }
            else if (this.currentJustification.approvalConsulted.figureRole == "Area Manager") {
                if (this.currentJustification.approvalConsulted.figureArea == "") {
                    this.selectedConsFigure = "Area Manager";
                }
                else {
                    this.selectedConsFigure = "Manager " + this.currentJustification.approvalConsulted.figureArea;
                }
            }
        }
        else {
            this.selectedConsFigure = "";
        }

        if (this.currentJustification.approvalInformed.isEmail) {
            this.selectedInfoFigure = "Email";
        }
        else if (this.currentJustification.approvalInformed.isUser) {
            this.selectedInfoFigure = "User";
            for (let person of this.allPeople) {
                if (this.currentJustification.approvalInformed.personId == person.id) {
                    this.currInformed = person;
                    break;
                }
            }
        }
        else if (this.currentJustification.approvalInformed.isFigure) {
            if (this.currentJustification.approvalInformed.figureRole == "Director") {
                if (this.currentJustification.approvalInformed.figureDirection == "") {
                    this.selectedInfoFigure = "Director";
                }
                else {
                    this.selectedInfoFigure = "Director " + this.currentJustification.approvalInformed.figureDirection;
                }
            }
            else if (this.currentJustification.approvalInformed.figureRole == "Area Manager") {
                if (this.currentJustification.approvalInformed.figureArea == "") {
                    this.selectedInfoFigure = "Area Manager";
                }
                else {
                    this.selectedInfoFigure = "Manager " + this.currentJustification.approvalInformed.figureArea;
                }
            }
        }
        else {
            this.selectedInfoFigure = "";
        }


        this.tabgroup.selectedIndex = 1;

    }

    async onDeleteJustification(justification: CompanyJustification) {
        let res = await this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
            data: new ConfirmDialogData(this.translate.instant('INSIGHTS_PEOPLE_PAGE.DeleteJustification'), this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
        }).afterClosed().toPromise();
        if (res) {
            let r = await this.adminUserManagementService.deleteCompanyJustification(this.currentCompany.id, justification.id);
            if (r.result) {
                this.justifications = this.justifications.filter(j => j.id != justification.id);
            } else
                this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.ERROR') + r.reason, this.translate.instant('GENERAL.OK'), { duration: 3000 });
        }
    }

    async onChangeEnable(justification: CompanyJustification) {
        if (justification.enable) justification.enable = false;
        else justification.enable = true;
        await this.adminUserManagementService.updateCompanyJustification(this.currentCompany.id, justification.id, justification);

    }

    isEditConfirmEnabled() {
        return this.commonService.isValidField(this.currentJustification.name);
    }

    onEditCancelClick() {
        this.goBackToList();
    }

    goBackToList() {
        this.getJustifications();
        this.currentJustification = null;
        this.tabgroup.selectedIndex = 0;
    }

    async onEditConfirmClick() {
        if (this.isModify) {
            let res = await this.adminUserManagementService.updateCompanyJustification(this.currentCompany.id, this.currentJustification.id, this.currentJustification);
        } else {
            let duplicate = this.currentCompany.peopleJustificationTypes.find(jt => jt.name.toLowerCase().trim() == this.currentJustification.name.toLowerCase().trim());
            if (duplicate) {
                this.snackBar.open(this.translate.instant('INSIGHTS_PEOPLE_PAGE.DuplicatedJustification'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
                return;
            }
            let res = await this.adminUserManagementService.addCompanyJustification(this.currentCompany.id, this.currentJustification);
        }

        this.goBackToList();
    }

    getCurrentPerson(approvalType: APPROVAL_TYPE) {
        if (approvalType == APPROVAL_TYPE.RESPONSABLE) return this.currResponsable ? this.currResponsable.name + ' ' + this.currResponsable.surname : '';
        else if (approvalType == APPROVAL_TYPE.ACCOUNTABLE) return this.currAccountable ? this.currAccountable.name + ' ' + this.currAccountable.surname : '';
        else if (approvalType == APPROVAL_TYPE.CONSULTED) return this.currConsulted ? this.currConsulted.name + ' ' + this.currConsulted.surname : '';
        else if (approvalType == APPROVAL_TYPE.INFORMED) return this.currInformed ? this.currInformed.name + ' ' + this.currInformed.surname : '';
    }

    onPersonSelected(approvalType: APPROVAL_TYPE, person: Person) {
        if (approvalType == APPROVAL_TYPE.RESPONSABLE) {
            this.currResponsable = person;
            this.currentJustification.approvalResponsable.personId = person.id;
        }
        else if (approvalType == APPROVAL_TYPE.ACCOUNTABLE) {
            this.currAccountable = person;
            this.currentJustification.approvalAccountable.personId = person.id;
        }
        else if (approvalType == APPROVAL_TYPE.CONSULTED) {
            this.currConsulted = person;
            this.currentJustification.approvalConsulted.personId = person.id;
        }
        else if (approvalType == APPROVAL_TYPE.INFORMED) {
            this.currInformed = person;
            this.currentJustification.approvalInformed.personId = person.id;
        }
    }


    justificationApprovalFormatter(justificationApproval: JustificationApproval) {
        if (justificationApproval.isEmail) {
            return justificationApproval.email;
        }
        else if (justificationApproval.isUser) {
            if(this.allPeople) {
                for (let person of this.allPeople) {
                    if (justificationApproval.personId == person.id) return (person.name + ' ' + person.surname);
                }
            }
        }
        else if (justificationApproval.isFigure) {
            if (justificationApproval.figureRole == "Area Manager") {
                if (justificationApproval.figureArea == "") return "Area Manager";
                else return ("Manager " + justificationApproval.figureArea);
            }
            else if (justificationApproval.figureRole == "Director") {
                if (justificationApproval.figureDirection == "") return "Director";
                else return ("Director " + justificationApproval.figureDirection);
            }
        }
    }
    booleanFormatter(variable: boolean) {
        if (variable) return "Y";
        else return "N";
    }
    numberFormatter(variable: number) {
        return ("" + variable);
    }

    async onSettings() {
        await this.dialog.open(JustificationsSettingsDialogComponent, {
            maxWidth: '600px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: this.currentCompany
        }).afterClosed().toPromise();
    }
}



