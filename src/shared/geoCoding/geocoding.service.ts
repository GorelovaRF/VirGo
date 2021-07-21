import { MapsAPILoader } from '@agm/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PuntoMapa } from '../client.model';




declare var google: any;


const httpOptionsCreate = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type':  'application/json'
  }) 
};

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private geocoder: any;


  

  constructor(private mapLoader: MapsAPILoader,
    
    ) { }

  private initGeocoder() {
    console.log('Init deocoder');
    this.geocoder = new google.maps.Geocoder();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return from(this.mapLoader.load())
        .pipe(
          tap(() => this.initGeocoder()),
          map(() => true)

        );
    }
    return of(true);
  }

  geocodeAddress(puntoMapa: FormControl): Observable<PuntoMapa> {
    console.log('Start geocoding!');
    return this.waitForMapsToLoad().pipe(
      // filter(loaded => loaded),
      switchMap(() => {
        return new Observable<PuntoMapa>(observer => {
          this.geocoder.geocode({'address': puntoMapa}, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              console.log('Geocoding complete!');
              observer.next({
                Latitud: results[0].geometry.location.lat(), 
                Longitud: results[0].geometry.location.lng()
              });
            } else {
                console.log('Error - ', results, ' & Status - ', status);
                observer.next({ Latitud: 0, Longitud: 0 });
            }
            observer.complete();
          });
        })        
      })
    )
  }

  }




