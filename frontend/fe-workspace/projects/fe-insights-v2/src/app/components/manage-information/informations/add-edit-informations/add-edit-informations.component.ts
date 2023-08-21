import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { CategoryDocument } from '../../../../../../../fe-common-v2/src/lib/models/admin/information-category-document';
import { FileLanguage, InformationDocument, TitleLanguage } from '../../../../../../../fe-common-v2/src/lib/models/admin/information-document';
import { InfoManagementService } from '../../../../../../../fe-common-v2/src/lib/services/info-management.service';
import { MCPHelperService } from '../../../../service/MCPHelper.service';
import {CareerHelperService} from "../../../../../../../fe-career/src/app/service/careerHelper.service";

@Component({
  selector: 'app-add-edit-informations',
  templateUrl: './add-edit-informations.component.html',
  styleUrls: ['./add-edit-informations.component.scss']
})
export class AddEditInformationsComponent implements OnInit {

  addCategoryForm:FormGroup;
  title ='Add';
  documentInput: any;
  documentName: any;
  documentInput2: any;
  documentName2: any;
  documentName3: any;
  fileToUpload: any;
  fileToUpload2: any;
  realtimeTitle: any;
  submitted: boolean = false;

  backgroundColor:any;
  iconColor:any;
  iconsList : string[];

  selectedImage: string;
  titles: TitleLanguage[] = new Array();
  currentIcon: string;
  selectedImageName: string;
  safeSvg: any;
  id: any;
  currentInfo: InformationDocument = InformationDocument.Empty();
  iconUploadedVal: string;
  attachmentIcon: any;
  @ViewChild('icon', { static: false }) iconFile: ElementRef;
  @ViewChild('file', { static: false }) file: ElementRef;
  safeSvgUploaded: any;
  iconUploaded = false;
  categoriesTableData: CategoryDocument[];
  emptyCategory: CategoryDocument = CategoryDocument.Empty();
  infoFiles: FileLanguage[] = new Array();
  attachmentFiles: File[] = new Array();
  attachmentFileName: string;
  language: string;


  constructor(public _categoriesForm:FormBuilder,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private infoManagementService: InfoManagementService,
    private router: Router,
    private translate: TranslateService,
    private activitedRoute: ActivatedRoute,
    private helper : MCPHelperService) {
    this.addCategoryForm = this._categoriesForm.group({
      informationEnglish : [null, [Validators.required, MCPHelperService.noWhitespaceValidator]],
      informationItalian : [null, [Validators.required, MCPHelperService.noWhitespaceValidator]],
      categoryEnglish : [null, [Validators.required]],
      backgroundColor: [''],
      iconColor: [''],
      textColor: [''],
      isPublic: [''],
    })
  }

