import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {NSApiService} from '../../../service/NSApi.service';
import {NSHelperService} from '../../../service/NSHelper.service';
import swal from "sweetalert2";

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
    profileForm: FormGroup;

    selectedFile: any;
    imageType: any;
    validFormats: any = [];
    empImageName: any;
    url: any = "";
    logoId: any;
    nameFirst: string;
    nameLast: string;
    sidebarMenuName: string;

    constructor(
        private _formBuilder: FormBuilder,
        private APIservice: NSApiService,
        private helper: NSHelperService
    ) {
        // const imgID = JSON.parse(localStorage.getItem('logoId'))
        this.profileForm = this._formBuilder.group({
                first_name: [''],
                last_name: [''],
                email: ['', Validators.email],
                profile_id: ['']
            },
            {validator: this.checkIfMatchingPasswords('newPassword', 'confirmPassword')},
        );
    }

    firstImageFunction() {
        this.helper.onFirstComponentButtonClick();
    }

    ngOnInit(): void {
        this.helper.toggleLoaderVisibility(true);
        this.sideMenuName();
        this.firstImageFunction();
        const NSLoggedInUser = JSON.parse(localStorage.getItem('NSLoggedInUser'));
        // const imgID = JSON.parse(localStorage.getItem('logoId'))
        // this.logoId = imgID;
        this.APIservice.editViewProfile(NSLoggedInUser.id).subscribe((data: any) => {
            if(data.statusCode = '200'){
                this.helper.toggleLoaderVisibility(false);
                this.logoId = data.data.profile_id;
                this.profileForm.patchValue({
                    first_name: data.data.first_name,
                    last_name: data.data.last_name,
                    email: data.data.email,
                    profile_id: data.data.profile_id
                });
                this.APIservice.editViewProfileImg(this.logoId).subscribe((data: any) => {
                    this.url = data.data;
                    // this.selectedFile = data.data.selectedFile;
                });
            }
        });

    }

    sideMenuName() {
        this.sidebarMenuName = 'Settings';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    changeProfile() {
        this.helper.toggleLoaderVisibility(true);
        const formData: FormData = new FormData();
        if (this.selectedFile) {
            formData.append('file', this.selectedFile);
            this.APIservice.updateProfileImg(formData).subscribe((data: any) => {
                if (data.statusCode === 200){
                    this.helper.toggleLoaderVisibility(false);
                    this.logoId = data.fileId;
                    localStorage.setItem('logoId', JSON.stringify(data.fileId));
                    this.profileForm.patchValue({profile_id: this.logoId});
                    this.firstImageFunction();
                    if (this.profileForm.valid) {
                        this.APIservice.chnageProfile(this.profileForm.value).subscribe((data: any) => {
                            Swal.fire(
                                '',
                                data.meta.message,
                                'success'
                            )
                            this.firstImageFunction();
                        }, (err) => {
                            Swal.fire('', err.error.meta.message, 'info')
                        });
                    }
                }
            }, (error) => {
                this.helper.toggleLoaderVisibility(false);
                const e = error.error;
                swal.fire(
                    'Info!',
                    e.message,
                    'error'
                );
            });
            // const reqData = {fileId: res.fileId, type: 'job_default'};
            // await this.cmsManagementService.saveDefaultImage(reqData);
        } else {
            if (this.profileForm.valid) {
                this.firstImageFunction();
                this.APIservice.chnageProfile(this.profileForm.value).subscribe((data: any) => {
                    Swal.fire(
                        '',
                        data.meta.message,
                        'success'
                    )
                }, (err) => {
                    Swal.fire('', err.error.meta.message, 'info')
                });
            }
        }
        this.nameFirst = this.profileForm.value.first_name;
        this.nameLast = this.profileForm.value.last_name;
        this.helper.profileFirstName.next(this.nameFirst);
        this.helper.profileLastName.next(this.nameLast);
    }

    checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
        return (resetPasswordForm: FormGroup) => {
            // let password = resetPasswordForm.controls[passwordKey],
            // confirmPassword = resetPasswordForm.controls[passwordConfirmationKey];
            // if (password.value !== confirmPassword.value) {
            //    return confirmPassword.setErrors({notEquivalent: true});

            // }
            // else {
            //       return confirmPassword.setErrors(null);


            // }
        }
    }

    public empProfileImage: any;

    onFileChanged(event: any): void {
        this.selectedFile = event.target.files[0];
        let imageType = (this.selectedFile && this.selectedFile.type) ? this.selectedFile.type : null;
        var validFormats = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'];
        if (validFormats.includes(imageType)) {
            const reader = new FileReader();
            reader.readAsDataURL(this.selectedFile);
            this.empImageName = 'File selected';
            reader.onload = () => {
                this.url = reader.result;
            };
        } else {
            // swal.fire(
            //   '',
            //   'Invalid image extension !!',
            //   'info'
            // );
        }
    }

    onCoverImage(input: HTMLInputElement): void {
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
    }


}
