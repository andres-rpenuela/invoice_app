import {Component, input} from '@angular/core';
import {InvoiceModifier} from '../../models/invoice-modifier.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-invoice-total',
  imports: [DecimalPipe],
  templateUrl: './invoice-total.html',
  styleUrl: './invoice-total.css',
})
export class InvoiceTotalComponent {
  subtotal = input(0);
  discounts = input<InvoiceModifier[]>([]);
  taxes = input<InvoiceModifier[]>([]);
  total = input(0);
}
