import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, RowComponent,
  SpinnerComponent, TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

import { AuthService } from '../../auth/auth.service';
import { FiltroGeneralPipe } from '../../pipes/filtro-general.pipe';
import { PerfilModel } from '../models/usuarios.model';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-perfiles-listado',
  imports: [CommonModule, FormsModule, RouterLink, FiltroGeneralPipe, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormControlDirective, SpinnerComponent],
  templateUrl: './perfiles-listado.component.html'
})
export class PerfilesListadoComponent implements OnInit {
  perfiles: PerfilModel[] = [];
  filtro = '';
  cargando = true;

  constructor(public auth: AuthService, private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getPerfiles().subscribe({
      next: (d) => { this.perfiles = d; this.cargando = false; },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudieron cargar los perfiles. ' + (e.error?.msg ?? e.message), 'error'); }
    });
  }
}
