import { Component, OnInit } from '@angular/core';
import {PaginationInstance} from "ngx-pagination/dist/ngx-pagination.module";
import {MatDialog} from "@angular/material/dialog";
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";

export interface DialogData {
  message:any;
  heading:any;
}


@Component({
  selector: 'app-manage-rfq',
  templateUrl: './manage-rfq.component.html',
  styleUrls: ['./manage-rfq.component.scss']
})
export class ManageRFQComponent implements OnInit {
  page: number = 1;
  itemsPerPage:number = 5
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 5,
    currentPage: this.page
  };

  constructor(public dialog: MatDialog) { }

  public manage_rfq_data = [
    {ID: '#435684253',QuotationTitle:'Lorem Ipsum' , Priority: 'High' , DueDate: '15/03/2022', Budget : '€ 200', SubmissionDate: '13/03/2022', Status: 'Active', },
    {ID: '#564874552',QuotationTitle:'Lorem Ipsum' , Priority: 'Medium' , DueDate: '15/03/2022', Budget : '€ 200', SubmissionDate: '13/03/2022', Status: 'Inactive', },
    {ID: '#468572538',QuotationTitle:'Lorem Ipsum' , Priority: 'Low' , DueDate: '15/03/2022', Budget : '€ 200', SubmissionDate: '13/03/2022', Status: 'Active', },
    {ID: '#468352549',QuotationTitle:'Lorem Ipsum' , Priority: 'High' , DueDate: '15/03/2022', Budget : '€ 200', SubmissionDate: '13/03/2022', Status: 'Inactive', },
    {ID: '#132685974',QuotationTitle:'Lorem Ipsum' , Priority: 'Medium' , DueDate: '15/03/2022', Budget : '€ 200', SubmissionDate: '13/03/2022', Status: 'Active', },
    {ID: '#867953826',QuotationTitle:'Lorem Ipsum' , Priority: 'Low' , DueDate: '15/03/2022', Budget : '€ 200', SubmissionDate: '13/03/2022', Status: 'Inactive', },
  ]

  RFQDisplayedColumns: string[] = ['ID','QuotationTitle', 'Priority', 'DueDate','Budget','SubmissionDate', 'Status' ,'action'];
  resultsLength = 0;

  ngOnInit(): void {
  }

  onKeyUp(xyz:any){}

  openRFQDeleteDialog(){
    const dialogRef = this.dialog.open(DeletePopupComponent,{
      data:{message:'Are you sure you want to delete this RFQ?',heading:'Delete RFQ'}
    })
  }
}
