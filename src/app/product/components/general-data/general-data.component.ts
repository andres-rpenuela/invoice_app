import { ChangeDetectionStrategy, Component, Input, input, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, NgClass } from '@angular/common';
import { FormInputNumericComponent } from '../../../shared/form/form-input-numeric.component/form-input-numeric.component';
import { FormInputTiptapComponent } from '../../../shared/form/form-input-tip-tap.component/form-input-tip-tap.component';

export type LANGUAGE = 'es-ES' | 'en-US'

@Component({
  selector: 'product-form-general-data',
  imports: [ReactiveFormsModule, JsonPipe, FormInputNumericComponent, FormInputTiptapComponent, NgClass  ],
  templateUrl: './general-data.component.html',
  styleUrl: './general-data.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralDataComponent implements OnInit, OnDestroy {
  @Input() group!: FormGroup;
  @Input() onDebug!: Boolean;

  locale: string = navigator.language || 'en-US';
  priceInput = signal('');
  private debounceTimeout: any;

  constructor(){

  }

  ngOnInit(): void {

  }

  onPriceInput(val: string) {
     this.priceInput.set(val);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimeout);
  }



  debug() {
    console.log('Valor actual:', this.group.get('name')?.value);
  }

  /*
  getErrorMessage(control: AbstractControl | null): string[] {
  if (!control?.errors) return [];

  const errors = [];

  if (control.errors['required']) errors.push('El campo es obligatorio');
  if (control.errors['min']) errors.push(`Mínimo ${control.errors['min'].min}`);
  if (control.errors['max']) errors.push(`Máximo ${control.errors['max'].max}`);

  return errors;
}

@for (msg of getErrorMessage(control); track msg) {
  <span>{{ msg }}</span>
}
*/
}
