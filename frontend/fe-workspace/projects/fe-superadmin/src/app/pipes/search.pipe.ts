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
      return ateco.description.toString().toLowerCase().indexOf(searchTxt.toLowerCase()) > -1
    });
  }
}
