import { Client } from "./client.models";
import { InvoiceItem } from "./invoice-item.model";
import { Company } from "./company.model";
import {InvoiceModifier} from './invoice-modifier.model';

export class Invoice{
  id!: number;
  name!: string;
  client!: Client;
  company!: Company;
  items!: InvoiceItem[];
  taxes ?: InvoiceModifier[];
  discounts ?: InvoiceModifier[];
  subtotal ?: number;
  total ?: number;
}
