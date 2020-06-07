import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rendererTableValue'
})
export class RendererTableValuePipe implements PipeTransform {

  transform(value: any, key: string, row: {} ): any {
    switch ( key ) {
      case 'DATA_101':
        return this.getNumber( row['DATA_44']) - this.getNumber( row['DATA_40'] );

      case 'DATA_102':
        return this.getNumber( row['DATA_48']) - this.getNumber( row['DATA_41'] );

      case 'XXT_L_AKR_NUM':
        return row['XXT_L_AKR_NUM_CR'] || row['XXT_L_AKR_NUM_DR'];

      default:
        return value;
    }
  }

  private getNumber( value: any ): number {
    let num = Number( value );

    if ( isNaN( num ) ) {
      num = 0;
    }

    return num;
  }

}
