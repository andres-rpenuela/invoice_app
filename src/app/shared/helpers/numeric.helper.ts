

export class NumericHelper {
  static NAN = NaN;

  static textToDecimal(val: any, locale: string): number | null {
    if (val === null || val === undefined || val === '') return null;

    let str = String(val).trim();

    let isNegative = false;
    if (str.startsWith('-')) {
      isNegative = true;
      str = str.slice(1);
    }

    let parsedStr = '';
    let isPartial = false;

    if (locale.startsWith('es')) {
      // es-ES: miles = '.', decimal = ','
      if (/^([0-9]{1,3}(\.[0-9]{3})*|[0-9]+)(,[0-9]*)?$/.test(str)) {
        const parts = str.split(',');
        const intPart = parts[0].replace(/\./g, '');
        const decPart = parts[1] ?? '';
        parsedStr = decPart ? `${intPart}.${decPart}` : intPart;
        if (str.endsWith(',')) isPartial = true; // estado intermedio
      } else {
        return null; // completamente inválido
      }
    } else if (locale.startsWith('en')) {
      // en-US: miles = ',', decimal = '.'
      if (/^([0-9]{1,3}(,[0-9]{3})*|[0-9]+)(\.[0-9]*)?$/.test(str)) {
        const parts = str.split('.');
        const intPart = parts[0].replace(/,/g, '');
        const decPart = parts[1] ?? '';
        parsedStr = decPart ? `${intPart}.${decPart}` : intPart;
        if (str.endsWith('.')) isPartial = true; // estado intermedio
      } else {
        return null;
      }
    } else {
      parsedStr = str.replace(/[^0-9.-]/g, '');
    }

    const num = parseFloat(parsedStr);
    if (isNaN(num) || isPartial) {
      // valor parcial: devuelve null pero mantiene el input
      return null;
    }

    return isNegative ? -num : num;
  }
}
