import { Dicts } from '../../models/dicts.model';
import { Entry } from '../../models/entry.model';

import { EMPTY } from './dicts.initial.empty';

const GROUPS: Entry[] = [{
  dragable: true,
  key: 'Obligation',
  title: 'Аналитический код раздела (ИГК)',
  isLeaf: true,
  prop: {
    used: true
  }
}, {
  dragable: true,
  key: 'letterOfCreditNumber',
  title: 'Номер аккредитива',
  isLeaf: true,
  prop: {
    used: true
  }
}];

const INDICATORS: Entry[] = [{
  key: 'DATA_60',
  title: 'Получено',
  isLeaf: true
}, {
  key: 'DATA_62',
  title: 'Переведено',
  isLeaf: true
}, {
  key: 'DATA_61_63',
  title: 'Исполнено',
  children: [{
    key: 'DATA_63',
    title: 'по текущему',
    isLeaf: true
  }, {
    key: 'DATA_61',
    title: 'по нижестоящим',
    isLeaf: true
  }]
}, {
  key: 'BALANCE',
  title: 'Остаток',
  children: [{
    key: 'DATA_60_m_62_m_63',
    title: 'по текущему',
    isLeaf: true,
    relative: ['DATA_60', 'DATA_62', 'DATA_63']
  }, {
    key: 'DATA_62_m_61',
    title: 'по нижестоящим',
    isLeaf: true,
    relative: ['DATA_61', 'DATA_62']
  }]
}];

export const dictsInitialStateLetterOfCredit: Dicts = {
  pAccountWithPBudget:      [...EMPTY],
  groups:                   [...GROUPS],
  Obligation:               [...EMPTY],
  letterOfCreditNumber:     [...EMPTY],
  indicators:               [...INDICATORS]
};


