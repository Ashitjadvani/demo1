import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {RefuseSupplierDialogComponent} from '../../../popup/refuse-supplier-dialog/refuse-supplier-dialog.component';
import {ProcurementService} from '../../../../../../fe-common-v2/src/lib/services/procurement.service';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import swal from 'sweetalert2';
import {MCPHelperService} from '../../../service/MCPHelper.service';
import {AddEditSupplierEmailComponent} from '../../../popup/add-edit-supplier-email/add-edit-supplier-email.component';
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestMoreDetailDialogComponent} from "../../../popup/request-more-detail-dialog/request-more-detail-dialog.component";

export interface DialogData {
    placeholder: string;
    heading: string;
    validation: string;
}

@Component({
    selector: 'app-manage-supplier',
    templateUrl: './manage-supplier.component.html',
    styleUrls: ['./manage-supplier.component.scss']
})
export class ManageSupplierComponent implements OnInit {
    @ViewChild('tabGroup') tabGroup;
    page = 1;
    itemsPerPage = '10';
    totalItems = 0;
    serviceList = [];
    supplierLogData = [];
    search = '';
    sortKey = 'createdAt';
    sortBy = -1;
    sortClass = 'down';
    noRecordFound = false;
    //RFQDisplayedColumns: string[] = ['CompanyName', 'CompanyRe'ServiceCategory', ferenceEmail', 'Status', 'ViewDetails', 'action'];
    RFQDisplayedColumns: string[] = ['ServiceCategory', 'CompanyName', 'createdAt', 'updatedAt', 'Status', 'ViewDetails', 'action'];
    private searchSubject: Subject<string> = new Subject();
    saveTabInfo: any = '';
    expiredTrue: any = '';
    activeTab: any;
    allCount = 0;
    invitedCount = 0;
    applicationsCount = 0;
    progressCount = 0;
    validateCount = 0;
    activeCount = 0;
    refusedCount = 0;
    declinedCount = 0;
    deactiveCount = 0;
    selectedTab: any;
    isCurrentLang: any;
    currentTab: any = 0;
    sliderChecked: boolean = false;
    deactiveCheckedfalse: boolean = false;
    activeCheckedfalse: boolean = true;
    isCurrentLog: boolean = true;
    userExpired: any;
    statusLabel: string = 'all';
    selectedIndex: number = null;
    authorId: any;
    sidebarMenuName: string;
    manageSupplierTabbing = [
        {label: 'Procurement_Management.All', indexNumber: 'all', count: this.allCount},
        {label: 'Procurement_Management.Invited', indexNumber: '5', count: this.invitedCount},
        {label: 'Procurement_Management.Applications', indexNumber: '4', count: this.applicationsCount},
        {label: 'Procurement_Management.In Progress', indexNumber: '11', count: this.progressCount},
        {label: 'Procurement_Management.To Validate', indexNumber: '12', count: this.validateCount},
        {label: 'Procurement_Management.Active', indexNumber: '1', count: this.activeCount},
        {label: 'Procurement_Management.Deactivate', indexNumber: '2', count: this.deactiveCount},
        {label: 'Procurement_Management.Refused', indexNumber: '6', count: this.refusedCount},
        {label: 'Procurement_Management.Declined', indexNumber: '3', count: this.declinedCount},
    ]

