import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import swal from 'sweetalert2';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {ApiService} from '../../service/api.service';
import {HelperService} from '../../service/helper.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;

  documentInput: any;
  documentName: any;
  serviceList: any;
  private destroy$ = new Subject();
  fileToUpload: any;
  checkBoxVerify:boolean = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private Api: ApiService,
              private Helper: HelperService,
              private translate: TranslateService
              ) {
    this.signupForm = this.formBuilder.group({
      companyReferenceEmail: [null, [HelperService.noWhitespaceValidator, Validators.email]],
      companyName: [null, [HelperService.noWhitespaceValidator]],
      companyDescription: [null, HelperService.noWhitespaceValidator],
      companyWebsiteURL: [null],
      briefDescription: [null, HelperService.noWhitespaceValidator],
      serviceCategory: [null, Validators.required],
      companyBroucher: [null],
    });
  }

  ngOnInit(): void {
    this.Api.serviceList()
      .pipe(takeUntil(this.destroy$))
        .subscribe( (data) => {
          this.serviceList = data.data;
      }, (error) => {

      });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      if(this.checkBoxVerify){
        this.Helper.toggleLoaderVisibility(true);
        this.uplodeFile(this.fileToUpload).then((fileId) => {
          this.signupForm.value.companyBroucher = fileId;
          this.Api.signup(this.signupForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
              this.Helper.toggleLoaderVisibility(false);
              HelperService.companyReferenceEmail = this.signupForm.value.companyReferenceEmail;
              this.router.navigate(['email-verification']);
            }, (error) => {
              this.Helper.toggleLoaderVisibility(false);
              const e = error.error;
              swal.fire(
                'Info!',
                this.translate.instant(e.message),
                'info'
              );
            });
        }, (error) => {
          this.Helper.toggleLoaderVisibility(false);
          const e = error.error;
          swal.fire(
            'Info!',
            this.translate.instant(e.message),
            'info'
          );
        });
      }else{
        swal.fire('',
        this.translate.instant('Please accept terms and condition and privacy policy'),
         'info');
      }
      
    }
  }

  onFileChanged(input: HTMLInputElement): void {
    if (input.files[0].type === 'application/pdf') {
      this.fileToUpload = input.files[0];
      this.documentInput = this.fileToUpload;
      this.documentName = `${this.fileToUpload.name} (${this.formatBytes(this.fileToUpload.size)})`;
    } else {
      swal.fire(
        'Info!',
        'Please upload the PDF file!',
        'info'
      );
    }
  }

   formatBytes(bytes: number): string {
    const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const factor = 1024;
    let index = 0;
    while (bytes >= factor) {
      bytes /= factor;
      index++;
    }
    return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
  }

  uplodeFile(fileToUpload): any {
    return new Promise((resolve, reject) => {
      if (fileToUpload) {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload);
        this.Api.uploadFile(formData).subscribe((data: any) => {
          resolve(data.fileId);
        }, (error) => {
          resolve(null);
        });
      } else {
        resolve(null);
      }
    });
  }

  resetCoverValue(): void {
    this.documentInput = null;
    this.documentName = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }
}
