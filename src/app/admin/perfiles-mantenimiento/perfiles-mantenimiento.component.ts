import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormLabelDirective,
  FormSelectDirective, RowComponent, SpinnerComponent } from '@coreui/angular';
import Swal from 'sweetalert2';

import { AuthService } from '../../auth/auth.service';
import { EstadoRegistro, ModuloPrivilegios, PerfilDetalle, rolesMarcados } from '../models/usuarios.model';
import { PrivilegiosArbolComponent } from '../privilegios-arbol/privilegios-arbol.component';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-perfiles-mantenimiento',
  imports: [CommonModule, FormsModule, RouterLink, PrivilegiosArbolComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, AlertComponent, FormControlDirective, FormLabelDirective, FormSelectDirective, SpinnerComponent],
  templateUrl: './perfiles-mantenimiento.component.html'
})
export class PerfilesMantenimientoComponent implements OnInit {
  perfil: PerfilDetalle | null = null;
  nombre = '';
  descripcion = '';
  estado: EstadoRegistro = 'ACTIVO';
  arbol: ModuloPrivilegios[] = [];
  cargando = true;
  guardando = false;
  validado = false;

  constructor(public auth: AuthService, private adminService: AdminService, private route: ActivatedRoute, private router: Router) { }

  get puedeEditar(): boolean { return this.auth.tienePermiso('SIS_PERFIL_GESTIONAR'); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const perfilId = id && id !== 'nuevo' ? Number(id) : null;
    if (perfilId) {
      this.adminService.getPerfil(perfilId).subscribe({
        next: (p) => this.cargarPerfil(p),
        error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudo cargar el perfil. ' + (e.error?.msg ?? e.error?.error ?? e.message), 'error'); }
      });
    } else {
      this.adminService.getArbolPrivilegios().subscribe({
        next: (arbol) => { this.arbol = arbol; this.cargando = false; },
        error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudieron cargar los privilegios. ' + (e.error?.msg ?? e.message), 'error'); }
      });
    }
  }

  private cargarPerfil(p: PerfilDetalle): void {
    this.perfil = p;
    this.nombre = p.perfil_nombre;
    this.descripcion = p.perfil_descripcion ?? '';
    this.estado = p.perfil_estado;
    this.arbol = p.privilegios_arbol;
    this.cargando = false;
  }

  guardar(): void {
    this.validado = true;
    if (this.nombre.trim().length < 3) {
      Swal.fire('Atención', 'Ingrese el nombre del perfil', 'warning');
      return;
    }
    if (this.guardando) { return; }
    const roles = rolesMarcados(this.arbol);
    const aviso = this.perfil?.usuarios_activos
      ? Swal.fire({ icon: 'question', title: 'Aplicar a los usuarios', showCancelButton: true, confirmButtonText: 'Guardar', cancelButtonText: 'Cancelar',
                    text: `Los ${this.perfil.usuarios_activos} usuario(s) activos con este perfil recibirán estos privilegios de inmediato.` })
      : Promise.resolve({ isConfirmed: true });
    aviso.then(x => {
      if (!x.isConfirmed) { return; }
      this.guardando = true;
      this.adminService.guardarPerfil({ perfil_id: this.perfil?.perfil_id, perfil_nombre: this.nombre, perfil_descripcion: this.descripcion, perfil_estado: this.estado, roles })
        .subscribe({
          next: (r) => {
            this.guardando = false;
            this.auth.refrescarPermisos().subscribe(); // por si el usuario conectado tiene este perfil
            Swal.fire('Listo', r.msg, 'success');
            this.router.navigate(['/adm/perfiles']);
          },
          error: (e) => { this.guardando = false; Swal.fire('No se pudo guardar', e.error?.msg ?? e.error?.error ?? e.message, 'error'); }
        });
    });
  }
}
