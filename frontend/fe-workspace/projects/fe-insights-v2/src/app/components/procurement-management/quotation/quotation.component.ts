import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})
export class QuotationComponent implements OnInit {

  page = 1;
  itemsPerPage = '5';
  totalItems = 0;
  
  search = '';
  sortKey = 'createdAt';
  sortBy = -1;
  sortClass = 'down';
  quotationList = [
    {quotationID:'#435684253',quotationTitle:'Lorem Ipsum',supplierName:'Alice Alli',quotationPrice:'€ 150',budget:'€ 100',priority:'HIgh'},
    {quotationID:'#564874552',quotationTitle:'Lorem Ipsum',supplierName:'Patrizia Ammirati',quotationPrice:'€ 200',budget:'€ 150',priority:'Medium'},
    {quotationID:'#468572538',quotationTitle:'Lorem Ipsum',supplierName:'Maria Angela',quotationPrice:'€ 300',budget:'€ 250',priority:'Low'},
    {quotationID:'#468352549',quotationTitle:'Lorem Ipsum',supplierName:'Sara Avanzo',quotationPrice:'€ 475',budget:'€ 400',priority:'HIgh'},
    {quotationID:'#132685974',quotationTitle:'Lorem Ipsum',supplierName:'Giulia Bacchetti',quotationPrice:'€ 350',budget:'€ 300',priority:'Medium'},
    {quotationID:'#867953826',quotationTitle:'Lorem Ipsum',supplierName:'Silvia Daniela',quotationPrice:'€ 755',budget:'€ 700',priority:'Low'}
  ];
  quotationDisplayedColumns: string[] = ['quotationID', 'quotationTitle', 'supplierName' , 'quotationPrice','budget', 'priority', 'viewDetails' , 'action'];

  constructor() { }

  ngOnInit(): void {
  }

  onKeyUp($event){}
  changeSelectOption(){}
  pageChanged($event){}


}
