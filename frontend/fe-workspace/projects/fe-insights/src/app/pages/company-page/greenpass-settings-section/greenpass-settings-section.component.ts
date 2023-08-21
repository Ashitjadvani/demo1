import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from 'projects/fe-common/src/lib/dialogs/confirm-dialog/confirm-dialog.component';
import {Company} from 'projects/fe-common/src/lib/models/company';
import { GreenPassAgeRangeLevel, GreenPassSettings } from 'projects/fe-common/src/lib/models/greenpass';
import { AdminUserManagementService } from 'projects/fe-common/src/lib/services/admin-user-management.service';
import { CommonService } from 'projects/fe-common/src/lib/services/common.service';
import {RecruitingManagementService} from 'projects/fe-common/src/lib/services/recruiting-management.service';

@Component({
  selector: 'app-greenpass-settings-section',
  templateUrl: './greenpass-settings-section.component.html',
  styleUrls: ['./greenpass-settings-section.component.scss']
})
export class GreenpassSettingsSectionComponent implements OnInit, OnChanges {
  @Input() currentCompany: Company;
  currentGreenpassSettings: GreenPassSettings = GreenPassSettings.Empty();

  constructor(
    private dialog: MatDialog,
    public translate: TranslateService,
    private adminUserManagementService: AdminUserManagementService,
    public common: CommonService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if(this.currentCompany.greenpassSettings) {
      this.currentGreenpassSettings = this.currentCompany.greenpassSettings;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.currentCompany.greenpassSettings) {
      this.currentGreenpassSettings = this.currentCompany.greenpassSettings;
    }
  }

  async somethingChanged() {
    this.currentCompany.greenpassSettings = this.currentGreenpassSettings;
    await this.adminUserManagementService.updateCompany(this.currentCompany);
    this.currentCompany = (await this.adminUserManagementService.getCompany(this.currentCompany.id)).company;
  }

  async onAddAgeRangeLevelClick() {
    if(!this.currentGreenpassSettings.ageRangeLevel) {
      this.currentGreenpassSettings.ageRangeLevel = new Array();
    }
    let newAgeRangeLevel = GreenPassAgeRangeLevel.Empty();
    let age = 0;
    if(this.currentGreenpassSettings.ageRangeLevel.length>0) {
      for(let ageRangeLevel of this.currentGreenpassSettings.ageRangeLevel) {
        if(ageRangeLevel.upperBound+1 > age) age = ageRangeLevel.upperBound+1;
      }
    }
    newAgeRangeLevel.lowerBound = age;
    newAgeRangeLevel.upperBound = age+1;
    this.currentGreenpassSettings.ageRangeLevel.push(newAgeRangeLevel);
    this.currentCompany.greenpassSettings = this.currentGreenpassSettings;
    await this.adminUserManagementService.updateCompany(this.currentCompany);
  }

  async onRemoveAgeRangeLevelClick(rangeLevelToRemove: GreenPassAgeRangeLevel) {
    let newLevels = new Array();
    for(let ageRangeLevel of this.currentGreenpassSettings.ageRangeLevel) {
      if(ageRangeLevel == rangeLevelToRemove) {}
      else  newLevels.push(ageRangeLevel);
    }
    this.currentGreenpassSettings.ageRangeLevel = newLevels;
    this.currentCompany.greenpassSettings = this.currentGreenpassSettings;
    await this.adminUserManagementService.updateCompany(this.currentCompany);
  }

  async onRangeChanged(rangeLevelChanged: GreenPassAgeRangeLevel) {
    if(rangeLevelChanged.lowerBound >= rangeLevelChanged.upperBound) {
      for(let range of this.currentGreenpassSettings.ageRangeLevel) {
        if(range == rangeLevelChanged) {
          range.upperBound = range.lowerBound+1;
        }
      }
    }
    this.currentCompany.greenpassSettings = this.currentGreenpassSettings;
    await this.adminUserManagementService.updateCompany(this.currentCompany);
  }

}
