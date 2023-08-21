import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { tagsName } from '../../people/add-user/add-user.component';
import { AdminUserManagementService } from '../../../../../../fe-common-v2/src/lib/services/admin-user-management.service';
import { UserManagementService } from '../../../../../../fe-common-v2/src/lib/services/user-management.service';
import { MatTableDataSource } from '@angular/material/table/table-data-source';
import { PersonProfileGroup } from 'projects/fe-common-v2/src/lib/models/person-profile-group';
import { Person } from '../../../../../../fe-common-v2/src/lib/models/person';
import { MCPHelperService } from '../../../service/MCPHelper.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-add-edit-group',
  templateUrl: './add-edit-group.component.html',
  styleUrls: ['./add-edit-group.component.scss'],
})
export class AddEditGroupComponent implements OnInit {
  @Input() currentGroup: PersonProfileGroup = PersonProfileGroup.Empty();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public Tags: tagsName[] = [];
  companyId: any = '';
  noRecordFound = false;

  generalInformationForm: FormGroup;
  contactInformationForm: FormGroup;
  domainConfigurationForm: FormGroup;

  id: any;
  responseId: any;
  page = 1;
  itemsPerPage = '5';
  totalItems = 0;
  search: string = '';
  sortKey = 1;
  sortBy = '';
  sortClass = 'down';
  currentFilter: string;
  functionFilter: string;
  peopleFullList: Person[];
  people: Person[];
  functionList = [];
  peopleFullListNew = [];
  functionFullList = [];
  functionFullListNew = [];
  searchText = '';
  searchFunction = '';
  clearSearchText: boolean = false;
  clearFunctionText: boolean = false;

  showSelectedOnly: boolean;
  showSelectedOnlyToggle: boolean;
  peopleSelectedOnly: boolean = false;
  RFQDisplayedColumns: string[] = ['name', 'surname', 'role'];
  //dataSource = new MatTableDataSource(this.peopleFullList);

  constructor(
    private _formBuilder: FormBuilder,
    private adminUserManagementService: AdminUserManagementService,
    private userManagementService: UserManagementService,
    private router: Router,
    private activitedRoute: ActivatedRoute,
    private helper: MCPHelperService,
    private translate : TranslateService
  ) {
    this.companyId = this.userManagementService.getAccount().companyId;
    this.generalInformationForm = this._formBuilder.group({
      name: ['', [Validators.required, MCPHelperService.noWhitespaceValidator]],
      description: [''],
      companyId: this.companyId,
    });
  }

  async ngOnInit() {
    this.helper.toggleLoaderVisibility(true);
    let peopleList = await this.adminUserManagementService.getPeopleList(
      this.companyId
    );
    this.peopleFullList = peopleList.people;
    this.peopleFullListNew = this.peopleFullList;
    let companyFunctionList =
      await this.adminUserManagementService.getCompanyFunctionsByGroups();
    this.functionFullList = companyFunctionList.functions;
    this.functionFullListNew = this.functionFullList;
    this.functionList = this.functionFullList;
    this.buildPeopleList();
    //this.createFunctionList();
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    if(this.id){
      this.loadData();
      this.helper.toggleLoaderVisibility(false);
    }
    this.helper.toggleLoaderVisibility(false);
  }

  onSubmit(step : number): void {

    if(step == 1){
      if (this.generalInformationForm.valid) {
        this.currentGroup.name = this.generalInformationForm.value.name
        this.currentGroup.description = this.generalInformationForm.value.description
        this.currentGroup.companyId = this.companyId
        if(this.id){
          this.currentGroup.id = this.id;
          this.adminUserManagementService.updatePeopleGroup(this.currentGroup).then(() =>{
              this.responseId = this.id;
          } )
        }
        else{
          this.adminUserManagementService.addPeopleGroup(this.generalInformationForm.value).then((res) =>{
            let response  = JSON.parse(JSON.stringify(res))
            this.responseId = response.group.id;
          } )
        }
      }
    }
    if(step == 2){
      if(this.id){
        this.currentGroup.id = this.id
      }else{
        this.currentGroup.id = this.responseId
      }
      this.adminUserManagementService.updatePeopleGroup(this.currentGroup);
    }
    if(step == 3){
      if(this.id){
        this.currentGroup.id = this.id
      }else{
        this.currentGroup.id = this.responseId
      }
      this.adminUserManagementService.updatePeopleGroup(this.currentGroup).then((res) =>{
        let response  = JSON.parse(JSON.stringify(res))
        if(response.result){
          Swal.fire(
            '',
            this.id ? this.translate.instant("People Group edited successfully") : this.translate.instant("People Group added successfully"),
            'success')
        }
        else{
          Swal.fire( '', 'Error', 'error')
        }
        this.router.navigate(['/people-groups']);

      }
      );
    }
  }

