import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PersonalModel } from '../models/personal.model';


@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<PersonalModel[]>(`${environment.API_URL}/servicios/tthh/getPersonalOperativo.php`)
  }

  getById(id: number) {
    return this.http.get<PersonalModel>(`${environment.API_URL}/servicios/tthh/getPersonal.php?id=${id}`)
  }

  save(vehiculo: PersonalModel) {
    return this.http.post<any>(`${environment.API_URL}/servicios/tthh/setPersonal.php`, vehiculo)
  }

  update(vehiculo: PersonalModel) {
    return this.http.put<any>(`${environment.API_URL}/servicios/tthh/setPersonal.php`, vehiculo)
  }
}
