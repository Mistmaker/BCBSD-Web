import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

/**
 * Abre reportes PDF del API en una pestaña nueva.
 * Se descargan con HttpClient (para que el interceptor envíe el JWT) en lugar de un <a href>,
 * que no puede enviar el encabezado Authorization.
 */
@Injectable({ providedIn: 'root' })
export class PdfService {

  constructor(private http: HttpClient) { }

  abrir(url: string): void {
    this.mostrar(this.http.get(url, { responseType: 'blob' }));
  }

  /**
   * Genera un reporte enviando datos por POST (p. ej. informes estadísticos con los gráficos en PNG).
   * Devuelve una promesa que se resuelve al mostrar el PDF o al fallar (para quitar el indicador de carga).
   */
  abrirPost(url: string, cuerpo: unknown): Promise<void> {
    return new Promise(fin => this.mostrar(this.http.post(url, cuerpo, { responseType: 'blob' }), fin));
  }

  private mostrar(peticion: Observable<Blob>, fin: () => void = () => {}): void {
    // La pestaña se abre de inmediato (dentro del clic) para que el navegador no la bloquee.
    const ventana = window.open('', '_blank');
    peticion.subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        if (ventana) {
          ventana.location.href = objectUrl;
        } else {
          window.location.href = objectUrl;
        }
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
        fin();
      },
      error: async (e) => {
        ventana?.close();
        fin();
        if (e?.status !== 401) {
          Swal.fire('Error', 'No se pudo generar el reporte. ' + (await mensajeError(e)), 'error');
        }
      }
    });
  }
}

/** Mensaje del API: con responseType 'blob' el cuerpo del error llega como Blob con JSON { msg } */
export async function mensajeError(e: any): Promise<string> {
  if (e?.error instanceof Blob) {
    try {
      const json = JSON.parse(await e.error.text());
      return json.msg ?? json.error ?? '';
    } catch {
      return '';
    }
  }
  return e?.error?.msg ?? e?.message ?? '';
}
