import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProcurementService } from '../../../../../../../fe-common-v2/src/lib/services/procurement.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { MCPHelperService } from "../../../../service/MCPHelper.service";
import { data } from 'jquery';
import { any } from 'codelyzer/util/function';
import { Location } from "@angular/common";
import { environment } from '../../../../../environments/environment';
import { MatTabGroup } from "@angular/material/tabs";
import { TranslateService } from "@ngx-translate/core";

export enum Status{
  ACTIVE = 1,
  INACTIVE = 2,
  DECLINE = 3,
  PENDING = 4,
  ACCEPT = 5,
  REJECT = 6,
  UNDER_CREATION = 9,
  IN_PROGRESS = 11,
  TO_VALIDATE = 12,
}
@Component({
  selector: 'app-view-manage-supplier',
  templateUrl: './view-manage-supplier.component.html',
  styleUrls: ['./view-manage-supplier.component.scss']
})

export class ViewManageSupplierComponent implements OnInit {
  displayedColumns: string[] = ['quiz', 'result', 'fitIndex', 'fitIndexValue'];
  public displayedMatricsColumns = ['value', 'textresult', 'scalarresult'];
  // summaryData = ELEMENT_DATA;
  summaryData: any = [];

  supplierDetails: any;
  questionListData: any;
  supplierId: any;
  companyBroucher: any;
  generalContacts = [];
  contactShipping = [];
  administrativeContact = [];
  url: string = '';
  docIsPdf = false;
  hasQuizServe = false;
  dataQuestionSurvey = [];
  singleQuestionData = [];
  singleAnswerData = [];
  docSupplier = []
  downloadUrl: string;
  downloadUrlDURC: string;
  downloadUrlDURF: string;
  downloadUrlcondizioni: string;
  downloadUrlvisuraCamerale: string;
  baseURL: string;
  activeIndex: number;
  activeIndex2: number;
  matricSurveyId: any;
  authorId: any;
  matricsDataSource = [];
  showCommonDetails = false
  showSupplierDetails = false
  showCompanyBroucher = false
  showQuizSurvey = false

  @ViewChildren('childTabs') childTabs: QueryList<MatTabGroup>;
  constructor(
    private procurementService: ProcurementService,
    private router: Router,
    public helper: MCPHelperService,
    private route: ActivatedRoute,
    private location: Location,
    private translate: TranslateService
  ) {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.authorId = authUser.person.id;
    }
  }

  async ngOnInit() {
    // this.helper.signupSupplierDocument(data).subscribe(data =>{
    //   this.docDURF = data.data
    // })
    this.helper.signupSupplierDocument({ supplier_id: this.route.snapshot.paramMap.get('id') }).subscribe(data => {
      this.docSupplier = data.data
      const DURCFileId = this.docSupplier.find((b) => b.filename === 'DURCFileId');
      if (DURCFileId) {
        this.downloadUrlDURC = environment.api_host + '/v2/data-storage/download/' + DURCFileId.id;
      }
      const DURFFileId = this.docSupplier.find((b) => b.filename === 'DURFFileId');
      if (DURFFileId) {
        this.downloadUrlDURF = environment.api_host + '/v2/data-storage/download/' + DURFFileId.id;
      }

      const condizioniFileId = this.docSupplier.find((b) => b.filename === 'condizioniFileId');
      if (condizioniFileId) {
        this.downloadUrlcondizioni = environment.api_host + '/v2/data-storage/download/' + condizioniFileId.id;
      }

      const visuraCameraleFileId = this.docSupplier.find((b) => b.filename === 'visuraCameraleFileId');
      if (visuraCameraleFileId) {
        this.downloadUrlvisuraCamerale = environment.api_host + '/v2/data-storage/download/' + visuraCameraleFileId.id;
      }
    })
    this.supplierId = this.route.snapshot.paramMap.get('id');
    await this.supplierDetailsData();
    await this.questionListDataFunc();
    this.procurementService.listSupplierFitIndex({ supplier_id: this.supplierId }).then((data) => {
      this.summaryData = data.reason;
      const matricData = this.summaryData;
      for (let i = 0; i < matricData.length; i++) {
        this.matricSurveyId = matricData[i].survey_id
        this.procurementService.loadAppQuizMetricList({ survey_id: this.matricSurveyId }).then(data => {
          this.matricsDataSource[i] = data.data;
        });
        this.matricsDataSource.push(this.matricsDataSource[i]);
      }
    });
  }

  onTabChange(event: any) {
    this.activeIndex = event.index;

    this.childTabs.forEach(childTab => {
      childTab.realignInkBar();
    });
  }

  onTabChange2(event: any) {
    //this.activeIndex2 = event.index;
    this.activeIndex2 = 0;
  }

  async questionListDataFunc(){
    const data1 = await this.procurementService.questionList({ supplier_id: this.supplierId })
    this.questionListData = data1.data;
    if (this.questionListData.length){
      this.showQuizSurvey = true
    }
    const dataQuestionSurvey = this.questionListData?.questionData ? this.questionListData.questionData : [];
    for (let i = 0; i < this.questionListData.length; i++) {
      this.dataQuestionSurvey = this.questionListData[i].questionData;
      for (let i = 0; i < this.dataQuestionSurvey.length; i++) {
        this.singleQuestionData = this.dataQuestionSurvey[i].question[0];
      }
      for (let i = 0; i < this.dataQuestionSurvey.length; i++) {
        this.singleAnswerData = this.dataQuestionSurvey[i].question;
      }
    }
  }
  async supplierDetailsData(){
    /*this.procurementService.getSupplier({ id: this.supplierId }).then((data) => {*/
    const data =  await this.procurementService.getSupplier({ id: this.supplierId });
    this.supplierDetails = data.data;
    if (this.supplierDetails.companyBroucher != '') {
      this.docIsPdf = true;
    } else {
      this.docIsPdf = false;
    }
    this.companyBroucher = this.supplierDetails.companyBroucher;
    this.generalContacts = (this.supplierDetails?.generalContacts) ? this.supplierDetails.generalContacts : [];
    this.contactShipping = (this.supplierDetails?.contactShipping) ? this.supplierDetails.contactShipping : [];
    this.administrativeContact = (this.supplierDetails?.administrativeContact) ? this.supplierDetails.administrativeContact : [];
    if (this.companyBroucher) {
      this.procurementService.downloadDocument(this.companyBroucher).subscribe((broucher: any) => {
        const blob = new Blob([broucher]);
        this.url = window.URL.createObjectURL(blob);
      });
    }
    let status = this.supplierDetails?.status
    if(status === Status.ACTIVE || status === Status.TO_VALIDATE || status !== Status.ACCEPT || status !== Status.PENDING ){
      this.showCommonDetails = true
    }
    if(status !== Status.ACTIVE && status !== Status.TO_VALIDATE)[
      this.showSupplierDetails = true
    ]
    if(status === Status.PENDING || status === Status.ACCEPT){
      this.showCompanyBroucher = true
    }
  }

  acceptInvitation(): void {
    this.helper.toggleLoaderVisibility(true);
    this.procurementService.serviceAcceptReject({ status: 'accept', id: this.supplierId, authorId: this.authorId }).then((data: any) => {
      this.helper.toggleLoaderVisibility(false);
      this.supplierDetails.status = 5;
      this.supplierDetails.statusName = 'Invited';
      swal.fire(
        '',
        this.translate.instant(data.meta.message),
        'success'
      );
    }, (err) => {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(err.error.message),
        'info'
      );
    });
  }

  onDeclarationChange(args) {
    args.source.checked = true;
  }
}
