import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ConfiguracionMantenimiento, ContratoMantenimientoModel, contratoParaGuardar, EstadoVehiculoModel, InformeMantenimientoModel, OrdenMantenimientoModel, PlanMantenimientoModel, PlanResumenModel,
  RecursoMantenimientoModel, ordenParaGuardar, planParaGuardar
} from '../models/mantenimiento.model';

interface RespuestaGuardado { msg: string; id: number; orden_codigo?: string; informe_numero?: string; }

@Injectable({ providedIn: 'root' })
export class MantenimientoService {
  private readonly url = `${environment.API_URL}/servicios/administrativo/mantenimiento`;

  constructor(private http: HttpClient) { }

  /** Institución, parámetros del módulo y director administrativo vigente */
  getConfiguracion() {
    return this.http.get<ConfiguracionMantenimiento>(`${environment.API_URL}/servicios/admin/getSistema.php`, { params: { modulo: 'MANTENIMIENTO' } });
  }

  // Estado de la flota / alertas
  getEstadoVehiculos() {
    return this.http.get<EstadoVehiculoModel[]>(`${this.url}/getEstadoVehiculos.php`);
  }
  getEstadoVehiculo(vehiculoId: number) {
    return this.http.get<EstadoVehiculoModel>(`${this.url}/getEstadoVehiculos.php`, { params: { id: vehiculoId } });
  }

  // Órdenes
  getOrdenes(filtros: { vehiculo_id?: number; sin_informe?: boolean; contrato_id?: number | null } = {}) {
    let params = new HttpParams();
    if (filtros.vehiculo_id) { params = params.set('vehiculo_id', filtros.vehiculo_id); }
    if (filtros.contrato_id) { params = params.set('contrato_id', filtros.contrato_id); }
    if (filtros.sin_informe) { params = params.set('sin_informe', 1); }
    return this.http.get<OrdenMantenimientoModel[]>(`${this.url}/getOrdenesMantenimiento.php`, { params });
  }
  getOrden(id: number) {
    return this.http.get<OrdenMantenimientoModel>(`${this.url}/getOrdenesMantenimiento.php`, { params: { id } });
  }
  guardarOrden(orden: OrdenMantenimientoModel) {
    const datos = ordenParaGuardar(orden);
    return orden.orden_id
      ? this.http.put<RespuestaGuardado>(`${this.url}/setOrdenMantenimiento.php`, datos)
      : this.http.post<RespuestaGuardado>(`${this.url}/setOrdenMantenimiento.php`, datos);
  }

  // Informes
  getInformes() {
    return this.http.get<InformeMantenimientoModel[]>(`${this.url}/getInformesMantenimiento.php`);
  }
  /** Siguiente número de informe individual de la orden (botón +1) */
  getSiguienteSerieOrden() {
    return this.http.get<{ orden_serie: number }>(`${this.url}/getOrdenesMantenimiento.php`, { params: { siguiente_serie: 1 } });
  }

  /** Siguiente número de informe de pago según el formato configurado (botón +1) */
  getSiguienteInformeOrden() {
    return this.http.get<{ orden_informe_numero: string; orden_informe_serie: number }>(`${this.url}/getOrdenesMantenimiento.php`, { params: { siguiente_informe: 1 } });
  }

  /** URL del PDF de una orden: orden, informe individual o acta entrega-recepción */
  urlReporteOrden(id: number, doc: 'orden' | 'informe' | 'acta'): string {
    return `${environment.API_URL}/reportes/mantenimiento/ordenMantenimiento.php?id=${id}&doc=${doc}`;
  }

  /** URL del PDF de una bitácora (informe de grupo) */
  urlReporteBitacora(id: number): string {
    return `${environment.API_URL}/reportes/mantenimiento/informeMantenimiento.php?id=${id}`;
  }

  /** Siguiente número de bitácora sugerido (botón +1); con contrato: "BITÁCORA NN - CÓDIGO" */
  getSiguienteNumeroInforme(contratoId?: number | null) {
    let params = new HttpParams().set('siguiente', 1);
    if (contratoId) { params = params.set('contrato_id', contratoId); }
    return this.http.get<{ informe_numero: string; informe_serie: number }>(`${this.url}/getInformesMantenimiento.php`, { params });
  }

  // Contratos
  getContratos(filtros: { vigentes?: boolean; vehiculo_id?: number | null } = {}) {
    let params = new HttpParams();
    if (filtros.vigentes) { params = params.set('vigentes', 1); }
    if (filtros.vehiculo_id) { params = params.set('vehiculo_id', filtros.vehiculo_id); }
    return this.http.get<ContratoMantenimientoModel[]>(`${this.url}/getContratos.php`, { params });
  }
  getContrato(id: number) {
    return this.http.get<ContratoMantenimientoModel>(`${this.url}/getContratos.php`, { params: { id } });
  }
  guardarContrato(contrato: ContratoMantenimientoModel) {
    const datos = contratoParaGuardar(contrato);
    return contrato.contrato_id
      ? this.http.put<RespuestaGuardado>(`${this.url}/setContrato.php`, datos)
      : this.http.post<RespuestaGuardado>(`${this.url}/setContrato.php`, datos);
  }
  getInforme(id: number) {
    return this.http.get<InformeMantenimientoModel>(`${this.url}/getInformesMantenimiento.php`, { params: { id } });
  }
  guardarInforme(informe: InformeMantenimientoModel) {
    const { ordenes_detalle, psg_nombre, da_nombre, usuario, ...datos } = informe;
    return informe.informe_id
      ? this.http.put<RespuestaGuardado>(`${this.url}/setInformeMantenimiento.php`, datos)
      : this.http.post<RespuestaGuardado>(`${this.url}/setInformeMantenimiento.php`, datos);
  }

  // Planes y recursos
  getPlanes() {
    return this.http.get<PlanResumenModel[]>(`${this.url}/getPlanes.php`);
  }
  getPlan(id: number) {
    return this.http.get<PlanMantenimientoModel>(`${this.url}/getPlanes.php`, { params: { id } });
  }
  guardarPlan(plan: PlanMantenimientoModel) {
    const datos = planParaGuardar(plan);
    return plan.plan_id
      ? this.http.put<RespuestaGuardado>(`${this.url}/setPlan.php`, datos)
      : this.http.post<RespuestaGuardado>(`${this.url}/setPlan.php`, datos);
  }
  getRecursos() {
    return this.http.get<RecursoMantenimientoModel[]>(`${this.url}/getRecursos.php`);
  }
  guardarRecurso(recurso: RecursoMantenimientoModel) {
    return recurso.recurso_id
      ? this.http.put<RespuestaGuardado>(`${this.url}/setRecurso.php`, recurso)
      : this.http.post<RespuestaGuardado>(`${this.url}/setRecurso.php`, recurso);
  }
}
