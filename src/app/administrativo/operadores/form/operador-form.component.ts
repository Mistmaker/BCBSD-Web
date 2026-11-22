import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertComponent, BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective,
  FormDirective, FormLabelDirective, FormSelectDirective, InputGroupComponent, RowComponent, SpinnerComponent } from '@coreui/angular';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../../auth/auth.service';
import {
  cedulaValida, colorVigencia, LicenciaModel, OperadorGuardar, OperadorModel, PersonaOperador, PuestoModel, textoLicencia
} from '../../models/operadores.model';
import { OperadoresService } from '../../services/operadores.service';

/** Una licencia de conducir en Ecuador dura 5 años: se sugiere la validez a partir de la emisión. */
export function validezSugerida(emision: string): string {
  const [a, m, d] = emision.split('-');
  return `${Number(a) + 5}-${m}-${d}`;
}

@Component({
  selector: 'app-operador-form',
  imports: [CommonModule, FormsModule, RouterLink, NgSelectComponent, NgOptionTemplateDirective, RowComponent, ColComponent, CardComponent, CardHeaderComponent,
    CardBodyComponent, ButtonDirective, BadgeComponent, AlertComponent, FormDirective, FormLabelDirective, FormControlDirective, FormSelectDirective,
    InputGroupComponent, SpinnerComponent],
  templateUrl: './operador-form.component.html'
})
export class OperadorFormComponent implements OnInit {
  /** Operador existente (edición de la licencia) */
  operador: OperadorModel | null = null;
  /** Resultado de buscar la cédula en un ingreso nuevo */
  busqueda: PersonaOperador | null = null;
  licencias: LicenciaModel[] = [];
  puestos: PuestoModel[] = [];
  datos: OperadorGuardar = { persona_doc_identidad: '', persona_nombres: '', persona_apellidos: '', fk_puesto_id: null, fk_licencia_id: null,
                             conductor_licencia_emision: '', conductor_licencia_validez: '', conductor_estado: 'ACTIVO' };
  hoy = new Date().toISOString().slice(0, 10);
  cargando = true;
  buscando = false;
  guardando = false;
  validado = false;
  readonly colorVigencia = colorVigencia;
  readonly textoLicencia = textoLicencia;

  constructor(public auth: AuthService, private operadoresService: OperadoresService, private route: ActivatedRoute, private router: Router) { }

  get puedeEditar(): boolean { return this.auth.tienePermiso('ADM_OPERADOR_GESTIONAR'); }
  get esNuevo(): boolean { return !this.operador; }
  get cedulaOk(): boolean { return cedulaValida(this.datos.persona_doc_identidad); }
  /** La cédula ya se buscó y no es de un operador existente: se pueden completar los datos */
  get listoParaDatos(): boolean { return !!this.busqueda; }
  get personaExistente() { return this.busqueda?.persona ?? null; }
  get necesitaPuesto(): boolean { return !this.personaExistente?.ppersonal_id; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const operadorId = id && id !== 'nuevo' ? Number(id) : null;
    forkJoin({
      catalogos: this.operadoresService.getCatalogos(),
      operador: operadorId ? this.operadoresService.getOperador(operadorId) : of(null),
    }).subscribe({
      next: ({ catalogos, operador }) => {
        this.licencias = catalogos.licencias;
        this.puestos = catalogos.puestos;
        if (operador) {
          this.operador = operador;
          this.datos = { conductor_id: operador.conductor_id, fk_licencia_id: operador.fk_licencia_id, conductor_licencia_emision: operador.conductor_licencia_emision,
                         conductor_licencia_validez: operador.conductor_licencia_validez, conductor_estado: operador.conductor_estado };
        }
        this.cargando = false;
      },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudo cargar la información. ' + (e.error?.msg ?? e.error?.error ?? e.message), 'error'); }
    });
  }

