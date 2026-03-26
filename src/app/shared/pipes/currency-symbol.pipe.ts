import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para obtener el símbolo de moneda según el código de idioma o moneda.
 * Uso: {{ 'EUR' | currencySymbol }} o {{ 'es-ES' | currencySymbol }}
 */
@Pipe({
  name: 'currencySymbol',
  standalone: true
})
export class CurrencySymbolPipe implements PipeTransform {
  private currencyMap: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CNY': '¥',
    'MXN': '$',
    'BRL': 'R$',
    // Agrega más según necesidad
  };

  private localeMap: Record<string, string> = {
    'en-US': '$',
    'es-ES': '€',
    'es-MX': '$',
    'en-GB': '£',
    'fr-FR': '€',
    'de-DE': '€',
    // Agrega más según necesidad
  };

  transform(value: string): string {
    // Si es código de moneda conocido
    if (this.currencyMap[value]) {
      return this.currencyMap[value];
    }
    // Si es código de idioma conocido
    if (this.localeMap[value]) {
      return this.localeMap[value];
    }
    // Si es un locale tipo es-ES, en-US, etc.
    const base = value.split('-')[1]?.toUpperCase();
    if (base && this.currencyMap[base]) {
      return this.currencyMap[base];
    }
    // Por defecto dólar
    return '$';
  }
}
