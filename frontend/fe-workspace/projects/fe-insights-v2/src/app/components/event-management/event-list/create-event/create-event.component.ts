import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Injector,
    Input,
    OnChanges,
    OnInit,
    ViewChild
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from "@angular/material/stepper";
import swal from "sweetalert2";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {EventManagementScopesService} from "../../../../../../../fe-common-v2/src/lib/services/event-management-scopes.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {EventManagementListOfEventService} from "../../../../../../../fe-common-v2/src/lib/services/event-management-list-of-event.service";
import {SiteService} from "../../../../../../../fe-common-v2/src/lib/services/site.service";
import {EventManagementExternalVenuesService} from "../../../../../../../fe-common-v2/src/lib/services/event-management-external-venues.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption} from "@angular/material/core";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {AdminUserManagementService} from "../../../../../../../fe-common-v2/src/lib/services/admin-user-management.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {DeletePopupComponent} from "../../../../popup/delete-popup/delete-popup.component";
import {AddExternalPeoplePopupComponent} from "../../../../popup/add-external-people-popup/add-external-people-popup.component";
import {PeriodicElement} from "../../../quiz-survey/questions/add-edit-question/add-edit-question.component";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import Swal from 'sweetalert2';
import {EventHelper} from 'projects/fe-common-v2/src/lib';
import {MasterDocumentTypeService} from 'projects/fe-common-v2/src/lib/services/master-document-type.service';
import {request} from 'http';
import {environment} from "../../../../../environments/environment";
import {HttpResponse} from "@angular/common/http";
import {RecruitingManagementService} from "../../../../../../../fe-common-v2/src/lib/services/recruiting-management.service";
import {DomSanitizer} from "@angular/platform-browser";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import * as FileSaver from "file-saver";
import {DataStorageManagementService} from "../../../../../../../fe-common-v2/src/lib/services/data-storage-management.service";
import {AddEditSingleFieldPopupComponent} from "../../../../popup/add-edit-single-field-popup/add-edit-single-field-popup.component";
import {GoogleCalendarAuthService} from "../../../../../../../fe-common/src/lib/services/google-calendar-auth.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort, Sort} from "@angular/material/sort";

// @ts-ignore
import moment from 'moment-timezone';
import {AttendeeFilterPopupComponent} from "../../../../popup/attendee-filter-popup/attendee-filter-popup.component";
import {EventStatus} from "../../../../../../../fe-common-v2/src/lib/enums/event-status.enum";
import {ConfirmPopupComponent} from "../../../../popup/confirm-popup/confirm-popup.component";
import {char} from "@zxing/library/es2015/customTypings";

