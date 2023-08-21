import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import swal from "sweetalert2";
import {EventManagementEventServices} from "../../../../../../../fe-common-v2/src/lib/services/event-services.service";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {style} from "@angular/animations";
import {display} from "html2canvas/dist/types/css/property-descriptors/display";

@Component({
  selector: 'app-view-event-service',
  templateUrl: './view-event-service.component.html',
  styleUrls: ['./view-event-service.component.scss']
})
export class ViewEventServiceComponent implements OnInit {
  title = 'View';
  servicedata: any = [];
  config: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    height: '13rem',
    minHeight: '4rem',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['insertImage'],
      ['insertVideo']
    ],
    customClasses: [
      {
        name: 'LineHeight-15px',
        class: 'LineHeight-15px',
      },
      {
        name: 'LineHeight-20px',
        class: 'LineHeight-20px',
      },
      {
        name: 'LineHeight-25px',
        class: 'LineHeight-25px',
      },
      {
        name: 'LineHeight-30px',
        class: 'LineHeight-30px',
      },
      {
        name:'Text-justify',
        class:'Text-justify',
      }
    ],
  };
  emailTemplate: any;
  constructor(
    public route: ActivatedRoute,
    private ApiService: EventManagementEventServices,
    private helper: MCPHelperService,
    public translate: TranslateService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getDetails(id);
    this.renderer.setStyle(document.getElementsByClassName('bg-comman'), 'display', 'none');
  }

  getDetails(id){
    this.helper.toggleLoaderVisibility(true);
    this.ApiService.editEventServices({id:id}).subscribe((res: any) => {
      if(res.statusCode === 200){
        this.servicedata =  res.data;
        this.emailTemplate = this.servicedata.template;
        this.helper.toggleLoaderVisibility(false);
      }
      this.helper.toggleLoaderVisibility(false);
    }, (err) => {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(err.error.message),
        'error'
      );
    });
  }
}
