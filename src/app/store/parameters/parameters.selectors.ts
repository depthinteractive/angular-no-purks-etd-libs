import {createSelector} from '@ngrx/store';
import {States} from '../states';
import {Parameters} from '../../models/general/parameters/parameters.model';

export namespace ParametersSelectors {
  const getAppMode = (states: States) => states.app.mode;
  export const getParametersState = (states: States) => states.parameters;

  export const getParameters = createSelector(getParametersState, (parameters: Parameters) =>
    parameters
  );

  export const getPDate = createSelector(getParametersState, ({pDate}: Parameters) =>
    pDate
  );

  export const getOrganizationSelector = createSelector(getParametersState, ({organization}: Parameters) =>
    organization
  );

  export const getParameter = createSelector(getParametersState, (parameters: Parameters, props: {name}) =>
    parameters[name] || null
  );
}
