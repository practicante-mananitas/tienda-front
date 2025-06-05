// admin-panel-routing.ts
import { Routes } from '@angular/router';

import { ProductFormComponent } from './components/product-form/product-form.component';
import { AdminResumenComponent } from './components/admin-resumen/admin-resumen.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { AdminPedidosComponent } from './components/admin-pedidos/admin-pedidos.component';
import { AdminFinanzasComponent } from './components/admin-finanzas/admin-finanzas.component';
import { AdminDestacadosComponent } from './components/admin-destacados/admin-destacados.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

export const adminRoutes: Routes = [
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: 'resumen', component: AdminResumenComponent },
      { path: 'productos', component: AdminProductosComponent },
      { path: 'producto-nuevo', component: ProductFormComponent },
      { path: 'pedidos', component: AdminPedidosComponent },
      { path: 'finanzas', component: AdminFinanzasComponent },
      { path: 'destacados', component: AdminDestacadosComponent },
    ]
  }
];
