import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../popups/delete-popup/delete-popup.component';
import { MarkImportantComponent } from '../../../popups/mark-important/mark-important.component';
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";
import {NSApiService} from "../../../service/NSApi.service";
import { DomSanitizer } from '@angular/platform-browser';
import {NSHelperService} from "../../../service/NSHelper.service";

export interface DialogData {
  message: any;
  heading: any;
  list: any;
  id:any
}

@Component({
  selector: 'app-view-client-details',
  templateUrl: './view-client-details.component.html',
  styleUrls: ['./view-client-details.component.scss']
})
export class ViewClientDetailsComponent implements OnInit {
  comapnyLogo = 'assets/images/company-logo.svg';
  base64Image!:any
  viewClientdetails: any ;
  featureList = [];
  clientId : any;
  markAsUImportantList : any;

  constructor(
    public dialog: MatDialog,
    private activitedRoute: ActivatedRoute,
    public api: NSApiService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    public helper: NSHelperService
    ){
  }

  ngOnInit(): void {
    this.details();
  }
  details(){
      this.helper.toggleLoaderVisibility(true);
    this.clientId = this.activitedRoute.snapshot.paramMap.get('id');
    this.api.viewClient({id : this.clientId}).subscribe((res: any) => {
        this.helper.toggleLoaderVisibility(false);
      if (res.statusCode === 200) {

        this.viewClientdetails = res.data;

        this.markAsUImportantList = this.viewClientdetails.dashboardCustomization;
        this.comapnyLogo = this.viewClientdetails.company_logo_image;
        this.base64Image = this.domSanitizer.bypassSecurityTrustResourceUrl(this.comapnyLogo);
        // if (this.viewClientdetails.company_logo !== '-' && this.viewClientdetails.company_logo !== ''){
        //   this.api.editViewProfileImg(this.viewClientdetails.company_logo).subscribe((data:any)=>{
        //     this.comapnyLogo = this.viewClientdetails.company_logo
        //     console.log("ss",this.comapnyLogo);

        //   });
        // }
        this.api.getFeaturesList('').subscribe((data: any) => {
          this.featureList = data.data;
          this.featureList.forEach(element => {
            var featuresSavedData = this.viewClientdetails.company_features;
            featuresSavedData.forEach(featuesTrue => {
              if (element.id == featuesTrue.featureId){
                element.status = featuesTrue.status
              }
            })
          });
        });
      }else {
        swal.fire(
          '',
          res.reason,
          'info'
        );
      }
    });
  }

  onEdit(id: string): void {
    this.router.navigate([`client-management/add-edit-client/` + id]);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message:"Are you sure you want to delete this Client?",heading:"Delete Client"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteClient(this.clientId).subscribe((data: any) => {
          const metaData: any = data.meta.message;
          swal.fire(
            'Deleted!',
            metaData,
            'success'
          );
          this.router.navigate(['/client-management']);
        }, (err: any) => {
          const e = err.error;
          swal.fire(
            'Error!',
            err.error.message,
            'info'
          );

        });
      }
    });
  }
  openMarkDialog(){
    const dialogRef = this.dialog.open(MarkImportantComponent, {
      data: {
        list: this.markAsUImportantList,
        id:  this.clientId
      }
    });
  }

}
