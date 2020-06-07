import * as IndicatorsActions from './indicators.actions';
import {indicatorsInitialState} from './indicators.initial';
import {StatesService} from '../../services/states.service';
import {TypedEntry} from '../../models/entry.model';

const $states: StatesService = StatesService.instance;
const $$indicators: TypedEntry<string[]> = $states.getIndicators(indicatorsInitialState);

let $$mode: string = $states.mode;

export function IndicatorsReducer(
  indicators: string[] = [],
  actions: IndicatorsActions.Actions
) {
  switch (actions.type) {
    case IndicatorsActions.SET_INDICATORS:
      indicators = actions.indicators;
      setIndicators(indicators);
      return [...indicators];

    case IndicatorsActions.CHANGE_MODE:
      $$mode = actions.mode;
      indicators = $$indicators[$$mode];
      return [...indicators];

    default:
      return indicators;
  }
}

function setIndicators(indicators: string[]) {
  $$indicators[$$mode] = indicators;
}
