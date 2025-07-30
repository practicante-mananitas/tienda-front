import { Routes } from '@angular/router';
import { adminRoutes } from './admin-panel-routing';
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
import { ListaDireccionesComponent } from './components/lista-direcciones/lista-direcciones.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PagoExitoComponent } from './components/pago-exito/pago-exito.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { adminGuard } from './guards/admin.guard';
import { SeguridadComponent } from './perfil/seguridad/seguridad.component';
import { InfoComponent } from './perfil/info/info.component';
import { CategoryDetailComponent } from './components/categorydetail/categorydetail.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { EmailVerifiedComponent } from './auth/email-verified/email-verified.component';
import { EmailVerifyComponent } from './auth/email-verify/email-verify.component';
import { loginGuard } from './guards/login.guard';
import { FavoritesComponent } from './perfil/favorites/favorites.component';
import { SoporteComponent } from './perfil/soporte/soporte.component';
import { TerminosComponent } from './footer/terminos/terminos.component';
import { AvisoPrivacidadComponent } from './footer/aviso-privacidad/aviso-privacidad.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
// import { EmailAlreadyVerifiedComponent } from './auth/email-already-verified/email-already-verified.component';
// import { EmailVerificationFailedComponent } from './auth/email-verification-failed/email-verification-failed.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
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
  // { path: 'categoria/1', component: Categoria1Component},
  { path: 'registrar-direccion', component: DireccionFormComponent},
  { path: 'mis-direcciones', component: ListaDireccionesComponent},
  { path: 'direccion/:id', component: DireccionFormComponent },
  { path: 'direccion-extra/:id', component: DireccionFormComponent },
  { path: 'checkout', component: CheckoutComponent},
  { path: 'pago/exito', component: PagoExitoComponent},
  { path: 'seguridad', component: SeguridadComponent},
  { path: 'info', component: InfoComponent},
  { path: 'categoria/:id', component: CategoryDetailComponent },
  { path: 'verify-email', component: VerifyEmailComponent},
  { path: 'email/verified', component: EmailVerifiedComponent },
    { path: 'email-verify/:id/:hash', component: EmailVerifyComponent},
  { path: 'email-verified', component: EmailVerifiedComponent },
  { path: 'favoritos', component: FavoritesComponent},
  { path: 'soporte', component: SoporteComponent},
  { path: 'terminos', component: TerminosComponent},
  { path: 'aviso-privacidad', component: AvisoPrivacidadComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'reset-password/:token', component: ResetPasswordComponent},
  // { path: 'email/already-verified', component: EmailAlreadyVerifiedComponent },
  // { path: 'email/verification-failed', component: EmailVerificationFailedComponent },

  // { path: 'admin-panel', component: AdminPanelComponent, canActivate: [adminGuard]},
  // { path: 'admin-panel/producto-nuevo', component: ProductFormComponent },
   ...adminRoutes,
  { path: '**', redirectTo: 'tienda' }
];
