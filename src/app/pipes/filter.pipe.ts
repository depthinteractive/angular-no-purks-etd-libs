import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  public transform<T>(values: T[], key: string, searchValue: any, direct: boolean = true): T[] {
    const stringedSearchValue: string = String(searchValue).toLowerCase();

    return values.filter(value => {
      const result: boolean = this.compareValues(searchValue, stringedSearchValue, value);
      return (direct && result) || (!direct && !result);
    })
  }

  private compareValues(searchValue: any, stringedSearchValue: string, comparedValue: any): boolean {
    const stringedCompareValue: string = String(comparedValue).toLowerCase();
    return searchValue === comparedValue || stringedCompareValue.includes(stringedSearchValue);
  }
}