  /** Busca la cédula: si ya es operador ofrece editarlo; si ya es funcionario solo pide la licencia. */
  buscar(): void {
    const cedula = (this.datos.persona_doc_identidad ?? '').trim();
    this.datos.persona_doc_identidad = cedula;
    this.busqueda = null;
    if (!cedulaValida(cedula)) { return; }
    this.buscando = true;
    this.operadoresService.buscarPorCedula(cedula).subscribe({
      next: (r) => {
        this.buscando = false;
        if (r.operador) {
          Swal.fire({ title: 'Ya es operador', icon: 'info', showCancelButton: true, confirmButtonText: 'Actualizar su licencia', cancelButtonText: 'Cancelar',
                      text: `${r.operador.nombre_completo} ya está registrado con licencia ${textoLicencia(r.operador)} (${r.operador.licencia_vigencia}).` })
            .then(x => { if (x.isConfirmed) { this.router.navigate(['/admin/operadores', r.operador!.conductor_id]); } });
          return;
        }
        this.busqueda = r;
        if (r.persona) {
          this.datos.persona_nombres = r.persona.persona_nombres;
          this.datos.persona_apellidos = r.persona.persona_apellidos;
        }
      },
      error: (e) => { this.buscando = false; Swal.fire('Error', 'No se pudo buscar la cédula. ' + (e.error?.msg ?? e.message), 'error'); }
    });
  }

  /** Al cambiar la cédula hay que volver a buscarla */
  alCambiarCedula(): void {
    this.busqueda = null;
    this.datos.persona_nombres = '';
    this.datos.persona_apellidos = '';
    if (this.cedulaOk) { this.buscar(); }
  }

  alCambiarEmision(): void {
    if (this.datos.conductor_licencia_emision && !this.datos.conductor_licencia_validez) {
      this.datos.conductor_licencia_validez = validezSugerida(this.datos.conductor_licencia_emision);
    }
  }

  /** Mensajes de validación de la licencia (los mismos que aplica el API). */
  erroresLicencia(): string[] {
    const d = this.datos;
    const e: string[] = [];
    if (!d.fk_licencia_id) { e.push('Seleccione el tipo de licencia'); }
    if (!d.conductor_licencia_emision || !d.conductor_licencia_validez) { e.push('Ingrese las fechas de emisión y validez'); }
    if (d.conductor_licencia_emision && d.conductor_licencia_emision > this.hoy) { e.push('La fecha de emisión no puede ser futura'); }
    if (d.conductor_licencia_emision && d.conductor_licencia_validez && d.conductor_licencia_validez <= d.conductor_licencia_emision) {
      e.push('La validez debe ser posterior a la emisión');
    }
    return e;
  }

  erroresPersona(): string[] {
    if (!this.esNuevo) { return []; }
    const e: string[] = [];
    if (!this.cedulaOk) { e.push('Ingrese una cédula válida'); }
    if (!this.busqueda) { e.push('Busque la cédula'); return e; }
    if (!this.personaExistente && (!this.datos.persona_nombres?.trim() || !this.datos.persona_apellidos?.trim())) { e.push('Ingrese nombres y apellidos'); }
    if (this.necesitaPuesto && !this.datos.fk_puesto_id) { e.push('Seleccione el puesto'); }
    return e;
  }

  guardar(form: NgForm): void {
    this.validado = true;
    const errores = [...this.erroresPersona(), ...this.erroresLicencia()];
    if (errores.length) {
      Swal.fire('Atención', errores.join('<br>'), 'warning');
      return;
    }
    if (this.guardando) { return; }
    const datos: OperadorGuardar = { ...this.datos };
    if (!this.necesitaPuesto) { delete datos.fk_puesto_id; }
    this.guardando = true;
    this.operadoresService.guardar(datos).subscribe({
      next: (r) => {
        this.guardando = false;
        Swal.fire('Listo', r.msg, 'success');
        this.router.navigate(['/admin/operadores']);
      },
      error: (e) => {
        this.guardando = false;
        if (e.status === 409 && e.error?.id) {
          this.router.navigate(['/admin/operadores', e.error.id]);
          Swal.fire('Ya es operador', e.error.msg, 'info');
          return;
        }
        Swal.fire('No se pudo guardar', e.error?.msg ?? e.error?.error ?? e.message, 'error');
      }
    });
  }

  buscarLicencia = (termino: string, l: LicenciaModel) =>
    `${l.licencia_tipo} ${l.licencia_categoria} ${l.licencia_descripcion ?? ''}`.toLowerCase().includes(termino.toLowerCase());
}
