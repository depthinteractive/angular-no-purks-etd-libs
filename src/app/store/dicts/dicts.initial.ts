import {dictsInitialStateCommon} from './dicts.initial.common';
import {dictsInitialStateLetterOfCredit} from './dicts.initial.letterOfCredit';
import {Dicts} from '../../models/dicts.model';
import {TypedEntry} from '../../models/entry.model';

export const dictsInitialState: TypedEntry<Dicts> = {
  common: dictsInitialStateCommon,
  letterOfCredit: dictsInitialStateLetterOfCredit,
};
