import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { AuthService } from '../../../auth/auth.service';
import { Router,RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-voluntarios',
  imports: [ReactiveFormsModule, FormsModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle,RouterLink],
  templateUrl: './login-voluntarios.component.html',
  styleUrl: './login-voluntarios.component.scss'
})
export class LoginVoluntariosComponent {

  usuario: string = '';
  password: string = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  onLogin() {
    this.auth.loginVoluntarios({ usuario: this.usuario, password: this.password }).subscribe({
      next: (res) => {
        this.auth.setSession(res);
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrecta';
        Swal.fire('Error', this.error, 'error')
      }
    });
  }
}
