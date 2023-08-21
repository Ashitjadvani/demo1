import {Component, OnInit, ViewChild} from '@angular/core';
import {QuestionService} from '../../../store/data.service';
import {QueryParams} from '@ngrx/data';
import {Observable} from 'rxjs';
import {Answer, CRUDMode, Question} from '../../../store/models';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {QuestionDialogComponent} from './question-dialog/question-dialog.component';

@Component({
  selector: 'app-tkl-question',
  templateUrl: './tkl-question.component.html',
  styleUrls: ['./tkl-question.component.scss'],
})
export class TklQuestionComponent implements OnInit {
  public elements$: Observable<Question[]>;
  public elementFilter = '';
  public currentElement: Question;
  public displayedColumns: string[] = ['question', 'mandatory', 'type', 'actions'];

  loading$: Observable<boolean>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private service: QuestionService,
    public dialog: MatDialog,
  ) {
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
    this.service.getWithQuery(params)
    // tmp
    /*.subscribe(data => {
      this.setCurrentElement(data[data.length - 1], CRUDMode.EDIT);
    });*/
  }

  addElement(): void {
    const element = new Question();
    const answer = new Answer();
    answer.value = null;
    answer.order = 1;
    element.answers = [answer];
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
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '80%',
      height: '70%',
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
