import { Component, OnInit } from '@angular/core';
import {
  IonIcon,
  IonTabBar, IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { apps, addCircle, settings } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navegador',
  templateUrl: './navegador.component.html',
  imports: [CommonModule, ReactiveFormsModule, IonIcon, IonTabBar, IonTabButton, IonTabs, RouterOutlet, RouterModule],
  styleUrls: ['./navegador.component.scss'],
})
export class NavegadorComponent implements OnInit {

  constructor() {
    addIcons({ apps, addCircle, settings });
  }

  ngOnInit() { }

}
