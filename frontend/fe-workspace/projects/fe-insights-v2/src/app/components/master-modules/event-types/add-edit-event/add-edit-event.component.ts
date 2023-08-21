import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Person } from '../../../../../../../fe-common-v2/src/lib/models/person';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserManagementService } from '../../../../../../../fe-common-v2/src/lib/services/user-management.service';
import { AdminUserManagementService } from '../../../../../../../fe-common-v2/src/lib/services/admin-user-management.service';
import { Company, CompanyJustification, JustificationApproval } from '../../../../../../../fe-common-v2/src/lib/models/company';
import { CommonService } from '../../../../../../../fe-common-v2/src/lib/services/common.service';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { MCPHelperService } from 'projects/fe-insights-v2/src/app/service/MCPHelper.service';

enum APPROVAL_TYPE {
  RESPONSABLE,
  ACCOUNTABLE,
  CONSULTED,
  INFORMED
}
@Component({
  selector: 'app-add-edit-event',
  templateUrl: './add-edit-event.component.html',
  styleUrls: ['./add-edit-event.component.scss']
})
export class AddEditEventComponent implements OnInit {

  addEventForm:FormGroup;
  title ='Add';
  userAccount: Person;
  currentCompany: Company = new Company();
  justifications: CompanyJustification[] = [];
  isModify: boolean;
  currResponsable: any = null;
  currAccountable: any = null;
  currConsulted: any = null;
  currInformed: any = null;
  appRes = APPROVAL_TYPE.RESPONSABLE
  appAcc = APPROVAL_TYPE.ACCOUNTABLE
  appCon = APPROVAL_TYPE.CONSULTED
  appInf =  APPROVAL_TYPE.INFORMED

  respoEmail:any ='';
  accoEmail:any ='';
  consEmail:any ='';
  infoEmail:any ='';

  filterCallback: Function;

  allAreas: string[];
  allRoles: string[];
  allDirections: string[];
  allJobTitles: string[];

  allFigures: string[];
  selectedAccFigure: string = "";
  selectedRespFigure: string = "";
  selectedConsFigure: string = "";
  selectedInfoFigure: string = "";

  editEventData:any;

  @Output() UpdateEvent: EventEmitter<void> = new EventEmitter<void>();
  currentJustification: CompanyJustification = CompanyJustification.Empty();
  allPeople: Person[];
  userList = ['User','Area Manager', 'Director','Email'];

  constructor(public _categoriesForm:FormBuilder,
    private adminUserManagementService: AdminUserManagementService,
    private commonService: CommonService,
    private userManagementService: UserManagementService,
    private router: Router,
    public route: ActivatedRoute,
    private helper: MCPHelperService,
    private translate: TranslateService) {}

  async ngOnInit(){

    this.userAccount = this.userManagementService.getAccount();
    const eventId = this.route.snapshot.paramMap.get('id');
    await this.getJustifications();
    let res = await this.adminUserManagementService.getPeopleList(this.userAccount.companyId);
    if (this.commonService.isValidResponse(res)) {
        this.allPeople = res.people;
    }
    // this.getEditEventDetail();
    if(eventId !== '0'){
        this.title = 'Edit';
        this.onModifyJustification();
    }else{
        this.onAddJustification();
    }

  }
  changeCategory(){}


