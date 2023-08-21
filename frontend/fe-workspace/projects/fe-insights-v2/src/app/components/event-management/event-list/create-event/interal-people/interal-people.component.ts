import {SelectionModel} from '@angular/cdk/collections';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {EventManagementListOfEventService} from 'projects/fe-common-v2/src/lib/services/event-management-list-of-event.service';
import {MCPHelperService} from "../../../../../service/MCPHelper.service";

@Component({
    selector: 'app-interal-people',
    templateUrl: './interal-people.component.html',
    styleUrls: ['./interal-people.component.scss']
})
export class InteralPeopleComponent implements OnInit, OnChanges {

    @Output() rowToggle: EventEmitter<any> = new EventEmitter();
    @Output() allSelected: EventEmitter<any> = new EventEmitter();
    @Output() labelCheckox: EventEmitter<any> = new EventEmitter();
    @Output() sortColumn: EventEmitter<any> = new EventEmitter();
    @Output() filter: EventEmitter<any> = new EventEmitter();
    @Input() internalPeoplesList: any = [];
    @Input() saveInternalOwner: any = [];
    @Input() saveInternalOrganize: any = [];
    @Input() saveInternalSpeaker: any = [];
    @Input() saveInternalAttendee: any = [];
    @Input() saveInternalTechnicalSupport: any = [];
    @Input() saveInternalAssistant: any = [];
    @Input() selectedExternalPeopleCount: number;
    @Input() interPeopleDisplayedColumns: string[];
    @Input() searchExternal: string;
    @Input() sortBy: any = '-1';
    @Input() sortKey = null;
    @Output() addEvent: EventEmitter<any> = new EventEmitter();
    @Output() outputValue: EventEmitter<any> = new EventEmitter();
    @Input() addButtonText: any = '';
    @Input() stepName: any = '';

    selection = new SelectionModel<any>(true, []);

    event = {
        target: {
            value: ''
        }
    }

