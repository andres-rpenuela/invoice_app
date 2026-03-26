import { ChangeDetectionStrategy, Component, Input, input, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CurrencySymbolPipe } from '../../../shared/pipes/currency-symbol.pipe';
import { DecimalSeparatorPipe } from '../../../shared/pipes/decimal-separator.pipe';
import { JsonPipe } from '@angular/common';
import { FormInputNumericComponent } from '../../../shared/form/form-input-numeric.component/form-input-numeric.component';

@Component({
  selector: 'product-form-general-data',
  imports: [ReactiveFormsModule, CurrencySymbolPipe, DecimalSeparatorPipe, JsonPipe,FormInputNumericComponent  ],
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
    effect( ()=>{
      const val = this.priceInput();
      const num = this.textToDecimal(val, this.locale);
      // Siempre actualiza el modelo, aunque sea igual
      this.group.get('price')!.setValue(!isNaN(num) ? num : 0, { emitEvent: true });
      console.log("ee")
      console.log(num)
    })
    /*effect(() => {
            const val = this.priceInput();
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
              const num = this.textToDecimal(val, this.locale);
              // Siempre actualiza el modelo, aunque sea igual
              this.group.get('price')!.setValue(!isNaN(num) ? num : 0, { emitEvent: true });
              console.log("hola")
            }, 1);
          });*/
  }

  ngOnInit(): void {
    if (this.group && this.group.get('price')) {
      const initial = this.group.get('price')!.value;
      if (initial !== undefined && initial !== null && initial !== '') {
          this.priceInput.set(String(initial));
      }

    }
  }

  onPriceInput(val: string) {
     this.priceInput.set(val);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimeout);
  }


  /**
   * Convierte texto a número decimal según el locale, sin modificar el formato visual
   */
  textToDecimal(val: any, locale: string): number {
    if (val === null || val === undefined || val === '') return NaN;
    let str = String(val).trim();
    if (locale.startsWith('es')) {
      // Permitir cualquier cantidad de decimales
      if (/^([0-9]{1,3}(\.[0-9]{3})*|[0-9]+)(,[0-9]+)?$/.test(str)) {
        str = str.replace(/\./g, '');
        if (str.includes(',')) {
          str = str.replace(/,/, '.');
        }
      } else if (/^,[0-9]+$/.test(str)) {
        str = '0' + str.replace(/,/, '.');
      } else {
        return NaN;
      }
    } else if (locale.startsWith('en')) {
      if (/^([0-9]{1,3}(,[0-9]{3})*|[0-9]+)(\.[0-9]+)?$/.test(str)) {
        str = str.replace(/,/g, '');
      } else if (/^\.[0-9]+$/.test(str)) {
        str = '0' + str;
      } else {
        return NaN;
      }
    }
    const num = parseFloat(str);
    if (!isNaN(num)) {
      return num //Math.round(num * 100) / 100;
    }
    return NaN;
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
