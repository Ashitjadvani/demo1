import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {InformationDocument} from "../../../../../../../fe-common-v2/src/lib/models/admin/information-document";
import {DomSanitizer} from "@angular/platform-browser";
import {
  CategoryDocument,
  TitleLanguage
} from '../../../../../../../fe-common-v2/src/lib/models/admin/information-category-document';
import {InfoManagementService} from '../../../../../../../fe-common-v2/src/lib/services/info-management.service';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {MCPHelperService} from '../../../../service/MCPHelper.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-edit-categories',
  templateUrl: './add-edit-categories.component.html',
  styleUrls: ['./add-edit-categories.component.scss']
})
export class AddEditCategoriesComponent implements OnInit {
  @ViewChild('icon', {static: false}) iconFile: ElementRef;
  addCategoryForm: FormGroup;
  title = 'Add';
  realtimeTitle: any;
  documentInput: any;
  languageSelected: string;
  documentName: any;
  fileToUpload: any;
  currentCategory: CategoryDocument = CategoryDocument.Empty();
  titles: TitleLanguage[] = new Array();
  backgroundColor: any;
  iconColor: any;
  selectedImage: string;
  selectedImageName: string;
  currentIcon: string;
  safeSvg: any;
  iconUploadedVal: string;
  safeSvgUploaded: any;
  attachmentIcon: any;
  iconUploaded = false;
  images: string[];
  id: any;
  submitted: boolean = false;

  constructor(
    public _categoriesForm: FormBuilder,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private infoManagementService: InfoManagementService,
    private router: Router,
    private activitedRoute: ActivatedRoute,
    private translate: TranslateService,
    private helper : MCPHelperService
  ) {
    this.addCategoryForm = this._categoriesForm.group({
      categoryTitleEnglish: [null, [Validators.required, MCPHelperService.noWhitespaceValidator]],
      categoryTitleItalian: [null, [Validators.required, MCPHelperService.noWhitespaceValidator]],
      backgroundColor: [''],
      iconColor: [''],
      textColor: [''],
    })


  }

  ngOnInit(): void {
    this.images = [
      'information-icon.svg',
      'attach-icon.svg',
      'audio-icon.svg',
      'image-icon.svg',
      'pdf-file-icon.svg',
      'video-icon.svg',
    ];
    this.selectedImage = this.images[0];
    this.selectedImageName = 'information-icon.svg';
    this.titles.push(new TitleLanguage("en", ""));
    this.titles.push(new TitleLanguage("it", ""));
    this.iconColor = '#000000',
      this.httpClient.get('./assets/images/information-icon.svg', {responseType: 'text'})
        .subscribe(data => {
          this.currentIcon = data;
          this.changeSvgSize();
          this.changeSvgFill();
        });
    // this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
    this.id = this.activitedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.fetchData();
      this.title = 'Edit';
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

  onImageClick(url: string) {
    this.selectedImage = url;
    this.selectedImageName = url;
    let path = './assets/images/' + url;
    this.httpClient.get(path, {responseType: 'text'})
      .subscribe(data => {
        this.currentIcon = data;
        this.changeSvgSize();
        this.changeSvgFill();
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
    this.currentCategory.icon = this.currentIcon;
    this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
  }

  changeSvgFill() {
    let fillIndexStart = this.currentIcon.indexOf('fill="');
    let fillIndexEnd = this.currentIcon.indexOf('"', fillIndexStart + 6) + 1;

    let subStr = this.currentIcon.substring(fillIndexStart, fillIndexEnd)

    if (fillIndexStart < 0) {
      fillIndexStart = this.currentIcon.indexOf("fill='");
      fillIndexEnd = this.currentIcon.indexOf("'", fillIndexStart + 6) + 1;
    }
    let fillReaded = this.currentIcon.substring(fillIndexStart, fillIndexEnd);
    // this.currentIcon = this.currentIcon.replace(fillReaded, "fill='" + this.iconColor + "'");
    this.currentIcon = this.replaceAllForIconColor(this.currentIcon, fillReaded, "fill='" + this.iconColor + "'")
    this.currentCategory.icon = this.currentIcon;
    this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
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
    var extFile = this.documentName.substr(idxDot, this.documentName.length).toLowerCase();
    if (extFile == "svg") {
      this.attachmentIcon = this.iconFile.nativeElement.files[0];
      let reader = new FileReader();
      var that = this;
      reader.onloadend = await function (event) {
        const fileText = reader.result;
        that.iconUploadedVal = fileText.toString();
        that.modifyIconUploaded();
      }
      reader.readAsText(this.attachmentIcon);
    } else {
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
    } else {
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

  changeCategory() {
  }

  replaceAllForIconColor(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }

// async onConfirmClick() {
//   this.currentCategory.titleLanguages = this.titles;
//   let res = await this.infoManagementService.createOrUpdateCategory(this.currentCategory);
//   if (res.result) {

//   }
// }
// isConfirmEnabled() {
//   return this.titles.length>0
//       && this.commonService.isValidField(this.currentCategory.icon);
// }

  onSubmit() {
    if (this.addCategoryForm.valid) {
      if (this.id) {
        this.currentCategory.id = this.id
      }
      this.titles[0].title = this.addCategoryForm.value.categoryTitleEnglish
      this.titles[1].title = this.addCategoryForm.value.categoryTitleItalian
      this.currentCategory.titleLanguages = this.titles;
      this.currentCategory.icon = this.currentIcon;
      this.currentCategory.iconBackgroundColor = this.iconColor;
      this.currentCategory.iconName = this.selectedImageName;
      this.infoManagementService.createOrUpdateCategory(this.currentCategory).then((res) => {
        let responsData = JSON.parse(JSON.stringify(res));
        if (responsData.result) {
          Swal.fire('', this.id ? this.translate.instant('Category edited successfully') : this.translate.instant('Category added successfully'), 'success')
        } else {
          Swal.fire('',
            this.translate.instant(responsData.reason),
            'info'
          )
        }
        this.router.navigate(['/manage-information/categories']);
      });

    }
  }

  fetchData() {
    this.helper.toggleLoaderVisibility(true);
    this.infoManagementService.getCategoryById(this.id).then((res) => {
      let responsData = JSON.parse(JSON.stringify(res));
      let values = responsData.category;
      this.currentCategory = new CategoryDocument();
      this.currentCategory.tileBackgroundColor = values.tileBackgroundColor
      this.currentCategory.textColor = values.textColor
      this.currentIcon = values.icon;
      this.selectedImage = this.currentIcon
      this.selectedImageName = values.iconName
      this.iconColor = values.iconBackgroundColor;
      this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
      this.addCategoryForm.patchValue({
        categoryTitleEnglish: values.titleLanguages[0].title,
        categoryTitleItalian: values.titleLanguages[1].title,
      });
      if (this.selectedImageName == "uploaded.svg"){
        this.iconUploaded = true;
        this.selectedImage = "uploaded";
        this.safeSvgUploaded = this.sanitizer.bypassSecurityTrustHtml(this.currentIcon);
      }
      this.helper.toggleLoaderVisibility(false);
    });
  }

// validateFileType(){
//   var idxDot = this.documentName.lastIndexOf(".") + 1;
//         var extFile =  this.documentName.substr(idxDot,  this.documentName.length).toLowerCase();
//         if (extFile=="svg"){
//             //TO DO
//         }else{
//             alert("Only svg file is allowed!");
//         }
// }
}
