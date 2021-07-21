import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserInfoPageRoutingModule } from './user-info-routing.module';

import { UserInfoPage } from './user-info.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserInfoPageRoutingModule
    ],
    exports: [
        UserInfoPage
    ],
    declarations: [UserInfoPage]
})
export class UserInfoPageModule {}
