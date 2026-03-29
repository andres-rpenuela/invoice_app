import { DecimalPipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
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

export type ModeInputNumber = 'number' | 'currency' | 'integer' | 'percentage' | 'step';
export class ModeInputNumberType{
  static NUMBER : ModeInputNumber = 'number'
  static CURRENCY : ModeInputNumber = 'currency'
  static INTEGER : ModeInputNumber = 'integer'
  static PERCENTAGE : ModeInputNumber= 'percentage'
  static STEP : ModeInputNumber = 'step'

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
  maxDecimals = input<number>(2);
  mode = input<ModeInputNumber>(ModeInputNumberType.NUMBER)
  unit = input<string>()
  stepInput = input<number|undefined>(undefined)

  // Implementación de los TODOs:
  // - Si mode es 'integer', solo acepta enteros
  // - Si mode es 'percentage', acepta decimales
  // - Si mode es 'currency', muestra símbolo de moneda
  // - Si mode es 'number', acepta decimales
  // - El step se ajusta según el modo
  // - El sufijo se ajusta automáticamente

  // Señal para step dinámico
  step = computed(() => {
  const mode = this.mode();

    if (mode === ModeInputNumberType.STEP) {
      const step = this.stepInput();
      return step ?? Math.pow(10, -this.maxDecimals());
    }

    if (mode === ModeInputNumberType.INTEGER) {
      return 1;
    }

    return 0.01;
  });

  // Señal para inputmode dinámico
  inputMode = computed(() => {
    if (this.mode() === ModeInputNumberType.INTEGER) return 'numeric';
    if (this.mode() === ModeInputNumberType.STEP) {
      return this.maxDecimals() > 0 ? 'decimal' : 'numeric';
    }
    return 'decimal';
  });

  // Métodos para incrementar/decrementar solo en modo step
  increment() {
  if (this.isDisabled || this.mode() !== ModeInputNumberType.STEP) return;

  const val = Number(this.value() ?? 0);
  const stepVal = Number(this.step());

  this.updateValue(val + stepVal);
}

decrement() {
  if (this.isDisabled || this.mode() !== ModeInputNumberType.STEP) return;

  const val = Number(this.value() ?? 0);
  const stepVal = Number(this.step());

  this.updateValue(val - stepVal);
}

  // (La función onInput mejorada ya está más abajo, se elimina la duplicada de arriba)

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  //value: number | null = null;
  //displayValue = '';
  value = linkedSignal<number|null>( () => null)
  raw = linkedSignal<string|null>( () => null );

  // Mantiene lo que escribe el usuario
  displayValue = computed<number|null>(() => {
    const val = this.value();
    return val !== null ? this.value()! : null;
  });

displayRaw = computed(() => {
  const val = this.value();

  if (val === null || val === undefined) return '';

  // cuando está editando → raw
  if (this.isFocused()) return String(val);

  // cuando no → puedes formatear si quieres
  return String(val);
});

  isDisabled = false;

  private error = signal<ValidationErrors | null>(null);
  private _formatError: boolean = false;

  //
  private onChange = (v: number | null) => {};
  private onTouched = () => {};
  private onValidatorChange = () => {};

constructor() {
  effect(() => {
    const input = this.inputRef?.nativeElement;
    if (!input) return;

    const val = this.value();

    // evita pisar mientras escribe
    if (document.activeElement === input) return;

    input.value = val === null || val === undefined ? '' : String(val);
  });
}

  isStrANumberValid(raw: string, mode: ModeInputNumber, locale: string): boolean {
  if (mode === ModeInputNumberType.INTEGER) {
    let thousandsSep = locale.includes('es') ? '.' : ',';
    let decimalSep = locale.includes('es') ? ',' : '.';

    // No debe tener separador decimal
    if (raw.includes(decimalSep)) return false;

    // Permitir solo dígitos (sin separador de miles)
    const plainInt = /^-?\d+$/;
    // Permitir separador de miles correcto
    const groupedInt = locale.includes('es')
      ? /^-?\d{1,3}(\.\d{3})+$/
      : /^-?\d{1,3}(,\d{3})+$/;

    const trimmed = raw.trim();
    return plainInt.test(trimmed) || groupedInt.test(trimmed);
  }
  // Otros modos...
  return true;
}

onKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    this.increment();
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    this.decrement();
  }
}
 updateValue(val: number) {
  const decimals = this.maxDecimals();
  const factor = Math.pow(10, decimals);

  let rounded = Math.round(val * factor) / factor;

  if (this.min() != null) {
    rounded = Math.max(rounded, this.min()!);
  }

  if (this.max() != null) {
    rounded = Math.min(rounded, this.max()!);
  }

  this.inputRef!.nativeElement.value = String(rounded);
  this.value.set(rounded);
  this.onChange(rounded);
}

