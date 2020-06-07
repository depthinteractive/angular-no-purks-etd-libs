import {Entry} from '../../../models/entry.model';

export const COLUMNS: {[k: string]: Entry[]} = {
  common: [
    {
      key: 'DOC_H_TYPE',
      title: 'Документ'
    }, {
      key: 'DOC_H_REG_NUM',
      title: 'Номер документа'
    }, {
      key: 'DOC_H_REG_DATE',
      title: 'Дата документа'
    }, {
      class: '_text-right',
      key: 'DOC_H_REG_SUM',
      title: 'Сумма',
      type: 'number'
    }, {
      key: 'XXT_L_AKR_NUM',
      title: 'Номер КОО'
    }
  ],
  letterOfCredit: [
    {
      key: 'PA',
      title: 'Лицевой счет'
    }, {
      key: 'Obligation',
      title: 'Аналитический код раздела'
    }, {
      key: 'IGK',
      title: 'ИГК'
    }, {
      key: 'letterOfCreditNumber',
      title: 'Номер аккредитива'
    }, {
      key: 'DOC_H_TYPE',
      title: 'Документ'
    }, {
      key: 'DOC_H_REG_NUM',
      title: 'Номер документа'
    }, {
      key: 'DOC_H_REG_DATE',
      title: 'Дата документа'
    }, {
      class: '_text-right',
      key: 'DOC_H_REG_SUM',
      title: 'Сумма',
      type: 'number'
    }
  ]
};

export const PARAMETERS: {[k: string]: Entry[]} = {
  common: [
    {
      key: 'PA',
      title: 'Лицевой счет'
    }, {
      key: 'Obligation',
      title: 'Аналитический код раздела'
    }, {
      key: 'IGK',
      title: 'ИГК'
    }, {
      key: 'FAIP',
      title: 'ФАИП'
    }, {
      key: 'subsidary_target',
      title: 'Источники поступлений/направления расходования'
    }
  ],
  letterOfCredit: null
};

export const WIDTH_CONFIG: {[k: string]: string[]} = {
  common: [ '50px', '25%', '25%', 'auto', '150px', 'auto', '50px' ],
  letterOfCredit: [ '50px', '110px', '130px', '180px', '180px', '180px', '180px', '100px', '150px', '50px' ]
};
