import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {AccountService} from "../../../../../../../fe-common-v2/src/lib/services/account.service";
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";
import {EventManagementCostCenterService} from "../../../../../../../fe-common-v2/src/lib/services/event-management-cost-centers.service";
import {AddEditDisputePopupComponent} from "../../../../popup/add-edit-dispute-popup/add-edit-dispute-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {AddCostCenterTypeComponent} from "../../../../popup/add-cost-center-type/add-cost-center-type.component";
import {MasterModulesCostCenterTypeService} from "../../../../../../../fe-common-v2/src/lib/services/master-modules-cost-center-type.service";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
    selector: 'app-add-edit-event-cost-centers',
    templateUrl: './add-edit-event-cost-center.component.html',
    styleUrls: ['./add-edit-event-cost-center.component.scss']
})
export class AddEditEventCostCenterComponent implements OnInit {
    title = 'Add';
    addEventCostCenterForm: FormGroup;
    costCenterTypeList = [];
    lastAddedCostCenterType: any="Training Type";
    costCenterData: any;
    selectionCostCenterType:any
    selectedCost: any;



    constructor(
        private router: Router,
        public route: ActivatedRoute,
        public _formBuilder: FormBuilder,
        private ApiService: EventManagementCostCenterService,
        private masterCostCenterTypeApi: MasterModulesCostCenterTypeService,
        private helper: MCPHelperService,
        public translate: TranslateService,
        public dialog: MatDialog,
    ) {
        this.addEventCostCenterForm = this._formBuilder.group({
            costcentername: [null, [MCPHelperService.noWhitespaceValidator, Validators.required]],
            costcentercode: [''],
            costcentertype: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.getDetails(id);
        this.getCostCenterType()
    }

    getCostCenterType() {
        this.ApiService.getCostCenterTypeList('').subscribe((res: any) => {
            // console.log(res)
            if (res.statusCode === 200) {
                this.costCenterTypeList = res.data;
                this.lastAddedCostCenterType =this.costCenterData
            }else {
                swal.fire(
                    '',
                    this.translate.instant(res.error.message),
                    'error'
                )
            }
        });
    }

    getDetails(id) {
        if (id !== '0') {
            this.title = 'Edit';
            this.helper.toggleLoaderVisibility(true);
            this.ApiService.editCostCenter({id: id}).subscribe((res: any) => {
                if (res.statusCode === 200) {
                    this.addEventCostCenterForm.patchValue({
                        costcentername: res.data.name,
                        costcentercode: res.data.code,
                        costcentertype: res.data.costCenterTypeId
                    });
                    this.helper.toggleLoaderVisibility(false);
                }
                this.helper.toggleLoaderVisibility(false);
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                this.router.navigate(['master-modules/event-cost-center']);
                swal.fire(
                    '',
                    this.translate.instant(err.error.message),
                    'error'
                )
            });
        }
    }

    openAddCostCentreType() {
        const dialogRef = this.dialog.open(AddCostCenterTypeComponent, {
            data: {
                placeholder: 'INSIGHTS_MENU.Cost_Center_Type',
                heading: 'INSIGHTS_MENU.Add_Cost_Center_Type',
                validation: 'MASTER_MODULE.Val_ENTER_YOUR_COST_CENTER_NAME',
                value: ''
            }
        });
        dialogRef.afterClosed().subscribe(
            async result => {
                if (result) {
                    await this.masterCostCenterTypeApi.addCostCenterType(result).then(res => {
                        const response: any = res
                        this.helper.toggleLoaderVisibility(false);
                        this.selectionCostCenterType = res
                        this.selectedCost = this.selectionCostCenterType.data.id
                        this.addEventCostCenterForm.controls['costcentertype'].setValue(this.selectedCost);
                        this.getCostCenterType()
                        swal.fire('',
                            this.translate.instant(response.meta.message),
                            'success');

                    }, (err => {
                        this.helper.toggleLoaderVisibility(false);
                        swal.fire(
                            '',
                            this.translate.instant(err.error.message),
                            'info'
                        );
                    }));
                }
            });
    }

    onEditConfirmClick(): void {
        if (this.addEventCostCenterForm.valid) {
            this.helper.toggleLoaderVisibility(true);
            const id = this.route.snapshot.paramMap.get('id');
            if (id !== '0') {
                const addUpdateDate = {
                    id: id,
                    name: this.addEventCostCenterForm.value.costcentername,
                    code: this.addEventCostCenterForm.value.costcentercode,
                    costCenterTypeId: this.addEventCostCenterForm.value.costcentertype
                }
                this.addUpdateCostCenterFunc(addUpdateDate);
            } else {
                const addUpdateDate = {
                    name: this.addEventCostCenterForm.value.costcentername,
                    code: this.addEventCostCenterForm.value.costcentercode,
                    costCenterTypeId: this.addEventCostCenterForm.value.costcentertype
                }
                this.addUpdateCostCenterFunc(addUpdateDate);
            }
        }
    }

    addUpdateCostCenterFunc(data): void {
        this.ApiService.addCostCenter(data).subscribe((res: any) => {
            if (res.statusCode === 200) {
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant(res.meta.message),
                    'success'
                )
                this.router.navigate(['master-modules/event-cost-center']);
            }
            this.helper.toggleLoaderVisibility(false);
        }, (err) => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
            )
        });
    }

    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }
}
