import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GeocodingService } from 'src/shared/geoCoding/geocoding.service';
import { Usuario, PuntoMapa } from 'src/shared/client.model';
import { ClientService } from 'src/shared/client.service';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  private token: string;
  public usuario: Usuario;
  public puntoMapa: PuntoMapa;


  latitud: number;
  longitud: number;

  loading: boolean;

  createForm;

  LugName;
  Foto;
  Direccion;
  Descripcion;
  TipoLugar;
  WebsiteUrl;
  FechaCreacion;
  Telefono;
  Email;
  HorarioApertura;
  idPuntoMapa;
  idPropietario;
  dateCreate = Date.now() ;
 

  constructor(
    public alertController: AlertController,
    private geocodingService: GeocodingService,
    private clienteService: ClientService,
    private storage: Storage,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private http: HttpClient,
    private translateService: TranslateService,
  ) {
   
  }


  ngOnInit() {
    this.storage.create();
        

  }





  onSubmit(contactForm: NgForm) {

    this.clienteService.getLoggedUsuario().then(u => {
      this.usuario = u;
      console.log(this.usuario) 

      if (contactForm.valid) {
        
       // const email = this.usuario.Us_email;

       const email = contactForm.value;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.post('https://formspree.io/f/xgerlwqe',
          { name: this.usuario.Us_nombre, replyto: this.usuario.Us_email, message: email.messages },
          { 'headers': headers }).subscribe(
            response => {
              console.log(response);
            }
          );
      }
    })

    this.presentAlert();
    this.router.navigate(['/home']);


  }

  
  async presentAlert() {
    const alert = await this.alertController.create({
     
      
      message: 'Te contestamos cuanto antes posible!',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}

