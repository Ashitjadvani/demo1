import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminUserManagementService } from 'projects/fe-common-v2/src/lib/services/admin-user-management.service';
import swal from "sweetalert2";
import * as XLSX from "ts-xlsx";
import {TranslateService} from "@ngx-translate/core";
import {MCPHelperService} from "../../service/MCPHelper.service";

@Component({
  selector: 'app-import-account',
  templateUrl: './import-account.component.html',
  styleUrls: ['./import-account.component.scss']
})
export class ImportAccountComponent implements OnInit {
  importAccountForm:FormGroup;
  documentInput : any;
  documentName : any;
  isSafetyUsers:boolean;
  errorTrue: boolean = false;
  invalidFile: boolean = false;
  selectedInput: any;
  companyId: any;

  constructor(
    private importAccount:FormBuilder,
    private adminUserManagementService: AdminUserManagementService,
    public dialogRef: MatDialogRef<ImportAccountComponent>,
    public translate : TranslateService,
    private helper: MCPHelperService,
  ) {
    this.importAccountForm = this.importAccount.group({
      accountImportFile : ['', Validators.required],
    });

    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      const authUser: any = JSON.parse(credentials);
      this.companyId = authUser.person.companyId;
    }
  }

  ngOnInit(): void {
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
    // @ts-ignore
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
    if (this.importAccountForm.value.peopleImportFile != ''){
      this.errorTrue = false;
    }
  }

  resetCoverValue(){
    this.errorTrue = true;
    this.invalidFile = false;
    this.documentInput = null;
    this.documentName = null;
    this.importAccountForm = this.importAccount.group({
      accountImportFile : ['', Validators.required],
    });
  }
  onNoClick(): void{
    this.dialogRef.close({result: false});
  }

  async submitAccountList(){
    if (this.importAccountForm.status == "VALID" && this.errorTrue == false && this.invalidFile == false){
      this.errorTrue = false;
      await this.onUploadFile(this.selectedInput);
      if (this.importAccountForm.value.accountImportFile != ''){
        this.errorTrue = false;
      }
      this.dialogRef.close({result: true});
    }else {
      this.errorTrue = true
    }

    let file = this.documentInput;
    //await this.adminUserManagementService.uploadUsers(file, this.isSafetyUsers);
    // await this.loadAccountList();

    if (this.invalidFile == true){
      swal.fire(
        'Info!',
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
        'Sorry!',
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
        let res = await that.adminUserManagementService.uploadUsers(readed, that.companyId);
        //let reportMessage ="<ul>" + "<li>" + "<strong>" + res.importData + "</strong>" + ' Data are imported successfully' + "</li>" + "<li>"+ "<strong>" + res.usersNotFound + "</strong>" + ' Data are not imported' + "</li>" + "</ul>"
        let reportMessage ="<table>" + "<tr>" +  "<td style='color: green'>" +"<strong>" + res.importData + "</strong>" + "</td>" + "<td style='color: green'>" + that.translate.instant('Records are imported successfully.') + "</td>" + "</tr>" +  "<tr>" +  "<td style='color: red'>" +"<strong>" + res.usersNotFound + "</strong>" + "</td>" + "<td style='color: red'>" + that.translate.instant('Records are failed to import.') + "</td>" + "</tr>" + "</table>"
        if (res.result){
          that.helper.toggleLoaderVisibility(false);
          swal.fire(
            'Success!',
            that.translate.instant('ADMIN COMPONENTS.DATA IMPORT COMPLETE') + reportMessage,
            'success'
          );
        }else {
          that.helper.toggleLoaderVisibility(false);
          swal.fire(
            'Error!',
            that.translate.instant('ADMIN COMPONENTS.DATA IMPORT ERROR'),
            'error'
          );
        }
      })
    };

    reader.onerror = function (ex) {
        console.log(ex);
      swal.fire(
        'Error!',
        that.translate.instant('ADMIN COMPONENTS.DATA IMPORT ERROR'),
        'info'
      );
      //that.notifyManagementService.displaySuccessSnackBar(that.translate.instant('ADMIN COMPONENTS.DATA IMPORT ERROR'));
    };
    reader.readAsBinaryString(file);
  }

}
