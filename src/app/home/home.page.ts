import { ApplicationRef, Component, OnInit } from '@angular/core';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mensajes: OSNotificationPayload[] = [];

  userId = '';

  constructor( public pushService: PushService,
               private applicationRef: ApplicationRef  ) {}

  ngOnInit() {
    this.pushService.pushListener.subscribe( noti => {
      this.mensajes.unshift( noti );
      this.applicationRef.tick();
    });
  }

  async ionViewWillEnter() {

    console.log( 'Will enter - cargar mensajes' )

    this.userId = await this.pushService.getUserIdOneSignal();
    
    this.mensajes = await this.pushService.getMensajes();

  }


  



}
