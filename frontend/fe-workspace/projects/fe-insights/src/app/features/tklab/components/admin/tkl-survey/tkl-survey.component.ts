import {Component, OnInit} from '@angular/core';
import {SurveyService} from '../../../store/data.service';
import {Observable} from 'rxjs';
import {CRUDMode, Question, Survey} from '../../../store/models';
import {QueryParams} from '@ngrx/data';
import {QuestionDialogComponent} from '../tkl-question/question-dialog/question-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SurveyDialogComponent} from './survey-dialog/survey-dialog.component';

@Component({
	selector: 'app-tkl-survey',
	templateUrl: './tkl-survey.component.html',
	styleUrls: ['./tkl-survey.component.scss']
})
export class TklSurveyComponent implements OnInit {
	public elements$: Observable<Survey[]>;
	public elementFilter = '';
	public currentElement: Survey;
	public displayedColumns: string[] = ['title', 'actions'];
	loading$: Observable<boolean>;

	constructor(private service: SurveyService,
	            private dialog: MatDialog) {
		this.loading$ = service.loading$;
		this.elements$ = this.service.entities$;
	}

	ngOnInit(): void {
		this.getFilteredElements();
	}

	getFilteredElements($event?) {
		const params: QueryParams = {
			filter: this.elementFilter
		};
		this.service.clearCache();
		this.service.getWithQuery(params);
		/*const res  = this.service.getWithQuery(params);
		res.subscribe( data => {
			this.setCurrentElement(data[0],'EDIT')
		})*/
	}

	addElement(): void {
		const element = new Question();
		this.setCurrentElement(element, CRUDMode.ADD);
	}

	editElement(element): void {
		this.setCurrentElement(element, CRUDMode.EDIT);
	}

	viewElement(element): void {
		this.setCurrentElement(element, CRUDMode.VIEW);
	}

	deleteElement(element): void {
		this.setCurrentElement(element, CRUDMode.DELETE, {height: '20%'});
	}


	setCurrentElement(element, mode: string, config_ovveride?) {
		const dialogRef = this.dialog.open(SurveyDialogComponent, {
			width: '95%',
			height: '90%',
			data: {
				currentElement: element,
				mode,
				service: this.service,
			},
			...config_ovveride
		});
		return dialogRef;
	}

}
