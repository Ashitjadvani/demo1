import { Component, OnInit, ViewChild } from '@angular/core';
import { SurveyService } from '../../../store/data.service';
import { Observable } from 'rxjs';
import { CRUDMode, Question, Survey } from '../../../store/models';
import { QueryParams } from '@ngrx/data';
import { QuestionDialogComponent } from '../tkl-question/question-dialog/question-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SurveyDialogComponent } from './survey-dialog/survey-dialog.component';
import { TklabMqsService } from '../../../../../../../../fe-common/src/lib/services/tklab.mqs.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tkl-survey',
  templateUrl: './tkl-survey.component.html',
  styleUrls: ['./tkl-survey.component.scss'],
})
export class TklSurveyComponent implements OnInit {
  public elements$: Observable<Survey[]>;
  getSurvey: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public elementFilter = '';
  public currentElement: Survey;
  public displayedColumns: string[] = ['title', 'scope', 'actions'];
  loading$: Observable<boolean>;

  constructor(
    private tklabMqsService: TklabMqsService,
    private dialog: MatDialog
  ) {
    //	this.loading$ = service.loading$;
    //	this.elements$ = this.service.entities$;
  }

  async ngOnInit() {
    await this.getFilteredElements();
  }

  async getFilteredElements($event?) {
    let res: any = await this.tklabMqsService.loadAppSurvey();
    this.getSurvey = new MatTableDataSource<any>(res.result);
    this.getSurvey.sort = this.sort;
    this.getSurvey.paginator = this.paginator;
  }

  applyFilter(): void {
    this.getSurvey.filter = this.elementFilter.trim().toLowerCase();
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
    this.setCurrentElement(element, CRUDMode.DELETE, { height: '20%' });
  }

  setCurrentElement(element, mode: string, config_ovveride?) {
    const dialogRef = this.dialog.open(SurveyDialogComponent, {
      width: '95%',
      height: '90%',
      data: {
        currentElement: element,
        mode,
        service: null,
      },
      ...config_ovveride,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getFilteredElements();
      }
    });

    return dialogRef;
  }
}
function applyFilter(
  event: Event,
  Event: {
    new (type: string, eventInitDict?: EventInit): Event;
    prototype: Event;
    readonly AT_TARGET: number;
    readonly BUBBLING_PHASE: number;
    readonly CAPTURING_PHASE: number;
    readonly NONE: number;
  }
) {
  throw new Error('Function not implemented.');
}
