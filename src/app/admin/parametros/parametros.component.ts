import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, ButtonCloseDirective, ButtonDirective, ButtonGroupComponent, CardBodyComponent, CardComponent, CardHeaderComponent,
  FormControlDirective, FormSelectDirective, InputGroupComponent, InputGroupTextDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent,
  ModalHeaderComponent, ModalTitleDirective, SpinnerComponent, TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

import {
  filtrarParametros, formatearJson, HistorialParametro, ICONO_TIPO, jsonATabla, JsonTabla, listaDesdeTexto, ParametroModel, RespuestaParametros,
  resumenValor, tablaAJson, TipoParametro, validarParametro, validarTabla
} from '../models/parametros.model';
import { AdminService } from '../services/admin.service';

/**
 * Administración > Parámetros (/adm/parametros, SIS_PARAMETROS): valores configurables del sistema (admin.tb_params).
 * Se busca por llave, nombre o valor y se edita el valor con un editor según el tipo (SIS_PARAMETRO_EDITAR).
 * La llave, el tipo y el módulo los define el sistema; los de Administración solo los cambia un administrador.
 */
@Component({
  selector: 'app-parametros',
  imports: [CommonModule, FormsModule, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, ButtonGroupComponent, ButtonCloseDirective,
    BadgeComponent, TableDirective, FormControlDirective, FormSelectDirective, InputGroupComponent, InputGroupTextDirective, SpinnerComponent,
    ModalComponent, ModalHeaderComponent, ModalTitleDirective, ModalBodyComponent, ModalFooterComponent],
  templateUrl: './parametros.component.html',
  styles: [`
    .llave { font-family: var(--cui-font-monospace); font-weight: 600; word-break: break-all; }
    .valor-codigo { font-family: var(--cui-font-monospace); font-size: .8rem; word-break: break-all; }
    .muestra-color { display: inline-block; width: 1.1rem; height: 1.1rem; border-radius: 4px; border: 1px solid var(--cui-border-color); vertical-align: middle; }
    .editor-codigo { font-family: var(--cui-font-monospace); font-size: .85rem; min-height: 320px; }
    .vista-html { border: 1px dashed var(--cui-border-color); padding: .75rem; max-height: 420px; overflow: auto; background: #fff; color: #222; }
    .tabla-parametros { table-layout: fixed; min-width: 760px; }
  `]
})
export class ParametrosComponent implements OnInit {
  private readonly servicio = inject(AdminService);

  readonly datos = signal<RespuestaParametros | null>(null);
  readonly texto = signal('');
  readonly modulo = signal('');
  readonly cargando = signal(true);
  readonly icono = ICONO_TIPO;
  readonly resumen = resumenValor;
  readonly lista = listaDesdeTexto;

  readonly modulos = computed(() => [...new Set((this.datos()?.parametros ?? []).map(p => p.param_modulo))].sort());
  readonly filtrados = computed(() => filtrarParametros(this.datos()?.parametros ?? [], this.texto(), this.modulo()));

