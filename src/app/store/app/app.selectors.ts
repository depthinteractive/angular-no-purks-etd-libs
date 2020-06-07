import {createSelector} from '@ngrx/store';
import {App} from '../../models/app.model';
import {States} from '../states';

export namespace AppSelectors {
  export const getAllStates = (states: States) => states;
  export const getAppState = (states: States) => states.app;

  export const getAllStatesSelector = createSelector(getAllStates, (states: States) => states);
  export const getAppStateSelector = createSelector(getAppState, (app: App) => app);
  export const getSettingsCollapse = createSelector(getAppState, (app: App) => app.settingsCollapse);
  export const getMode = createSelector(getAppState, (app: App) => app.mode);
  export const getModeLoading = createSelector(getAppState, (app: App) => app.modeLoading);
  export const getSystemInfo = createSelector(getAppState, ({systemInfo}) => systemInfo);
  export const getSelectedModeIndexSelector = createSelector(getAppState, ({mode}) => mode === 'common' ? 0 : 1);
}
