import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, RefresherCustomEvent, IonProgressBar, IonInput, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText } from "@ionic/angular/standalone";
import { IonIcon } from '@ionic/angular/standalone';
import { checkmarkCircleOutline, documentTextOutline, imageOutline, imagesOutline, micOutline, playOutline, stopCircleOutline } from 'ionicons/icons';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { IonTextarea } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registrar-pedido',
  templateUrl: './registrar-pedido.component.html',
  styleUrls: ['./registrar-pedido.component.scss'],
  imports: [IonText, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonButton, CommonModule, ReactiveFormsModule, IonInput, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonProgressBar, IonIcon, IonTextarea],
})
export class RegistrarPedidoComponent implements OnInit {

  public isLoad: Boolean;

  pedidoForm: FormGroup;
  imagenesPreview: string[] = [];

  isRecording = false;
  audioBlob!: Blob;
  audioURL!: string;

  constructor(private fb: FormBuilder, private toastCtrl: ToastController) {
    this.isLoad = true;
    this.pedidoForm = this.fb.group({
      bar_code: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(10)]],
      name_cli: ['', Validators.required],
      tel_cli: ['', Validators.required],
      device_name: ['', Validators.required],
      prob_texto: [''],
    });
    this.generarCodigo();
    addIcons({ documentTextOutline, imageOutline, imagesOutline, checkmarkCircleOutline, playOutline, stopCircleOutline, micOutline });
  }

  // Manejo de imágenes
  onImageChange(event: any) {
    const files: FileList = event.target.files;
    this.imagenesPreview = [];
    for (let i = 0; i < Math.min(files.length, 2); i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenesPreview.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  async generarCodigo() {
    let code = Math.floor(Date.now() / 1000);
    this.pedidoForm.get('bar_code')?.setValue(code.toString());
  }

  async toggleRecording() {
    if (this.isRecording) {
      // Detener grabación
      const result = await VoiceRecorder.stopRecording();
      this.isRecording = false;

      if (result.value && result.value.recordDataBase64) {
        // El plugin devuelve base64
        const audioBase64 = result.value.recordDataBase64;
        // Convertir a Blob para enviar al backend
        const byteCharacters = atob(audioBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        this.audioBlob = new Blob([byteArray], { type: 'audio/webm' });
        this.audioURL = URL.createObjectURL(this.audioBlob);
      }
      return;
    }

    try {
      // Solicitar permiso
      const permission = await VoiceRecorder.requestAudioRecordingPermission();
      if (!permission.value) {
        alert('Permiso de micrófono denegado');
        return;
      }

      // Iniciar grabación
      await VoiceRecorder.startRecording();
      this.isRecording = true;

    } catch (err) {
      console.error('Error al iniciar grabación', err);
      alert('No se pudo acceder al micrófono.');
    }
  }

  // Dentro de submitPedido
  submitPedido() {
    if (this.pedidoForm.invalid) {
      this.showToast('Completa todos los campos requeridos', 'danger');
      return;
    } else if (this.imagenesPreview.length <= 0) {
      this.showToast('Sube al menos una imagen del dispositivo', 'danger');
      return;
    } else if (this.pedidoForm.value.prob_texto.trim() === '' && !this.audioBlob) {
      this.showToast('Proporciona una descripción o graba un audio', 'danger');
      return;
    }

    const pedido = {
      ...this.pedidoForm.value,
      estatus: 'pendiente',
      created: new Date().toISOString(),
      img_1: this.imagenesPreview[0] || null,
      img_2: this.imagenesPreview[1] || null
    };

    console.log('Pedido registrado:', pedido);

    // Mostrar éxito
    this.showToast('Pedido registrado correctamente', 'success');

    // Reset
    this.pedidoForm.reset();
    this.generarCodigo();
    this.audioBlob = new Blob();
    this.audioURL = '';
    this.isRecording = false;
    this.imagenesPreview = [];
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoad = false;
    }, 1500);
  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.pedidoForm.reset();
      this.generarCodigo();
      this.audioBlob = new Blob();
      this.audioURL = '';
      this.isRecording = false;
      this.imagenesPreview = [];
      event.target.complete();
    }, 100);
  }

}
