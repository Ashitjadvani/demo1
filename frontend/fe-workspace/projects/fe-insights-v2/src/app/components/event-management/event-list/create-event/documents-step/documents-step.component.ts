import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import swal from "sweetalert2";
import {AddEditSingleFieldPopupComponent} from "../../../../../popup/add-edit-single-field-popup/add-edit-single-field-popup.component";
import {EventHelper} from "../../../../../../../../fe-common-v2/src/lib";
import {EventManagementListOfEventService} from "../../../../../../../../fe-common-v2/src/lib/services/event-management-list-of-event.service";
import {TranslateService} from "@ngx-translate/core";
import {MCPHelperService} from "../../../../../service/MCPHelper.service";
import {MasterDocumentTypeService} from "../../../../../../../../fe-common-v2/src/lib/services/master-document-type.service";
import {MatDialog} from "@angular/material/dialog";
import {DataStorageManagementService} from "../../../../../../../../fe-common-v2/src/lib/services/data-storage-management.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-documents-step',
    templateUrl: './documents-step.component.html',
    styleUrls: ['./documents-step.component.scss']
})
export class DocumentsStepComponent implements OnInit {

    @Input() finalValueForm: FormGroup;
    @Input() documentsInfoForm: FormGroup;
    @Input() authorId: any;
    @Input() eventStepper: MatStepper;
    @Input() id: any;
    @Input() scopeId: any;
    @Input() updatedDocumentList: any;
    @Output() detectNewAttendeeUser: EventEmitter<any> = new EventEmitter();
    @Output() callAttendees: EventEmitter<any> = new EventEmitter();
    @Output() updateFinalFormValue: EventEmitter<any> = new EventEmitter();
    @Output() createICSFile: EventEmitter<any> = new EventEmitter();
    createTimeId: any;
    fileToUpload: any = [];
    documentInput: any;
    ownerInternalCheckOutList: any = [];
    organizerInternalCheckOutList: any = [];
    speakerInternalCheckOutList: any = [];
    attendeeInternalCheckOutList: any = [];
    techSupportInternalCheckOutList: any = [];
    assistantInternalCheckOutList: any = [];
    ownerExtrnalCheckOutList: any = [];
    organizerExtrnalCheckOutList: any = [];
    speakerExtrnalCheckOutList: any = [];
    attendeeExtrnalCheckOutList: any = [];
    techSupportExtrnalCheckOutList: any = [];
    assistantExtrnalCheckOutList: any = [];
    documentName: any = [];
    documentTypeList: any = [];

    constructor(
        public eventAPI: EventManagementListOfEventService,
        public translate: TranslateService,
        private helper: MCPHelperService,
        private ApiService: MasterDocumentTypeService,
        public dialog: MatDialog,
        private dataStorageManagementService: DataStorageManagementService,
        private _formBuilder: FormBuilder,
        public route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.createTimeId = this.route.snapshot.paramMap.get('id');
        this.getDocumentType({limit: null});
    }

