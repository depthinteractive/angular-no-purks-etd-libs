import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

export class ObservableUtil {
  public static take<T>(observable: Observable<T>, whenNull: any = null): T {
    let value: T;

    if (!observable) {
      return whenNull;
    }

    observable
      .pipe(
        take(1)
      )
      .subscribe((_value: T) =>
        value = _value
      );

    return value;
  }
}

