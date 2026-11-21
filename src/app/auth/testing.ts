/** Genera un JWT sin firma válida, solo para pruebas del front (el front no verifica la firma). */
export function crearTokenPrueba(expSegundos: number, claims: Record<string, unknown> = {}): string {
  const b64 = (obj: object) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: 1, exp: expSegundos, ...claims })}.firma`;
}

export function segundosDesdeAhora(segundos: number): number {
  return Math.floor(Date.now() / 1000) + segundos;
}
