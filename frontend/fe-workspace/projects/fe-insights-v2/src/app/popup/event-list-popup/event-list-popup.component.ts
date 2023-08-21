import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import Swal from 'sweetalert2';
import {EventDialogData} from '../../components/event-management/event-list/event-list.component';
import {MCPHelperService} from '../../service/MCPHelper.service';
import {EventHelper} from "../../../../../fe-common-v2/src/lib";
import {Sort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import {PeriodicElement} from "../../components/quiz-survey/questions/add-edit-question/add-edit-question.component";
import { EventStatus } from 'projects/fe-common-v2/src/lib/enums/event-status.enum';
@Component({
    selector: 'app-event-list-popup',
    templateUrl: './event-list-popup.component.html',
    styleUrls: ['./event-list-popup.component.scss']
})
export class EventListPopupComponent implements OnInit {
    listTableData = [];
    coditionalParaShow = false;
    enableInviteAll: boolean = false;
    isDisabled: boolean = false;
    listDataDisplayedColumns: string[] = ['firstName', 'surname', 'email', 'role', 'type', 'status'];
    id:any;
    pendingCountData:any;
    eventListData: any[];
    currentEvent: number = EventStatus.current;
    scheduledEvent: number = EventStatus.scheduled;
    @ViewChild('eventListTable') eventListTable: MatTable<PeriodicElement>;
    constructor(
        public dialogRef: MatDialogRef<EventListPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EventDialogData,
        public eventAPI: EventManagementListOfEventService,
        public helper: MCPHelperService,
        private translate: TranslateService
    ) {
      this.id = this.data.eventID;
    }

    ngOnInit(): void {
        this.isDisabled = (this.data.eventListStatus == this.currentEvent || this.data.eventListStatus == this.scheduledEvent) ? false : true;
        this.getAttendeeList();
        if (this.data.condition === 'pending'){
            this.listDataDisplayedColumns = ['firstName', 'surname', 'email', 'role', 'type', 'status', 'action'];
            this.enableInviteAll = true;
        }else if(this.data.condition == null){
            this.listDataDisplayedColumns = ['firstName', 'surname', 'email', 'role', 'type', 'status', 'action'];
            this.enableInviteAll = true;
        }else if(this.data.condition == 'checkpointsCompiled'){
            this.listDataDisplayedColumns = ['firstName', 'surname', 'email', 'role', 'type', 'checkPointsCompiled'];
            this.enableInviteAll = false;
        }else if(this.data.condition == 'accuredCredit'){
            this.listDataDisplayedColumns = ['firstName', 'surname', 'email', 'role', 'type', 'eventCreditCount'];
            this.enableInviteAll = false;
        }else if(this.data.condition == 'checksInOut'){
            this.listDataDisplayedColumns = ['name', 'surname', 'email', 'role', 'type', 'updated_at', 'checkInOut'];
            this.coditionalParaShow = true;
            this.enableInviteAll = false;
        }else{
            this.listDataDisplayedColumns = ['firstName', 'surname', 'email', 'role', 'type', 'status'];
            this.enableInviteAll = false;
        }
        this.pendingCountData =  this.data?.pendingCountData;
    }


    async getAttendeeList() {
        this.helper.toggleLoaderVisibility(true);
        if (this.data.condition != 'checkOut' && this.data.condition != 'checkIn' && this.data.condition != 'checksInOut' && this.data.condition != 'checkpointsCompiled' && this.data.condition != 'accuredCredit') {
            const res: any = await this.eventAPI.attendeesCertificateAPI({
                id: this.id,
                type: this.data.condition
            });
            if (res.statusCode === 200) {
                this.listTableData = res.data;
                this.helper.toggleLoaderVisibility(false);
            } else {
                this.helper.toggleLoaderVisibility(false);
                Swal.fire('', this.translate.instant(res.reason), 'info');
            }
            this.coditionalParaShow = false;
        } else {
            this.listTableData = this.data.checkInOutData;
            this.coditionalParaShow = true;
            this.helper.toggleLoaderVisibility(false);
        }

        this.helper.toggleLoaderVisibility(false);
    }

    onNoClick(com: any): void {
        this.dialogRef.close(com);
    }

    async sendInvitationUserByEmail(attendeeId: string):Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.eventAPI.reInviteUserByMail({eventId : this.id, attendeeId: attendeeId});
        if (res.statusCode === 200) {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
        }
    }

    async sendInvitationAllByEmail():Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        if (this.pendingCountData > 0 ){
            const res: any = await this.eventAPI.reInviteALLByMail({eventId : this.id, invitationStatus:"reInviteAll"});
            if (res.statusCode === 200) {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
            } else {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
            }
        }else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant('NoPendingUserFound'), 'info');
        }
    }

    changeSort(sort: Sort) {
        this.listTableData = this.listTableData.sort((a, b) => {
            const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
            return sort.direction == 'asc' ? value : -value
        })
        this.eventListData = this.listTableData;
        this.eventListTable.renderRows();
    }

}
