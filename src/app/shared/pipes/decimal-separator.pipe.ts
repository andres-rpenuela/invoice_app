import { Pipe, PipeTransform } from '@angular/core';

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

    minDecimals = this.normalizeDecimals(minDecimals);
    maxDecimals = this.normalizeDecimals(maxDecimals);

    if (maxDecimals < minDecimals) {
      maxDecimals = minDecimals;
    }

    let num: number;

    if (typeof value === 'string') {
      let str = value.trim();

      const isSpanish = locale.startsWith('es');

      const negative = str.startsWith('-');
      if (negative) str = str.slice(1);

      let regex: RegExp;

      if (isSpanish) {
        // SOLO válido:
        // 1.234,56 | 1234,56 | 1234 | 1,22
        regex = /^\d{1,3}(\.\d{3})*(,\d+)?$|^\d+(,\d+)?$/;

        if (!regex.test(str)) return '';

        str = str.replace(/\./g, '').replace(',', '.');
      } else {
        // US: 1,234.56 | 1234.56 | 1234
        regex = /^\d{1,3}(,\d{3})*(\.\d+)?$|^\d+(\.\d+)?$/;

        if (!regex.test(str)) return '';

        str = str.replace(/,/g, '');
      }

      num = Number(str);

      if (isNaN(num)) return '';

      if (negative) num = -num;

    } else {
      num = value;
    }

    if (isNaN(num)) return '';

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals
    }).format(num);
  }

  private normalizeDecimals(value: any): number {
    const num = Number(value);

    if (isNaN(num)) return 0;

    return Math.min(Math.max(num, 0), 20);
  }
}
