import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';
import { RecrutingJobApplicationManagementService } from '../../../../../../fe-common-v2/src/lib/services/recruting-job-application-management.service';
import { debounceTime } from 'rxjs/operators';
import swal from 'sweetalert2';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import { TranslateService } from '@ngx-translate/core';
import { RecruitingApplicationManagementService } from "../../../../../../fe-common-v2/src/lib/services/recruiting-application-management.service";
import { UserCapabilityService } from '../../../service/user-capability.service';
import { RecruitingManagementService } from '../../../../../../fe-common-v2/src/lib/services/recruiting-management.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FilterJobApplicationsPopupComponent, JobApplicationFilterData } from './filter-job-applications-popup/filter-job-applications-popup.component';
import { SettingsManagementService } from 'projects/fe-common-v2/src/lib/services/settings-management.service';


// Delete popup Dialog data
export interface DialogData {
    message: any;
    heading: any;
    statusNameType: any;
}

// tabel interface
export interface elm {
    jobOpening: string;
    Name: string;
    Surname: string;
    age: number;
    completionDate: string;
    fitIndex: any;
    applicationStatus: string;

}


const bussines_data: elm[] = [];

@Component({
    selector: 'app-job-applications',
    templateUrl: './job-applications.component.html',
    styleUrls: ['./job-applications.component.scss']
})
export class JobApplicationsComponent implements OnInit {
    countDecrease: any;
    countIncrease: any;
    jobAppList: any = new MatTableDataSource([]);
    page: any = 1;
    itemsPerPage: any = '10';
    totalItems: any = 0;
    limit: any = 10;
    sortBy: any = '-1';
    sortKey = null;
    sortClass: any = 'down';
    noRecordFound = false;
    filter: any;
    public config: PaginationInstance = {
        id: 'advanced',
        itemsPerPage: 5,
        currentPage: this.page
    };
    public requestPara = { search: null, page: 1, limit: 10, sortBy: '', sortKey: '', type: '', jobId: '' };
    //displayedColumns: string[] = ['jobOpening', 'jobType', 'Surname', 'Name', 'Gender', 'age', 'University', 'Degreeyear', 'Degreemark', 'Degreemarkaverage', 'LevelofEducation', 'completionDate', 'fitIndex', 'applicationStatus', 'viewDetails', 'action'];
    displayedColumns: string[] = ['select', 'view', 'jobOpening', 'jobType', 'Surname', 'Name', 'Gender', 'age', 'University', 'Degreeyear', 'Degreemark', 'Degreemarkaverage', 'LevelofEducation', 'completionDate', 'fitIndex', 'applicationStatus'];
    dataSource = bussines_data;
    resultsLength = 0;
    public selectedRow: any = [];
    private subject: Subject<string> = new Subject();
    jobId: any = null;
    thisWeekTrue: any = '';
    thisWeekCheck: boolean = false;
    jobOpeningdata: any;
    sidebarMenuName:string;
    activeFilters: any[] = [];
    chipsFilters: any[] = [
        { field: 'jobOpening', caption: 'Job Opening' },
        { field: 'jobArea', caption: 'Job Area' },
        { field: 'jobType', caption: 'Jop Type' },
        { field: 'surname', caption: 'Surname' },
        { field: 'name', caption: 'Name' },
        { field: 'gender', caption: 'Gender' },
        { field: 'minAge', caption: 'Min Age' },
        { field: 'maxAge', caption: 'Max Age' },
        { field: 'university', caption: 'University' },
        { field: 'degreeYear', caption: 'Degree Year' },
        { field: 'minDegree', caption: 'Min Degree' },
        { field: 'maxDegree', caption: 'Max Degree' },
        { field: 'eduLevel', caption: 'Education' },
        { field: 'completionDate', caption: 'Completion Date' },
        { field: 'fitIndex', caption: 'Fit Index' },
        { field: 'status', caption: 'Status' },
        { field: 'showUnread', caption: 'Show Unread' },
    ];
    jobApplicationFilterData: JobApplicationFilterData = new JobApplicationFilterData();
    @ViewChild('table') table: MatTable<any>;

    allowDelete: boolean;
    allowEdit: boolean;

