import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  AlertComponent, BadgeComponent, ButtonDirective, ButtonGroupComponent, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective,
  FormDirective, FormLabelDirective, FormSelectDirective, RowComponent
} from '@coreui/angular';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import {
  BLOQUES_RECURSOS, CatalogosParte, mapaDeTipo, TipoMapa, causasDe, clasificacionesAuxilio, clasificacionesCausa, fechaHoraAviso, kmRecorridos, minutosRespuesta,
  ParteCausaDetalle, ParteFallecidoDetalle, ParteModel, PartePersonaAsistidaDetalle, PartePersonalDetalle, ParteRecursoDetalle,
  ParteTipoAuxilioDetalle, ParteVehiculoDetalle, ParteVictimaDetalle, PersonalCatalogo, PROPIEDADES, RecursoCatalogo, ROL_MANDO, ROLES_PERSONAL,
  SEXOS, subclasificacionesAuxilio, TIPOS_DIA, TIPOS_EDAD, TIPOS_IDENTIFICACION, TIPOS_PARTE, TRASLADOS_VICTIMA, usosAuxilio, validarParte,
  VehiculoCatalogo
} from '../models/partes.model';
import { formatoMinutos } from '../models/partes-estadisticas.model';
import { ParteService } from '../services/parte.service';
import { IntervencionesService } from '../../subjefatura/services/intervenciones.service';
import { AuthService } from '../../auth/auth.service';
import { PdfService } from '../../core/pdf.service';

/**
 * Parte de servicio (auxilio o incendio) con el formato del área operativa. El número lo asigna el API.
 * Registrar/editar: OPE_PARTE_REGISTRAR. Anular y corregir finalizados: OPE_PARTE_ANULAR.
 */
