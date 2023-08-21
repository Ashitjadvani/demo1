import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {MCPHelperService} from '../../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';
import {QuizMatrixService} from '../../../../../../../fe-common-v2/src/lib/services/quiz-matrix.service';

@Component({
  selector: 'app-add-edit-metrics',
  templateUrl: './add-edit-metrics.component.html',
  styleUrls: ['./add-edit-metrics.component.scss']
})
export class AddEditMetricsComponent implements OnInit {
  addMetricsForm: FormGroup;
  title = 'Add';
  document: any;
  documentData: any;
  documentName: any;
  button = 'Save';
  metricsType = [];


  metricsTypeList = [
    'Numeric'
  ];
  constructor(public formBuilder: FormBuilder,
              private router: Router,
              public route: ActivatedRoute,
              private ApiService: QuizMatrixService,
              private helper: MCPHelperService,
              public translate: TranslateService) {

    this.addMetricsForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      // titleItalian: [null,[Validators.required]],
      type: [null, [Validators.required]],
      aggregation_strategy: [null, [Validators.required]],
      description: [null, [Validators.required]],
      // descriptionItalian: [null,[Validators.required]]
    });

  }

  async ngOnInit(): Promise <void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== '0') {
      this.title = 'Edit';
      this.button = 'Update';
      this.helper.toggleLoaderVisibility(true);
      const res: any = await this.ApiService.viewMatrix({id: id});
      if (res.result === true) {
        this.documentData = res.data;
        this.metricsType = res.data.type;
        this.helper.toggleLoaderVisibility(false);
      }else {
        this.helper.toggleLoaderVisibility(false);
        // const e = err.error;
        swal.fire(
          '',
          // err.error.message,
          this.translate.instant(res.reson),
          'info'
        );
      }

      this.addMetricsForm.patchValue({
        id: this.documentData.id,
        name: this.documentData.name,
        type: this.documentData.type,
        aggregation_strategy: this.documentData.aggregation_strategy,
        description: this.documentData.description});
      this.documentName = 'you have to select document again';
    }
  }
  async addMatrix(): Promise<void>{
    if (this.addMetricsForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      const getInputsValues = this.addMetricsForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      this.documentData.append('document', this.document);
      const id = this.route.snapshot.paramMap.get('id');
      const name = this.addMetricsForm.value.name;
      const type = this.addMetricsForm.value.type;
      const aggregation_strategy = this.addMetricsForm.value.aggregation_strategy;
      const description = this.addMetricsForm.value.description;
      if (id !== '0')
      {
        const res: any = await this.ApiService.addMatrix({
          aggregation_strategy: aggregation_strategy,
          description: description,
          id: id,
          name: name,
          type: type
        });
        if (res){
          this.helper.toggleLoaderVisibility(false);
          this.router.navigate(['/quiz-survey/metrics']);
          swal.fire('',
            this.translate.instant('Swal_Message.Matrix edited successfully'),
            'success');
        }else {
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant(res.reson),
            'info'
          );
        }
      } else {
        const res: any = await this.ApiService.addMatrix(this.addMetricsForm.value);
        if (res){
          this.helper.toggleLoaderVisibility(false);
          this.router.navigate(['/quiz-survey/metrics']);
          swal.fire('',
            this.translate.instant('Swal_Message.Matrix added successfully'),
            'success');
        }else {
          this.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            this.translate.instant(res.reson),
            'info'
          );
        }
      }
    }
  }
  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
