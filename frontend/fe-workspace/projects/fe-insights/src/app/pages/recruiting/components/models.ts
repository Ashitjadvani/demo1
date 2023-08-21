export class FilterWidget {
  widget?: string;
  value_field?: string;
  label_field?: string;
  options?: any;
}

export class ColumnTemplate {
  public columnName: string;
  public columnCaption: string;
  public columnDataField: string;
  public columnFormatter: string;
  public context: any;
  public filterValue?: any;
  public filterWidget?: FilterWidget;
}
