import { MessageService } from './../../../services/message.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonRefresher,
  IonRefresherContent, RefresherCustomEvent, IonList, IonThumbnail, IonSearchbar,
  IonButton, IonActionSheet, IonButtons,
  ActionSheetController, IonAlert
} from "@ionic/angular/standalone";
import { IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, checkbox, checkboxOutline, print, constructOutline, ellipsisVertical, hourglassOutline, logoWhatsapp, trash, layers } from 'ionicons/icons';
import { Pedido } from '../../../../interfaces/pedido.model';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.scss'],
  imports: [IonAlert, IonButtons, IonActionSheet, IonButton, IonSearchbar, CommonModule, IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonRefresher, IonRefresherContent, IonIcon, IonList, IonItem, IonLabel, IonThumbnail],
})
export class ListaPedidosComponent implements OnInit {

  public isLoad: Boolean;

  pedidos: Pedido[] = [];

  getFileSrc(path: string): string {
    return Capacitor.convertFileSrc(path);
  }

  public filtrar = [
    {
      text: 'Todos',
      icon: 'layers',
      handler: () => {
        console.log('Todos');
      }
    },
    {
      text: 'Pendientes',
      icon: 'hourglass-outline',
      handler: () => {
        console.log('Pendientes');
      }
    },
    {
      text: 'En proceso',
      icon: 'construct-outline',
      handler: () => {
        console.log('En proceso');
      }
    },
    {
      text: 'Listos para entregar',
      icon: 'checkbox-outline',
      handler: () => {
        console.log('Listos para entregar');
      }
    },
    {
      text: 'Entregados',
      icon: 'checkbox',
      handler: () => {
        console.log('Entregado');
      }

    },
    {
      text: 'Cancelar',
      role: 'cancel'
    },
  ];

  pedidosFiltrados: Pedido[]; // copia inicial

  constructor(private actionSheetCtrl: ActionSheetController, public msgServ: MessageService) {
    this.pedidosFiltrados = [...this.pedidos];
    this.isLoad = true;
    addIcons({ camera, print, ellipsisVertical, layers, logoWhatsapp, trash, checkbox, checkboxOutline, constructOutline, hourglassOutline });
  }

  async openAcciones(pedido: Pedido) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Acciones',
      buttons: [
        {
          text: 'Reimprimir código de barras',
          icon: 'print',
          handler: () => {
            this.msgServ.showScreenAlert('¡Reimprimiendo!', 'Reimprimiendo ticket del pedido ' + pedido.bar_code);
          }
        },
        {
          text: 'WhatsApp',
          icon: 'logo-whatsapp',
          handler: () => {
            /*const phone = pedido.tel_cli;
            const url = `https://wa.me/52${phone}?text=Hola%20${pedido.name_cli},%20sobre%20tu%20pedido%20${pedido.bar_code}`;
            window.open(url, '_blank');*/
            this.msgServ.showScreenAlert('¡Whatsapp!', 'Enviar mensaje a ' + pedido.tel_cli, ['Aceptar']);
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.eliminarPedido(pedido);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  eliminarPedido(pedido: any) {
    this.cargarPedidos(); // recargar lista
    this.msgServ.showScreenAlert('¡Eliminado!', 'Pedido eliminado correctamente');
  }

  ngOnInit() {
    this.cargarPedidos();
  }

  // 🔹 Cargar todos los pedidos
  async cargarPedidos() {
    this.pedidosFiltrados = [...this.pedidos];
  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 100);
  }

  filtrarPedidos(event: any) {
    const val = event.target.value.toLowerCase();
    if (!val) {
      this.pedidosFiltrados = [...this.pedidos];
      return;
    }

    this.pedidosFiltrados = this.pedidos.filter(p =>
      p.bar_code.toLowerCase().includes(val) ||
      p.name_cli.toLowerCase().includes(val) ||
      p.tel_cli.toLowerCase().includes(val)
    );
  }

}
