import { Injectable, linkedSignal, WritableSignal } from '@angular/core';
import { invoiceData } from '../data/invoice.data';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private _invoice: WritableSignal<Invoice> = linkedSignal(() => invoiceData);

  // Calcula subtotal, descuentos y tasas por item
  private calculateItemTotals(items: any[]): { subtotal: number, discounts: number, taxes: number } {
    let subtotal = 0;
    let discounts = 0;
    let taxes = 0;
    for (const item of items ?? []) {
      const itemSubtotal = item.quantity * item.price;
      subtotal += itemSubtotal;
      // Descuentos por item
      if (item.discounts && Array.isArray(item.discounts)) {
        for (const d of item.discounts) {
          discounts += itemSubtotal * (d.percent / 100);
        }
      }
      // Tasas por item
      if (item.taxes && Array.isArray(item.taxes)) {
        for (const t of item.taxes) {
          taxes += itemSubtotal * (t.percent / 100);
        }
      }
    }
    return { subtotal, discounts, taxes };
  }
  // Devuelve toda la factura con total
  getInvoice(): Invoice {
    const { subtotal, total } = this.resolveInvoice();
    return {
      ...this._invoice(),
      subtotal,
      total
    };
  }

  resolveInvoice() {
      const invoice = this._invoice();
      const { subtotal, discounts, taxes } = this.calculateItemTotals(invoice.items);

      // Descuentos y tasas globales (factura)
      const globalDiscounts = invoice.discounts?.reduce((sum, d) => sum + (subtotal * (d.percent / 100)), 0) ?? 0;
      const globalTaxes = invoice.taxes?.reduce((sum, t) => sum + (subtotal * (t.percent / 100)), 0) ?? 0;

      const total = subtotal - discounts - globalDiscounts + taxes + globalTaxes;

      return {
        subtotal,
        total
      };
  }

  removeItem(id:number){
      let items = [...this._invoice().items];
      if (!items) {
        return;
      }
      items = items.filter(item => item.id !== id);
      this._invoice.update(invoice => ({ ...invoice, items }));
  }
}
