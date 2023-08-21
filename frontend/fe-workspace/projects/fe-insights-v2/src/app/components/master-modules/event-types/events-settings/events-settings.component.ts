import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Company, CompanyJustification, JustificationsSettings } from 'projects/fe-common-v2/src/lib/models/company';
import {ProfileSettingsService} from "../../../../../../../fe-common-v2/src/lib/services/profile-settings.service";
import {CommonService} from "../../../../../../../fe-common-v2/src/lib/services/common.service";
import { DatePipe } from '@angular/common';
import swal from "sweetalert2";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MasterModuleEventTypeService} from "../../../../../../../fe-common-v2/src/lib/services/master-module-event-type.service";

@Component({
  selector: 'app-events-settings',
  templateUrl: './events-settings.component.html',
  styleUrls: ['./events-settings.component.scss']
})
export class EventsSettingsComponent implements OnInit {
  eventsSettingsForm: FormGroup;
  justificationsSettings: JustificationsSettings;
  // company: Company;
  documentData: any;
  document: any;
  companyId: any;
  time: any;
  TimeData: any;
  settime: any;

  public sendEmailList: any[] = ['Once a Day', 'For Every Request'];

  constructor(public _categoriesForm: FormBuilder,
              private ApiService: ProfileSettingsService,
              public common: CommonService,
              private date: DatePipe,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              public route: ActivatedRoute,
              private Api: MasterModuleEventTypeService) {

    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }

    this.eventsSettingsForm = this._categoriesForm.group({
      sendMailForEveryRequest : ['', [Validators.required]],
      sendAllMailEverydayAt : ['', [Validators.required]],
      enableAutoMergeRequests : ['', [Validators.required]],
      mailObject : ['', [Validators.required]],
      mailStart : ['Buongiorno <NOME_DESTINATARIO>,<br>La informiamo che ci sono le seguenti richieste in attesa di approvazione:<br>'],
      mailEnd : ['La invitiamo ad accedere all\'app nella sezione \"Gestione dipendenti\" per accettare o rifiutare le richieste in sospeso.<br>Cordiali saluti.']
    });
   }

  ngOnInit(): void {
    this.ApiService.getCompany({}).subscribe((res: any ) => {
      this.documentData = res.company.peopleJustificationsSettings;
      this.eventsSettingsForm.patchValue({
        // id: this.eventsSettingsForm,
        sendMailForEveryRequest: this.documentData.sendMailForEveryRequest,
        sendAllMailEverydayAt: this.date.transform(this.documentData.sendAllMailEverydayAt, 'HH:mm'),
        enableAutoMergeRequests: this.documentData.enableAutoMergeRequests,
        mailObject: this.documentData.mailObject,
        mailStart: this.documentData.mailStart,
        mailEnd: this.documentData.mailEnd
      });
      this.settime = this.documentData.sendAllMailEverydayAt;
    });
  }
  async changeCategory(){
    if (this.eventsSettingsForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      if(this.time === undefined){
        let time  = this.date.transform(this.settime, 'HH:mm');
        let timeSplit = time.split(':');
        this.eventsSettingsForm.value.sendAllMailEverydayAt = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), +timeSplit[0], +timeSplit[1]).toISOString();
      }else{
        this.eventsSettingsForm.value.sendAllMailEverydayAt = this.time;
      }
      const getInputsValues = this.eventsSettingsForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const res: any = await this.Api.set(this.companyId, this.eventsSettingsForm.value);
      if (res) {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['/master-modules/event-types']);
        swal.fire('',
          this.translate.instant('Swal_Message.Event setting has been updated successfully'),
          'success');

      } else {
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(res.reason),
          'info'
        );
      }
    }
  }

  setJustificationMailTime(time) {
    let timeSplit = time.split(':');
    this.eventsSettingsForm.value.sendAllMailEverydayAt = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), +timeSplit[0], +timeSplit[1]).toISOString();
    this.time = this.eventsSettingsForm.value.sendAllMailEverydayAt;
  }
}
