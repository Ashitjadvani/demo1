import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-desk-page',
  templateUrl: './book-desk-page.component.html',
  styleUrls: ['./book-desk-page.component.scss']
})
export class BookDeskPageComponent implements OnInit {
    @ViewChild('stepper', { static: false }) stepper: MatStepper;
    
    searchFormGroup: FormGroup;

    loading: boolean;

    locationSelected: string;
    areaSelected: string;

    constructor(
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        this.searchFormGroup = this._formBuilder.group({
            location: ["", Validators.required],
            area: ["", Validators.required],
        });
        this.loading = true;

        this.loading = false;
    }

    onClickSearch() {
        this.previousSearchReset();
        let bookingDate = new Date();
        let startTime = "09:00";
        let endTime = "18:00";
    }

    onClickBook() {
    }

    getSelectedMeetingDate() {
        return new Date(); //this.searchFormGroup.get("meetingDate").value; // new Date(); // this.searchFormGroup.get("meetingDate").value;
    }

    getSelectedMeetingStartTime() {
        return "09:00"; // this.searchFormGroup.get("timeInterval").value.split("|")[0];
    }

    getSelectedMeetingEndTime() {
        return "18:00"; // this.searchFormGroup.get("timeInterval").value.split("|")[1];
    }

    private previousSearchReset() {
        let index = 0;
        this.stepper.steps.forEach(step => {
            if (index++ > 0) {
                step.reset();
                step.interacted = false;
            }
        });
    }

    onBack() {
        this._router.navigate(['home']);
    }
}
