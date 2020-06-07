import {Dicts} from '../../models/dicts.model';
import {Entry} from '../../models/entry.model';
import {EMPTY} from './dicts.initial.empty';

const GROUPS: Entry[] = [{
  dragable: true,
  key: 'Obligation',
  title: 'Аналитический код раздела',
  isLeaf: true,
  prop: {
    used: true
  }
}, {
  dragable: true,
  key: 'IGK',
  title: 'ИГК',
  isLeaf: true,
  prop: {
    used: true
  }
}, {
  dragable: true,
  key: 'FAIP',
  title: 'ФАИП',
  isLeaf: true,
  prop: {
    used: true
  }
}, {
  dragable: false,
  key: 'subsidary_target',
  title: 'Источник поступления / Направление расходования',
  isLeaf: true,
  onlyLast: true,
  prop: {
    used: true
  }
}];

const INDICATORS: Entry[] = [
  {
    key: 'DATA_42',
    title: 'Разрешенный к использованию остаток на начало года',
    isLeaf: true
  }, {
    key: 'DATA_40',
    title: 'Поступления с учетом возвратов',
    isLeaf: true
  }, {
    key: 'DATA_136',
    title: 'Поступления',
    isLeaf: true
  }, {
    key: 'DATA_137',
    title: 'Возврат поступлений',
    isLeaf: true
  }, {
    key: 'DATA_41',
    title: 'Выплаты с учетом восстановлений',
    isLeaf: true
  }, {
    key: 'DATA_134',
    title: 'Выплаты',
    isLeaf: true
  }, {
    key: 'DATA_135',
    title: 'Восстановление выплат',
    isLeaf: true
  }, {
    key: 'BALANCE',
    title: 'Остаток',
    isLeaf: false,
    children: [
      {
        key: 'BALANCE_TOTAL',
        title: 'Всего',
        relative: ['DATA_40', 'DATA_41', 'DATA_136', 'DATA_137', 'DATA_134'],
        isLeaf: true
      },
      {
        key: 'DATA_59',
        title: 'В том числе на начало года',
        isLeaf: true
      }
    ]
  }, {
    key: 'DATA_140',
    title: 'Остаток (контрольный)',
    isLeaf: true
  },
  {
    key: 'DATA_3',
    title: 'Остаток плановый (контрольный)',
    isLeaf: true
  },
  {
    key: 'NON_EXPENDABLE_FUNDS',
    title: 'Средства без права расходования',
    isLeaf: true,
  }, {
    key: 'DATA_43',
    title: 'Суммы возврата дебиторской задолженности прошлых лет, разрешенных к использованию',
    isLeaf: true
  }, {
    key: 'PLANNED_INCOME',
    title: 'Планируемые поступления',
    children: [{
      key: 'DATA_44',
      title: 'текущего года',
      isLeaf: true
    }, {
      key: 'DATA_45',
      title: 'первого года планируемого периода',
      isLeaf: true
    }, {
      key: 'DATA_46',
      title: 'второго года планируемого периода',
      isLeaf: true
    }, {
      key: 'DATA_47',
      title: 'последующих лет',
      isLeaf: true
    }]
  }, {
    key: 'PLANNED_PAYOUTS',
    title: 'Планируемые выплаты',
    children: [{
      key: 'DATA_48',
      title: 'текущего года',
      isLeaf: true
    }, {
      key: 'DATA_49',
      title: 'первого года планируемого периода',
      isLeaf: true
    }, {
      key: 'DATA_50',
      title: 'второго года планируемого периода',
      isLeaf: true
    }, {
      key: 'DATA_51',
      title: 'последующих лет',
      isLeaf: true
    }]
  }, {
    key: 'UNUSED_BALANCE',
    title: 'Неиспользованный разрешенный остаток',
    children: [{
      key: 'UNUSED_INCOME_BALANCE',
      title: 'поступлений',
      isLeaf: true,
      relative: ['DATA_44', 'DATA_40']
    }, {
      key: 'UNUSED_PAYOUT_BALANCE',
      title: 'выплат',
      isLeaf: true,
      relative: ['DATA_41', 'DATA_48']
    }]
  }, {
    key: 'LETTER_OF_CREDIT',
    title: 'Аккредитив',
    children: [{
      key: 'DATA_56',
      title: 'получено',
      isLeaf: true
    }, {
      key: 'DATA_57',
      title: 'переведено',
      isLeaf: true
    }, {
      key: 'DATA_58',
      title: 'исполнено',
      isLeaf: true
    }, {
      key: 'LETTER_OF_CREDIT_BALANCE',
      title: 'остаток',
      isLeaf: true,
      relative: ['DATA_56', 'DATA_57', 'DATA_58']
    }]
  }
];

export const dictsInitialStateCommon: Dicts = {
  pAccountWithPBudget: [...EMPTY],
  subsidary_target_expense: [...EMPTY],
  subsidary_target_income: [...EMPTY],
  FAIP: [...EMPTY],
  groups: [...GROUPS],
  IGK: [...EMPTY],
  Obligation: [...EMPTY],
  indicators: [...INDICATORS]
};