  // Editor
  editando: ParametroModel | null = null;
  valor = '';
  items: string[] = [];
  nuevoItem = '';
  tabla: JsonTabla | null = null;
  vistaJson: 'tabla' | 'texto' = 'tabla';
  vistaHtml: 'codigo' | 'vista' = 'codigo';
  historial: HistorialParametro[] = [];
  guardando = false;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.servicio.getParametros().subscribe({
      next: (d) => { this.datos.set(d); this.cargando.set(false); },
      error: (e) => { this.cargando.set(false); Swal.fire('Error', 'No se pudieron cargar los parámetros. ' + (e.error?.msg ?? e.message), 'error'); },
    });
  }

  etiquetaTipo(t: TipoParametro): string {
    return this.datos()?.tipos[t] ?? t;
  }

  /** Puede cambiar este parámetro (privilegio y, si es de Administración, ser administrador) */
  editable(p: ParametroModel): boolean {
    const d = this.datos();
    return !!d && d.puede_editar && (p.param_modulo.toUpperCase() !== d.modulo_protegido || d.puede_editar_protegidos);
  }

  abrir(p: ParametroModel): void {
    this.editando = p;
    this.valor = p.param_type === 'JSON' ? formatearJson(p.param_value) : p.param_value;
    this.items = listaDesdeTexto(p.param_value);
    this.nuevoItem = '';
    this.tabla = p.param_type === 'JSON' ? jsonATabla(p.param_value) : null;
    this.vistaJson = this.tabla ? 'tabla' : 'texto';
    this.vistaHtml = 'codigo';
    this.historial = [];
    this.servicio.getHistorialParametro(p.param_id).subscribe({ next: (h) => this.historial = h, error: () => this.historial = [] });
  }

  cerrar(): void {
    this.editando = null;
  }

  // Lista
  agregarItem(): void {
    const v = this.nuevoItem.trim();
    if (v) {
      this.items = [...this.items, v];
      this.nuevoItem = '';
    }
  }

  quitarItem(i: number): void {
    this.items = this.items.filter((_, j) => j !== i);
  }

  moverItem(i: number, d: -1 | 1): void {
    this.items = mover(this.items, i, d);
  }

  // JSON
  cambiarVistaJson(v: 'tabla' | 'texto'): void {
    if (v === this.vistaJson) { return; }
    if (v === 'texto' && this.tabla) {
      this.valor = tablaAJson(this.tabla);
    } else if (v === 'tabla') {
      const t = jsonATabla(this.valor);
      if (!t) {
        Swal.fire('JSON', 'El texto no es válido o no es una lista/objeto de valores simples: edítelo como texto.', 'info');
        return;
      }
      this.tabla = t;
    }
    this.vistaJson = v;
  }

  agregarFila(): void {
    this.tabla?.filas.push({ clave: this.tabla.forma === 'arreglo' ? String(this.tabla.filas.length) : '', valor: '', tipo: 'string' });
  }

  quitarFila(i: number): void {
    this.tabla?.filas.splice(i, 1);
  }

  moverFila(i: number, d: -1 | 1): void {
    if (this.tabla) { this.tabla.filas = mover(this.tabla.filas, i, d); }
  }

  /** trackBy por posición: al escribir en un elemento de la lista no se recrea su campo */
  indice(i: number): number {
    return i;
  }

  formatear(): void {
    this.valor = formatearJson(this.valor);
  }

  /** Valor a enviar y su error de validación */
  private valorFinal(): { valor: string | string[]; error: string | null } {
    const p = this.editando!;
    if (p.param_type === 'LISTA') {
      const items = this.nuevoItem.trim() ? [...this.items, this.nuevoItem.trim()] : this.items;
      return { valor: items, error: validarParametro('LISTA', items) };
    }
    if (p.param_type === 'JSON' && this.vistaJson === 'tabla' && this.tabla) {
      return { valor: tablaAJson(this.tabla), error: validarTabla(this.tabla) };
    }
    return { valor: this.valor, error: validarParametro(p.param_type, this.valor) };
  }

  get error(): string | null {
    return this.editando ? this.valorFinal().error : null;
  }

  guardar(): void {
    const p = this.editando;
    if (!p) { return; }
    const { valor, error } = this.valorFinal();
    if (error) {
      Swal.fire('Valor inválido', error, 'warning');
      return;
    }
    this.guardando = true;
    this.servicio.guardarParametro(p.param_id, valor).subscribe({
      next: (r) => {
        this.guardando = false;
        this.editando = null;
        Swal.fire({ icon: 'success', title: r.msg, timer: 1800, showConfirmButton: false });
        this.cargar();
      },
      error: (e) => { this.guardando = false; Swal.fire('Error', e.error?.msg ?? e.error?.error ?? e.message, 'error'); },
    });
  }
}

/** Copia del arreglo con el elemento i movido una posición (d = -1 arriba, 1 abajo) */
export function mover<T>(arr: T[], i: number, d: -1 | 1): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) { return arr; }
  const copia = [...arr];
  [copia[i], copia[j]] = [copia[j], copia[i]];
  return copia;
}
