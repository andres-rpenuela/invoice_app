import { Injectable, linkedSignal, WritableSignal } from '@angular/core';
import { invoiceData } from '../data/invoice.data';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private _invoice: WritableSignal<Invoice> = linkedSignal(() => invoiceData);

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
    const subtotal = invoice.items?.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;

    const discounts = invoice.discounts?.reduce((sum, d) => sum + (subtotal * (d.percent / 100)), 0) ?? 0;
    const taxes = invoice.taxes?.reduce((sum, t) => sum + (subtotal * (t.percent / 100)), 0) ?? 0;

    const total = subtotal - discounts + taxes;

    return {
      subtotal,
      total
    };
  }
}