  async ngOnInit(){
      this.language = CareerHelperService.getLanguageName();
    this.loadCategories();
    this.iconsList = [
      'information-icon.svg',
      'attach-icon.svg',
      'audio-icon.svg',
      'image-icon.svg',
      'pdf-file-icon.svg',
      'video-icon.svg',
    ]
    this.selectedImage = this.iconsList[0];
    this.selectedImageName = 'information-icon.svg';
    this.titles.push(new TitleLanguage("en",""));
    this.titles.push(new TitleLanguage("it",""));
    this.infoFiles.push(new FileLanguage("en",""));
    this.infoFiles.push(new FileLanguage("it",""));
    this.iconColor = '#000000',
    this.httpClient.get('./assets/images/information-icon.svg', { responseType: 'text' })
        .subscribe(data => {
            this.currentIcon=data;
            this.changeSvgSize();
            this.changeSvgFill();
        });
    // this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    if(this.id){
      this.fetchData();
      this.title = 'Edit'
    }
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
    this.fileToUpload = input.files[0];
    this.documentInput = file;
    // this.documentName = `${file.name} (${formatBytes(file.size)})`;
    this.documentName = `${file.name}`;
  }

  onFileChanged2(input: HTMLInputElement): void {
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
    this.fileToUpload2 = input.files[0];
    this.documentInput2 = file;
    this.documentName2 = `${file.name} (${formatBytes(file.size)})`;
    this.documentName3 = `${file.name}`;
  }

  resetCoverValue(){
    this.documentInput2 = null;
    this.documentName2 = null;
  }
  async loadCategories() {
    await this.infoManagementService.getCategoriesList().then((res) => {
      let responsData: any = JSON.parse(JSON.stringify(res));
      this.categoriesTableData = responsData.data
    });
}

  changeSvgSize() {
    let widthIndexStart = this.currentIcon.indexOf('width="');
    let widthIndexEnd = this.currentIcon.indexOf('"', widthIndexStart + 7) + 1;
    let heightIndexStart = this.currentIcon.indexOf('height="');
    let heightIndexEnd = this.currentIcon.indexOf('"', heightIndexStart + 8) + 1;
    let viewBoxIndex = this.currentIcon.indexOf('viewBox=');

    let widthReaded = this.currentIcon.substring(widthIndexStart, widthIndexEnd);
    let heightReaded = this.currentIcon.substring(heightIndexStart, heightIndexEnd);

    this.currentIcon = this.currentIcon.replace(widthReaded, 'width="70"');
    this.currentIcon = this.currentIcon.replace(heightReaded, 'height="70"');
    if (viewBoxIndex < 0) {
      this.currentIcon = this.currentIcon.replace('height="70"', 'height="70" viewBox="0 0 24 24"');
    }
    this.currentInfo.icon = this.currentIcon;
    this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
  }
  changeSvgFill() {
    let fillIndexStart = this.currentIcon.indexOf('fill="');
    let fillIndexEnd = this.currentIcon.indexOf('"', fillIndexStart + 6) + 1;

    let subStr = this.currentIcon.substring(fillIndexStart,fillIndexEnd)

    if (fillIndexStart < 0) {
      fillIndexStart = this.currentIcon.indexOf("fill='");
      fillIndexEnd = this.currentIcon.indexOf("'", fillIndexStart + 6) + 1;
    }
    let fillReaded = this.currentIcon.substring(fillIndexStart, fillIndexEnd);
    // this.currentIcon = this.currentIcon.replace(fillReaded, "fill='" + this.iconColor + "'");
    this.currentIcon = this.replaceAllForIconColor(this.currentIcon, fillReaded, "fill='" + this.iconColor + "'")
    this.currentInfo.icon = this.currentIcon;
    this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
  }
  replaceAllForIconColor(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}
