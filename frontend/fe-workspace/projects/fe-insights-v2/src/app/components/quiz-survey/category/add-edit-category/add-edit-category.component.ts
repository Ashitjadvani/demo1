import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {
  addCategoryForm:FormGroup;
  title ='Add';
  
  constructor(public _categoriesForm:FormBuilder) {
    this.addCategoryForm = this._categoriesForm.group({
      categoryNameEnglish :[null,[Validators.required]],
      categoryNameItalian :[null,[Validators.required]]
    })
   }

  ngOnInit(): void {
  }
  changeCategory(){}
}
