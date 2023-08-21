import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableDataViewComponent} from './components/table-data-view/table-data-view.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {TranslateModule} from '@ngx-translate/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MaterialDesignModule} from '../../core/material-design';
import {ActionTileComponent} from './components/action-tile/action-tile.component';
import { FiltersDialogComponent } from './components/filtering/filters-dialog/filters-dialog.component';
import {MatSliderModule} from '@angular/material/slider';


@NgModule({
  declarations: [TableDataViewComponent, ActionTileComponent, FiltersDialogComponent],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    TranslateModule,
    MatFormFieldModule,
    MaterialDesignModule,
    MatSliderModule
  ],
  exports: [
    ActionTileComponent,
    TableDataViewComponent
  ]
})
export class SharedModule {
}
