import { Injectable, EventEmitter  } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo de la push',
    //   body: 'Este es el body de la push',
    //   date: new Date()
    // }
  ];

  userId: string;

  pushListener = new EventEmitter<OSNotificationPayload>();



  constructor( private oneSignal: OneSignal,
               private storage: Storage ) {

    this.cargarMensajes();
  }

  async getMensajes() {
    await this.cargarMensajes();
    return [...this.mensajes];
  }



  async configuracionInicial() {
    this.oneSignal.startInit('9cbd1bc1-cd61-4442-a104-643786296764', '835437865062');
  
    this.oneSignal.inFocusDisplaying( this.oneSignal.OSInFocusDisplayOption.Notification );
  
    this.oneSignal.handleNotificationReceived().subscribe(( noti ) => {
  
      console.log('notificacion recivida', noti);
      this.notificacionRecibida( noti )
      // do something when notification is received
    });
  
    this.oneSignal.handleNotificationOpened().subscribe(async ( noti ) => {
      console.log('notificacion abierta', noti);
      await this.notificacionRecibida( noti.notification );
      // do something when a notification is opened
    });
  
    this.oneSignal.getIds().then( info => {
      this.userId = info.userId || 'bb4c4088-3427-44ff-8380-570aa6c1ce1a';
      console.log(this.userId);
    });

    this.oneSignal.endInit();
  }

  async getUserIdOneSignal() {
    console.log('Cargando userId');
    const info = await this.oneSignal.getIds();
    this.userId = info.userId;
    return info.userId;
  }



  async notificacionRecibida( noti: OSNotification ) {

    await this.cargarMensajes();

    const payload = noti.payload;

    const existePush = this.mensajes.find( mensaje => mensaje.notificationID 
      === payload.notificationID );

    if ( existePush ) {
      return;
    }

    this.mensajes.unshift( payload );

    this.pushListener.emit( payload );

    this.guardarMensajes();

  }



  guardarMensajes() {
    this.storage.set  ('mensajes', this.mensajes );
  }



  async cargarMensajes() {

    this.mensajes =  await this.storage.get('mensajes') || [];

    return this.mensajes;

  }

  async borrarMensajes() {
    await this.storage.clear();
    this.mensajes = [];
    this.guardarMensajes();
  }




}


  

