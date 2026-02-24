import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-invoice-page.component',
  imports: [],
  templateUrl: './invoice-page.component.html',
  styleUrl: './invoice-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePageComponent { }
