import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'product-general-data',
  imports: [],
  template: `<p>general-data.component works!</p>`,
  styleUrl: './general-data.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralDataComponent { }
