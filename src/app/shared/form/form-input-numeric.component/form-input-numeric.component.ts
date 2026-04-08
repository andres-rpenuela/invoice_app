import {
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
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
import { NgClass } from '@angular/common';

export type ModeInputNumber =
  | 'number'
  | 'currency'
  | 'integer'
  | 'percentage'
  | 'step';

export class ModeInputNumberType {
  static NUMBER: ModeInputNumber = 'number';
  static CURRENCY: ModeInputNumber = 'currency';
  static INTEGER: ModeInputNumber = 'integer';
  static PERCENTAGE: ModeInputNumber = 'percentage';
  static STEP: ModeInputNumber = 'step';
}

@Component({
  selector: 'form-input-numeric',
  templateUrl: './form-input-numeric.component.html',
  imports: [DecimalSeparatorPipe,NgClass],
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
  ]
})
export class FormInputNumericComponent implements ControlValueAccessor {
  // 🔹 Inputs
  label = input<string>('Control');
  locale = input<string>(navigator.language);
  min = input<number>();
  max = input<number>();
  maxDecimals = input<number>(2);
  mode = input<ModeInputNumber>(ModeInputNumberType.NUMBER);
  unit = input<string>();
  stepInput = input<number | undefined>(undefined);
  disable = input<boolean>(false)

  // Inputs de sitlos
  status = input<'default' | 'error' | 'success'>('default');

  // Elementos hmtl
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  // 🔹 Estado
  value = linkedSignal<number | null>(() => null);
  isDisabledCva = signal(false);
  isFocused = signal(false);

  private _formatError = false;

  // 👉 necesario para el template
  displayValue = computed<number | null>(() => this.value());

  isDisabled = computed(() =>
    this.isDisabledCva() || this.disable()
  );

  // 🔹 CVA
  private onChange = (v: number | null) => {};
  private onTouched = () => {};
  private onValidatorChange = () => {};

  constructor() {
    effect(() => {
      const input = this.inputRef?.nativeElement;
      if (!input) return;

      if (document.activeElement === input) return;

      const val = this.value();
      input.value = val == null ? '' : String(val);
    });
  }

  classes = computed(() => ({
    'opacity-50 cursor-not-allowed': this.isDisabled(),

    'border-red-500 dark:border-red-400':
      this.status() === 'error',

    'border-green-500 dark:border-green-400':
      this.status() === 'success'
  }));


  // =========================================================
  // 🧠 PARSEO
  // =========================================================
  private parseByMode(raw: string): number | null {
    let value = NumericHelper.textToDecimal(raw, this.locale());
    if (value === null) return null;

    switch (this.mode()) {
      case ModeInputNumberType.INTEGER:
        return Math.floor(value);

      default:
        return value;
    }
  }

  // =========================================================
  // 🧠 NORMALIZACIÓN
  // =========================================================
  private normalizeByMode(value: number | null): number | null {
    if (value === null) return null;

    let v = value;

    if (this.mode() === ModeInputNumberType.INTEGER) {
      v = Math.floor(v);
    } else {
      const factor = Math.pow(10, this.maxDecimals());
      v = Math.round(v * factor) / factor;
    }

    if (this.mode() === ModeInputNumberType.PERCENTAGE) {
      v = Math.max(0, Math.min(100, v));
    }

    const min = this.min();
    const max = this.max();

    if (min != null) v = Math.max(v, min);
    if (max != null) v = Math.min(v, max);

    return v;
  }

  // =========================================================
  // 🔥 APPLY
  // =========================================================
  private applyValue(raw: string | number | null, emit: boolean = true): void {
    let parsed: number | null;

    if (typeof raw === 'number') parsed = raw;
    else if (typeof raw === 'string') parsed = this.parseByMode(raw);
    else parsed = null;

    const normalized = this.normalizeByMode(parsed);

    this.value.set(normalized);

    if (emit) this.onChange(normalized);

    this.onValidatorChange();
  }

  // =========================================================
  // ⚙️ STEP
  // =========================================================
  step = computed(() => {
    switch (this.mode()) {
      case ModeInputNumberType.INTEGER:
        return 1;

      case ModeInputNumberType.STEP:
        return this.stepInput() ?? Math.pow(10, -this.maxDecimals());

      default:
        return Math.pow(10, -this.maxDecimals());
    }
  });

