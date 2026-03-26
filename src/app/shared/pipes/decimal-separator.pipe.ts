import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear números con separador decimal según el idioma.
 * Uso: {{ value | decimalSeparator:locale }}
 */
@Pipe({
  name: 'decimalSeparator',
  standalone: true
})
export class DecimalSeparatorPipe implements PipeTransform {

  transform(
    value: number | string | null,
    locale: string = navigator.language,
    minDecimals: number = 2,
    maxDecimals: number = minDecimals
  ): string {

    if (value === null || value === undefined || value === '') return '';

    let num: number;

    if (typeof value === 'string') {
      let str = value.trim();

      let isNegative = false;
      if (str.startsWith('-')) {
        isNegative = true;
        str = str.substring(1);
      }

      str = str.replace(/,/g, '.');

      num = parseFloat(str);

      if (isNaN(num)) return '';

      if (isNegative) num = -num;

    } else {
      num = value;
    }

    if (isNaN(num)) return '';

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals
    }).format(num);
  }
}
