import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {AccountService} from "../../../../../../../fe-common-v2/src/lib/services/account.service";
import swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {EventManagementEventServices} from "../../../../../../../fe-common-v2/src/lib/services/event-services.service";

@Component({
  selector: 'app-add-edit-event-services',
  templateUrl: './add-edit-event-services.component.html',
  styleUrls: ['./add-edit-event-services.component.scss']
})
export class AddEditEventServicesComponent implements OnInit {
  panelOpenState = false;

  title = 'Add';
  eventServicesForm: FormGroup;
  costCenterTypeList = [];
  config: AngularEditorConfig = {
    editable: true,
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
  emailTemplate: any="";
  userLanguageSelect: string;
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public _formBuilder: FormBuilder,
    private ApiService: EventManagementEventServices,
    private helper: MCPHelperService,
    public translate: TranslateService,
  ) {
    this.eventServicesForm = this._formBuilder.group({
      servicename: [null, [MCPHelperService.noWhitespaceValidator,MCPHelperService.nameValidator, Validators.required]],
      supplierName: [''],
      referenceEmail: [null, Validators.compose([Validators.maxLength(50), Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$')])],
      phone: ['', Validators.required],
      description: [''],
      subject:['', Validators.required],
      emailtemplate: ['']
    });

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getDetails(id);
    if(id === '0'){
      this.userLanguageSelect = MCPHelperService.getLanguageName();
        // this.eventServicesForm.controls['emailtemplate'].patchValue(this.translate.instant("EVENT_MANAGEMENT.Email_Format"))
      if (this.userLanguageSelect !== 'it') {
        this.eventServicesForm.controls['emailtemplate'].patchValue("<table cellspacing=\"0\" style=\"max-width:800px;width:100%;margin:0px auto;background-color:#ffffff;border-radius:5px;overflow:hidden;text-align:center;border:1px solid #eeeeee\">\n" +
            "\n" +
            "    <tbody>\n" +
            "        <tr style=\"background:#002a3a\">\n" +
            "            <td style=\"padding:15px 15px\">\n" +
            "                <a href=\"#\" style=\"text-decoration:none\">\n" +
            "                <img src=\"https://app.irina.legance.it/assets/images/legance-white.png\">\n" +
            "            </a>\n" +
            "            </td>\n" +
            "        </tr>\n" +
            "\n" +
            "\n" +
            "        <tr style=\"text-align:left\">\n" +
            "            <td style=\"padding: 20px 50px 50px;\">\n" +
            "                <p>Dear <b>%Supplier_Name%</b>,</p>\n" +
            "                <p><br></p>\n" +
            "                <p>We are contacting you to request, on the occasion of our event <b>%Event_Name%</b> on <b>%Event_Start_Date%</b> at <b>[Event Location]</b>, the provision of the following services:</p>\n" +
            "                <p><br></p>\n" +
            "                <p><b>[enter free text for requirements, quantity, delivery time]</b></p>\n" +
            "                <p><br></p>\n" +
            "                <p>We kindly ask you to confirm your availability for the requested service and to provide a quotation, if possible, by sending an email to <b>[Email_Address]</b></p>\n" +
            "                <p><br></p>\n" +
            "                <p>If you have any questions, please send an email to <b>[Email_Address]</b></p>\n" +
            "                <p><br></p>\n" +
            "                <p>Best regards,</p>\n" +
            "                <p><b>[Company signature]</b></p>\n" +
            "            </td>\n" +
            "        </tr>\n" +
            "\n" +
            "\n" +
            "        <tr style=\"background-color:#002a3a;color:#a6b0cf;text-align:center;font-size:14px\">\n" +
            "            <td style=\"padding:20px 15px;color:#ffffff\">Powered by Irina© NuNow© All Rights Reserved.</td>\n" +
            "        </tr>\n" +
            "\n" +
            "    </tbody>\n" +
            "</table>"


        )
      } else {
        this.eventServicesForm.controls['emailtemplate'].patchValue("<table cellspacing=\"0\" style=\"max-width:800px;width:100%;margin:0px auto;background-color:#ffffff;border-radius:5px;overflow:hidden;text-align:center;border:1px solid #eeeeee\">\n" +
            "\n" +
            "    <tbody>\n" +
            "        <tr style=\"background:#002a3a\">\n" +
            "            <td style=\"padding:15px 15px\">\n" +
            "                <a href=\"#\" style=\"text-decoration:none\">\n" +
            "                <img src=\"https://app.irina.legance.it/assets/images/legance-white.png\">\n" +
            "            </a>\n" +
            "            </td>\n" +
            "        </tr>\n" +
            "\n" +
            "\n" +
            "        <tr style=\"text-align:left\">\n" +
            "            <td style=\"padding: 20px 50px 50px;\">\n" +
            "                <p>Gentile <b>%Nome_Fornitore%</b>,</p>\n" +
            "                <p><br></p>\n" +
            "                <p>Vi contattiamo per richiedere, in occasione del nostro evento <b>%Nome_Evento%</b> del <b>%Data_Inizio_Evento%</b> presso <b>[Luogo dell'evento]</b> la fornitura dei seguenti servizi:</p>\n" +
            "                <p><br></p>\n" +
            "                <p><b>[Inserire testo libero per richieste, quantità, data di consegna]</b></p>\n" +
            "                <p><br></p>\n" +
            "                <p>Vi preghiamo gentilmente di confermare la Vostra disponibilit&#224; per il servizio richiesto e&#160; di fornire un preventivo, se possibile, inviando una mail a <b>[Indirizzo_Mail]</b></p>\n" +
            "                <p><br></p>\n" +
            "                <p>Per qualunque domanda Vi preghiamo di inviare una mail a <b>[Indirizzo_Mail]</b></p>\n" +
            "                <p><br></p>\n" +
            "                <p>Cordiali Saluti,</p>\n" +
            "                <p><b>[Firma Azienda]</b></p>\n" +
            "            </td>\n" +
            "        </tr>\n" +
            "\n" +
            "\n" +
            "        <tr style=\"background-color:#002a3a;color:#a6b0cf;text-align:center;font-size:14px\">\n" +
            "            <td style=\"padding:20px 15px;color:#ffffff\">Powered by Irina© NuNow© All Rights Reserved.</td>\n" +
            "        </tr>\n" +
            "\n" +
            "    </tbody>\n" +
            "</table>"

        )
      }
    }
  }
  getDetails(id){
    if(id !== '0'){
      this.title = 'Edit';
      this.helper.toggleLoaderVisibility(true);
      this.ApiService.editEventServices({id:id}).subscribe((res: any) => {
        if(res.statusCode === 200){
          this.eventServicesForm.patchValue({
            servicename: res.data.name,
            supplierName: res.data.supplierName,
            referenceEmail: res.data.email,
            phone: res.data.phone,
            description: res.data.description,
            emailtemplate: res.data.template,
            subject: res.data.subject
          });
          this.helper.toggleLoaderVisibility(false);
        }
        this.helper.toggleLoaderVisibility(false);
      }, (err) => {
        this.helper.toggleLoaderVisibility(false);
        this.router.navigate(['event-management/event-services']);
        swal.fire(
          '',
          this.translate.instant(err.error.message),
          'error'
        )
      });
    }
  }
    numberOnly(event: { which: any; keyCode: any; }): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
  onEditConfirmClick():void{
    if (this.eventServicesForm.valid){
      this.helper.toggleLoaderVisibility(true);
      const id = this.route.snapshot.paramMap.get('id');
      if (id !== '0'){
        const addUpdateDate = {
          id:id,
          name: this.eventServicesForm.value.servicename,
          supplierName: this.eventServicesForm.value.supplierName,
          email: this.eventServicesForm.value.referenceEmail,
          phone: this.eventServicesForm.value.phone,
          description: this.eventServicesForm.value.description,
          template: this.eventServicesForm.value.emailtemplate,
          subject: this.eventServicesForm.value.subject,
        }
        this.addEditEventServiceFunc(addUpdateDate);
      }else {
        const addUpdateDate = {
          name: this.eventServicesForm.value.servicename,
          supplierName: this.eventServicesForm.value.supplierName,
          email: this.eventServicesForm.value.referenceEmail,
          phone: this.eventServicesForm.value.phone,
          description: this.eventServicesForm.value.description,
          template: this.eventServicesForm.value.emailtemplate,
          subject: this.eventServicesForm.value.subject,
        }
        this.addEditEventServiceFunc(addUpdateDate);
      }
    }
  }

  addEditEventServiceFunc(data):void{
    this.ApiService.addEventServices(data).subscribe((res: any) => {
      if(res.statusCode === 200){
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant(res.meta.message),
          'success'
        )
        this.router.navigate(['event-management/event-services']);
      }
      this.helper.toggleLoaderVisibility(false);
    }, (err) => {
      this.helper.toggleLoaderVisibility(false);
      swal.fire(
        '',
        this.translate.instant(err.error.message),
        'info'
      )
    });
  }

  public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
