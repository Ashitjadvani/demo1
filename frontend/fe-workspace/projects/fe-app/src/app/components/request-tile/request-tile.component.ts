import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { User } from 'projects/fe-common/src/lib/models/admin/user';
import { Person } from 'projects/fe-common/src/lib/models/person';
import { Component, Input, OnInit } from '@angular/core';
import { Request , REQUEST_STATE} from 'projects/fe-common/src/lib/models/requests';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { RequestManagementService } from 'projects/fe-common/src/lib/services/request-management.service';
import { UserManagementService } from 'projects/fe-common/src/lib/services/user-management.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarManagementService } from 'projects/fe-common/src/lib/services/calendar-management.service';
import { RequestNoteDialogComponent } from './note-dialog/note-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'app-request-tile',
    templateUrl: './request-tile.component.html',
    styleUrls: ['./request-tile.component.scss'],
    animations: [
        trigger('openClose', [
          state('open', style({
            height: '220px',
            opacity: '1',
            paddingLeft: '10px',
          })),
          state('closed', style({
            height: '0px',
            opacity: '-1',
            paddingLeft: '0px',
          })),
          transition('* => closed', [
            animate('0.3s')
          ]),
          transition('* => open', [
            animate('0.3s')
          ]),
        ]),
      ],
})
export class RequestTileComponent implements OnInit {
    @Input() request: Request;
    @Input() isAccountable: Boolean;
    @Input() isResponsable: Boolean;
    @Input() isConsulted: Boolean;
    @Input() isInformed: Boolean;
    employeeName: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    currentUser: Person;
    moreDays: boolean;

    acceptColor: string;
    rejectColor: string;
    tileBackgroundColor: string;
    tileTextColor: string;
    weekSelectedText: string = "27/09 - 01/10";

    actionDrawer: string = "closed";



    constructor(private _common: CommonService,
        private adminUserManagerService: AdminUserManagementService,
        private userManagementService: UserManagementService,
        private requestManagementService: RequestManagementService,       
        private translate: TranslateService,
        private _snackBar: MatSnackBar,
        private calendarManagementService: CalendarManagementService,
        private dialog: MatDialog) {}

    async ngOnInit() {
        this.currentUser = await this.userManagementService.getAccount();
        this.employeeName = this.request.userName + " " + this.request.userSurname;
        this.startDate = this._common.toDDMMYYYY(this.request.dateTimeStart);
        this.endDate = this._common.toDDMMYYYY(this.request.dateTimeEnd);
        if(this.startDate!=this.endDate) {
            this.moreDays = true;
        }
        this.startTime = this._common.toHHMM(this.request.dateTimeStart);
        this.endTime = this._common.toHHMM(this.request.dateTimeEnd);
        this.loadRequestColor();
        this.getChartDataset(this.request.dateTimeStart);
        
    }

    loadRequestColor() {
        if(this.isAccountable) {
            if(this.request.requestState == REQUEST_STATE.ACC_ACCEPTED || this.request.requestState == REQUEST_STATE.RES_ACCEPTED || this.request.requestState == REQUEST_STATE.AUTO_ACCEPTED) {
                this.acceptColor = "#009300EE"; 
                this.rejectColor = "#000000AA";
                this.tileBackgroundColor = "#F2F2F2FF";
                this.tileTextColor = "#000000BB";
            }
            else if (this.request.requestState == REQUEST_STATE.ACC_REJECTED || this.request.requestState == REQUEST_STATE.RES_REJECTED) {
                this.acceptColor = "#000000AA"; 
                this.rejectColor = "#F00000EE";
                this.tileBackgroundColor = "#F2F2F2FF";
                this.tileTextColor = "#000000BB";
            }
            else {
                this.acceptColor = "#000000AA"; 
                this.rejectColor = "#000000AA";
                this.tileBackgroundColor = "#F2F2F2FF";
                this.tileTextColor = "#000000BB";
            }
        }
        else if(this.isResponsable) {
            if(this.request.requestState == REQUEST_STATE.RES_ACCEPTED || this.request.requestState == REQUEST_STATE.AUTO_ACCEPTED) {
                this.acceptColor = "#009300EE"; 
                this.rejectColor = "#000000AA";
                this.tileBackgroundColor = "#F2F2F2FF";
                this.tileTextColor = "#000000BB";
            }
            else if (this.request.requestState == REQUEST_STATE.ACC_REJECTED || this.request.requestState == REQUEST_STATE.RES_REJECTED) {
                this.acceptColor = "#000000AA"; 
                this.rejectColor = "#F00000EE";
                this.tileBackgroundColor = "#F2F2F2FF";
                this.tileTextColor = "#000000BB";
            }
            else {
                this.acceptColor = "#000000AA"; 
                this.rejectColor = "#000000AA";
                this.tileBackgroundColor = "#F2F2F2FF";
                this.tileTextColor = "#000000BB";
            }          
        }
        else {
            if(this.request.requestState == REQUEST_STATE.RES_ACCEPTED) {
                this.acceptColor = "#009300EE"; 
                this.rejectColor = "#000000AA";
                this.tileBackgroundColor = "#F2F2F2FF";
                this.tileTextColor = "#000000BB";
            }
            else if (this.request.requestState == REQUEST_STATE.ACC_REJECTED || this.request.requestState == REQUEST_STATE.RES_REJECTED) {
                this.acceptColor = "#000000AA"; 
                this.rejectColor = "#F00000EE";
                this.tileBackgroundColor = "#F2F2F2FF";
                this.tileTextColor = "#000000BB";
            }
            else {
                this.acceptColor = "#000000AA"; 
                this.rejectColor = "#000000AA";
                this.tileBackgroundColor = "#F2F2F2FF";
                this.tileTextColor = "#000000BB";
            }   
        }
    }

