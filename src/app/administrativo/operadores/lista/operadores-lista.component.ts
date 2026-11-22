import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormSelectDirective,
  RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

import { AuthService } from '../../../auth/auth.service';
import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';
import { colorVigencia, diasParaVencer, FiltroOperadores, filtrarOperadores, OperadorModel, textoLicencia } from '../../models/operadores.model';
import { OperadoresService } from '../../services/operadores.service';

@Component({
  selector: 'app-operadores-lista',
  imports: [CommonModule, FormsModule, RouterLink, FiltroGeneralPipe, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormControlDirective, FormSelectDirective, SpinnerComponent],
  templateUrl: './operadores-lista.component.html'
})
export class OperadoresListaComponent implements OnInit {
  operadores: OperadorModel[] = [];
  filtro = '';
  vigencia: FiltroOperadores = 'TODOS';
  cargando = true;
  readonly colorVigencia = colorVigencia;
  readonly textoLicencia = textoLicencia;
  readonly diasParaVencer = diasParaVencer;

  constructor(public auth: AuthService, private operadoresService: OperadoresService) { }

  ngOnInit(): void {
    this.operadoresService.getOperadores().subscribe({
      next: (d) => { this.operadores = d; this.cargando = false; },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudieron cargar los operadores. ' + (e.error?.msg ?? e.message), 'error'); }
    });
  }

  get filas(): OperadorModel[] {
    return filtrarOperadores(this.operadores, this.vigencia);
  }

  cuenta(f: FiltroOperadores): number {
    return filtrarOperadores(this.operadores, f).length;
  }
}