isFocused = signal(false);

onFocus() {
  this.isFocused.set(true);
}



  // 🔥 INPUT PRINCIPAL
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let raw = input.value;

    let valid = this.isStrANumberValid (raw, this.mode(),this.locale() );

    if( !valid){
      console.log('Number not valid')
      return
    }

    if( this.locale().includes('es')){
      raw.replaceAll(',','')
    }else{
      raw.replaceAll('.','')
    }
    const isIntegerMode = this.mode() === ModeInputNumberType.INTEGER;
    const hasComma = raw.includes(',');

    /*
    if (isIntegerMode && hasComma) {
      this._formatError = true;
      this.error.set({ format: true });
      this.onValidatorChange(); // importante
      this.applyValue(null)
      return;
    } else {
      this._formatError = false;
    }

    if (
      (this.mode() === ModeInputNumberType.STEP ||
      this.mode() === ModeInputNumberType.PERCENTAGE) &&
      this.maxDecimals() === 0
    ) {
      raw = raw.replace(/[^\d-]/g, '');
    }

    this.applyValue(raw);
    */
   this.applyValue(raw);
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
    const rawValue = control.value;

    // Error de formato detectado en onInput
    if (this._formatError) {
      return { format: true };
    }

    // Requerido
    if (rawValue === null || rawValue === undefined) {
      return { required: true };
    }

    // ❌ Formato inválido
    if (typeof rawValue !== 'number' || isNaN(rawValue)) {
      return { format: true };
    }

    // Min
    if (this.min() !== undefined && rawValue < this.min()!) {
      return { min: { min: this.min(), actual: rawValue } };
    }

    // Max
    if (this.max() !== undefined && rawValue > this.max()!) {
      return { max: { max: this.max(), actual: rawValue } };
    }

    return null;
  }

  private applyValue(raw: string | number | null, emit: boolean = true): void {
        let cleaned: number | null;
        if(this.mode() === ModeInputNumberType.STEP ){
          const value = Number(raw);
          const decimals = this.maxDecimals();

          const rounded =
            Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

          this.value.set(rounded);
          if (emit) this.onChange(rounded);
        }else{
          if (typeof raw === 'string') {
            cleaned = NumericHelper.textToDecimal(raw, this.locale());
            if (cleaned === null) {
              this.value.set(null);
              if (emit) this.onChange(null);
              this.onValidatorChange();
              return;
            }
            cleaned = Math.floor(cleaned);
            this.value.set(cleaned);
            if (emit) this.onChange(cleaned);
          } else {
            cleaned = Math.floor(Number(raw));
            this.value.set(cleaned);
            if (emit) this.onChange(cleaned);
          }
        }

        this.onValidatorChange();
    /*
  if (raw === null || raw === undefined || raw === '') {
    this.value.set(null);
    if (emit) this.onChange(null);
    this.onValidatorChange();
    return;
  }

  let cleaned: number | null;

  if (typeof raw === 'number') {
    cleaned = raw;
  } else {
    cleaned = NumericHelper.textToDecimal(raw, this.locale());

    if (cleaned === null) {
      this.value.set(null);
      if (emit) this.onChange(null);
      this.onValidatorChange();
      return;
    }
  }

  // MODE INTEGER
  if (this.mode() === ModeInputNumberType.INTEGER) {
    cleaned = Math.floor(cleaned);
  }

  // STEP / PERCENTAGE sin decimales
  if (
    (this.mode() === ModeInputNumberType.STEP ||
     this.mode() === ModeInputNumberType.PERCENTAGE) &&
    this.maxDecimals() === 0
  ) {
    cleaned = Math.floor(cleaned);
  }

  this.value.set(cleaned);

  if (emit) {
    this.onChange(cleaned);
  }

  this.onValidatorChange();*/
}
  // 👉 CVA
  writeValue(value: number | null): void {
  this.value.set(value);

  queueMicrotask(() => {
    const input = this.inputRef?.nativeElement;
    if (!input) return;

    if (document.activeElement !== input) {
      input.value = value === null ? '' : String(value);
    }
  });
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
    this.isFocused.set(false);
    this.onTouched();

    const input = this.inputRef?.nativeElement;
    if (!input) return;

    const raw = input.value;

    this.applyValue(raw);
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
