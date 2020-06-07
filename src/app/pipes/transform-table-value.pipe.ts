import { Pipe, PipeTransform} from '@angular/core';

const WHEN_NULL = 'Пусто';

@Pipe({name: 'transformTableValue'})
export class TransformTableValuePipe implements PipeTransform {
  transform( value: any, type: string = null, whenNull: string = WHEN_NULL ) {
    if ( value instanceof Object ) {
      return;
    }

    if ( type == null ) {
      type = typeof value;
    }
    switch ( type ) {
      case 'number':
        return transformAsNumberType( value );

      default:
        return transformAsAnyType( value, whenNull );
    }
  }
}


const transformAsAnyType = ( inputValue: any, whenNull: string ): string => {
  switch ( inputValue ) {
    case null:
    case '-':
    case '':
    case undefined:
      return whenNull;

    default:
      return inputValue + '';
  }
};

const transformAsNumberType = ( inputValue: any ): string => {
  let value: number = parseFloat( inputValue );

  if ( isNaN( value ) ) { value = 0.00; }

  return value.toFixed(2).replace(/(?=(\d{3})+(?!\d))/g, ' ');
};
