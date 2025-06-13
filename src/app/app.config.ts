import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
// Importaciones de HttpClient: necesitas provideHttpClient y withInterceptorsFromDi
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Importaciones de Font Awesome (asegúrate de que todos los iconos que uses estén aquí)
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
// Importa todos los iconos que usarás en tu aplicación (ej: en admin-productos, admin-pedidos, etc.)
import { faChevronLeft, faChevronRight, faEdit, faTrash, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'; 

// Importa tu AuthInterceptor
import { AuthInterceptor } from './auth.interceptor'; // Asegúrate de que la ruta sea correcta

import { routes } from './app.routes';

// Añade los iconos a la librería global de Font Awesome para que estén disponibles
library.add(faChevronLeft, faChevronRight, faEdit, faTrash, faArrowLeft, faArrowRight);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    
    // --- Configuración de HttpClient con Interceptores ---
    // Provee el HttpClient y habilita el soporte para interceptores usando el patrón antiguo (con HTTP_INTERCEPTORS)
    provideHttpClient(withInterceptorsFromDi()), 
    // `importProvidersFrom(HttpClientModule)` a veces es redundante con provideHttpClient, pero lo dejamos si lo usas en otro lado.
    importProvidersFrom(HttpClientModule), 

    // --- PROVEER EL INTERCEPTOR ---
    // Esto registra tu AuthInterceptor para que intercepte todas las peticiones HTTP
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
    importProvidersFrom(FormsModule),
    importProvidersFrom(FontAwesomeModule) // FontAwesome habilitado globalmente
  ]
};
