import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {ConfigService} from './config.service';
import {environment} from '../../environments/environment';
import {Store} from '@ngrx/store';
import {States} from '../store/states';
import * as AppActions from '../store/app/app.actions';

@Injectable({
  providedIn: 'root'
})
export class SystemInfoService {
  private environment;

  constructor(
    private store: Store<States>,
    private $config: ConfigService,
    private $request: RequestService
  ) {
    this.environment = environment;
  }

  public onInit(): void {
    this.store
      .dispatch(
        new AppActions.AddSystemInfo( 'Версия интерфейса', this.environment.version)
      );

    this.$request
      .get(
        this.$config.get('rest', 'getAppVersion'),
        {responseType: 'text'}
      )
      .subscribe( ({success, data}) =>
        this.store
          .dispatch(
            new AppActions.AddSystemInfo( 'Версия приложения', success ? data : 'null' )
          )
      );
  }
}
