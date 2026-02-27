import { ChangeDetectionStrategy, Component, input, WritableSignal } from '@angular/core';
import { Client } from '../../models/client.models';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-invoice-detail',
  imports: [],
  templateUrl:'./invoice-detail.component.html',
  styleUrl: './invoice-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDetailComponent {
  client = input.required<Client>();
  company = input.required<Company>();
}
