import {Entry} from '../../models/entry.model';
import {dictsInitialState} from '../dicts/dicts.initial';

export const groupmentInitialState: { [key: string]: Entry[] } = {
  common: dictsInitialState.common.groups,
  letterOfCredit: dictsInitialState.letterOfCredit.groups
};

