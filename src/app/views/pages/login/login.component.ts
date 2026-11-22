import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { AuthService } from '../../../auth/auth.service';
import { Router,RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../admin/services/admin.service';
import { errorClave } from '../../../admin/models/usuarios.model';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ReactiveFormsModule, FormsModule,ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, RouterLink]
})
export class LoginComponent {

  usuario: string = '';
  password: string = '';
  error = '';

  constructor(private auth: AuthService, private router: Router, private adminService: AdminService) {}

  onLogin() {
    this.auth.login({ usuario: this.usuario, password: this.password }).subscribe({
      next: (res) => {
        this.auth.setSession(res);
        if (res?.usuario?.cambiar_clave) {
          this.pedirNuevaClave(this.password, res.usuario.nombre);
          return;
        }
        this.router.navigate(['/']);
      },
      error: (e) => {
        // 403 = usuario inactivo (el API explica el motivo); 401 = credenciales incorrectas
        this.error = e?.status === 403 && e.error?.msg ? e.error.msg : 'Usuario o contraseña incorrecta';
        Swal.fire('Error', this.error, 'error');
      }
    });
  }

  /** Clave temporal (usuario nuevo o restablecida por el administrador): debe cambiarla antes de continuar. */
  pedirNuevaClave(claveActual: string, login: string): void {
    Swal.fire({
      title: 'Cambie su clave',
      html: '<p class="small">Su clave es temporal. Elija una nueva: mínimo 8 caracteres con letras y números.</p>'
          + '<input id="nueva1" type="password" class="swal2-input" placeholder="Nueva clave" autocomplete="new-password">'
          + '<input id="nueva2" type="password" class="swal2-input" placeholder="Repita la nueva clave" autocomplete="new-password">',
      confirmButtonText: 'Guardar clave', allowOutsideClick: false, allowEscapeKey: false, showLoaderOnConfirm: true,
      preConfirm: () => {
        const n1 = (document.getElementById('nueva1') as HTMLInputElement).value;
        const n2 = (document.getElementById('nueva2') as HTMLInputElement).value;
        const error = errorClave(n1, login) ?? (n1 !== n2 ? 'Las claves no coinciden' : n1 === claveActual ? 'La clave nueva debe ser distinta de la temporal' : null);
        if (error) { Swal.showValidationMessage(error); return false; }
        return new Promise(resolve => this.adminService.cambiarMiClave(claveActual, n1).subscribe({
          next: () => resolve(true),
          error: (e) => { Swal.showValidationMessage(e.error?.msg ?? 'No se pudo cambiar la clave'); resolve(false); },
        }));
      },
    }).then(r => {
      if (r.isConfirmed && r.value) {
        Swal.fire('Listo', 'Su clave fue actualizada', 'success');
        this.router.navigate(['/']);
      }
    });
  }

}
