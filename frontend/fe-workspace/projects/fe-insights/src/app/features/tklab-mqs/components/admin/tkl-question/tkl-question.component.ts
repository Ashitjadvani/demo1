import {Component, OnInit, ViewChild} from '@angular/core';
import {QuestionService} from '../../../store/data.service';
import {QueryParams} from '@ngrx/data';
import {Observable} from 'rxjs';
import {Answer, CRUDMode, Question} from '../../../store/models';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {QuestionDialogComponent} from './question-dialog/question-dialog.component';
import {TklabMqsService} from '../../../../../../../../fe-common/src/lib/services/tklab.mqs.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-tkl-question',
  templateUrl: './tkl-question.component.html',
  styleUrls: ['./tkl-question.component.scss'],
})
export class TklQuestionComponent implements OnInit {
  public elementFilter = '';
  public currentElement: Question;
  public displayedColumns: string[] = ['category', 'code', 'question', 'mandatory', 'type', 'actions'];
  getQuestions: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  loading$: Observable<boolean>;

  constructor(
   // private service: QuestionService,
    private tklabMqsService: TklabMqsService,
    public dialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    await this.getFilteredElements();
  }

  async getFilteredElements($event?) {
    const params: QueryParams = {
      filter: this.elementFilter
    };
    let res: any = await this.tklabMqsService.loadAppQuestion();
    this.getQuestions = new MatTableDataSource<any>(res.result);
    this.getQuestions.paginator = this.paginator;
    this.getQuestions.sort = this.sort;
  }

  applyFilter(): void {
    this.getQuestions.filter = this.elementFilter.trim().toLowerCase();
  }

  addElement(): void {
    const element = new Question();
    const answer = new Answer();
    answer.value = null;
    answer.order = 1;
    // element.answers = [answer];
    element.answers = [];
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
        service: null,
      },
      ...config_ovveride
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getFilteredElements();
        }
      });

    return dialogRef;
  }

}
