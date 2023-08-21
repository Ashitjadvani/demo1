export class FilterWidget {
  widget?: string;
  value_field?: string;
  label_field?: string;
  options?: any;
  inputField?: any;
}

export class ColumnTemplate {
  public columnName: string;
  public columnCaption: string;
  public columnDataField: string;
  public columnFormatter: string;
  public context: any;
  public isColumnShow?: boolean;
  public filterValue?: any;
  public filterWidget?: FilterWidget;
}
 