    constructor(public dialog: MatDialog,
        private router: Router,
        private ApiService: RecrutingJobApplicationManagementService,
        private recruitingManagementService: RecruitingManagementService,
        private userCapabilityService: UserCapabilityService,
        private helper: MCPHelperService,
        public translate: TranslateService,
        public activatedRoute: ActivatedRoute,
        private settingsManagementService: SettingsManagementService,
        private recruitingManagementApplicationService: RecruitingApplicationManagementService) {
        this._setSearchSubscription();
        this.allowDelete = this.userCapabilityService.isFunctionAvailable('JobApplications/Delete');
        this.allowEdit = this.userCapabilityService.isFunctionAvailable('JobApplications/Edit');
    }


    async ngOnInit(): Promise<void> {
        this.sideMenuName();
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params.value) {
                this.thisWeekTrue = params.value;
                if (params.value == 'applicationThisWeek') {
                    this.thisWeekCheck = true;
                } else {
                    this.thisWeekCheck = false;
                }
            }
        });
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params.id) {
                this.jobId = params.id;
                this.loadRecruitingApplication();
            }else {
              this.requestPara = { search: '', page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue, jobId: '' };
              this.getJobList(this.requestPara);
            }
        });
        this.requestPara = { search: null, page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue, jobId: this.jobId }
        if (this.jobId === null) {
            let jaf = this.settingsManagementService.getSettingsValue('JobApplicationFilterData_V2');
            if (jaf) {
                this.jobApplicationFilterData = JSON.parse(jaf);
                this.updateChipsFilter();

                await this.getJobList(this.requestPara = {
                    page: 1,
                    limit: this.limit,
                    search: this.jobApplicationFilterData,
                    sortBy:  this.sortBy,
                    sortKey: this.sortKey, type: this.thisWeekTrue,
                    jobId: this.jobId
                });

            } else {
                await this.getJobList({});
            }
        }
    }

    sideMenuName(){
        this.sidebarMenuName = 'Job Applications';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    async showThisWeekList(event) {
        this.selection.clear();
        if (event) {
            this.thisWeekTrue = 'applicationThisWeek';
            this.pageChanged(1);
            this.requestPara = { search: this.jobApplicationFilterData, page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue, jobId: this.jobId };
            await this.getJobList(this.requestPara);
        } else {
            this.thisWeekTrue = '';
            this.pageChanged(1);
            this.requestPara = { search: this.jobApplicationFilterData, page: 1, limit: 10, sortBy: '', sortKey: '', type: this.thisWeekTrue, jobId: this.jobId };
            await this.getJobList(this.requestPara);
        }
    }

    async loadRecruitingApplication() {
        this.jobOpeningdata = await this.recruitingManagementService.getJobOpeningById(this.jobId);
        const res: any = await this.recruitingManagementApplicationService.getApplicationList({ jobId: this.jobId });
        if (res.statusCode === 200) {
            this.jobAppList = res.data;
            this.totalItems = res.meta.totalCount;
            this.noRecordFound = this.jobAppList.length > 0;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            // const e = err.error;
            swal.fire(
                '',
                // err.error.message,
                this.translate.instant(res.reason),
                'info'
            );
        }
    }

    backToJobOpening(): void {
        this.router.navigate(['recruiting/job-openings/view-application/' + this.jobId]);
    }

    async getJobList(request): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        // if (this.thisWeekTrue !== ''){
        //   this.requestPara = {search: this.search, page: this.page, limit: this.limit, sortBy: this.sortBy, sortKey: this.sortKey, type : this.thisWeekTrue};
        // }
        const res: any = await this.ApiService.getJobApplication(this.requestPara);
        if (res.statusCode === 200) {
            this.jobAppList = res.data;
            this.totalItems = res.meta.totalCount;
            this.noRecordFound = this.jobAppList.length > 0;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            // const e = err.error;
            swal.fire(
                '',
                // err.error.message,
                this.translate.instant(res.reason),
                'info'
            );
        }
        var elements = document.getElementsByClassName("job-apllication-count");
        // if (this.jobId === null) {
        //   this.thisWeekTrue = '';
        // }
    }

    openDeleteDialog(event: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: { message: 'Are you sure you want to delete this job Applications?', heading: 'Delete Job Application' }
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (result) {
                    this.helper.toggleLoaderVisibility(true);
                    that.ApiService.deleteJobApp(event.id).then((data: any) => {
                        const metaData: any = data.reason;
                        this.getJobList(this.requestPara);
                        this.selection.clear();
                        swal.fire(
                            '',
                            this.translate.instant('Job application has been deleted successfully'),
                            'success'
                        );
                        this.helper.toggleLoaderVisibility(false);
                        if((this.jobAppList.length - 1) == 0){
                            let pageNumber = this.page - 1
                            this.pageChanged(pageNumber)
                            // that.getRole(this.requestParaR);
                            this.table.renderRows();
                          }
                          else{
                            that.getJobList(this.requestPara);
                          }
                        this.selection.clear();
                    }, (err) => {
                        this.helper.toggleLoaderVisibility(false);
                        const e = err.error;
                        swal.fire(
                            '',
                            this.translate.instant(err.error.message),
                            'info'
                        );
                        this.selection.clear();
                    });
                }
            });
    }

    onKeyUp(searchTextValue: any): void {
        this.selection.clear();
        this.subject.next(searchTextValue);
    }

    // Sorting
    changeSorting(sortKey, sortBy): void {
        // this.search = '';
        this.selection.clear();
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.page = 1;
        this.getJobList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.jobApplicationFilterData,
            sortBy:  this.sortBy,
            sortKey: this.sortKey,
            type: this.thisWeekTrue,
            jobId: this.jobId
        });
    }

    // Pagination
    changeItemsPerPage(event): void {
        // this.search = '';
        this.selection.clear();
        this.page = 1;
        this.itemsPerPage = event
        this.getJobList(this.requestPara = {
            page: 1,
            limit: this.itemsPerPage,
            search: this.jobApplicationFilterData,
            sortBy:  this.sortBy,
            sortKey: this.sortKey,
            type: this.thisWeekTrue,
            jobId: this.jobId
        });
        this.limit = this.itemsPerPage;
    }

    pageChanged(page): void {
        // this.search = '';
        this.selection.clear();
        this.getJobList(this.requestPara = {
            page, limit: this.itemsPerPage,
            search: this.jobApplicationFilterData,
            sortBy:  this.sortBy,
            sortKey: this.sortKey, type: this.thisWeekTrue,
            jobId: this.jobId
        });
        this.page = page;
    }

    private _setSearchSubscription(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {

            this.selection.clear();
            this.page = 1;
            this.getJobList(this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.jobApplicationFilterData,
                sortBy:  this.sortBy,
                sortKey: this.sortKey,
                type: this.thisWeekTrue,
                jobId: this.jobId
            });
        });
    }
    // search reset
    @ViewChild('searchBox') myInputVariable: ElementRef;
    resetSearch(): void {
        this.selection.clear();
        this.jobApplicationFilterData.freeSearch = null;
        this.settingsManagementService.setSettingsValue('JobApplicationFilterData_V2', JSON.stringify(this.jobApplicationFilterData));

        this.myInputVariable.nativeElement.value = '';
        this.getJobList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.jobApplicationFilterData,
            sortBy:  this.sortBy,
            sortKey: this.sortKey, type: this.thisWeekTrue,
            jobId: this.jobId
        });
    }
    // View Detail
    async viewDetail(event) {
        this.settingsManagementService.setSettingsValue('JobApplicationFilterData_V2', JSON.stringify(this.jobApplicationFilterData));

        let appRead: any = await this.recruitingManagementApplicationService.readApplicationStatus({ id: event.id });
        this.userCapabilityService.dashboardRecruitingCount(appRead.data);
        this.helper.updateSideMenuData();
        this.router.navigate([`/recruiting/job-applications/view-job-applications/` + event.id]);
        // var elements = document.getElementsByClassName("job-apllication-count");
        // for(var i = 0; i< this.jobAppList.length; i++){
        //   if(this.jobAppList[i].isReadJob == true){
        //   for(var j = 0; j < elements.length; j++){
        //     this.countDecrease = Number(elements[j].innerHTML);
        //       if(this.countDecrease> 0){
        //         this.countDecrease = (this.countDecrease - 1);
        //         elements[j].innerHTML = this.countDecrease;
        //       }
        //     }
        //   }
        // }
    }
    // Edit
    edit(event): void {
        this.settingsManagementService.setSettingsValue('JobApplicationFilterData_V2', JSON.stringify(this.jobApplicationFilterData));

        this.router.navigate([`/recruiting/job-applications/edit-job-applications/` + event.id]);
    }

    // multiple delete
    checkboxvalue: boolean = false;

    toggleAllSelection(checkboxvalue: any) {
        for (var i = 0; i < this.jobAppList.length; i++) {
            this.jobAppList[i].checked = checkboxvalue.checked;
            if (checkboxvalue.checked) {
                this.checkboxvalue = true;
            } else {
                this.checkboxvalue = false;
            }
        }
    }

    selection = new SelectionModel<any>(true, []);

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.jobAppList.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.jobAppList);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }


    applicationID = []
    async deleteMultiApplication() {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
              message:
                'Are you sure you want to delete selected Job Applications?',
              heading: 'Delete Job Applications',
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              const that = this

        this.helper.toggleLoaderVisibility(true);
        this.selectedItems();
        if (this.applicationID.length > 0) {
            this.helper.deleteMultiApplications({ id: this.applicationID }).subscribe((res: any) => {
                if (res.result === true) {
                    this.getJobList(this.requestPara);
                    this.helper.toggleLoaderVisibility(false);
                    this.selection.clear();
                    this.applicationID = [];
                    swal.fire(
                        '',
                        this.translate.instant('Job application has been deleted successfully'),
                        'success'
                    );
                    setTimeout(() => {
                        if((this.jobAppList.length) == 0){
                            let pageNumber = this.page - 1
                            this.pageChanged(pageNumber)
                            // that.getRole(this.requestParaR);
                            this.table.renderRows();
                          }
                          else{
                            that.getJobList(this.requestPara);
                          }
                    }, 200);
                } else {
                    this.helper.toggleLoaderVisibility(false);
                    swal.fire(
                        '',
                        this.translate.instant(res.reason),
                        'error'
                    );
                }
            })
        } else {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant('Please select atleast one application to delete.'),
                'info'
            );
        }
    }});}

    async selectedItems() {
        for (let i = 0; i < this.selection.selected.length; i++) {
            if (this.selection.selected) {
                let paraName: string = this.selection.selected[i].id;
                console.log('paraName', paraName);
                this.applicationID.push(paraName);
            }
        }
    }

    onChipRemoveAll() {
        this.activeFilters = [];
        this.jobApplicationFilterData = new JobApplicationFilterData();

        this.settingsManagementService.setSettingsValue('JobApplicationFilterData_V2', JSON.stringify(this.jobApplicationFilterData));

        this.getJobList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.jobApplicationFilterData,
            sortBy:  this.sortBy,
            sortKey: this.sortKey, type: this.thisWeekTrue,
            jobId: this.jobId
        });
    }

    onChipRemove(item) {
        this.selection.clear();
        this.activeFilters = this.activeFilters.filter(af => af.columnCaption != item.columnCaption);
        if (this.activeFilters.length > 0)
            this.jobApplicationFilterData[item.field] = null;
        else
            this.jobApplicationFilterData = new JobApplicationFilterData();

        this.settingsManagementService.setSettingsValue('JobApplicationFilterData_V2', JSON.stringify(this.jobApplicationFilterData));

        this.getJobList(this.requestPara = {
            page: 1,
            limit: this.limit,
            search: this.jobApplicationFilterData,
            sortBy:  this.sortBy,
            sortKey: this.sortKey, type: this.thisWeekTrue,
            jobId: this.jobId
        });
    }

    updateChipsFilter() {
        this.selection.clear();
        this.activeFilters = [];
        this.chipsFilters.forEach(cf => {
            if (this.jobApplicationFilterData[cf.field] && ((this.jobApplicationFilterData[cf.field] != '') || (this.jobApplicationFilterData[cf.field] != false))) {
                this.activeFilters.push({
                    columnCaption: cf.caption,
                    filterValue: JobApplicationFilterData.getFieldText(cf.field, this.jobApplicationFilterData),
                    field: cf.field
                });
            }

        })
    }

    onFilterJobApplications() {
        this.selection.clear();
        const dialogRef = this.dialog.open(FilterJobApplicationsPopupComponent, {
            data: this.jobApplicationFilterData
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.jobApplicationFilterData = result;
                this.updateChipsFilter();

                this.getJobList(this.requestPara = {
                    page: 1,
                    limit: this.limit,
                    search: this.jobApplicationFilterData,
                    sortBy:  this.sortBy,
                    sortKey: this.sortKey, type: this.thisWeekTrue,
                    jobId: this.jobId
                });
            }
        });
    }

    async onRefreshTable() {
        let jaf = this.settingsManagementService.getSettingsValue('JobApplicationFilterData_V2');
        if (jaf) {
            this.jobApplicationFilterData = JSON.parse(jaf);
            this.updateChipsFilter();

            await this.getJobList(this.requestPara = {
                page: 1,
                limit: this.limit,
                search: this.jobApplicationFilterData,
                sortBy:  this.sortBy,
                sortKey: this.sortKey, type: this.thisWeekTrue,
                jobId: this.jobId
            });

        } else {
            await this.getJobList({});
        }
    }
}
