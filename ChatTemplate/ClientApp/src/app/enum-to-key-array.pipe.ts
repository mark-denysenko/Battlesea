import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToKeyArray'
})
export class EnumToKeyArrayPipe implements PipeTransform {

  transform(value: any): any {
    const keys = Object.keys(value);
    return keys.slice(keys.length / 2);
  }

}
