import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../popup/delete-popup/delete-popup.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  page = 1;
  itemsPerPage = '5';
  totalItems = 0;
  search = '';
  sortKey = 1;
  sortBy = '';
  sortClass = 'down';

  constructor(public dialog: MatDialog) { }

  categoriesList=[
    {catrgory:'Mathematics'},
    {catrgory:'Development'},
    {catrgory:'Design'},
    {catrgory:'UI/UX'},
    {catrgory:'Java Developer'},
    {catrgory:'Mathematics'},
    {catrgory:'Design'}

  ]
  categoriesDisplayedColumns: string[]= ['catrgory','action']


  ngOnInit(): void {
  }

  openAccountDeleteDialog(){
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {message: 'Are you sure you want to delete this Category?', heading: 'Delete Category'}
    });
  }


  onKeyUp($event){}
  changeSelectOption(){}
  pageChanged($event){}

}
