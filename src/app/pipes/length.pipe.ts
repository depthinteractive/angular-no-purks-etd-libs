import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'length'
})
export class LengthPipe implements PipeTransform {

  public transform(value: Array<any> | string): number | null {
    if (!value || typeof value.length === 'undefined'){
      return null;
    }

    return value.length;
  }
}
