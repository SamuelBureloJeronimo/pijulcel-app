import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonRefresher, IonRefresherContent, RefresherCustomEvent } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { settings } from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-config-impresora',
  templateUrl: './config-impresora.component.html',
  styleUrls: ['./config-impresora.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonRefresher, IonRefresherContent, IonIcon],
})
export class ConfigImpresoraComponent implements OnInit {

  public isLoad: Boolean;


  constructor() {
    this.isLoad = true;
    addIcons({ settings });
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

}
