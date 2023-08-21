import { Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../../popup/delete-popup/delete-popup.component';
import { AddEditServiceAgreementPopupComponent } from '../../../../popup/add-edit-service-agreement-popup/add-edit-service-agreement-popup.component';
import { ProcurementService } from '../../../../../../../fe-common-v2/src/lib/services/procurement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { MatCheckboxChange } from "@angular/material/checkbox";
import { HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-view-details',
    templateUrl: './view-details.component.html',
    styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsManageServiceComponent implements OnInit {
    page = 1;
    itemsPerPage = 5;
    public config: PaginationInstance = {
        id: 'advanced',
        itemsPerPage: 5,
        currentPage: this.page
    };
    serviceId = '';
    serviceAgreement = [];
    serviceSurvey = [];
    serviceDetails: any = {};
    noRecordFound = false;

    //mandatoryFields = ['Procurement_Management.DURC', 'Procurement_Management.DURC_Deadline', 'Procurement_Management.DURF', 'Procurement_Management.DURF_Deadline', 'Procurement_Management.Chamber_of_Commerce_Registration', 'Procurement_Management.General_Conditions_of_Performance'];
    mandatoryFields = [
        { value: 'DURC', name: 'Procurement_Management.DURC' },
        { value: 'ScadenzaDURC', name: 'Procurement_Management.DURC_Deadline' },
        { value: 'DURF', name: 'Procurement_Management.DURF' },
        { value: 'ScadenzaDURF', name: 'Procurement_Management.DURF_Deadline' },
        { value: 'VisuraCamerale', name: 'Procurement_Management.Chamber_of_Commerce_Registration' },
        { value: 'CondizioniPrestazione', name: 'Procurement_Management.General_Conditions_of_Performance' },
    ];

    constructor(public dialog: MatDialog,
        private procurementService: ProcurementService,
        private router: Router, private route: ActivatedRoute,
        private translate: TranslateService,) {
        this.serviceId = this.route.snapshot.paramMap.get('id');
    }


    public manageServiceViewDetailsData = [];
    manageServiceViewDetailsColumns: string[] = ['title', 'totalQuestions', 'action'];
    selectedMandatory = [];


    ngOnInit(): void {
        this.procurementService.getService({ id: this.serviceId }).then((data: any) => {
            this.serviceDetails = data.data;
            this.selectedMandatory = (Array.isArray(this.serviceDetails.mandatory) && this.serviceDetails.mandatory.length > 0) ? this.serviceDetails.mandatory : [];
            this.serviceAgreement = (Array.isArray(this.serviceDetails.serviceAgreement)) ? this.serviceDetails.serviceAgreement : [];
            this.procurementService.editServiceSurvey({ serviceId: this.serviceId }).then((serviceData: any) => {
                this.manageServiceViewDetailsData = serviceData.data;
                this.noRecordFound = this.manageServiceViewDetailsData.length > 0;
            });
        });
    }

    onKeyUp(xyz: any) {
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

    servicePopup(mode, index, agreement = null): void {
        const that = this;
        const dialogRef = this.dialog.open(AddEditServiceAgreementPopupComponent, {
            data: (agreement) ? agreement : {
                id: null,
                serviceAgreement: [null],
                serviceId: this.serviceId
            }
        });

        dialogRef.afterClosed().subscribe(
            result => {
                if (result.result) {
                    if (mode === 'add') {
                        this.serviceAgreement.unshift(result.data);
                    } else {
                        this.serviceAgreement[index] = result.data;
                    }
                }
            });
    }

    deleteServicePopup(index, agreement): void {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: 'Procurement_Management.Delete_Service_Agreement_Message',
                heading: 'Procurement_Management.Delete_Service_Agreement'
            }
        });

        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.procurementService.deleteServiceAgreement({ id: agreement.id }).then((data: any) => {
                        this.serviceAgreement.splice(index, 1);
                        swal.fire(
                            '',
                            // data.meta.message,
                            this.translate.instant('Swal_Message.Service agreement deleted successfully !'),
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
            });
    }

    openSurveyDeleteDialog(index, survey): void {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: 'Procurement_Management.Delete_Survey_Message',
                heading: 'Procurement_Management.Delete_Survey'
            }
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.procurementService.deleteserviceSurvey({ serviceId: this.serviceId, survey: survey }).then((data: any) => {
                        this.manageServiceViewDetailsData.splice(index, 1);
                        swal.fire(
                            '',
                            this.translate.instant('Survey has been deleted successfully'),
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
            });

    }

}
