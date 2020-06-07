import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzNotificationService } from 'ng-zorro-antd';

import { States } from './../store/states';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(
    private store: Store<States>,
    private notifications: NzNotificationService
  ) {

    this.notifications.config({
      nzPlacement: 'bottomRight'
    });

    this.store.select( 'actions' )
      .subscribe( (action: {name: string, data: {title, message, type } }) => {
        if ( action.name === 'callNotification' ) {
          this.createNotification( action.data );
        }
    } );
  }

  public createNotification ( { title, message, type } ): void {
    switch ( type ) {
      case 'success':
      case 'warning':
      case 'error':
        this.notifications.create( type, title, message );
        break;

      default:
        this.notifications.create( 'info', title, message );
        break;
    }
  }

}
