import {Entry} from '../../../models/entry.model';

export const MSINDAY = 86400000;

export const filtersFieldsMeta: {[key: string]: Entry} = {
  FAIP: {
    label: 'ФАИП',
    placeholder: 'Выберите ФАИП',
    title: 'Федеральная государственная инвестиционная программа'
  },
  IGK: {
    label: 'ИГК',
    placeholder: 'Выберите ИГК',
    title: null
  },
  Obligation: {
    label: 'Аналитический код раздела',
    placeholder: 'Выберите аналитический код раздела',
    title: null
  },
  subsidary_target_expense: {
    label: 'Направления расходования',
    placeholder: 'Выберите направления расходования',
    title: 'Коды направления расходования целевых средств'
  },
  subsidary_target_income: {
    label: 'Источники поступлений',
    placeholder: 'Выберите источники поступлений',
    title: null
  },
  letterOfCreditNumber: {
    label: 'Номер аккредитива',
    placeholder: 'Выберите номер аккредитива',
    title: null
  },
};
