import { AfterViewChecked, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "projects/fe-common/src/lib/services/common.service";
import { NotifyManagementService } from "projects/fe-common/src/lib/services/notify-management.service";
import { UserManagementService } from "projects/fe-common/src/lib/services/user-management.service";
import { Request , REQUEST_STATE, RequestNoteSchema } from 'projects/fe-common/src/lib/models/requests';
import { Person } from "projects/fe-common/src/lib/models/person";
import { RequestManagementService } from "projects/fe-common/src/lib/services/request-management.service";





@Component({
    selector: 'app-request-note-dialog',
    templateUrl: './note-dialog.component.html',
    styleUrls: ['./note-dialog.component.scss']
})
export class RequestNoteDialogComponent implements OnInit, AfterViewChecked {

    request: Request;
    requestNotes: Array<RequestNoteSchema> = new Array();
    newNote: RequestNoteSchema;
    newNoteStr: string = "";
    currentUser: Person;
    @ViewChild('scroll') private scrollNotes: ElementRef;

    constructor(private common: CommonService,
        private userManagementService: UserManagementService,
        private requestManagementServide: RequestManagementService,
        public translate: TranslateService,
        public dialogRef: MatDialogRef<RequestNoteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any) {

        this.request = data.request;
        this.currentUser = data.currentUser;
        for(let note of this.request.additionalNotes) {
            this.requestNotes.push(note);
        }
    }

    ngOnInit() {

    }

    ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

    onNewNote() {
        this.newNote = RequestNoteSchema.Empty();
        this.newNote.name = this.currentUser.name + " " + this.currentUser.surname;
        this.newNote.note = this.newNoteStr;
        this.newNoteStr = "";

        this.requestNotes.push(this.newNote);
        this.request.additionalNotes = this.requestNotes;
        this.requestManagementServide.addOrUpdateRequest(this.request);
    }

    getDate(note: RequestNoteSchema) {
        let date = new Date(note.date);
        return this.common.toDDMMYYYY(date) + " " + this.common.toHHMM(date);
    }

    scrollToBottom() {
        try {
            this.scrollNotes.nativeElement.scrollTop = this.scrollNotes.nativeElement.scrollHeight;
        } 
        catch(e) {
            console.log(e);
        }
    }

}