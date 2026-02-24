import { Injectable, linkedSignal, WritableSignal } from '@angular/core';
import { invoiceData } from '../data/invoice.data';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private _invoice : WritableSignal<Invoice> = linkedSignal( () => invoiceData )

  constructor() { }

  getInvoice(): Invoice{
    return this._invoice();
  }

}
