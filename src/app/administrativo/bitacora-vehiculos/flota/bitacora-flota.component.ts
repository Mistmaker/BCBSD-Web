import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormCheckComponent, FormCheckInputDirective,
  FormCheckLabelDirective, FormControlDirective, FormLabelDirective, RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';
import { colorAlerta, FilaFlotaBitacora, ParametrosBitacora, rangoPorDefecto } from '../../models/bitacora.model';
import { BitacoraService } from '../../services/bitacora.service';

type Orden = 'alertas' | 'sigla' | 'costo_total_km' | 'rendimiento_dif_pct' | 'gasto_mantenimiento' | 'km_recorridos';

@Component({
  selector: 'app-bitacora-flota',
  imports: [CommonModule, FormsModule, RouterLink, FiltroGeneralPipe, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormControlDirective, FormLabelDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, SpinnerComponent],
  templateUrl: './bitacora-flota.component.html'
})
export class BitacoraFlotaComponent implements OnInit {
  desde = rangoPorDefecto().desde;
  hasta = rangoPorDefecto().hasta;
  filtro = '';
  soloAlertas = false;
  orden: Orden = 'alertas';
  cargando = false;
  /** Ya se hizo la primera consulta: las siguientes vienen del formulario */
  private consultado = false;
  vehiculos: FilaFlotaBitacora[] = [];
  parametros: ParametrosBitacora | null = null;
  readonly colorAlerta = colorAlerta;

  constructor(private bitacora: BitacoraService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    this.desde = q.get('desde') ?? this.desde;
    this.hasta = q.get('hasta') ?? this.hasta;
    this.consultar();
  }

  consultar(): void {
    if (!this.desde || !this.hasta || this.desde > this.hasta) {
      Swal.fire('Fechas', 'Seleccione un rango válido: la fecha inicial no puede ser posterior a la final.', 'warning');
      return;
    }
    // Solo si el usuario cambió las fechas (al abrir sin fechas en la URL se usan las por defecto sin reescribirla:
    // hacerlo inicia una transición de vista que interrumpe la de la navegación)
    const q = this.route.snapshot.queryParamMap;
    const enUrl = q.get('desde') !== null;
    if ((enUrl || this.consultado) && (q.get('desde') !== this.desde || q.get('hasta') !== this.hasta)) {
      this.router.navigate([], { queryParams: { desde: this.desde, hasta: this.hasta }, replaceUrl: true });
    }
    this.consultado = true;
    this.cargando = true;
    this.bitacora.getFlota(this.desde, this.hasta).subscribe({
      next: (r) => { this.vehiculos = r.vehiculos; this.parametros = r.parametros; this.cargando = false; },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudo calcular la bitácora. ' + (e.error?.msg ?? e.message), 'error'); }
    });
  }

  get filas(): FilaFlotaBitacora[] {
    const lista = this.soloAlertas ? this.vehiculos.filter(v => v.alertas.length) : [...this.vehiculos];
    return ordenarFlota(lista, this.orden);
  }

  get totalConAlertas(): number {
    return this.vehiculos.filter(v => v.alertas.some(a => a.nivel === 'serious')).length;
  }

  graves(v: FilaFlotaBitacora): number {
    return v.alertas.filter(a => a.nivel === 'serious').length;
  }

  resumenAlertas(v: FilaFlotaBitacora): string {
    return v.alertas.map(a => a.mensaje).join('\n');
  }
}

/** Orden de la tabla. Los nulos van al final. */
export function ordenarFlota(lista: FilaFlotaBitacora[], orden: Orden): FilaFlotaBitacora[] {
  const num = (x: number | null | undefined) => x ?? Number.NEGATIVE_INFINITY;
  const graves = (v: FilaFlotaBitacora) => v.alertas.filter(a => a.nivel === 'serious').length;
  const cmp: Record<Orden, (a: FilaFlotaBitacora, b: FilaFlotaBitacora) => number> = {
    alertas: (a, b) => graves(b) - graves(a) || b.alertas.length - a.alertas.length || num(b.costo_total_km) - num(a.costo_total_km),
    sigla: (a, b) => (a.vehiculo_sigla ?? a.vehiculo_placa).localeCompare(b.vehiculo_sigla ?? b.vehiculo_placa, 'es', { numeric: true }),
    costo_total_km: (a, b) => num(b.costo_total_km) - num(a.costo_total_km),
    // el peor rendimiento frente a sus iguales primero (más negativo)
    rendimiento_dif_pct: (a, b) => (a.rendimiento_dif_pct ?? Number.POSITIVE_INFINITY) - (b.rendimiento_dif_pct ?? Number.POSITIVE_INFINITY),
    gasto_mantenimiento: (a, b) => b.gasto_mantenimiento - a.gasto_mantenimiento,
    km_recorridos: (a, b) => b.km_recorridos - a.km_recorridos,
  };
  return lista.sort(cmp[orden]);
}
