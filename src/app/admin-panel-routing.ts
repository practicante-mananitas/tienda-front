// admin-panel-routing.ts
import { Routes } from '@angular/router';

import { ProductFormComponent } from './components/product-form/product-form.component';
import { AdminResumenComponent } from './components/admin-resumen/admin-resumen.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { AdminPedidosComponent } from './components/admin-pedidos/admin-pedidos.component';
import { AdminFinanzasComponent } from './components/admin-finanzas/admin-finanzas.component';
import { AdminDestacadosComponent } from './components/admin-destacados/admin-destacados.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { AdminPedidosExcedidosComponent } from './components/admin-pedidos-excedidos/admin-pedidos-excedidos.component';
import { AdminPedidosEntregadosComponent } from './components/admin-pedidos-entregados/admin-pedidos-entregados.component';
import { AdminPedidosCanceladosComponent } from './components/admin-pedidos-cancelados/admin-pedidos-cancelados.component';
import { AdminPedidosEnviadosComponent } from './components/admin-pedidos-enviados/admin-pedidos-enviados.component';
import { adminGuard } from './guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: 'resumen', component: AdminResumenComponent },
      { path: 'productos', component: AdminProductosComponent },
      { path: 'producto-nuevo', component: ProductFormComponent },
      { path: 'pedidos', component: AdminPedidosComponent },
      { path: 'finanzas', component: AdminFinanzasComponent },
      { path: 'destacados', component: AdminDestacadosComponent },
      { path: 'productos/editar/:id', component: ProductEditComponent },
      {  path: 'pedidos-excedidos', component: AdminPedidosExcedidosComponent },
      { path: 'admin-pedido/:id', component: AdminPedidosComponent },
      { path: 'pedidos-entregados', component: AdminPedidosEntregadosComponent},
      { path: 'pedidos-cancelados', component: AdminPedidosCanceladosComponent},
      { path: 'pedidos-enviados', component: AdminPedidosEnviadosComponent}
      // { path: 'admin-products/:id', component: AdminProductosComponent }

    ]
  }
];
