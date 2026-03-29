import { NumericHelper } from './numeric.helper';

describe('NumericHelper.textToDecimal', () => {
  it('debe aceptar 12.211,50 como válido en es-ES', () => {
    expect(NumericHelper.textToDecimal('12.211,50', 'es-ES')).toBeCloseTo(12211.5);
  });

  it('debe rechazar 123.4522.20.111.22,20 como inválido en es-ES', () => {
    expect(NumericHelper.textToDecimal('123.4522.20.111.22,20', 'es-ES')).toBeNull();
  });

  it('debe rechazar 15,5,,5,6,8,9 como inválido en es-ES', () => {
    expect(NumericHelper.textToDecimal('15,5,,5,6,8,9', 'es-ES')).toBeNull();
  });

  it('debe aceptar 1,234.56 como válido en en-US', () => {
    expect(NumericHelper.textToDecimal('1,234.56', 'en-US')).toBeCloseTo(1234.56);
  });

  it('debe rechazar 1,234.56.78 como inválido en en-US', () => {
    expect(NumericHelper.textToDecimal('1,234.56.78', 'en-US')).toBeNull();
  });
});
