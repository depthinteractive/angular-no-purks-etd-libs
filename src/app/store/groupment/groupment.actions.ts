import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Entry } from '../../models/entry.model';
import {NzFormatEmitEvent} from 'ng-zorro-antd';

export const ADD_GROUP     = '[Groupment] add group';
export const REMOVE_GROUP  = '[Groupment] remove group';
export const REORDER_GROUP = '[Groupment] reorder group';
export const CHANGE_MODE   = '[Groupment] change mode';
export const VOID          = '[Groupment] void';

export class AddGroup implements Action {
    readonly type = ADD_GROUP;
    
    constructor(public group: Entry ) {}
}

export class RemoveGroup implements Action {
    readonly type = REMOVE_GROUP;
    
    constructor( public groupKey: string ) {}
}

export class ReorderGroup implements Action {
    readonly type = REORDER_GROUP;
    
    constructor( public reorder: NzFormatEmitEvent ) {}
}

export class ChangeMode implements Action {
  readonly type = CHANGE_MODE;

  constructor( public mode: string = null ) {}
}

export class Void implements Action {
  readonly type = VOID;

  constructor( ...args ) { }
}

export type Actions = AddGroup | RemoveGroup | ReorderGroup | ChangeMode;
