import * as DetailsActions from './details.actions';
import {Details} from '../../../models/details.model';
import {detailsDataInitialState} from './details.initial';
import {Entry, TypedEntry} from '../../../models/entry.model';
import {StatesService} from '../../../services/states.service';

const $states: StatesService = StatesService.instance;
let $$mode: string = $states.mode;

const $$details: TypedEntry<Details> = $states.getDetails(
  {common: new Details(), letterOfCredit: new Details()}
);
const $$detailsData: TypedEntry<Entry[]> = {
  common: $$details['common'].data,
  letterOfCredit: $$details['letterOfCredit'].data
};

export function DetailsDataReducer(
  details: Details = $$details[$$mode],
  actions: DetailsActions.Actions
) {
  const columns = ['PA', 'Obligation', 'FAIP', 'IGK', 'subsidary_target'];

  switch (actions.type) {
    case DetailsActions.GET_DETAILS:
      details.visible = true;
      details.loading = true;
      return details;

    case DetailsActions.SET_DETAILS:
      let detailsData: Array<Entry> = actions.details;
      const indicators: string[] = actions.indicators;

      if (indicators !== null) {
        detailsData = detailsData.filter(item =>
          indicators
            .some(indicator => {
              const value = parseFloat(item[indicator]);
              return value !== 0 && !isNaN(value);
            }));
      }

      if (indicators === null) {
        detailsData = detailsData.filter((row: Entry, index: number, array: Entry[]) =>
          index === array.findIndex(({DOC_H_GUID}: Entry) =>
          row.DOC_H_GUID === DOC_H_GUID
          )
        );
      }

      detailsData.forEach(item => {
        const documentSumKey = Object
          .keys(item)
          .filter((key) =>
            key.includes('DATA_')
          )
          .sort()
          .find((key) =>
            parseFloat(item[key]) !== 0
          );

        item.DOC_H_REG_SUM = item[documentSumKey];

        Object
          .keys(item)
          .filter(key =>
            key.includes('DATA_')
          )
          .forEach(key =>
            delete item[key]
          );
      });

      details.data = detailsData;
      details.loading = false;

      changeDetails(details);
      return details;

    case DetailsActions.CLEAR_DETAILS:
      details = new Details();
      changeDetails(details);
      return details;

    case DetailsActions.CHANGE_MODE:
      $$mode = actions.mode;
      details.data = $$detailsData[$$mode];

      return details;

    default:
      return details;
  }

  function changeDetails(_details: Details): void {
    $$detailsData[$$mode] = _details.data;
  }
}

function isUndefined(object: any): boolean {
  return typeof object === 'undefined';
}
