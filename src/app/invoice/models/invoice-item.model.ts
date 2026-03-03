import { InvoiceModifier } from "./invoice-modifier.model";

export class InvoiceItem{
  id!: number;
  product!: string;
  price!: number;
  quantity!: number;
  discounts?: InvoiceModifier[];
  taxes?: InvoiceModifier[];
}
