import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// 👉 Importa la librería de FontAwesome y los íconos
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTruckFast, faBoxOpen, faCheckCircle, faBan, faSpinner, faEye } from '@fortawesome/free-solid-svg-icons';

// 👉 Agrega los íconos a la librería global
library.add(faTruckFast, faBoxOpen, faCheckCircle, faBan, faSpinner, faEye);

// 👢 Inicializa la app
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
