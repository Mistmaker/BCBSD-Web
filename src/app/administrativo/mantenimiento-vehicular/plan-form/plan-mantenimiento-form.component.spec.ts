import { puntosRegla } from './plan-mantenimiento-form.component';

describe('puntosRegla', () => {
  it('calcula los primeros puntos de mantenimiento', () => {
    expect(puntosRegla(5000, 10000)).toEqual([5000, 15000, 25000, 35000]);
    expect(puntosRegla(null, 5000, 3)).toEqual([0, 5000, 10000]);
  });

  it('sin intervalo válido no hay puntos', () => {
    expect(puntosRegla(0, null)).toEqual([]);
    expect(puntosRegla(0, 0)).toEqual([]);
  });
});
