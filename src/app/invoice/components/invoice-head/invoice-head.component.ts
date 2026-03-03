import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-invoice-head',
  imports: [],
  templateUrl: './invoice-head.component.html',
  styleUrl: './invoice-head.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceHeadComponent {
  photo = input();
  title = input.required();
  numberInvoice = input.required()
}
