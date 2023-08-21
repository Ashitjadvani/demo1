import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MCPHelperService} from "../../../service/MCPHelper.service";
import swal from "sweetalert2";
import {BookableAssetsManagementService} from "../../../../../../fe-common-v2/src/lib/services/bookable-assets-management.service";
import {CommonService} from "../../../../../../fe-common-v2/src/lib/services/common.service";
import {IrinaResource, IrinaResourceType} from "../../../../../../fe-common-v2/src/lib/models/bookable-assets";
import {TranslateService} from "@ngx-translate/core";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {AdminSiteManagementService} from "projects/fe-common-v2/src/lib/services/admin-site-management.service";
import { UserManagementService } from 'projects/fe-common-v2/src/lib/services/user-management.service';
import {DataStorageManagementService} from "../../../../../../fe-common-v2/src/lib/services/data-storage-management.service";
@Component({
    selector: 'app-add-edit-resource',
    templateUrl: './add-edit-resource.component.html',
    styleUrls: ['./add-edit-resource.component.scss']
})
export class AddEditResourceComponent implements OnInit {
    title = 'Add';
    resourceType
    resourceForm: FormGroup;
    allResources: IrinaResource[] = [];
    editResource: any
    currentResource: IrinaResource = IrinaResource.Empty();
    @Input() currentResourceType: IrinaResourceType;
    resources: import("../../../../../../fe-common-v2/src/lib/models/bookable-assets").BookableResource[];
    resourceTypes: IrinaResourceType[];
    filterResourceTypes: any;
    allSelected = false;
    @ViewChild('select') select: MatSelect;
    @ViewChild('documentInput2') myInputVariable: ElementRef;
    @ViewChild('documentInput') myInputVariable2: ElementRef;
    userAccount: any;
    allSites: any;
    resourceTypeAdd: any;
    url:any = '';
    fileToUpload: any;
    documentInput: File;
    documentName: string;
    mapUrl: any ="";
    mapToUpload: File;
    mapDocumentInput: File;
    mapDocumentName: string;
    resourceData: any;
    sidebarMenuName: string;
    companyId: any;
    id: any;
    constructor(
        public route: ActivatedRoute,
        private bookableAssetsManagementService: BookableAssetsManagementService,
        private commonService: CommonService,
        private helper: MCPHelperService,
        public translate: TranslateService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private adminSiteManagementService: AdminSiteManagementService,
        private userManagementService: UserManagementService,
        private dataStorageManagementService: DataStorageManagementService
    ) {
        this.resourceForm=this._formBuilder.group({
            id:[],
            code:[null, Validators.required],
            description:[null, Validators.required],
            site:[null, Validators.required],
            capacity:[''],
            enabled:[''],
            gracePeriod:[''],
            minutesInstantBook:[''],
            minutesExtendedBook:[''],
            panelRefreshRate:[''],
            facilityList:[''],
            area:[''],
            layout:[''],
            imageURL:[''],
            mapImageURL:['']
        })

    }

    async ngOnInit() {
        const credentials = localStorage.getItem('credentials');
        if (credentials) {
            const authUser: any = JSON.parse(credentials);
            this.companyId = authUser.person.companyId;
        }
        this.userAccount = this.userManagementService.getAccount();
        this.resourceType = this.route.snapshot.queryParams.resource;
        this.resourceTypeAdd = this.route.snapshot.queryParams.type;
        this.id = this.route.snapshot.queryParams.id
        if (this.resourceType) {
            this.title = 'Edit';
        } else {
            this.title = 'Add';
        }
        await this.loadReourceList();
        await this.loadReourceTypeList()
        await this.loadSites()
        await this.getImage()
        await this.getMap()
        this.sideMenuName()
        if(this.resourceType){
            this.resourceForm.patchValue({
                id:this.editResource.id,
                code:this.editResource.code,
                description:this.editResource.description,
                site:this.editResource.site,
                capacity:this.editResource.custom.capacity,
                enabled:this.editResource.enabled,
                gracePeriod:this.editResource.custom.gracePeriod,
                minutesInstantBook:this.editResource.custom.minutesInstantBook,
                minutesExtendedBook:this.editResource.custom.minutesExtendedBook,
                panelRefreshRate:this.editResource.custom.panelRefreshRate,
                facilityList:this.editResource.custom.facilityList,
                area:this.editResource.custom.area,
                layout:this.editResource.custom.layout
            })

        }
    }

    sideMenuName() {
        this.sidebarMenuName = 'INSIGHTS_MENU.Resource_Group';
        this.helper.sideMenuListName.next(this.sidebarMenuName);
    }

    async loadSites() {
        let res = await this.adminSiteManagementService.getSites(this.userAccount.companyId);
        if (res) {
            this.allSites = res.data;
        }
    }

    async getImage() {
        if (this.editResource?.imageURL){
            let res = await this.dataStorageManagementService.getFileBase64(this.editResource.imageURL)
            if (this.commonService.isValidResponse(res)) {
                let data =res
                this.url = data.data
                this.documentName = data.file
                this.resourceForm.controls['imageURL'].setValue(this.editResource.imageURL);
            }
        }

    }
    async getMap() {
        if (this.editResource?.custom.mapImageURL){
            let res = await this.dataStorageManagementService.getFileBase64(this.editResource.custom.mapImageURL)
            if (this.commonService.isValidResponse(res)) {
                let data =res
                this.mapUrl = data.data
                this.mapDocumentName = data.file
                this.resourceForm.controls['mapImageURL'].setValue(this.editResource.custom.mapImageURL);

            }
        }
    }

