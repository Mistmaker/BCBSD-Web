import { EventosService } from './../../services/ubv/eventos.service';
import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { VoluntariosEventos } from '../../models/voluntarios.molde';

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
  ModalToggleDirective, ButtonCloseDirective
} from '@coreui/angular';

import Swal from 'sweetalert2';
import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-eventos-listado',
  imports: [FiltroGeneralPipe, FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, BadgeComponent, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, ButtonGroupComponent, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, TableDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective, ButtonCloseDirective, FullCalendarModule
  ],
  templateUrl: './eventos-listado.component.html',
  styleUrl: './eventos-listado.component.scss'
})
export class EventosListadoComponent {

  eventos: VoluntariosEventos[] = [];
  evento: VoluntariosEventos = new VoluntariosEventos();
  vistaCalendario = true;
  filtroBusqueda = '';
  errorMessage: string = '';

  pdfUrl: SafeResourceUrl | null = null;
  reporteDesde: string = '';
  reporteHasta: string = '';

  calendarOptions: {
    plugins: any[],
    initialView: string,
    expandRows: boolean,
    dayMaxEvents: boolean,
    height: string,
    locale: string,
    headerToolbar: { left: string, center: string, right: string },
    eventClick: any,
    events: { title: string, date: string }[]
  } = {
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: 'dayGridMonth',
      expandRows: true,
      dayMaxEvents: false,
      height: 'auto',
      locale: 'es',
      eventClick: this.handleEventClick.bind(this),
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      events: [
        // {
        //   title: 'Rendición de Cuentas',
        //   date: '2026-05-05 10:05:00',
        //   extendedProps: {
        //     department: 'Sales',
        //     meetingRoom: 'B102',
        //     internalId: 98765
        //   }
        // },
        // {
        //   title: 'Incorporación Bomberos',
        //   date: '2026-05-12'
        // },
        // { title: 'Meeting', start: new Date() }
      ]
    };

  constructor(private _eventosService: EventosService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.eventos = [];
    this.errorMessage = '';
    this._eventosService.getAll().subscribe({
      next: (data) => {
        this.eventos = data;
        this.calendarOptions.events = data.map(evento => ({
          title: evento.evento_motivo,
          date: evento.evento_fecha_inicio,
          extendedProps: {
            evento
          }
          // start: evento.evento_fecha_inicio + ' ' + evento.evento_hora_inicio,
          // end: evento.evento_fecha_finalizacion + ' ' + evento.evento_hora_finalizacion
        }));
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    });
  }

  cambiarVista() {
    this.vistaCalendario = !this.vistaCalendario;
  }

  handleEventClick(clickInfo: EventClickArg) {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    // clickInfo.event.remove();
    // llamar al modal <c-modal #scrollableLongContentModal id="scrollableLongContentModal" alignment="center" size="xl" scrollable>
    // document.getElementById('scrollableLongContentModal')?.click();
    // }
    console.log('Evento clickeado:', clickInfo.event.extendedProps);
    this.evento.evento_motivo = clickInfo.event.extendedProps["evento"]["evento_motivo"];
    this.evento.evento_fecha_inicio = clickInfo.event.extendedProps["evento"]["evento_fecha_inicio"];
    this.evento.evento_fecha_finalizacion = clickInfo.event.extendedProps["evento"]["evento_fecha_finalizacion"];
    this.evento.evento_hora_inicio = clickInfo.event.extendedProps["evento"]["evento_hora_inicio"];
    this.evento.evento_hora_finalizacion = clickInfo.event.extendedProps["evento"]["evento_hora_finalizacion"];
    this.evento.evento_descripcion = clickInfo.event.extendedProps["evento"]["evento_descripcion"];

    // Abrir modal
    // document.getElementById('scrollableLongContentModal')?.click();

  }

}
