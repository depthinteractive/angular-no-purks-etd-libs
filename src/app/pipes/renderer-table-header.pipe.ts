import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rendererTableHeader'
})
export class RendererTableHeaderPipe implements PipeTransform {

  transform( headerTitle: string, renderer: Function, value: boolean ): any {
    if ( renderer && value !== null ) {
      return renderer( value );
    }

    return headerTitle;
  }
}
