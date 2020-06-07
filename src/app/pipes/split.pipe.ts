import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
  public transform(value: string, seporator: string = ',', trim: boolean = false, index: number | null = null): string | string[] {
    if (typeof value !== 'string') {
      return '';
    }

    let arr = value.split(seporator);

    if (trim) {
      arr = arr.map(item => item.trim());
    }

    if (index !== null) {
      return arr[index] || '';
    }

    return arr;
  }
}
