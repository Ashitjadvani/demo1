import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Site } from 'projects/fe-common/src/lib/models/admin/site';
import { Area, Company, Scope } from 'projects/fe-common/src/lib/models/company';
import { Person, PERSON_TYPOLOGY } from 'projects/fe-common/src/lib/models/person';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';

@Component({
    selector: 'app-people-settings-section',
    templateUrl: './people-settings-section.component.html',
    styleUrls: ['./people-settings-section.component.scss']
})
export class PeopleSettingsSectionComponent implements OnInit, OnChanges {
    @Input() currentEditPerson: Person;
    @Input() currentCompany: Company;
    @Input() sites: Site[];
    @Input() persons: Person[];
    @Input() scope: Scope;
    @Input() areasAvailable: Area[];   

    currManager: Person;
    currFunctionalManager: Person;
    personTypologies = PERSON_TYPOLOGY;

    sortedRoles: string[];
    sortedAreas: Area[];
    sortedJobTitles: string[];
    sortedAreasAvailable: Area[];

    constructor(private commonService: CommonService,
        private changeDetectorRef: ChangeDetectorRef) { }

    ngOnChanges(changes: SimpleChanges): void {
        if(this.persons) {
            this.currManager = this.persons.find(p => p.id == this.currentEditPerson.managerId);
            this.currFunctionalManager = this.persons.find(p => p.id == this.currentEditPerson.functionalManagerId);
            this.sortLists();
        }
    }

    ngOnInit() {

    }

    setWorkingTime(index, time) {
        this.currentEditPerson.workingHours[index] = this.commonService.buildDateTimeFromHHMM(new Date(), time);
    }

    getWorkingTime(index) {
        if (this.currentEditPerson.workingHours[index]) {
            return this.commonService.timeFormat(this.currentEditPerson.workingHours[index]); // this.currentEditPerson.workingHours[index].getHours() + ':' + this.currentEditPerson.workingHours[index].getMinutes();
        }
        return '';
    }

    getCurrentManager() {
        return this.currManager ? this.currManager.name + ' ' + this.currManager.surname : '';
    }

    getCurrentFunctionalManager() {
        return this.currFunctionalManager ? this.currFunctionalManager.name + ' ' + this.currFunctionalManager.surname : '';
    }

    onManagerSelected(manager: Person) {
        this.currManager = manager;
        this.currentEditPerson.managerId = manager.id;
        this.currentEditPerson.managerFullName = manager.surname + ' ' + manager.name;

        this.changeDetectorRef.markForCheck();
    }

    onFunctionalManagerSelected(functionalManager: Person) {
        this.currFunctionalManager = functionalManager;
        this.currentEditPerson.functionalManagerId = functionalManager.id;
        this.currentEditPerson.functionalManagerFullName = functionalManager.surname + ' ' + functionalManager.name;

        this.changeDetectorRef.markForCheck();
    }

    sortLists() {
        this.sortedRoles = this.currentCompany.peopleRoles.sort(function(a, b){    
            return ('' + a).localeCompare(b);
        });
        this.sortedJobTitles = this.currentCompany.peopleJobTitles.sort(function(a, b){    
            return ('' + a).localeCompare(b);
        });
        this.sortedAreas = this.currentCompany.areas.sort(function(a, b){    
            return ('' + a.name).localeCompare(b.name);
        });
        this.sortedAreasAvailable = this.areasAvailable.sort(function(a, b){    
            return ('' + a.name).localeCompare(b.name);
        });
    }

    onWorkingTimeChange(index, value) {
        if (this.commonService.isValidHHMM(value))
            this.setWorkingTime(index, value);
        else
            this.currentEditPerson.workingHours[index] = null;
    }
}
