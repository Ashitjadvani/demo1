import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';

export class HtmlEditorHelpContents {
    title: string;
    helpRows: [string, string][];
}

export class HtmlEditorDialogData {
    title: string;
    mailSubject: string;
    mailBody: string;
    helpContents: HtmlEditorHelpContents = null;

    static Clone(data: HtmlEditorDialogData): HtmlEditorDialogData {
        let htmlEditorDialogData: HtmlEditorDialogData = new HtmlEditorDialogData();
        
        htmlEditorDialogData.title = data.title;
        htmlEditorDialogData.mailSubject = data.mailSubject;
        htmlEditorDialogData.mailBody = data.mailBody;
        htmlEditorDialogData.helpContents = data.helpContents;

        return htmlEditorDialogData;
    }
}

@Component({
  selector: 'app-html-editor-dialog',
  templateUrl: './html-editor-dialog.component.html',
  styleUrls: ['./html-editor-dialog.component.scss']
})
export class HtmlEditorDialogComponent implements OnInit {
    config: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        // width: '600px',
        height: '245px',
        minHeight: '245px',
        maxHeight: '245px',
        placeholder: 'Edit mail body...',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        toolbarHiddenButtons: [
            ['insertVideo', 'insertImage']
        ]
    };

    currentData: HtmlEditorDialogData;

    constructor(public dialogRef: MatDialogRef<HtmlEditorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: HtmlEditorDialogData) {
        this.currentData = HtmlEditorDialogData.Clone(data);
    }

    ngOnInit() {

    }

    onCancelClick() {
        this.dialogRef.close(null);
    }

    onConfirmClick() {
        this.dialogRef.close(this.currentData);
    }
}