declare var gapi: any;
export const PICK_FORMATS = {
    parse: {
        parse: {dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'}},
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'D MMM YYYY',
    }
};

@Component({
    selector: 'app-create-event',
    templateUrl: './create-event.component.html',
    styleUrls: ['./create-event.component.scss'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: {showError: true},
        },
        {provide: MAT_DATE_LOCALE, useValue: 'it'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    ],
})
export class CreateEventComponent implements OnInit, AfterViewInit {
    enviorment: any = environment;
    id: any = 0;
    conditionTextId: boolean = false;
    companyId: any;
    createTimeId: any;
    authorId: any;
    isLinear: boolean = true;
    attendeesStepperControl: boolean = false;
    @ViewChild('eventStepper') eventStepper: MatStepper;
    @ViewChild('attendeesStepper') attendeesStepper: MatStepper;
    @ViewChild('externalPeoplesTable') externalPeoplesTable: MatTable<PeriodicElement>;
    @ViewChild('externalOrganizeTable') externalOrganizeTable: MatTable<PeriodicElement>;
    @ViewChild('externalSpeakerTable') externalSpeakerTable: MatTable<PeriodicElement>;
    @ViewChild('externalAttendeeTable') externalAttendeeTable: MatTable<PeriodicElement>;
    @ViewChild('externalTechnicalSupportTable') externalTechnicalSupportTable: MatTable<PeriodicElement>;
    @ViewChild('externalAssistantTable') externalAssistantTable: MatTable<PeriodicElement>;
    public requestPara = {search: '', limit: null, sortBy: '-1', sortKey: ''};
    finalValueForm: FormGroup;
    detailsInfoForm: FormGroup;
    venuesInfoForm: FormGroup;
    vanueDetailsForm: FormGroup;
    resourcesInfoForm: FormGroup;
    resourcesDetailsForm: FormGroup;
    servicesInfoForm: FormGroup;
    servicesDetailsForm: FormGroup;
    attendeesInfoForm: FormGroup;
    documentsInfoForm: FormGroup;
    checkpointsInfoForm: FormGroup;
    finishInfoForm: FormGroup;
    ownerFormGroup: FormGroup;
    organizerFormGroup: FormGroup;
    speakerFormGroup: FormGroup;
    attendeeFormGroup: FormGroup;
    technicalSupportFormGroup: FormGroup;
    assistantFormGroup: FormGroup;
    scopesList: any = [];
    costCenterList: any = [];
    venueSiteList: any = [];
    assetTypeList: any = [];
    documentTypeList: any = [];
    resourceByAssetType: any = [];
    externalVenuesList: any = [];
    areaList: any = [];
    editEventData: any;
    editEventGroup: any = [];
    title: any;
    public today: Date = new Date();
    resourcesList: any = [];
    hasNotInternal: boolean = false;
    showSelectedOnly: boolean = false;
    selectedInternalPeopleCount: number = 0;
    selectedExternalPeopleCount: number = 0;
    totalCount: number = 0
    hasInternal: boolean = false;
    search: any = '';
    searchExternal: any = '';
    searchAttendeeTxt: any = '';
    interPeopleDisplayedColumns: string[] = ['select', 'firstName', 'surname', 'email'];
    internalPeoplesList: any = [];
    internalPeoplesListRef: any = [];
    attendeeStepIndex: number = 0;
    externalPeoplesList: any = [];
    externalPeopleDisplayedColumns: string[] = ['firstName', 'surname', 'email', 'remove'];
    selection = new SelectionModel<any>(true, []);
    selectionOrganizer = new SelectionModel<any>(true, []);
    private subject: Subject<string> = new Subject();
    /*@ViewChild('searchBox') myInputVariable: ElementRef;*/
    @Input('searchBox') myInputVariable: ElementRef;
    sortBy: any = '-1';
    sortKey = null;
    selectedInternalPeople = []
    editSelect: boolean = false;
    internalOrganizeList: any = [];
    externalOwnerList: any = [];
    externalOrganizeList: any = [];
    externalSpeakerList: any = [];
    externalAttendeeList: any = []
    externalTechnicalSupportList: any = [];
    externalAssistantList: any = [];
    saveInternalOwner: any = [];
    saveExternalOwner: any = [];
    saveInternalOrganize: any = [];
    saveExternalOrganize: any = [];
    saveInternalSpeaker: any = [];
    saveExternalSpeaker: any = [];
    saveInternalAttendee: any = [];
    saveExternalAttendee: any = [];
    saveInternalTechnicalSupport: any = [];
    saveInternalAssistant: any = [];
    saveExternalTechnicalSupport = [];
    saveExternalAssistant = [];
    sendAttendeesUserList = [];
    fileToUpload: any = [];
    fileCoverImage: any;
    documentInput: any;
    documentName: any = [];
    downloadLink: any = '';
    downloadICSLink: any = '';
    editor: any;
    matStepVisible = false;
    isSelectedInternalOwner: boolean = false;
    isSelectedInternalOrganize: boolean = false;
    isSelectedInternalSpeaker: boolean = false;
    isSelectedInternalAttendee: boolean = false;
    isSelectedInternalTechnicalSupport: boolean = false;
    isSelectedInternalAssistant: boolean = false;
    @ViewChild('editorAttendanceCertificate') editorAttendanceCertificate;
    externalOwnerFilteredList: any = [];
    externalOrganizeFilteredList: any = [];
    externalSpeakerFilteredList: any = [];
    externalAttendeeFilteredList: any = []
    externalTechnicalSupportFilteredList: any = []
    externalAssistantFilteredList: any = []
    attendeeNameDisplayedColumns: string[] = ['role', 'type', 'firstName', 'surname', 'sendCertificate'];
    attendeeList: any[] = [];
    hasAttendee: boolean = false;
    attendeeEditList: any = [];
    @ViewChild(MatSort) sort: MatSort;
    responseInsert: any;
    tokenClient: any
    eventDetailsForGoogle: any;
    event = {
        target: {
            value: ''
        }
    }
    config: AngularEditorConfig = {
        sanitize: false,
        editable: true,
        spellcheck: true,
        height: '13rem',
        minHeight: '4rem',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        fonts: [
            {class: 'century-gothic', name: 'Century Gothic'},
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
        defaultFontName: 'Century Gothic',
        toolbarHiddenButtons: [
            ['insertVideo']
        ],
        customClasses: [
            {
                name: 'LineHeight-15px',
                class: 'LineHeight-15px',
            },
            {
                name: 'LineHeight-20px',
                class: 'LineHeight-20px',
            },
            {
                name: 'LineHeight-25px',
                class: 'LineHeight-25px',
            },
            {
                name: 'LineHeight-30px',
                class: 'LineHeight-30px',
            },
            {
                name: 'Text-justify',
                class: 'Text-justify',
            }
        ],
    };

    filter: any;
    @ViewChild('attendeeListTable') attendeeListTable: MatTable<PeriodicElement>;
    attendeeListData: any[]
    attendeeListForGoogleEvent: any;
    listOfAttendees: any;
    userTz: string;
    outputA: any;
    outputB: string;
    outputC: any;
    scopeId: any;
    updatedDocumentList: any = [];
    attendanceCertificateDisabled: boolean = false;
    attendanceCertificateChecked: boolean;
    calendarCreateEvent: any;
    isoStart: any;
    isoEnd: any;
    filterSelectedValue: any = [];
    filterOwnerValue: any = [];
    filterOrganizerValue: any = [];
    filterSpeakerValue: any = [];
    filterAttendeeValue: any = [];
    filterTechnicalSupportValue: any = [];
    filterAssistantValue: any = [];
    gClaendarFrom: string;
    gCalendarTo: string;
    selectedAllAttendees: boolean = false;
    updateAttendeesUserList: any = [];
    saveOldAttendeesUserList: any = [];
    cancelledEvent: number = EventStatus.Cancelled;
    concludedEvent: number = EventStatus.concluded;
    currentEvent: number = EventStatus.current;
    inProgressEvent: number = EventStatus.inProgress;

    /*attendees editor*/
    nameOfEvent: any = '%Event_Name%';
    nameOfAttendee: any = '%Attendee_Name%';
    nameOfSpeaker: any = '%name_of_speaker%';
    dateOfEvent: any = '%date_of_event%';
    typeOfEvent: any = '%Type%';
    startDateOfEvent: any = '%Start_Date%';
    endDateOfEvent: any = '%End_date%';
    fromOfEvent: any = '%From%';
    toOfEvent: any = '%To%';
    numberOfCreditsOfEvent: any = '%NumberOfCredits%';
    invitationEmail = false;
    eventCurrentStatus: any;
    detailsInfoFormOldData: any;
    disableInvitationFlow: boolean = true;
    htmlContent: any = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @font-face {font-family: 'Century Gothic';src: url(data:application/x-font-woff;charset=utf-8;base64,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) format('woff2'),url(data:application/x-font-woff;charset=utf-8;base64,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) format('woff');font-weight: 700;font-style: normal;}
        @font-face {font-family: 'Century Gothic';src:url(data:application/x-font-woff;charset=utf-8;base64,d09GMgABAAAAAEAQABIAAAAAnEgAAD+qAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP0ZGVE0cGh4bg3wcIAZWAINSCDIJhGURCAqCjhSB7kkLg0gAATYCJAOHDAQgBYZYB4UpDIIKG3aJFeNYg9uBCKLy33IUJWF2r42Ksk1qZP9/S27IEFwH1bs6kB2YhMzqRjVlUrcKU2T6ezSF1Sjc26pmsd6MbNY0ZuG4MR2NcPGdOPhIz6ceSNHgwhCNaPWUdE2CH9KJf3b5XTKuzG3ncsZmFTlwdA+P0NgnSe4AP69/Y5MXRR9zVcbUnBibWdDDTG5jydZMnchhpuqcPnVB34ndnTj6XBb3/ehzkXiIxr692Z3df6g1D5nq6SLiUomky1QyCUKHVAhNI3/8Pl1llWCgvlpwd6YsdRC3pNFod7QAJHWiuc1MMUMETAI79HOS2f6nv1/vIaV5kJsJeIKJJqhNL9ZDuuogWuGdrmq1XlQ7fz6nhT8ww6TEkIUEEgitUF5tuqhzDp273l1rF52fu96//XAnLVzL6SdHkEvKOCU6VyHlFp2qMCPkH81pgZNOOAT4uyuBmpruouzU3OwkaqIAFfhwmihta9i6k8f/zhyXSF3q2ACXsBJQzEKQES30TzbL3yf5rF2eWRDygmDmaEwcZOGr7i8ZIieRg/woyIyoTFw1jZ4g7LRBt+YmUxFO0VDWsqUKK3Xl7m1/29+bapW+9xsQ/welHVHnwDXGBclCAs8YE10QXdj4v9HmdwMEfjcdmhyBkOYkAtIsBcpSa9BEgwOCPA7GcGXueN5XToJrtOupWWuy8z69vfxi41Mba+N0L9qJLwijI5idlhXBgWBAJfDbL2smI0xvp7KcEYHHt9OYSo+Nya79z7V2ZajBwZAtCBLza1mMDSsKawNteJT/Q7dRAABAdeDpR54if2zbqkn3iddxcV+hs02g7nOqAAF564JPEHhzAKDFxCmgp7fEXEAjKQIjSeXJPeGlByQTwPANDaB4Feq3hzYoJx6o+HLM+jmr4IaYOtsiQ5Qa+3LEodQEFxu5koRWLFU7S83uCneosgEx2IwGGO9g6toqghFDmMw2uMqA4dEoV7sc89kBWq7k2U+NSU237ocMXZXAVDWwVQ8Pzvziux5QkwJrFamaQbZDKC3b7ayjjYHO6ieOoZpzchAtUAstZi6DhDeG1lKDTCaysRYbcRs24zROjnzHjiQCkpg9uIpq6Ip4NFqM51/xiMfc0F4iwfUCCI4axuTxK9kw9T/ca/PhfK7shwpPBcFZPhB8neRHfWjE+hcg2g45zhycNVsI9hzgBKj9azZmYry8ZVD/N4pBgMejAw4A8vOqynb095IGtuBayZfk0Lvs+YLLA5CgR75j+pIOoP4j/vgMAKCygmpSML7ARRe0HAG7+ok9BgpMwzmXDdkCnQlpm2nP9wt0J9QQagI9AD0CNYfaQyP4gcPfKX1lqEZXjYQf1AsSdCtUH2p8ALGz53vdqpt1o7iF//95V38tTL++8Xr89djra6+HXl9+3fY6/ZXy6S8UdQ764CHvEw0LaVmmQbi35rO8CMdmYDZj9D+148l0Nl8sV+uHx6fnzXa3L8pXlKxtbO0Q9mcdHJ2ckS6uKLQbxh2LwxM8PL28fXz9/IkBgUGkYHJIaFh4RCQFyMrOlZVU1jc1Nre2tF3s7OjqvtRz+Upvf9/A0OD1a6NjgCAqmvUs/gKf80bCBnKqASEAMOLAS8UkAu0jqTTu/w6xSc+paZkVN27eu//4yYOHw4DyFkAv8wABwCMduJ2fXpAnL1IUlpUDpbV1NaHS5HcAAAApAAAA8LGhVCxBmlwFylXbIHdONrky1S7YwMaVAQv9uL4OQAKEtKKtS6Nl2cARlZHA6brcXH7ctwy9QBSSEakQSXoHma4Qy9YeXS8MV4ByMZLw6NIcD6OAZL1duODr+iO7M6ylqv+zP0k/lJCcPg4Ny0b/fOCRCon0GxlSwHJ37W53adD2P0YYgFEgcnc4H6oaTGVwEBVnKjBJWwhufc3uDAEmNgsCSmqBc7duZ+0kvS8tYpwbZk+0HoHM45RNB7LArS5PCEnP+mLL9E5kgqSPaKJG0TC5RJpmpupzGKmw5lSJ7BVYWwTfblBJ0XIZVaZs2IJdcjbNtbsay67lryI5Z/TK/rZHT2ebCaCfLpffctZIQa8Q6/lWurWXcURGWzypWdzWnf1rIycTseIvuae0MkAvHfHoj+WlfbOFWjPBBE+rqST7kv/kWall5jlNQHamjJ2TbzbIfVDlPmpq3N+eBDo055XfqP6uwS5/0WKKAEQNUxDZhtuP4257Djmo6Zo9l1xxMWgaUbMxeGYyCWJGAPxJ5efqHg/JeWHfKbu3DnZo6D9KPwR4OTlA+ach6/LpbiaOvQe6zVEZpHWimazNU9KxzqiKdmeBThpalEfoSLrem3EQnooL/Ygfsqs8Wt1rhd1bkVsnMZoeIwt6Y3O77cUocI7D9ukdSfR59gWaGKnlskFppLWX196Ydbg8cLhMJW6USiu/c5AkCJFZPjSFTvJGKsk7iVKBFVfGCO+dmGlDlGSUIkoQcsaZxpmSlRtdSWSkQPtKazDvJ1k26S4O7/cZnUqJluwrH2WB0CctpbW1kxhjZO2C47yq3KIylFhemWcQo50edpglRZBCRAnYuU1LKGmztLApJSKUk+sg4N+WWsdzZdBPQCDPVRZyxhrk9ySNlAw5cXYGJUAgV1KmV82aNWXJEADS2uLShalyrREAArkoWQiclchfTkopKXKGhsOtGnN9lOQ5URQLlB8DjKlCxitMUK6osZfOFc6ShaIv5fAYI4OJbLqn5KxySWHyWSAZkdwrpcq9H2nagtvNPZRZipIyqJVi3aH1D7Rks2/VEruDZzf1agt2Y5cNCywZTWMJfuiod1yIKzGN70WsqL6Sq+uLfpMT1K4IwpKwSSoTOEpxfLDjcOnv0J5K0sDaRJSTP7bzRT34oOp9WVew9e/vOk9oTCs0kE7P+rz964hWs8JkZnUljaeYpPHSsk4yyXXByoalyLPEjvN4knNAwrLBzl8V18aON5bqoabntUStQ0bq6esQTapKMbjsGagy6euXUiP9wrWAcrTA3PeXE77/hnzms5afQjpgrgSJJfaKcrtQMmDPYUVA/sQUqrdxPlV2461l/iIqxIsEjq4SI8ohRSDLNTo6tAA33shMW2+96Vayq54Ib7rdX5x33dXprnE2dFVSzhFVaKeeVjxpemqfppuFMYsi0G5o2Wx//Curem1N2dLyuVHGrNqoEl6b62obKwBrTpyGFAsPW++W+teCHZ8FlagVO+WwsyV9FUme/J24jlKm/mRXzUpRCYWncwVf44KNZhLMkYEorut+F0F3Jen41yWq/klxU5AR6riuHoRWs6gWvIYHqTdYOnY8YCKLbwXkOwHBBF+CCbMdk8iryuRx8FfFa2sAnMBFKa7vbLkNut/TEB4YSFmUH77EmXuxUAG95uyIVFf8GxkXRxwbFBV+1MK3q36X6RI4OcsepOc1PJxhvNah++LzdCaJy9f7RdMG1nv7Rlc3nstFeneetkrQTWFN8/i4wYWui1A6faUR78VpgSPytDJFv7xGQ79OSZ9j0seOKd3yN7Hh7O2N3R1s72JrW3a2DLgdR1wYn6OrgNaNIilBonjFGEZYlV7OmbS+ablRz6SY16mpM0bCKAo1O8inXDcCpx9mskLAFM2Ghqgy5CfGwhx3LTUNQyjU2uWqawd4PUW9rgQQXsv1uCJ/w0iWDX5WYAirDKQHfFwDkAxkiM8guDSoG2RhqE8kaFdg6SoNUKsHeRtubOLO2wr0oestxQyp3TJjjCbfcx7utmZ+3o1lXMvoYPOx53JincEY1Lvl7rhdschB6yeHao/YLdw6wtoKZ0D/CWrQgHhOnSqS5sWKnNU1EYagP8AU2kqqh1WrliYAUZQYz6XFmzAO4B7YsETccGHVkJ1Hb1pXOIv2C5TU+ubExlpBMd++2Zy/nV9Q0qcMpU/f5U5CGLTcd771xqbemtfLytxDmSr90zg2KDM6A+rdddjU/OV87FnPqczNl9NXM7OiflwVofGWDwWzaTxJItBFAa0oWyEwPi4vaReJn+xt6amADCdJ7i/uht0fRnQJFnuOx+iampVQcUFAE9wDijzP8Qq/w8+cCS06D30DPDmkZx9NahQ2xIL23oFOhrEuDL9+w5uUhShhuycVeeSB5z1WjHscD9NBNYRTzHkhKGlZqMFeYVihTLQ9i9cXQf3sD+zmmLJPlTGKP/BOUSDd6S8vNhLXNaJaCBFeurNc5JplpNFAZXT2i11lOMKfhcfz4gUWFuW1yXDk+KaTio4QBdvDMJQe6WHf32qpBw1wg8mzdz/4YNncn1/ZbsTETXLfy7ZOZfqLzWlGPkszrcj0+pPIzYojlZYoX0XIsZYZOMPL2x2lsElpBvA5D0kpBqvD+6Ye2reZpd9z/rbqXnIiCPol8n6ZhBSOuPQu5b4ZFhfUqwHFLeivfHjpgISEE3DBfccKb9y92qUbTzT6lpWdWVOS4YOfipRGCDejBu5Drr9Ss0nEqWmOtYqfdxPrkuiNa+zUsrvprqvdX/dyUD71/T8Ycme9C3wCwUZmIoxMM6phDWv3NupGKxvJqCmy/YEVMjnlfYsAo3/RLI59ySsx5SzXJ57n68kyizgqXh6NHfvgRlU33O7i6vs5irxJTgzBxp76cNXFrvq27+ZYM+iPna02QXG497rCmxvp+ma8tq43gHCtSzSKCp9jaiNcg+nch9c6k43jdOphZ1LG+x0XGNu4Waw+WNM0w4yuh4Xo84tY9nEM54P7nu9Yu2u/+sOy8SLSHxF7zZJP5Tqe7nFVd1TtFUx3lrVXeWcN4nCso0OsUdWIFSWkxoQqCISS4g5AeO0GCTess2jMuL0ykiPcjVw4j84iWy6Hzm6Q4V1HwAvtOss2HHdIR8YY8dwEPIsAXr6iLDyYyNQQPx/aoAjllgh5KrDGi3/Xr7QjdlTMeRa7ihtubGAZbdxsdQmKZ6xXcERHDJqhwSvOIdGY84wbqH96aVzF7C4x5oT74WVSzNmNBQxW42VxqDbj90IV98S+EzHhuv8L2d3lL8v21thBWWimH+rGfL9uX4SV+LV4+SMsgcureswXYobX1uInysiWLHcaqz+GEGKEIR6PmseRKd9sGDI8R9ukYRkbo28p6Xdd+GwtXV/BZaj1UbBm1121fo3l0phCe5gg5rjjPdX5kGl7ALtvyY7D45ujDXLjfWpAcednqOql6jN9EVbu7nA4ghXDwj8aMFdxidhFFbJerrPM5C6X6y4z8MN/xahbev6I3e52j4O65wG34KPvvY7919xzI+az+198lvYk/MX99HWO42Hp6bVFcX/D9skfvr+PU+9RR0T4ysPIwTW1EVJtRmYsZXd+iHMwJ9AjTqT/HiJzDvCNzeZKh+iWrlDxDkQmIlGzDFEo3qa6hC2xRSXY3MZDQmysQnU2YdJdxXJSILek1q9UZT03Mri+LSLoMHF3ulE1f8a44VQcSo2e5fDhfs/xLz6OAZGyiUcNJdOz50pCUlNDQtIApH3HqWknUIOK+XlF37mickz9k5Xa1mfOzX/+oENags535hLdKf6loVU472QMntFenf7yt+rq2BCUA40VQfRwPBwRSSDwlsamxhXvgtO6lm6V1hHlaQwvvKnEslH4z4cJHPF6oai9+dsxSxiRFMX2s/YmnYJTcX5eFAJNQ2edsx8mTOtvA8Y+6ttmyqxEb78G6TfPa7W43qA3e5M6qbPiiyZ8b+BbiD7MrfdCslT1E/WTXXgfrpgcyzA+FvRy+b7kfYku/A+XjHdgsuul3cJa2WCfrG9INjR/cv1S09sVOc7zCVDkH4lHEg9cl/ej2uPut48c6ak9YtOzG/nyYLLjWotcsdGag9PVyXL/rV0hf9N0Dpm//wvp56VMCrUz7WSaTf2LlxTDnoxIandG8E/0HmvzIIUZAFGWAhBzM0eL8K4h+lVq8khfjvz66LZOOeSJrt7SwldIX0r8057rsfkXi8jusuLDRRhnso+88aYyPTCyopnQpZEb3YbBx7pEVhdIImRs89TKY4Mbkw2iGWZML2VijMs6gfKLEJekZL5dS5JP/HjKgQfA0UUmoD55X2BZ4NXC3mi0H61qF9GHlYPEl6w8a6sYvXY+Y8Qr90lK4TZscYSR5xx4292S7P/W0yr7Pzy9IKsnY2fCCsZrpF6Fwd6GmCvvv19LlSw+lqYkLIsl94oS0wYG0o5eev6nL0TT2qqgzcJ6Xep4ItvIEF2TlDlV48Gx5bRFRAqH5plxokkWdzAqilnHtCvHpY0ndHHTcxt+bH7TLWv2DVKc92Q2jY+nJs1OFFUvTWHw1K4GIS7dHZvsHKyokCU0FKWpoU1TJQuPE5ITlyWSe9IQykaqpZ7EoF8xQolMp2ZlOcr+nJ/mi4rmar+ZSlZhtu/jjPMZyJJHZVaCHCtBZikgnJBtypxdRuZ5Q8Zs6TFHOmXV/yhlAFqt5qC5P3+/PfVqugzjEJcUXutwyzO70taeH0KmsaK0uaVq7TdGWpqVF5McrNiR7tk2j4IWRv2CSuOTKv2oCLRqmlbZCpWPkivz/np0R8BYfHjmQgZotGdHGZ6P8LE3qdQwjEMgi0dnWnvXDs6S4lysfA1kMSK5t6beNd2zY3nMh5k/p9qHazWmnPpG0OPKa67Y4ZmSPxg5uezsdoFrU9jKM8HycvTy+aSsYparyM/M72QMN5qfQpZenhqxOClRHjrxTtnwy1riu7Wjgk9f9p0aBiDKA1dG/WK6WdSIxlAL4ZEkJro8qFdl86mqYqipwomc7UVNLeEZ4ndf9y8n1ijs/BMJ0YXC2i4OdwM1NRKwTGhmlYpIEcnb0pqunuxoNe7bzmcYWK/8JwqKLcBWL2S8BD547NQPQJQW+HKrB/h/BcCLZ2/Yhb2Y/C4LyeE263H9hQdLp4dtZccdmXYDAERJKBlZ7Cvuc+krQdU5/abEe9Ebf4VXHcWvVlcZsfMbo7ic+nIBJ1F6KLngkl1n94Hm9t4TiK7RNcRWXXhQlAgiFhf7VP+lM/QA0wtAlOWsP1nl+cLMnzPODcopE++nWUCcp1joQ4DqwJzphGMpg8/L37zD9LWx44J70CdRvsnKY/ijt2+VmbecnMy+dBnW3/jjAkAsrItO8bfrKPUPRw0fBg/rb7dWlmiCjaFZxoehm4c0Ng+lUt8EdTxEp5eg+LPn0EoiYYWP7y+yKIvLXjfHMagbN1HuN5XVjmpsJtB9oK3Z9OqVZsOjne0tBztbTNF9AER5+HuQTorJhRulZXUTeVCa3h5Wj8NnlaoCG+9ED7x3Yga8AowWP76/xKYu3He/MYHpSjRIT3yyd7BivJ/7tltg7XWlmOh+oV+NoLy+p/WXam072NECDRh9/z4E7s3Y3zJVLOUProaOALu6h3Z2E3vOfgeVFdp6IXjUJ02HV6kSDXcn4zP/v4RPR6NELngLDJoyJBvOX/JkJESGnG8nU5kD9ChZPNkvVuzmFszneMOOBqMXGuMmCuXPeI3//3E550lRpIoOTHFUgQUgsEoAArMfxkjLpA2BWoHe4jYvIi7bMTh2n+fGZWmZdNrj/1/6W/t+dJ4oMAywBVsrG03EAlOwoPEYRAk1U4Moq/YMHDKMOmRiuO/Q3n2HKg2jlcZG6GCj+8HGqW73PwzM9kQ4Uh27BmfvfuhJYaYyj6h+UHbFhwnCula3lCVKmN2RQYvjRRpHJDCswsRMDqgLfYqmgEHIlMwWfHi99mxOT83u0K1JYBAyKfOp+B2MjI8xve8XZ7rul20kGjFCjezWrtGn6+9X++j06Ak8/xj7wB84z19zHgt8BbP5yPzRIPZTTsYGxqvwd5FkdUYsFC2JuNPJ459/DEmmheIVUhsAWS+ICOI8YUOU//mzM539SOA3pXl4q8TifVogWhb/HSMxdRsaduhU9cTMuhSwYL5ctGLiy221reF46epdUea/VRNcrKdYLa1Dxd8dHkPIzzAmH4Csrz7TYBivnGtqXNqh23ZXUg56eVd1/Lf/e/zrEbERzmyJI0JQVTCOlWqdDD3vccKIx86+4ktpFNL98QTw+1mpoktygkZ3wKHDjWQeUNvjPk/Dytak67OFsyG0o1UVYI2qssS7URTRuJz27ijLpmJnk7LwpVdBln1qtSNnklGimGL7Nw3YedHW2GmV6uWKb4WK/n9+U978fWM8iXNjmieMXxCK5mPrAch6IYPIW+DGJ44lBd95BStUH/vbgJMXw0udvWiatNf7scId0lYIQ6HM8SDM/L1UeRCGlCNRzprJpxET2yNGi9Zl1ORAd5KZ5qN9MNdrDjzz/LZIdQBkXU7+OLhMVIu3mzH79TfLXIQ58TvFrA5ZMIZleJiznCXecsdgOjTCLXU1K0HQI/BfWPRT+F2xyJB6E+kd8Z63f+8qOD0NK0wgEikdYp/pxSVmPbJw0p+3wJUSnV59CSt44k99joz6PNqJYfy2oq116Pu31kG5aG3dgfjlq3jxotdxgoWbXLFY5/++4oa/gi5d/gJCn5cDkOWCWT/BI0H2rzjPP/7FeG1kPOEEsXFAS0cyd3pZJBLMiCWrIrF4ZVooGfr8I5BlmLnBreTjDo+6AxlIxQXnMHmop73LIaykzwSTLjSTGoQa8RHWKUE0tlRKlHBwDtzYPLdSghXOCheR3NGSXllVGhzKi+GgI4MdrFP5qS51PrZ4G0JEzug1eXiXLwUimpUqy+XlL6UvZ+WzWBl8m/z79b1u+2kdIomkmW8S4rX4XaH7hrl2N+3ChftpzF9sVYnICt1Jfd0y/UrTQ0gDM6AcWbzvnq7OPV0DnUldHbhu6f4spJFOi7bOPW3DE+p19mJwh2mpaWmHCNxs3+Ux6z57REWMLNejYXT7MRXHKpbLV1+Zah7JnD6TZHokc4qYbILvbrkZsM0yGhy6XwV3VO7vj9zDDrQ7b8py9Uj/jbctkZxBORN7hjr26IZlwKl7M7TzdlF3XPV9uNqhGi5APzB8JD0ME8gYPRwFzpgiDw/tk5D+jzpyu5SaG3RYbBsydO9FdvMfwabsBVdd9Xx42iGQ8Z1YUMsNzM+JP1roT0Tu/ocskJfQGOtIMTtD6fKR2AYaHjwRAE3xbOY5RUJPRnR6ZJ7F6kJPsQ5basOfxjCfAam6+YhLxGfpuv+eIr4nk6FZgPRsJuB+WklkPtsp+4E3dSu9kEpmeaLv+bEjeYeqjoidK09xImmvCotiXVpcHTL/2UR0r/9LsKuMzMwlozyOqLkelZ9KMkn/aa3064DnrNyqiSoihjRq5eWpSmNTQ6OT+KG+xr6UUwpkusmhlHyOjs8tpnO/ZYTWhhwQo8doeCeU5wGOOcnD70JtJD8qjw1lGxNgXNSxM2ajW2KV8j3B5Pg4gn2jFdG3wtwHIeYHkUU8Zy/LMlIgrPisp0hAChYJvRxrrYICq+G+TmLh9qMscPA9U+QfbOTr5ehhalf7/Eld/bNndXVPn9bXP3+ervpOedEn2D+4vfFllCSuLg6fPaQ4RCgR1n0aoIgZ8vEi6/camw42ii3zdIazo5RPJupTMV4KUsFsb3f75NXdrWVaYQlsKlvK8Dh1qEQQWejfShUzEAn20bWdGfosF15vaNbCYFvLo7Z9CeW8PncEk5XMIqBNTfuF3bEh/kgveYkPjoD2mmYm7MhJ9HYKY/xV+Dh2l1TcrdqW6JRawYNVmZ/tYL538+4qO2b13l2ux0V3762yYu6+3NjLy4cGEPYDg4OIAWEPLWk7xOAQDP7W0hx5+/u3wYu327UL8vaRxCRKak1fT0fZlfiojMTdiXl7WlZvVo2/+b9JtTyt5tK80JGOkNGEncLwSrqNk7B7XlTNFckJnsJcIV+Q78kHF4Tu2//CrPyl2cv95X+sDr8ye7WXsTo8XrbpIgOGYXOmy4C97+/e5cWs/u3MvnOPt3J/lR17b3U1dr2YE3NncADhiLv1I4YG7IYHBh1sB4XOf2c6hAnyErJEVth4H7cSK9eTS8e9IunYrY3GDYiHGtfhTXbAWsLXl9E2SG83gjNr4wp4n0K+eLuoaPZ2ccncTHHx7dtxCkpuYWhopoxKT5eFhefkY+Mn6P2u/97b/QmKgDyPRrMi4D5Hbai+HgG0EDV/NiiuvTY7uS4vwsGFF0sb706gRahMjsXuxYajPcnsQHvXeFw2OJxOQ5485uOEssXBV/iGrIIYhrhU6hdEtnc1xTDsozvK81OqE+N2tGk9gT86AoeWOuCPtZyU55pdQQ4Kyg/EV+cQCpGFcfa4cnR4eCUagQG5Q9Z9x0VxkbR5EIEIqGXHIz75LRHfSbD13JUShevA5IfpoN/bEQaMd2vu139sOEfaJaHutHBxOOMaHxIbTNGU8LCU0U1u6WlVcUrt+GJW9vhSTfXYfE42Pru4giPNJwY8G4eTpPDzHeim8xL60qT8hckLqM2HXeb015yxunX9D0l9sBwxpMlHPNQEppv4u1gUVhev60Hkw88JatnljwFJtnrUSIDfCG1g/zkdOAdHj2Uyli4N+WAc4xJnU1+9MseGXBtKPjy64HtEmlR1t0payWzsZntaJ0bDHmVznMquR4xYrbJr8uZcp938x6/tlu5K1/9GtAPNjwEFZsDAlarhKrBovObHRPvIEDkyB0k6SjxiYRth5RbpDqcetMUSDiFN98UZH/x1VBX1cuAY/j9wh64YNvwrAHwCopfxmLAeg8rFTxjByckkEo4Ek5L0eE40+bQz8gwnp+HM3774oLPRyqKqwanBkkHUYDH+rZ7tmwrOtc7QO7XvsZnqXvPsIZ+f+SeGedsDVRAe+AXO0ZV2/TAb0INQvK3Tca3jZMhTuY1oDvIQPoebPQrRRdKlet6vgUEwp5ZjXnTT45Cc1ud20sUlDwp8XLwhpFmtrL+Oi6uwuj9fXbJnd13hzl9WOJFY/iW0bsuUZTLmfFtRHTKNTZLcFVZ0Wl70epPcof1HHSJZLdCn0sqz1aqzjZ3vT/XxC4i7rT1rhuqvsqfK8J8zhJAQAuGVEvAUj1eAYD78pmkLD0CrZYpLzMDKXlp0zK4GZI/wgzK15SY7sPXmb2+rXbeuDlr2X++Im03PGI1XUYZp+NHYrO3hzk0r220AWWzG2VtDnX2L+1XZXac+NbvfDFyNbWlJHMXWI3Q+HEIOikmSVj/jUCsjlX5bQSOWErMUcf20rXeCBwE5+B+Rns1rbwOVM4m5vY+X6mm0GtJpjSDtyB32HLuE25k3fns/nESEZTNh/mkdXXlV8+NKyHlowcVSFq0gOyZAHmrqmTz6MGPOXNFW7eHzZpLr+Kfi+7WqoC9IyPVVbbYF4lcb2MyqrraUuaHKzUw6bGvHGtx7vNfl8Qfry1Qg1WXyRHSgBYk9kzbNOjdNyf6IxALAPbuI/8+pCY44ZToRlx1/Fler03mlVooOhHkxbqXNkbj+5vFuig2cV9GfY5++Dg5+/DyWyb65KEgQzgi4s86RO2FGAlb2Fb+wiD6ioFD2cxsPO0YWjO6PxJ/HqED8DfXq/iDU9e++06/7BPSBXuvZfdJ8S8cC9CPMBMc9qnpFSIUWUo48qiqJZH3Vtu/Xa76D+Ek1CLm8qbp1oo8st+FPHxSks/jvQiTzwN9o/CtxDjLsXBznSTCcdRkb4e1mNW2l34KCs8VnHt+5mX+pvXyvenXjr1jPwvfjn39eFc4IuXMpKezbN2JE9cmUain150m2oRItH1abVPkgJdRExQbRVYL2d9uB1QJ9DnCwWnW2YDe63aSsdrbG6Nh+HGxrZZuy8IqluaXZjfm5edto4/Wz5K9zFfGivBBccklW473Wp1tzfLf/PCThBNlXu4r+C0S2ysxLJCGFvCmxaPnBv3QrtvgWV7AgKQ6Q8n9eJ9wO/j9gdggV7lubEHenu+vVy66FyQ5ht6eFPuMjV354FELEI5kyPf/I5zVWEPOzcCu3dJOd4s/Rv+efW8d30Efw6M4iR7CyMtNPL/Jl5u3HlPTO9SKg/l8As5+a0pv6DJUpWN81+LjBRDOWr7HF4qt1t+0/2d3ySSjJ5R3esdTekDbXkhtEdQrO888Kc8oN6f0N7fpW9c72l1+XGzPuZNunxDmE9fys7aUOOKTSfATkvE1ZzR847/zf4vgLS3E87m0xZypx7NPW8SaFghWnNPUTx84/6io9L6GRPUgTiG3tnHwnyuv9NSUuZjtmEGtL9tweNkRen0P7W7p+ut50ehoQb3/3mrIn/UCpRZTnycMEgwA1VPDe4zunVvcOFnyWZZTHKQjq+NYFnoDAm5tvm2xka/ivalZqeXMHbWI7PaPBFm1mypvsfkvt7089emn5g5558ouVD91lecYssSNYrOWUG/7BzNQJzFz/vT4JTCdkH2UWDyofxNwPf69FNCD+HV45g5ym2UzPsAHXz5en5+/JbkXEzt9EotY/F8H6vzAo9DMCSXJ6idn4X2nR7UfGwCPQa5XAHMySwBqc3x93T9KAEpMUx+PvlxhymJwrQ8mQS7bd3iIQmIWqQw/mKVyCURJcG0eMdaZRQpMoSQwQTscJsx6SUpiV1gmt2X5jtrTLshSgFDat7qxZeqQw6GqMvf56uhAiRyEMhleSKB12dWerMVF1/ZE9kqJipKF9LIpgHalevUIVqEKs0UokHSQlviR6ijlk+JzKFpbdQIZCk7ek59Tr/p/vf38MYvXxNB355+PiZVZDivdfRunCZ8Qc03xiu4aEfIQvZ5AdVvO5n2yiOQyiWiugcssGUBebLg4sSDuZllBkVa99wAvXfzVmvOJ/kr3X5iXUoxYsbnZQV4FWLmUtZS/ZZlLNSQeKWgkqZRdqL6eDvaknszVT2t8ErDkj7FkUBX2vNcuulNRzeD6HJijvcZfJhVxR4/kqfiChqUGlzchlyH/QRFTF2+7y8c2saTSI9sdGywbkL//LQpWciZe9/TngExTQhuObTu5aR6mBjpNQIOAWb3DDdziU812+T90+yx33fv3ypFkpoHzTNos23gv5FBEvt1c7GJ+/zXIO9xVQf1pIYOqMYBp6A74MgbRlKvYDZO/JyheCW43vq12HJAOAObkWuOIH6HIedq+Pzyw/cHm43GR46HR6K2qavuARmH5rsHktAgT5oRMGQ51CxI8XHOSgtKKAxEb0uqaRdJtzgBncj4ktn/REmrxJARKpREaSEgGXMQV1JUbsU0VO2SB34qu4wIKgOynmGStS3FGOCVRnl0LyyIOTXG+c7ZJIC1uNSOnISxcBOB2qjIY18ljvHH3r6GOi8WPECCCzEZE0GIYEa63WvwkbxAIVJzRIZ5dRQZYjldMqt1OhlAntA6Zi1JQBCRjQWZgUgoAAmkmigYRLBqchG05BWRVruFjAAeRKLlymnKLuXqBvRj7k6BktI/NBhPKpU0z85GnMQsgGAQ0yFQ40tH61XcXL7gVRRuNAomvGpFvdNUri4L0csYL3HDkNqUOusUmh+qaQtUJTpAwOduDLlY6CFWANoBJMtVchiiZxmdv6HUI6+z1lRN7Buw2paIYORF/urBrC9mVXIFRWTGVUdJVgS1kcTgQQIaUFeCsX+thv/2/mrU29y71fmgK8WWq5CPp1SfuXfw/fagj56PUmoTzkhENVqUAMiJIK7cl6pNljLlEf0/R45RXUaWgrmgZIsbLFU6UzBxiXONLlkA9MuljeLCDMlSgKN6Gs5IcuaB6atTSDlHRlCR94k+p81zrtyCwpeAEAjYLdGt0lp/kH5W6LJCV9Dc/+mdwFvqbOj0/D1nBeU+MFRTgtzIiT0b5tKR5M4zcMv3khVbuc9zi7/aI05Fr88RJQG0tSGnLQXYtBYQ1JZjjJSFkhyyKULwMzWUkCQZRrh4/iWZMYjnKliOIF0xn4RkOYi2eKUtiXd2x4YlCUtja5W+9Et7bIS3xV6wgsU2474e720AzW8D7th+0GAUmd032qaWAekbWMG4kFzteQiTDxOq8vWX7kIbSGi1qAcDrBthjggwjwywC/K+R1xvvPWOn93Z5KSbLyU6QOxaf127NXGQc4AJK5O9T+4F9ipXuJMBbxEPIo0Aa+jElgiTsgTi7gjxXa3z3l8tbH9vjp1Td/0AXL6tC0s+rtB6NnPx0G26bfuiNZbLza9W44U2XaM80A+BA3LH4Ed1Bg91YThHQTLOqmeNuhI5G9TWHb482s7dxJj9CdbItcDy5T8D7hfq2RYX1aawJbnjSzxiwXsyQPtQpalwVdF+9JMeGshAdyqSObWslgDQauRMWCMkUwDI8M8XZOHBsSgJJEUOpCq1Da0qLn4RBrRanXXaTJISYBBU2EAYnpawKWfJ3GoHk5sXksAg8FLEbdbBwKrvsFsZcL3DS1iBhitNj26lCUjmbee61DQ3pFtzaP6fsJFJFngiglU22RdUH6UZyIi4Sj9YXG8zbUm9EFQoBWKCUWE5ffACkwlDIQk+Ia+MpkNFANJjpTHHDnTQvY9wO6eYXQSA5gf6GoKMyiwfbChG3VnjRbx2SNUjESxAUdjR/595NQrz4FFH39lkl8/f9T9f9nBfoWyG3Rrw8GJV/v828abjfhO9K58CsGoX2C/crEGkem4wQQKwgFq9GIG1hqmdnfREc42nFkptqCKgBFAgC0FUIfE4CvGSXwOMOqGDeFanlNj7gjph2tpjp9P1OkN7LhO6vSQTIRU8xoIJ02oAefXOBIF7meUBxqiwNynmhGlgbxz99hBL6YVQ9S0IVNyqUfJ1FxTNr2TTmw3XnGckipwBo8SJbizjww3Znaacwks6btCtRKnI4IB0XLXEXymcLmAwyxM1mR2zzmmG+mVbu0ltUD4MO2MI+v1+BpXgDeodr4vSSB9zEx8Qw6hfUnxbCCEskps8Ic0GoNhQkgGvS4YEYez5shk+B2hIrQgKwZwBiM5btD0VrdnCKZFydNI49MmBADMcET/8v424gSIogf//W///MCjAkQQlOxhnioZSBmcKAkxsSX5CjmiJkuiqAeZaDBSGQ1fuTD2M4a4N0a5pggvJFYenhr9JwCvD/3jw2S7cK7yzNJUOEJYLNOTxD3MyQAcp66oHtO1FmwOK55BRAFiSibbfcgNJjqMO9iXBC6jTcTU2SGc7ROnioieY8De/ejHmygy4RvGORywWSxC6F8jTzEu2KGxZ29gnu7k3BY7cWhMEPszoday70ORn7EXQ5psCcSY2FpUFqAlfA5OCacRpgcrNiVes0QPy6MQnAyUJEXOWUs3am2/UPxssdsEkkGtPWWbrU+3RtXczpgpneFkoN5g0VFLc6pRAWQnEZ8gFwFKEmLXkuyhdLNZ7aYgW190GOzTSqfaW4+1b0UcuBAXNauXFFItwapQSYcBzBEobVFqquKm6gUrgDUJjzWUDQWXHkqilliOTcrN35Dpg9Glh5QSsPFMz9Sx/u1RwcLokXVxGsVlNzPQ+nIBwqsqdz+PMLN8N4MpYqKF4pRNL/iz+4RYwRVm3yv8JDPiux5RSnWN6AMvNcSwMCuwCB5t3rZ4WY+BFkeBxlOy2QTQ/x2PKZx9KV52RtMIcTWOmSEIdR+AoMhIxBwIj2XpfINqp+sK4NpVCXYvob3xDl4whUsA0v/SdMAc8jqyZ/ziBuEDBSHxkBEryCZLzyOYg5vdB4qM2xSHTy9PkQDDimhWJUPUlaQlthKh2rN6Np2XMisEtXwaj/VzoeSi+HCvo9x2hg0Wu5G856TN0kPiIYiFK0lh4RCI92W5Rom0LSKXuUlVd/buZiDuJWY+OQA8VN9uO/P6n0mnJeJ/Al9vB0TjtBwG4nkNUnKz4apGIhE6kV6Nxes1FIxUUBFbcCKqKPC55e7nAvy6Vlv0DTEX0SMdT1XIX2s3MQzK0ze2coiPhwV4cdQRFHrYHDWAQBEzeNMmlevrRqUQyU2L6KhzbQhXbh0D9c2lKHWatlkN5SOpkfmOhtnWLNUXOGdHAkQoJMrhHACBBInqFLogaEb8OTMOsbQA6yAgR+Wh71lCdZJRiDnHQy3rxiYLOujApnv50S2FcLYGHOiiZQ1iShywmqBTg1GPmNrWIomS5dMqQ7KcCaKlYdlAzpn/mbcdAHSpDNDJYv0qXLsHLsz+sCpx50+LoahnOaYakbZhBFHfwafb+BnYYW/G8TuyhKhFXmNStxf5gS+nvEVsMNiuPaMAuCU95FInIlITZZNM5jwDJerr/jYNkjZu4izRa/8irR+ltffLzux90vTX19GuUzQXU5DkkMVH69HGv/3YvrMusPh/nJe+eJ7feXElRz97+pOpg95ZVFfjjef+fDHYu6bzPFGLXzaX/qduR9/QLMl8BNJGLwmTcjTD/6BfjWaHp5fzVKQlz7Dz44dJ8AP3/6kXUB4WiyeIQ9VA2uCa2sJFPrYVWXJzsrJc60kchqDK3Q4wogz6EZ4Lgo7T8fL2dTwoad5xhR3qXNna2KUhXAzb+w29cf6qdODUyDwo3bC00CUtTkYW174I3KLl1AUq1gloniYn0BSCEMWFKDBowKaUgNVTUn4ldI906MfCl3Ua6YnPzQXk/ZIaAUqGz58ZQwXNGGzxKolwbZ00lyd7pNlp3XNETxgp3lyCb8CQD+lEfKjYah9Aq4+kZtkIKKoTqA99ZS0+AN+QKvyazrFW8rCUyP8CGz/3Zu44g9adahvjhab19/9Wsbsh8aauXdFbl4R+VzGSFkF+smzQYkOlIGw1e72wU0pOUAIOAR7Dqz0JG9+Ed0vF/nbx/nVBUHfVOryPb288rXgAcmgfQKLI1js8AhHeH5x7r1si+5YAsURP9Pnt2VHOdWPl723O3BvGpux/yDlT4CWjQwajkLVSmv5nM4Ga21rV3TUZAMxYzmcOjLYTMZdf40OG5NQvO5OiTiT1mCuCZLAWwDFDkQKSYrwUBAtkp9Dv6hffjw/vCjwxd9PAVb2qXhAV7SX7Rf4ufql6LPDH2wboqv4S//HZ7Z7ZOf21XJt0fdvm6K8H1xmXZvxacpyHYEc16Z6sJfh5962pwcReMbqAnPNrdlMqIwg0Q/jOIePtIWzJrlCgYly3hWJusvHGimkKepbsXUYzHbZY2J0QxwBqOAMyrTQSKs4NStAxTZlKr/cJOaxzGtEjwKouAzQs8BUslSdcGXOF01MalM2d0d0U8mVYNtpeNAunRMdqGnLWrSboDJ1WxzCtpk04KsLcb6OtsnlGOZuZa64Y24zrFWJKUNyBedrlWUdMI+9goJDASaUKL2ycOySlMtBu9QFCdffgPmkUNLVtGhxEIqqipscZDvxGuUljgzpmqxJp5nH6qxychj+T5ckmVCgEBfSZkIUZUNIamzMvAGX5ILpEo3G8yQzGsxPIg206WhBYW0HUrQ6C2ySdu5ish8zEpnEGZS/nnSUiDj52hOP16N/t3T1dPXnlSzB8rxyMqwctz5mlx4VhUI5OSn5rK6OCoxEHmaLJFPOAl+lFjfzi9xtXxZdo41Co17rPEAWeNixg0BNuzjcFAmbJ+DTGcK8rKAnNzLSbQzr6lC9a4GLCTQwklfDwBbL705TbTeL/Fb3Z90FHLRbk07F0c3ztu3p8/Hq61znGd2LX96/Zy68tbH3hfapqrheZnmcnsuqqnRB7ZqxqaL5pQmhZroTow2qeBqgB9+97IjOarvHItFuzoUk6XGvlsmgvdE2FVq4iQYNfxoV5JA2ZfA+DTPGLoz77uysuRu/6pioqX12sKoBTFwCaAe2MiIYzWJcT38uW4ddNp6RwGsppmzuwLkkwK7a6OohNQjXndBrazzXukZtbaBdohGKldHXs+qGJuUpZodK36hLsI0oIwItLnQUuy2KYZqBzscTHK/FmK+Vs90eaDJXjCjFjebG4IUOvG6Gdpc1zTPiLiNReIVoqTmRHW03dY95nVCyZUYRezOB40mI7AcVvoE7ouFcaQvShlpIlVwtknmciBzFoRcYCtED5cVEcRP41IOLgY9yCVdYQm5KjMlnEVjBnp4i3rHf6wfN2oVmd7Fa70k4bxMnjeVnxM6VBR4Wt4v14wZiocn4iHHMFt2d//Uxp8UgaW1NNjUlGdT7ivF9JBeUYiZZSdKRfOozMCyDZYZN1DuFqZ3WTBxMxFTDQ9FNwALI/IFV/AghGgUBBDlKxS1XwnjWZeyoJgJVI4IgLSxcdDQgBjFjVOznOSA3bmEyam0RxmGkAe/dYrUVYGRk6f6c0EGMFhaapXao2yHIy2SUpfG1gErZ0g5KDlBOWKNbAIL3pAzQTqYc6sXYlvGxFxYrFQufA1ZgE/xhyUuYWbtkD+n77wxmzd07WUXWTebw+R1yuzZobXSn61WDLM247i3JzOdjzGucHrOpRFVrhP7lqSots4aM/joj6VpZeZlLsHsmuCitc4E17vDUdcoaX1K7668OrVOxRgz2NGVGWrIxj7bDHHIcUeJTIUcQ1RH/JOrEdJLadGZUZlGvt3SD1OARuDa93Fi+QVAMSTTrKtnprerQ72x31teyrgVlQwbNUoOeH/tD9sz2hw0slfDB68mXytIH++IkrASxKfW5QI8THruO2eCdTleKfMrXRjAdUkSLgYf6to1oatjjYYNgwsLD3VooqFuBfJIbh3khPckQGDjNrw1LCv2EHW4l5zCnUK+wdXypeRD11OgYYGzQoB3jo+k4VlxYLHhf4snc7Fw0OlozKd/XkHZK6i0o2H0XKQYd25AcyeHBRpPtT9lExzYdvft8TtlOsJ2oz07WOnduZ2xg0QyXd/vaW12Qbepjez367ZjrWeZXkg83OE1vM/XOfmzJEzz5pbLxP+Fcgr2nLLtAi5adQ8Fbr1t+8IMe7g8nLVfY6jjdwM8kFF60TZvMAz/4o3DAm7Z9KG2LQG+v5PDg66le6AvNsr0sDtlgW9Gu4qWGU4kM8uYlRHxp+lb8I/dlafKh/cSZXzDjpko/i2JqROFlYMCfqs3LcP1Zj5vXZb9sRqv9eNasD4zgZU/T4WVSdKK8RWStY2u1hcKOJXybfDO1jiqpeGgcKGMT2u8QwWcds2w/hdRk3X1BP3Fp+MmvlcH/VJcS7CPJQEzb/pSXQ8CxxHNRfDI7/9MDlPT4UEtyrkuqbdK3fNdMni10/hGL4mbyjCDZaN34/PLsgVR0ZTxpK42OKqdeSZtxAQvcBFmI0VKb43D0NJeFvC0nfoRmrCKIkoyUDAodpqicznrBejE7OLEc4azVJVeQ2mtd3eUhY29l0WJAd7ywkg2omiQ6Pozn9f7HSWStMfwMw12UJzizSFPTKouHdV3B+axdsockvFbr+I5WkXWTOYx1KAczkwEnssQTdpb65V0/tmcXZJ1R1lvm8zHmARMl5n1QY9+0zsS4/c9ovy4yibNqZW2t/uAit+u/9PUIkSceuzoZeJvuNCaEfUCKlvlhWHbxeF+pcofdpGOWqasmARgg4FDg7j8IzFeG4bkTOV5MrUGdZ3Dn57Gul0ZWufhA/WTNBcxF237WQNYFaTkhPhK2nTvra1lXxc6XhhLUU8Ou0xuA3UCjhI937aPABqfERQtY4hKWOOC+a58NXsvDmbPQrRipAPIoFZ39guJlH02RB98SSyyP6jDD5kBPE8NZYhrbaAFJoE66Va0CqZhwQyhR0EkeUdCWytf39iwqopGGojcMD59bEJbo4tSYuynz4UzOfa48yTVylyazKLNyOhPBaVpN5jWK61BNXVgXhEJrQOIF3o/ccULu2hcYVb5qm7qnWiy2w4Sa7hjB3fNt4ZJkdLqzkrYyeityuw822/rreaRc/KkI1l20VkQMi5iWSFrVjAoqnIz7LvSIeBORuK3aeZTFVwIR9eH6ZS6A+4CT5ZTWuRXxGfMlUU51Bx40P66QpNIcbZK/mkB+iMRH4wQ8Gv5MhMnjLUVch7RIIv2CAV4V1ekQGOHEu/OcBOLLVr3s+1hYs2tsOZAAQyIBE/AYmgEGIhF9/iWHTmnoQfJXeocmFc6P8mtWT0tYmF2VpOTHxxyKYjHgegOU75dnEfMKigk9EEAMwONRtnMjhpDGctw2u+JP3Uxcdrmux60GcptxKiw+LpmU+R+Mh4cAWew55IESmcMPyVmgoRowp2a6AR5zpGWjYC9Na+gpYSdcCvLJBAE9+FkXHrHT4R81XQHS/9L8rh7q0pHZLaYBgAZzAWgb2C5azgDQXKvQovJD9KW+1v6EBmWVL288+t5e1d8SwMakkeTBTrgzcwf1R4X0thnauIvkTkfKJ0StC2mtg0tcGO2psNx2QRoHGUfEohX6Yz6WoZuMArxZLZ9gdiHyj/V1XfNfsvEHi6w2PNPxxqb+xBvob/TPryQjXm+saOjPBMor+3uf/gUZv31mYG7KP6lj+uZnknxmtH9n1JnMhqOR0QC1uCwyX3HLMc79Ebu2EgfyEde2ImxEkiawtenUiDficYZE2ziNNZLEDjhmy+Q9qKLyjfqoRY7GupFgqotauYt0dUXzwxFzxGnAN8duTIxuxKYNCcoXbO/ferbT7H198XhHO51m+xVhRDZmPN8ln+A3R7Hn2hwGIgKPS6fqav4hQ57DfnytP2Md0el0RMYTflnqcDmfUey2+1NrnzvVAeD3rFeWmcJbtQLKqRohtnS25xCZdbe8bljUbUFt8S+Q+LnoI0k6Vuo+5csq+d6O3M8BsBLgKq1Pz/8JxR9JOOBqqiVPs6jbHmvrXEmfuOgjSTpq6xply4p6rzxzxAIrAi6O2kCgiz+ScMDVxPOr1skJ1xng0zMITFU9k39/C7AhM6Eqn8qgX5hYLQOfOa4Bl4vfTLj5OCVPL1bC5P3w3Qe2wEmL/ZXBBNNMPgnECgA8bTav0ojAJabL59AAbMt7Jcga0+cFLC2gpTvo75WXt10z1XXnOL7PGoix71TsiLupso8jwE5FJAj9KKTGMFqpS44Js3SbvTmw5mPejlbngnLioX393QHDVo8oAV80OgpanIHqxJCImSx44uFyKYYQF4gKhfivDoVyWZUOVC7EoDnDXfTT/UnpJIQyb2hCor8uxyUwjsjM4XDx7W4BAQHmNAQL8xQXMWKe0w8LA9MVnTjR0YkWTtxjJArK4dKO5NBIAOVOm8Nsd2lwDoOciUGRsaF6QZ+OQ9lTs3kWjdxAujwRc6L5t3OGJdvIspOOJYthoQRXLF4niruxWGY4oM/7j65kJ6ghpKIXFMSUurCuUOJiKhpQUJZLfX6KPStWoTXbAgeGLpwepHP2Z8X4y9yMknFMtzP+BAeHRaOwEBMof4nAFlK8l1ddA4Aa26T6Pz35XUiDJi3attluh5122W2PvfbRoUuPPgOGjBjbz4QpKDMHHHTIYUccdcxxJ5x0ymlnmIOxg/AZazb6/zTsINg7y4EjJ86QXLhCQXOD4Q4LB4/Agycv3nz48uOPKECgICTByEKEChMuQiRKgKlFlmzjKv0qR5EC53VqDQjly1QWajwkuSp5XoYGNejygU0+0uySObddRkVTLMqCaLPmrVi0ZNlv6O65Y9UVDP9S4qH7HmD6w19k2Fg4YsXgasQjwCckIiEWJ97vpBIlSJIi2Ygmqc5Jk+5Pf7vuql6jHnsSmiwM9lixzwGHsTv2xN7YFzqhq0+/IcOmDBg0LVd36JmgDH2FYTAZTxP4TIu3V7ZUlzxnwWAuWWmi7pBrTjKXFNuWqgADSYukZRKetEpaJ22Stkm7JCLhcsgCFlho/WdETkZRRMzzwBIDEtY6vFe1I9FWtrEc4Sv1udgbgR661PsLtZMX+dXQiHLoeVbrbP9V/4iuauBqh54GPHkKBHp6D75oJ78hPkQSMDmEkYgOJZZALzgDqnGHDbC5PVoBkB9ke+bcqxtQoKIif/6bjXlvUE4pn+9St3ZK+0MBGZjje3oyQXuXiUF3l61G/xgXXDNXQzo=) format('woff2'),url(data:application/x-font-woff;charset=utf-8;base64,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) format('woff');font-weight: 400;font-style: normal;}
        p{margin:0px 0px 3px;}
        p img{max-width: 320px;max-height: 90px;}
    </style><title></title></head><body>
<p class="western" align="center" style="text-align: left;"><font>
    <img style="max-width: 180px;" src="data:image/png;base64,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" alt="">
    <font color="#002a3a"><font face="Century Gothic, serif"><br></font></font></font></p>
    <p class="western" align="center"><font><font color="#002a3a"><font face="Century Gothic, serif" size="6">Attestato di Partecipazione</font></font></font></p><p class="western"><br><br></p>
    <p class="western" align="center"><font color="#002a3a"><font face="Century Gothic, serif" size="1">Si attesta che</font></font></p><p class="western" align="center"><br><br></p>
    <p class="western" align="center"><font color="#002a3a"><font face="Century Gothic, serif"><font size="2">L&#8217; Avv. <b>` + this.nameOfAttendee + `</b></font></font></font></p>
    <p class="western" align="center"><font color="#002a3a"><font face="Century Gothic, serif" size="2"><font>ha partecipato al seminario interno</font></font></font></p>
    <p class="western" align="center"><font color="#002a3a"><font face="Century Gothic, serif"><font size="4"><b>` + this.nameOfEvent + `</b></font></font></font></p>
    <p class="western" align="center"><font color="#002a3a"><font face="Century Gothic, serif"><font size="2">che si &#232; tenuto <b>` + this.typeOfEvent + `</b></font></font></font></p>
    <p class="western"><br><br></p><p class="western" align="center"><font color="#002a3a">
    <font face="Century Gothic, serif" size="2">Dal <b>` + this.startDateOfEvent + `</b> Al <b>` + this.endDateOfEvent + `</b> dalle ore <b>` + this.fromOfEvent + `</b> alle ore <b>` + this.toOfEvent + `</b></font></font>
    </p><br><p class="western" align="center">
    <font color="#002a3a"><font face="Century Gothic, serif"><font size="2">Il CNF con provvedimento Prot. n. </font></font></font>
    <font color="#002a3a"><font face="Century Gothic, serif"><font size="2"><b>[Reference Number]</b></font></font></font></p>
    <p class="western" align="center"><font color="#002a3a"><font face="Century Gothic, serif"><font size="2">ha deliberato di concedere l'accreditamento nella misura di n. </font></font></font></br>
    <font color="#002a3a"><font face="Century Gothic, serif"><font size="2"><b>` + this.numberOfCreditsOfEvent + `</b></font></font></font><font color="#002a3a"><font face="Century Gothic, serif"><font><b> </b></font></font></font><font color="#002a3a">
    <font face="Century Gothic, serif" size="2"><font>crediti formativi</font></font></font></p><p class="western" align="center"><br><br></p><p class="western" align="center"><br><br></p><p class="western"><br></p>
    <p class="western" align="center"><font color="#002a3a"><font face="Century Gothic, serif" size="2">Il responsabile del corso</font></font></p>
    <p class="western" align="center"><font color="#002a3a"><font face="Century Gothic, serif" size="2">Avv. Daniele Geronzi</font></font></p>
    <p class="western" align="center"><font color="#002a3a"><font face="Century Gothic, serif" size="2"><b><img src="data:image/png;base64,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" ></b></font></font></p>
</body>
</html>`;
    invitationEmailData: any;
    isCalendar: any;

    constructor(
        private _formBuilder: FormBuilder,
        private helper: MCPHelperService,
        private scopeApi: EventManagementScopesService,
        public translate: TranslateService,
        private router: Router,
        public dialog: MatDialog,
        public eventAPI: EventManagementListOfEventService,
        public route: ActivatedRoute,
        private siteServiceApi: SiteService,
        private externalVenuesApi: EventManagementExternalVenuesService,
        public userManageService: AdminUserManagementService,
        private ApiService: MasterDocumentTypeService,
        private recruitingManagementService: RecruitingManagementService,
        private sanitizer: DomSanitizer,
        private changeDetectionRef: ChangeDetectorRef,
        private dataStorageManagementService: DataStorageManagementService,
        private authenticatorService: GoogleCalendarAuthService,
        private _liveAnnouncer: LiveAnnouncer,
        private injector: Injector
    ) {
        this._setSearchSubscription();
        this.userTz = moment.tz.guess();
        this.finalValueForm = this._formBuilder.group({
            name: [''],
            scope: this.scopeId === null ? '' : this.scopeId,
            emailFrom: [''],
            costCenter: [[]],
            type: [''],
            area: [],
            startDate: [''],
            endDate: [''],
            from: [''],
            to: [''],
            disableInvitationFlow: false,
            description: [''],
            isEditEventCredit: false,
            step: [''],
            id: this.id,
            authorId: [''],
            isMeetingLinkActiveBySecretCode: false,
            addIcsFile: false,
            venue: {
                meetingLink: '',
                vanue: [],
            },
            resources: [],
            services: [],
            attendees: {
                owner: {
                    internal: [],
                    external: []
                },
                organizer: {
                    internal: [],
                    external: []
                },
                speaker: {
                    internal: [],
                    external: []
                },
                attendee: {
                    internal: [],
                    external: []
                },
                technicalSupport: {
                    internal: [],
                    external: []
                },
                assistant: {
                    internal: [],
                    external: []
                },
            },
            documents: {
                documentTypeId: '',
                imageId: ''
            },
            checkpoints: {
                checkInOut: false,
                otherCheckParam: false,
                otherCheckParamCount: null,
                eventCredit: false,
                eventCreditCount: null,
                attendanceCertificate: false,
                eventSetting: {
                    sendInvitation: false,
                    sendEmailReminder: false,
                    remainderTime: null,
                    sendPushNotification: false,
                },
                attendeeCertificateUses: [],
                attendeeCertificateData: this.htmlContent
            },
        });
    }

    ngAfterViewInit(): void {
        // @ts-ignore
        /*this.tokenClient = google.accounts.oauth2.initTokenClient({
            // client_id: '675549511936-7b79coi35r69jgnlb7k30eimpg6rdod4.apps.googleusercontent.com',
            client_id: '625887814774-hiccphug9ia1torij90j31mtlgakcrdv.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/calendar',
            callback: null, // defined later
        });*/
    }

    ngOnInit(): void {
        this.sideMenuName();
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id == null || this.id == '0') {
            this.conditionTextId = true
        } else {
            this.conditionTextId = false
        }
        this.createTimeId = this.route.snapshot.paramMap.get('id');
        this.calendarCreateEvent = this.route.snapshot.queryParams
        this.isCalendar = this.calendarCreateEvent.redirection
        if (this.calendarCreateEvent.start) {
            let start = new Date(this.calendarCreateEvent.start)
            let startHours: any = start.getHours();
            let startMinutes: any = start.getMinutes();
            startHours = startHours <= 9 ? '0' + startHours : startHours;
            startMinutes = startMinutes <= 9 ? '0' + startMinutes : startMinutes;
            this.isoStart = new Date(start.toISOString())
            let end = new Date(this.calendarCreateEvent.end)
            let endtHours: any = end.getHours();
            let endMinutes: any = end.getMinutes();
            endtHours = endtHours <= 9 ? '0' + endtHours : endtHours;
            endMinutes = endMinutes <= 9 ? '0' + endMinutes : endMinutes;
            this.isoEnd = new Date(end.toISOString())
            this.gClaendarFrom = startHours + ":" + startMinutes
            this.gCalendarTo = endtHours + ":" + endMinutes
        }

        this.scopeId = this.route.snapshot.paramMap.get('scopeId');
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.companyId = authUser.person.companyId;
            this.authorId = authUser.person.id;
        }

        this.detailsInfoForm = this._formBuilder.group({
            name: ['', Validators.required],
            scope: [this.scopeId === null ? '' : this.scopeId, Validators.required],
            emailFrom: [''],
            costCenter: [[]],
            type: ['', Validators.required],
            area: [null],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            from: ['', Validators.required],
            to: ['', Validators.required],
            disableInvitationFlow: true,
            description: [''],
            isEditEventCredit: false,
            authorId: this.authorId,
            step: ['1'] // event detail step
        });
        this.detailsInfoForm.controls['startDate'].setValue(this.isoStart);
        this.detailsInfoForm.controls['endDate'].setValue(this.isoEnd);
        this.detailsInfoForm.controls['from'].setValue(this.gClaendarFrom);
        this.detailsInfoForm.controls['to'].setValue(this.gCalendarTo);
        this.venuesInfoForm = this._formBuilder.group({
            step: ['2'], // event venue step
            id: this.id,
            meetingLink: [''],
            venue: this._formBuilder.array([])
        });
        const VenueInformation = this.venuesInfoForm.get('venue') as FormArray;
        this.vanueDetailsForm = this._formBuilder.group({
            type: [null],
            site: [null]
        })
        VenueInformation.push(this.vanueDetailsForm);


        this.resourcesInfoForm = this._formBuilder.group({
            step: ['3'], // event resources step
            id: this.id,
            resources: this._formBuilder.array([])
        });
        this.resourcesList = this.resourcesInfoForm.get('resources') as FormArray;
        /*const ResourceInformation = this.resourcesInfoForm.get('resources') as FormArray;
        this.resourcesDetailsForm = this._formBuilder.group({
           assetType: [''],
           resourceName: [''],
           custome: ['']
        })
        ResourceInformation.push(this.resourcesDetailsForm);*/

        this.servicesInfoForm = this._formBuilder.group({
            step: ['4'], // event services step
            id: this.id,
            services: this._formBuilder.array([])
        });
        const ServicesInformation = this.servicesInfoForm.get('services') as FormArray;
        ServicesInformation.push(this._formBuilder.group({
            serviceId: [null],
            note: [null],
            sendMail: [false],
        }));

        this.checkpointsInfoForm = this._formBuilder.group({
            checkInOut: false,
            otherCheckParam: false,
            otherCheckParamCount: null,
            eventCredit: false,
            eventCreditCount: null,
            attendanceCertificate: false,
            sendInvitation: false,
            sendEmailReminder: false,
            sendPushNotification: false,
            remainderTime: null,
            attendeeCertificateUses: [],
            attendeeCertificateData: this.htmlContent,
            isMeetingLinkActiveBySecretCode: false,
            addIcsFile: false,
            hours: '00',
            minutes: '05',
            seconds: '00',
            isMeetingLinkActive: true,
            step: ['7'] // event checkpoints step
        });

        this.documentsInfoForm = this._formBuilder.group({
            step: ['6'], // event documents step
            id: this.id,
            documents: this._formBuilder.array([])
        })
        const documentInformation = this.documentsInfoForm.get('documents') as FormArray;
        documentInformation.push(this._formBuilder.group({
            documentTypeId: [null],
            imageId: [null],
            imageName: ''
        }));

        this.getEventData();
        this.getInternalPeoplesList({limit: null});
        /*this.getDocumentType({limit: null});*/
        this.attendeesCertificateFuncation();
    }

    sidebarMenuName: any;

    sideMenuName() {
        this.sidebarMenuName = 'List of Events';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    createEventOnGoogle() {
        this.authenticatorService.loadAuth2();
        //this.handleAuthClick();
    }

    handleAuthClick() {
        this.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            // document.getElementById('signout_button').style.visibility = 'visible';
            // document.getElementById('authorize_button').innerText = 'Refresh';
            // document.getElementById('createEvent').style.visibility = 'visible';

            this.createEvent();
        };

        if (gapi.client?.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            this.tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            this.tokenClient.requestAccessToken({prompt: ''});
        }

    }

    async createEvent() {
        this.helper.toggleLoaderVisibility(true);
        try {
            const event1 = {
                'summary': this.eventDetailsForGoogle?.name,
                'location': 'z  ',
                'description': this.eventDetailsForGoogle?.description,
                'start': {
                    //2000-01-23T01:23:45.678+09:00
                    'dateTime': this.eventDetailsForGoogle?.startDate.substring(0, 10) + 'T' + this.eventDetailsForGoogle?.from + ':00-05:30',
                    'timeZone': this.userTz
                },
                'end': {
                    'dateTime': this.eventDetailsForGoogle?.endDate.substring(0, 10) + 'T' + this.eventDetailsForGoogle?.to + ':00-06:30',
                    'timeZone': this.userTz
                },
                'recurrence': [
                    'RRULE:FREQ=DAILY;COUNT=2'
                ],
                'attendees': this.listOfAttendees,
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 10}
                    ]
                }
            };
            this.responseInsert = await gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event1
            });
            const events = await this.responseInsert.result.items;
            if (!events || events) {
                this.helper.toggleLoaderVisibility(false);
                // document.getElementById('content').innerText = 'Event added successfully';
                EventHelper.showMessage('', "Event added to google calendar successfully.", 'success');
                return;
            }
        } catch (err) {
            return;
        }

        try {

            const request = await gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });
            // request.execute(function(event) {
            //     appendPre('Event created: ' + event.htmlLink);
            // });
        } catch (err) {
            return;
        }
    }

    changeVenueType(event): void {
        if (event === 'internal') {
            this.getSiteList();
        } else {
            this.getExternalVenuesList();
        }
    }

    onTabChanged($event) {
        /*this.getEventData();*/
    }

    move(index: number) {
        this.attendeesStepper.selectedIndex = index;
    }

    removeDuplicates(myArray, Prop) {
        return myArray.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[Prop]).indexOf(obj[Prop]) === pos;
        });
    }
    checkedListData(event) {
        this.saveInternalOwner = this.removeDuplicates(this.saveInternalOwner, 'id');
        this.saveInternalOrganize = this.removeDuplicates(this.saveInternalOrganize, 'id');
        this.saveInternalSpeaker = this.removeDuplicates(this.saveInternalSpeaker, 'id');
        this.saveInternalAttendee = this.removeDuplicates(this.saveInternalAttendee, 'id');
        this.saveInternalTechnicalSupport = this.removeDuplicates(this.saveInternalTechnicalSupport, 'id');
        this.saveInternalAssistant = this.removeDuplicates(this.saveInternalAssistant, 'id');
        if (event.previouslySelectedIndex === 0) {
            this.helper.toggleLoaderVisibility(true);
            const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
            this.saveInternalOwner = this.saveInternalOwner.map(o => filterKeys.reduce((acc, curr) => {
                if (curr == 'invitataion') {
                    acc[curr] = o[curr] ? o[curr] : 'pending';
                } else if (curr == 'eventCreditCount') {
                    acc[curr] = o[curr] ? o[curr] : 0;
                } else if (curr == 'isEmailSent') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else if (curr == 'attendeeId') {
                    acc[curr] = o[curr] ? o[curr] : '';
                } else if (curr == 'checkPointsCompiled') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else {
                    acc[curr] = o[curr];
                }
                return acc;
            }, {}));
        } else if (event.previouslySelectedIndex === 1) {
            this.helper.toggleLoaderVisibility(true);
            const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
            this.saveInternalOrganize = this.saveInternalOrganize.map(o => filterKeys.reduce((acc, curr) => {
                if (curr == 'invitataion') {
                    acc[curr] = o[curr] ? o[curr] : 'pending';
                } else if (curr == 'eventCreditCount') {
                    acc[curr] = o[curr] ? o[curr] : 0;
                } else if (curr == 'isEmailSent') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else if (curr == 'attendeeId') {
                    acc[curr] = o[curr] ? o[curr] : '';
                } else if (curr == 'checkPointsCompiled') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else {
                    acc[curr] = o[curr];
                }
                return acc;
            }, {}));
        } else if (event.previouslySelectedIndex === 2) {
            this.helper.toggleLoaderVisibility(true);
            const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
            this.saveInternalSpeaker = this.saveInternalSpeaker.map(o => filterKeys.reduce((acc, curr) => {
                if (curr == 'invitataion') {
                    acc[curr] = o[curr] ? o[curr] : 'pending';
                } else if (curr == 'eventCreditCount') {
                    acc[curr] = o[curr] ? o[curr] : 0;
                } else if (curr == 'isEmailSent') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else if (curr == 'attendeeId') {
                    acc[curr] = o[curr] ? o[curr] : '';
                } else if (curr == 'checkPointsCompiled') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else {
                    acc[curr] = o[curr];
                }
                return acc;
            }, {}));
        } else if (event.previouslySelectedIndex === 3) {
            this.helper.toggleLoaderVisibility(true);
            const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
            this.saveInternalAttendee = this.saveInternalAttendee.map(o => filterKeys.reduce((acc, curr) => {
                if (curr == 'invitataion') {
                    acc[curr] = o[curr] ? o[curr] : 'pending';
                } else if (curr == 'eventCreditCount') {
                    acc[curr] = o[curr] ? o[curr] : 0;
                } else if (curr == 'isEmailSent') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else if (curr == 'attendeeId') {
                    acc[curr] = o[curr] ? o[curr] : '';
                } else if (curr == 'checkPointsCompiled') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else {
                    acc[curr] = o[curr];
                }
                return acc;
            }, {}));

        } else if (event.previouslySelectedIndex === 4) {
            this.helper.toggleLoaderVisibility(true);
            const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
            this.saveInternalTechnicalSupport = this.saveInternalTechnicalSupport.map(o => filterKeys.reduce((acc, curr) => {
                if (curr == 'invitataion') {
                    acc[curr] = o[curr] ? o[curr] : 'pending';
                } else if (curr == 'eventCreditCount') {
                    acc[curr] = o[curr] ? o[curr] : 0;
                } else if (curr == 'isEmailSent') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else if (curr == 'attendeeId') {
                    acc[curr] = o[curr] ? o[curr] : '';
                } else if (curr == 'checkPointsCompiled') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else {
                    acc[curr] = o[curr];
                }
                return acc;
            }, {}));

        } else if (event.previouslySelectedIndex === 5) {
            this.helper.toggleLoaderVisibility(true);
            const filterKeys = ['id', 'name', 'surname', 'email', 'invitataion', 'eventCreditCount', 'isEmailSent', 'attendeeId', 'checkPointsCompiled'];
            this.saveInternalAssistant = this.saveInternalAssistant.map(o => filterKeys.reduce((acc, curr) => {
                if (curr == 'invitataion') {
                    acc[curr] = o[curr] ? o[curr] : 'pending';
                } else if (curr == 'eventCreditCount') {
                    acc[curr] = o[curr] ? o[curr] : 0;
                } else if (curr == 'isEmailSent') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else if (curr == 'attendeeId') {
                    acc[curr] = o[curr] ? o[curr] : '';
                } else if (curr == 'checkPointsCompiled') {
                    acc[curr] = o[curr] ? o[curr] : false;
                } else {
                    acc[curr] = o[curr];
                }
                return acc;
            }, {}));
        }

        this.finalValueForm.patchValue({
            id: this.id,
            authorId: this.authorId,
            attendees: {
                owner: {
                    internal: [...this.saveInternalOwner],
                    external: [...this.saveExternalOwner]
                },
                organizer: {
                    internal: [...this.saveInternalOrganize],
                    external: [...this.saveExternalOrganize]
                },
                speaker: {
                    internal: [...this.saveInternalSpeaker],
                    external: [...this.saveExternalSpeaker]
                },
                attendee: {
                    internal: [...this.saveInternalAttendee],
                    external: [...this.saveExternalAttendee]
                },
                technicalSupport: {
                    internal: [...this.saveInternalTechnicalSupport],
                    external: [...this.saveExternalTechnicalSupport]
                },
                assistant: {
                    internal: [...this.saveInternalAssistant],
                    external: [...this.saveExternalAssistant]
                },
            },
            step: '5'
        });
        this.eventAPI.getCreateEvent(this.finalValueForm.value).then((res: any) => {
            if (res.statusCode == 200) {
                const updatedPeopleData = res?.data;
                this.selectedInternalPeople = [];
            }
            this.helper.toggleLoaderVisibility(false);
        }, (err) => {
            EventHelper.showMessage('', this.translate.instant(err.error.message), 'info');
            this.helper.toggleLoaderVisibility(false);
        });

        this.internalPeoplesList = [];
        if (event.selectedIndex === 0) {
            this.selectedInternalPeopleCount = this.saveInternalOwner.length;
            this.selectedExternalPeopleCount = this.externalOwnerList.length;
            this.attendeeStepIndex = 0;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOwnerValue
            });
        } else if (event.selectedIndex === 1) {
            this.selectedInternalPeopleCount = this.saveInternalOrganize.length;
            this.selectedExternalPeopleCount = this.externalOrganizeList.length;
            this.attendeeStepIndex = 1;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOrganizerValue
            });
        } else if (event.selectedIndex === 2) {
            this.selectedInternalPeopleCount = this.saveInternalSpeaker.length;
            this.selectedExternalPeopleCount = this.externalSpeakerList.length;
            this.attendeeStepIndex = 2;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterSpeakerValue
            });
        } else if (event.selectedIndex === 3) {
            this.selectedInternalPeopleCount = this.saveInternalAttendee.length;
            this.selectedExternalPeopleCount = this.externalAttendeeList.length;
            this.attendeeStepIndex = 3;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAttendeeValue
            });
        } else if (event.selectedIndex === 4) {
            this.selectedInternalPeopleCount = this.saveInternalTechnicalSupport.length;
            this.selectedExternalPeopleCount = this.externalTechnicalSupportList.length;
            this.attendeeStepIndex = 4;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterTechnicalSupportValue
            });
        } else if (event.selectedIndex === 5) {
            this.selectedInternalPeopleCount = this.saveInternalAssistant.length;
            this.selectedExternalPeopleCount = this.externalAssistantList.length;
            this.attendeeStepIndex = 5;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAssistantValue
            });
        }
        /*var arr2 = [
            ...this.saveInternalOwner,
            ...this.saveInternalOrganize,
            ...this.saveInternalSpeaker,
            ...this.saveInternalAttendee,
            ...this.saveInternalTechnicalSupport,
            ...this.saveInternalAssistant
        ];*/
    }

    public space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

    async getEventData(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        if (this.id !== '0') {
            this.isLinear = false;
            // this.attendeesStepperControl = false;
            await this.getAttendeesUserList();
            await this.eventAPI.getEditEvent({id: this.id}).then((res: any) => {
                this.editEventData = res.data;
                this.matStepVisible = true;
                this.eventCurrentStatus = this.editEventData.status;
                this.helper.toggleLoaderVisibility(false);
                this.updateFinalFormValue(this.editEventData);
                this.detailsInfoForm.patchValue({
                    name: this.editEventData?.name,
                    scope: this.editEventData?.scope,
                    emailFrom: this.editEventData?.emailFrom,
                    costCenter: this.editEventData?.costCenter,
                    type: this.editEventData?.type,
                    area: this.editEventData?.area ? this.editEventData?.area[0] : null,
                    startDate: this.editEventData?.startDate,
                    endDate: this.editEventData?.endDate,
                    from: this.editEventData?.from,
                    to: this.editEventData?.to,
                    disableInvitationFlow: this.editEventData?.disableInvitationFlow,
                    description: this.editEventData?.description,
                    isEditEventCredit: false,
                });
                this.detailsInfoFormOldData = res.data;
                this.checkpointsInfoForm.patchValue({
                    checkInOut: this.editEventData?.checkpoints?.checkInOut,
                    otherCheckParam: this.editEventData?.checkpoints?.otherCheckParam,
                    otherCheckParamCount: this.editEventData?.checkpoints?.otherCheckParamCount,
                    eventCredit: this.editEventData?.checkpoints?.eventCredit,
                    eventCreditCount: this.editEventData?.checkpoints?.eventCreditCount,
                    attendanceCertificate: this.editEventData?.checkpoints?.attendanceCertificate,
                    attendeeCertificateData: this.editEventData?.checkpoints?.attendeeCertificateData ? this.editEventData?.checkpoints?.attendeeCertificateData : this.htmlContent,
                    sendInvitation: this.editEventData?.checkpoints?.eventSetting?.sendInvitation,
                    sendEmailReminder: this.editEventData?.checkpoints?.eventSetting?.sendEmailReminder,
                    sendPushNotification: this.editEventData?.checkpoints?.eventSetting?.sendPushNotification,
                    remainderTime: this.editEventData?.checkpoints?.eventSetting?.remainderTime,
                    isMeetingLinkActiveBySecretCode: this.editEventData?.isMeetingLinkActiveBySecretCode,
                    addIcsFile: this.editEventData?.addIcsFile,
                    step: ['7'] // event checkpoints step
                });
                this.htmlContent = this.checkpointsInfoForm.value.attendeeCertificateData ? this.checkpointsInfoForm.value.attendeeCertificateData : this.htmlContent;
                this.venuesInfoForm.patchValue({
                    meetingLink: this.editEventData?.venue?.meetingLink,
                    venue: this.editEventData?.venue?.vanue
                });
                if (this.editEventData?.venue?.vanue?.length > 0) {
                    let ctrl = <FormArray>this.venuesInfoForm.controls.venue;
                    ctrl.removeAt(0);
                    this.editEventData?.venue?.vanue.forEach((ds, index) => {
                        if (ds.type === 'internal') {
                            this.getSiteList();
                        } else {
                            this.getExternalVenuesList();
                        }
                        ctrl.push(
                            this._formBuilder.group({
                                type: [ds.type],
                                site: [ds.site],
                            })
                        );
                    });
                }
                this.resourcesInfoForm.patchValue({
                    resources: this.editEventData?.resources
                });
                if (this.editEventData?.resources?.length > 0) {
                    let rsctrl = <FormArray>this.resourcesInfoForm.controls.resources;
                    rsctrl.removeAt(0);
                    this.editEventData?.resources.forEach((ds, index) => {
                        if (ds.assetType !== null) {
                            this.getResourceByAssetType(index, ds.assetType)
                        }
                        rsctrl.push(
                            this._formBuilder.group({
                                assetType: [ds.assetType ? ds.assetType : null],
                                resourceName: [ds.resourceName ? ds.resourceName : null],
                                custome: [ds.custome ? ds.custome : null]
                            })
                        );
                    });
                }
                //this.getAssetList(0);

                this.servicesInfoForm.patchValue({
                    services: this.editEventData?.services
                });
                if (this.editEventData?.services?.length > 0) {
                    let stctrl = <FormArray>this.servicesInfoForm.controls.services;
                    stctrl.removeAt(0);
                    this.editEventData?.services.forEach((ds, index) => {
                        stctrl.push(
                            this._formBuilder.group({
                                serviceId: [ds.serviceId],
                                note: [ds.note],
                                sendMail: [ds.sendMail]
                            })
                        );
                    });
                }
                /*this.documentsInfoForm.patchValue({
                    documents: this.editEventData?.documents
                });*/
                if (this.editEventData?.documents?.length > 0) {
                    let stctrl = <FormArray>this.documentsInfoForm.controls.documents;
                    stctrl.removeAt(0);
                    this.editEventData?.documents.forEach((ds, index) => {
                        stctrl.push(
                            this._formBuilder.group({
                                documentTypeId: [ds.documentTypeId],
                                imageId: [ds.imageId]
                            })
                        );
                        if (ds.imageId != null) {
                            this.dataStorageManagementService.getFileDetails(ds.imageId).then((res: any) => {
                                //this.documentName[index] = res?.data?.file ? res.data.file : null;
                                this.documentsInfoForm.value.documents[index].imageName = res?.data?.file ? res.data.file : null;
                            });

                        }
                    });
                }
                this.createQRCode(this.id);
                this.createICSFile(this.id);
                /*this.checkCheckpointValidation();*/
                this.attendeeEditList = this.editEventData?.checkpoints?.attendeeCertificateUses;
                this.attendeesCertificateFuncation();
                this.helper.toggleLoaderVisibility(false);
            }, (err) => {
                swal.fire(
                    'Info',
                    this.translate.instant(err.error.message),
                    'info'
                );
                this.router.navigate(['event-management/event-list/']);
            });
        } else {
            this.matStepVisible = true;
        }
    }

    updateFinalFormValue(updatedEditEventData: any) {
        this.finalValueForm.patchValue({
            name: updatedEditEventData?.name,
            scope: updatedEditEventData?.scope,
            emailFrom: updatedEditEventData?.emailFrom,
            costCenter: updatedEditEventData?.costCenter,
            type: updatedEditEventData?.type,
            area: updatedEditEventData?.area ? updatedEditEventData?.area[0] : null,
            startDate: updatedEditEventData?.startDate,
            endDate: updatedEditEventData?.endDate,
            from: updatedEditEventData?.from,
            to: updatedEditEventData?.to,
            disableInvitationFlow: updatedEditEventData?.disableInvitationFlow,
            description: updatedEditEventData?.description,
            isEditEventCredit: false,
            isMeetingLinkActiveBySecretCode: updatedEditEventData?.isMeetingLinkActiveBySecretCode,
            addIcsFile: updatedEditEventData?.addIcsFile,
            venue: {
                meetingLink: updatedEditEventData?.venue?.meetingLink,
                vanue: updatedEditEventData?.venue?.vanue
            },
            resources: updatedEditEventData?.resources ? updatedEditEventData?.resources : [],
            services: updatedEditEventData?.services ? updatedEditEventData?.services : [],
            attendees: {
                owner: {
                    internal: updatedEditEventData?.attendees?.owner?.internal ? updatedEditEventData?.attendees?.owner?.internal : [''],
                    external: updatedEditEventData?.attendees?.owner?.external ? updatedEditEventData?.attendees?.owner?.external : ['']
                },
                organizer: {
                    internal: updatedEditEventData?.attendees?.organizer?.internal ? updatedEditEventData?.attendees?.organizer?.internal : [''],
                    external: updatedEditEventData?.attendees?.organizer?.external ? updatedEditEventData?.attendees?.organizer?.external : ['']
                },
                speaker: {
                    internal: updatedEditEventData?.attendees?.speaker?.internal ? updatedEditEventData?.attendees?.speaker?.internal : [''],
                    external: updatedEditEventData?.attendees?.speaker?.external ? updatedEditEventData?.attendees?.speaker?.external : ['']
                },
                attendee: {
                    internal: updatedEditEventData?.attendees?.attendee?.internal ? updatedEditEventData?.attendees?.attendee?.internal : [''],
                    external: updatedEditEventData?.attendees?.attendee?.external ? updatedEditEventData?.attendees?.attendee?.external : ['']
                },
                technicalSupport: {
                    internal: updatedEditEventData?.attendees?.technicalSupport?.internal ? updatedEditEventData?.attendees?.technicalSupport?.internal : [''],
                    external: updatedEditEventData?.attendees?.technicalSupport?.external ? updatedEditEventData?.attendees?.technicalSupport?.external : ['']
                },
                assistant: {
                    internal: updatedEditEventData?.attendees?.assistant?.internal ? updatedEditEventData?.attendees?.assistant?.internal : [''],
                    external: updatedEditEventData?.attendees?.assistant?.external ? updatedEditEventData?.attendees?.assistant?.external : ['']
                },
            },
            documents: updatedEditEventData?.documents ? updatedEditEventData?.documents : [],
            checkpoints: {
                checkInOut: updatedEditEventData?.checkpoints?.checkInOut,
                otherCheckParam: updatedEditEventData?.checkpoints?.otherCheckParam,
                otherCheckParamCount: updatedEditEventData?.checkpoints?.otherCheckParamCount,
                eventCredit: updatedEditEventData?.checkpoints?.eventCredit,
                eventCreditCount: updatedEditEventData?.checkpoints?.eventCreditCount,
                attendanceCertificate: updatedEditEventData?.checkpoints?.attendanceCertificate,
                attendeeCertificateUses: updatedEditEventData?.checkpoints?.attendeeCertificateUses,
                attendeeCertificateData: updatedEditEventData?.checkpoints?.attendeeCertificateData ? updatedEditEventData?.checkpoints?.attendeeCertificateData : this.htmlContent,
                eventSetting: {
                    sendInvitation: updatedEditEventData?.checkpoints?.eventSetting?.sendInvitation,
                    sendEmailReminder: updatedEditEventData?.checkpoints?.eventSetting?.sendEmailReminder,
                    remainderTime: updatedEditEventData?.checkpoints?.eventSetting?.remainderTime,
                    sendPushNotification: updatedEditEventData?.checkpoints?.eventSetting?.sendPushNotification,
                }
            },
        });
        this.saveInternalOwner = [...updatedEditEventData?.attendees?.owner?.internal ? updatedEditEventData?.attendees?.owner?.internal : []];
        this.saveInternalOrganize = [...updatedEditEventData?.attendees?.organizer?.internal ? updatedEditEventData?.attendees?.organizer?.internal : []];
        this.saveInternalSpeaker = [...updatedEditEventData?.attendees?.speaker?.internal ? updatedEditEventData?.attendees?.speaker?.internal : []];
        this.saveInternalAttendee = [...updatedEditEventData?.attendees?.attendee?.internal ? updatedEditEventData?.attendees?.attendee?.internal : []];
        this.saveInternalTechnicalSupport = [...updatedEditEventData?.attendees?.technicalSupport?.internal ? updatedEditEventData?.attendees?.technicalSupport?.internal : []];
        this.saveInternalAssistant = [...updatedEditEventData?.attendees?.assistant?.internal ? updatedEditEventData?.attendees?.assistant?.internal : []];
        this.selectedInternalPeopleCount = this.saveInternalOwner.length

        //
        // Attendees step code
        if (updatedEditEventData?.attendees?.owner?.external?.length > 0) {
            this.externalOwnerList = updatedEditEventData?.attendees?.owner?.external;
            this.externalOwnerFilteredList = [...this.externalOwnerList];
            this.saveExternalOwner = this.externalOwnerFilteredList;
            this.selectedExternalPeopleCount = this.saveExternalOwner.length
        }
        if (updatedEditEventData?.attendees?.organizer?.external?.length > 0) {
            this.externalOrganizeList = updatedEditEventData?.attendees?.organizer?.external;
            this.externalOrganizeFilteredList = [...this.externalOrganizeList];
            this.saveExternalOrganize = this.externalOrganizeFilteredList
        }
        if (updatedEditEventData?.attendees?.speaker?.external?.length > 0) {
            this.externalSpeakerList = updatedEditEventData?.attendees?.speaker?.external;
            this.externalSpeakerFilteredList = [...this.externalSpeakerList];
            this.saveExternalSpeaker = this.externalSpeakerFilteredList;
        }
        if (updatedEditEventData?.attendees?.attendee?.external?.length > 0) {
            this.externalAttendeeList = updatedEditEventData?.attendees?.attendee?.external;
            this.externalAttendeeFilteredList = [...this.externalAttendeeList];
            this.saveExternalAttendee = this.externalAttendeeFilteredList;
        }
        if (updatedEditEventData?.attendees?.technicalSupport?.external?.length > 0) {
            this.externalTechnicalSupportList = updatedEditEventData?.attendees?.technicalSupport?.external;
            this.externalTechnicalSupportFilteredList = [...this.externalTechnicalSupportList];
            this.saveExternalTechnicalSupport = this.externalTechnicalSupportFilteredList
        }
        if (updatedEditEventData?.attendees?.assistant?.external?.length > 0) {
            this.externalAssistantList = updatedEditEventData?.attendees?.assistant?.external;
            this.externalAssistantFilteredList = [...this.externalAssistantList];
            this.saveExternalAssistant = this.externalAssistantFilteredList
        }
        this.eventCurrentStatus = updatedEditEventData.status;
        this.disableInvitationFlow = updatedEditEventData.disableInvitationFlow;
        this.isLinear = false;
    }

    isSameUser = (a: any, b: any) => a.id === b.id;

    onlyInLeft = (left, right, compareFunction) =>
        left.filter(leftValue =>
            !right.some(rightValue =>
                compareFunction(leftValue, rightValue)));

    selectInternalTechnicalSupports() {
        if (this.saveInternalTechnicalSupport?.length > 0 && this.internalPeoplesList?.length > 0) {
            this.saveInternalTechnicalSupport.forEach(x => {
                var result = this.selection.selected.find(y => y.id == x.id && y.name == x.name && y.email == x.email && y.surname == x.surname);
                if (!result) {
                    this.selection.selected.push({id: x.id, name: x.name, email: x.email, surname: x.surname})
                }
            })
        }
        let self = this;
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
        }
    }

    async getScopesList(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.scopeApi.getScopesList({limit: null});
        if (res.statusCode === 200) {
            this.scopesList = res.data;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            // const e = err.error;
            swal.fire(
                '',
                // err.error.message,
                this.translate.instant(res.error),
                'info'
            );
        }
    }

    getSiteList(): void {
        this.siteServiceApi.getSites({companyId: this.companyId}).subscribe((res: any) => {
            this.helper.toggleLoaderVisibility(true);
            if (res.statusCode === 200) {
                this.helper.toggleLoaderVisibility(false);
                // this.venueSiteList[index] = res.data;
                this.venueSiteList = res.data;
            } else {
                this.helper.toggleLoaderVisibility(false);
                swal.fire(
                    '',
                    this.translate.instant(res.reason),
                    'info'
                );
            }
        }, (err: any) => {
            this.helper.toggleLoaderVisibility(false);
            const e = err.error;
            swal.fire(
                '',
                this.translate.instant(err.error.message),
                'info'
            );
        });
    }

    async getExternalVenuesList(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.externalVenuesApi.getEventExternalVenuesList({limit: null});
        if (res.statusCode === 200) {
            // this.externalVenuesList[index] = res.data;
            this.externalVenuesList = res.data;
            this.helper.toggleLoaderVisibility(false);
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.error), 'info');
        }
    }

    async getInternalPeoplesList(data: any): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.userManageService.getEventPeople(this.companyId, data);
        if (res.statusCode === 200) {
            setTimeout(() => {
                this.internalPeoplesList = res.data;
                this.totalCount = res.meta.totalCount
                this.internalOrganizeList = res.data;
                if (this.attendeeStepIndex === 0) {
                    this.getOwnerPeopleList()
                } else if (this.attendeeStepIndex === 1) {
                    this.getOrganizerPeopleList()
                } else if (this.attendeeStepIndex === 2) {
                    this.getSpeakerPeopleList()
                } else if (this.attendeeStepIndex === 3) {
                    this.getAttendeePeopleList()
                } else if (this.attendeeStepIndex === 4) {
                    this.getTechnicalSupportPeopleList()
                } else if (this.attendeeStepIndex === 5) {
                    this.getAssistantPeopleList()
                }
                this.changeDetectionRef.detectChanges();
                this.changeDetectionRef.markForCheck();
                this.helper.toggleLoaderVisibility(false);
                this.selectInternalTechnicalSupports();

            }, 1000);

            this.changeDetectionRef.detectChanges();
            this.changeDetectionRef.markForCheck();
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.error), 'info');
        }
    }

    getCommon = (left, right, compareFunction) =>
        left.filter(leftValue =>
            right.some(rightValue =>
                compareFunction(leftValue, rightValue)));
    getOwnerPeopleList() {
        const saveInternalOrganize = this.onlyInLeft(this.internalPeoplesList, this.saveInternalOrganize, this.isSameUser);
        this.internalPeoplesList = [...saveInternalOrganize];
        const saveInternalSpeaker = this.onlyInLeft(this.internalPeoplesList, this.saveInternalSpeaker, this.isSameUser);
        this.internalPeoplesList = [...saveInternalSpeaker];
        const saveInternalAttendee = this.onlyInLeft(this.internalPeoplesList, this.saveInternalAttendee, this.isSameUser);
        this.internalPeoplesList = [...saveInternalAttendee];
        const saveInternalTechnicalSupport = this.onlyInLeft(this.internalPeoplesList, this.saveInternalTechnicalSupport, this.isSameUser);
        this.internalPeoplesList = [...saveInternalTechnicalSupport];
        const saveInternalAssistant = this.onlyInLeft(this.internalPeoplesList, this.saveInternalAssistant, this.isSameUser);
        this.internalPeoplesList = [...saveInternalAssistant]
        this.internalPeoplesListRef = this.internalPeoplesList;
        const saveInternalOwner = this.getCommon(this.internalPeoplesList, this.saveInternalOwner, this.isSameUser);
        this.isSelectedInternalOwner ? this.internalPeoplesList = [...saveInternalOwner] : this.internalPeoplesList = this.internalPeoplesListRef
    }

    getOrganizerPeopleList() {
        const saveInternalOwner = this.onlyInLeft(this.internalPeoplesList, this.saveInternalOwner, this.isSameUser);
        this.internalPeoplesList = [...saveInternalOwner];
        const saveInternalSpeaker = this.onlyInLeft(this.internalPeoplesList, this.saveInternalSpeaker, this.isSameUser);
        this.internalPeoplesList = [...saveInternalSpeaker];
        const saveInternalAttendee = this.onlyInLeft(this.internalPeoplesList, this.saveInternalAttendee, this.isSameUser);
        this.internalPeoplesList = [...saveInternalAttendee];
        const saveInternalTechnicalSupport = this.onlyInLeft(this.internalPeoplesList, this.saveInternalTechnicalSupport, this.isSameUser);
        this.internalPeoplesList = [...saveInternalTechnicalSupport];
        const saveInternalAssistant = this.onlyInLeft(this.internalPeoplesList, this.saveInternalAssistant, this.isSameUser);
        this.internalPeoplesList = [...saveInternalAssistant];
        this.internalPeoplesListRef = this.internalPeoplesList;
        const saveInternalOrganize = this.getCommon(this.internalPeoplesList, this.saveInternalOrganize, this.isSameUser);
        this.isSelectedInternalOrganize ? this.internalPeoplesList = [...saveInternalOrganize] : this.internalPeoplesList = this.internalPeoplesListRef
    }

    getSpeakerPeopleList() {
        const saveInternalOwner = this.onlyInLeft(this.internalPeoplesList, this.saveInternalOwner, this.isSameUser);
        this.internalPeoplesList = [...saveInternalOwner];
        const saveInternalOrganize = this.onlyInLeft(this.internalPeoplesList, this.saveInternalOrganize, this.isSameUser);
        this.internalPeoplesList = [...saveInternalOrganize];
        const saveInternalAttendee = this.onlyInLeft(this.internalPeoplesList, this.saveInternalAttendee, this.isSameUser);
        this.internalPeoplesList = [...saveInternalAttendee];
        const saveInternalTechnicalSupport = this.onlyInLeft(this.internalPeoplesList, this.saveInternalTechnicalSupport, this.isSameUser);
        this.internalPeoplesList = [...saveInternalTechnicalSupport];
        const saveInternalAssistant = this.onlyInLeft(this.internalPeoplesList, this.saveInternalAssistant, this.isSameUser);
        this.internalPeoplesList = [...saveInternalAssistant];
        this.internalPeoplesListRef = this.internalPeoplesList;
        const saveInternalSpeaker = this.getCommon(this.internalPeoplesList, this.saveInternalSpeaker, this.isSameUser);
        this.isSelectedInternalSpeaker ? this.internalPeoplesList = [...saveInternalSpeaker] : this.internalPeoplesList = this.internalPeoplesListRef
    }

    getAttendeePeopleList() {
        const saveInternalOwner = this.onlyInLeft(this.internalPeoplesList, this.saveInternalOwner, this.isSameUser);
        this.internalPeoplesList = [...saveInternalOwner];
        const saveInternalOrganize = this.onlyInLeft(this.internalPeoplesList, this.saveInternalOrganize, this.isSameUser);
        this.internalPeoplesList = [...saveInternalOrganize];
        const saveInternalSpeaker = this.onlyInLeft(this.internalPeoplesList, this.saveInternalSpeaker, this.isSameUser);
        this.internalPeoplesList = [...saveInternalSpeaker];
        const saveInternalTechnicalSupport = this.onlyInLeft(this.internalPeoplesList, this.saveInternalTechnicalSupport, this.isSameUser);
        this.internalPeoplesList = [...saveInternalTechnicalSupport];
        const saveInternalAssistant = this.onlyInLeft(this.internalPeoplesList, this.saveInternalAssistant, this.isSameUser);
        this.internalPeoplesList = [...saveInternalAssistant];
        this.internalPeoplesListRef = this.internalPeoplesList;
        const saveInternalAttendee = this.getCommon(this.internalPeoplesList, this.saveInternalAttendee, this.isSameUser);
        this.isSelectedInternalAttendee ? this.internalPeoplesList = [...saveInternalAttendee] : this.internalPeoplesList = this.internalPeoplesListRef
    }

    getTechnicalSupportPeopleList() {
        const saveInternalOwner = this.onlyInLeft(this.internalPeoplesList, this.saveInternalOwner, this.isSameUser);
        this.internalPeoplesList = [...saveInternalOwner];
        const saveInternalOrganize = this.onlyInLeft(this.internalPeoplesList, this.saveInternalOrganize, this.isSameUser);
        this.internalPeoplesList = [...saveInternalOrganize];
        const saveInternalAttendee = this.onlyInLeft(this.internalPeoplesList, this.saveInternalAttendee, this.isSameUser);
        this.internalPeoplesList = [...saveInternalAttendee];
        const saveInternalSpeaker = this.onlyInLeft(this.internalPeoplesList, this.saveInternalSpeaker, this.isSameUser);
        this.internalPeoplesList = [...saveInternalSpeaker];
        const saveInternalAssistant = this.onlyInLeft(this.internalPeoplesList, this.saveInternalAssistant, this.isSameUser);
        this.internalPeoplesList = [...saveInternalAssistant];
        this.internalPeoplesListRef = this.internalPeoplesList;
        const saveInternalTechnicalSupport = this.getCommon(this.internalPeoplesList, this.saveInternalTechnicalSupport, this.isSameUser);
        this.isSelectedInternalTechnicalSupport ? this.internalPeoplesList = [...saveInternalTechnicalSupport] : this.internalPeoplesList = this.internalPeoplesListRef
    }

    getAssistantPeopleList() {
        const saveInternalOwner = this.onlyInLeft(this.internalPeoplesList, this.saveInternalOwner, this.isSameUser);
        this.internalPeoplesList = [...saveInternalOwner];
        const saveInternalOrganize = this.onlyInLeft(this.internalPeoplesList, this.saveInternalOrganize, this.isSameUser);
        this.internalPeoplesList = [...saveInternalOrganize];
        const saveInternalAttendee = this.onlyInLeft(this.internalPeoplesList, this.saveInternalAttendee, this.isSameUser);
        this.internalPeoplesList = [...saveInternalAttendee];
        const saveInternalTechnicalSupport = this.onlyInLeft(this.internalPeoplesList, this.saveInternalTechnicalSupport, this.isSameUser);
        this.internalPeoplesList = [...saveInternalTechnicalSupport];
        const saveInternalSpeaker = this.onlyInLeft(this.internalPeoplesList, this.saveInternalSpeaker, this.isSameUser);
        this.internalPeoplesList = [...saveInternalSpeaker];
        this.internalPeoplesListRef = this.internalPeoplesList;
        const saveInternalAssistant = this.getCommon(this.internalPeoplesList, this.saveInternalAssistant, this.isSameUser);
        this.isSelectedInternalAssistant ? this.internalPeoplesList = [...saveInternalAssistant] : this.internalPeoplesList = this.internalPeoplesListRef
    }

    async getResourceByAssetType(index: number, resourceType: any): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.eventAPI.getResourceByAssetType({resourceType: resourceType});
        if (res.statusCode === 200) {
            this.resourceByAssetType[index] = res.data;
            this.helper.toggleLoaderVisibility(false);
        } else if (res.result !== 'false') {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.error), 'info');
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.error), 'info');
        }
    }

    resourceType(options: any) {
        this.getResourceByAssetType(options.index, options.resourceType);
    }

    onKeyUp(searchTextValue: any): void {
        //
        this.search = searchTextValue.target ? searchTextValue.target.value.toLowerCase() : searchTextValue;
        // this.selection.clear();
        this.subject.next(this.search);
    }

    toggleAllRows() {
        this.selection.clear();
        if (this.isAllSelected()) {
            this.selection.deselect(...this.internalPeoplesList);
            this.selection.clear();
            this.saveInternalTechnicalSupport = []
            return;
        }
        this.selection.select(...this.internalPeoplesList);
        this.saveInternalTechnicalSupport = [...this.selection.selected]
    }

    isAllSelected() {
        const numSelected = this.saveInternalTechnicalSupport.length;
        const numRows = this.internalPeoplesList.length;
        return numSelected === numRows;
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    /*



    this.selectedExternalPeopleCount = this.saveExternalAttendee.length;
    this.selectedExternalPeopleCount = this.saveExternalTechnicalSupport.length;
    this.selectedExternalPeopleCount = this.sendAttendeesUserList.length;
    */

    addOwnerExternal(): void {
        const dialogRef = this.dialog.open(AddExternalPeoplePopupComponent, {});
        const that = this;
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                var list = [...this.externalOwnerList];
                list.push(result);
                this.externalOwnerFilteredList.push(result);
                this.externalOwnerList = [];
                setTimeout(() => {
                    this.externalOwnerList = list;
                    this.selectedExternalPeopleCount = this.externalOwnerList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
            }
        });
    }

    removeOwnerExternal(number: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'Are you sure you want to delete external people?', heading: 'Delete External People'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const index = this.externalOwnerList.indexOf(number);
                this.externalOwnerList.splice(index, 1);
                var list = [...this.externalOwnerList];
                this.externalOwnerList = [];
                setTimeout(() => {
                    this.externalOwnerList = list;
                    this.selectedExternalPeopleCount = this.externalOwnerList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
            }
        });
    }

    addOrganizeExternal(): void {
        const dialogRef = this.dialog.open(AddExternalPeoplePopupComponent, {});
        const that = this;
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                var list = [...this.externalOrganizeList];
                list.push(result);
                this.externalOrganizeFilteredList.push(result);
                this.externalOrganizeList = [];
                setTimeout(() => {
                    this.externalOrganizeList = list;
                    this.selectedExternalPeopleCount = this.externalOrganizeList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
            }
        });
    }

    removeOrganizeExternal(number: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'Are you sure you want to delete external people?', heading: 'Delete External People'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const index = this.externalOrganizeList.indexOf(number);
                this.externalOrganizeList.splice(index, 1);
                var list = [...this.externalOrganizeList];
                this.externalOrganizeList = [];
                setTimeout(() => {
                    this.externalOrganizeList = list;
                    this.selectedExternalPeopleCount = this.externalOrganizeList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
            }
        });
    }

    addSpeakerExternal(): void {
        const dialogRef = this.dialog.open(AddExternalPeoplePopupComponent, {});
        const that = this;
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                var list = [...this.externalSpeakerList];
                list.push(result);
                this.externalSpeakerFilteredList.push(result);
                this.externalSpeakerList = [];
                setTimeout(() => {
                    this.externalSpeakerList = list;
                    this.selectedExternalPeopleCount = this.externalSpeakerList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
            }
        });
    }

    removeSpeakerExternal(number: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'Are you sure you want to delete external people?', heading: 'Delete External People'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const index = this.externalSpeakerList.indexOf(number);
                this.externalSpeakerList.splice(index, 1);
                var list = [...this.externalSpeakerList];
                this.externalSpeakerList = [];
                setTimeout(() => {
                    this.externalSpeakerList = list;
                    this.selectedExternalPeopleCount = this.externalSpeakerList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
                //this.externalSpeakerTable.renderRows();
            }
        });
    }

    addAttendeeExternal(): void {
        const dialogRef = this.dialog.open(AddExternalPeoplePopupComponent, {});
        const that = this;
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                var list = [...this.externalAttendeeList];
                list.push(result);
                this.externalAttendeeFilteredList.push(result);
                this.externalAttendeeList = [];
                setTimeout(() => {
                    this.externalAttendeeList = list;
                    this.selectedExternalPeopleCount = this.externalAttendeeList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
            }
        });
    }

    removeAttendeeExternal(number: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'Are you sure you want to delete external people?', heading: 'Delete External People'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const index = this.externalAttendeeList.indexOf(number);
                this.externalAttendeeList.splice(index, 1);
                var list = [...this.externalAttendeeList];
                this.externalAttendeeList = [];
                setTimeout(() => {
                    this.externalAttendeeList = list;
                    this.selectedExternalPeopleCount = this.externalAttendeeList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
                //this.externalAttendeeTable.renderRows();
            }
        });
    }

    addTechnicalSupportExternal(): void {
        const dialogRef = this.dialog.open(AddExternalPeoplePopupComponent, {});
        const that = this;
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                var list = [...this.externalTechnicalSupportList];
                list.push(result);
                this.externalTechnicalSupportFilteredList.push(result);
                this.externalTechnicalSupportList = [];
                setTimeout(() => {
                    this.externalTechnicalSupportList = list;
                    this.selectedExternalPeopleCount = this.externalTechnicalSupportList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
            }
        });
    }

    removeTechnicalSupportExternal(number: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'Are you sure you want to delete external people?', heading: 'Delete External People'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const index = this.externalTechnicalSupportList.indexOf(number);
                this.externalTechnicalSupportList.splice(index, 1);
                var list = [...this.externalTechnicalSupportList];
                //this.externalTechnicalSupportTable.renderRows();
                this.externalTechnicalSupportList = [];
                setTimeout(() => {
                    this.externalTechnicalSupportList = list;
                    this.selectedExternalPeopleCount = this.externalTechnicalSupportList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
            }
        });
    }

    addAssistantExternal(): void {
        const dialogRef = this.dialog.open(AddExternalPeoplePopupComponent, {});
        const that = this;
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                var list = [...this.externalAssistantList];
                list.push(result);
                this.externalAssistantFilteredList.push(result);
                this.externalAssistantList = [];
                setTimeout(() => {
                    this.externalAssistantList = list;
                    this.selectedExternalPeopleCount = this.externalAssistantList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
            }
        });
    }

    removeAssistantExternal(number: any): void {
        const that = this;
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {message: 'Are you sure you want to delete external people?', heading: 'Delete External People'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const index = this.externalAssistantList.indexOf(number);
                this.externalAssistantList.splice(index, 1);
                var list = [...this.externalAssistantList];
                //this.externalAssistantTable.renderRows();
                this.externalAssistantList = [];
                setTimeout(() => {
                    this.externalAssistantList = list;
                    this.selectedExternalPeopleCount = this.externalAssistantList.length;
                    this.changeDetectionRef.markForCheck();
                    this.changeDetectionRef.detectChanges();
                }, 100);
            }
        });
    }


    applyFilter($event: any, stepName: string) {
        const filterValue = ($event.target as HTMLInputElement).value;
        var list: any = [];
        if (stepName == 'owner') {
            list = [...this.externalOwnerFilteredList];
            this.externalOwnerList = list.filter(
                (x) =>
                    x.firstName
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.surname
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.email.toLowerCase().includes(filterValue.trim().toLowerCase())
            );
        } else if (stepName == 'organizer') {
            list = [...this.externalOrganizeFilteredList];
            this.externalOrganizeList = list.filter(
                (x) =>
                    x.firstName
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.surname
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.email.toLowerCase().includes(filterValue.trim().toLowerCase())
            );
        } else if (stepName == 'speaker') {
            list = [...this.externalSpeakerFilteredList];
            this.externalSpeakerList = list.filter(
                (x) =>
                    x.firstName
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.surname
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.email.toLowerCase().includes(filterValue.trim().toLowerCase())
            );
        } else if (stepName == 'attendee') {
            list = [...this.externalAttendeeFilteredList];
            this.externalAttendeeList = list.filter(
                (x) =>
                    x.firstName
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.surname
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.email.toLowerCase().includes(filterValue.trim().toLowerCase())
            );
        } else if (stepName == 'technicalSupport') {
            list = [...this.externalTechnicalSupportFilteredList];
            this.externalTechnicalSupportList = list.filter(
                (x) =>
                    x.firstName
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.surname
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.email.toLowerCase().includes(filterValue.trim().toLowerCase())
            );
            this.externalTechnicalSupportTable.renderRows();
        } else if (stepName == 'assistant') {
            list = [...this.externalAssistantFilteredList];
            this.externalAssistantList = list.filter(
                (x) =>
                    x.firstName
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.surname
                        .toLowerCase()
                        .includes(filterValue.trim().toLowerCase()) ||
                    x.email.toLowerCase().includes(filterValue.trim().toLowerCase())
            );
            this.externalAssistantTable.renderRows();
        }
    }

    private _setSearchSubscription(): void {
        this.subject.pipe(
            debounceTime(500)
        ).subscribe((searchValue: string) => {
            // this.selection.clear();
            if (this.attendeeStepIndex === 0) {
                this.getInternalPeoplesList({
                    limit: null,
                    search: this.search,
                    sortBy: this.sortBy,
                    sortKey: this.sortKey,
                    ...this.filterOwnerValue
                });
            } else if (this.attendeeStepIndex === 1) {
                this.getInternalPeoplesList({
                    limit: null,
                    search: this.search,
                    sortBy: this.sortBy,
                    sortKey: this.sortKey,
                    ...this.filterOrganizerValue
                });
            } else if (this.attendeeStepIndex === 2) {
                this.getInternalPeoplesList({
                    limit: null,
                    search: this.search,
                    sortBy: this.sortBy,
                    sortKey: this.sortKey,
                    ...this.filterSpeakerValue
                });
            } else if (this.attendeeStepIndex === 3) {
                this.getInternalPeoplesList({
                    limit: null,
                    search: this.search,
                    sortBy: this.sortBy,
                    sortKey: this.sortKey,
                    ...this.filterAttendeeValue
                });
            } else if (this.attendeeStepIndex === 4) {
                this.getInternalPeoplesList({
                    limit: null,
                    search: this.search,
                    sortBy: this.sortBy,
                    sortKey: this.sortKey,
                    ...this.filterTechnicalSupportValue
                });
            } else if (this.attendeeStepIndex === 5) {
                this.getInternalPeoplesList({
                    limit: null,
                    search: this.search,
                    sortBy: this.sortBy,
                    sortKey: this.sortKey,
                    ...this.filterAssistantValue
                });
            }
            /*this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterSelectedValue
            });*/
        });
    }

    resetSearch() {
        this.search = '';
        //this.myInputVariable.nativeElement.value = '';
        // this.selection.clear();
        this.internalPeoplesList = [];
        this.internalOrganizeList = [];
        this.changeDetectionRef.markForCheck();
        if (this.attendeeStepIndex === 0) {
            this.getInternalPeoplesList({
                limit: null,
                search: '',
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOwnerValue
            });
        } else if (this.attendeeStepIndex === 1) {
            this.getInternalPeoplesList({
                limit: null,
                search: '',
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOrganizerValue
            });
        } else if (this.attendeeStepIndex === 2) {
            this.getInternalPeoplesList({
                limit: null,
                search: '',
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterSpeakerValue
            });
        } else if (this.attendeeStepIndex === 3) {
            this.getInternalPeoplesList({
                limit: null,
                search: '',
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAttendeeValue
            });
        } else if (this.attendeeStepIndex === 4) {
            this.getInternalPeoplesList({
                limit: null,
                search: '',
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterTechnicalSupportValue
            });
        } else if (this.attendeeStepIndex === 5) {
            this.getInternalPeoplesList({
                limit: null,
                search: '',
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAssistantValue
            });
        }
        /*this.getInternalPeoplesList({
            limit: null,
            search: '',
            sortBy: this.sortBy,
            sortKey: this.sortKey,
            ...this.filterSelectedValue
        });*/
        this.selection.clear();
    }

    resetExternalSearch() {
        this.searchExternal = '';
        this.applyFilter(this.event, 'technicalSupport')
    }

    changeSorting(sortKey, sortBy): void {
        // this.search = '';
        this.sortKey = sortKey;
        this.sortBy = (sortBy === '-1') ? '1' : '-1';
        this.selection.clear();
        if (this.attendeeStepIndex === 0) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOwnerValue
            });
        } else if (this.attendeeStepIndex === 1) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOrganizerValue
            });
        } else if (this.attendeeStepIndex === 2) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterSpeakerValue
            });
        } else if (this.attendeeStepIndex === 3) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAttendeeValue
            });
        } else if (this.attendeeStepIndex === 4) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterTechnicalSupportValue
            });
        } else if (this.attendeeStepIndex === 5) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAssistantValue
            });
        }
        /*this.getInternalPeoplesList({
            limit: null,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey,
            ...this.filterSelectedValue
        });*/
    }

    sortColumn($event: any): void {
        // this.search = '';
        this.sortKey = $event.sortKey;
        this.sortBy = ($event.sortBy === '-1') ? '1' : '-1';
        this.selection.clear();
        if (this.attendeeStepIndex === 0) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOwnerValue
            });
        } else if (this.attendeeStepIndex === 1) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOrganizerValue
            });
            // this.getOrganizerPeopleList()
        } else if (this.attendeeStepIndex === 2) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterSpeakerValue
            });
        } else if (this.attendeeStepIndex === 3) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAttendeeValue
            });
        } else if (this.attendeeStepIndex === 4) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterTechnicalSupportValue
            });
        } else if (this.attendeeStepIndex === 5) {
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAssistantValue
            });
        }
        /*this.getInternalPeoplesList({
            limit: null,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey,
            ...this.filterSelectedValue
        });*/
    }
    showSelected(isSelected: boolean){
        if (this.attendeeStepIndex === 0) {
            this.isSelectedInternalOwner = isSelected;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOwnerValue
            });
        } else if (this.attendeeStepIndex === 1) {
            this.isSelectedInternalOrganize = isSelected;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOrganizerValue
            });
        } else if (this.attendeeStepIndex === 2) {
            this.isSelectedInternalSpeaker = isSelected;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterSpeakerValue
            });
        } else if (this.attendeeStepIndex === 3) {
            this.isSelectedInternalAttendee = isSelected;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAttendeeValue
            });
        } else if (this.attendeeStepIndex === 4) {
            this.isSelectedInternalTechnicalSupport = isSelected;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterTechnicalSupportValue
            });
        } else if (this.attendeeStepIndex === 5) {
            this.isSelectedInternalAssistant = isSelected;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAssistantValue
            });
        }
        /*if (this.attendeeStepIndex === 0) {
            this.isSelectedInternalOwner = isSelected;
            this.isSelectedInternalOwner ? this.internalPeoplesList = this.saveInternalOwner : this.internalPeoplesList = this.internalPeoplesListRef;
        } else if (this.attendeeStepIndex === 1) {
            this.isSelectedInternalOrganize = isSelected;
            this.isSelectedInternalOrganize ? this.internalPeoplesList = this.saveInternalOrganize : this.internalPeoplesList = this.internalPeoplesListRef;
        } else if (this.attendeeStepIndex === 2) {
            this.isSelectedInternalSpeaker = isSelected;
            this.isSelectedInternalSpeaker ? this.internalPeoplesList = this.saveInternalSpeaker : this.internalPeoplesList = this.internalPeoplesListRef;
        } else if (this.attendeeStepIndex === 3) {
            this.isSelectedInternalAttendee = isSelected;
            this.isSelectedInternalAttendee ? this.internalPeoplesList = this.saveInternalAttendee : this.internalPeoplesList = this.internalPeoplesListRef;
        } else if (this.attendeeStepIndex === 4) {
            this.isSelectedInternalTechnicalSupport = isSelected;
            this.isSelectedInternalTechnicalSupport ? this.internalPeoplesList = this.saveInternalTechnicalSupport : this.internalPeoplesList = this.internalPeoplesListRef;
        } else if (this.attendeeStepIndex === 5) {
            this.isSelectedInternalAssistant = isSelected;
            this.isSelectedInternalAssistant ? this.internalPeoplesList = this.saveInternalAssistant : this.internalPeoplesList = this.internalPeoplesListRef;
        }*/
    }
    applyInternalFilterFunction($event: any): void {
        this.helper.toggleLoaderVisibility(true);
        if (this.attendeeStepIndex === 0) {
            this.filterOwnerValue = $event;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOwnerValue
            });
        } else if (this.attendeeStepIndex === 1) {
            this.filterOrganizerValue = $event;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterOrganizerValue
            });
        } else if (this.attendeeStepIndex === 2) {
            this.filterSpeakerValue = $event;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterSpeakerValue
            });
        } else if (this.attendeeStepIndex === 3) {
            this.filterAttendeeValue = $event;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAttendeeValue
            });
        } else if (this.attendeeStepIndex === 4) {
            this.filterTechnicalSupportValue = $event;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterTechnicalSupportValue
            });
        } else if (this.attendeeStepIndex === 5) {
            this.filterAssistantValue = $event;
            this.getInternalPeoplesList({
                limit: null,
                search: this.search,
                sortBy: this.sortBy,
                sortKey: this.sortKey,
                ...this.filterAssistantValue
            });
        }
        /*this.filterSelectedValue = $event;

        this.getInternalPeoplesList({
            limit: null,
            search: this.search,
            sortBy: this.sortBy,
            sortKey: this.sortKey,
            ...$event
        });*/
    }

    getId(event) {
        this.id = event
    }

    async createQRCode(eventId: any) {
        var that = this;
        this.recruitingManagementService.createQRCodeAcceptEvent(eventId).subscribe((event) => {
            if (event instanceof HttpResponse) {
                that.downloadLink = event.body.data.qrcode;
            }
        }, (error) => {
            swal.fire(
                '',
                this.translate.instant(error.error.message),
                'info'
            )
        });
    }

    async createICSFile(eventId: any) {
        var that = this;
        this.eventAPI.createICSAPI({id: eventId}).then((res: any) => {
            if (res instanceof HttpResponse) {
                that.downloadICSLink = res.body.data.qrcode;
            }
        }, (error) => {
            swal.fire(
                '',
                this.translate.instant(error.error.message),
                'info'
            )
        });
    }

    async downloadICSFile() {
        this.helper.toggleLoaderVisibility(true);
        var that = this;
        this.eventAPI.downloadICSAPI({id: that.id}).then((res: any) => {
            const blob = new Blob([res], {type: 'application/ics'});
            FileSaver.saveAs(blob, this.finalValueForm.value.name + '.ICS');
            this.helper.toggleLoaderVisibility(false);
        }, (error) => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant(error.error.message),
                'info'
            )
        });
    }

    async attendeesCertificateFuncation() {
        this.helper.toggleLoaderVisibility(true);
        var that = this;
        this.eventAPI.attendeesCertificateAPI({id: that.id}).then((res: any) => {
            if (res.statusCode == 200) {
                this.attendeeList = res.data;
                if (this.id !== '0') {
                    for (let i = 0; i < this.attendeeEditList?.length; i++) {
                        for (let p = 0; p < this.attendeeList?.length; p++) {
                            if (this.attendeeEditList[i].email === this.attendeeList[p].email && this.attendeeEditList[i].firstName === this.attendeeList[p].firstName && this.attendeeEditList[i].surname === this.attendeeList[p].surname && this.attendeeEditList[i].role === this.attendeeList[p].role) {
                                this.attendeeList[p].sendCertificate = this.attendeeEditList[i].sendCertificate
                            }
                        }
                    }
                }
                /*this.checkAllAttendees();*/
                this.attendeeListData = this.attendeeList;
                this.sendAttendeesUserList = this.attendeeList;
            }
            this.helper.toggleLoaderVisibility(false);
        }, (error) => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant(error.error.message),
                'info'
            )
        });
    }

    /*loadOwnerList($event: any) {
        this.saveExternalOwner = [...$event.saveExternalOwner];
        this.saveExternalOrganize = [...$event.saveExternalOrganize];
        this.saveExternalSpeaker = [...$event.saveExternalSpeaker];
        this.saveExternalAttendee = [...$event.saveExternalAttendee];
        this.saveExternalTechnicalSupport = [...$event.saveExternalTechnicalSupport];
        this.saveExternalAssistant = [...$event.saveExternalAssistant];
        this.attendeesCertificateFuncation();
    }*/

    changeSort(sort: Sort) {
        this.attendeeList = this.attendeeList.sort((a, b) => {
            const value = a[sort.active] > b[sort.active] ? 1 : a[sort.active] < b[sort.active] ? -1 : 0
            return sort.direction == 'asc' ? value : -value
        })
        this.attendeeListData = this.attendeeList;
        this.attendeeListTable.renderRows();
    }

    searchAttendee($event: any) {
        const filterValue = ($event.target as HTMLInputElement).value;
        this.searchAttendeeTxt = filterValue;
        this.attendeeList = this.attendeeListData.filter(
            x => x.role.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
                x.type.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
                x.firstName.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
                x.surname.toLowerCase().includes(filterValue.trim().toLowerCase())
        );
        this.attendeeListTable.renderRows();
    }

    /*resetSearchAttendee() {
        this.searchAttendeeTxt = '';
        this.attendeeList = this.attendeeListData;
        // this.attendeeListTable.renderRows();
    }*/

    savedOwnerList($event: any, stepName: string) {
        this.saveAttendeesUserList($event, stepName);
    }

    savedOrganizerList($event: any, stepName: string) {
        this.saveAttendeesUserList($event, stepName);
    }

    savedSpeakerList($event: any, stepName: string) {
        this.saveAttendeesUserList($event, stepName);
    }

    savedAttendeeList($event: any, stepName: string) {
        this.saveAttendeesUserList($event, stepName);
    }

    savedTechnicalSupportList($event: any, stepName: string) {
        this.saveAttendeesUserList($event, stepName);
    }

    savedAssistantList($event: any, stepName: string, stepper: MatStepper) {
        this.saveAttendeesUserList($event, stepName);
        stepper.next();
    }

    saveAttendeesUserList($event: any, stepName: string) {
        this.saveInternalOwner = [...$event.saveInternalOwner];
        this.saveExternalOwner = $event.saveExternalOwner;
        this.saveInternalOrganize = [...$event.saveInternalOrganize];
        this.saveExternalOrganize = $event.saveExternalOrganize;
        this.saveInternalSpeaker = [...$event.saveInternalSpeaker];
        this.saveExternalSpeaker = $event.saveExternalSpeaker;
        this.saveInternalAttendee = [...$event.saveInternalAttendee];
        this.saveExternalAttendee = $event.saveExternalAttendee;
        this.saveInternalTechnicalSupport = [...$event.saveInternalTechnicalSupport];
        this.saveExternalTechnicalSupport = $event.saveExternalTechnicalSupport;
        this.saveInternalAssistant = [...$event.saveInternalAssistant];
        this.saveExternalAssistant = $event.saveExternalAssistant;
        this.externalOwnerList = this.saveExternalOwner;
        this.externalOrganizeList = this.saveExternalOrganize;
        this.externalSpeakerList = this.saveExternalSpeaker;
        this.externalAttendeeList = this.saveExternalAttendee;
        this.externalTechnicalSupportList = this.saveExternalTechnicalSupport;
        this.externalAssistantList = this.saveExternalAssistant;
        this.resetSearch();
        this.applyInternalFilterFunction('');
        this.attendeesCertificateFuncation();
        this.helper.clearEventSelection(stepName);
    }

    changeValue(event: any) {
        if (event.stepName == "owner") {
            this.saveInternalOwner = [...event.saveInternalOwner];
            this.saveInternalOwner = this.removeDuplicates(this.saveInternalOwner, 'id');
            this.selectedInternalPeopleCount = this.saveInternalOwner.length;
        }
        if (event.stepName == "attendee") {
            this.saveInternalAttendee = [...event.saveInternalAttendee];
            this.saveInternalAttendee = this.removeDuplicates(this.saveInternalAttendee, 'id');
            this.selectedInternalPeopleCount = this.saveInternalAttendee.length;
        }
        if (event.stepName == "organizer") {
            this.saveInternalOrganize = [...event.saveInternalOrganize];
            this.saveInternalOrganize = this.removeDuplicates(this.saveInternalOrganize, 'id');
            this.selectedInternalPeopleCount = this.saveInternalOrganize.length;
        }
        if (event.stepName == "speaker") {
            this.saveInternalSpeaker = [...event.saveInternalSpeaker];
            this.saveInternalSpeaker = this.removeDuplicates(this.saveInternalSpeaker, 'id');
            this.selectedInternalPeopleCount = this.saveInternalSpeaker.length;
        }
        if (event.stepName == "technicalSupport") {
            this.saveInternalTechnicalSupport = [...event.saveInternalTechnicalSupport];
            this.saveInternalTechnicalSupport = this.removeDuplicates(this.saveInternalTechnicalSupport, 'id');
            this.selectedInternalPeopleCount = this.saveInternalTechnicalSupport.length;
        }
        if (event.stepName == "assistant") {
            this.saveInternalAssistant = [...event.saveInternalAssistant];
            this.saveInternalAssistant = this.removeDuplicates(this.saveInternalAssistant, 'id');
            this.selectedInternalPeopleCount = this.saveInternalAssistant.length;
        }
    }

    eventCreditChange(event: any) {
        this.eventCreditCountChange(this.checkpointsInfoForm.value.eventCreditCount);
        if (event.checked === false) {
            this.attendanceCertificateDisabled = false;
        }
    }

    eventCreditCountChange(event: any) {
        if (event !== null) {
            if (this.checkpointsInfoForm.value.eventCredit === true && event != '') {
                if (event > 0) {
                    this.attendanceCertificateDisabled = false;
                } else {
                    this.checkpointsInfoForm.value.attendanceCertificate = false;
                    this.attendanceCertificateDisabled = true;
                    this.attendanceCertificateChecked = false;
                }
            }
        } else {
            this.attendanceCertificateDisabled = false;
        }

        if (event == '') {
            this.attendanceCertificateDisabled = false;
        }

        if (event == 0) {
            this.checkpointsInfoForm.value.attendanceCertificate = false;
            this.attendanceCertificateDisabled = true;
            this.attendanceCertificateChecked = false;
        }
    }

    onFilterListOfEvent() {
        const dialogRef = this.dialog.open(AttendeeFilterPopupComponent, {});
    }

    back() {
        history.back();
    }

    async updateAttendeesUserCall(saveExit: any): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        this.eventAPI.attendeesCertificateAPI({id: this.id}).then((res: any) => {
            this.helper.toggleLoaderVisibility(false);
            if (res.statusCode == 200) {
                this.updateAttendeesUserList = res.data;
                var unique = [];
                var uniqueMeetingCode = [];
                for (var i = 0; i < this.updateAttendeesUserList.length; i++) {
                    var found = false;
                    for (var j = 0; j < this.saveOldAttendeesUserList.length; j++) {
                        if (this.updateAttendeesUserList[i].attendeeId == this.saveOldAttendeesUserList[j].attendeeId) {
                            found = true;
                            break;
                        }
                    }
                    if (found == false) {
                        unique.push(this.updateAttendeesUserList[i].attendeeId);
                    }
                }

                setTimeout(() => {
                    if ((unique.length > 0) && (this.eventCurrentStatus != this.inProgressEvent) && !this.detailsInfoForm.value.disableInvitationFlow) {
                        const dialogRef = this.dialog.open(ConfirmPopupComponent, {
                            data: {
                                message: this.translate.instant('Do you want to send invitation?'),
                                heading: this.translate.instant('GENERAL.Confirm'),
                            },
                            disableClose: true
                        });
                        dialogRef.afterClosed().subscribe(async (result) => {
                            if (result) {
                                for (let i = 0; i < unique.length; i++) {
                                    this.sendInvitationUserByEmail(unique[i]);
                                }
                                this.checkScopeIdRedirection();
                            } else {
                                this.checkScopeIdRedirection();
                            }
                        });
                    } else {
                        if (saveExit) {
                            this.checkScopeIdRedirection();
                        }
                    }
                }, 500)
            }
        }, (error) => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant(error.error.message),
                'info'
            )
        });
    }

    async sendInvitationUserByEmail(attendeeId: string): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.eventAPI.reInviteUserByMail({
            eventId: this.id,
            attendeeId: attendeeId,
            invitationStatus: "invitation"
        });
        if (res.statusCode === 200) {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
        }
    }

    async sendInvitationAllByEmailNew(): Promise<void> {
        this.helper.toggleLoaderVisibility(true);
        if (this.attendeeList.length > 0) {
            const res: any = await this.eventAPI.reInviteALLByMail({
                eventId: this.id,
                authorId: this.authorId,
                invitationStatus: "reInviteAll"
            });
            if (res.statusCode === 200) {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(res.meta.message), 'success');
            } else {
                this.helper.toggleLoaderVisibility(false);
                EventHelper.showMessage('', this.translate.instant(res.reason), 'info');
            }
        } else {
            this.helper.toggleLoaderVisibility(false);
            EventHelper.showMessage('', this.translate.instant('PleaseSelectAtLeastOneUserToResendInvitation'), 'info');
        }
    }

    async getAttendeesUserList() {
        await this.eventAPI.attendeesCertificateAPI({id: this.id}).then((res: any) => {
            if (res.statusCode == 200) {
                this.saveOldAttendeesUserList = res.data;
            }
            this.helper.toggleLoaderVisibility(false);
        }, (error) => {
            this.helper.toggleLoaderVisibility(false);
            swal.fire(
                '',
                this.translate.instant(error.error.message),
                'info'
            )
        });
    }

    async checkScopeIdRedirection() {
        if (this.scopeId === null) {
            this.router.navigate(['event-management/event-list/']);
        } else {
            this.router.navigate(['training/event-list/' + this.scopeId]);
        }
        if (this.createTimeId != '0') {
            EventHelper.showMessage('', this.translate.instant('Event updated successfully'), 'success');
        } else {
            EventHelper.showMessage('', this.translate.instant('Event added successfully'), 'success');
        }
    }
}
