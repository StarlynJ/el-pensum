import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// ✅ RUTA CORREGIDA
import { Asesoria } from '../models/asesoria.model';

@Injectable({
  providedIn: 'root'
})
export class AsesoriaService {
  private apiUrl = 'http://localhost:5265/api/Asesoria';

  constructor(private http: HttpClient) {}

  enviarAsesoria(asesoriaData: Asesoria): Observable<any> {
    return this.http.post(this.apiUrl, asesoriaData);
  }
}