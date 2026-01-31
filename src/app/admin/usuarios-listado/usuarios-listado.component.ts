import { UsuariosModel } from './../models/usuarios.model';
import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  BadgeComponent,
  BorderDirective,
  ButtonDirective,
  ButtonGroupComponent,
  ThemeDirective,
  DropdownComponent,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardGroupComponent,
  CardHeaderComponent,
  CardImgDirective,
  CardLinkDirective,
  CardSubtitleDirective,
  CardTextDirective,
  CardTitleDirective,
  ColComponent,
  GutterDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  RowComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TableDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  ButtonCloseDirective
} from '@coreui/angular';
import { AdminService } from '../services/admin.service';
import Swal from 'sweetalert2';
import { FiltroGeneralPipe } from '../../pipes/filtro-general.pipe';



@Component({
  selector: 'app-usuarios-listado',
  imports: [FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, BadgeComponent, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, ButtonGroupComponent, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, TableDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ButtonCloseDirective, FiltroGeneralPipe
  ],
  templateUrl: './usuarios-listado.component.html',
  styleUrl: './usuarios-listado.component.scss'
})
export class UsuariosListadoComponent {

  usuarios: UsuariosModel[] = [];
  filtroBusqueda = '';
  errorMessage: string = '';
  page: number = 1;

  privilegios: any[] = [];
  usuarioSeleccionado: any = null;
  cargandoPrivilegios = false;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.usuarios = [];
    this.errorMessage = '';
    this.adminService.getAll().subscribe({
      next: (data) => this.usuarios = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    })
  }

  cargarPrivilegios(usuario_id: number) {
    this.usuarioSeleccionado = usuario_id;
    this.adminService.getPrivilegios(usuario_id).subscribe({
      next: (data) => {
        this.privilegios = data;
        this.cargandoPrivilegios = false;
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
        console.error(e);
        Swal.fire('Error', 'No se pudieron cargar los privilegios', 'error');
        this.cargandoPrivilegios = false;
      },
      complete: () => console.info('complete')
    })
  }

  guardarPrivilegios() {
    const rolesSeleccionados: number[] = [];

    this.privilegios.forEach(modulo => {
      modulo.submodulos.forEach((sub: { roles: any[]; }) => {
        sub.roles.forEach((rol: any) => {
          if (rol.asignado) {
            rolesSeleccionados.push(rol.rol_id);
          }
        });
      });
    });

    this.adminService.guardarPrivilegios(this.usuarioSeleccionado, rolesSeleccionados).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Privilegios actualizados correctamente', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron guardar los privilegios', 'error');
      }
    });
  }


}
