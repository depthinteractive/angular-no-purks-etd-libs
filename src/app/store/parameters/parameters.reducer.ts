import * as ParametersActions from './parameters.actions';
import {parametersInitialState} from './parameters.initial';
import {Parameters} from '../../models/general/parameters/parameters.model';
import {TypedEntry} from '../../models/entry.model';
import {StatesService} from '../../services/states.service';
import {LocalStorageService} from '../../services/local-storage.service';

const $states: StatesService = StatesService.instance;
const $parameters: TypedEntry<Parameters> = $states.getParameters({
  common: {...parametersInitialState},
  letterOfCredit: {...parametersInitialState},
});

let mode: string = $states.mode;
const initialState = $parameters[mode];

export function ParametersReducer(
  parameters: Parameters = initialState,
  actions: ParametersActions.Actions
) {
  switch (actions.type) {
    case ParametersActions.SET_BUTTON_STATE:
      parameters.buttonEnable = actions.state;
      setParameters(parameters);
      return parameters;

    case ParametersActions.SET_PARAMETER:
      parameters[actions.name] = actions.value;
      setParameters(parameters);
      return {...parameters};

    case ParametersActions.SET_PARAMETERS:
      Object.assign(parameters, actions.parameters);
      setParameters(parameters);
      return {...parameters};

    case ParametersActions.CHANGE_MODE:
      parameters = $parameters[actions.mode] || parametersInitialState;
      mode = actions.mode;
      setParameters(parameters);
      return {...parameters};

    default:
      return parameters;
  }
}

function setParameters(parameters): void {
  $parameters[mode] = parameters;
}

