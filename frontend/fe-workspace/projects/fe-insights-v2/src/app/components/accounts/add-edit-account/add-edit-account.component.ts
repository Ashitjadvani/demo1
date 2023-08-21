import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../../../../fe-common-v2/src/lib/services/account.service';
import { Person } from '../../../../../../fe-common-v2/src/lib/models/person';
import { Observable } from 'rxjs';
import { UserManagementService } from '../../../../../../fe-common-v2/src/lib/services/user-management.service';
import { CommonService } from '../../../../../../fe-common-v2/src/lib/services/common.service';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import { map, startWith } from 'rxjs/operators';
import { UserAccount } from '../../../../../../fe-common-v2/src/lib/models/user-account';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import {AUTH_PROVIDER} from "../../../../../../fe-common/src/lib/models/user-account";
import { MCPHelperService } from '../../../service/MCPHelper.service';

@Component({
  selector: 'app-add-edit-account',
  templateUrl: './add-edit-account.component.html',
  styleUrls: ['./add-edit-account.component.scss'],
})
export class AddEditAccountComponent implements OnInit {
  addAccountForm: FormGroup;
  title = 'Add';
  hide = true;
  hide1 = true;
  public files: any;
  documentData: any;
  document: any;
  documentName: any;
  editMode = 'Add';
  password = '';
  confirmPassword = '';
  accounts: UserAccount[];
  peopleFC: FormControl = new FormControl();
  allPeople: Person[];
  selectedPerson: Person;
  people: Observable<Person[]>;
  userAccount: Person;
  filterCallback: Function;
  id:any;
  selectedIDPerson:any;
  passwordValidValue: any = '1_hour';
  selectedPrevPassword: any = 1;
  isDisable: boolean = false;
  showPreviousDuration: boolean = false;
  editing = false;
  public requestPara = {
    search: '',
    page: 1,
    limit: 10,
    sortBy: '',
    sortKey: '',
  };

  authenticationMethod = [
    { value: 'local', viewValue: 'Local' },
    { value: 'azure', viewValue: 'Azure' },
    { value: 'ad', viewValue: 'Active Directory' },
  ];
  /*authenticationMethod = [
    { provider: AUTH_PROVIDER.LOCAL, name: 'Local', need_password: true },
    { provider: AUTH_PROVIDER.AZURE, name: 'Azure', need_password: false },
    { provider: AUTH_PROVIDER.ACTIVE_DIRECTORY, name: 'Active Directory', need_password: false }
  ];*/
/*  passwordValidity = [
    { value: '8 Hour', viewValue: '8 Hour' },
    { value: '1 Day', viewValue: '1 Day' },
    { value: '30 Days', viewValue: '30 Days' },
    { value: '60 Days', viewValue: '60 Days' },
    { value: '120 Days', viewValue: '120 Days' },
    { value: 'Never Expired', viewValue: 'Never Expired' },
  ];*/
  passwordValidity = [
    {type: 'hour', name: '1 hour', value: 1, id: '1_hour'},
    {type: 'hour', name: '8 hour', value: 8, id: '8_hour'},
    {type: 'day', name: '1 day', value: 1, id: '1_day' },
    {type: 'day', name: '30 days', value: 30, id: '30_day' },
    {type: 'day', name: '60 days', value: 60, id: '60_day' },
    {type: 'day', name: '120 days', value: 120, id: '120_day' },
    {type: 'day', name: '160 days', value: 160, id: '160_day' },
    {type: 'day', name: '200 days', value: 200, id: '200_day' },
    {type: 'day', name: '260 days', value: 260, id: '260_day' },
    {type: 'day', name: '360 days', value: 360, id: '360_day' },
    {type: 'never', name: 'Never Expired', value: 360, id: 'never_expired' }
  ];

  // passwordValidMinMax: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
  passwordMinMaxList = [
    { value: 1, viewValue: 1 },
    { value: 2, viewValue: 2 },
    { value: 3, viewValue: 3 },
    { value: 4, viewValue: 4 },
    { value: 5, viewValue: 5 },
    { value: 6, viewValue: 6 },
    { value: 7, viewValue: 7 },
    { value: 8, viewValue: 8 },
    { value: 9, viewValue: 9 },
    { value: 10, viewValue: 10 },
    { value: 11, viewValue: 11 },
    { value: 12, viewValue: 12 },
    { value: 13, viewValue: 13 },
    { value: 14, viewValue: 14 },
    { value: 15, viewValue: 15 },
    { value: 16, viewValue: 16 },
    { value: 17, viewValue: 17 },
    { value: 18, viewValue: 18 },
    { value: 19, viewValue: 19 },
    { value: 20, viewValue: 20 },
  ];

/*  passwordPatternList = [
    { value: 'At least one upper case', viewValue: 'At least one upper case' },
    { value: 'At least one lower case', viewValue: 'At least one lower case' },
    { value: 'At least one digit', viewValue: 'At least one digit' },
    {
      value: 'At least one special character',
      viewValue: 'At least one special character',
    },
    {
      value: 'At least one letter, one number and one special character',
      viewValue: 'At least one letter, one number and one special character',
    },
    {
      value: 'At least one upper case letter, one lower case letter',
      viewValue: 'At least one upper case letter, one lower case letter',
    },
  ];*/

