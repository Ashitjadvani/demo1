import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {TranslateService} from '@ngx-translate/core';
import {EventHelper} from 'projects/fe-common-v2/src/lib';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import {MCPHelperService} from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-resource-step',
    templateUrl: './resource-step.component.html',
    styleUrls: ['./resource-step.component.scss']
})
export class ResourceStepComponent implements OnInit {

    @Input() finalValueForm: FormGroup;
    @Input() authorId: any;
    @Input() eventStepper: MatStepper;
    @Input() id: any;
    @Input() scopeId: any;
    @Input() resourcesInfoForm: FormGroup;
    @Output() siteListTrigger: EventEmitter<void> = new EventEmitter();
    @Input() venuesInfoForm: FormGroup;
    @Input() resourceByAssetType: any = [];
    @Output() getResourceType: EventEmitter<void> = new EventEmitter();
    @Output() detectNewAttendeeUser: EventEmitter<any> = new EventEmitter();
    @Output() updateFinalFormValue: EventEmitter<any> = new EventEmitter();
    @Output() createICSFile: EventEmitter<any> = new EventEmitter();
    createTimeId: any;

    assetTypeList: any = [];

    constructor(
        public eventAPI: EventManagementListOfEventService,
        public translate: TranslateService,
        private helper: MCPHelperService,
        private _formBuilder: FormBuilder,
        public route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.createTimeId = this.route.snapshot.paramMap.get('id');
        this.getAssetList(0);
    }

    get formResourcesInfoArr(): any {
        return this.resourcesInfoForm.get('resources') as FormArray;
    }

    addResourcesFields(index: number, value: any): void {
        if (value === 'fromAssets') {
            const ResourceInformation = this.resourcesInfoForm.get('resources') as FormArray;
            ResourceInformation.push(this._formBuilder.group({
                assetType: ['', [Validators.required]],
                resourceName: ['', [Validators.required]],
                custome: [null]
            }));
        } else {
            const ResourceInformation = this.resourcesInfoForm.get('resources') as FormArray;
            ResourceInformation.push(this._formBuilder.group({
                assetType: [null],
                resourceName: [null],
                custome: ['', [Validators.required]]
            }));
        }
        this.getAssetList(index);
    }

    async getAssetList(index: number): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.eventAPI.getAssetLogList('');
        if (res.statusCode === 200) {
            this.assetTypeList = res.data;
            this.helper.toggleLoaderVisibility(false);
        } else if (res.result === false) {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.error), 'info');
        }
    }

    addResourcesInfoRow(index: number, value: any): void {
        this.formResourcesInfoArr.push(this.initResourcesInfoRows(index));
    }

    deleteResourcesInfoRow(index: number): void {
        this.formResourcesInfoArr.removeAt(index);
        setTimeout(() => {
            var asset = this.assetTypeList[index];
            if (asset) {
                this.getResourceByAssetType(index, asset.type);
            }
        }, 100);

    }

    initResourcesInfoRows(index: number): any {
        this.siteListTrigger.emit();
        return this._formBuilder.group({
            assetType: [null],
            resourceName: [null],
            custome: [null]
        });
    }

    async getResourceByAssetType(index: number, resourceType: any): Promise<void> {
        var options: any = {
            index: index,
            resourceType: resourceType
        }
        this.getResourceType.emit(options)
    }

    checkResource(stepper: MatStepper, saveExit: boolean): void {
        const found = this.venuesInfoForm.value?.venue.find((obj) => {
            return obj.type === "internal";
        });
        if (found) {
            EventHelper.showMessage('', this.translate.instant('EVENT_MANAGEMENT.PleaseSelectOneResource'), 'info');
        } else {
            this.saveResourcesInfo(stepper, saveExit);
        }
    }

    saveResourcesInfo(stepper: MatStepper, saveExit: boolean): void {
        if (this.resourcesInfoForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            let value = this.resourcesInfoForm.value;
            this.finalValueForm.patchValue({
                id: this.id,
                authorId: this.authorId,
                resources: value.resources,
                step: '3'
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
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
            });
        } else {
            Object.keys(this.resourcesInfoForm.controls).forEach(field => {
                const control = this.resourcesInfoForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

    back() {
        this.helper.back();
    }
}
