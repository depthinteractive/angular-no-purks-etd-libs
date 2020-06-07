import { Pipe, PipeTransform } from '@angular/core';
import {Entry} from '../models/entry.model';

@Pipe({
  name: 'subsidaryTargetTooltip'
})
export class SubsidaryTargetTooltipPipe implements PipeTransform {
  public transform(code: string, values: Entry[]): string {
    const value = values.find(({key}) => key === code);

    return !!value ? value.title : 'Наименование отсутствует';
  }
}