    async loadReourceList() {
        let res = await this.bookableAssetsManagementService.getBookableResources(this.resourceTypeAdd);

        if (this.commonService.isValidResponse(res)) {
            this.allResources = res.data;
            this.resources = res.data; // TODO Optimize this
            this.editResource = this.resources.find(res => res.code === this.resourceType)
        } else {
            this.helper.toggleLoaderVisibility(false);
            // const e = err.error;
            swal.fire(
                '',
                // err.error.message,
                this.translate.instant("Data not found"),
                'info'
            );
        }
    }

    toggleAllSelection() {
        if (this.allSelected) {
            this.select.options.forEach((item: MatOption) => item.select());
        } else {
            this.select.options.forEach((item: MatOption) => item.deselect());
        }
    }
    back(){
        let param = this.editResource?.type ? this.editResource?.type : this.resourceTypeAdd
        this.router.navigate([`/assets-management/resource-group/resource-group-info`],{ queryParams: { type:param}})
    }



    optionClick() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelected = newStatus;
    }

    onFileChanged(input: HTMLInputElement,event): void {
        // this.attachmentFile = this.file.nativeElement.files[0];
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                this.url = event.target.result;
            }
        }
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
        this.documentName = `${file.name} (${formatBytes(file.size)})`;

    }
    onMapChanged(input: HTMLInputElement,event): void {
        // this.attachmentFile = this.file.nativeElement.files[0];
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                this.mapUrl = event.target.result;
            }
        }
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
        this.mapToUpload = input.files[0];
        this.mapDocumentInput = file;
        this.mapDocumentName = `${file.name} (${formatBytes(file.size)})`;

    }

    uploadFile(fileToUpload): any {
        return new Promise((resolve, reject) => {
            if (fileToUpload) {
                this.dataStorageManagementService.uploadFile(fileToUpload).then((data: any) => {
                    const fileId = data?.body?.fileId ? data.body.fileId : null;
                    resolve(fileId);
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
        this.resourceForm.controls['imageURL'].setValue(null);
        this.resourceForm.value.imageURL = ""
        this.url =null
        this.myInputVariable2.nativeElement.value = "";
    }
    resetMapCoverValue(): void {
        this.mapDocumentInput = null;
        this.mapDocumentName = null;
        this.resourceForm.controls['mapImageURL'].setValue(null);
        this.resourceForm.value.mapImageURL = ""
        this.mapUrl = null
        this.myInputVariable.nativeElement.value = "";
    }
    async loadReourceTypeList() {
        let res = await this.bookableAssetsManagementService.getBookableResourceTypes()
        if (this.commonService.isValidResponse(res)) {
            this.resourceTypes = res.data;
            this.filterResourceTypes = this.resourceTypes.find(res => res.type === this.resourceTypeAdd)
        } else {
            swal.fire(
                '',
                // err.error.message,
                this.translate.instant("Data not found"),
                'info'
            );
        }
    }
    saveImage(){
        this.uploadFile(this.fileToUpload).then(async (imageUrl)=>{
            this.resourceForm.patchValue({
                imageURL: (imageUrl) ? imageUrl : (this.resourceForm.value.imageURL) ? this.resourceForm.value.imageURL : null
            });
                this.submit()
        })
    }
    saveMap(){
        this.uploadFile(this.mapToUpload).then(async (mapUrl)=>{
            this.resourceForm.patchValue({
                mapImageURL: (mapUrl) ? mapUrl : (this.resourceForm.value.mapImageURL) ? this.resourceForm.value.mapImageURL :null
            })
                this.submit()
            if(this.id  != 0){
                if (this.resourceData) {
                    swal.fire(
                        '',
                        // err.error.message,
                        this.translate.instant("Resource updated successfully"),
                        'success'
                    );


                } else {
                    swal.fire(
                        '',
                        // err.error.message,
                        this.translate.instant(this.resourceData.reason),
                        'info'
                    );
                }
            }else {
                if (this.resourceData) {
                    swal.fire(
                        '',
                        // err.error.message,
                        this.translate.instant("Resource add successfully"),
                        'success'
                    );


                } else {
                    swal.fire(
                        '',
                        // err.error.message,
                        this.translate.instant(this.resourceData.reason),
                        'info'
                    );
                }
            }
            this.back()
        })
    }

    async submit() {
        if (this.resourceForm.valid){

            let data: any = {
                id: this.resourceForm.value.id,
                code: this.resourceForm.value.code,
                availabilityTimeslots: [],
                availableToAll: false,
                children: [],
                companyId:this.companyId,
                custom: {
                    capacity: this.resourceForm.value.capacity,
                    area: this.resourceForm.value.area,
                    facilityList: this.resourceForm.value.facilityList,
                    layout: this.resourceForm.value.layout,
                    gracePeriod: this.resourceForm.value.gracePeriod,
                    minutesInstantBook: this.resourceForm.value.minutesInstantBook,
                    minutesExtendedBook: this.resourceForm.value.minutesExtendedBook,
                    panelRefreshRate: this.resourceForm.value.panelRefreshRate,
                    mapImageURL: this.resourceForm.value.mapImageURL
                },
                description: this.resourceForm.value.description,
                enabled: this.resourceForm.value.enabled,
                // "enabledUserOutOfOffice": false,
                // "exclusiveUse": false,
                // "features": [],
                site: this.resourceForm.value.site,
                type: this.resourceForm.value.type ? this.resourceForm.value.type : this.resourceTypeAdd,
                imageURL: this.resourceForm.value.imageURL
            }
            let res = await this.bookableAssetsManagementService.addOrUpdateBookableResource(data);

            if(res.result===true){
                this.resourceData =res.data
                this.resourceForm.controls['id'].setValue(this.resourceData.id)
            }
            else {
                swal.fire(
                    '',
                    // err.error.message,
                    this.translate.instant(res.reason),
                    'info'
                );
            }
        }
    }


}