  buildPeopleList() {
    let filteredPeople = [];
    if (this.currentFilter) {
      filteredPeople = this.peopleFullList.filter((data) => {
        return JSON.stringify(data)
          .toLocaleLowerCase()
          .includes(this.currentFilter.toLocaleLowerCase());
      });
    } else {
      filteredPeople = this.peopleFullList;
    }

    this.people = filteredPeople.filter((p) =>
      this.showSelectedOnly ? this.currentGroup.persons.includes(p.id) : true
    );
  }

  createFunctionList() {
    let filterFunction = [];
    if (this.functionFilter) {
      filterFunction = this.functionFullList.filter((data) => {
        if(JSON.stringify(data.name).toLocaleLowerCase().includes(this.functionFilter.toLocaleLowerCase())) {
          return true;
        }
        else {
          for(let func of data.functions) {
            if(JSON.stringify(func.name).toLocaleLowerCase().includes(this.functionFilter.toLocaleLowerCase())) {
              return true;
            }
          }
        }
        return false;
      });
    } else {
      filterFunction = this.functionFullList;
    }
    this.functionList = filterFunction.filter((p) =>
      this.showSelectedOnlyToggle
        ? this.currentGroup.functions.includes(p.value)
        : true
    );
  }

  applyFilter(filterValue: string) {
    if (this.search && this.search.length > 0) {
      this.currentFilter = filterValue;
      this.noRecordFound = false;
      this.clearSearchText = true;
    } else {
      this.noRecordFound = true;
      this.currentFilter = '';
      this.clearSearchText = false;
    }
    this.buildPeopleList();
  }

  resetSearch() {
    this.search = '';
    this.currentFilter = '';
    this.clearSearchText = false;
    this.peopleFullListNew = this.peopleFullList;
    this.buildPeopleList();
  }
  onChangeShowSelected($event) {
    // console.log('$event>>>>>>>>>>>>>>>>>>>>>>>', $event.checked);
    // this.peopleSelectedOnly = $event.checked;
    this.buildPeopleList();
  }
  onPersonSelected(person: Person) {
    if (this.currentGroup.persons.includes(person.id))
      this.currentGroup.persons = this.currentGroup.persons.filter(
        (p) => p != person.id
      );
    else {
      this.currentGroup.persons.push(person.id);
    }
    this.buildPeopleList();
  }
  isPersonSelected(person: Person) {
    return this.currentGroup.persons.includes(person.id);
  }

  searchFunctionTxt(searchFunction: any) {
    if (this.searchFunction && this.searchFunction.length > 0) {
      this.functionFilter = searchFunction;
      this.clearFunctionText = true;
    } else {
      this.functionFilter = '';
      this.clearFunctionText = false;
    }
    this.createFunctionList();
  }
  
  resetFunction() {
    this.searchFunction = '';
    this.functionFilter = '';
    this.clearFunctionText = false;
    this.functionFullListNew = this.functionFullList;
    this.createFunctionList();
  }

  isFunctionSelected(func: any) {
    return this.currentGroup.functions.includes(func.value);
  }
  onFunctionSelected(func: any) {
    if(!func.functions) {
      if (this.currentGroup.functions.includes(func.value)) {
        this.currentGroup.functions = this.currentGroup.functions.filter(
          (p) => p != func.value
        );
      } else {
        this.currentGroup.functions.push(func.value);
      }
    }
    else {
      if (this.currentGroup.functions.includes(func.value)) {
        this.currentGroup.functions = this.currentGroup.functions.filter(
          (p) => p != func.value
        );
        for(let subf of func.functions) {
          this.currentGroup.functions = this.currentGroup.functions.filter(
            (p) => p != subf.value
          );
        }
      } else {
        this.currentGroup.functions.push(func.value);
      }
    }
    this.createFunctionList();
  }
  onChangeShowSelectedFunction($event) {
    this.createFunctionList();
  }

  checkAll(event: any){
    if(event.checked){
      for(var i = 0; i < this.people.length; i ++){
        this.currentGroup.persons.push(this.people[i].id)
      }
    }else{
        this.currentGroup.persons = []
    }

  }
  loadData(){
    this.helper.toggleLoaderVisibility(true);
    this.adminUserManagementService.getPeopleGroupForEdit(this.id).then((res) =>{
      let response  = JSON.parse(JSON.stringify(res))
      this.helper.toggleLoaderVisibility(false);
      this.currentGroup = response.personData;
      this.generalInformationForm.patchValue({
        name: this.currentGroup.name,
        description: this.currentGroup.description
      })
    })
  }

  // searchFunctionTxt(searchFunction : any){
  //   if (searchFunction && (searchFunction.length > 2)){
  //     this.functionFilter = searchFunction;
  //   }else{
  //     this.functionFilter = null;
  //   }
  //   if (searchFunction && (searchFunction.length > 0)){
  //     this.clearFunctionText = true
  //   }else {
  //     this.clearFunctionText = false
  //   }
  //   this.createFunctionList();
  // }
}
