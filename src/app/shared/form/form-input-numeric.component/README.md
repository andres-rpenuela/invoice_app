# FormInputNumericComponent

Componente Angular reutilizable para la entrada de valores numéricos con soporte para múltiples modos (número, moneda, entero, porcentaje y step), validación integrada y compatibilidad con formularios reactivos mediante ControlValueAccessor.

---

## 🚀 Características

* Soporte para múltiples formatos numéricos
* Internacionalización (`locale`)
* Validación automática (min, max, formato)
* Control de decimales
* Incremento/decremento configurable (modo step)
* Integración completa con Angular Forms

---

## ⚙️ Inputs disponibles

| Propiedad     | Tipo              | Default              | Descripción                    |
| ------------- | ----------------- | -------------------- | ------------------------------ |
| `label`       | `string`          | `'Control'`          | Etiqueta del input             |
| `locale`      | `string`          | `navigator.language` | Configuración regional         |
| `min`         | `number`          | `undefined`          | Valor mínimo permitido         |
| `max`         | `number`          | `undefined`          | Valor máximo permitido         |
| `maxDecimals` | `number`          | `2`                  | Máximo de decimales            |
| `mode`        | `ModeInputNumber` | `'number'`           | Tipo de input                  |
| `unit`        | `string`          | `undefined`          | Unidad personalizada           |
| `stepInput`   | `number`          | `undefined`          | Paso personalizado (modo step) |

---

## 🎯 Modos disponibles

### 1. `number`

* Permite números decimales
* Respeta `maxDecimals`

```html
<form-input-numeric [mode]="'number'"></form-input-numeric>
```

---

### 2. `currency`

* Formato monetario automático
* Símbolo según `locale`

```html
<form-input-numeric [mode]="'currency'"></form-input-numeric>
```

---

### 3. `integer`

* Solo números enteros
* Redondeo hacia abajo (`Math.floor`)

```html
<form-input-numeric [mode]="'integer'"></form-input-numeric>
```

---

### 4. `percentage`

* Valores entre `0` y `100`
* Añade sufijo `%`

```html
<form-input-numeric [mode]="'percentage'"></form-input-numeric>
```

---

### 5. `step`

* Permite incremento/decremento
* Usa `stepInput` o `maxDecimals`

```html
<form-input-numeric
  [mode]="'step'"
  [stepInput]="0.5">
</form-input-numeric>
```

---

## ⌨️ Interacciones

* `ArrowUp`: Incrementa el valor (modo step)
* `ArrowDown`: Decrementa el valor (modo step)
* Validación en tiempo real del formato

---

## 🔍 Validaciones

El componente implementa `NG_VALIDATORS`:

* `required` → valor null
* `format` → formato inválido
* `min` → valor menor al mínimo
* `max` → valor mayor al máximo

Ejemplo de error:

```ts
{
  min: { min: 0, actual: -5 }
}
```

---

## 🔄 Normalización de valores

Dependiendo del modo:

* `integer` → redondeo hacia abajo
* otros → redondeo según `maxDecimals`
* `percentage` → clamp entre 0 y 100
* siempre respeta `min` y `max`

---

## 🌍 Internacionalización

El componente adapta:

* Separador decimal (`.` o `,`)
* Separador de miles
* Moneda (EUR/USD)

Ejemplo:

```html
<form-input-numeric locale="es-ES"></form-input-numeric>
```

---

## 🧩 Integración con formularios

Compatible con:

* `FormControl`
* `formControlName`
* `ngModel`

Ejemplo:

```ts
this.form = new FormGroup({
  amount: new FormControl(null)
});
```

```html
<form-input-numeric formControlName="amount"></form-input-numeric>
```

---

## 🎨 Sufijos automáticos

| Modo       | Sufijo    |
| ---------- | --------- |
| currency   | € / $     |
| percentage | %         |
| integer    | (ninguno) |
| number     | `unit`    |

---

## 🧠 Notas internas

* Usa `signals` (`signal`, `computed`, `effect`)
* Parsing mediante `NumericHelper`
* Sincronización directa con el DOM para mejor UX

---

## 📌 Ejemplo completo

```html
<form-input-numeric
  label="Precio"
  [mode]="'currency'"
  [min]="0"
  [max]="1000"
  [maxDecimals]="2">
</form-input-numeric>
```

---

## ✅ Buenas prácticas

* Usar `integer` cuando no se requieran decimales
* Definir siempre `min` y `max` cuando sea posible
* Evitar `step` sin definir `stepInput` en casos específicos

---

## 📄 Licencia

Uso interno / proyecto personalizado.
