import { Routes } from '@angular/router';
import { ListaPedidosComponent } from './components/pages/lista-pedidos/lista-pedidos.component';
import { NavegadorComponent } from './components/navegador/navegador.component';
import { RegistrarPedidoComponent } from './components/pages/registrar-pedido/registrar-pedido.component';
import { ConfigImpresoraComponent } from './components/pages/config-impresora/config-impresora.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tabs/list-pedidos', pathMatch: 'full' },
  {
    path: 'tabs',
    component: NavegadorComponent,
    children: [
      { path: 'list-pedidos', component: ListaPedidosComponent },
      { path: 'nuevo-pedido', component: RegistrarPedidoComponent },
      { path: 'config-impresora', component: ConfigImpresoraComponent },
      { path: '', redirectTo: 'list-pedidos', pathMatch: 'full' } // Default tab
    ]
  },
];