onImageClick(url: string) {
  this.selectedImage = url;
  this.selectedImageName = url;
  let path = './assets/images/' + url;
  this.httpClient.get(path, { responseType: 'text' })
    .subscribe(data => {
      this.currentIcon = data;
      this.changeSvgSize();
      this.changeSvgFill();
    });
}
onUploadedClick() {
  this.selectedImageName = "uploaded.svg";
  this.selectedImage = "uploaded";
  this.currentIcon = this.iconUploadedVal;
  this.changeSvgSize();
  this.changeSvgFill();
}
async onUploadIcon(e) {

  var idxDot = this.documentName.lastIndexOf(".") + 1;
        var extFile =  this.documentName.substr(idxDot,  this.documentName.length).toLowerCase();
        if (extFile=="svg"){
          this.attachmentIcon = this.iconFile.nativeElement.files[0];
    let reader = new FileReader();
    var that = this;
    reader.onloadend = await function (event) {
      const fileText = reader.result;
      that.iconUploadedVal = fileText.toString();
      that.modifyIconUploaded();
    }
    reader.readAsText(this.attachmentIcon);
        }else{
            this.documentInput = null
           this.documentName = null
           this.attachmentIcon = null
           this.fileToUpload = null
           this.submitted = true;
        }
}
modifyIconUploaded() {
  let widthIndexStart = this.iconUploadedVal.indexOf('width="');
  let widthIndexEnd = this.iconUploadedVal.indexOf('"', widthIndexStart + 7) + 1;
  let heightIndexStart = this.iconUploadedVal.indexOf('height="');
  let heightIndexEnd = this.iconUploadedVal.indexOf('"', heightIndexStart + 8) + 1;
  let viewBoxIndex = this.iconUploadedVal.indexOf('viewBox=');

  let widthReaded = this.iconUploadedVal.substring(widthIndexStart, widthIndexEnd);
  let heightReaded = this.iconUploadedVal.substring(heightIndexStart, heightIndexEnd);

  this.iconUploadedVal = this.iconUploadedVal.replace(widthReaded, 'width="40"');
  this.iconUploadedVal = this.iconUploadedVal.replace(heightReaded, 'height="36"');
  if (viewBoxIndex < 0) {
    this.iconUploadedVal = this.iconUploadedVal.replace('height="36"', 'height="36" viewBox="0 0 24 24"');
  }

  let fillIndexStart = this.iconUploadedVal.indexOf('fill="');
  let fillIndexEnd = this.iconUploadedVal.indexOf('"', fillIndexStart + 6) + 1;
  if (fillIndexStart < 0) {
    fillIndexStart = this.iconUploadedVal.indexOf("fill='");
    fillIndexEnd = this.iconUploadedVal.indexOf("'", fillIndexStart + 6) + 1;
  }
  if (fillIndexStart < 0) {
    this.iconUploadedVal = this.iconUploadedVal.replace('height="36"', 'height="36" fill="#ffffff"');
  }
  else {
    let fillReaded = this.iconUploadedVal.substring(fillIndexStart, fillIndexEnd);
    this.iconUploadedVal = this.iconUploadedVal.replace(fillReaded, 'fill="#ffffff"');
  }

  this.safeSvgUploaded = this.sanitizer.bypassSecurityTrustHtml(this.iconUploadedVal);
  this.iconUploaded = true;
}
onIconAttachment() {
  if (this.iconFile.nativeElement.files.length > 0) {
    this.iconFile.nativeElement.value = '';
  }
  this.iconFile.nativeElement.click();
}
onIconColorChange(event) {
  this.changeSvgFill();
}
onSubmit(){
  if(this.addCategoryForm.valid && this.documentInput2){
    if(this.id){
      this.currentInfo.id = this.id;
    }
    this.titles[0].title = this.addCategoryForm.value.informationEnglish;
    this.titles[1].title = this.addCategoryForm.value.informationItalian;
    this.infoFiles[0].file = this.documentName3;
    this.currentInfo.titleLanguages = this.titles;
    this.currentInfo.icon = this.currentIcon;
    this.currentInfo.category = this.addCategoryForm.value.categoryEnglish;
    this.currentInfo.file = this.infoFiles;
    this.currentInfo.iconName = this.selectedImageName;
    this.currentInfo.isPublic = this.addCategoryForm.value.isPublic;
    this.currentInfo.IconBackgroundColor = this.iconColor;

    /*this.infoManagementService.createOrUpdateInformation(this.currentInfo).then((res) => {
      let responsData = JSON.parse(JSON.stringify(res));
      if (responsData.result) {
        Swal.fire('', this.id ? this.translate.instant('Information edited successfully') : this.translate.instant('Information added successfully'), 'success')
      } else {
        Swal.fire('',
          this.translate.instant(responsData.reason),
          'info'
        )
      }
      this.router.navigate(['/manage-information/informations']);
    });*/

    this.infoManagementService.uploadDocument(this.documentInput2, this.currentInfo).subscribe((event) => {
      //  let responsData = JSON.parse(JSON.stringify(res));

      if(event instanceof HttpResponse){
        Swal.fire( '',
         this.id ? this.translate.instant('Information edited successfully') : this.translate.instant('Information added successfully'),
          'success')
      }
      else{
        Swal.fire( '',
         'this.translate.instant(event.error)',
        'info')
      }
      this.router.navigate(['/manage-information/informations']);
    });
  }
  else{
    this.submitted = true
  }
}

fetchData(){
  this.helper.toggleLoaderVisibility(true);
  this.infoManagementService.getInformationById(this.id).then((res) => {
    let responsData = JSON.parse(JSON.stringify(res));
    let values = responsData.info;
    this.currentInfo = new InformationDocument();
    this.currentInfo.tileBackgroundColor = values.tileBackgroundColor;
    this.currentInfo.textColor = values.textColor;
    this.currentIcon = values.icon;
    this.iconColor = values.IconBackgroundColor;
    this.selectedImageName = values.iconName;
    this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
    this.addCategoryForm.patchValue({
      informationEnglish: values.titleLanguages[0].title,
      informationItalian: values.titleLanguages[1].title,
      isPublic: values.isPublic,
      categoryEnglish: values.category
    })
    this.documentName3 = values.file[0].file;
    this.documentName2 = this.documentName3;
    this.documentInput2 = this.documentName2;
    if (this.selectedImageName == "uploaded.svg"){
      this.iconUploaded = true;
      this.selectedImage = "uploaded";
      this.safeSvgUploaded = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
    }
    this.helper.toggleLoaderVisibility(false);
  });
}


}