    constructor(
        public dialog: MatDialog,
        private procurementService: ProcurementService,
        public helper: MCPHelperService,
        private translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private route: Router
    ) {
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.authorId = authUser.person.id;
        }
        this._setSearchSubscription();
        this.isCurrentLang = localStorage.getItem('currentLanguage');
    }


    async ngOnInit(): Promise<void> {
        this.sideMenuName();
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params.tab) {
                this.saveTabInfo = params.tab;
            }
        });
        this.selectedTab = this.manageSupplierTabbing.findIndex(x => x.indexNumber == this.saveTabInfo);
        if (this.selectedTab > 0) {
            this.RFQDisplayedColumns = ['ServiceCategory', 'CompanyName', 'createdAt', 'updatedAt', 'ViewDetails', 'action'];
        } else {
            this.RFQDisplayedColumns = ['ServiceCategory', 'CompanyName', 'createdAt', 'updatedAt', 'Status', 'ViewDetails', 'action'];
        }

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params.expire) {
                this.expiredTrue = params.expire;
                if (params.expire == 'Expired' || params.expire == 'thisMonthExpired') {
                    this.sliderChecked = true;
                } else {
                    this.sliderChecked = false;
                }
                //this.showListExpireDocs(true);
                const request = {
                    search: this.search,
                    page: this.page,
                    limit: this.itemsPerPage,
                    sortBy: '',
                    sortKey: '',
                    status: Number(this.saveTabInfo),
                    userExpired: this.expiredTrue
                };
                this.loadServiceList(request);
            }
        });

        if (this.expiredTrue == '') {
            const request = {
                search: '',
                page: this.page,
                limit: this.itemsPerPage,
                sortBy: '',
                sortKey: this.sortKey,
                status: Number(this.saveTabInfo)
            };
            await this.loadServiceList(request);
        }
        this.supplierCountAPI();
    }

    ngAfterViewInit() {
        this.currentTab = this.tabGroup.selectedIndex;
    }

    sideMenuName() {
        this.sidebarMenuName = 'Manage Suppliers';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    async showListExpireDocs(event) {
        this.selectedIndex = null;
        if (event) {
            this.expiredTrue = 'Expired';
            this.pageChanged(1);
            const request = {
                search: this.search,
                page: 1,
                limit: this.itemsPerPage,
                sortBy: '',
                sortKey: '',
                status: Number(this.saveTabInfo),
                userExpired: this.expiredTrue
            };
            await this.loadServiceList(request);
        } else {
            this.expiredTrue = '';
            this.pageChanged(1);
            const request = {
                search: this.search,
                page: 1,
                limit: this.itemsPerPage,
                sortBy: '',
                sortKey: '',
                status: Number(this.saveTabInfo),
                userExpired: ''
            };
            await this.loadServiceList(request);
        }
    }

    supplierCountAPI(): void {
        this.procurementService.supplierCountByStatus().then((data: any) => {
            if (data.data.length > 0) {
                this.allCount = 0;
                this.invitedCount = 0;
                this.applicationsCount = 0;
                this.progressCount = 0;
                this.validateCount = 0;
                this.activeCount = 0;
                this.refusedCount = 0;
                this.declinedCount = 0;
                this.deactiveCount = 0;
                const dataCount = data.data ? data.data : [];
                this.allCount = dataCount.map(all => all.count).reduce((acc, all) => all + acc);
                for (let i = 0; i < dataCount.length; i++) {
                    if (dataCount[i]._id == "5") {
                        this.invitedCount = dataCount[i].count;
                    }
                    if (dataCount[i]._id == "4") {
                        this.applicationsCount = dataCount[i].count;
                    }
                    if (dataCount[i]._id == "11") {
                        this.progressCount = dataCount[i].count;
                    }
                    if (dataCount[i]._id == "12") {
                        this.validateCount = dataCount[i].count;
                    }
                    if (dataCount[i]._id == "1") {
                        this.activeCount = dataCount[i].count;
                    }
                    if (dataCount[i]._id == "6") {
                        this.refusedCount = dataCount[i].count;
                    }
                    if (dataCount[i]._id == "3") {
                        this.declinedCount = dataCount[i].count;
                    }
                    if (dataCount[i]._id == "2") {
                        this.deactiveCount = dataCount[i].count;
                    }
                }
                this.manageSupplierTabbing = [
                    {label: 'Procurement_Management.All', indexNumber: 'all', count: this.allCount},
                    {label: 'Procurement_Management.Invited', indexNumber: '5', count: this.invitedCount},
                    {label: 'Procurement_Management.Applications', indexNumber: '4', count: this.applicationsCount},
                    {label: 'Procurement_Management.In Progress', indexNumber: '11', count: this.progressCount},
                    {label: 'Procurement_Management.To Validate', indexNumber: '12', count: this.validateCount},
                    {label: 'Procurement_Management.Active', indexNumber: '1', count: this.activeCount},
                    {label: 'Procurement_Management.Deactivate', indexNumber: '2', count: this.deactiveCount},
                    {label: 'Procurement_Management.Refused', indexNumber: '6', count: this.refusedCount},
                    {label: 'Procurement_Management.Declined', indexNumber: '3', count: this.declinedCount},
                ]
            }
        }, (err) => {
            swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
            );
        });
    }

    async supplierLogFunction(element, supplierId, index): Promise<void> {
        this.procurementService.supplierLogActivity({supplierId: supplierId}).then((data: any) => {
            this.supplierLogData = data.data;
            if (this.selectedIndex == index) {
                this.selectedIndex = null;
            } else {
                this.selectedIndex = index;
            }
            element.isExpanded = !element.isExpanded;
        });
    }

    async tabChanged(statusType): Promise<void> {
        this.search = '';
        this.sliderChecked = false;
        this.selectedIndex = null;
        this.expiredTrue = '';
        this.currentTab = statusType.index;
        if (this.page > 1) {
            this.pageChanged(1);
            const request = {
                search: '',
                page: 1,
                limit: this.itemsPerPage,
                sortBy: '',
                sortKey: '',
                status: Number(statusType)
            };
            await this.loadServiceList(request);
        }
        statusType = statusType.tab.ariaLabel;
        if (statusType === 'all') {
            this.statusLabel = 'all';
            this.RFQDisplayedColumns = ['ServiceCategory', 'CompanyName', 'createdAt', 'updatedAt', 'Status', 'ViewDetails', 'action'];
        } else {
            this.statusLabel = '';
            this.RFQDisplayedColumns = ['ServiceCategory', 'CompanyName', 'createdAt', 'updatedAt', 'ViewDetails', 'action'];
        }
        this.saveTabInfo = statusType;
        const request = {
            search: '',
            page: 1,
            limit: this.itemsPerPage,
            sortBy: '',
            sortKey: '',
            status: Number(statusType)
        };
        await this.loadServiceList(request);
    }


    async loadServiceList(request): Promise<void> {
        const res: any = await this.procurementService.loadSupplierList(request);
        this.serviceList = res.data;
        this.noRecordFound = this.serviceList.length > 0;
        this.totalItems = res.meta.totalCount;
    }

    onKeyUp(searchTextValue: any): void {
        // this.saveTabInfo
        this.selectedIndex = null;
        this.searchSubject.next(searchTextValue);
    }

    changeSorting(sortKey): void {
        // this.search = '';
        this.sortKey = sortKey;
        this.selectedIndex = null;
        this.sortBy = (this.sortBy === 1) ? -1 : 1;
        this.page = 1;
        this.sortClass = (this.sortBy === 1) ? 'down' : 'up';
        this.loadServiceList({
            page: 1,
            limit: this.itemsPerPage,
            search: this.search,
            sortBy: this.sortBy,
            sortKey,
            status: Number(this.saveTabInfo),
            userExpired: this.expiredTrue
        });
    }

    async requestMoreDetail(id): Promise<void> {
        const dialogRef = this.dialog.open(RequestMoreDetailDialogComponent, {
            data: {
                heading: 'Procurement_Management.Request More Detail',
                id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const request = {
                    search: '',
                    page: this.page,
                    limit: this.itemsPerPage,
                    sortBy: '',
                    sortKey: '',
                    status: Number(this.saveTabInfo)
                };
                this.loadServiceList(request);
                this.supplierCountAPI();
            }
        });
    }

    async deleteDecline(id): Promise<void> {
        this.selectedIndex = null;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                message: 'Procurement_Management.Delete_Supplier_Message',
                heading: 'Procurement_Management.Delete_Supplier'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.procurementService.deleteDeclineAPI({id: id}).then(async (data: any) => {
                    swal.fire(
                        '',
                        this.translate.instant(data.meta.message),
                        'success'
                    );
                    const request = {
                        search: '',
                        page: this.page,
                        limit: this.itemsPerPage,
                        sortBy: '',
                        sortKey: '',
                        status: Number(this.saveTabInfo)
                    };
                    await this.loadServiceList(request);
                    this.supplierCountAPI();
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

    setStatusDialog(e, status, id, index): void {
        this.selectedIndex = null;
        const that = this;
        if (status === 'reject') {
            const dialogRef = this.dialog.open(RefuseSupplierDialogComponent, {
                data: {heading: 'Procurement_Management.Refuse Supplier', status, id}
            });
            this.loadServiceList({
                page: 1,
                limit: this.itemsPerPage,
                search: this.search,
                sortBy: this.sortBy,
                status: Number(this.saveTabInfo),
                userExpired: this.expiredTrue
            });
            dialogRef.afterClosed().subscribe(
                result => {
                    if (result) {
                        // this.getFilteredElements();
                        that.serviceList[index].status = 6;
                        that.serviceList[index].statusName = 'Refused';
                        this.supplierCountAPI();
                    }
                });
        } else if (status === 'deactivate') {
            const dialogRef = this.dialog.open(DeletePopupComponent, {
                data: {
                    heading: 'Procurement_Management.Deactivate_Supplier',
                    message: 'Procurement_Management.Deactivate_Supplier_Message',
                    status,
                    statusNameType: 'deactive',
                    id
                }
            });
            //this.loadServiceList({page: 1,limit: this.itemsPerPage,search: this.search,sortBy: this.sortBy,status: Number(this.saveTabInfo)});
            dialogRef.afterClosed().subscribe(
                result => {
                    //this.deactiveCheckedfalse = false;
                    //this.activeCheckedfalse = true;
                    if (result) {
                        this.helper.toggleLoaderVisibility(true);
                        this.procurementService.serviceAcceptReject({
                            status,
                            id,
                            authorId: this.authorId
                        }).then((data: any) => {
                            this.helper.toggleLoaderVisibility(false);
                            that.serviceList[index].status = 2;
                            that.serviceList[index].statusName = 'Deactivate';
                            this.loadServiceList({
                                page: 1,
                                limit: this.itemsPerPage,
                                search: this.search,
                                sortBy: this.sortBy,
                                status: Number(this.saveTabInfo),
                                userExpired: this.expiredTrue
                            });
                            this.page = 1;
                            this.supplierCountAPI();
                            swal.fire(
                                '',
                                this.translate.instant(data.meta.message),
                                'success'
                            );
                        }, (err) => {
                            this.helper.toggleLoaderVisibility(false);
                            swal.fire(
                                '',
                                this.translate.instant(err.error.message),
                                'info'
                            );
                        });
                    } else {
                        e.source.checked = false;
                    }

                });
        } else if (status === 'active') {
            const dialogRef = this.dialog.open(DeletePopupComponent, {
                data: {
                    heading: 'Procurement_Management.Activate_Supplier',
                    message: 'Procurement_Management.Activate_Supplier_Message',
                    statusNameType: 'active',
                    status,
                    id
                }
            });

            dialogRef.afterClosed().subscribe(
                result => {
                    if (result) {
                        this.helper.toggleLoaderVisibility(true);
                        this.procurementService.serviceAcceptReject({
                            status,
                            id,
                            authorId: this.authorId
                        }).then((data: any) => {
                            this.helper.toggleLoaderVisibility(false);
                            that.serviceList[index].status = 2;
                            that.serviceList[index].statusName = 'Activate';
                            this.loadServiceList({
                                page: 1,
                                limit: this.itemsPerPage,
                                search: this.search,
                                sortBy: this.sortBy,
                                status: Number(this.saveTabInfo),
                                userExpired: this.expiredTrue
                            });
                            this.page = 1;
                            this.supplierCountAPI();
                            swal.fire(
                                '',
                                this.translate.instant(data.meta.message),
                                'success'
                            );
                        }, (err) => {
                            this.helper.toggleLoaderVisibility(false);
                            swal.fire(
                                '',
                                this.translate.instant(err.error.message),
                                'info'
                            );
                        });
                    } else {
                        e.source.checked = false;
                    }

                });
        } else {
            this.helper.toggleLoaderVisibility(true);
            this.procurementService.serviceAcceptReject({status, id, authorId: this.authorId}).then((data: any) => {
                this.helper.toggleLoaderVisibility(false);
                that.serviceList[index].status = 5;
                that.serviceList[index].statusName = 'Invited';
                this.loadServiceList({
                    page: 1,
                    limit: this.itemsPerPage,
                    search: this.search,
                    sortBy: this.sortBy,
                    status: Number(this.saveTabInfo),
                    userExpired: this.expiredTrue
                });
                this.supplierCountAPI();
                swal.fire(
                    '',
                    this.translate.instant(data.meta.message),
                    'success'
                );
            }, (err) => {
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant(err.error.message),
                    'info'
                );
            });
        }
        //this.supplierCountAPI();
    }

    pageChanged(page): void {
        // this.search = '';
        this.selectedIndex = null;
        this.loadServiceList({
            page,
            limit: this.itemsPerPage,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey,
            status: Number(this.saveTabInfo),
            userExpired: this.expiredTrue
        });
        this.page = page;
    }

    changeSelectOption(event): void {
        // this.search = '';
        this.selectedIndex = null;
        this.page = 1;
        this.itemsPerPage = event
        this.loadServiceList({
            page: 1,
            limit: this.itemsPerPage,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey,
            status: Number(this.saveTabInfo),
            userExpired: this.expiredTrue
        });
    }

    private _setSearchSubscription(): void {
        this.selectedIndex = null;
        this.searchSubject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            this.page = 1;
            this.loadServiceList({
                page: 1,
                limit: this.itemsPerPage,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                status: Number(this.saveTabInfo),
                userExpired: this.expiredTrue
            });
        });
    }

    async onRefreshTable(textRefrest) {
        this.selectedIndex = null;
        this.search = '';
        //this.sliderChecked =  false;
        const request = {
            search: '',
            page: this.page,
            limit: this.itemsPerPage,
            sortBy: '',
            sortKey: '',
            status: Number(this.saveTabInfo),
            userExpired: this.expiredTrue
        };
        await this.loadServiceList(request);
        this.supplierCountAPI();
        if (textRefrest == 'refresh') {
            this.pageChanged(1);
        }
        document.body.classList.add('spin-animation');
        setTimeout(function () {
            document.body.classList.remove('spin-animation');
        }, 1000);
    }

    openEditSupplierEmail(id, index): void {
        // this.helper.toggleLoaderVisibility(true);
        const that = this;
        // this.onRefreshTable();
        const dialogRef = this.dialog.open(AddEditSupplierEmailComponent, {
            data: {
                placeholder: 'Procurement_Management.Email',
                heading: 'Procurement_Management.EditEmail',
                validation: 'FORGOT_PASSWORD.EmailIDRequired',
                id: id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.onRefreshTable('editEmail');
            }
        });
    }

    sendReminder(id, email, sendParameter): void {
        this.helper.toggleLoaderVisibility(true);
        this.procurementService.editEmail({
            id: id,
            companyReferenceEmail: email,
            parameterName: sendParameter,
            authorId: this.authorId
        }).then((data: any) => {
            if (data.statusCode === 200) {
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant('Reminder mail sent'),
                    'success'
                );
                this.helper.toggleLoaderVisibility(false);
            }
        }, err => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
            );
        });
    }

    onReInviteEmail(id, email): void {
        this.helper.toggleLoaderVisibility(true);
        this.procurementService.editEmail({
            id: id,
            authorId: this.authorId,
            isReinvite: true,
            companyReferenceEmail: email
        }).then((data: any) => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                // this.translate.instant('Swal_Message.Success'),
                '',
                // data.meta.message,
                this.translate.instant('Swal_Message.Your invitation for collaboration has been sent to the supplier'),
                'success'
            );
            this.helper.toggleLoaderVisibility(false);
        });
    }

    // search reset
    @ViewChild('searchBox') myInputVariable: ElementRef;

    resetSearch() {
        this.search = '';
        this.selectedIndex = null;
        this.myInputVariable.nativeElement.value = '';
        this.page = 1;
        const request = {
            search: '',
            page: this.page,
            limit: this.itemsPerPage,
            sortBy: '',
            sortKey: '',
            status: Number(this.saveTabInfo),
            userExpired: this.expiredTrue
        };
        this.loadServiceList(request);
    }

    sendNotice: boolean = true;

    chnageSendNotice(supplierId: any, sendNoticeValue: any) {

        this.procurementService.updateSupplierEmailNotice({
            id: supplierId,
            sendNoticeEmail: sendNoticeValue,
            authorId : this.authorId
        }).subscribe((res: any) => {
            if (res.statusCode == 200) {
                swal.fire('', this.translate.instant(res.meta.message), 'success');
            } else {
                swal.fire('', this.translate.instant(res.meta.message), 'info');
            }
        });
    }

    sendNoticeFunc(supplierId: any){
        this.procurementService.sendExpiringDocumentNotice({supplierId : supplierId, authorId: this.authorId}).then((data: any) => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant(data.meta.message),
                'success'
            );
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
