import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import {Company} from 'projects/fe-common/src/lib/models/company';
import {RecruitingManagementService} from 'projects/fe-common/src/lib/services/recruiting-management.service';
import {AddEditDegreeDialogComponent} from './add-edit-degree-dialog/add-edit-degree-dialog.component';

@Component({
  selector: 'app-degree-section',
  templateUrl: './degree-section.component.html',
  styleUrls: ['./degree-section.component.scss']
})
export class DegreeSectionComponent implements OnInit {
  @Input() currentCompany: Company;
  degreeListData: any = [];

  constructor(
    private dialog: MatDialog,
    public translate: TranslateService,
    private recruitingManagementService: RecruitingManagementService,
  ) {
  }

  ngOnInit(): void {
    this.getDegreeList()
  }

  getDegreeList() {
    this.recruitingManagementService.degreeList().then((data: any) => {
      this.degreeListData = data.data;
    });
  }

  async editDegree(degree, mode) {
    let dialogRef = await this.dialog.open(AddEditDegreeDialogComponent, {
      maxWidth: '600px',
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        isNew: true,
        mode: mode,
        degree: degree
      }
    });

    let that = this;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.getDegreeList();
      }
    });
  }

  async deleteDegree(id) {
    let dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: new ConfirmDialogData(this.translate.instant('Delete') + " \"" + "Degree Name popup" + "\"", this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
    });

    let that = this;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.recruitingManagementService.degreeDelete({id: id}).then((data: any) => {
          that.getDegreeList();
        });
      }
    });
  }
}
