import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getExpandColStyle'
})
export class GetExpandColStyle implements PipeTransform {
  transform( level: number, args?: any): object {
    const style = {
      'text-align': 'left'
    };
    let paddingLeft: number = 30 + level * 20;

    style['padding-left'] = paddingLeft + 'px';
    style['padding-left'] = paddingLeft + 'px';

    return style;
  }
}
