

export class NumericHelper {
  static NAN = NaN;

  static textToDecimal(input: string, idioma: string): number | null {
    if (!input || typeof input !== 'string') return null;

    input = input.trim();

    // Detectar negativo
    const isNegative = input.startsWith('-');
    if (isNegative) {
      input = input.substring(1);
    }

    const isSpanish = idioma?.toLowerCase().startsWith('es');

    let pattern: RegExp;

    if (isSpanish) {
      // Español: miles con . y decimales con ,
      pattern = /^\d{1,3}(\.\d{3})*(,\d+)?$|^\d+(,\d+)?$/;

      if (!pattern.test(input)) return null;

      input = input.replace(/\./g, '').replace(',', '.');
    } else {
      // Inglés: miles con , y decimales con .
      pattern = /^\d{1,3}(,\d{3})*(\.\d+)?$|^\d+(\.\d+)?$/;

      if (!pattern.test(input)) return null;

      input = input.replace(/,/g, '');
    }

    let result = Number(input);

    if (isNaN(result)) return null;

    return isNegative ? -result : result;
  }

  static textToInteger(input: string, idioma: string): number | null {
    if (!input || typeof input !== 'string') return null;

    input = input.trim();

    const isNegative = input.startsWith('-');
    if (isNegative) {
      input = input.substring(1);
    }

    const isSpanish = idioma?.toLowerCase().startsWith('es');

    let pattern: RegExp;

    if (isSpanish) {
      // SOLO enteros (sin decimales)
      pattern = /^\d{1,3}(\.\d{3})*$|^\d+$/;

      if (!pattern.test(input)) return null;

      input = input.replace(/\./g, '');
    } else {
      pattern = /^\d{1,3}(,\d{3})*$|^\d+$/;

      if (!pattern.test(input)) return null;

      input = input.replace(/,/g, '');
    }

    let result = Number(input);

    if (isNaN(result)) return null;

    return isNegative ? -result : result;
  }

  static decimalToText(value: number, idioma: string, decimals?: number): string | null {
    if (value === null || value === undefined || isNaN(value)) return null;

    const isSpanish = idioma?.toLowerCase().startsWith('es');

    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimals ?? 0,
      maximumFractionDigits: decimals ?? 20
    };

    const locale = isSpanish ? 'es-ES' : 'en-US';

    return new Intl.NumberFormat(locale, options).format(value);
  }


}
