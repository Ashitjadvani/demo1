import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DeletePopupComponent} from "../../../popup/delete-popup/delete-popup.component";

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss']
})
export class ProvinceComponent implements OnInit {

  page = 1;
  itemsPerPage = '5';
  totalItems = 0;
  search = '';
  sortKey = 1;
  sortBy = '';
  sortClass = 'down';

  constructor(public dialog: MatDialog) { }

  resourceGroupList=[
    {resourceType:'Room',name:'Conference Room',description:'Meeting Room Assets',availabilityStart:'04:30',availabilityHours:"24"},
    {resourceType:'Parking',name:'Vehicle Parking',description:'Lorem Ipsum',availabilityStart:'04:00',availabilityHours:"12"},
    {resourceType:'Desk',name:'Hotel Desk',description:'Lorem Ipsum',availabilityStart:'05:50',availabilityHours:"06"},
    {resourceType:'E-Charger',name:'Car E-Charger',description:'Lorem Ipsum',availabilityStart:'12:30',availabilityHours:"11"},
    {resourceType:'Car Wash',name:'Car Wash',description:'Lorem Ipsum',availabilityStart:'06:55',availabilityHours:"08"},
    {resourceType:'Other',name:'Lorem Ipsum',description:'Lorem Ipsum',availabilityStart:'11:45',availabilityHours:"10"}


  ]
  resourceGroupDisplayedColumns: string[]= ['wheelAction', 'Country', 'Region', 'Province'];

  ngOnInit(): void {
  }

  openAccountDeleteDialog(){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this Resource Group?', heading: 'Delete Resource Group'}
    });
  }

  onKeyUp($event){}
  changeSelectOption(){}
  pageChanged($event){}

}