    // document step data save
    saveDocumentInfo(stepper: MatStepper, saveExit: boolean): void {
        this.helper.toggleLoaderVisibility(true);
        if (this.documentsInfoForm.valid) {
            let value = this.documentsInfoForm.value

            this.updatedDocumentList = [];
            for (let i = 0; i < value.documents.length; i++) {
                if (value.documents[i].documentTypeId !== null &&
                    value.documents[i].documentTypeId !== undefined &&
                    value.documents[i].imageName !== '') {
                    this.updatedDocumentList.push(value.documents[i]);
                }
            }
            this.finalValueForm.patchValue({
                id: this.id,
                authorId: this.authorId,
                documents: this.updatedDocumentList,
                step: '6' // event document step
            });
            this.eventAPI.getCreateEvent(this.finalValueForm.value).then((res: any) => {
                this.updateFinalFormValue.emit(res.data);
                /*if (this.id !== '0') {
                    this.createICSFile.emit(this.id);
                }*/
                const sendCertificateListData = res.data.attendees;
                this.ownerInternalCheckOutList = sendCertificateListData.owner.internal;
                this.organizerInternalCheckOutList = sendCertificateListData.organizer.internal;
                this.speakerInternalCheckOutList = sendCertificateListData.speaker.internal;
                this.attendeeInternalCheckOutList = sendCertificateListData.attendee.internal;
                this.techSupportInternalCheckOutList = sendCertificateListData.technicalSupport.internal;
                this.assistantInternalCheckOutList = sendCertificateListData.assistant.internal;
                this.ownerExtrnalCheckOutList = sendCertificateListData.owner.external;
                this.organizerExtrnalCheckOutList = sendCertificateListData.organizer.external;
                this.speakerExtrnalCheckOutList = sendCertificateListData.speaker.external;
                this.attendeeExtrnalCheckOutList = sendCertificateListData.attendee.external;
                this.techSupportExtrnalCheckOutList = sendCertificateListData.technicalSupport.external;
                this.assistantExtrnalCheckOutList = sendCertificateListData.assistant.external;
                if (saveExit) {
                    this.detectNewAttendeeUser.emit(saveExit);
                    /*this.callAttendees.emit(saveExit);*/
                } else {
                    stepper.next();
                }
            }, (err) => {
                swal.fire(
                    '',
                    this.translate.instant(err.error.message),
                    'info'
                )
            });
            this.callAttendees.emit(saveExit);
            this.helper.toggleLoaderVisibility(false);
        } else {
            Object.keys(this.documentsInfoForm.controls).forEach(field => {
                const control = this.documentsInfoForm.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

    openDocumentType(): void {
        const dialogRef = this.dialog.open(AddEditSingleFieldPopupComponent, {
            data: {
                placeholder: 'MASTER_MODULE.COST_DOCUMENT_NAME',
                heading: 'INSIGHTS_MENU.Add_Document_Type',
                validation: 'MASTER_MODULE.Enter document type name'
            }
        });
        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                this.helper.toggleLoaderVisibility(true);
                await this.ApiService.addDocumentType(result).then((res: any) => {
                    if (res.statusCode === 200) {
                        this.getDocumentType('');
                        this.helper.toggleLoaderVisibility(false);
                        EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
                    }
                    this.helper.toggleLoaderVisibility(false);
                }, (err) => {
                    this.helper.toggleLoaderVisibility(false);
                    EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
                });
            }
        });
    }

    async getDocumentType(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiService.getDocumentType({limit: null});
        if (res.statusCode === 200) {
            this.documentTypeList = res.data;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
        }
        this.helper.toggleLoaderVisibility(false);
    }

    // Document file upload
    onFileChanged(input: HTMLInputElement, index: any): void {
        function formatBytes(bytes: number): string {
            const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const factor = 1024;
            let index = 0;
            while (bytes >= factor) {
                bytes /= factor;
                index++;
            }
            return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
        }

        // @ts-ignore
        const file = input.files[0];
        this.fileToUpload[index] = input.files[0];
        //this.documentsInfoForm.value.documents[index].imageId = this.fileToUpload[index];
        this.uploadFile(this.fileToUpload[index], index);
        this.documentInput = file;
        //this.documentName[index] = `${file.name} (${formatBytes(file.size)})`;
        this.documentsInfoForm.value.documents[index].imageName = `${file.name} (${formatBytes(file.size)})`;
    }

    uploadFile(fileToUpload, index): any {
        return new Promise((resolve, reject) => {
            if (fileToUpload) {
                this.dataStorageManagementService.uploadFile(fileToUpload).then((data: any) => {
                    const fileId = data?.body?.fileId ? data.body.fileId : null;
                    this.documentsInfoForm.value.documents[index].imageId = fileId;
                    resolve(fileId);
                }, (error) => {
                    resolve(null);
                });
            } else {
                resolve(null);
            }
        });
    }

    resetDocumentValue(index: any): void {
        this.documentInput = null;
        this.documentName[index] = null;
        this.documentsInfoForm.value.documents[index].imageId = null;
        this.documentsInfoForm.value.documents[index].imageName = null;
        // this.companyInformationForm.patchValue({
        //   logoID: null
        // });
    }

    deleteDocumentRow(index: number): void {
        this.formDocumentArr.removeAt(index);
    }

    // Document step
    get formDocumentArr(): any {
        return this.documentsInfoForm.get('documents') as FormArray;
    }

    addDocumentRow(index: number): void {
        this.formDocumentArr.push(this.initDocumentRows(index));
    }

    initDocumentRows(index: number): any {
        return this._formBuilder.group({
            documentTypeId: [null],
            imageId: [null],
            imageName: ''
        });
    }

    back() {
        history.back();
    }
}
