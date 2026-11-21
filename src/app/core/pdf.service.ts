import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    // La pestaña se abre de inmediato (dentro del clic) para que el navegador no la bloquee.
    const ventana = window.open('', '_blank');
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        if (ventana) {
          ventana.location.href = objectUrl;
        } else {
          window.location.href = objectUrl;
        }
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      },
      error: (e) => {
        ventana?.close();
        if (e?.status !== 401) {
          Swal.fire('Error', 'No se pudo generar el reporte. ' + (e?.message ?? ''), 'error');
        }
      }
    });
  }
}
