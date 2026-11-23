import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective,
  FormLabelDirective, FormSelectDirective, RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import { ParteService, FiltroPartes } from '../services/parte.service';
import { CatalogosParte, fechaISO, ParteResumen, TIPOS_PARTE } from '../models/partes.model';
import { AuthService } from '../../auth/auth.service';
import { PdfService } from '../../core/pdf.service';

/** Listado de partes de servicio (/operaciones/partes, OPE_PARTES) con filtros por fecha, estación, tipo y estado */
@Component({
  selector: 'app-parte-listado',
  imports: [FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, RouterLink,
    TableDirective, BadgeComponent, FormControlDirective, FormLabelDirective, FormSelectDirective, SpinnerComponent],
  templateUrl: './parte-listado.component.html',
})
export class ParteListadoComponent implements OnInit {
  private readonly servicio = inject(ParteService);
  private readonly auth = inject(AuthService);
  private readonly pdf = inject(PdfService);

  partes: ParteResumen[] = [];
  estaciones: CatalogosParte['estaciones'] = [];
  filtro: FiltroPartes = { desde: `${new Date().getFullYear()}-01-01`, hasta: fechaISO(new Date()), estacion: null, tipo: '', estado: '', q: '' };
  cargando = false;
  errorMessage = '';
  readonly tipos = TIPOS_PARTE;
  readonly puedeRegistrar = this.auth.tienePermiso('OPE_PARTE_REGISTRAR');
  readonly verEstadistica = this.auth.tienePermiso('OPE_PARTES_ESTADISTICAS');

  ngOnInit(): void {
    this.servicio.getCatalogos().subscribe({ next: (c) => this.estaciones = c.estaciones, error: () => this.estaciones = [] });
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.servicio.getAll(this.filtro).subscribe({
      next: (data) => { this.partes = data; this.cargando = false; },
      error: (e) => { this.errorMessage = e.error?.msg ?? e.error?.error ?? e.message; this.cargando = false; },
    });
  }

  imprimir(p: ParteResumen): void {
    this.pdf.abrir(this.servicio.urlPdf(p.parte_id));
  }

  colorEstado(estado: string): string {
    return estado === 'ANULADO' ? 'dark' : estado === 'FINALIZADO' ? 'success' : 'warning';
  }
}
