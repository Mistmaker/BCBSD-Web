import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertComponent, BadgeComponent, ButtonDirective, ButtonGroupComponent, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent,
  FormControlDirective, FormLabelDirective, FormSelectDirective, InputGroupComponent, RowComponent, SpinnerComponent } from '@coreui/angular';
import { forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../auth/auth.service';
import { cedulaValida } from '../../administrativo/models/operadores.model';
import {
  claveTemporal, errorClave, loginSugerido, loginValido, ModuloPrivilegios, nombrePersona, PerfilModel, PersonaUsuario, rolesMarcados, UsuarioGuardar,
  UsuarioModel
} from '../models/usuarios.model';
import { PrivilegiosArbolComponent } from '../privilegios-arbol/privilegios-arbol.component';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-usuarios-mantenimiento',
  imports: [CommonModule, FormsModule, RouterLink, PrivilegiosArbolComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, ButtonGroupComponent, BadgeComponent, AlertComponent, FormControlDirective, FormLabelDirective, FormSelectDirective, InputGroupComponent,
    SpinnerComponent],
  templateUrl: './usuarios-mantenimiento.component.html'
})
export class UsuariosMantenimientoComponent implements OnInit {
  usuario: UsuarioModel | null = null;
  perfiles: PerfilModel[] = [];
  privilegios: ModuloPrivilegios[] = [];
  busqueda: PersonaUsuario | null = null;
  datos: UsuarioGuardar = this.vacio();
  pestana: 'datos' | 'privilegios' = 'datos';
  mostrarClave = false;
  /** El usuario (login) se escribió a mano: ya no se reemplaza por la sugerencia */
  loginEditado = false;
  cargando = true;
  buscando = false;
  guardando = false;
  validado = false;
  readonly nombrePersona = nombrePersona;
  private readonly destroyRef = inject(DestroyRef);

  constructor(public auth: AuthService, private adminService: AdminService, private route: ActivatedRoute, private router: Router) { }

  get esNuevo(): boolean { return !this.usuario; }
  get puedeEditar(): boolean { return this.auth.tienePermiso('SIS_USUARIO_GESTIONAR'); }
  get puedeAsignar(): boolean { return this.auth.tienePermiso('SIS_USUARIO_PRIVILEGIOS'); }
  get personaExistente() { return this.busqueda?.persona ?? null; }
  /** Nombres y apellidos editables: persona nueva, o usuario externo (los de funcionarios los mantiene Talento Humano) */
  get nombresEditables(): boolean { return this.esNuevo ? !this.personaExistente : !this.usuario!.es_funcionario; }
  get docValido(): boolean {
    const d = (this.datos.persona_doc_identidad ?? '').trim();
    return this.datos.persona_tipo_doc === 'PASAPORTE' ? /^[A-Za-z0-9]{5,20}$/.test(d) : cedulaValida(d);
  }
  get listoParaDatos(): boolean { return !this.esNuevo || !!this.busqueda; }
  get perfilSeleccionado(): PerfilModel | undefined { return this.perfiles.find(p => p.perfil_id === this.datos.fk_perfil_id); }
  get perfilesElegibles(): PerfilModel[] {
    return this.perfiles.filter(p => p.perfil_estado === 'ACTIVO' || p.perfil_id === this.usuario?.fk_perfil_id);
  }
  get esUnoMismo(): boolean { return this.usuario?.usuario_id === this.auth.getUsuario()?.usuario?.usuario_id; }

  ngOnInit(): void {
    // Al pasar de 'nuevo' al usuario creado (o abrir otro) se reutiliza el componente: recargar según el id
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(p => {
      const id = p.get('id');
      this.cargar(id && id !== 'nuevo' ? Number(id) : null);
    });
  }