@Component({
  selector: 'app-parte-mantenimiento',
  imports: [CommonModule, FormsModule, RouterLink, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective,
    FormDirective, FormLabelDirective, FormControlDirective, FormSelectDirective, AlertComponent, BadgeComponent, ButtonGroupComponent, NgSelectComponent,
    NgLabelTemplateDirective, NgOptionTemplateDirective],
  templateUrl: './parte-mantenimiento.component.html',
  styleUrl: './parte-mantenimiento.component.scss'
})
export class ParteMantenimientoComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly parteService = inject(ParteService);
  private readonly ubicacionService = inject(IntervencionesService);
  private readonly auth = inject(AuthService);
  private readonly pdf = inject(PdfService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  parte = new ParteModel();
  cat: CatalogosParte | null = null;
  provincias: any[] = [];
  cantones: any[] = [];
  parroquias: any[] = [];
  /** Descripciones del catálogo de recursos por tipo (arreglos fijos para ng-select) */
  recursos: Record<RecursoCatalogo['recurso_tipo'], string[]> = { EQUIPO: [], MATERIAL: [], INSUMO: [] };
  errorMessage = '';
  errores: string[] = [];
  customStylesValidated = false;
  isLoading = false;
  isSaving = false;
  private map?: L.Map;
  private marker?: L.Marker;
  private capaMapa?: L.TileLayer;
  /** Vista previa de la imagen impresa (URL local del PNG descargado con la sesión) */
  imagenMapa: string | null = null;
  regenerando = false;

  readonly bloques = BLOQUES_RECURSOS;
  readonly tiposParte = TIPOS_PARTE;
  readonly tiposDia = TIPOS_DIA;
  readonly rolesPersonal = ROLES_PERSONAL;
  readonly tiposIdentificacion = TIPOS_IDENTIFICACION;
  readonly traslados = TRASLADOS_VICTIMA;
  readonly tiposEdad = TIPOS_EDAD;
  readonly sexos = SEXOS;
  readonly propiedades = PROPIEDADES;
  readonly rolMando = ROL_MANDO;
  readonly kmRecorridos = kmRecorridos;
  readonly formatoMinutos = formatoMinutos;
  readonly subclasificaciones = (c: string) => subclasificacionesAuxilio(this.cat?.tipos_auxilio ?? [], c);
  readonly usos = (c: string, s: string) => usosAuxilio(this.cat?.tipos_auxilio ?? [], c, s);
  readonly causas = (c: string) => causasDe(this.cat?.causas ?? [], c);
  get clasificaciones(): string[] { return clasificacionesAuxilio(this.cat?.tipos_auxilio ?? []); }
  get clasificacionesCausa(): string[] { return clasificacionesCausa(this.cat?.causas ?? []); }
  get respuesta(): number | null { return minutosRespuesta(this.parte); }
  get esNuevo(): boolean { return !this.parte.parte_id; }
  get puedeAnular(): boolean { return this.auth.tienePermiso('OPE_PARTE_ANULAR'); }
  /** Solo lectura: anulado, sin privilegio de registro, o finalizado sin privilegio de supervisión */
  get soloLectura(): boolean {
    return this.parte.parte_estado === 'ANULADO' || !this.auth.tienePermiso('OPE_PARTE_REGISTRAR')
      || (!this.esNuevo && this.parte.parte_estado === 'FINALIZADO' && !this.puedeAnular);
  }

  ngOnInit(): void {
    this.parteService.getCatalogos().subscribe({
      next: (c) => {
        this.cat = c;
        this.aplicarCapaMapa();
        for (const t of ['EQUIPO', 'MATERIAL', 'INSUMO'] as const) {
          this.recursos[t] = c.recursos.filter(r => r.recurso_tipo === t).map(r => r.recurso_descripcion);
        }
        if (this.esNuevo && !this.route.snapshot.paramMap.get('id')?.match(/^\d+$/)) {
          this.aplicarUbicacionPorDefecto();
        }
      },
      error: (e) => this.errorMessage = `No se pudieron cargar las listas del formulario. ${e.error?.msg ?? e.message}`,
    });
    this.ubicacionService.getProvincias().subscribe({ next: (d) => this.provincias = d ?? [], error: () => this.provincias = [] });

    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId && routeId !== 'nuevo') {
      const id = Number(routeId);
      if (!Number.isInteger(id) || id <= 0) {
        this.errorMessage = 'El identificador del parte no es válido.';
        return;
      }
      this.isLoading = true;
      this.parteService.getById(id).subscribe({
        next: (data) => {
          this.parte = Object.assign(new ParteModel(), data);
          this.normalizar();
          this.cargarCantones(this.parte.parte_provincia, false);
          this.cargarParroquias(this.parte.parte_canton, false);
          this.updateMarkerFromCoordinates();
          this.aplicarCapaMapa();
          this.cargarImagenMapa();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = `No se pudo cargar el parte. ${error.error?.msg ?? error.error?.error ?? error.message}`;
          this.isLoading = false;
        }
      });
    } else {
      this.agregarPersonal(ROL_MANDO);
      this.agregarVehiculo();
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    if (this.imagenMapa) URL.revokeObjectURL(this.imagenMapa);
  }

  private normalizar(): void {
    const p = this.parte as any;
    for (const k of ['personal', 'vehiculos', 'tipos_auxilio', 'causas', 'equipos_herramientas', 'materiales_descartables', 'insumos',
      'personas_asistidas', 'victimas', 'fallecidos', 'tipos_incendio', 'naturalezas']) {
      p[k] = p[k] ?? [];
    }
    for (const k of ['parte_provincia', 'parte_canton', 'parte_parroquia', 'fk_estacion_id', 'fk_personal_despacho_id']) {
      p[k] = p[k] === null || p[k] === undefined || p[k] === '' ? null : Number(p[k]);
    }
    this.parte.vehiculos.forEach(v => {
      v.fk_vehiculo_id = v.fk_vehiculo_id ? Number(v.fk_vehiculo_id) : null;
      v.fk_estacion_id = v.fk_estacion_id ? Number(v.fk_estacion_id) : null;
      v.parte_vehiculo_km_salida = v.parte_vehiculo_km_salida === null ? null : Number(v.parte_vehiculo_km_salida);
      v.parte_vehiculo_km_retorno = v.parte_vehiculo_km_retorno === null ? null : Number(v.parte_vehiculo_km_retorno);
    });
    this.parte.personal.forEach(x => x.fk_personal_id = x.fk_personal_id ? Number(x.fk_personal_id) : null);
    for (const b of this.bloques) {
      this.parte[b.clave].forEach(r => {
        r.fk_estacion_id = r.fk_estacion_id ? Number(r.fk_estacion_id) : null;
        r.parte_recurso_cantidad = r.parte_recurso_cantidad === null ? null : Number(r.parte_recurso_cantidad);
      });
    }
  }

  // ---- Ubicación ----
  private aplicarUbicacionPorDefecto(): void {
    const u = this.cat?.ubicacion;
    if (!u || this.parte.parte_provincia) return;
    this.parte.parte_provincia = Number(u.provincia);
    this.parte.parte_canton = Number(u.canton);
    this.parte.parte_parroquia = Number(u.parroquia);
    this.cargarCantones(this.parte.parte_provincia, false);
    this.cargarParroquias(this.parte.parte_canton, false);
  }

  cargarCantones(provincia: number | null, limpiar = true): void {
    if (limpiar) { this.parte.parte_canton = null; this.parte.parte_parroquia = null; this.parroquias = []; }
    this.cantones = [];
    if (provincia) this.ubicacionService.getCantones(provincia).subscribe({ next: (d) => this.cantones = d ?? [] });
  }

  cargarParroquias(canton: number | null, limpiar = true): void {
    if (limpiar) this.parte.parte_parroquia = null;
    this.parroquias = [];
    if (canton) this.ubicacionService.getParroquias(canton).subscribe({ next: (d) => this.parroquias = d ?? [] });
  }

  // ---- Detalles ----
  agregarPersonal(rol = 'PERSONAL OPERATIVO'): void {
    const d = new PartePersonalDetalle();
    d.parte_personal_rol = rol;
    this.parte.personal.push(d);
  }

  agregarVehiculo(): void {
    const v = new ParteVehiculoDetalle();
    v.fk_estacion_id = this.parte.fk_estacion_id;
    v.parte_vehiculo_hora_despacho = fechaHoraAviso(this.parte);
    this.parte.vehiculos.push(v);
  }

  agregarTipoAuxilio(): void { this.parte.tipos_auxilio.push(new ParteTipoAuxilioDetalle()); }
  agregarCausa(): void { this.parte.causas.push(new ParteCausaDetalle()); }
  agregarPersonaAsistida(): void { this.parte.personas_asistidas.push(new PartePersonaAsistidaDetalle()); }
  agregarVictima(): void { this.parte.victimas.push(new ParteVictimaDetalle()); }
  agregarFallecido(): void { this.parte.fallecidos.push(new ParteFallecidoDetalle()); }

  agregarRecurso(lista: ParteRecursoDetalle[]): void {
    const r = new ParteRecursoDetalle();
    r.fk_estacion_id = this.parte.fk_estacion_id;
    lista.push(r);
  }

  quitarDetalle<T>(detalles: T[], index: number): void {
    detalles.splice(index, 1);
  }

  /** Al elegir el vehículo se completan placa, siglas y estación desde su registro */
  vehiculoElegido(v: ParteVehiculoDetalle, elegido: VehiculoCatalogo | null): void {
    v.parte_vehiculo_placa = elegido?.vehiculo_placa ?? '';
    v.parte_vehiculo_siglas = elegido?.vehiculo_sigla ?? '';
    if (elegido?.fk_estacion_id) v.fk_estacion_id = Number(elegido.fk_estacion_id);
  }

  buscarVehiculo = (termino: string, v: VehiculoCatalogo) =>
    `${v.vehiculo_sigla ?? ''} ${v.vehiculo_placa} ${v.vehiculo_tipo ?? ''}`.toLowerCase().includes(termino.toLowerCase());
  etiquetaVehiculo = (v: VehiculoCatalogo) => [v.vehiculo_sigla, v.vehiculo_placa].filter(Boolean).join(' · ');
  buscarPersonal = (termino: string, p: PersonalCatalogo) =>
    `${p.nombre} ${p.persona_doc_identidad ?? ''} ${p.puesto_nombre ?? ''}`.toLowerCase().includes(termino.toLowerCase());

  /** Nuevo recurso escrito por el usuario: el API lo agrega al catálogo al guardar */
  agregarRecursoNuevo = (texto: string) => texto.trim().toUpperCase();

  auxilioCambio(t: ParteTipoAuxilioDetalle, nivel: 'clasificacion' | 'subclasificacion'): void {
    t.fk_tipo_auxilio_id = null;
    if (nivel === 'clasificacion') t.parte_auxilio_subclasificacion = '';
    t.parte_auxilio_uso_tipo = '';
  }

  causaCambio(c: ParteCausaDetalle): void {
    c.fk_causa_id = null;
    c.parte_causa_descripcion = '';
  }

  // ---- Mapa ----
  onCoordinatesChanged(): void {
    this.updateMarkerFromCoordinates();
  }

  private initMap(): void {
    if (!document.getElementById('parte-map')) return;
    const inicial = this.getCoordinates();
    this.map = L.map('parte-map').setView(inicial ?? [-0.254, -79.172], inicial ? 16 : 13);
    this.aplicarCapaMapa();
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      if (this.soloLectura) return;
      this.setCoordinates(event.latlng.lat, event.latlng.lng);
    });
    if (inicial) this.setMarker(inicial.lat, inicial.lng);
  }

  private updateMarkerFromCoordinates(): void {
    const c = this.getCoordinates();
    if (!this.map) return;
    if (!c) {
      this.marker?.remove();
      this.marker = undefined;
      return;
    }
    this.map.setView([c.lat, c.lng], 16);
    this.setMarker(c.lat, c.lng);
  }

  private getCoordinates(): { lat: number; lng: number } | null {
    const lat = Number(String(this.parte.parte_latitud ?? '').replace(',', '.').trim() || NaN);
    const lng = Number(String(this.parte.parte_longitud ?? '').replace(',', '.').trim() || NaN);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    return { lat, lng };
  }

  private setCoordinates(lat: number, lng: number): void {
    this.parte.parte_latitud = lat.toFixed(6);
    this.parte.parte_longitud = lng.toFixed(6);
    this.setMarker(lat, lng);
  }

  private setMarker(lat: number, lng: number): void {
    if (!this.map) return;
    if (!this.marker) {
      this.marker = L.marker([lat, lng], {
        draggable: !this.soloLectura,
        icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        })
      }).addTo(this.map);
      this.marker.on('dragend', () => {
        const pos = this.marker?.getLatLng();
        if (pos) this.setCoordinates(pos.lat, pos.lng);
      });
    } else {
      this.marker.setLatLng([lat, lng]);
    }
    this.marker.bindPopup(`Latitud: ${lat.toFixed(6)}<br>Longitud: ${lng.toFixed(6)}`);
  }

  /** Mapa de calles o satelital: cambia lo que se ve y la imagen que se imprimirá (se genera al guardar) */
  elegirMapa(tipo: TipoMapa): void {
    if (this.soloLectura) return;
    this.parte.parte_mapa_tipo = tipo;
    this.aplicarCapaMapa();
  }

  private aplicarCapaMapa(): void {
    if (!this.map) return;
    const cfg = mapaDeTipo(this.cat?.mapas, this.parte.parte_mapa_tipo);
    this.capaMapa?.remove();
    this.capaMapa = L.tileLayer(cfg.url, { attribution: cfg.atribucion, maxZoom: 19 }).addTo(this.map);
  }

  private cargarImagenMapa(): void {
    if (!this.parte.parte_id || !this.parte.parte_mapa_archivo) return;
    this.parteService.getMapa(this.parte.parte_id).subscribe({
      next: (blob) => {
        if (this.imagenMapa) URL.revokeObjectURL(this.imagenMapa);
        this.imagenMapa = URL.createObjectURL(blob);
      },
      error: () => this.imagenMapa = null,
    });
  }

  /** Vuelve a generar la imagen impresa (si el servidor de mapas no respondió al guardar) */
  regenerarMapa(): void {
    if (!this.parte.parte_id) return;
    this.regenerando = true;
    this.parteService.regenerarMapa(this.parte.parte_id).subscribe({
      next: (r) => {
        this.regenerando = false;
        this.parte.parte_mapa_archivo = 'generado';
        this.cargarImagenMapa();
        Swal.fire('Listo', r.msg, 'success');
      },
      error: (e) => {
        this.regenerando = false;
        Swal.fire('Mapa', e.error?.msg ?? e.error?.error ?? e.message, 'warning');
      },
    });
  }

  // ---- Guardar / anular ----
  onSubmit(form: NgForm): void {
    this.customStylesValidated = true;
    this.errorMessage = '';
    if (this.soloLectura || this.isLoading || this.isSaving) return;
    this.errores = validarParte(this.parte);
    if (form.invalid || this.errores.length) {
      Swal.fire('Revise el parte', [...(form.invalid ? ['Complete los campos obligatorios.'] : []), ...this.errores].join('<br>'), 'warning');
      return;
    }
    this.isSaving = true;
    const request = this.esNuevo ? this.parteService.save(this.parte) : this.parteService.update(this.parte);
    request.subscribe({
      next: (r) => {
        this.isSaving = false;
        Swal.fire({ title: 'Listo', text: r.msg, icon: 'success', showCancelButton: true, confirmButtonText: 'Imprimir el parte', cancelButtonText: 'Cerrar' })
          .then(res => {
            if (res.isConfirmed) this.pdf.abrir(this.parteService.urlPdf(r.id));
            this.router.navigate(['../'], { relativeTo: this.route });
          });
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = `No se pudo guardar el parte. ${error.error?.msg ?? error.error?.error ?? error.message}`;
        Swal.fire('Error', this.errorMessage, 'error');
      }
    });
  }

  imprimir(): void {
    if (this.parte.parte_id) this.pdf.abrir(this.parteService.urlPdf(this.parte.parte_id));
  }

  anular(): void {
    if (!this.parte.parte_id) return;
    Swal.fire({
      title: `Anular el parte ${this.parte.parte_numero}`, input: 'textarea', inputLabel: 'Motivo de la anulación', showCancelButton: true,
      confirmButtonText: 'Anular', cancelButtonText: 'Cancelar', confirmButtonColor: '#d33',
      inputValidator: (v) => v?.trim() ? null : 'Indique el motivo',
    }).then(res => {
      if (!res.isConfirmed) return;
      this.parteService.anular(this.parte.parte_id!, res.value.trim()).subscribe({
        next: (r) => Swal.fire('Listo', r.msg, 'success').then(() => this.router.navigate(['../'], { relativeTo: this.route })),
        error: (e) => Swal.fire('Error', e.error?.msg ?? e.error?.error ?? e.message, 'error'),
      });
    });
  }
}