  passwordPatternList: any = [
    {name: 'At least one upper case', value: 1},
    {name: 'At least one lower case', value: 2},
    {name: 'At least one digit', value: 3},
    {name: 'At least one special character', value: 4},
    {name: 'At least one letter, one number and one special character', value: 5},
    {name: 'At least one uppercase letter, one lowercase letter and one number', value: 6},
    {name: 'At least one uppercase letter, one lowercase letter, one number and one special character', value: 7}
  ];
/*  allowedPreviousPassword = [
    { value: 1, viewValue: 'GENERAL.Yes' },
    { value: 2, viewValue: 'GENERAL.No' },
  ];*/
  allowedPreviousPassword: any = [
    {viewValue: 'GENERAL.Yes', value: 1},
    {viewValue: 'GENERAL.No', value: 0}
  ];

  passwordDuration: any = [
    {name: '1 Month', value: 1},
    {name: '2 Month', value: 2},
    {name: '3 Month', value: 3},
    {name: '4 Month', value: 4},
    {name: '5 Month', value: 5},
    {name: '6 Month', value: 6},
    {name: '7 Month', value: 7},
    {name: '8 Month', value: 8},
    {name: '9 Month', value: 9},
    {name: '10 Month', value: 10},
    {name: '11 Month', value: 11},
    {name: '12 Month', value: 12},
  ];

