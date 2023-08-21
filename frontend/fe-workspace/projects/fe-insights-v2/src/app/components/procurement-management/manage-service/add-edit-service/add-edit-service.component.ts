import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcurementService } from '../../../../../../../fe-common-v2/src/lib/services/procurement.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MCPHelperService } from '../../../../service/MCPHelper.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-add-edit-service',
    templateUrl: './add-edit-service.component.html',
    styleUrls: ['./add-edit-service.component.scss']
})
export class AddEditServiceComponent implements OnInit {
    addServiceForm: FormGroup;
    serviceAgreementForm: FormGroup;

    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    serviceId = '';
    title = 'Add';

    public quiz_data = [];

    //mandatoryFields = ['Procurement_Management.DURC', 'Procurement_Management.DURC_Deadline', 'Procurement_Management.DURF', 'Procurement_Management.DURF_Deadline', 'Procurement_Management.Chamber_of_Commerce_Registration', 'Procurement_Management.General_Conditions_of_Performance'];

    // mandatoryFields = [
    //   {value: 'DURC', name: 'Procurement_Management.DURC'},
    //   {value: 'Scadenza DURC', name: 'Procurement_Management.DURC_Deadline'},
    //   {value: 'DURF', name: 'Procurement_Management.DURF'},
    //   {value: 'Scadenza DURF', name: 'Procurement_Management.DURF_Deadline'},
    //   {value: 'Visura camerale', name: 'Procurement_Management.Chamber_of_Commerce_Registration'},
    //   {value: 'Condizioni generali di prestazione', name: 'Procurement_Management.General_Conditions_of_Performance'},
    // ];

    mandatoryFields = [
        { value: 'DURC', name: 'Procurement_Management.DURC' },
        // {value: 'ScadenzaDURC', name: 'Procurement_Management.DURC_Deadline'},
        { value: 'DURF', name: 'Procurement_Management.DURF' },
        // {value: 'ScadenzaDURF', name: 'Procurement_Management.DURF_Deadline'},
        { value: 'VisuraCamerale', name: 'Procurement_Management.Chamber_of_Commerce_Registration' },
        { value: 'CondizioniPrestazione', name: 'Procurement_Management.General_Conditions_of_Performance' },
    ];
    MandatoryDisplayedColumns: string[] = ['name', 'switch'];
    quizDisplayedColumns: string[] = ['quizName', 'questionNumber'];

    public scopeList: any[] = ['Select All', 'Employees', 'System', 'Professional'];
    selected3 = [];
    selectedMandatory = [];

    constructor(private formBuilder: FormBuilder,
        private procurementService: ProcurementService,
        public helper: MCPHelperService,
        private router: Router, private route: ActivatedRoute,
        private translate: TranslateService) {

        this.serviceId = this.route.snapshot.paramMap.get('id');
        this.addServiceForm = this.formBuilder.group({
            id: [null],
            serviceName: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
            descriptionEnglish: ['', [Validators.required]],
            costCenterName: ['', [Validators.required]],
            mandatory: [[]],
        });

        this.serviceAgreementForm = this.formBuilder.group({
            serviceId: this.serviceId,
            title: [''],
            description: [''],
            // serviceAgreement: this.formBuilder.array([this.initItemRows()])
            //serviceAgreement: this.formBuilder.array([MCPHelperService.noWhitespaceValidator])
            serviceAgreement: this.formBuilder.array([], [MCPHelperService.noWhitespaceValidator])
        });
    }

    ngOnInit(): void {
        this.procurementService.getServiceSurvey().then((dataSurvey: any) => {
            this.quiz_data = dataSurvey.data;
            if (this.serviceId) {
                this.title = 'Edit';
                this.procurementService.getService({ id: this.serviceId }).then((data: any) => {
                    const serviceDetails = data.data;
                    this.selected3 = serviceDetails.survey;
                    this.addServiceForm.patchValue({
                        id: this.serviceId,
                        serviceName: serviceDetails.serviceName,
                        descriptionEnglish: serviceDetails.descriptionEnglish,
                        costCenterName: serviceDetails.costCenterName
                    });
                    this.selectedMandatory = (Array.isArray(serviceDetails.mandatory) && serviceDetails.mandatory.length > 0) ? serviceDetails.mandatory : [];
                    if (Array.isArray(serviceDetails.serviceAgreement) && serviceDetails.serviceAgreement.length > 0) {
                        serviceDetails.serviceAgreement.forEach((a) => {
                            const control = this.serviceAgreementForm.get('serviceAgreement') as FormArray;
                            control.push(this.formBuilder.group({
                                id: [a.id],
                                title: [a.serviceAgreementTitle],
                                description: [a.serviceAgreement, MCPHelperService.noWhitespaceValidator]
                            }));
                        });
                    } else {
                        const control = this.serviceAgreementForm.get('serviceAgreement') as FormArray;
                        control.push(this.formBuilder.group({
                            id: [null],
                            title: [null],
                            description: [null, MCPHelperService.noWhitespaceValidator],
                        }));
                    }
                });
            } else {
                const control = this.serviceAgreementForm.get('serviceAgreement') as FormArray;
                control.push(this.formBuilder.group({
                    id: [null],
                    title: [null],
                    description: [null, MCPHelperService.noWhitespaceValidator]
                }));
            }
        });
    }