  private cargar(usuarioId: number | null): void {
    this.cargando = true;
    this.usuario = null;
    this.busqueda = null;
    this.validado = false;
    this.loginEditado = false;
    this.datos = this.vacio();
    this.pestana = this.route.snapshot.queryParamMap.get('tab') === 'privilegios' && usuarioId ? 'privilegios' : 'datos';
    forkJoin({
      perfiles: this.adminService.getPerfiles(),
      usuario: usuarioId ? this.adminService.getById(usuarioId) : of(null),
      privilegios: usuarioId ? this.adminService.getPrivilegios(usuarioId) : of([] as ModuloPrivilegios[]),
    }).subscribe({
      next: ({ perfiles, usuario, privilegios }) => {
        this.perfiles = perfiles;
        this.privilegios = privilegios;
        if (usuario) {
          this.usuario = usuario;
          this.datos = {
            usuario_id: usuario.usuario_id, persona_nombres: usuario.persona_nombres ?? '', persona_apellidos: usuario.persona_apellidos ?? '',
            persona_correo: usuario.persona_correo ?? '', persona_celular: usuario.persona_celular ?? '', usuario_login: usuario.usuario_login,
            fk_perfil_id: usuario.fk_perfil_id, usuario_estado: usuario.usuario_estado,
          };
        } else {
          this.datos.fk_perfil_id = perfiles.find(p => p.perfil_nombre === 'SIN PERFIL')?.perfil_id ?? null;
        }
        this.cargando = false;
      },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudo cargar la información. ' + (e.error?.msg ?? e.error?.error ?? e.message), 'error'); }
    });
  }

  private vacio(): UsuarioGuardar {
    return { persona_tipo_doc: 'CEDULA', persona_doc_identidad: '', persona_nombres: '', persona_apellidos: '', persona_correo: '', persona_celular: '',
             usuario_login: '', clave: '', fk_perfil_id: null, usuario_estado: 'ACTIVO' };
  }

  alCambiarDocumento(): void {
    this.busqueda = null;
    // La cédula se busca sola al completarse; el pasaporte, con el botón (su longitud varía)
    if (this.datos.persona_tipo_doc === 'CEDULA' && this.docValido) { this.buscar(); }
  }

  /** Busca el documento: si la persona ya tiene usuario ofrece abrirlo; si existe, usa sus datos. */
  buscar(): void {
    const doc = (this.datos.persona_doc_identidad ?? '').trim().toUpperCase();
    this.datos.persona_doc_identidad = doc;
    if (!this.docValido) { return; }
    this.buscando = true;
    this.adminService.buscarPersona(doc).subscribe({
      next: (r) => {
        this.buscando = false;
        if (r.usuario) {
          Swal.fire({ title: 'Ya tiene usuario', icon: 'info', showCancelButton: true, confirmButtonText: 'Abrir su usuario', cancelButtonText: 'Cancelar',
                      text: `${nombrePersona(r.usuario)} ya tiene el usuario "${r.usuario.usuario_login}".` })
            .then(x => { if (x.isConfirmed) { this.router.navigate(['/adm/usuarios', r.usuario!.usuario_id]); } });
          return;
        }
        this.busqueda = r;
        if (r.persona) {
          this.datos.persona_nombres = r.persona.persona_nombres;
          this.datos.persona_apellidos = r.persona.persona_apellidos;
          this.datos.persona_correo = r.persona.persona_correo ?? '';
          this.datos.persona_celular = r.persona.persona_celular ?? '';
          this.sugerirLogin();
        }
      },
      error: (e) => { this.buscando = false; Swal.fire('Error', 'No se pudo buscar el documento. ' + (e.error?.msg ?? e.message), 'error'); }
    });
  }

  /** Sugiere el usuario (inicial del nombre + primer apellido) mientras no se haya escrito a mano */
  sugerirLogin(): void {
    if (this.esNuevo && !this.loginEditado) {
      this.datos.usuario_login = loginSugerido(this.datos.persona_nombres, this.datos.persona_apellidos);
    }
  }

  generarClave(): void {
    this.datos.clave = claveTemporal();
    this.mostrarClave = true;
  }

