import { AfterViewInit, Component, DestroyRef, effect, inject, OnDestroy, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';

import { DOCUMENT, NgStyle, CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { ChartData, ChartOptions, ChartType, ScaleOptions } from 'chart.js';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
  WidgetStatCComponent,
  TemplateIdDirective,
  InputGroupComponent, InputGroupTextDirective, FormLabelDirective, FormControlDirective, FormSelectDirective
} from '@coreui/angular';
import { WidgetsBrandComponent } from '../../views/widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../../views/widgets/widgets-dropdown/widgets-dropdown.component';
// import { DashboardChartsData, IChartProps } from '../../views/dashboard/dashboard-charts-data';
import { IntervencionesService } from '../services/intervenciones.service';
import Swal from 'sweetalert2';
import { getStyle } from '@coreui/utils';
import { EstacionesModel } from '../models/estadisticas.model';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

@Component({
  selector: 'app-sbj-dashboard',
  imports: [FormSelectDirective, FormLabelDirective, FormControlDirective, FormsModule, TemplateIdDirective, WidgetStatCComponent, CommonModule, WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent, InputGroupComponent, InputGroupTextDirective],
  templateUrl: './sbj-dashboard.component.html',
  styleUrl: './sbj-dashboard.component.scss'
})
export class SbjDashboardComponent implements AfterViewInit {

  fechaDesde = '';
  fechaHasta = '';
  estacionId = 0;
  estaciones: EstacionesModel[] = [];

  totalI = 0;
  totalB = 0;
  totalF = 0;
  diaCritico ='';
  horaCritica='';
  mesCritico='';

  chartStations: any = {}
  chartEmergencias: any = {}
  chartCausas: any = {}
  chartIncidentes: any = {}

  chartTypeBar: ChartType = 'bar';
  chartTypeDona: ChartType = 'doughnut';
  chartTypeLine: ChartType = 'line';
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Resumen de intervenciones del BCBSD'
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Cantidad'
        },
        suggestedMin: 0,
        suggestedMax: 10
      }
    }
  };

  constructor(private _intervencionesService: IntervencionesService) { }

  obtenerEstadisticas() {
    let data = {
      estacion: this.estacionId,
      desde: this.fechaDesde,
      hasta: this.fechaHasta
    }

    this._intervencionesService.getEstadisticasFiltros(data).subscribe({
      next: (data: any) => {

        //POR ESTACIONES
        this.chartStations = {
          ...data.chartEstaciones
        };
        this.chartCausas = {
          ...data.chartCausas
        };
        this.chartIncidentes = {
          ...data.chartTipoIncidencias
        };
        this.chartEmergencias = {
          ...data.chartEmergencias
        };

        this.totalI = data.total_i;
        this.totalB = data.total_b;
        this.totalF = data.total_f;

        this.horaCritica = data.hora_critica;
        this.diaCritico = data.dia_critico;
        this.mesCritico = data.mes_critico;

      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
  }

  ngOnInit() {
    //Obteniendo estaciones
    this._intervencionesService.getEstaciones().subscribe({
      next: (data) => {
        this.estaciones = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
  }

  ngAfterViewInit() {
    this._intervencionesService.getEstadisticas().subscribe({
      next: (data: any) => {

        //POR ESTACIONES
        this.chartStations = {
          ...data.chartEstaciones
        };
        this.chartCausas = {
          ...data.chartCausas
        };
        this.chartIncidentes = {
          ...data.chartTipoIncidencias
        };

        this.chartEmergencias = {
          ...data.chartEmergencias
        };

        this.totalI = data.total_i;
        this.totalB = data.total_b;
        this.totalF = data.total_f;

        this.horaCritica = data.hora_critica;
        this.diaCritico = data.dia_critico;
        this.mesCritico = data.mes_critico;

      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
  }
}
