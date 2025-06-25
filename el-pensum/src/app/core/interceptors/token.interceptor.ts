import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    let headers = req.headers;

    if (!headers.has('Content-Type') && req.body) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const authReq = req.clone({ headers });

    return next.handle(authReq);
  }
}

