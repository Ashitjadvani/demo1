import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

  transform(atecoRecords: any[], searchTxt: string): any[] {
    if(!atecoRecords || !atecoRecords.length) return atecoRecords;
    if(!searchTxt || !searchTxt.length) return atecoRecords;
    return atecoRecords.filter(ateco => {
      if(ateco.description){
        return ateco.description.toString().toLowerCase().indexOf(searchTxt.toLowerCase()) > -1
      }else if(ateco.supplierActivity){
        return ateco.supplierActivity.toString().toLowerCase().indexOf(searchTxt.toLowerCase()) > -1
      }
      else{
        return ateco.activity.toString().toLowerCase().indexOf(searchTxt.toLowerCase()) > -1
      }
    });
  }
}
