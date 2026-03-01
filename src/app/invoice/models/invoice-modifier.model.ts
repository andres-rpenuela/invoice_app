export type ModifierType = 'discount' | 'tax';
export type TAX = 'IVA' | 'ISR' | 'IEPS';
export type DISCOUNT = 'Seasonal' | 'Promotional' | 'Loyalty';

export interface InvoiceModifier {
  name: string;
  percent: number;
  type: ModifierType;
}