  increment() {
    if (this.isDisabled() || this.mode() !== ModeInputNumberType.STEP) return;

    const newValue = (this.value() ?? 0) + this.step();
    this.updateValue(newValue);
  }

  decrement() {
    if (this.isDisabled() || this.mode() !== ModeInputNumberType.STEP) return;

    const newValue = (this.value() ?? 0) - this.step();
    this.updateValue(newValue);

  }

  private updateValue(val: number) {
    const normalized = this.normalizeByMode(val);
    this.inputRef.nativeElement.value = String(normalized);
    this.value.set(normalized);
    this.onChange(normalized);
  }

  // =========================================================
  // ⌨️ KEYBOARD
  // =========================================================
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

  // =========================================================
  // INPUT MODE
  // =========================================================
  inputMode = computed(() => {
    switch (this.mode()) {
      case ModeInputNumberType.INTEGER:
        return 'numeric';

      case ModeInputNumberType.STEP:
        return this.maxDecimals() > 0 ? 'decimal' : 'numeric';

      default:
        return 'decimal';
    }
  });

  // =========================================================
  // VALIDACIÓN INPUT
  // =========================================================
  isStrANumberValid(raw: string): boolean {
    const trimmed = raw.trim();
    if (!trimmed) return true;

    const isES = this.locale().includes('es');

    const decimalSep = isES ? ',' : '.';
    const thousandSep = isES ? '.' : ',';

    switch (this.mode()) {
      case ModeInputNumberType.INTEGER: {
        // 1.234 o 1,234
        const regex = new RegExp(
          `^-?\\d{1,3}(${this.escape(thousandSep)}\\d{3})*$|^-?\\d+$`
        );
        return regex.test(trimmed);
      }

      case ModeInputNumberType.NUMBER:
      case ModeInputNumberType.CURRENCY:
      case ModeInputNumberType.PERCENTAGE:
      case ModeInputNumberType.STEP: {
        // 1.234,56 o 1,234.56
        const regex = new RegExp(
          `^-?\\d{1,3}(${this.escape(thousandSep)}\\d{3})*(${this.escape(decimalSep)}\\d*)?$|^-?\\d*(${this.escape(decimalSep)}\\d*)?$`
        );
        return regex.test(trimmed);
      }

      default:
        return true;
    }
  }

  private escape(char: string): string {
    return char.replace('.', '\\.');
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const raw = input.value;

    if (!this.isStrANumberValid(raw)) {
      this._formatError = true;
      this.onValidatorChange();
      return;
    }

    this._formatError = false;
    this.applyValue(raw);
  }

  // =========================================================
  // SUFFIX
  // =========================================================
  getSuffix(): string {
    switch (this.mode()) {
      case ModeInputNumberType.CURRENCY:
        return new Intl.NumberFormat(this.locale(), {
          style: 'currency',
          currency: this.locale().includes('en') ? 'USD' : 'EUR'
        })
          .formatToParts(0)
          .find(p => p.type === 'currency')?.value || '€';

      case ModeInputNumberType.PERCENTAGE:
        return '%';

      case ModeInputNumberType.INTEGER:
        return '';

      default:
        return this.unit() ?? '';
    }
  }

  // =========================================================
  // VALIDATOR
  // =========================================================
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (this._formatError) return { format: true };
    if (value == null) return { required: true };
    if (typeof value !== 'number' || isNaN(value)) return { format: true };

    const min = this.min();
    const max = this.max();

    if (min != null && value < min) {
      return { min: { min, actual: value } };
    }

    if (max != null && value > max) {
      return { max: { max, actual: value } };
    }

    return null;
  }

  // =========================================================
  // CVA
  // =========================================================
  writeValue(value: number | null): void {
    this.value.set(value);

    queueMicrotask(() => {
      const input = this.inputRef?.nativeElement;
      if (!input) return;

      if (document.activeElement !== input) {
        input.value = value == null ? '' : String(value);
      }
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabledCva.set(isDisabled);
  }

  // =========================================================
  // FOCUS
  // =========================================================
  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.isFocused.set(false);
    this.onTouched();

    const input = this.inputRef?.nativeElement;
    if (!input) return;

    this.applyValue(input.value);
  }
}
