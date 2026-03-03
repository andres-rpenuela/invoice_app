import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { InvoiceItem } from '../../models/invoice-item.model';

@Component({
  selector: 'app-invoice-item',
  imports: [],
  templateUrl: './invoice-item.component.html',
  styleUrl: './invoice-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceItemComponent {

  removeItenEmmit = output<number>();
  items = input.required<InvoiceItem[]>();

  removeItem(item: InvoiceItem) {
    this.removeItenEmmit.emit(item!.id);
  }
}
