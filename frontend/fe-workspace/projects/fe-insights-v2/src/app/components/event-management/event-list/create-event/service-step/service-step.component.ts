import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {TranslateService} from '@ngx-translate/core';
import {EventHelper} from 'projects/fe-common-v2/src/lib';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import {EventManagementEventServices} from 'projects/fe-common-v2/src/lib/services/event-services.service';
import {MCPHelperService} from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-service-step',
    templateUrl: './service-step.component.html',
    styleUrls: ['./service-step.component.scss']
})
export class ServiceStepComponent implements OnInit {

    @Input() eventStepper: MatStepper;
    @Input() servicesInfoForm: FormGroup;
    @Input() finalValueForm: FormGroup;
    @Input() id: any;
    @Input() scopeId: any;
    @Input() authorId: any;
    @Output() detectNewAttendeeUser: EventEmitter<any> = new EventEmitter();
    @Output() updateFinalFormValue: EventEmitter<any> = new EventEmitter();
    @Output() createICSFile: EventEmitter<any> = new EventEmitter();
    createTimeId: any;
    eventServiceList: any = [];

    constructor(
        public eventAPI: EventManagementListOfEventService,
        public translate: TranslateService,
        private helper: MCPHelperService,
        private _formBuilder: FormBuilder,
        public eventService: EventManagementEventServices,
        public route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.createTimeId = this.route.snapshot.paramMap.get('id');
        this.getEventServiceList();
    }

    saveServicesInfo(stepper: MatStepper, saveExit: boolean): void {
        if (this.servicesInfoForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            let value = this.servicesInfoForm.value
            this.finalValueForm.patchValue({
                id: this.id,
                authorId: this.authorId,
                services: value.services,
                step: '4'
            });
            this.eventAPI.getCreateEvent(this.finalValueForm.value).then((res:any) => {
                this.helper.toggleLoaderVisibility(false);
                this.updateFinalFormValue.emit(res.data);
                /*if (this.id !== '0') {
                    this.createICSFile.emit(this.id);
                }*/
                if (saveExit){
                    this.detectNewAttendeeUser.emit(saveExit);
                }else {
                    stepper.next();
                }
                /*if (saveExit) {
                    if (this.scopeId === null){
                        this.router.navigate(['event-management/event-list/']);
                    }else {
                        this.router.navigate(['training/event-list/'+ this.scopeId]);
                    }
                } else {
                    stepper.next();
                }*/
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
            });
        } else {
            Object.keys(this.servicesInfoForm.controls).forEach(field => {
                const control = this.servicesInfoForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

    async getEventServiceList(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.eventService.getEventServicesList({limit: null});
        if (res.statusCode === 200) {
            this.eventServiceList = res.data;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.error), 'info');
        }
    }

    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

    deleteServicesInfoRow(index: number): void {
        this.formServicesInfoArr.removeAt(index);
    }

    // Services step
    get formServicesInfoArr(): any {
        return this.servicesInfoForm.get('services') as FormArray;
    }

    addServicesInfoRow(index: number, value: any): void {
        let hasFilledRow = true;
        if (this.formServicesInfoArr.value && this.formServicesInfoArr.value.length > 0) {
            this.formServicesInfoArr.value.forEach(service => {
                if (!service.serviceId && !service.note) {
                    hasFilledRow = false;
                }
            });
        }
        if (!hasFilledRow) {
            EventHelper.showMessage('', this.translate.instant("EVENT_MANAGEMENT.PleaseAddServiceAndNotesFirst"), 'info');
            return;
        }
        this.formServicesInfoArr.push(this.initServicesInfoRows(index));
    }

    initServicesInfoRows(index: number): any {
        return this._formBuilder.group({
            serviceId: [null],
            note: [null],
            sendMail: false,
        });
    }

    back() {
        history.back();
    }
}
