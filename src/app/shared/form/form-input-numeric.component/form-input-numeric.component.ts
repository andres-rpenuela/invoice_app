import { DecimalPipe } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  Input,
  linkedSignal,
  signal,
  ViewChild
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import { DecimalSeparatorPipe } from '../../pipes/decimal-separator.pipe';
import { NumericHelper } from '../../helpers/numeric.helper';

export type ModeInputNumber = 'number' | 'currency' | 'integer' | 'percentage';
export class ModeInputNumberType{
  static NUMBER : ModeInputNumber = 'number'
  static CURRENCY : ModeInputNumber = 'currency'
  static INTEGER : ModeInputNumber = 'integer'
  static PERCENTAGE : ModeInputNumber= 'percentage'

}
@Component({
  selector: 'form-input-numeric',
  templateUrl: './form-input-numeric.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputNumericComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormInputNumericComponent),
      multi: true
    }
  ],
  imports: [DecimalSeparatorPipe]
})
export class FormInputNumericComponent implements ControlValueAccessor {
  // Inputs
  label = input<string>('Control');
  locale = input<string>(navigator.language)
  min = input<number>();
  max = input<number>();
  maxDeciamls = input<number>(2);
  mode = input<ModeInputNumber>(ModeInputNumberType.NUMBER)
  unit = input<string>()

  // Todo, lo ideal es que si pone mode step, el inptu vaya de incremano o dremento X
  // Todo, si es numerico que solo acepte numeros enteros
  // Todo, si es porcentaje que acepte deciamles como numery
  // Todo, las unidades si es currency que sea moneda, si es porcentaje que sea % y se no que sea UnidType y pordecto u.

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  //value: number | null = null;
  //displayValue = '';
  value = linkedSignal<number|null>( () => null)
  raw = linkedSignal<string|null>( () => null );

  // Mantiene lo que escribe el usuario
  displayValue = computed<number|null>(() => {
    const val = this.value();
    // Aquí formatea el valor como string para mostrarlo
    return val !== null ? this.value()! : null;
  });


  isDisabled = false;

  private onChange = (v: number | null) => {};
  private onTouched = () => {};
  private onValidatorChange = () => {};

  // 🔥 INPUT PRINCIPAL
  onInput(event: Event) {

    const input = event.target as HTMLInputElement;
    const raw = input.value;

    // guardar cursor
    const cursor = input.selectionStart ?? 0;

    // limpiar
    const cleaned = NumericHelper.textToDecimal(raw, this.locale());

    if (cleaned === null) {
      this.value.set(null);
      //this.displayValue = raw; // mantiene lo que escribe el usuario
      this.onChange(null);
      this.onValidatorChange();
      return;
    }

    this.value.set( cleaned );
    this.onChange(cleaned);

    //const formatted = this.format(cleaned);
    //this.displayValue = formatted;

    // Restaurar cursor
    /*setTimeout(() => {
      const newPos = Math.min(cursor, formatted.length);
      input.setSelectionRange(newPos, newPos);
    });*/

    this.onValidatorChange();
  }


  // 👉 formato
  private format(value: number): string {
    if (this.mode() === ModeInputNumberType.INTEGER) return Math.floor(value).toString();

    const [intPart, decPart] = value.toString().split('.');

    let decimals = decPart?.slice(0, this.maxDeciamls() ) || '';

    return intPart + (decimals ? '.' + decimals : '');
  }

  // 👉 suffix
  getSuffix(): string {
    if (this.mode() === ModeInputNumberType.CURRENCY) {
      return new Intl.NumberFormat(this.locale(), {
        style: 'currency',
        currency: this.locale().includes('en') ? 'USD' : 'EUR'
      }).formatToParts(0).find(p => p.type === 'currency')?.value || '$';
    }

    if (this.mode() === ModeInputNumberType.INTEGER) return '';

    if (this.mode() === ModeInputNumberType.PERCENTAGE) return '%';

    return this.unit() ?? '';
  }

  // 👉 VALIDATOR
  validate(control: AbstractControl): ValidationErrors | null {

    if (this.value() === null) return { required: true };

    if (this.min() !== undefined && this.value()! < this.min()!) {
      return { min: { min: this.min, actual: this.value } };
    }

    if (this.max() !== undefined && this.value()! > this.max()!) {
      return { max: { max: this.max, actual: this.value } };
    }

    return null;
  }

  // 👉 CVA
  writeValue(value: number | null): void {
    this.value.set (value );
    //this.displayValue = value !== null ? this.format(value) : '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  onBlur() {
    this.onTouched();
  }
}
/*
// 💰 Precio
<form-input-numeric
  formControlName="price"
  label="Price"
  mode="currency"
  [min]="0"
  locale="en-US">
</form-input-numeric>

// 📦 Unidad
<form-input-numeric
  formControlName="stock"
  label="Stock"
  mode="integer"
  [min]="0">
</form-input-numeric>

// 📊 Porcentaje
<form-input-numeric
  formControlName="discount"
  label="Discount"
  [min]="0"
  [max]="100"
  [maxDecimals]="2">
</form-input-numeric>

// 🎨 Ajustes visuales (opcional)
<input
  type="number"
  [step]="step"
  ...
/>

//
this.fb.group({
  price: [0],
  stock: [0]
});
*/
