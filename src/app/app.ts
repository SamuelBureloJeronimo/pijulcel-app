import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { SqliteService } from './services/sqlite.service';
import { IonApp, IonRouterOutlet } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html',
  styleUrls: ['app.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonRouterOutlet, IonApp],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class App {

  public isWeb: boolean;
  public load: boolean;

  constructor(
    private platform: Platform,
    private sqlite: SqliteService) {
    this.isWeb = false;
    this.load = false;
    this.initApp();
  }

  initApp() {

    // Iniciamos la base de datos
    this.sqlite.initialisePlugin();

  }
}