  getEditEventDetail(){

  }

buildEntity() {
  this.allFigures = new Array();
  this.allFigures.push("-");
  this.allFigures.push("User");
  this.allFigures.push("Email");
  this.allFigures.push("Director");
  this.allFigures.push("Area Manager");
  for (let area of this.currentCompany.areas) {
      this.allFigures.push("Manager " + area.name);
  }
  for (let dir of this.currentCompany.peopleDirections) {
      this.allFigures.push("Director " + dir);
  }
}
onFigureChange(event: MatSelectChange, approvalType: APPROVAL_TYPE) {

  let figure = event.value;
  if (approvalType == APPROVAL_TYPE.RESPONSABLE) {

      if (figure == "User") {
          this.currentJustification.approvalResponsable.isEmail = false;
          this.currentJustification.approvalResponsable.isFigure = false;
          this.currentJustification.approvalResponsable.isUser = true;
      }
      else if (figure == "Email") {
          this.currentJustification.approvalResponsable.isUser = false;
          this.currentJustification.approvalResponsable.isFigure = false;
          this.currentJustification.approvalResponsable.isEmail = true;
      }
      else if (figure == "-") {
          this.currentJustification.approvalResponsable.isUser = false;
          this.currentJustification.approvalResponsable.isFigure = false;
          this.currentJustification.approvalResponsable.isEmail = false;
      }
      else {
          this.currentJustification.approvalResponsable.isUser = false;
          this.currentJustification.approvalResponsable.isEmail = false;
          this.currentJustification.approvalResponsable.isFigure = true;
          if (figure == "Area Manager") {
              this.currentJustification.approvalResponsable.figureArea = "";
              this.currentJustification.approvalResponsable.figureDirection = "";
              this.currentJustification.approvalResponsable.figureRole = "Area Manager";
          }
          else if (figure == "Director") {
              this.currentJustification.approvalResponsable.figureArea = "";
              this.currentJustification.approvalResponsable.figureDirection = "";
              this.currentJustification.approvalResponsable.figureRole = "Director";
          }
          else if (figure.includes("Director")) {
              this.currentJustification.approvalResponsable.figureArea = "";
              this.currentJustification.approvalResponsable.figureRole = "Director";
              this.currentJustification.approvalResponsable.figureDirection = figure.replace("Director ", "");
          }
          else if (figure.includes("Manager")) {
              this.currentJustification.approvalResponsable.figureDirection = "";
              this.currentJustification.approvalResponsable.figureRole = "Area Manager";
              this.currentJustification.approvalResponsable.figureArea = figure.replace("Manager ", "");
          }
          else {
              this.currentJustification.approvalResponsable.isUser = false;
              this.currentJustification.approvalResponsable.isEmail = false;
              this.currentJustification.approvalResponsable.isFigure = false;
          }
      }
  }
  if (approvalType == APPROVAL_TYPE.ACCOUNTABLE) {
      if (figure == "User") {
          this.currentJustification.approvalAccountable.isEmail = false;
          this.currentJustification.approvalAccountable.isFigure = false;
          this.currentJustification.approvalAccountable.isUser = true;
      }
      else if (figure == "Email") {
          this.currentJustification.approvalAccountable.isUser = false;
          this.currentJustification.approvalAccountable.isFigure = false;
          this.currentJustification.approvalAccountable.isEmail = true;
      }
      else if (figure == "-") {
          this.currentJustification.approvalAccountable.isUser = false;
          this.currentJustification.approvalAccountable.isFigure = false;
          this.currentJustification.approvalAccountable.isEmail = false;
      }
      else {
          this.currentJustification.approvalAccountable.isUser = false;
          this.currentJustification.approvalAccountable.isEmail = false;
          this.currentJustification.approvalAccountable.isFigure = true;
          if (figure == "Area Manager") {
              this.currentJustification.approvalAccountable.figureArea = "";
              this.currentJustification.approvalAccountable.figureDirection = "";
              this.currentJustification.approvalAccountable.figureRole = "Area Manager";
          }
          else if (figure == "Director") {
              this.currentJustification.approvalAccountable.figureArea = "";
              this.currentJustification.approvalAccountable.figureDirection = "";
              this.currentJustification.approvalAccountable.figureRole = "Director";
          }
          else if (figure.includes("Director")) {
              this.currentJustification.approvalAccountable.figureArea = "";
              this.currentJustification.approvalAccountable.figureRole = "Director";
              this.currentJustification.approvalAccountable.figureDirection = figure.replace("Director ", "");
          }
          else if (figure.includes("Manager")) {
              this.currentJustification.approvalAccountable.figureDirection = "";
              this.currentJustification.approvalAccountable.figureRole = "Area Manager";
              this.currentJustification.approvalAccountable.figureArea = figure.replace("Manager ", "");
          }
          else {
              this.currentJustification.approvalAccountable.isUser = false;
              this.currentJustification.approvalAccountable.isEmail = false;
              this.currentJustification.approvalAccountable.isFigure = false;
          }
      }
  }
  if (approvalType == APPROVAL_TYPE.CONSULTED) {
      if (figure == "User") {
          this.currentJustification.approvalConsulted.isEmail = false;
          this.currentJustification.approvalConsulted.isFigure = false;
          this.currentJustification.approvalConsulted.isUser = true;
      }
      else if (figure == "Email") {
          this.currentJustification.approvalConsulted.isUser = false;
          this.currentJustification.approvalConsulted.isFigure = false;
          this.currentJustification.approvalConsulted.isEmail = true;
      }
      else if (figure == "-") {
          this.currentJustification.approvalConsulted.isUser = false;
          this.currentJustification.approvalConsulted.isFigure = false;
          this.currentJustification.approvalConsulted.isEmail = false;
      }
      else {
          this.currentJustification.approvalConsulted.isUser = false;
          this.currentJustification.approvalConsulted.isEmail = false;
          this.currentJustification.approvalConsulted.isFigure = true;
          if (figure == "Area Manager") {
              this.currentJustification.approvalConsulted.figureArea = "";
              this.currentJustification.approvalConsulted.figureDirection = "";
              this.currentJustification.approvalConsulted.figureRole = "Area Manager";
          }
          else if (figure == "Director") {
              this.currentJustification.approvalConsulted.figureArea = "";
              this.currentJustification.approvalConsulted.figureDirection = "";
              this.currentJustification.approvalConsulted.figureRole = "Director";
          }
          else if (figure.includes("Director")) {
              this.currentJustification.approvalConsulted.figureArea = "";
              this.currentJustification.approvalConsulted.figureRole = "Director";
              this.currentJustification.approvalConsulted.figureDirection = figure.replace("Director ", "");
          }
          else if (figure.includes("Manager")) {
              this.currentJustification.approvalConsulted.figureDirection = "";
              this.currentJustification.approvalConsulted.figureRole = "Area Manager";
              this.currentJustification.approvalConsulted.figureArea = figure.replace("Manager ", "");
          }
          else {
              this.currentJustification.approvalConsulted.isUser = false;
              this.currentJustification.approvalConsulted.isEmail = false;
              this.currentJustification.approvalConsulted.isFigure = false;
          }
      }
  }
  if (approvalType == APPROVAL_TYPE.INFORMED) {
      if (figure == "User") {
          this.currentJustification.approvalInformed.isEmail = false;
          this.currentJustification.approvalInformed.isFigure = false;
          this.currentJustification.approvalInformed.isUser = true;
      }
      else if (figure == "Email") {
          this.currentJustification.approvalInformed.isUser = false;
          this.currentJustification.approvalInformed.isFigure = false;
          this.currentJustification.approvalInformed.isEmail = true;
      }
      else if (figure == "-") {
          this.currentJustification.approvalInformed.isUser = false;
          this.currentJustification.approvalInformed.isFigure = false;
          this.currentJustification.approvalInformed.isEmail = false;
      }
      else {
          this.currentJustification.approvalInformed.isUser = false;
          this.currentJustification.approvalInformed.isEmail = false;
          this.currentJustification.approvalInformed.isFigure = true;
          if (figure == "Area Manager") {
              this.currentJustification.approvalInformed.figureArea = "";
              this.currentJustification.approvalInformed.figureDirection = "";
              this.currentJustification.approvalInformed.figureRole = "Area Manager";
          }
          else if (figure == "Director") {
              this.currentJustification.approvalInformed.figureArea = "";
              this.currentJustification.approvalInformed.figureDirection = "";
              this.currentJustification.approvalInformed.figureRole = "Director";
          }
          else if (figure.includes("Director")) {
              this.currentJustification.approvalInformed.figureArea = "";
              this.currentJustification.approvalInformed.figureRole = "Director";
              this.currentJustification.approvalInformed.figureDirection = figure.replace("Director ", "");
          }
          else if (figure.includes("Manager")) {
              this.currentJustification.approvalInformed.figureDirection = "";
              this.currentJustification.approvalInformed.figureRole = "Area Manager";
              this.currentJustification.approvalInformed.figureArea = figure.replace("Manager ", "");
          }
          else {
              this.currentJustification.approvalInformed.isUser = false;
              this.currentJustification.approvalInformed.isEmail = false;
              this.currentJustification.approvalInformed.isFigure = false;
          }
      }
  }
}
async getJustifications() {
    this.helper.toggleLoaderVisibility(true);
    let res = await this.adminUserManagementService.getCompany(this.userAccount.companyId);
    if (this.commonService.isValidResponse(res)) {
        this.currentCompany = res.company;
        this.helper.toggleLoaderVisibility(false);
    }
    this.justifications = this.currentCompany.peopleJustificationTypes;
    this.buildEntity();
    this.helper.toggleLoaderVisibility(false);
}

async onAddJustification() {
    await this.getJustifications();
    this.isModify = false;
    this.currentJustification = CompanyJustification.Empty();
    this.currentJustification.approvalAccountable.isFigure = true;
    this.currentJustification.approvalAccountable.figureRole = "Area Manager";
    this.currentJustification.approvalResponsable.isFigure = true;
    this.currentJustification.approvalResponsable.figureRole = "Director";
    this.currentJustification.approvalConsulted.isFigure = false;
    this.currentJustification.approvalConsulted.figureRole = "";
    this.currentJustification.approvalInformed.isFigure = false;
    this.currentJustification.approvalInformed.figureRole = "";
    this.selectedAccFigure = "Area Manager";
    this.selectedRespFigure = "Director";
    this.selectedConsFigure = "";
    this.selectedInfoFigure = "";
}

