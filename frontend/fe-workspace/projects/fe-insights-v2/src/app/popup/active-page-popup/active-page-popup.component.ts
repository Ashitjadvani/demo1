import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MCPHelperService} from "../../service/MCPHelper.service";
import {EventManagementListOfEventService} from "../../../../../fe-common-v2/src/lib/services/event-management-list-of-event.service";
import {ActivatedRoute} from "@angular/router";
import {error} from "ng-packagr/lib/utils/log";
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-active-page-popup',
    templateUrl: './active-page-popup.component.html',
    styleUrls: ['./active-page-popup.component.scss']
})
export class ActivePagePopupComponent implements OnInit {
    activeCodeForm: FormGroup;
    eventId:any;
    companyId:any;
    hoursSelect = [];
    public defaultTime = '00';
    public defaultMinutes = '05';
    public defaultSeconds = '00';
    minutesSelect = [];
    secondsSelect = [];

    constructor(
        public dialogRef: MatDialogRef<ActivePagePopupComponent>,
        public _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private eventServiceAPI : EventManagementListOfEventService,
        public route : ActivatedRoute,
        private helper: MCPHelperService,
        public translate: TranslateService
    ) {
        this.eventId = data.eventId;
        this.companyId = data.companyId;
        this.activeCodeForm = this._formBuilder.group({
            secretCode: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            hours: ['',Validators.required],
            minutes: ['',Validators.required],
            seconds: ['',Validators.required],
            meetingLinkDuration: [''],
        });
        for (let i = 0; i <= 59; i++){
            if (i < 10){
                this.hoursSelect.push('0'+ i);
                this.minutesSelect.push('0'+ i);
                this.secondsSelect.push('0'+ i);
            }else {
                this.hoursSelect.push(i);
                this.minutesSelect.push(i);
                this.secondsSelect.push(i) ;
            }
        }
    }

    ngOnInit(): void {
    }

    onClick(result: any, data: any): void {
        this.dialogRef.afterOpened();
        this.dialogRef.close(result && data);
    }

    onClose(): void {
        this.dialogRef.close();
    }

    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

    saveActiveCodeForm() {
        if (this.activeCodeForm.valid){
            this.helper.toggleLoaderVisibility(true);
            const storeData = this.activeCodeForm.value;
            const meetingLinkDuration = (this.activeCodeForm.value.hours * 3.6e+6) + (this.activeCodeForm.value.minutes * 60000) + (this.activeCodeForm.value.seconds * 1000);
            const sendPara = {
                eventId: this.eventId,
                companyId: this.companyId,
                secretCode: storeData.secretCode,
                meetingLinkDuration : meetingLinkDuration
            };
            this.eventServiceAPI.activeMeetingPage(sendPara).then((res:any) => {
                if (res.statusCode === 200){
                    this.dialogRef.close(true && sendPara);
                    this.helper.toggleLoaderVisibility(false);
                    swal.fire(
                        '',
                        this.translate.instant(res.meta.message),
                        'success'
                    )
                }else {
                    this.helper.toggleLoaderVisibility(false);
                    swal.fire(
                        '',
                        this.translate.instant(res.reason),
                        'info'
                    )
                }
            }, (error) => {
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant(error.error.message),
                    'info'
                )
            });
        }

    }
}