    async onAcceptClick() {
        if(this.isResponsable) {
            if(this.request.requestState == REQUEST_STATE.ACC_REJECTED) {
                this._snackBar.open(this.translate.instant('EMPLOYEE PAGE.ACCOUNTABLE REJECTED'), "OK", {
                    duration:3000,
                    panelClass: 'warning'
                });
            }
            else {
                this.request.requestState = REQUEST_STATE.RES_ACCEPTED;
                this.request.lastActionName = this.currentUser.name + " " +this.currentUser.surname;
                this.request.lastActionDate = new Date();
                await this.requestManagementService.addOrUpdateRequest(this.request);
            }
            this.loadRequestColor();
        }
        else if(this.isAccountable) {
            //if(this.request.requestState==REQUEST_STATE.RES_REJECTED) {
                this.request.requestState = REQUEST_STATE.ACC_ACCEPTED;
                this.request.lastActionName = this.currentUser.name + " " +this.currentUser.surname;
                this.request.lastActionDate = new Date();
                await this.requestManagementService.addOrUpdateRequest(this.request);

            /*}
            else {
                this._snackBar.open(this.translate.instant('EMPLOYEE PAGE.NOT ACCOUNTABLE'), "OK", {
                    duration:3000,
                    panelClass: 'warning'
                });
            }*/
            this.loadRequestColor();
        }
        else {
            this._snackBar.open(this.translate.instant('EMPLOYEE PAGE.NOT PERMITTED'), "OK", {
                duration:3000,
                panelClass: 'warning'
            });
        }
    }

    async onRejectClick() {
        if(this.isResponsable) {
            this.request.requestState = REQUEST_STATE.RES_REJECTED;
            this.request.lastActionName = this.currentUser.name + " " +this.currentUser.surname;
            this.request.lastActionDate = new Date();
            await this.requestManagementService.addOrUpdateRequest(this.request);
            this.loadRequestColor();
        }
        else if(this.isAccountable) {
            this.request.requestState = REQUEST_STATE.ACC_REJECTED;
            this.request.lastActionName = this.currentUser.name + " " +this.currentUser.surname;
            this.request.lastActionDate = new Date();
            await this.requestManagementService.addOrUpdateRequest(this.request);
            this.loadRequestColor();            
        }
        else {
            this._snackBar.open(this.translate.instant('EMPLOYEE PAGE.NOT PERMITTED'), "OK", {
                duration:3000,
                panelClass: 'warning'
            });            
        }
    }

    async onNoteClick() {
        let dialogRespose = await this.dialog.open(RequestNoteDialogComponent, {
            width: '300px',
            panelClass: 'custom-dialog-container',
            data: {
                request: this.request,
                currentUser: this.currentUser
            }
        }).afterClosed().toPromise();
    }

    onToggleActionDrawer() {
        this.actionDrawer = this.actionDrawer == 'closed' ? 'open' : 'closed';
        this.getChartDataset(this.request.dateTimeStart);
    }

    async getChartDataset(startDate: Date) { 
        let date = new Date(startDate);
        let first = date.getDate() - date.getDay() + 1;
        let last = first + 4;
        let firstDay = new Date(date.setDate(first));
        let lastDay = new Date(date.setDate(last));  
    }

    getDate() {
        if(this.request.lastActionDate) {
            let date = new Date(this.request.lastActionDate);
            return this._common.toDDMMYYYY(date) + " " + this._common.toHHMM(date);
        }
        return "";
    }

    onPrevWeek() {

    }

    onNextWeek() {
        
    }
}
