import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, ButtonGroupComponent, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, ColorModeService,
  FormControlDirective, ProgressComponent, RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import Swal from 'sweetalert2';

import { coloresGrafico, etiquetaSerie, nombreMes, opcionesGrafico } from '../models/bitacora.model';
import { graficoGastoMensual, porcentajeConsumido, ResumenGerencial, TEXTO_ALERTA, variacion } from '../models/resumen-gerencial.model';
import { ResumenGerencialService } from '../services/resumen-gerencial.service';
import { PdfService } from '../../core/pdf.service';
import { coloresImpresion, formatoDolares, IMPRESION_ANCHO, imagenGrafico } from '../../core/grafico-impresion';

/**
 * Resumen gerencial de la Dirección Administrativa (/admin/dashboard, ADM_DASHBOARD): cifras simples para la dirección.
 * El análisis detallado por vehículo está en la Bitácora de vehículos.
 */
@Component({
  selector: 'app-adm-dashboard',
  imports: [CommonModule, FormsModule, RouterLink, ChartjsComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, ButtonGroupComponent, BadgeComponent, ProgressComponent, TableDirective, FormControlDirective, SpinnerComponent],
  templateUrl: './adm-dashboard.component.html',
  styles: [`
    .kpi { font-size: 1.6rem; font-weight: 600; line-height: 1.15; }
    .grafico { position: relative; height: 260px; }
    .lista-corta li { padding: .3rem 0; border-bottom: 1px solid var(--cui-border-color-translucent); }
    .lista-corta li:last-child { border-bottom: 0; }
  `]
})
export class AdmDashboardComponent implements OnInit {
  private readonly servicio = inject(ResumenGerencialService);
  private readonly colorMode = inject(ColorModeService).colorMode;
  private readonly pdf = inject(PdfService);

  mes = new Date().toISOString().slice(0, 7);
  cargando = false;
  imprimiendo = false;
  verTabla = false;
  readonly datos = signal<ResumenGerencial | null>(null);
  readonly nombreMes = nombreMes;
  readonly etiquetaSerie = etiquetaSerie;
  readonly porcentaje = porcentajeConsumido;
  readonly textoAlerta = (t: string) => TEXTO_ALERTA[t] ?? t.toLowerCase();

  private readonly colores = computed(() => {
    const m = this.colorMode();
    return coloresGrafico(m === 'dark' || (m === 'auto' && typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches));
  });
  readonly grafico = computed(() => { const d = this.datos(); return d ? graficoGastoMensual(d.gasto.meses, this.colores()) : null; });
  readonly opciones = computed(() => opcionesGrafico(this.colores(), 'USD', true));
  /** Mes anterior al consultado (para comparar) */
  readonly anterior = computed(() => { const m = this.datos()?.gasto.meses ?? []; return m.length > 1 ? m[m.length - 2] : null; });

  ngOnInit(): void {
    this.consultar();
  }

  consultar(): void {
    this.cargando = true;
    this.servicio.getResumen(this.mes).subscribe({
      next: (d) => { this.datos.set(d); this.cargando = false; },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudo cargar el resumen. ' + (e.error?.msg ?? e.error?.error ?? e.message), 'error'); }
    });
  }

  /** Informe imprimible del mes consultado */
  imprimir(): void {
    const d = this.datos();
    if (!d) {
      return;
    }
    this.imprimiendo = true;
    this.pdf.abrirPost(this.servicio.urlInforme(), { mes: d.mes, graficos: graficosInformeResumen(d) }).then(() => this.imprimiendo = false);
  }

  variacion(actual: number, anterior: number | undefined): number | null {
    return variacion(Number(actual), anterior !== undefined ? Number(anterior) : null);
  }

  totalMes(m: { combustible: number; mantenimiento: number }): number {
    return Number(m.combustible) + Number(m.mantenimiento);
  }
}

/** Gráfico del informe: gasto de los últimos 12 meses (el mismo del tablero) */
export function graficosInformeResumen(d: ResumenGerencial): Record<string, string | null> {
  const c = coloresImpresion();
  return { gasto: imagenGrafico('bar', graficoGastoMensual(d.gasto.meses, c), opcionesGrafico(c, 'USD', true), IMPRESION_ANCHO, 600, { formato: formatoDolares }) };
}
