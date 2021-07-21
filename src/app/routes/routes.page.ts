import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/shared/client.service';
import { Storage  } from "@ionic/storage";
import { Lugar } from 'src/shared/client.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {

  location: Location
  lugar:Lugar;

  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  // parque simon bolivar
  origin = { lat: 55.751244, lng:  37.618423 };
  // Parque la 93
  destination = { lat: 55.759496962, lng:37.68416393 };



  constructor(private activateRoute:ActivatedRoute,
    private translateService: TranslateService,
    private clientService:ClientService,private storage:Storage, private router:Router) { 
    this.location = {
      latitude: 55.751244,
      longitude: 37.618423
  }
  }

  ngOnInit() {
    
  

    this.loadMap();
    this.storage.create();
    const id = this.activateRoute.snapshot.paramMap.get('id');
    this.clientService.getPlace(id).subscribe(
      (res:any)=>{
        this.lugar=res
        console.warn(this.lugar);
        this.destination = {lat: this.lugar.PuntoMapa.Latitud , lng: this.lugar.PuntoMapa.Longitud}
      console.warn("destino: ",this.destination)
      this.origin = {lat: this.location.latitude, lng:  this.location.longitude }
        console.warn("origen: ",this.origin)
        
      })


   



 
  
 this.clientService.getLocation().then(pos=>
{
  
   console.log(`Positon: ${pos.lng} ${pos.lat}`);
   this.location = {
     latitude: pos.lat,
     longitude:pos.lng

   }

});





  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    const indicatorsEle: HTMLElement = document.getElementById('indicators');
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.origin,
      zoom: 12
    });
  
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(indicatorsEle);
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      this.calculateRoute();
    });
  }


  private calculateRoute() {
    this.directionsService.route({
      origin: this.origin,
      destination: this.destination,
      provideRouteAlternatives: true,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
        console.warn("routes ",response.routes);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
    }


}



interface Location {

  latitude: number;
  longitude: number


  
}

