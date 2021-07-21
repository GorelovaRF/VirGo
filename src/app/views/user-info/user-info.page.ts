import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/shared/client.model';
import { ClientService } from 'src/shared/client.service';
import { Storage  } from "@ionic/storage";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
  public token: string;
  public usuario: Usuario;

  constructor(private clientService:ClientService,
    private translateService: TranslateService,
    private storage:Storage,private router:Router) { }

  ngOnInit() {
    this.storage.create();
    this.storage.get('token').then(token=>{this.token = token;})
    this.clientService.getLoggedUsuario().then(u=> {
      this.usuario = u;
    })
    
  }

}
