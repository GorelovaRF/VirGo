import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Lugar, Usuario } from 'src/shared/client.model';
import { ClientService } from 'src/shared/client.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMap } from '@ionic-native/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage";
import { TranslateService } from '@ngx-translate/core';
//import { Location } from '@angular/common';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {





  location: Location
  public lugares: Lugar[];
  public lugar: Lugar;
  public token: string;
  public usuario: Usuario;


  element;
  idSeg;
  nivelOcup;

  emailsResgistrados: string[];
  listaReg: Usuario[];

  constructor(private clientService: ClientService,
    private translateService: TranslateService,
    private storage: Storage, private router: Router) {


    this.location = {
      latitude: 55.751244,
      longitude: 37.618423
    }

    this.clientService.getLocation().then(pos => {

      console.log(`Positon: ${pos.lng} ${pos.lat}`);
      this.location = {
        latitude: pos.lat,
        longitude: pos.lng

      }

    });
  }

  labelOptions = {
    color: '#FFFFFF',
  }




  ngOnInit() {


    this.storage.create();
    this.storage.get('token').then(token => { this.token = token; })

    this.clientService.getLoggedUsuario().then(u => {
      this.usuario = u;
    })



    this.clientService.getAllPlaces().subscribe(response => {
      this.lugares = response;


      // console.warn("son lugares",this.lugares); 

      this.lugares.forEach(element => {
        this.lugar = element;
        console.warn(element);
        this.clientService.getPlace(element.Id).subscribe(result => {
          this.lugar.PuntoMapa.Latitud = result.PuntoMapa.Latitud;
          this.lugar.PuntoMapa.Longitud = result.PuntoMapa.Longitud;

          this.clientService.postNivelSeguridad(result.Id).subscribe(res => {

            this.lugar.NivelSeguridad = res


          });

          this.clientService.postIdSegmentoHorario(result.Id).subscribe(res => {
            this.idSeg = res;
            if (this.idSeg != 0) {
              this.clientService.postNivelOcupacion(this.idSeg).subscribe(r => {
                element.DameSegmentoHorario.NivelOcupacion = r;
              })

            } else {
              element.DameSegmentoHorario.NivelOcupacion = "Cerado";
            }


          })
        })

      })
    });





  }

  mostrarDetalleLugar(id): void {
    this.router.navigate(['/business', id]);
  }





}








interface Location {

  latitude: number;
  longitude: number



}


