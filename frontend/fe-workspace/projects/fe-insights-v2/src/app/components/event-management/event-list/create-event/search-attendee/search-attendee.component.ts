import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
    AttendeeFilterPopupComponent,
    SearchInternalPeopleFilterData
} from "../../../../../popup/attendee-filter-popup/attendee-filter-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {EventHelper, EventRequestParams} from "../../../../../../../../fe-common-v2/src/lib";
import {SelectionModel} from "@angular/cdk/collections";
import {SettingsManagementService} from "../../../../../../../../fe-common-v2/src/lib/services/settings-management.service";
import {MCPHelperService} from "../../../../../service/MCPHelper.service";

@Component({
    selector: 'app-search-attendee',
    templateUrl: './search-attendee.component.html',
    styleUrls: ['./search-attendee.component.scss']
})
export class SearchAttendeeComponent implements OnInit {

    @Input() search: any;
    @Input() showSelectedOnly: boolean;
    @Output() keyUpEvent: EventEmitter<any> = new EventEmitter();
    @Output() showSelectedEvent: EventEmitter<any> = new EventEmitter();
    @Output() applyInternalFilter: EventEmitter<any> = new EventEmitter();
    @Output() resetSearchEvent: EventEmitter<any> = new EventEmitter();
    @Input() headerText: any;
    @Input() selectedInternalPeopleCount: any;
    @Input() totalCount: any;
    @Input() attendeesStepName: any;

    searchInternalPeopleFilterData: SearchInternalPeopleFilterData = new SearchInternalPeopleFilterData();
    activeFilters: any = [];

    selection = new SelectionModel<any>(true, []);
    chipsFilters: any[] = [
        { field: 'scope', caption: 'FilterScope' },
        { field: 'typology', caption: 'FilterTypology' },
        { field: 'area', caption: 'FilterArea' },
        { field: 'role', caption: 'FilterRole' },
        { field: 'jobTitle', caption: 'FilterJobTitle' },
        { field: 'site', caption: 'FilterSite' }
    ];
    constructor(
        public dialog: MatDialog,
        private settingsManagementService: SettingsManagementService,
        private helper: MCPHelperService,
    ) {
        this.helper.clearEventSelectionEmitter.subscribe((name:string) => {
            if (this.attendeesStepName === name){
                this.onChipRemoveAll();
            }
        });
    }

    ngOnInit(): void {
    }

    onKeyUp($event) {
        let searchText: any = this.search;
        this.keyUpEvent.emit(searchText);
    }

    resetSearch() {
        this.resetSearchEvent.emit();
    }

    onFilterListOfEvent() {
        const dialogRef = this.dialog.open(AttendeeFilterPopupComponent, {
            data: {
                data: this.searchInternalPeopleFilterData,
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.searchInternalPeopleFilterData = result;
                this.updateChipsFilter();
                this.applyInternalFilter.emit(this.searchInternalPeopleFilterData);
            }
        });
    }

    onChangeShowSelected($event) {
        this.showSelectedOnly === true ? this.showSelectedOnly = false : this.showSelectedOnly = true;
        this.showSelectedEvent.emit(this.showSelectedOnly);
    }

    updateChipsFilter() {
        this.selection.clear();
        this.activeFilters = [];
        this.chipsFilters?.forEach(cf => {
            if (this.searchInternalPeopleFilterData[cf.field] && ((this.searchInternalPeopleFilterData[cf.field] != '') || (this.searchInternalPeopleFilterData[cf.field] != false))) {
                this.activeFilters.push({
                    columnCaption: cf.caption,
                    filterValue: SearchInternalPeopleFilterData.getFieldText(cf.field, this.searchInternalPeopleFilterData),
                    field: cf.field
                });
            }
        });
    }

    onChipRemoveAll() {
        this.activeFilters = [];
        this.searchInternalPeopleFilterData = new SearchInternalPeopleFilterData();
        this.settingsManagementService.setSettingsValue('listOfEventFilterData_V2', JSON.stringify(this.searchInternalPeopleFilterData));
        this.applyInternalFilter.emit(this.searchInternalPeopleFilterData);
        /*this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.limit, this.searchInternalPeopleFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));*/
    }

    onChipRemove(item) {
        this.selection.clear();
        this.activeFilters = this.activeFilters.filter(af => af.columnCaption != item.columnCaption);
        if (this.activeFilters.length > 0)
            this.searchInternalPeopleFilterData[item.field] = null;
        else
            this.searchInternalPeopleFilterData = new SearchInternalPeopleFilterData();

        this.settingsManagementService.setSettingsValue('listOfEventFilterData_V2', JSON.stringify(this.searchInternalPeopleFilterData));
        this.applyInternalFilter.emit(this.searchInternalPeopleFilterData);
        /*this.getListOfEventList(this.requestPara = new EventRequestParams(1, this.paginationModel.limit, this.searchInternalPeopleFilterData, this.sortBy, this.sortKey, this.filterByDates, this.scopeId));*/
    }

}
