/**
 * Created by cyw on 2017/10/16.
 */
const SIGN_REGEXP = /([yMdhsm])(\1*)/g;
const DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
  len -= (`${s}`).length;
  for (let i = 0; i < len; i++) { s = `0${s}`; }
  return s;
}

export default {
  getQueryStringByName(name) {
    let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    let r = window.location.search.substr(1).match(reg);
    let context = '';
    if (r != null) { context = r[2]; }
    reg = null;
    r = null;
    return context === null || context === '' || context === 'undefined' ? '' : context;
  },
  formatDate: {
    format(date, pattern) {
      pattern = pattern || DEFAULT_PATTERN;
      return pattern.replace(SIGN_REGEXP, ($0) => {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length);
          case 'M':
            return padding(date.getMonth() + 1, $0.length);
          case 'd':
            return padding(date.getDate(), $0.length);
          case 'w':
            return date.getDay() + 1;
          case 'h':
            return padding(date.getHours(), $0.length);
          case 'm':
            return padding(date.getMinutes(), $0.length);
          case 's':
            return padding(date.getSeconds(), $0.length);
          default:
            return false;
        }
      });
    },
    parse(dateString, pattern) {
      const matchs1 = pattern.match(SIGN_REGEXP);
      const matchs2 = dateString.match(/(\d)+/g);
      if (matchs1.length === matchs2.length) {
        const date = new Date(1970, 0, 1);
        for (let i = 0; i < matchs1.length; i++) {
          const int = parseInt(matchs2[i]);
          const sign = matchs1[i];
          switch (sign.charAt(0)) {
            case 'y': date.setFullYear(int); break;
            case 'M': date.setMonth(int - 1); break;
            case 'd': date.setDate(int); break;
            case 'h': date.setHours(int); break;
            case 'm': date.setMinutes(int); break;
            case 's': date.setSeconds(int); break;
            default:
                return false;
          }
        }
        return date;
      }
      return null;
    }

  }

};
