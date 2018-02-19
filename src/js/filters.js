/**
 * Created by cyw on 2017/10/16.
 */

import date from './date';

const formatMoney = value => (!value || value === '' ? parseFloat(0).toFixed(2) : parseFloat(value).toFixed(2));
const formatAttribute = value => {
  let a;
  if (value && value !== '') {
    a = value.split('；');
    if (a.length > 1 && a[1] !== '') {
      let attribute = '';
      let i = 0;
      for (i = 0; i < a.length - 2; i++) {
        attribute += `${a[i]}；`;
      }
      return attribute + a[i];
    }
      return a[0];
  }
    return '';
};

const formatDate = value => ((!value || value === '') ? '' : date.formatDate.format(new Date(value), 'yyyy-MM-dd hh:mm:ss'));

export { formatMoney, formatAttribute, formatDate };