  constructor(
    public _formBuilder: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private ApiService: AccountService,
    private userManagementService: UserManagementService,
    private commonService: CommonService,
    private adminUserManagementService: AdminUserManagementService,
    private snackBar: MatSnackBar,
    public translate: TranslateService
  ) {
     const id = this.route.snapshot.paramMap.get('id');
     if(id !== '0'){
      this.editing = true;
       this.title = "Edit"
        this.ApiService.editAccount({id:id}).subscribe((res: any) => {
          this.documentData = res.accountData;
          if(res){
            this.addAccountForm.patchValue({
              peopleFC: this.documentData.personId,
              userId: this.documentData.userId,
              authProvider: this.documentData.authProvider,
              passwordDuration: this.documentData.passwordDuration,
              passwordValid: this.documentData.passwordValid,
              passwordMin: this.documentData.passwordMin,
              passwordMax: this.documentData.passwordMax,
              passwordPattern: Number(this.documentData.passwordPattern),
              allowedPreviousPassword: this.documentData.allowedPreviousPassword,
            });
            this.selectedIDPerson = this.documentData.personId;
            this.authenticationChange(this.documentData.authProvider);
            this.durationPrevPassChange(this.documentData.allowedPreviousPassword)
          }
        });
     }

    this.filterCallback = this.filterAccount.bind(this);
    this.addAccountForm = this._formBuilder.group(
      {
        id:[],
        companyId: [],
        selectedPerson:[],
        personId: [''],
        peopleFC: ['', [Validators.required]],
        userId: ['', [Validators.required,MCPHelperService.noWhitespaceValidator]],
        authProvider: ['', [Validators.required]],
        password: [''],
        confirmPassword: [''],
        passwordValid: [''],
        passwordDuration: [''],
        passwordMin: [''],
        passwordMax: [''],
        passwordPattern: [''],
        allowedPreviousPassword: [''],
      },
      {validator: this.ConfirmedValidator('password', 'confirmPassword')},
    );

  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  async ngOnInit() {
    this.userAccount = this.userManagementService.getAccount();
    let res = null;
    if(this.editing) {
      res = await this.adminUserManagementService.getPeopleList(
        this.userAccount.companyId
      );
    }
    else {
      res = await this.adminUserManagementService.getPeopleWaitingAccountList(
        this.userAccount.companyId
      );      
    }
    if (this.commonService.isValidResponse(res)) {
      this.allPeople = res.people;
      this.people = this.peopleFC.valueChanges.pipe(
        startWith(''),
        map((p) => this.filterUsers(p))
      );
    }
    this.loadAccountList();
    this.selectedPerson = this.allPeople.find(p => p.id == this.selectedIDPerson);

  }

  authenticationChange(value):void {
    if (value == 'local'){
      this.isDisable =  false;
      this.addAccountForm.controls['password'].setValidators([Validators.required]);
      this.addAccountForm.controls['password'].updateValueAndValidity();
      this.addAccountForm.controls['confirmPassword'].setValidators([Validators.required]);
      this.addAccountForm.controls['confirmPassword'].updateValueAndValidity();
    }else {
      this.isDisable =  true;
      this.password = '';
      this.confirmPassword = '';
      this.addAccountForm.controls['password'].value == null;
      this.addAccountForm.controls['password'].clearValidators();
      this.addAccountForm.controls['password'].updateValueAndValidity();
      this.addAccountForm.controls['confirmPassword'].value == null;
      this.addAccountForm.controls['confirmPassword'].clearValidators();
      this.addAccountForm.controls['confirmPassword'].updateValueAndValidity();
    }
  }

  durationPrevPassChange(value):void{
    if (value == '0'){
      this.showPreviousDuration =  true
    }else {
      this.showPreviousDuration =  false
    }
  }

  filterUsers(value: string): any {
    return this.allPeople.filter((p) => Person.filterMatch(p, value));
  }
  displaySelectedUser(person: Person) {
      return person ? person.name + ' ' + person.surname : '';
  }

  filterAccount(filterValue: string, data: any) {
    return UserAccount.filterMatch(data, filterValue);
  }

  async loadAccountList() {
    const userAccount = this.userManagementService.getAccount();
    let res = await this.adminUserManagementService.getAccounts(
      userAccount.companyId,
      {}
    );
    if (this.commonService.isValidResponse(res)) {
      this.accounts = res.accounts;
    } else {
      // this.snackBar.open(
      //   this.translate.instant('ADMIN COMPONENTS.ERROR USERS'),
      //   this.translate.instant('GENERAL.OK'),
      //   {
      //     duration: 3000,
      //   }
      // );
    }
  }
  changeQuestion() {}

  addAccount(): any {
    const id = this.route.snapshot.paramMap.get('id');
    if(id === '0' ) {
      this.documentData = new FormData();
      const getInputsValues = this.addAccountForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(
          key,
          getInputsValues[key] ? getInputsValues[key] : ''
        );
      }
      this.documentData.append('document', this.document);
      let formsubmitdata;
      formsubmitdata = {
        companyId: this.userAccount.companyId,
        allowedPreviousPassword: this.addAccountForm.value.allowedPreviousPassword,
        authProvider: this.addAccountForm.value.authProvider,
        // confirmPassword: this.addAccountForm.value.confirmPassword,
        password: this.addAccountForm.value.password,
        passwordDuration: this.addAccountForm.value.passwordDuration,
        passwordMax: this.addAccountForm.value.passwordMax,
        passwordMin: this.addAccountForm.value.passwordMin,
        passwordPattern: this.addAccountForm.value.passwordPattern,
        passwordValid: this.addAccountForm.value.passwordValid,
        personId: this.selectedPerson.id,
        userId: this.addAccountForm.value.userId,
      };
      if ( this.addAccountForm.controls['password'].valid &&  this.addAccountForm.controls['confirmPassword'].valid){
        this.ApiService.addAccount(formsubmitdata).subscribe((data: any) => {
          if (data.result) {
            this.router.navigate(['/accounts']);
            swal.fire(
              '',
              this.translate.instant('Account added successfully'),
              'success'
            );
          } else {
            swal.fire(
              '',
              this.translate.instant(data.reason),
              'info'
            );
          }
        },
        (err) => {
          swal.fire(
            '',
            this.translate.instant(err.error.message),
            'info'
          );
        }
      );
    }
  }else{
    if(this.title !== 'Add'){
      this.addAccountForm.get('password').setValidators([Validators.required]);
      this.addAccountForm.get('confirmPassword').setValidators([Validators.required]);
    }
    if(this.addAccountForm.valid){
      this.documentData = new FormData();
      const getInputsValues = this.addAccountForm.value;
      for (const key in getInputsValues) {
        this.documentData.append(
          key,
          getInputsValues[key] ? getInputsValues[key] : ''
        );
      }
      this.documentData.append('document', this.document);
      let formsubmitdata;
      formsubmitdata = {
        id: id,
        companyId: this.userAccount.companyId,
        allowedPreviousPassword: this.addAccountForm.value.allowedPreviousPassword,
        authProvider: this.addAccountForm.value.authProvider,
        // confirmPassword: this.addAccountForm.value.confirmPassword,
        password: this.addAccountForm.value.password,
        passwordDuration: this.addAccountForm.value.passwordDuration,
        passwordMax: this.addAccountForm.value.passwordMax,
        passwordMin: this.addAccountForm.value.passwordMin,
        passwordPattern: this.addAccountForm.value.passwordPattern,
        passwordValid: this.addAccountForm.value.passwordValid,
        personId: this.selectedPerson.id,
        userId: this.addAccountForm.value.userId,
      };
      this.ApiService.updateAccount(formsubmitdata).subscribe(
        (data: any) => {
          if (data.result) {
            this.router.navigate(['/accounts']);
            swal.fire(
              '',
              this.translate.instant('Account edited successfully'),
              'success'
            );
          } else {
            swal.fire(
              '',
              this.translate.instant(data.reason),
              'info'
            );
          }
        },
        (err) => {
          swal.fire(
            '',
            this.translate.instant(err.error.message),
            'info'
          );
        }
      );
    }

    }
    }
  // getAccount(): Person {
  //   return this.userCredentials ? this.userCredentials.person : null;
  // }
}