    constructor(public translate: TranslateService, public eventAPI: EventManagementListOfEventService, public dialog: MatDialog, private helper: MCPHelperService,) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.ngOnInit(); // Need this function t un commen but due to this it does not allow to check the chekbox.
    }

    ngOnInit(): void {
        var data: any;
        if (this.stepName == "owner") {
            data = this.saveInternalOwner;
        }
        if (this.stepName == "organizer") {
            data = this.saveInternalOrganize;
        }
        if (this.stepName == "speaker") {
            data = this.saveInternalSpeaker
        }
        if (this.stepName == "attendee") {
            data = this.saveInternalAttendee
        }
        if (this.stepName == "technicalSupport") {
            data = this.saveInternalTechnicalSupport
        }
        if (this.stepName == "assistant") {
            data = this.saveInternalAssistant
        }

        let self = this;
        if (data?.length > 0 && this.internalPeoplesList?.length > 0) {
            data.forEach(x => {
                var result = this.selection.selected.find(
                    y => y.id == x.id &&
                        y.name == x.name &&
                        y.email == x.email &&
                        y.surname == x.surname &&
                        (y.invitataion ? y.invitataion : 'invitataion') == (x.invitataion ? x.invitataion : 'pending') &&
                        (y.eventCreditCount ? y.eventCreditCount : 'eventCreditCount') == (x.eventCreditCount ? x.eventCreditCount : 0) &&
                        (y.isEmailSent ? y.isEmailSent : 'isEmailSent') == (x.isEmailSent ? x.isEmailSent : false) &&
                        (y.attendeeId ? y.attendeeId : 'attendeeId') == (x.attendeeId ? x.attendeeId : '') &&
                        (y.checkPointsCompiled ? y.checkPointsCompiled : 'checkPointsCompiled') == (x.checkPointsCompiled ? x.checkPointsCompiled : false)
                );
                if (!result) {
                    this.selection.selected.push({
                        id: x.id,
                        name: x.name,
                        email: x.email,
                        surname: x.surname,
                        invitataion: x.invitataion ? x.invitataion : 'pending',
                        eventCreditCount: x.eventCreditCount ? x.eventCreditCount : 0,
                        isEmailSent: x.isEmailSent ? x.isEmailSent : false,
                        attendeeId: x.attendeeId ? x.attendeeId : '',
                        checkPointsCompiled: x.checkPointsCompiled ? x.checkPointsCompiled : false

                    })
                }
            })
        }
        if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
            var filteredArray = this.internalPeoplesList.filter(function (array_el) {
                return self.selection.selected.filter(function (anotherOne_el) {
                    return anotherOne_el.id == array_el.id;
                }).length > 0
            });


            if (filteredArray && filteredArray.length > 0) {
                filteredArray.forEach((element) => {
                    this.selection.select(element);
                });
            }

            // this.internalPeoplesList.forEach(row => {
            //   var data = this.selection.selected.find(a => a.id == row.id);
            //   if (data) {
            //     this.selection.toggle(row);
            //   }
            // });
        }
    }


    toggleAllRows() {
        this.selection.clear();
        if (this.isAllSelected()) {
            this.selection.deselect(...this.internalPeoplesList);
            this.selection.clear();
            if (this.stepName == "owner") {
                this.saveInternalOwner = [];
                let obj = {
                    saveInternalOwner: [...this.saveInternalOwner],
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
            if (this.stepName == "organizer") {
                this.saveInternalOrganize = [];
                let obj = {
                    saveInternalOrganize: [...this.saveInternalOrganize],
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
            if (this.stepName == "speaker") {
                this.saveInternalSpeaker = [];
                let obj = {
                    saveInternalSpeaker: [...this.saveInternalSpeaker],
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
            if (this.stepName == "attendee") {
                this.saveInternalAttendee = [];
                let obj = {
                    saveInternalAttendee: [...this.saveInternalAttendee],
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
            if (this.stepName == "technicalSupport") {
                this.saveInternalTechnicalSupport = [];
                let obj = {
                    saveInternalTechnicalSupport: [...this.saveInternalTechnicalSupport],
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
            if (this.stepName == "assistant") {
                this.saveInternalAssistant = [];
                let obj = {
                    saveInternalAssistant: [...this.saveInternalAssistant],
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
        } else {
            this.selection.select(...this.internalPeoplesList);
            if (this.stepName == "owner") {
                this.updateSelectedInternalList(this.saveInternalOwner);
                this.saveInternalOwner = this.selection.selected;
                let obj = {
                    saveInternalOwner: this.saveInternalOwner,
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
            if (this.stepName == "organizer") {
                this.updateSelectedInternalList(this.saveInternalOrganize);
                this.saveInternalOrganize = this.selection.selected;
                let obj = {
                    saveInternalOrganize: this.saveInternalOrganize,
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
            if (this.stepName == "speaker") {
                this.updateSelectedInternalList(this.saveInternalSpeaker);
                this.saveInternalSpeaker = this.selection.selected;
                let obj = {
                    saveInternalSpeaker: this.saveInternalSpeaker,
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
            if (this.stepName == "attendee") {
                this.updateSelectedInternalList(this.saveInternalAttendee);
                this.saveInternalAttendee = this.selection.selected;
                let obj = {
                    saveInternalAttendee: this.saveInternalAttendee,
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
            if (this.stepName == "technicalSupport") {
                this.updateSelectedInternalList(this.saveInternalTechnicalSupport);
                this.saveInternalTechnicalSupport = this.selection.selected;
                let obj = {
                    saveInternalTechnicalSupport: this.saveInternalTechnicalSupport,
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
            if (this.stepName == "assistant") {
                this.updateSelectedInternalList(this.saveInternalAssistant);
                this.saveInternalAssistant = this.selection.selected;
                let obj = {
                    saveInternalAssistant: this.saveInternalAssistant,
                    stepName: this.stepName
                };
                this.outputValue.emit(obj)
            }
        }

    }

    isAllSelected() {
        let data: any
        if (this.stepName == "owner") {
            data = this.saveInternalOwner;
        }
        if (this.stepName == "organizer") {
            data = this.saveInternalOrganize;
        }
        if (this.stepName == "speaker") {
            data = this.saveInternalSpeaker
        }
        if (this.stepName == "attendee") {
            data = this.saveInternalAttendee
        }
        if (this.stepName == "technicalSupport") {
            data = this.saveInternalTechnicalSupport
        }
        if (this.stepName == "assistant") {
            data = this.saveInternalAssistant
        }
        const numSelected = data.length;
        const numRows = this.internalPeoplesList.length;
        return numSelected === numRows;
    }

    checkboxLabel(row?: any) {
        this.labelCheckox.emit(row);
    }

    changeSorting(columnName: any, sortByColumn: any) {
        var obj: any = {
            sortKey: columnName,
            sortBy: sortByColumn,
        }
        this.sortColumn.emit(obj);
    }

    applyFilter($event: any) {
        this.filter.emit($event)
    }

    resetExternalSearch() {
        this.searchExternal = '';
        this.filter.emit(this.event)
    }

    addDataEvent() {
        this.addEvent.emit();
    }

    filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];

    change(event: any, row: any) {
        this.selection.toggle(row);
        let uniqueSelection = this.removeDuplicates(this.selection.selected, 'id');
        if (!this.selection.isSelected(row)) {
            this.selection.deselect(row)
            uniqueSelection = uniqueSelection.filter((item) => item.id !== row.id)
        }
        if (this.stepName === 'owner') {
            let savedInternal = this.getCommon(this.saveInternalOwner, uniqueSelection, this.isSameUser);
            let selectedSelection = this.onlyInLeft(uniqueSelection, this.saveInternalOwner, this.isSameUser)
            this.saveInternalOwner = [...savedInternal, ...selectedSelection];
            let obj = {
                saveInternalOwner: this.saveInternalOwner,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
        if (this.stepName == "organizer") {
            let savedInternal = this.getCommon(this.saveInternalOrganize, uniqueSelection, this.isSameUser);
            let selectedSelection = this.onlyInLeft(uniqueSelection, this.saveInternalOrganize, this.isSameUser)
            this.saveInternalOrganize = [...savedInternal, ...selectedSelection];
            let obj = {
                saveInternalOrganize: this.saveInternalOrganize,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
        if (this.stepName == "speaker") {
            let savedInternal = this.getCommon(this.saveInternalSpeaker, uniqueSelection, this.isSameUser);
            let selectedSelection = this.onlyInLeft(uniqueSelection, this.saveInternalSpeaker, this.isSameUser)
            this.saveInternalSpeaker = [...savedInternal, ...selectedSelection];
            let obj = {
                saveInternalSpeaker: this.saveInternalSpeaker,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
        if (this.stepName == "attendee") {
            let savedInternal = this.getCommon(this.saveInternalAttendee, uniqueSelection, this.isSameUser);
            let selectedSelection = this.onlyInLeft(uniqueSelection, this.saveInternalAttendee, this.isSameUser)
            this.saveInternalAttendee = [...savedInternal, ...selectedSelection];
            let obj = {
                saveInternalAttendee: this.saveInternalAttendee,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
        if (this.stepName == "technicalSupport") {
            let savedInternal = this.getCommon(this.saveInternalTechnicalSupport, uniqueSelection, this.isSameUser);
            let selectedSelection = this.onlyInLeft(uniqueSelection, this.saveInternalTechnicalSupport, this.isSameUser)
            this.saveInternalTechnicalSupport = [...savedInternal, ...selectedSelection];
            let obj = {
                saveInternalTechnicalSupport: this.saveInternalTechnicalSupport,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
        if (this.stepName == "assistant") {
            let savedInternal = this.getCommon(this.saveInternalAssistant, uniqueSelection, this.isSameUser);
            let selectedSelection = this.onlyInLeft(uniqueSelection, this.saveInternalAssistant, this.isSameUser)
            this.saveInternalAssistant = [...savedInternal, ...selectedSelection];
            let obj = {
                saveInternalAssistant: this.saveInternalAssistant,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
    }

    getCommon = (left, right, compareFunction) =>
        left.filter(leftValue =>
            right.some(rightValue =>
                compareFunction(leftValue, rightValue)));
    isSameUser = (a: any, b: any) => a.id === b.id;

    removeDuplicates(myArray, Prop) {
        return myArray.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[Prop]).indexOf(obj[Prop]) === pos;
        });
    }

    onlyInLeft = (left, right, compareFunction) =>
        left.filter(leftValue =>
            !right.some(rightValue =>
                compareFunction(leftValue, rightValue)));

    /*change(event: any, row: any) {
        if (this.stepName == "owner") {
            if (!event.checked) {
                this.selection.deselect(row);
            }
            this.updateSelectedInternalList(this.saveInternalOwner);
            this.saveInternalOwner = this.selection.selected;
            let obj = {
                saveInternalOwner: this.saveInternalOwner,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
        if (this.stepName == "organizer") {
            if (!event.checked) {
                this.selection.deselect(row)
            }
            this.updateSelectedInternalList(this.saveInternalOrganize);
            this.saveInternalOrganize = this.selection.selected
            let obj = {
                saveInternalOrganize: this.saveInternalOrganize,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
        if (this.stepName == "speaker") {
            if (!event.checked) {
                this.selection.deselect(row)
            }
            this.updateSelectedInternalList(this.saveInternalSpeaker);
            this.saveInternalSpeaker = this.selection.selected;
            let obj = {
                saveInternalSpeaker: this.saveInternalSpeaker,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
        if (this.stepName == "attendee") {
            if (!event.checked) {
                this.selection.deselect(row)
            }
            this.updateSelectedInternalList(this.saveInternalAttendee);
            this.saveInternalAttendee = this.selection.selected;
            let obj = {
                saveInternalAttendee: this.saveInternalAttendee,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
        if (this.stepName == "technicalSupport") {
            if (!event.checked) {
                this.selection.deselect(row)
            }
            this.updateSelectedInternalList(this.saveInternalTechnicalSupport);
            this.saveInternalTechnicalSupport = this.selection.selected;
            let obj = {
                saveInternalTechnicalSupport: this.saveInternalTechnicalSupport,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }
        if (this.stepName == "assistant") {
            if (!event.checked) {
                this.selection.deselect(row)
            }
            this.updateSelectedInternalList(this.saveInternalAssistant);
            this.saveInternalAssistant = this.selection.selected;
            let obj = {
                saveInternalAssistant: this.saveInternalAssistant,
                stepName: this.stepName
            };
            this.outputValue.emit(obj)
        }

    }*/
    updateSelectedInternalList(saveInternal: any) {
        if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
            for (let i = 0; saveInternal.length > i; i++) {
                for (let n = 0; this.selection.selected.length > n; n++) {
                    if ((saveInternal[i].email === this.selection.selected[n].email) &&
                        (saveInternal[i].id === this.selection.selected[n].id) &&
                        (saveInternal[i].name === this.selection.selected[n].name) &&
                        (saveInternal[i].surname === this.selection.selected[n].surname)) {
                        this.selection.selected[n] = {
                            invitataion: saveInternal[i].invitataion,
                            eventCreditCount: saveInternal[i].eventCreditCount,
                            isEmailSent: saveInternal[i].isEmailSent,
                            attendeeId: saveInternal[i].attendeeId,
                            checkPointsCompiled: saveInternal[i].checkPointsCompiled,
                            ...this.selection.selected[n]
                        }
                    }
                }
            }
        }
    }
}
