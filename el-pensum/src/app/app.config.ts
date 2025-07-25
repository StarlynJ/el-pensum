import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { provideRouter } from '@angular/router';

import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { provideClientHydration } from '@angular/platform-browser';



import { routes } from './app.routes';

import { TokenInterceptor } from './core/interceptors/token.interceptor';

import { provideQuillConfig } from 'ngx-quill';



export const appConfig: ApplicationConfig = {

providers: [

provideZoneChangeDetection({ eventCoalescing: true }),

provideRouter(routes),

provideHttpClient(),

{

 provide: HTTP_INTERCEPTORS,

useClass: TokenInterceptor,

multi: true

},

provideClientHydration(),

provideQuillConfig({})

]

};