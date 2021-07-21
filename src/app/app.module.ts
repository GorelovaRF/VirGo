import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import {Geolocation} from '@ionic-native/geolocation/ngx'
import {  GoogleMaps} from "@ionic-native/google-maps";
import { Marker,MarkerOptions } from "@ionic-native/google-maps";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LangPopoverPageModule } from './lang-popover/lang-popover.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
     IonicModule.forRoot(),
      AppRoutingModule,
      IonicStorageModule.forRoot(),
      HttpClientModule,
      FormsModule, 
      ReactiveFormsModule,
      HttpClientModule, 
      LangPopoverPageModule,
      TranslateModule.forRoot({ 
        loader: { 
          provide: TranslateLoader, 
          useFactory: (createTranslateLoader), 
          deps: [HttpClient] 
        } 
      }),
      
    AgmCoreModule.forRoot({
      apiKey: '',
      libraries: ["places","geometry"]
    })],
  providers: [ 
    Geolocation,
    GoogleMaps,
     { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  
  
})
export class AppModule {}