    isChecked(): any {
        return this.selected3.length === this.quiz_data.length;
    }

    isIndeterminate(): any {
        return (this.selected3.length > 0 && !this.isChecked());
    }

    toggleMandatory(item, event: MatCheckboxChange): void {
        if (event.checked) {
            this.selectedMandatory.push(item);
        } else {
            const index = this.selectedMandatory.indexOf(item);
            if (index >= 0) {
                this.selectedMandatory.splice(index, 1);
            }
        }
    }

    existsMandatory(item): any {
        return this.selectedMandatory.indexOf(item) > -1;
    }

    toggle(item, event: MatCheckboxChange): void {
        if (event.checked) {
            this.selected3.push(item.id);
        } else {
            const index = this.selected3.indexOf(item.id);
            if (index >= 0) {
                this.selected3.splice(index, 1);
            }
        }
    }

    toggleAll(event: MatCheckboxChange): any {
        if (event.checked) {
            this.quiz_data.forEach(row => {
                this.selected3.push(row.id);
            });
        } else {
            this.selected3.length = 0;
        }
    }

    exists(item): any {
        return this.selected3.indexOf(item.id) > -1;
    }

    onSubmit(saveExit): void {
        if (this.addServiceForm.valid) {
            //this.selectedMandatory = [];
            this.addServiceForm.patchValue({
                mandatory: this.selectedMandatory
            });
            this.helper.toggleLoaderVisibility(true);
            this.procurementService.saveService(this.addServiceForm.value).then((data: any) => {
                this.helper.toggleLoaderVisibility(false);
                const serviceData = data.data;
                this.serviceId = serviceData.id;
                this.addServiceForm.patchValue({
                    id: serviceData.id,
                });
                this.serviceAgreementForm.patchValue({
                    serviceId: serviceData.id
                });
                if (saveExit == "Yes") {
                    this.name = this.route.snapshot.paramMap.get('id');
                    this.router.navigate(['manage-service']);
                    swal.fire(
                        '',
                        this.name ?
                            this.translate.instant('Service updated successfully') : this.translate.instant('Service added successfully'),
                        'success'
                    );
                }
                /*swal.fire(
                  '',
                  data.meta.message,
                  'info'
                );*/
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant(err.error.message),
                    'info'
                );
            });
        }
    }
    name: any;
    saveService(): void {

    }
    saveServiceSurvey(): void {
        this.name = this.route.snapshot.paramMap.get('id');
        const requestData = { id: this.serviceId, survey: this.selected3 };
        this.procurementService.saveService(requestData).then((data: any) => {
            this.router.navigate(['manage-service']);
            swal.fire(
                '',
                this.name ?
                    this.translate.instant('Service updated successfully') : this.translate.instant('Service added successfully'),
                'success'
            );
        }, (err) => {
            swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
            );
        });
    }

    get formArr(): any {
        return this.serviceAgreementForm.get('serviceAgreement') as FormArray;
    }

    initItemRows(): any {
        return this.formBuilder.group({
            title: [''],
            description: ['', MCPHelperService.noWhitespaceValidator]
        });
    }

    addNewRow(): void {
        this.formArr.push(this.initItemRows());
    }

    deleteRow(index: number): void {
        this.formArr.removeAt(index);
    }

    onSubmitAgreement(saveExit): void {
        if (this.serviceAgreementForm.valid) {
            this.procurementService.saveServiceAgreement(this.serviceAgreementForm.value).then((data: any) => {
                /*swal.fire(
                  '',
                  data.meta.message,
                  'info'
                );*/
                if (saveExit == "Yes") {
                    this.name = this.route.snapshot.paramMap.get('id');
                    this.router.navigate(['manage-service']);
                    swal.fire(
                        '',
                        this.name ?
                            this.translate.instant('Service updated successfully') : this.translate.instant('Service added successfully'),
                        'success'
                    );
                }
            }, (err) => {
                swal.fire(
                    '',
                    this.translate.instant(err.error.message),
                    'info'
                );
            });
        }
    }
    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }
}
