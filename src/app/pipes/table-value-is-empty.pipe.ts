import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'tableValueIsEmpty'
})
export class TableValueIsEmptyPipe implements PipeTransform {
  public transform(value: any): boolean {
    return typeof value === 'undefined'
      || value === null
      || value === ''
      || value === '-';
  }
}
