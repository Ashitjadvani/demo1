import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CareerApiService } from 'projects/fe-career/src/app/service/careerApi.service';
import { ConfirmDialogComponent, ConfirmDialogData } from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import { Company } from 'projects/fe-common/src/lib/models/company';
import { AddEditUniversityDialogComponent } from './add-edit-university-dialog/add-edit-university-dialog.component';
//import {RecruitingManagementService} from "fe-common/services/recruiting-management.service";
import { RecruitingManagementService } from 'projects/fe-common/src/lib/services/recruiting-management.service';
import { data } from 'jquery';


@Component({
  selector: 'app-university-section',
  templateUrl: './university-section.component.html',
  styleUrls: ['./university-section.component.scss']
})
export class UniversitySectionComponent implements OnInit {
  universityListData : any = [];

  @Input() currentCompany: Company;
  constructor(
    private recruitingManagementService: RecruitingManagementService,
    private dialog : MatDialog,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getUniversityList();
  }

  getUniversityList(){
    this.recruitingManagementService.universityList().then((data: any) => {
      this.universityListData = data.data;
    });
  }

  async editUniversity(university, mode) {
    let dialogRef = await this.dialog.open(AddEditUniversityDialogComponent, {
      maxWidth: '600px',
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        isNew: true,
        mode: mode,
        university: university
      }
    });
    let that = this;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.getUniversityList();
      }
    });
  }

  async deleteUniversity(id: any) {
    const dialogRef = await this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: new ConfirmDialogData(this.translate.instant('Delete') + " \"" + "Universiry Name popup" + "\"", this.translate.instant('ADMIN COMPONENTS.SURE'), this.translate.instant('GENERAL.YES'), this.translate.instant('GENERAL.NO'))
    });
    let that = this;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.recruitingManagementService.universityDelete({id}).then((data: any) => {
          that.getUniversityList();
        });
      }
    });
  }
}
