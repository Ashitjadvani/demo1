import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {MCPHelperService} from "../../../../service/MCPHelper.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProfileSettingsService} from "../../../../../../../fe-common-v2/src/lib/services/profile-settings.service";
import swal from "sweetalert2";
import {SelectionModel} from '@angular/cdk/collections';
import {Subject} from "rxjs";

@Component({
  selector: 'app-native-languages',
  templateUrl: './native-languages.component.html',
  styleUrls: ['./native-languages.component.scss']
})
export class NativeLanguagesComponent implements OnInit, AfterViewInit {
  // selection = new SelectionModel<nativeLanguagesList>(true, []);
  languageList = new Subject<any>();

  nativeLanguagesForm: FormGroup;
  documentData: any;
  document: any;
  nativeLanguagesList: any;
  checkedList: any[] = [];
  saveNative: any[] = [];
  companyId: any;
  checkboxvalue: boolean = false;
  userLanguageSelect: string;
  count: any;
  checkedSelected : any;

  constructor(private _formBuilder: FormBuilder,
              private helper: MCPHelperService,
              public translate: TranslateService,
              private router: Router,
              public route: ActivatedRoute,
              private ApiService: ProfileSettingsService) {
    this.nativeLanguagesForm = this._formBuilder.group({
      checked: [''],
      nativeLanguageArray:this._formBuilder.array([])
    });

    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }


  }

  languages = ['English','Spanish','Italian','French'];

  ngOnInit(): void {
    this.getLangList();
  }
  ngAfterViewInit(){

  }
  getLangList(){
    this.ApiService.getCompany({}).subscribe((res: any ) => {
      this.nativeLanguagesList = res.company.nativeLanguages;
      this.checkedList = [];
      for (var i = 0; i < this.nativeLanguagesList.length; i++) {
        if (this.nativeLanguagesList[i].checked == true) {
          this.checkedList.push(this.nativeLanguagesList[i]);
        }
      }
      if(this.checkedList.length == this.nativeLanguagesList.length){
        this.checkboxvalue = true;
      }else{
        this.checkboxvalue = false;
      }

    });
  }
  async changeNativeLanguages(){
    if (this.nativeLanguagesForm.valid) {
      this.helper.toggleLoaderVisibility(true);
      this.documentData = new FormData();
      this.checkedSelected = this.nativeLanguagesList.filter(opt => opt.checked).map(opt => true)
      if (this.checkedSelected.length == 0){
        this.helper.toggleLoaderVisibility(false);
        swal.fire(
          '',
          this.translate.instant('Please select atleast one language'),
          'info'
        );
      }else {
        this.helper.toggleLoaderVisibility(true);
        const res: any = await this.ApiService.setNative({id: this.companyId,nativeLanguages: this.nativeLanguagesList});
        if (res) {
          this.helper.languageList.next(this.nativeLanguagesList);
          this.getLangList();
          // this.helper.userLanguageSelect.next('it');
          this.helper.toggleLoaderVisibility(false);
          swal.fire('',
            this.translate.instant('Swal_Message.Native language has been updated successfully'),
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
  }

  toggleAllSelection(checkboxvalue: any){
    for (var i = 0; i < this.nativeLanguagesList.length; i++) {
      this.nativeLanguagesList[i].checked = checkboxvalue.checked;
      if (checkboxvalue.checked){
        this.checkboxvalue = true;
      }else {
        this.checkboxvalue = false;
      }
    }
  }

  checkbox(index: any, event: any){
    // for (var i = 0; i < this.nativeLanguagesList.length; i++) {
      this.nativeLanguagesList[index].checked = event.checked;
    // }
    this.checkedSelected = this.nativeLanguagesList.filter(opt => opt.checked).map(opt => false)
    if (this.checkedSelected.length > 0){
      this.checkboxvalue = false;
    }
    if (this.checkedSelected.length == 4){
      this.checkboxvalue = true;
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.nativeLanguagesList, event.previousIndex, event.currentIndex);
    for (let i = 0; i < this.nativeLanguagesList.length; i++ ){
      this.nativeLanguagesList[i].order = i;
      this.nativeLanguagesList[i].checked;
    }
    for (let i = 0; i < this.nativeLanguagesList.length.checked; i++ ){
      this.nativeLanguagesList[i].value.checked;
    }
  }

}
