import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {AppComponent} from './app.component';

const routes: Routes = [{
  path: '',
  component: AppComponent
}, {
  path: '**',
  redirectTo: ''
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