 async onModifyJustification() {

    this.helper.toggleLoaderVisibility(true);
    this.currentJustification =new CompanyJustification();

    const eventId = this.route.snapshot.paramMap.get('id');
    this.getJustifications();
        this.helper.getEditEventTypeData(eventId,this.userAccount.companyId).subscribe((data:any) =>{
            if(eventId !== '0'){
                this.title = 'Edit';
                this.isModify = true;
                var storeValue = data.data[0];
                this.currentJustification = (data.data[0].approvalAccountable == undefined) ? CompanyJustification.Empty(): data.data[0];
                if (storeValue.approvalAccountable == undefined){
                    this.currentJustification.approvationAbilitation = data.data[0].approvationAbilitation
                    this.currentJustification.enable = data.data[0].enable
                    this.currentJustification.eventType = data.data[0].eventType
                    this.currentJustification.id = data.data[0].id
                    this.currentJustification.name = data.data[0].name
                    this.currentJustification.scheduleAbilitation = data.data[0].scheduleAbilitation
                    this.currentJustification.sendEmail = data.data[0].sendEmail
                    this.currentJustification.silenceAssentAbilitation = data.data[0].silenceAssentAbilitation
                }
            }

            this.helper.toggleLoaderVisibility(false);
            if (this.currentJustification?.approvalAccountable?.isEmail) {
                this.selectedAccFigure = "Email";
            }
            else if (this.currentJustification?.approvalAccountable?.isUser) {
                this.selectedAccFigure = "User";
                for (let person of this.allPeople) {
                    if (this.currentJustification?.approvalAccountable?.personId == person.id) {
                        this.currAccountable = person.id;
                        break;
                    }
                }
            }
            else if (this.currentJustification?.approvalAccountable?.isFigure) {
                if (this.currentJustification?.approvalAccountable?.figureRole == "Director") {
                    if (this.currentJustification?.approvalAccountable?.figureDirection == "") {
                        this.selectedAccFigure = "Director";
                    }
                    else {
                        this.selectedAccFigure = "Director " + this.currentJustification?.approvalAccountable?.figureDirection;
                    }
                }
                else if (this.currentJustification?.approvalAccountable?.figureRole == "Area Manager") {
                    if (this.currentJustification?.approvalAccountable?.figureArea == "") {
                        this.selectedAccFigure = "Area Manager";
                    }
                    else {
                        this.selectedAccFigure = "Manager " + this.currentJustification?.approvalAccountable?.figureArea;
                    }
                }
            }
            else {
                this.selectedAccFigure = "";
            }

            if (this.currentJustification?.approvalResponsable?.isEmail) {
                this.selectedRespFigure = "Email";
            }
            else if (this.currentJustification?.approvalResponsable?.isUser) {
                this.selectedRespFigure = "User";
                for (let person of this.allPeople) {
                    if (this.currentJustification?.approvalResponsable?.personId == person.id) {
                        this.currResponsable = person.id;
                        break;
                    }
                }
            }
            else if (this.currentJustification?.approvalResponsable?.isFigure) {
                if (this.currentJustification?.approvalResponsable?.figureRole == "Director") {
                    if (this.currentJustification?.approvalResponsable?.figureDirection == "") {
                        this.selectedRespFigure = "Director";
                    }
                    else {
                        this.selectedRespFigure = "Director " + this.currentJustification?.approvalResponsable?.figureDirection;
                    }
                }
                else if (this.currentJustification?.approvalResponsable?.figureRole == "Area Manager") {
                    if (this.currentJustification?.approvalResponsable?.figureArea == "") {
                        this.selectedRespFigure = "Area Manager";
                    }
                    else {
                        this.selectedRespFigure = "Manager " + this.currentJustification?.approvalResponsable?.figureArea;
                    }
                }
            }
            else {
                this.selectedRespFigure = "";
            }

            if (this.currentJustification?.approvalConsulted?.isEmail) {
                this.selectedConsFigure = "Email";
            }
            else if (this.currentJustification?.approvalConsulted?.isUser) {
                this.selectedConsFigure = "User";
                for (let person of this.allPeople) {
                    if (this.currentJustification?.approvalConsulted?.personId == person.id) {
                        this.currConsulted = person.id;
                        break;
                    }
                }
            }
            else if (this.currentJustification?.approvalConsulted?.isFigure) {
                if (this.currentJustification?.approvalConsulted?.figureRole == "Director") {
                    if (this.currentJustification?.approvalConsulted?.figureDirection == "") {
                        this.selectedConsFigure = "Director";
                    }
                    else {
                        this.selectedConsFigure = "Director " + this.currentJustification?.approvalConsulted?.figureDirection;
                    }
                }
                else if (this.currentJustification?.approvalConsulted?.figureRole == "Area Manager") {
                    if (this.currentJustification?.approvalConsulted?.figureArea == "") {
                        this.selectedConsFigure = "Area Manager";
                    }
                    else {
                        this.selectedConsFigure = "Manager " + this.currentJustification?.approvalConsulted?.figureArea;
                    }
                }
            }
            else {
                this.selectedConsFigure = "";
            }

            if (this.currentJustification?.approvalInformed?.isEmail) {
                this.selectedInfoFigure = "Email";
            }
            else if (this.currentJustification?.approvalInformed?.isUser) {
                this.selectedInfoFigure = "User";
                for (let person of this.allPeople) {
                    if (this.currentJustification?.approvalInformed?.personId == person.id) {
                        this.currInformed = person.id;
                        break;
                    }
                }
            }
            else if (this.currentJustification?.approvalInformed?.isFigure) {
                if (this.currentJustification?.approvalInformed?.figureRole == "Director") {
                    if (this.currentJustification?.approvalInformed?.figureDirection == "") {
                        this.selectedInfoFigure = "Director";
                    }
                    else {
                        this.selectedInfoFigure = "Director " + this.currentJustification?.approvalInformed?.figureDirection;
                    }
                }
                else if (this.currentJustification?.approvalInformed?.figureRole == "Area Manager") {
                    if (this.currentJustification?.approvalInformed?.figureArea == "") {
                        this.selectedInfoFigure = "Area Manager";
                    }
                    else {
                        this.selectedInfoFigure = "Manager " + this.currentJustification?.approvalInformed?.figureArea;
                    }
                }
            }
            else {
                this.selectedInfoFigure = "";
            }

        })
    // this.currentJustification = this.commonService.cloneObject(justification);
    // this.currentJustification = this.editEventData


}

async onChangeEnable(justification: CompanyJustification) {
    if (justification.enable) justification.enable = false;
    else justification.enable = true;
    await this.adminUserManagementService.updateCompanyJustification(this.currentCompany.id, justification.id, justification);

}

isEditConfirmEnabled() {
    return this.commonService.isValidField(this.currentJustification.name);
}

async onEditConfirmClick() {
    if (this.isModify) {
        let res = await this.adminUserManagementService.updateCompanyJustification(this.currentCompany.id, this.currentJustification.id, this.currentJustification);
        Swal.fire(
            '',
            this.translate.instant('Event edited successfully'),
            'success'
        )
        this.router.navigate(['/master-modules/event-types']);
    } else {
        let duplicate = this.currentCompany.peopleJustificationTypes.find(jt => jt.name.toLowerCase().trim() == this.currentJustification.name.toLowerCase().trim());
        if (duplicate) {
            // this.snackBar.open(this.translate.instant('INSIGHTS_PEOPLE_PAGE.DuplicatedJustification'), this.translate.instant('GENERAL.OK'), { duration: 3000 });
            Swal.fire(
                '',
                this.translate.instant('INSIGHTS_PEOPLE_PAGE.DuplicatedJustification'),
                'info'
            )
            return;
        }else{
            let res = await this.adminUserManagementService.addCompanyJustification(this.currentCompany.id, this.currentJustification);
            Swal.fire(
                '',
                this.translate.instant('Event added successfully'),
                'success'
            )
            this.router.navigate(['/master-modules/event-types']);
        }
    }

    // this.goBackToList();
}

getCurrentPerson(approvalType: APPROVAL_TYPE) {
  if (approvalType == APPROVAL_TYPE.RESPONSABLE) return this.currResponsable ? this.currResponsable.name + ' ' + this.currResponsable.surname : '';
  else if (approvalType == APPROVAL_TYPE.ACCOUNTABLE) return this.currAccountable ? this.currAccountable.name + ' ' + this.currAccountable.surname : '';
  else if (approvalType == APPROVAL_TYPE.CONSULTED) return this.currConsulted ? this.currConsulted.name + ' ' + this.currConsulted.surname : '';
  else if (approvalType == APPROVAL_TYPE.INFORMED) return this.currInformed ? this.currInformed.name + ' ' + this.currInformed.surname : '';
}

onPersonSelected(event,approvalType: APPROVAL_TYPE,) {

    var person: Person;
    person = this.allPeople.find(x => x.id == event.value)
  if (approvalType == APPROVAL_TYPE.RESPONSABLE) {
      this.currResponsable = person.id;
      this.currentJustification.approvalResponsable.personId = person.id;
  }
  else if (approvalType == APPROVAL_TYPE.ACCOUNTABLE) {
      this.currAccountable = person.id;
      this.currentJustification.approvalAccountable.personId = person.id;
  }
  else if (approvalType == APPROVAL_TYPE.CONSULTED) {
      this.currConsulted = person.id;
      this.currentJustification.approvalConsulted.personId = person.id;
  }
  else if (approvalType == APPROVAL_TYPE.INFORMED) {
      this.currInformed = person.id;
      this.currentJustification.approvalInformed.personId = person.id;
  }
}


justificationApprovalFormatter(justificationApproval: JustificationApproval) {
    if (justificationApproval?.isEmail) {
        return justificationApproval?.email;
    }
    else if (justificationApproval?.isUser) {
        if(this.allPeople) {
            for (let person of this.allPeople) {
                if (justificationApproval?.personId == person.id) return (person.name + ' ' + person.surname);
            }
        }
    }
    else if (justificationApproval?.isFigure) {
        if (justificationApproval?.figureRole == "Area Manager") {
            if (justificationApproval?.figureArea == "") return "Area Manager";
            else return ("Manager " + justificationApproval?.figureArea);
        }
        else if (justificationApproval?.figureRole == "Director") {
            if (justificationApproval?.figureDirection == "") return "Director";
            else return ("Director " + justificationApproval?.figureDirection);
        }
    }
}


booleanFormatter(variable: boolean) {
    if (variable) return "Y";
    else return "N";
}
numberFormatter(variable: number) {
    return ("" + variable);
}


public space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

}
