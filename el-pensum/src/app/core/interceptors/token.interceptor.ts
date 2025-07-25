import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interceptor para agregar el token a cada request si existe
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  // Este método se ejecuta en cada petición HTTP
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Buscamos el token en localStorage
    const token = localStorage.getItem('token');

    // Copiamos los headers originales
    let headers = req.headers;

    // Si no hay Content-Type y hay body, lo ponemos a JSON
    if (!headers.has('Content-Type') && req.body) {
      headers = headers.set('Content-Type', 'application/json');
    }

    // Si hay token, lo agregamos al header Authorization
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Clonamos la request con los nuevos headers
    const authReq = req.clone({ headers });

    // Dejamos pasar la request modificada
    return next.handle(authReq);
  }
}

