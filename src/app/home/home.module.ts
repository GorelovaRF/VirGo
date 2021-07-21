import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {MainmenuPageModule} from "../views/mainmenu/mainmenu.module";
import { AgmCoreModule } from '@agm/core';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        MainmenuPageModule, AgmCoreModule,
        
        AgmCoreModule.forRoot({
        apiKey: '',
        language: "en",
        libraries: ['places','geometry']
      })
    ],
  declarations: [HomePage]
})
export class HomePageModule {}
