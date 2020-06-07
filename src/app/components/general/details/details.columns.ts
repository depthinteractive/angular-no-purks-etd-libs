export const COLUMNS: {key: string, title: string, type?: string, renderer?: ( value ) => string }[] = [{
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
}, {
  key: 'DOC_H_TYPE',
  title: 'Наименование документа'
}, {
  key: 'DOC_H_REG_NUM',
  title: 'Номер документа'
}, {
  key: 'DOC_H_REG_DATE',
  title: 'Дата документа'
}, {
  key: 'DOC_H_REG_SUM',
  title: 'Сумма',
  type: 'number'
}, {
  key: 'XXT_L_AKR_NUM',
  title: 'Номер КОО'
}];

export const WIDTH_CONFIG: string[] = [/*'50px', '110px', '110px', '160px', '150px', '200px',*/
  '50px', '25%', '25%', 'auto', '150px', 'auto', '50px'
];

