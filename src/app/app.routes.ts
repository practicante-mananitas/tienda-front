import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ProductGalleryComponent } from './components/product-gallery/product-gallery.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { PedidoConfirmadoComponent } from './components/pedido-confirmado/pedido-confirmado.component';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { Categoria1Component } from './components/categoria-1/categoria-1.component';
import { DireccionFormComponent } from './components/direccion-form/direccion-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'productos', component: ProductListComponent, canActivate: [authGuard]},
  { path: 'productos/nuevo', component: ProductFormComponent, canActivate: [authGuard]},
  { path: 'productos/editar/:id', component: ProductEditComponent, canActivate: [authGuard] },
  { path: 'tienda', component: ProductGalleryComponent},
  { path: 'tienda/:id', component: ProductDetailComponent},
  { path: 'carrito', component: CartComponent},
  { path: 'pedido-confirmado', component: PedidoConfirmadoComponent},
  { path: 'mis-pedidos', component: MisPedidosComponent, canActivate: [authGuard] },
  { path: 'buscar', component: SearchResultsComponent},
  // { path: 'categoria/:id', component: ProductGalleryComponent},
  { path: 'categoria/1', component: Categoria1Component},
  { path: 'registrar-direccion', component: DireccionFormComponent},
  { path: '**', redirectTo: 'tienda' }
];
