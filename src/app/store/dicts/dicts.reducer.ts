import {Dicts} from '../../models/dicts.model';

import * as DictsActions from './dicts.actions';
import {dictsInitialState} from './dicts.initial';
import {StatesService} from '../../services/states.service';
import {TypedEntry} from '../../models/entry.model';

const $states: StatesService = StatesService.instance;

const $$dicts: TypedEntry<Dicts> = $states.getDicts(dictsInitialState);
let $$mode: string = $states.mode;

export function DictsReducer(
  dicts: Dicts = {},
  actions: DictsActions.Actions
) {
  switch (actions.type) {
    case DictsActions.SET_DICT:
      dicts[actions.dictaName] = actions.dict;
      changeDicts(dicts);
      return {...dicts};

    case DictsActions.CHANGE_MODE:
      $$mode = actions.mode;
      dicts = $$dicts[$$mode];
      return {...dicts};

    default:
      return dicts;
  }

  function changeDicts(dicts: Dicts): void {
    $$dicts[$$mode] = dicts;
  }
}
