import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import * as XLSX from "ts-xlsx";
import {TranslateService} from "@ngx-translate/core";
import swal from "sweetalert2";
import {AdminUserManagementService} from "../../../../../fe-common-v2/src/lib/services/admin-user-management.service";
import {DialogData} from "../../components/recruiting/job-applications/job-applications.component";
import {MCPHelperService} from "../../service/MCPHelper.service";

@Component({
  selector: 'app-import-people-report-popup',
  templateUrl: './import-people-report-popup.component.html',
  styleUrls: ['./import-people-report-popup.component.scss']
})
export class ImportPeopleReportPopupComponent implements OnInit {
  documentInput: any;
  documentName: any;
  importPeopleForm: FormGroup;
  errorTrue: boolean = false;
  invalidFile: boolean = false;
  token: any;
  companyId: any;
  selectedInput: any;
  scope: any;
  @ViewChild('file', { static: true }) file: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ImportPeopleReportPopupComponent>,
    private _formBuilder: FormBuilder,
    public translate : TranslateService,
    private adminUserManagementService: AdminUserManagementService,
    private helper: MCPHelperService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.scope = data.scope;
    this.importPeopleForm = this._formBuilder.group({
      peopleImportFile : ['', Validators.required],
    });

    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.token = authUser.token;
      this.companyId = authUser.person.companyId;
    }
  }

  ngOnInit(): void {
  }

  closePopup(value): void {
    this.dialogRef.close({result: false});
  }

  onFileChanged(input: HTMLInputElement): void {
    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;
      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }
      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    const file = input.files[0];
    this.documentInput = file;
    if (this.documentInput.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || this.documentInput.type == 'text/csv' || this.documentInput.type == 'application/vnd.ms-excel'){
      this.errorTrue = false;
      this.invalidFile = false;
    }else {
      this.invalidFile = true;
    }
    this.documentName = `${file.name} (${formatBytes(file.size)})`;

    this.selectedInput = input;
    //this.onUploadFile(input);
    if (this.importPeopleForm.value.peopleImportFile != ''){
      this.errorTrue = false;
    }
  }

  resetCoverValue():void{
    this.errorTrue = true;
    this.invalidFile = false;
    this.documentInput = null;
    this.documentName = null;
    this.importPeopleForm = this._formBuilder.group({
      peopleImportFile : ['', Validators.required],
    });
  }

  async submitPeopleList(){
    if (this.importPeopleForm.status == "VALID" && this.errorTrue == false && this.invalidFile == false){
      this.errorTrue = false;
      await this.onUploadFile(this.selectedInput);
      if (this.importPeopleForm.value.peopleImportFile != ''){
        this.errorTrue = false;
      }
      this.dialogRef.close({result: true});
    }

    if (this.invalidFile == true){
      swal.fire(
        '',
        'Please select valid file.',
        'info'
      );
    }
  }

  async onUploadFile(input) {
    let fileChoosen = input.files[0];
    if (!fileChoosen)
      return;

    if (fileChoosen.size > (10 * 1024 * 1024)) {
      swal.fire(
        '',
        this.translate.instant('ADMIN COMPONENTS.FILE SIZE BIG'),
        'error'
      );
      //this.snackBar.open(this.translate.instant('ADMIN COMPONENTS.FILE SIZE BIG'), this.translate.instant('GENERAL.OK'), { duration: 2000 });
      return;
    }

    let file = input.files[0];
    let readed;
    let reader = new FileReader();
    var that = this;
    that.helper.toggleLoaderVisibility(true);
    reader.onload = function (e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(async function (sheetName) {
        var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        var json_object = JSON.stringify(XL_row_object);
        readed = JSON.parse(json_object);
        let res = await that.adminUserManagementService.uploadUsersList(readed, that.companyId, that.scope);
        //let reportMessage ="<ul>" + "<li>" + "<strong>" + res.importData + "</strong>" + ' Data are imported successfully' + "</li>" + "<li>"+ "<strong>" + res.usersNotFound + "</strong>" + ' Data are not imported' + "</li>" + "</ul>"
        let reportMessage ="<table>" + "<tr>" +  "<td style='color: green'>" +"<strong>" + res.importData + "</strong>" + "</td>" + "<td style='color: green'>" + that.translate.instant('Records are imported successfully.')  + "</td>" + "</tr>" +  "<tr>" +  "<td style='color: #ff0000'>" +"<strong>" + res.usersNotFound + "</strong>" + "</td>" + "<td style='color: red'>" + that.translate.instant('Records are failed to import.') + "</td>" + "</tr>" + "</table>"
        if (res.result){
          that.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            that.translate.instant('ADMIN COMPONENTS.DATA IMPORT COMPLETE') + reportMessage,
            'success'
          );
        }else {
          that.helper.toggleLoaderVisibility(false);
          swal.fire(
            '',
            that.translate.instant('ADMIN COMPONENTS.DATA IMPORT ERROR'),
            'error'
          );
        }

        //that.snackBar.open(that.translate.instant('ADMIN COMPONENTS.DATA IMPORT COMPLETE'), 'OK', {duration: 5000,panelClass: 'success'});
        /*let message = "<strong>" + res.usersFound.length + "</strong>" + " " + that.translate.instant('ADMIN COMPONENTS.USERS UPDATED') + "<br />" +
          "<strong>" + res.usersNotFound.length + "</strong>" + " " + that.translate.instant('ADMIN COMPONENTS.USERS NOT UPDATED') + "<br />";

        for (let user of res.usersNotFound) {
          if (user.CF != '') {
            message = message + "<strong>" + user.CF + "</strong>" + " " + that.translate.instant('ADMIN COMPONENTS.NOT FOUND') + "<br />";
          }else {
            message = message + "<strong>" + user.Nome + " " + user.Cognome + "</strong>" + " " + that.translate.instant('ADMIN COMPONENTS.NOT FOUND') + "<br />";
          }
        }*/

        // swal.fire(
        //   'Success!',
        //   that.translate.instant('ADMIN COMPONENTS.DETAILS'),
        //   'info'
        // );

        //that.notifyManagementService.openMessageDialog(that.translate.instant('ADMIN COMPONENTS.DETAILS'), message);
        //await that.loadUserList();
      })
    };

    reader.onerror = function (ex) {
      console.log(ex);
      swal.fire(
        '',
        that.translate.instant('ADMIN COMPONENTS.DATA IMPORT ERROR'),
          'info'
        );
      //that.notifyManagementService.displaySuccessSnackBar(that.translate.instant('ADMIN COMPONENTS.DATA IMPORT ERROR'));
    };
    reader.readAsBinaryString(file);
  }

  validationShow(){
    if(this.documentInput == null && this.documentName == null ){
      this.errorTrue = true;
    }
  }
}
