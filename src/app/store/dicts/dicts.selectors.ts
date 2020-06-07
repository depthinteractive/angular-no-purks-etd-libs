import {createSelector} from '@ngrx/store';
import {States} from '../states';
import {Dicts} from '../../models/dicts.model';
import {Entry} from '../../models/entry.model';

const getDictsState = (states: States) => states.dicts;

export const getDictsSelector = createSelector(getDictsState, (dicts: Dicts) =>
  dicts
);

export const getDictSelector = createSelector(getDictsState, (dicts, props: Entry) =>
  dicts[props.name] || null
);
