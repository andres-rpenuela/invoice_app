import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InvoiceItem } from '../../models/invoice-item.model';

@Component({
  selector: 'app-invoice-item',
  imports: [],
  templateUrl: './invoice-item.component.html',
  styleUrl: './invoice-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceItemComponent {

  items=input.required<InvoiceItem[]>()
 }
