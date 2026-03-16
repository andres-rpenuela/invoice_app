import { ChangeDetectionStrategy, Component, Input, input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'product-form-general-data',
  imports: [ReactiveFormsModule],
  templateUrl: './general-data.component.html',
  styleUrl: './general-data.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralDataComponent implements OnInit {
  @Input() group!: FormGroup;
  @Input() onDebug!: Boolean;

  ngOnInit(): void {

  }

  debug() {
    console.log('Valor actual:', this.group.get('name')?.value);
  }


}
