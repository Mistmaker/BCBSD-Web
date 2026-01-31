import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AphHojaRuta, AphHojaRuta_tipoEmergencia } from '../../models/aph-hojaruta.model';

@Injectable({
  providedIn: 'root'
})
export class HojaRutaService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<AphHojaRuta[]>(`${environment.API_URL}/servicios/subjefatura/aph/getHojasRuta.php`)
  }

  getById(id: number) {
    return this.http.get<AphHojaRuta>(`${environment.API_URL}/servicios/subjefatura/aph/getHojasRuta.php?id=${id}`)
  }

  getTiposEmergencia() {
    return this.http.get<AphHojaRuta_tipoEmergencia[]>(`${environment.API_URL}/servicios/subjefatura/aph/getTiposEmergencias.php`)
  }

  // getEstaciones() {
  //   return this.http.get<EstacionesModel[]>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getEstaciones.php`)
  // }

  // getCausas() {
  //   return this.http.get<CausasModel[]>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getCausas.php`)
  // }

  // getCausasByTipo(id_tipo: number) {
  //   return this.http.get<CausasModel[]>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getCausas.php?id_tipo=${id_tipo}`)
  // }

  // getNaturalezas() {
  //   return this.http.get<NaturalezasModel[]>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getNaturalezas.php`)
  // }

  // getNaturalezasByTipo(id_tipo: number) {
  //   return this.http.get<NaturalezasModel[]>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getNaturalezas.php?id_tipo=${id_tipo}`)
  // }

  // getEmergenciasByTipo(id_tipo: number) {
  //   return this.http.get<TipoEmergenciaModel[]>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getTiposEmergencias.php?id_tipo=${id_tipo}`)
  // }

  // getTiposIncidencias() {
  //   return this.http.get<TipoIncidenciaModel[]>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getTiposIncidecias.php`)
  // }

  // getVehiculoUltKm(id: number) {
  //   return this.http.get<OrdenesMovilizacionModel>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getOrdenUltimoKm.php?id=${id}`)
  // }

  // getConductores() {
  //   return this.http.get<PersonalModel[]>(`${environment.API_URL}/servicios/tthh/getConductores.php`)
  // }

  save(intervencion: AphHojaRuta) {
    return this.http.post<any>(`${environment.API_URL}/servicios/subjefatura/aph/setHojaRuta.php`, intervencion)
  }

  update(intervencion: AphHojaRuta) {
    return this.http.put<any>(`${environment.API_URL}/servicios/subjefatura/estadisticas/setOrden.php`, intervencion)
  }

  getProvincias() {
    return this.http.get<any[]>(`${environment.API_URL}/servicios/recursos/getProvincias.php`)
  }

  getCantones(id: number) {
    return this.http.get<any[]>(`${environment.API_URL}/servicios/recursos/getCantones.php?id=${id}`)
  }

  getParroquias(id: number) {
    return this.http.get<any[]>(`${environment.API_URL}/servicios/recursos/getParroquias.php?id=${id}`)
  }
  
  getCie10() {
    return this.http.get<any[]>(`${environment.API_URL}/servicios/subjefatura/aph/getCie10.php`)
  }

  imprimirOrden(id: number) {
    return `${environment.API_URL}/reportes/ordenMovilizacion.php?id=${id}`;
  }

  getCie10Busqueda(busqueda: string) {
    return this.http.get<any[]>(`${environment.API_URL}/servicios/subjefatura/aph/getCie10ByText.php?query=${busqueda}`)
  }
}