  errores(): string[] {
    const d = this.datos;
    const e: string[] = [];
    if (this.esNuevo && !this.docValido) { e.push(d.persona_tipo_doc === 'PASAPORTE' ? 'Ingrese un pasaporte válido' : 'Ingrese una cédula válida'); }
    if (this.esNuevo && !this.busqueda) { e.push('Busque el documento'); return e; }
    if (this.nombresEditables && (!d.persona_nombres.trim() || !d.persona_apellidos.trim())) { e.push('Ingrese nombres y apellidos'); }
    if (d.persona_correo && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.persona_correo)) { e.push('El correo no es válido'); }
    if (d.persona_celular && !/^\d{7,15}$/.test(d.persona_celular.replace(/\D/g, ''))) { e.push('El celular debe tener entre 7 y 15 dígitos'); }
    if (!loginValido(d.usuario_login)) { e.push('Usuario: de 3 a 40 caracteres (letras sin tildes, números, punto, guion o guion bajo)'); }
    if (!d.fk_perfil_id) { e.push('Seleccione el perfil'); }
    if (this.esNuevo) {
      const c = errorClave(d.clave, d.usuario_login);
      if (c) { e.push(c); }
    }
    if (this.esUnoMismo && d.usuario_estado !== 'ACTIVO') { e.push('No puede inactivar su propio usuario'); }
    return e;
  }

  guardar(): void {
    this.validado = true;
    const errores = this.errores();
    if (errores.length) {
      Swal.fire('Atención', errores.join('<br>'), 'warning');
      return;
    }
    if (this.guardando) { return; }
    const datos: UsuarioGuardar = { ...this.datos, usuario_login: this.datos.usuario_login.trim().toLowerCase() };
    if (!this.esNuevo) { delete datos.clave; }
    this.guardando = true;
    this.adminService.guardarUsuario(datos).subscribe({
      next: (r) => {
        this.guardando = false;
        if (this.esNuevo) {
          Swal.fire({ icon: 'success', title: 'Usuario creado',
            html: `Entregue estos datos a la persona:<br><br>Usuario: <b>${datos.usuario_login}</b><br>Clave temporal: <b>${this.escapar(datos.clave ?? '')}</b><br><br>`
                + 'Deberá cambiar la clave al ingresar por primera vez.' })
            .then(() => this.router.navigate(['/adm/usuarios', r.id], { queryParams: { tab: 'privilegios' } }));
          return;
        }
        Swal.fire('Listo', r.msg, 'success');
        this.recargar();
      },
      error: (e) => {
        this.guardando = false;
        if (e.status === 409 && e.error?.id) {
          Swal.fire('Ya tiene usuario', e.error.msg, 'info');
          return;
        }
        Swal.fire('No se pudo guardar', e.error?.msg ?? e.error?.error ?? e.message, 'error');
      }
    });
  }

  /** El administrador restablece la clave: genera una temporal que el usuario cambiará al entrar. */
  restablecerClave(): void {
    if (!this.usuario) { return; }
    const sugerida = claveTemporal();
    Swal.fire({
      title: 'Restablecer clave', input: 'text', inputValue: sugerida, showCancelButton: true, confirmButtonText: 'Restablecer', cancelButtonText: 'Cancelar',
      text: `Clave temporal para "${this.usuario.usuario_login}" (deberá cambiarla al ingresar):`,
      inputValidator: (v) => errorClave(v, this.usuario!.usuario_login) ?? undefined,
    }).then(x => {
      if (!x.isConfirmed) { return; }
      this.adminService.restablecerClave(this.usuario!.usuario_id, x.value).subscribe({
        next: (r) => Swal.fire({ icon: 'success', title: 'Clave restablecida', html: `${r.msg}<br><br>Clave temporal: <b>${this.escapar(x.value)}</b>` }),
        error: (e) => Swal.fire('No se pudo restablecer', e.error?.msg ?? e.message, 'error'),
      });
    });
  }

  guardarPrivilegios(): void {
    if (!this.usuario || this.guardando) { return; }
    this.guardando = true;
    this.adminService.guardarPrivilegios(this.usuario.usuario_id, rolesMarcados(this.privilegios)).subscribe({
      next: (r) => {
        this.guardando = false;
        Swal.fire('Listo', r.msg, 'success');
        if (this.esUnoMismo) { this.auth.refrescarPermisos().subscribe(); }
        this.recargar();
      },
      error: (e) => { this.guardando = false; Swal.fire('No se pudo guardar', e.error?.msg ?? e.message, 'error'); }
    });
  }

  private recargar(): void {
    const id = this.usuario!.usuario_id;
    forkJoin({ usuario: this.adminService.getById(id), privilegios: this.adminService.getPrivilegios(id) }).subscribe(({ usuario, privilegios }) => {
      this.usuario = usuario;
      this.privilegios = privilegios;
      if (this.esUnoMismo) { this.auth.refrescarPermisos().subscribe(); }
    });
  }

  private escapar(s: string): string {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
  }
}
