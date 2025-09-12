import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonRefresher, IonRefresherContent, RefresherCustomEvent, IonList, IonThumbnail, IonSearchbar, IonFab, IonFabButton } from "@ionic/angular/standalone";
import { IonIcon, IonItem, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';

interface Pedido {
  bar_code: string;
  name_cli: string;
  tel_cli: string;
  estatus: string;
  created: string;
  img_1: string;
}

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.scss'],
  imports: [IonFabButton, IonFab, IonSearchbar, CommonModule, IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonRefresher, IonRefresherContent, IonIcon, IonList, IonItem, IonLabel, IonBadge, IonThumbnail],
})
export class ListaPedidosComponent implements OnInit {

  public isLoad: Boolean;

  pedidos:Pedido[] = [];


  pedidosFiltrados:Pedido[]; // copia inicial

  constructor() {
    this.pedidos.push({ bar_code: '1000000001', name_cli: 'Juan Pérez', tel_cli: '5551234567', estatus: 'pendiente', created: '2025-09-12T14:30:00', img_1: 'pedido1.webp' });
    this.pedidosFiltrados = [...this.pedidos];
    this.isLoad = true;
    addIcons({ camera });
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoad = false;
    }, 1500);
  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  filtrarPedidos(event: any) {
    const texto = event.target.value.toLowerCase();

    if (!texto || texto.trim() === '') {
      this.pedidosFiltrados = [...this.pedidos];
      return;
    }

    this.pedidosFiltrados = this.pedidos.filter(p =>
      p.bar_code.toLowerCase().includes(texto) ||
      p.tel_cli.toLowerCase().includes(texto) ||
      p.name_cli.toLowerCase().includes(texto)
    );
  }

}
