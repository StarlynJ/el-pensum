import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asesoria } from '../models/asesoria.model';

// Servicio para manejar las asesorías (enviar datos al backend)
@Injectable({
  providedIn: 'root'
})
export class AsesoriaService {
  // URL base de la API de asesoría
  private apiUrl = 'http://localhost:5265/api/Asesoria';

  constructor(private http: HttpClient) {}

  // Envía la asesoría al backend
  enviarAsesoria(asesoriaData: Asesoria): Observable<any> {
    return this.http.post(this.apiUrl, asesoriaData);
  }
}