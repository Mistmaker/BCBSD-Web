import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  EstadoVehiculoModel, InformeMantenimientoModel, OrdenMantenimientoModel, PlanMantenimientoModel, PlanResumenModel,
  RecursoMantenimientoModel, ordenParaGuardar, planParaGuardar
} from '../models/mantenimiento.model';

interface RespuestaGuardado { msg: string; id: number; orden_codigo?: string; informe_numero?: string; }

@Injectable({ providedIn: 'root' })
export class MantenimientoService {
  private readonly url = `${environment.API_URL}/servicios/administrativo/mantenimiento`;

  constructor(private http: HttpClient) { }

  // Estado de la flota / alertas
  getEstadoVehiculos() {
    return this.http.get<EstadoVehiculoModel[]>(`${this.url}/getEstadoVehiculos.php`);
  }
  getEstadoVehiculo(vehiculoId: number) {
    return this.http.get<EstadoVehiculoModel>(`${this.url}/getEstadoVehiculos.php`, { params: { id: vehiculoId } });
  }

  // Órdenes
  getOrdenes(filtros: { vehiculo_id?: number; sin_informe?: boolean } = {}) {
    let params = new HttpParams();
    if (filtros.vehiculo_id) { params = params.set('vehiculo_id', filtros.vehiculo_id); }
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
