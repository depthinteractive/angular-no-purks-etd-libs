import {App} from '../../models/app.model';
import * as Actions from './app.actions';
import {AppInititalState} from './app.initial';
import {StatesService} from '../../services/states.service';

const $states: StatesService = StatesService.instance;
const initialState: App = $states.app || AppInititalState;
initialState.systemInfo = [];

export function AppReducer(
  state: App = initialState,
  action: Actions.Actions
) {
  switch (action.type) {
    case Actions.ADD_SYSTEM_INFO:
      const {title, value} = action;
      state.systemInfo.push({title, value});
      return {...state};

    case Actions.COLLAPSE_SETTINGS:
      state.settingsCollapse = action.collapse !== null ? action.collapse : !state.settingsCollapse;
      return {...state};

    case Actions.SET_MODE: {
      const {mode} = action;
      return {...state, mode};
    }

    case Actions.SET_MODE_LOADING:
      const {modeLoading} = action;
      return {...state, modeLoading};

    default:
      return state;
  }
}
